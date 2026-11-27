/**
 * Production Cloudflare Pages Function: `/api/shorten`
 *
 * - POST /api/shorten: Validates URL + optional UTM + optional custom alias/expiry,
 *   stores mapping in Cloudflare KV (`SHORT_LINKS_KV`), and returns a real ToolVerse short URL.
 * - GET /api/shorten?code=<code>: Returns link metadata and click count (analytics disabled by default).
 *
 * Infrastructure requirements:
 * - KV Namespace binding: `SHORT_LINKS_KV` (expected namespace: `TOOLVERSE_SHORT_LINKS`)
 * - Optional env var: `ENABLE_KV_CLICK_ANALYTICS=true` (disabled by default to protect KV Free Tier writes)
 * - Optional Rate Limiting binding: `SHORTEN_RATE_LIMITER` (Cloudflare Workers Rate Limiting API)
 *   plus lightweight in-isolate memory throttle fallback (zero KV writes).
 */

const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const MAX_URL_LENGTH = 2048;
const MAX_BODY_BYTES = 8192;
const ALLOWED_TTL_DAYS = new Set([0, 7, 30, 90, 365]);
const RESERVED_ALIASES = new Set([
  'admin',
  'api',
  'app',
  'blog',
  'category',
  'cv-maker',
  'login',
  'logout',
  'signup',
  'tools',
  'legal',
  'privacy',
  'terms',
  'about',
  'contact',
  'sitemap',
  'robots',
  'dashboard',
  's',
  'sw',
  'service-worker',
]);

// Lightweight per-isolate sliding window fallback (zero KV writes)
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const isolateRateMap = new Map();

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex, nofollow',
      ...extraHeaders,
    },
  });
}

function isPrivateOrLocalHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host || !host.includes('.')) return true;
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '0.0.0.0' ||
    host === '::' ||
    host === '::1' ||
    host.startsWith('127.') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    host.startsWith('169.254.') ||
    host.startsWith('fe80:') ||
    host.startsWith('fc') ||
    host.startsWith('fd')
  ) {
    return true;
  }

  const m172 = host.match(/^172\.(\d+)\.\d+\.\d+$/);
  if (m172) {
    const second = Number(m172[1]);
    if (second >= 16 && second <= 31) return true;
  }

  return false;
}

