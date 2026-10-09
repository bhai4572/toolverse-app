'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, GraduationCap } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import { StudyDestination, listStudyDestinations } from '@/lib/study/destinations';

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-brand-600 hover:underline font-semibold"
    >
      {children}
      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden />
    </a>
  );
}

export function StudyDestinationPage({ dest }: { dest: StudyDestination }) {
  const others = listStudyDestinations().filter((d) => d.slug !== dest.slug);

  return (
    <article className="space-y-10 py-4 max-w-3xl">
      <Breadcrumb
        items={[
          { label: 'Study Abroad', href: '/study' },
          { label: dest.name },
        ]}
      />

      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          {dest.flag} Study in {dest.name}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Study in {dest.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {dest.answerFirst}
        </p>
      </header>

      <section className="space-y-2" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Overview
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{dest.overview}</p>
      </section>

      <section className="space-y-3" aria-labelledby="pathways-heading">
        <h2 id="pathways-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Admission pathways
        </h2>
        <div className="space-y-3">
          {dest.pathways.map((p) => (
            <div key={p.title} className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        {dest.portals.length > 0 && (
          <ul className="mt-2 space-y-1.5 text-sm">
            {dest.portals.map((l) => (
              <li key={l.href + l.label}>
                {l.external || l.href.startsWith('http') ? (
                  <ExtLink href={l.href}>{l.label}</ExtLink>
                ) : (
                  <Link href={l.href} className="text-brand-600 hover:underline font-semibold">
                    {l.label}
                  </Link>
                )}
                {l.note ? <span className="text-slate-500"> — {l.note}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="docs-heading">
        <h2 id="docs-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Typical documents checklist
        </h2>
        <p className="text-xs text-slate-500">
          Exact lists vary by school and consulate. Use this as a prep checklist, then match the official invitation / visa guide.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          {dest.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="fees-heading">
        <h2 id="fees-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Fees &amp; cost ranges
        </h2>
        <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed rounded-xl border border-amber-200/80 dark:border-amber-800/50 bg-amber-50/80 dark:bg-amber-950/30 px-3 py-2">
          {dest.feeYearNote}
        </p>
        <dl className="space-y-3">
          {dest.feeRanges.map((f) => (
            <div key={f.label}>
              <dt className="text-sm font-bold text-slate-900 dark:text-white">{f.label}</dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{f.range}</span>
                {f.note ? <span className="block text-xs text-slate-500 mt-0.5">{f.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-3" aria-labelledby="visa-heading">
        <h2 id="visa-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Visa / study permit overview
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{dest.visaSummary}</p>
        <ul className="space-y-1.5 text-sm">
          {dest.officialLinks.map((l) => (
            <li key={l.href}>
              <ExtLink href={l.href}>{l.label}</ExtLink>
              {l.note ? <span className="text-slate-500"> — {l.note}</span> : null}
            </li>
          ))}
        </ul>
        {(dest.travelHref || dest.regionHubHref) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {dest.travelHref && (
              <Link
                href={dest.travelHref}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
              >
                Travel route notes <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {dest.regionHubHref && (
              <Link
                href={dest.regionHubHref}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
              >
                {dest.name} tools hub <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="fields-heading">
        <h2 id="fields-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Popular fields &amp; why students go
        </h2>
        <div className="space-y-3">
          {dest.fields.map((f) => (
            <div key={f.name}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {dest.faqs.map((faq) => (
            <div key={faq.question} className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Free ToolVerse tools for your application
        </h2>
        <div className="flex flex-wrap gap-2">
          {dest.tools.map((t) => (
            <Link
              key={t.href + t.label}
              href={t.href}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Other study destinations</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((d) => (
            <Link
              key={d.slug}
              href={`/study/${d.slug}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
            >
              {d.flag} {d.name}
            </Link>
          ))}
          <Link
            href="/study"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
          >
            All study hubs
          </Link>
        </div>
      </section>

      <UnderCtaAdBand variant="both" region={`study-${dest.slug}-under-cta`} />
    </article>
  );
}
