'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { CATEGORIES, TOOLS, searchTools, getToolsByCategory } from '@/lib/tools/registry';

export default function ToolsHubPage() {
  const [q, setQ] = useState('');
  const results = q.trim() ? searchTools(q) : [];

  return (
    <div className="space-y-10 py-4">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Tools hub</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Find the right tool fast
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          {TOOLS.length}+ utilities by category — PDF, image, SEO, jobs, writing, and more. Most file tools run in your browser.
        </p>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-brand-500"
          />
          {results.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-72 overflow-y-auto py-1">
              {results.slice(0, 12).map((t) => (
                <Link key={t.id} href={`/tools/${t.slug}`} className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium">
                  {t.canonicalName}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const count = getToolsByCategory(cat.slug).length;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600">{cat.name}</h2>
                <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">{count} tools</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cat.description}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-brand-600">
                Browse <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
