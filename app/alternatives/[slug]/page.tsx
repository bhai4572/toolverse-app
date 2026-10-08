import React from 'react';
import { getAlternativeBySlug } from '@/lib/products/alternativesRegistry';
import { PRODUCTS } from '@/lib/products/registry';
import { TOOLS } from '@/lib/tools/registry';
import { ExternalLink, CheckCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface AlternativePageProps {
  params: { slug: string };
}

export default function AlternativeDetailPage({ params }: AlternativePageProps) {
  const alt = getAlternativeBySlug(params.slug);

  if (!alt) {
    return (
      <div className="p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Alternative Page Not Found</h1>
        <p className="text-slate-500">No verified alternative data exists for this requested query yet.</p>
        <a href="/alternatives" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Back to Alternatives Hub
        </a>
      </div>
    );
  }

  const alternatives = PRODUCTS.filter((p) => alt.topAlternativeSlugs.includes(p.slug));
  const relatedTools = TOOLS.filter((t) => alt.relatedToolverseToolSlugs.includes(t.slug));

  return (
    <article className="space-y-10 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/alternatives" className="hover:underline">Alternatives</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Alternative to {alt.targetProductName}</span>
      </nav>

      {/* Header */}
      <header className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full">
          {alt.targetProductCategory}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          Best <span className="text-indigo-600 dark:text-indigo-400">{alt.targetProductName}</span> Alternatives &amp; Competitors
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-3xl">{alt.summary}</p>
      </header>

      {/* What Target Product Does */}
      <section className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">What {alt.targetProductName} Does</h2>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{alt.targetProductDescription}</p>
        <div className="text-xs font-semibold text-slate-500 pt-1">
          Standard Pricing: <span className="text-slate-800 dark:text-slate-200">{alt.targetProductPricing}</span>
        </div>
      </section>

      {/* Key Selection Criteria */}
      <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">How We Evaluated {alt.targetProductName} Alternatives</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
          {alt.keySelectionCriteria.map((criterion, idx) => (
            <li key={idx} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Alternatives Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top Recommended Alternatives</h2>

        <div className="space-y-6">
          {alternatives.map((prod, rank) => (
            <div key={prod.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                    #{rank + 1}
                  </span>
                  <img src={prod.logoUrl} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <a href={`/products/${prod.slug}`} className="hover:text-indigo-600">{prod.name}</a>
                      {prod.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <p className="text-xs text-slate-500">{prod.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg">{prod.pricingModel}</span>
                  <a href={`/products/${prod.slug}`} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700">
                    View Full Profile &rarr;
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{prod.longDescription}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border rounded-xl space-y-1">
                  <strong className="text-emerald-900 dark:text-emerald-300">Pros vs {alt.targetProductName}:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300">
                    {prod.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border space-y-1">
                  <strong className="text-slate-900 dark:text-white">Pricing &amp; Plans:</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    {prod.pricingPlans.map((pl) => `${pl.name} (${pl.price})`).join(' &bull; ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Toolverse Utilities Cross-Linking */}
      {relatedTools.length > 0 && (
        <section className="p-6 bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Free Toolverse Online Utilities
          </div>
          <h2 className="text-xl font-extrabold">Instant Browser Utilities for {alt.targetProductName} Workflows</h2>
          <p className="text-xs text-slate-300">Process files, compress media, or generate assets locally in your browser memory:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedTools.map((t) => (
              <a key={t.slug} href={`/tools/${t.slug}`} className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all block">
                <h3 className="font-bold text-sm text-white">{t.canonicalName}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{t.shortDescription}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {alt.faqs.length > 0 && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {alt.faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border space-y-1 text-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{faq.question}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
