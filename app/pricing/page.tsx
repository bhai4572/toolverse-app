'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { FEATURE_FLAGS } from '@/lib/product/featureFlags';

export default function PricingPage() {
  const free = FEATURE_FLAGS.filter((f) => f.tier === 'free');
  const pro = FEATURE_FLAGS.filter((f) => f.tier === 'pro');

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Pricing</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Free tools. Pro SEO depth.
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Checkout is not live yet — this page is the honest Free vs Pro map while we ship the foundation. Ads keep Free alive; Pro will unlock crawl/rank/backlink depth and fewer ads.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Free</h2>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">$0</p>
          <p className="text-xs text-slate-500 mt-1">Ad-supported · no account required for core utilities</p>
          <ul className="mt-6 space-y-2.5">
            {free.map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{f.name}</span>
              </li>
            ))}
          </ul>
          <Link href="/tools" className="mt-8 inline-flex w-full justify-center py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold">
            Open Tools
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border-2 border-brand-600 bg-brand-50/40 dark:bg-brand-950/30 relative">
          <span className="absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-brand-600 text-white">Coming</span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Pro</h2>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
            $19–29<span className="text-base font-semibold text-slate-500">/mo</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Target range — Stripe Checkout later · Agency tier later</p>
          <ul className="mt-6 space-y-2.5">
            {pro.map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                {f.status === 'live' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Minus className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>
                  {f.name}
                  {f.status === 'coming' && <span className="text-amber-700 dark:text-amber-400 text-xs font-semibold"> · roadmap</span>}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/seo" className="mt-8 inline-flex w-full justify-center py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold">
            Explore SEO Suite
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        Full product plan lives in <code className="text-slate-700 dark:text-slate-300">docs/TOOLVERSE-PRODUCT-BLUEPRINT.md</code>.
      </p>
    </div>
  );
}
