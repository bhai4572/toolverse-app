/**
 * Cloudflare Pages: _redirects /* → /index.html 200 runs BEFORE static assets,
 * which overwrote prerendered route HTML. SPA fallback lives here instead:
 * serve the asset when it exists; only fall back to index.html on 404.
 */
interface Env {
  ASSETS: Fetcher;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const response = await context.next();
  if (response.status !== 404) {
    return response;
  }

  const url = new URL(context.request.url);
  // Missing real files (js/css/images/xml) should stay 404
  if (/\.[a-zA-Z0-9]{1,8}$/.test(url.pathname)) {
    return response;
  }

  return context.env.ASSETS.fetch(new URL('/index.html', url.origin), context.request);
};
