'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Wrench, Globe2, GraduationCap, Landmark, ShieldCheck, Zap } from 'lucide-react';
import { TOOLS, CATEGORIES, getPopularTools, searchTools } from '@/lib/tools/registry';

const PATHS = [
  {
    href: '/tools',
    title: 'Tools',
    blurb: 'PDF, image, calculators, writing — category-first hub.',
    icon: Wrench,
  },
  {
    href: '/seo',
    title: 'SEO Suite',
    blurb: 'On-page, technical, keywords — free lite + Pro roadmap.',
    icon: Globe2,
  },
  {
    href: '/study',
    title: 'Study Abroad',
    blurb: 'Study-visa routes and destination paths.',
    icon: GraduationCap,
  },
  {
    href: '/immigration',
    title: 'Immigration',
    blurb: 'Work visas, embassies, jobs abroad.',
    icon: Landmark,
  },
] as const;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });
  const popularTools = getPopularTools().slice(0, 6);
  const searchResults = searchQuery.trim() ? searchTools(searchQuery) : [];

  return (
    <div className="space-y-14 py-2">
      {/* Hero — one composition: brand, headline, support, CTA, search */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.45),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.25),transparent_40%)]"
          aria-hidden
        />
        <div className="relative px-6 py-14 sm:px-12 sm:py-20 max-w-3xl space-y-6">
          <p className="text-sm font-bold tracking-tight text-white">
            Tool<span className="text-brand-400">Verse</span>
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Free tools. Real SEO suite. Clear paths.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Privacy-first utilities plus a growing SEO software module — pick Tools, SEO, Study, or Immigration. No one-screen dump.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-colors"
            >
              Browse tools <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/seo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/25 hover:border-white/50 text-white text-sm font-bold"
            >
              Open SEO Suite
            </Link>
          </div>
          <div className="relative max-w-md pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  if (value.trim()) url.searchParams.set('q', value);
                  else url.searchParams.delete('q');
                  window.history.replaceState({}, '', url.pathname + url.search);
                }
              }}
              placeholder="Search tools (pdf merge, keyword, tax…)"
              aria-label="Search tools"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 text-sm outline-none focus:border-brand-400"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto py-1 z-20 text-left">
                {searchResults.slice(0, 8).map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white">
                    {tool.canonicalName}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product paths — not card soup in hero; secondary section */}
      <section className="space-y-4" aria-labelledby="paths-heading">
        <h2 id="paths-heading" className="text-xl font-bold text-slate-900 dark:text-white">
          Where do you want to go?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/60 transition-colors"
            >
              <p.icon className="w-5 h-5 text-brand-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Browser privacy for file tools</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Client-side PDF/image tools process locally. Free tier is ad-supported — Pro will mean fewer ads + SEO depth.
            </p>
          </div>
        </div>
        <Link href="/pricing" className="text-xs font-bold text-brand-600 whitespace-nowrap hover:underline">
          Free vs Pro →
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular tools</h2>
            <p className="text-xs text-slate-500">{TOOLS.length}+ live · {CATEGORIES.length} categories</p>
          </div>
          <Link href="/tools" className="text-xs font-semibold text-brand-600 hover:underline">All categories</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand-600" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{tool.canonicalName}</h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{tool.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