export function validateAndBuildDestination(rawUrl, utm = {}, requestOrigin = 'https://toolverse.baby') {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return { ok: false, error: 'Destination URL is required.' };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters.` };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: 'Invalid URL format. Include http:// or https://.' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http:// and https:// URLs are allowed.' };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: 'URLs with embedded credentials are not permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (isPrivateOrLocalHost(hostname)) {
    return { ok: false, error: 'Private, internal, and localhost URLs are not permitted.' };
  }

  let siteHost = 'toolverse.baby';
  try {
    siteHost = new URL(requestOrigin).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    // keep default
  }
  const normalizedHost = hostname.replace(/^www\./, '');
  if (
    (normalizedHost === siteHost || normalizedHost === 'toolverse.baby') &&
    (parsed.pathname === '/s' || parsed.pathname.startsWith('/s/'))
  ) {
    return { ok: false, error: 'Recursive short links pointing to /s/ are not allowed.' };
  }

  if (utm && typeof utm === 'object') {
    const pairs = [
      ['utm_source', utm.source],
      ['utm_medium', utm.medium],
      ['utm_campaign', utm.campaign],
      ['utm_term', utm.term],
      ['utm_content', utm.content],
    ];
    for (const [key, val] of pairs) {
      if (typeof val === 'string' && val.trim()) {
        parsed.searchParams.set(key, val.trim().slice(0, 120));
      }
    }
  }

  const finalUrl = parsed.toString();
  if (finalUrl.length > MAX_URL_LENGTH) {
    return { ok: false, error: `Final URL with UTM parameters exceeds ${MAX_URL_LENGTH} characters.` };
  }

  return { ok: true, url: finalUrl };
}

export function generateSecureShortCode(length = 7) {
  const maxByte = 256 - (256 % BASE62.length);
  const bytes = new Uint8Array(length * 2);
  let out = '';

  while (out.length < length) {
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length && out.length < length; i++) {
      if (bytes[i] < maxByte) {
        out += BASE62[bytes[i] % BASE62.length];
      }
    }
  }
  return out;
}

function getClientKey(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

async function checkRateLimit(request, env) {
  const clientKey = getClientKey(request);

  // 1. Prefer native Cloudflare Workers Rate Limiting binding when configured (zero KV writes)
  if (env?.SHORTEN_RATE_LIMITER && typeof env.SHORTEN_RATE_LIMITER.limit === 'function') {
    try {
      const outcome = await env.SHORTEN_RATE_LIMITER.limit({ key: `shorten:${clientKey}` });
      if (!outcome?.success) {
        return { allowed: false, retryAfterSec: 60 };
      }
      return { allowed: true };
    } catch {
      // Fail open to isolate limiter if binding errors
    }
  }

  // 2. Lightweight in-isolate memory fallback (zero KV writes)
  const now = Date.now();
  const timestamps = (isolateRateMap.get(clientKey) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000));
    isolateRateMap.set(clientKey, timestamps);
    return { allowed: false, retryAfterSec };
  }
  timestamps.push(now);
  isolateRateMap.set(clientKey, timestamps);

  // Opportunistic cleanup to keep memory bounded
  if (isolateRateMap.size > 2000) {
    for (const [k, list] of isolateRateMap.entries()) {
      const active = list.filter((ts) => now - ts < RATE_WINDOW_MS);
      if (active.length === 0) isolateRateMap.delete(k);
      else isolateRateMap.set(k, active);
    }
  }

  return { allowed: true };
}

export function __resetIsolateRateLimiterForTests() {
  isolateRateMap.clear();
}

function isAnalyticsEnabled(env) {
  return String(env?.ENABLE_KV_CLICK_ANALYTICS || '').toLowerCase() === 'true';
}

function resolvePublicOrigin(request, env) {
  const configured = typeof env?.NEXT_PUBLIC_SITE_URL === 'string' ? env.NEXT_PUBLIC_SITE_URL.trim() : '';
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, '');
  }
  try {
    return new URL(request.url).origin;
  } catch {
    return 'https://toolverse.baby';
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method !== 'POST' && method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  }

  const kv = env?.SHORT_LINKS_KV;
  if (!kv || typeof kv.get !== 'function' || typeof kv.put !== 'function') {
    return jsonResponse(
      {
        error:
          'URL shortener storage is not configured on this deployment yet. Configure the SHORT_LINKS_KV Cloudflare KV binding to enable short links.',
        code: 'KV_NOT_CONFIGURED',
      },
      503
    );
  }

  const analyticsEnabled = isAnalyticsEnabled(env);
  const publicOrigin = resolvePublicOrigin(request, env);

  // GET /api/shorten?code=<code> — read metadata & click count
  if (method === 'GET') {
    const reqUrl = new URL(request.url);
    const code = (reqUrl.searchParams.get('code') || '').trim();
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(code)) {
      return jsonResponse({ error: 'Invalid short code format.' }, 400);
    }

    try {
      const raw = await kv.get(`link:${code.toLowerCase()}`);
      if (!raw) {
        return jsonResponse({ error: 'Short link not found.' }, 404);
      }
      const record = JSON.parse(raw);
      if (record.expiresAt && Date.parse(record.expiresAt) <= Date.now()) {
        return jsonResponse({ error: 'This short link has expired.' }, 410);
      }

      return jsonResponse({
        id: record.code,
        code: record.code,
        alias: record.code,
        shortUrl: `${publicOrigin}/s/${record.code}`,
        originalUrl: record.destinationUrl,
        destinationUrl: record.destinationUrl,
        createdAt: record.createdAt,
        expiresAt: record.expiresAt ?? null,
        clicks: typeof record.clicks === 'number' ? record.clicks : 0,
        analyticsEnabled,
      });
    } catch {
      return jsonResponse({ error: 'Unable to retrieve short link right now.' }, 500);
    }
  }

  // POST /api/shorten — create a real short link in Cloudflare KV
  const rate = await checkRateLimit(request, env);
  if (!rate.allowed) {
    return jsonResponse(
      { error: 'Too many short-link requests. Please wait a moment and try again.' },
      429,
      { 'Retry-After': String(rate.retryAfterSec) }
    );
  }

  let rawBody = '';
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: 'Unable to read request body.' }, 400);
  }

  if (!rawBody || rawBody.length > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Request payload is empty or too large.' }, 400);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'Malformed JSON request body.' }, 400);
  }

  if (!body || typeof body !== 'object') {
    return jsonResponse({ error: 'Invalid request body.' }, 400);
  }

  const dest = validateAndBuildDestination(body.url, body.utm, publicOrigin);
  if (!dest.ok) {
    return jsonResponse({ error: dest.error }, 400);
  }

  const rawTtlDays = body.ttlDays === undefined || body.ttlDays === null ? 0 : Number(body.ttlDays);
  if (!Number.isInteger(rawTtlDays) || !ALLOWED_TTL_DAYS.has(rawTtlDays)) {
    return jsonResponse({ error: 'Invalid expiration option. Choose 0, 7, 30, 90, or 365 days.' }, 400);
  }

  const customAlias = typeof body.customAlias === 'string' ? body.customAlias.trim() : '';
  let code = '';

  try {
    if (customAlias) {
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)) {
        return jsonResponse(
          { error: 'Custom alias must be 3-30 letters, numbers, hyphens, or underscores.' },
          400
        );
      }
      if (RESERVED_ALIASES.has(customAlias.toLowerCase())) {
        return jsonResponse({ error: 'This alias is reserved and cannot be used.' }, 400);
      }

      const existing = await kv.get(`link:${customAlias.toLowerCase()}`);
      if (existing) {
        return jsonResponse({ error: 'This custom alias is already taken. Please choose another.' }, 409);
      }
      code = customAlias;
    } else {
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateSecureShortCode(7);
        if (RESERVED_ALIASES.has(candidate.toLowerCase())) continue;
        const existing = await kv.get(`link:${candidate.toLowerCase()}`);
        if (!existing) {
          code = candidate;
          break;
        }
      }
      if (!code) {
        return jsonResponse({ error: 'Could not allocate a unique short code. Please retry.' }, 503);
      }
    }

    const nowMs = Date.now();
    const createdAt = new Date(nowMs).toISOString();
    const expiresAt = rawTtlDays > 0 ? new Date(nowMs + rawTtlDays * 86400 * 1000).toISOString() : null;

    const storedRecord = {
      code,
      destinationUrl: dest.url,
      createdAt,
      expiresAt,
      clicks: 0,
    };

    const putOptions = rawTtlDays > 0 ? { expirationTtl: rawTtlDays * 86400 } : undefined;
    await kv.put(`link:${code.toLowerCase()}`, JSON.stringify(storedRecord), putOptions);

    return jsonResponse(
      {
        id: code,
        code,
        alias: code,
        shortUrl: `${publicOrigin}/s/${code}`,
        originalUrl: dest.url,
        destinationUrl: dest.url,
        createdAt,
        expiresAt,
        clicks: 0,
        analyticsEnabled,
      },
      201
    );
  } catch {
    return jsonResponse({ error: 'Unable to save short link right now. Please try again.' }, 500);
  }
}

