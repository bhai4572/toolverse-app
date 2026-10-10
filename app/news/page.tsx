'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Newspaper, RefreshCw } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageSidebarAds } from '@/components/ads/PageSidebarAds';
import { AdSlot } from '@/components/AdSlot';
import {
  NEWS_CATEGORIES,
  NewsCategory,
  NewsItem,
  fetchLiveNews,
  formatNewsDate,
} from '@/lib/news/newsEngine';

export default function NewsHubPage() {
  const [category, setCategory] = useState<NewsCategory>('all');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [sourceOkCount, setSourceOkCount] = useState(0);
  const [sourceTotal, setSourceTotal] = useState(0);

  const loadNews = useCallback(
    async (cat: NewsCategory) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchLiveNews({ category: cat, limit: 60 });
        setItems(data.items || []);
        setNotice(data.notice || '');
        const sources = data.sources || [];
        setSourceTotal(sources.length);
        setSourceOkCount(sources.filter((s) => s.ok).length);
        setLastRefreshed(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        setItems([]);
        setError(
          err instanceof Error
            ? err.message
            : 'Could not load live headlines. Try again in a moment.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadNews(category);
  }, [category, loadNews]);

  const main = (
    <div className="space-y-6 py-2">
      <Breadcrumb items={[{ label: 'News' }]} />

      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400 inline-flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" aria-hidden />
              Live headlines
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              ToolVerse News
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Auto-updating headlines from public RSS feeds (US, UK, tech, finance, gaming). We show
              title, source, date, and a short snippet — tap through to read the full story on the
              publisher&apos;s site.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadNews(category)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
            title="Refresh live RSS headlines"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden />
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {lastRefreshed && <span>Updated {lastRefreshed}</span>}
          {sourceTotal > 0 && (
            <>
              <span aria-hidden>•</span>
              <span>
                {sourceOkCount}/{sourceTotal} feeds online
              </span>
            </>
          )}
          {notice && (
            <>
              <span aria-hidden>•</span>
              <span className="text-slate-500 dark:text-slate-400">{notice}</span>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="News categories">
        {NEWS_CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.id)}
              className={
                active
                  ? 'px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'px-3.5 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500'
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[90px] flex items-center justify-center">
        <AdSlot slot="in-content" />
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          {error}
        </div>
      )}

      {isLoading && items.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">No headlines yet</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Feeds may be warming up after deploy. Hit Refresh in a few seconds.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              <li>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 hover:border-brand-500 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="text-brand-700 dark:text-brand-300">{item.source}</span>
                    <span aria-hidden>•</span>
                    <span>{formatNewsDate(item.publishedAt)}</span>
                    <span aria-hidden>•</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 leading-snug">
                    {item.title}
                  </h2>
                  {item.snippet && (
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    Read on {item.source}
                    <ExternalLink className="w-3 h-3" aria-hidden />
                  </span>
                </a>
              </li>
              {(idx + 1) % 8 === 0 && idx < items.length - 1 && (
                <li className="list-none py-2 min-h-[90px] flex items-center justify-center">
                  <AdSlot slot="in-content" />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">How this works</h2>
        <p>
          ToolVerse polls legitimate publisher RSS feeds on the edge (similar to how Jobs pulls live
          Remotive / Arbeitnow listings). Results are cached briefly so the page stays fast and
          respectful of source rate limits.
        </p>
        <p>
          We do not scrape paywalled pages or republish full articles. Headlines + short fair-use
          snippets only — always open the original link for the complete story.
        </p>
      </section>
    </div>
  );

  return <PageSidebarAds>{main}</PageSidebarAds>;
}
