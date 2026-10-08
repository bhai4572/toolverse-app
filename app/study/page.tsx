'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getAllCountries } from '@/lib/travel/countryRegistry';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';

const STUDY_DESTINATIONS = ['GB', 'CA', 'AU', 'DE', 'US', 'MY', 'TR', 'AE'] as const;

export default function StudyAbroadPage() {
  const countries = getAllCountries().filter((c) => STUDY_DESTINATIONS.includes(c.iso2 as (typeof STUDY_DESTINATIONS)[number]));

  return (
    <div className="space-y-10 py-4">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" /> Study Abroad
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Study paths by destination
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Structured study-visa routes from our travel intelligence data (purpose: STUDY). University ranking database is not invented here — when we add real college data, it lands under this hub.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {countries.map((c) => (
          <Link
            key={c.iso2}
            href={`/travel/PK/${c.iso2}`}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
          >
            <div className="text-2xl mb-2">{c.flagEmoji}</div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">{c.commonName}</h2>
            <p className="text-xs text-slate-500 mt-1">Visa &amp; travel route from Pakistan → {c.commonName}</p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">
              Open route <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related tools</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/tools/gpa-calculator', label: 'GPA Calculator' },
            { href: '/tools/passport-photo-maker', label: 'Passport Photo' },
            { href: '/passport-photos', label: 'Passport size hub' },
            { href: '/tools/pdf-compress', label: 'Compress PDF' },
            { href: '/tools/pdf-merge', label: 'Merge application PDFs' },
            { href: '/travel/embassies', label: 'Embassy directory' },
            { href: '/immigration', label: 'Immigration hub' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-200">
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-slate-900 border border-brand-200/60 dark:border-blue-800/40 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ready to plan your study trip?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Open a destination route, prep application PDFs, or size a passport photo — every tool stays free with no signup wall.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/travel"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Check study visa routes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/tools/gpa-calculator"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-brand-500 transition-colors"
          >
            GPA calculator
          </Link>
          <Link
            href="/passport-photos"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-brand-500 transition-colors"
          >
            Passport photo sizes
          </Link>
        </div>
      </section>

      <UnderCtaAdBand variant="both" region="study-under-cta" />
    </div>
  );
}
