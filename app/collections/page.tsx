import React from 'react';
import { COLLECTIONS } from '@/lib/products/collectionsRegistry';
import { Sparkles, Layers, ArrowRight, Bookmark } from 'lucide-react';

export default function CollectionsHubPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Curated Software Collections
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">
          Hand-Curated <span className="text-indigo-400">Tool &amp; Product Stacks</span>
        </h1>
        <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
          Discover hand-picked collections of top AI tools, developer software, design suites, and privacy-first online utilities grouped by workflow.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                {col.items.length} Items Included
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                <a href={`/collections/${col.slug}`}>{col.title}</a>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">{col.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">By {col.authorName}</span>
              <a
                href={`/collections/${col.slug}`}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View Collection <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
