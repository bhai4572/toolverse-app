import React from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Home } from 'lucide-react';
import { getPopularTools, CATEGORIES } from '@/lib/tools/registry';

/**
 * Useful 404 — popular tools + category hubs + search entry.
 * Soft-404 (serving homepage for unknown URLs) hurts crawl budget and rankings.
 */
export default function NotFoundPage() {
  const popular = getPopularTools().filter((t) => t.status === 'live').slice(0, 9);

  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-14 space-y-10">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">404 — page not found</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          That page isn’t here
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
          The link may be outdated, mistyped, or removed. Try search or jump to a popular free tool below —
          most run privately in your browser.
        </p>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:border-brand-400"
          >
            <Search className="w-4 h-4" /> Browse all tools
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popular.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 transition-colors"
            >
              <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 flex items-center justify-between gap-2">
                <span>{tool.canonicalName}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tool.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Browse by category</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-400 hover:text-brand-700"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Or open the{' '}
          <Link href="/sitemap" className="text-brand-600 font-medium hover:underline">
            HTML sitemap
          </Link>{' '}
          /{' '}
          <Link href="/blog" className="text-brand-600 font-medium hover:underline">
            guides
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
