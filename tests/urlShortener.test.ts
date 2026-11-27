import { describe, it, expect, beforeEach } from 'vitest';
import { onRequest as shortenHandler, __resetIsolateRateLimiterForTests } from '@/functions/api/shorten.js';
import { onRequest as redirectHandler } from '@/functions/s/[code].js';
import { onRequest as middlewareHandler } from '@/functions/_middleware.js';

function createMockKV() {
  const store = new Map<string, { value: string; expirationTtl?: number }>();
  return {
    store,
    putCalls: 0,
    shouldFailPut: false,
    async get(key: string) {
      return store.get(key)?.value ?? null;
    },
    async put(key: string, value: string, options?: { expirationTtl?: number }) {
      this.putCalls += 1;
      if (this.shouldFailPut) {
        throw new Error('Simulated KV write quota exceeded');
      }
      store.set(key, { value, expirationTtl: options?.expirationTtl });
    },
    async delete(key: string) {
      store.delete(key);
    },
  };
}

function makeShortenContext(
  body: unknown,
  options: {
    method?: string;
    url?: string;
    ip?: string;
    kv?: ReturnType<typeof createMockKV> | null;
    analytics?: string;
    rateLimiter?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
  } = {}
) {
  const method = options.method ?? 'POST';
  const reqUrl = options.url ?? 'https://toolverse.baby/api/shorten';
  const headers: Record<string, string> = {
    'cf-connecting-ip': options.ip ?? '203.0.113.10',
  };
  if (method === 'POST') {
    headers['content-type'] = 'application/json';
  }
  const init: RequestInit = { method, headers };
  if (method === 'POST') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const env: Record<string, unknown> = {
    NEXT_PUBLIC_SITE_URL: 'https://toolverse.baby',
  };
  if (options.kv !== null) {
    env.SHORT_LINKS_KV = options.kv;
  }
  if (options.analytics !== undefined) {
    env.ENABLE_KV_CLICK_ANALYTICS = options.analytics;
  }
  if (options.rateLimiter) {
    env.SHORTEN_RATE_LIMITER = options.rateLimiter;
  }
  return { request: new Request(reqUrl, init), env };
}

