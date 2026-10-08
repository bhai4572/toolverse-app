'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Landmark } from 'lucide-react';
import { getAllCountries } from '@/lib/travel/countryRegistry';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';

const WORK_DESTINATIONS = ['AE', 'SA', 'GB', 'CA', 'DE', 'QA', 'OM', 'US'] as const;

export default function ImmigrationPage() {
  const countries = getAllCountries().filter((c) => WORK_DESTINATIONS.includes(c.iso2 as (typeof WORK_DESTINATIONS)[number]));

  return (
    <div className="space-y-10 py-4">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" /> Immigration
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Work &amp; visa intelligence
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Immigration-framed entry to visa rules, embassies, and work-travel jobs — same underlying country data, clearer product path than a single Travel dump.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        <Link href="/travel" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50">
          <h2 className="font-bold text-slate-900 dark:text-white">Visa checker</h2>
          <p className="text-xs text-slate-500 mt-1">Nationality → destination requirements</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">Open travel hub <ArrowRight className="w-3.5 h-3.5" /></span>
        </Link>
        <Link href="/travel/embassies" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50">
          <h2 className="font-bold text-slate-900 dark:text-white">Embassies</h2>
          <p className="text-xs text-slate-500 mt-1">Consular contacts &amp; directories</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">Directory <ArrowRight className="w-3.5 h-3.5" /></span>
        </Link>
        <Link href="/travel/jobs" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50">
          <h2 className="font-bold text-slate-900 dark:text-white">Jobs abroad</h2>
          <p className="text-xs text-slate-500 mt-1">Sponsored / overseas roles</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">Browse <ArrowRight className="w-3.5 h-3.5" /></span>
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular work destinations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {countries.map((c) => (
            <Link
              key={c.iso2}
              href={`/travel/PK/${c.iso2}`}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50"
            >
              <span className="text-xl">{c.flagEmoji}</span>
              <div className="font-bold text-sm mt-1 text-slate-900 dark:text-white">{c.commonName}</div>
              <div className="text-xs text-slate-500">Route &amp; visa notes</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-slate-900 border border-brand-200/60 dark:border-blue-800/40 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ready to plan your move?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Check visa rules for a destination, find the right embassy, or browse overseas roles — tools stay free and ungated.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/travel"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Open visa checker <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/travel/embassies"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-brand-500 transition-colors"
          >
            Embassy directory
          </Link>
          <Link
            href="/travel/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-brand-500 transition-colors"
          >
            Jobs abroad
          </Link>
        </div>
      </section>

      <UnderCtaAdBand variant="both" region="immigration-under-cta" />
    </div>
  );
}
