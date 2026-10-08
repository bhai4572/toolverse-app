'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PASSPORT_PRESETS } from '@/lib/image/engine';

const HUB_LINKS = [
  { href: '/us', label: 'United States', preset: 'us-2x2' },
  { href: '/uk', label: 'United Kingdom', preset: 'uk-35x45' },
  { href: '/ca', label: 'Canada', preset: 'ca-50x70' },
  { href: '/au', label: 'Australia', preset: 'au-35x45' },
];

export default function PassportPhotosHubPage() {
  return (
    <div className="space-y-8 py-4 max-w-4xl">
      <Breadcrumb items={[{ label: 'Passport photo sizes' }]} />
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" /> Passport & visa photos
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Passport photo size hub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Crop a headshot to official US, UK, Canada, Australia, and EU/Schengen sizes in your browser with the Passport Photo Maker — then download a single image. Background and biometric rules still come from your government checklist.
        </p>
        <Link
          href="/tools/passport-photo-maker"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold"
        >
          Open Passport Photo Maker <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <section className="space-y-3" aria-labelledby="presets-heading">
        <h2 id="presets-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Size presets in the tool
        </h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {PASSPORT_PRESETS.map((p) => (
            <li
              key={p.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {p.widthPx} × {p.heightPx} px · ratio {p.aspect}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Regional tool hubs</h2>
        <div className="flex flex-wrap gap-2">
          {HUB_LINKS.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
            >
              {h.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
