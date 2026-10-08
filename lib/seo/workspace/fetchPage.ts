/**
 * Fetch a public URL via CORS-friendly proxies (best-effort).
 * Falls back gracefully — user can always paste HTML.
 */

export interface FetchedPage {
  url: string;
  html: string;
  finalUrl: string;
  fetchMs: number;
  byteLength: number;
  proxyUsed: string;
}

const PROXIES = [
  {
    name: 'allorigins',
    build: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'codetabs',
    build: (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  },
];

export function normalizeUrl(input: string): string {
  let u = input.trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    return parsed.href;
  } catch {
    return '';
  }
}

export async function fetchPageHtml(inputUrl: string, timeoutMs = 18000): Promise<FetchedPage> {
  const url = normalizeUrl(inputUrl);
  if (!url) throw new Error('Enter a valid URL (e.g. https://example.com)');

  let lastError: Error | null = null;
  for (const proxy of PROXIES) {
    const started = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(proxy.build(url), {
        signal: controller.signal,
        headers: { Accept: 'text/html,*/*' },
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Proxy ${proxy.name} returned ${res.status}`);
      const html = await res.text();
      if (!html || html.length < 40) throw new Error('Empty response from proxy');
      return {
        url,
        html,
        finalUrl: url,
        fetchMs: Math.round(performance.now() - started),
        byteLength: new Blob([html]).size,
        proxyUsed: proxy.name,
      };
    } catch (e) {
      clearTimeout(timer);
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError || new Error('Could not fetch URL (CORS / network). Paste HTML instead.');
}

export interface ClientPerfMetrics {
  fetchMs: number;
  htmlKb: number;
  scriptCount: number;
  stylesheetCount: number;
  imageCount: number;
  estimatedLcpMs: number;
  estimatedCls: number;
  estimatedFidMs: number;
  score: number;
  notes: string[];
}

export function estimatePerformance(html: string, fetchMs: number): ClientPerfMetrics {
  const scriptCount = (html.match(/<script\b/gi) || []).length;
  const stylesheetCount = (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
  const imageCount = (html.match(/<img\b/gi) || []).length;
  const htmlKb = Math.round(new Blob([html]).size / 1024);
  const estimatedLcpMs = Math.min(8000, Math.round(fetchMs * 1.4 + scriptCount * 90 + imageCount * 40 + htmlKb * 3));
  const estimatedCls = Number(Math.min(0.4, 0.02 + imageCount * 0.008 + (html.includes('width=') ? 0 : 0.05)).toFixed(3));
  const estimatedFidMs = Math.min(400, 40 + scriptCount * 8);
  const notes: string[] = [];
  if (htmlKb > 500) notes.push('HTML payload is large — consider server compression / fewer inline assets.');
  if (scriptCount > 25) notes.push('Many script tags — defer non-critical JS.');
  if (imageCount > 40) notes.push('Heavy image count — lazy-load below-fold images.');
  if (!/loading=["']lazy["']/i.test(html) && imageCount > 3) notes.push('No lazy-loading detected on images.');
  if (!/<link[^>]+rel=["']preconnect["']/i.test(html)) notes.push('No preconnect hints found.');

  let score = 100;
  if (estimatedLcpMs > 2500) score -= 25;
  else if (estimatedLcpMs > 1800) score -= 12;
  if (estimatedCls > 0.1) score -= 20;
  else if (estimatedCls > 0.05) score -= 8;
  if (estimatedFidMs > 100) score -= 15;
  if (htmlKb > 300) score -= 10;
  score = Math.max(10, Math.min(100, score));

  return {
    fetchMs,
    htmlKb,
    scriptCount,
    stylesheetCount,
    imageCount,
    estimatedLcpMs,
    estimatedCls,
    estimatedFidMs,
    score,
    notes,
  };
}

export interface ExtractedLink {
  href: string;
  text: string;
  rel: string;
  internal: boolean;
}

export function extractLinks(html: string, baseUrl: string): ExtractedLink[] {
  let origin = '';
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    origin = '';
  }
  const links: ExtractedLink[] = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').trim().slice(0, 80);
    const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith('#') || href.startsWith('javascript:')) continue;
    const relMatch = attrs.match(/rel=["']([^"']+)["']/i);
    const rel = relMatch ? relMatch[1] : '';
    let absolute = href;
    let internal = false;
    try {
      const resolved = new URL(href, baseUrl || undefined);
      absolute = resolved.href;
      internal = origin ? resolved.origin === origin : !/^https?:\/\//i.test(href);
    } catch {
      internal = !/^https?:\/\//i.test(href);
    }
    links.push({ href: absolute, text: text || absolute, rel, internal });
  }
  return links;
}
