/**
 * Serve prerendered HTML shells from ASSETS first (Cloudflare Pages).
 * Prefer /path/index.html written by scripts/prerender.mjs; SPA fallback on known
 * app roots; real 404.html for unknown paths (avoid homepage soft-404).
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // SEO / text assets must stay static (also excluded in public/_routes.json).
  // Never HTML-fallback these even if _routes include accidentally matches.
  // API Pages Functions must also pass through (no HTML shell / SPA fallback).
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/sitemap-tools.xml' ||
    pathname === '/sitemap-content.xml' ||
    pathname === '/sitemap-pages.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/llms.txt' ||
    pathname === '/ads.txt' ||
    pathname === '/404.html' ||
    pathname.startsWith('/api/')
  ) {
    return context.next();
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

  // Known SPA app roots: hydrate via index.html (client shows NotFound / tool-missing UI).
  // Unknown first segments: real HTTP 404 (no homepage soft-404).
  if (isKnownSpaPath(pathname)) {
    try {
      const spa = await context.env.ASSETS.fetch(new URL('/index.html', url.origin));
      if (spa.ok) {
        const headers = new Headers(spa.headers);
        headers.set('content-type', 'text/html; charset=utf-8');
        headers.set('cache-control', 'public, max-age=0, must-revalidate');
        return new Response(spa.body, { status: 200, headers });
      }
    } catch {
      // fall through
    }
  }

  try {
    const notFound = await context.env.ASSETS.fetch(new URL('/404.html', url.origin));
    if (notFound.ok) {
      const headers = new Headers(notFound.headers);
      headers.set('content-type', 'text/html; charset=utf-8');
      headers.set('x-toolverse-shell', '/404.html');
      headers.set('cache-control', 'public, max-age=0, must-revalidate');
      return new Response(notFound.body, { status: 404, headers });
    }
  } catch {
    // fall through
  }

  const response = await context.next();
  if (response.status !== 404) return response;

  return new Response('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

/** First path segments that belong to the React SPA (see src/App.tsx). */
function isKnownSpaPath(pathname) {
  const root = pathname.replace(/\/$/, '').split('/').filter(Boolean)[0];
  if (!root) return true;
  const known = new Set([
    'tools',
    'category',
    'blog',
    'legal',
    'jobs',
    'how-to',
    'products',
    'alternatives',
    'compare',
    'questions',
    'collections',
    'submit',
    'badges',
    'claim',
    'business',
    'business-qr',
    'b',
    'travel',
    'startups',
    'submit-startup',
    'guest-posts',
    'publishers',
    'become-a-publisher',
    'seo',
    'seo-suite',
    'seo-tools',
    'seo-dashboard',
    'workspace',
    'pricing',
    'study',
    'immigration',
    'cars',
    'us',
    'uk',
    'ca',
    'au',
    'passport-photos',
    'news',
    'sitemap',
    'site-map',
    'dashboard',
    'admin',
    'scratch',
    '404',
  ]);
  return known.has(root);
}
