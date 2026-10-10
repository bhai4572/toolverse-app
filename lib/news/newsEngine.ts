export type NewsCategory = 'all' | 'us' | 'uk' | 'tech' | 'finance' | 'gaming' | 'world';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  snippet?: string;
  publishedAt: string | null;
  source: string;
  sourceId: string;
  category: string;
  region: string;
}

export interface NewsSourceStatus {
  id: string;
  ok: boolean;
  count: number;
  error: string | null;
}

export interface NewsFeedMeta {
  id: string;
  name: string;
  category: string;
  region: string;
}

export interface NewsApiResponse {
  success: boolean;
  count: number;
  category: string;
  timestamp: string;
  cacheTtlSeconds?: number;
  notice?: string;
  sources?: NewsSourceStatus[];
  feeds?: NewsFeedMeta[];
  items: NewsItem[];
  error?: string;
}

export const NEWS_CATEGORIES: { id: NewsCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'us', label: 'US' },
  { id: 'uk', label: 'UK' },
  { id: 'tech', label: 'Tech' },
  { id: 'finance', label: 'Finance' },
  { id: 'gaming', label: 'Gaming' },
];

/** Client fetch — Cloudflare Pages Function at /api/news (edge-cached RSS). */
export async function fetchLiveNews(options: {
  category?: NewsCategory;
  limit?: number;
  signal?: AbortSignal;
} = {}): Promise<NewsApiResponse> {
  const category = options.category || 'all';
  const limit = options.limit ?? 60;
  const qs = new URLSearchParams({
    category,
    limit: String(limit),
  });

  const res = await fetch(`/api/news?${qs.toString()}`, {
    signal: options.signal,
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`News API returned ${res.status}`);
  }

  const data = (await res.json()) as NewsApiResponse;
  if (!data || !Array.isArray(data.items)) {
    throw new Error('Invalid news payload');
  }
  return data;
}

export function formatNewsDate(iso: string | null | undefined): string {
  if (!iso) return 'Recently';
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 'Recently';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(t));
  } catch {
    return iso.slice(0, 16);
  }
}
