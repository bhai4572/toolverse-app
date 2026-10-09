'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import { listStudyDestinations } from '@/lib/study/destinations';

export default function StudyAbroadPage() {
  const destinations = listStudyDestinations();

  return (
    <div className="space-y-10 py-4">
      <Breadcrumb items={[{ label: 'Study Abroad' }]} />

      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" /> Study Abroad
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Study abroad by destination
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Answer-first guides for how admissions, documents, fee bands, and student visas work in Tier-1 markets — with links to official portals (UCAS, Common App, IRCC, Home Office, and more). We do not invent a 20,000-school rankings database; verify tuition and visa rules on government and university sites.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-labelledby="dest-heading">
        <h2 id="dest-heading" className="sr-only">
          Destinations
        </h2>
        {destinations.map((d) => (
          <Link
            key={d.slug}
            href={`/study/${d.slug}`}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
          >
            <div className="text-2xl mb-2">{d.flag}</div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Study in {d.name}</h2>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.answerFirst}</p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">
              Open guide <ArrowRight className="w-3.5 h-3.5" />
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
            { href: '/tools/word-counter', label: 'Word counter' },
            { href: '/travel/embassies', label: 'Embassy directory' },
            { href: '/immigration', label: 'Immigration hub' },
            { href: '/travel', label: 'Visa routes' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-slate-900 border border-brand-200/60 dark:border-blue-800/40 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ready to prep your application pack?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Size a passport photo, merge transcripts into one PDF, or check a study-visa travel route — tools stay free with no signup wall.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/study/usa"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-colors"
          >
            Start with USA guide <ArrowRight className="w-3.5 h-3.5" />
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