describe('ToolVerse Production URL Shortener (Cloudflare Pages Functions + KV)', () => {
  beforeEach(() => {
    __resetIsolateRateLimiterForTests();
  });

  it('1. Creates real short links in KV with unique cryptographically random codes and UTM params', async () => {
    const kv = createMockKV();
    const res1 = await shortenHandler(
      makeShortenContext(
        {
          url: 'https://example.com/article?ref=1',
          utm: { source: 'newsletter', medium: 'email', campaign: 'spring' },
        },
        { kv }
      )
    );
    expect(res1.status).toBe(201);
    const data1 = await res1.json();
    expect(data1.code).toMatch(/^[a-zA-Z0-9]{7}$/);
    expect(data1.shortUrl).toBe(`https://toolverse.baby/s/${data1.code}`);
    expect(data1.destinationUrl).toBe(
      'https://example.com/article?ref=1&utm_source=newsletter&utm_medium=email&utm_campaign=spring'
    );
    expect(data1.analyticsEnabled).toBe(false);

    const res2 = await shortenHandler(
      makeShortenContext({ url: 'https://example.com/article?ref=1' }, { kv })
    );
    expect(res2.status).toBe(201);
    const data2 = await res2.json();
    expect(data2.code).not.toBe(data1.code);
    expect(kv.store.size).toBe(2);
  });

  it('2. Supports custom aliases, blocks reserved routes, and returns 409 on alias collision', async () => {
    const kv = createMockKV();

    // Reserved alias rejected
    const reservedRes = await shortenHandler(
      makeShortenContext({ url: 'https://example.com', customAlias: 'admin' }, { kv })
    );
    expect(reservedRes.status).toBe(400);

    // Invalid alias characters rejected
    const badAliasRes = await shortenHandler(
      makeShortenContext({ url: 'https://example.com', customAlias: 'a!' }, { kv })
    );
    expect(badAliasRes.status).toBe(400);

    // Valid custom alias succeeds
    const okRes = await shortenHandler(
      makeShortenContext({ url: 'https://example.com/docs', customAlias: 'My-Docs_2026' }, { kv })
    );
    expect(okRes.status).toBe(201);
    const okData = await okRes.json();
    expect(okData.shortUrl).toBe('https://toolverse.baby/s/My-Docs_2026');

    // Case-insensitive collision returns 409
    const dupRes = await shortenHandler(
      makeShortenContext({ url: 'https://example.com/other', customAlias: 'my-docs_2026' }, { kv })
    );
    expect(dupRes.status).toBe(409);
  });

  it('3. Rejects unsafe schemes, private/localhost IPs, embedded credentials, and recursive short links', async () => {
    const kv = createMockKV();
    const badUrls = [
      '',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'file:///etc/passwd',
      'http://localhost:3000/secret',
      'http://127.0.0.1/admin',
      'http://192.168.1.1/router',
      'http://10.0.0.1/internal',
      'http://172.16.0.5/internal',
      'https://user:pass@example.com/private',
      'https://toolverse.baby/s/abc1234',
      'https://www.toolverse.baby/s/nested',
    ];

    for (const badUrl of badUrls) {
      const res = await shortenHandler(makeShortenContext({ url: badUrl }, { kv }));
      expect(res.status, `Expected 400 for ${badUrl}`).toBe(400);
    }
    expect(kv.store.size).toBe(0);
  });

  it('4. Performs actual 302 redirect with security headers and keeps analytics disabled by default', async () => {
    const kv = createMockKV();
    const createRes = await shortenHandler(
      makeShortenContext({ url: 'https://example.com/target', customAlias: 'launch26' }, { kv })
    );
    expect(createRes.status).toBe(201);
    const putsBeforeRedirect = kv.putCalls;

    const pending: Promise<unknown>[] = [];
    const redirRes = await redirectHandler({
      request: new Request('https://toolverse.baby/s/launch26', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv },
      params: { code: 'launch26' },
      waitUntil: (p: Promise<unknown>) => pending.push(p),
    });
    await Promise.all(pending);

    expect(redirRes.status).toBe(302);
    expect(redirRes.headers.get('location')).toBe('https://example.com/target');
    expect(redirRes.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(redirRes.headers.get('cache-control')).toBe('no-store');
    expect(redirRes.headers.get('referrer-policy')).toBe('no-referrer');
    // Analytics disabled by default -> zero extra KV writes on redirect
    expect(kv.putCalls).toBe(putsBeforeRedirect);
  });

  it('5. Increments clicks only when ENABLE_KV_CLICK_ANALYTICS=true and never fails redirect if KV write throws', async () => {
    const kv = createMockKV();
    await shortenHandler(
      makeShortenContext({ url: 'https://example.com/tracked', customAlias: 'trackme' }, { kv, analytics: 'true' })
    );

    const pending: Promise<unknown>[] = [];
    const res1 = await redirectHandler({
      request: new Request('https://toolverse.baby/s/trackme', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv, ENABLE_KV_CLICK_ANALYTICS: 'true' },
      params: { code: 'trackme' },
      waitUntil: (p: Promise<unknown>) => pending.push(p),
    });
    await Promise.all(pending);
    expect(res1.status).toBe(302);

    // Verify GET /api/shorten?code=trackme reports 1 click
    const statsRes = await shortenHandler(
      makeShortenContext(null, {
        method: 'GET',
        url: 'https://toolverse.baby/api/shorten?code=trackme',
        kv,
        analytics: 'true',
      })
    );
    expect(statsRes.status).toBe(200);
    const stats = await statsRes.json();
    expect(stats.clicks).toBe(1);
    expect(stats.analyticsEnabled).toBe(true);

    // Even if KV write throws (e.g. daily Free Tier quota exceeded), redirect MUST still succeed with 302
    kv.shouldFailPut = true;
    const pendingFail: Promise<unknown>[] = [];
    const res2 = await redirectHandler({
      request: new Request('https://toolverse.baby/s/trackme', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv, ENABLE_KV_CLICK_ANALYTICS: 'true' },
      params: { code: 'trackme' },
      waitUntil: (p: Promise<unknown>) => pendingFail.push(p),
    });
    await Promise.all(pendingFail);
    expect(res2.status).toBe(302);
    expect(res2.headers.get('location')).toBe('https://example.com/tracked');
  });

  it('6. Handles missing (404), invalid (404), and expired (410) links gracefully', async () => {
    const kv = createMockKV();

    const invalidRes = await redirectHandler({
      request: new Request('https://toolverse.baby/s/!!bad!!', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv },
      params: { code: '!!bad!!' },
    });
    expect(invalidRes.status).toBe(404);
    expect(invalidRes.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const missingRes = await redirectHandler({
      request: new Request('https://toolverse.baby/s/notfound1', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv },
      params: { code: 'notfound1' },
    });
    expect(missingRes.status).toBe(404);

    // Seed an expired link
    await kv.put(
      'link:expired1',
      JSON.stringify({
        code: 'expired1',
        destinationUrl: 'https://example.com/old',
        createdAt: '2025-01-01T00:00:00.000Z',
        expiresAt: '2025-01-02T00:00:00.000Z',
        clicks: 0,
      })
    );
    const expiredRes = await redirectHandler({
      request: new Request('https://toolverse.baby/s/expired1', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv },
      params: { code: 'expired1' },
    });
    expect(expiredRes.status).toBe(410);
  });

  it('7. Returns honest 503 when SHORT_LINKS_KV binding is missing (never fakes a short link)', async () => {
    const apiRes = await shortenHandler(
      makeShortenContext({ url: 'https://example.com' }, { kv: null })
    );
    expect(apiRes.status).toBe(503);
    const body = await apiRes.json();
    expect(body.code).toBe('KV_NOT_CONFIGURED');

    const redirRes = await redirectHandler({
      request: new Request('https://toolverse.baby/s/abc1234', { method: 'GET' }),
      env: {},
      params: { code: 'abc1234' },
    });
    expect(redirRes.status).toBe(503);
  });

  it('8. Enforces rate limiting without KV writes (supports Cloudflare Rate Limiting binding + isolate fallback)', async () => {
    const kv = createMockKV();

    // Test Cloudflare native rate-limiter binding returning { success: false }
    const boundRes = await shortenHandler(
      makeShortenContext(
        { url: 'https://example.com' },
        { kv, rateLimiter: { limit: async () => ({ success: false }) } }
      )
    );
    expect(boundRes.status).toBe(429);
    expect(boundRes.headers.get('retry-after')).toBeTruthy();
    expect(kv.putCalls).toBe(0);

    // Test isolate sliding-window fallback (20 allowed, 21st returns 429)
    for (let i = 0; i < 20; i++) {
      const r = await shortenHandler(
        makeShortenContext({ url: `https://example.com/p/${i}` }, { kv, ip: '198.51.100.77' })
      );
      expect(r.status).toBe(201);
    }
    const blocked = await shortenHandler(
      makeShortenContext({ url: 'https://example.com/p/21' }, { kv, ip: '198.51.100.77' })
    );
    expect(blocked.status).toBe(429);
  });

  it('9. Middleware passes /s/:code and /api/shorten through to Cloudflare Pages Functions', async () => {
    for (const target of ['https://toolverse.baby/s/launch26', 'https://toolverse.baby/api/shorten']) {
      let nextCalled = false;
      const res = await middlewareHandler({
        request: new Request(target, { method: 'GET' }),
        env: { ASSETS: { fetch: async () => new Response('HTML', { status: 200 }) } },
        next: async () => {
          nextCalled = true;
          return new Response('OK', { status: 200 });
        },
      });
      expect(nextCalled).toBe(true);
      expect(res.status).toBe(200);
    }
  });

  it('10. (C1) Skips analytics KV write when < 60s remain before expiry so TTL is never dropped, while redirect still works', async () => {
    const kv = createMockKV();
    const expiresIn30s = new Date(Date.now() + 30_000).toISOString();
    await kv.put(
      'link:exp30s',
      JSON.stringify({
        code: 'exp30s',
        destinationUrl: 'https://example.com/soon',
        createdAt: new Date().toISOString(),
        expiresAt: expiresIn30s,
        clicks: 0,
      }),
      { expirationTtl: 60 }
    );
    const putsBefore = kv.putCalls;

    const pending: Promise<unknown>[] = [];
    const res = await redirectHandler({
      request: new Request('https://toolverse.baby/s/exp30s', { method: 'GET' }),
      env: { SHORT_LINKS_KV: kv, ENABLE_KV_CLICK_ANALYTICS: 'true' },
      params: { code: 'exp30s' },
      waitUntil: (p: Promise<unknown>) => pending.push(p),
    });
    await Promise.all(pending);

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://example.com/soon');
    // Must skip analytics write so KV TTL is preserved
    expect(kv.putCalls).toBe(putsBefore);
    expect(kv.store.get('link:exp30s')?.expirationTtl).toBe(60);
  });

  it('11. (C2) Redirect-side validation blocks RFC1918 172.16.0.0/12 private IPs consistently with shorten.js', async () => {
    const kv = createMockKV();
    for (const [code, ip] of [
      ['priv172a', 'http://172.16.0.1/admin'],
      ['priv172b', 'http://172.31.255.254/internal'],
    ]) {
      await kv.put(
        `link:${code}`,
        JSON.stringify({
          code,
          destinationUrl: ip,
          createdAt: new Date().toISOString(),
          expiresAt: null,
          clicks: 0,
        })
      );
      const res = await redirectHandler({
        request: new Request(`https://toolverse.baby/s/${code}`, { method: 'GET' }),
        env: { SHORT_LINKS_KV: kv },
        params: { code },
      });
      expect(res.status, `Expected 400 for stored private IP ${ip}`).toBe(400);
    }
  });
});

