/**
 * Cloudflare Pages Function — GET /api/news
 * Aggregates public RSS headlines (title, link, date, short snippet) and
 * caches at the edge. Links out to original publishers; no full-article copy.
 */

const FEEDS = [
  {
    id: 'bbc-world',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'world',
    region: 'global',
  },
  {
    id: 'bbc-uk',
    name: 'BBC UK',
    url: 'https://feeds.bbci.co.uk/news/uk/rss.xml',
    category: 'uk',
    region: 'uk',
  },
  {
    id: 'npr',
    name: 'NPR',
    url: 'https://feeds.npr.org/1001/rss.xml',
    category: 'us',
    region: 'us',
  },
  {
    id: 'bbc-tech',
    name: 'BBC Technology',
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    category: 'tech',
    region: 'global',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech',
    region: 'us',
  },
  {
    id: 'verge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    region: 'us',
  },
  {
    id: 'bbc-business',
    name: 'BBC Business',
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    category: 'finance',
    region: 'global',
  },
  {
    id: 'ign',
    name: 'IGN',
    url: 'https://www.ign.com/rss/articles/feed',
    category: 'gaming',
    region: 'us',
  },
];

const CACHE_TTL_SECONDS = 900; // 15 minutes
const FETCH_TIMEOUT_MS = 4500;
const PER_FEED_LIMIT = 12;

function decodeEntities(text) {
  return String(text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripTags(html) {
  return decodeEntities(String(html || '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function tagValue(block, tag) {
  const re = new RegExp(
    `<${tag}[^>]*>\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))\\s*</${tag}>`,
    'i'
  );
  const m = block.match(re);
  if (!m) return '';
  return decodeEntities((m[1] || m[2] || '').trim());
}

function linkValue(block) {
  const atom = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (atom) return atom[1].trim();
  return tagValue(block, 'link') || tagValue(block, 'guid');
}

function parseFeedItems(xml, feed) {
  const chunks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ||
    xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ||
    [];
  const items = [];
  for (const chunk of chunks.slice(0, PER_FEED_LIMIT)) {
    const title = stripTags(tagValue(chunk, 'title'));
    const link = linkValue(chunk);
    if (!title || !link || !/^https?:\/\//i.test(link)) continue;
    const rawSnippet =
      tagValue(chunk, 'description') ||
      tagValue(chunk, 'summary') ||
      tagValue(chunk, 'content:encoded') ||
      tagValue(chunk, 'content') ||
      '';
    const snippet = stripTags(rawSnippet).slice(0, 220);
    const publishedAt =
      tagValue(chunk, 'pubDate') ||
      tagValue(chunk, 'published') ||
      tagValue(chunk, 'updated') ||
      tagValue(chunk, 'dc:date') ||
      '';
    const ts = publishedAt ? Date.parse(publishedAt) : NaN;
    items.push({
      id: `${feed.id}-${hashId(link)}`,
      title,
      link,
      snippet: snippet || undefined,
      publishedAt: Number.isFinite(ts) ? new Date(ts).toISOString() : publishedAt || null,
      source: feed.name,
      sourceId: feed.id,
      category: feed.category,
      region: feed.region,
    });
  }
  return items;
}

function hashId(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

async function fetchOneFeed(feed) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'User-Agent': 'ToolVerseNewsBot/1.0 (+https://toolverse.baby/news)',
      },
    });
    if (!res.ok) return { feed: feed.id, ok: false, items: [], error: `HTTP ${res.status}` };
    const xml = await res.text();
    return { feed: feed.id, ok: true, items: parseFeedItems(xml, feed) };
  } catch (err) {
    return { feed: feed.id, ok: false, items: [], error: err?.message || 'fetch failed' };
  } finally {
    clearTimeout(timer);
  }
}

function filterItems(items, category) {
  if (!category || category === 'all') return items;
  if (category === 'us') {
    return items.filter((i) => i.region === 'us' || i.category === 'us');
  }
  if (category === 'uk') {
    return items.filter((i) => i.region === 'uk' || i.category === 'uk');
  }
  return items.filter((i) => i.category === category);
}

function jsonResponse(body, status = 200, cacheSeconds = CACHE_TTL_SECONDS) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=600`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const category = (url.searchParams.get('category') || 'all').toLowerCase();
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 60) || 60));

  const cacheKey = new Request(
    `https://toolverse.baby/api/news?category=${category}&limit=${limit}`,
    { method: 'GET' }
  );

  try {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;
  } catch {
    // ignore cache miss / unsupported
  }

  const results = await Promise.all(FEEDS.map(fetchOneFeed));
  const combined = [];
  const sources = [];
  for (const r of results) {
    sources.push({ id: r.feed, ok: r.ok, count: r.items.length, error: r.error || null });
    combined.push(...r.items);
  }

  const seen = new Set();
  const deduped = [];
  for (const item of combined) {
    const key = item.link.replace(/\/$/, '').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  deduped.sort((a, b) => {
    const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return tb - ta;
  });

  const filtered = filterItems(deduped, category).slice(0, limit);

  const response = jsonResponse({
    success: true,
    count: filtered.length,
    category,
    timestamp: new Date().toISOString(),
    cacheTtlSeconds: CACHE_TTL_SECONDS,
    notice:
      'Headlines and short snippets only. Full articles remain on the original publisher sites.',
    sources,
    feeds: FEEDS.map((f) => ({ id: f.id, name: f.name, category: f.category, region: f.region })),
    items: filtered,
  });

  try {
    context.waitUntil(caches.default.put(cacheKey, response.clone()));
  } catch {
    // cache optional
  }

  return response;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
