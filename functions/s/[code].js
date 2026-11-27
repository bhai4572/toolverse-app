/**
 * Production Cloudflare Pages Function: `/s/[code]`
 *
 * Resolves a short code from Cloudflare KV (`SHORT_LINKS_KV`) and redirects
 * to the validated HTTP/HTTPS destination with strict security & noindex headers.
 *
 * - Click analytics are DISABLED BY DEFAULT.
 * - Analytics only increment when `ENABLE_KV_CLICK_ANALYTICS=true` and run
 *   asynchronously via `context.waitUntil(...)` inside `try/catch` so redirects
 *   NEVER fail or slow down if KV write limits are reached.
 */

function htmlPage(title, heading, message, status) {
  const safeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${title} — ToolVerse</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 460px; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; text-align: center; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05); }
    h1 { font-size: 1.35rem; margin: 0 0 0.75rem; }
    p { font-size: 0.95rem; color: #475569; line-height: 1.5; margin: 0 0 1.5rem; }
    a { display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 0.65rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem; }
  </style>
</head>
<body>
  <main class="card">
    <h1>${heading}</h1>
    <p>${message}</p>
    <a href="/tools/url-shortener">Create a Short URL on ToolVerse</a>
  </main>
</body>
</html>`;

  return new Response(safeHtml, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'x-content-type-options': 'nosniff',
    },
  });
}

function isSafeRedirectDestination(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return false;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (
      !host ||
      !host.includes('.') ||
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
      return false;
    }
    const m172 = host.match(/^172\.(\d+)\.\d+\.\d+$/);
    if (m172) {
      const second = Number(m172[1]);
      if (second >= 16 && second <= 31) return false;
    }
    const normalizedHost = host.replace(/^www\./, '');
    if (normalizedHost === 'toolverse.baby' && (parsed.pathname === '/s' || parsed.pathname.startsWith('/s/'))) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();

  if (method !== 'GET' && method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' },
    });
  }

  const rawCode = typeof params?.code === 'string' ? params.code.trim() : '';
  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(rawCode)) {
    return htmlPage(
      'Invalid Short Link',
      'Invalid Short Link',
      'The short link code format is invalid. Check the URL and try again.',
      404
    );
  }

  const kv = env?.SHORT_LINKS_KV;
  if (!kv || typeof kv.get !== 'function') {
    return htmlPage(
      'Service Unavailable',
      'URL Shortener Unavailable',
      'Short link storage is not configured on this deployment yet.',
      503
    );
  }

  let record;
  try {
    const raw = await kv.get(`link:${rawCode.toLowerCase()}`);
    if (!raw) {
      return htmlPage(
        'Short Link Not Found',
        'Short Link Not Found',
        'This short link does not exist or may have been removed.',
        404
      );
    }
    record = JSON.parse(raw);
  } catch {
    return htmlPage(
      'Temporary Error',
      'Unable to Resolve Link',
      'We could not resolve this short link right now. Please try again shortly.',
      500
    );
  }

  if (record.expiresAt && Date.parse(record.expiresAt) <= Date.now()) {
    return htmlPage(
      'Short Link Expired',
      'This Short Link Has Expired',
      'The creator set an expiration date for this link and it is no longer active.',
      410
    );
  }

  if (!isSafeRedirectDestination(record.destinationUrl)) {
    return htmlPage(
      'Blocked Destination',
      'Destination Blocked',
      'This short link points to an invalid or unsafe destination URL.',
      400
    );
  }

  // Click analytics: DISABLED BY DEFAULT. Only writes when ENABLE_KV_CLICK_ANALYTICS=true.
  // Never blocks or fails the redirect if KV write fails or exceeds quota.
  const analyticsEnabled = String(env?.ENABLE_KV_CLICK_ANALYTICS || '').toLowerCase() === 'true';
  if (analyticsEnabled && method === 'GET' && typeof kv.put === 'function') {
    const updatePromise = (async () => {
      try {
        const updated = {
          ...record,
          clicks: (typeof record.clicks === 'number' ? record.clicks : 0) + 1,
          lastClickedAt: new Date().toISOString(),
        };
        let putOptions;
        if (record.expiresAt) {
          const remainingSec = Math.floor((Date.parse(record.expiresAt) - Date.now()) / 1000);
          if (remainingSec < 60) {
            // Skip analytics write rather than overwriting an expiring KV record without a TTL
            return;
          }
          putOptions = { expirationTtl: remainingSec };
        }
        await kv.put(`link:${rawCode.toLowerCase()}`, JSON.stringify(updated), putOptions);
      } catch {
        // Silently swallow analytics errors so redirects never fail
      }
    })();

    if (typeof context.waitUntil === 'function') {
      context.waitUntil(updatePromise);
    }
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: record.destinationUrl,
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
    },
  });
}

