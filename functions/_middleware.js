/**
 * Serve prerendered HTML shells from ASSETS first (Cloudflare Pages).
 * Prefer /path/index.html written by scripts/prerender.mjs; SPA fallback on 404.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Real static assets (js/css/img/xml) — do not HTML-fallback
  if (/\.[a-zA-Z0-9]{1,8}$/.test(pathname) && !pathname.endsWith('.html')) {
    return context.next();
  }

  const candidates =
    pathname === '/' || pathname === ''
      ? ['/index.html']
      : [`${pathname}/index.html`, `${pathname}.html`];

  for (const assetPath of candidates) {
    try {
      const res = await context.env.ASSETS.fetch(new URL(assetPath, url.origin));
      if (res.ok) {
        const headers = new Headers(res.headers);
        headers.set('content-type', 'text/html; charset=utf-8');
        headers.set('x-toolverse-shell', assetPath);
        headers.set('cache-control', 'public, max-age=0, must-revalidate');
        return new Response(res.body, { status: 200, headers });
      }
    } catch {
      // try next candidate
    }
  }

  const response = await context.next();
  if (response.status !== 404) return response;

  try {
    const spa = await context.env.ASSETS.fetch(new URL('/index.html', url.origin));
    if (spa.ok) return new Response(spa.body, { status: 200, headers: spa.headers });
  } catch {
    // fall through
  }
  return response;
}
