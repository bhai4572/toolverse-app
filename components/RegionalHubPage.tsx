'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { getRegionHub, RegionCode, REGION_HUBS } from '@/lib/regions/hubs';

export function RegionalHubPage({ code }: { code: RegionCode }) {
  const hub = getRegionHub(code);
  if (!hub) return null;

  return (
    <div className="space-y-8 py-4 max-w-4xl">
      <Breadcrumb items={[{ label: hub.name }]} />
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
          {hub.flag} {hub.name}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {hub.name} tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {hub.answerFirst}
        </p>
      </header>

      <AdSlot slot="native" />

      <section className="space-y-3" aria-labelledby="region-tools-heading">
        <h2 id="region-tools-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          High-demand tools for {hub.name}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {hub.tools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/60 transition-colors"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600">{t.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.blurb}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Other regions</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(REGION_HUBS) as RegionCode[])
            .filter((c) => c !== code)
            .map((c) => (
              <Link
                key={c}
                href={`/${c}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
              >
                {REGION_HUBS[c].flag} {REGION_HUBS[c].name}
              </Link>
            ))}
          <Link href="/passport-photos" className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500">
            Passport photo sizes
          </Link>
        </div>
      </section>
    </div>
  );
}
