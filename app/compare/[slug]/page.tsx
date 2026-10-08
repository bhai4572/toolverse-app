import React from 'react';
import { getComparisonBySlug } from '@/lib/products/comparisonsRegistry';
import { getProductBySlug } from '@/lib/products/registry';
import { Check, ExternalLink, Sparkles, Trophy } from 'lucide-react';

interface ComparisonPageProps {
  params: { slug: string };
}

export default function SideBySideComparisonPage({ params }: ComparisonPageProps) {
  const comp = getComparisonBySlug(params.slug);

  if (!comp) {
    return (
      <div className="p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Comparison Page Not Found</h1>
        <p className="text-slate-500 font-medium text-sm">No benchmark comparison exists for this product pair yet.</p>
        <a href="/products" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Back to Products Directory
        </a>
      </div>
    );
  }

  const prodA = getProductBySlug(comp.productASlug);
  const prodB = getProductBySlug(comp.productBSlug);

  if (!prodA || !prodB) {
    return null;
  }

  return (
    <article className="space-y-10 max-w-5xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/products" className="hover:underline">Products</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{prodA.name} vs {prodB.name}</span>
      </nav>

      <header className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center sm:text-left">
        <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
          Side-by-Side Comparison Engine
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">{comp.title}</h1>
        <p className="text-slate-300 text-base max-w-3xl leading-relaxed">{comp.metaDescription}</p>
      </header>

      {/* Side-by-Side Product Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <img src={prodA.logoUrl} alt={prodA.name} className="w-12 h-12 rounded-xl object-cover border" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{prodA.name}</h2>
              <span className="text-xs text-slate-500">{prodA.pricingModel}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{prodA.tagline}</p>
          <a href={prodA.websiteUrl} target="_blank" rel="noopener noreferrer nofollow ugc" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
            Visit {prodA.name} Official Website <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <img src={prodB.logoUrl} alt={prodB.name} className="w-12 h-12 rounded-xl object-cover border" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{prodB.name}</h2>
              <span className="text-xs text-slate-500">{prodB.pricingModel}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{prodB.tagline}</p>
          <a href={prodB.websiteUrl} target="_blank" rel="noopener noreferrer nofollow ugc" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
            Visit {prodB.name} Official Website <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Expert Verdict */}
      <section className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
        <h2 className="text-lg font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" /> Summary Verdict
        </h2>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{comp.verdict}</p>
      </section>

      {/* Feature Comparison Table */}
      <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Feature Benchmark Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3">Feature</th>
                <th className="p-3">{prodA.name}</th>
                <th className="p-3">{prodB.name}</th>
                <th className="p-3">Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {comp.comparisonMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{row.feature}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.productAValue}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.productBValue}</td>
                  <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{row.winner || 'Tie'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
