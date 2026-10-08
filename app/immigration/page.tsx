'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Landmark } from 'lucide-react';
import { getAllCountries } from '@/lib/travel/countryRegistry';

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
    </div>
  );
}
