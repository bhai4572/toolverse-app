'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import type { SeoNavItem } from '@/lib/seo/workspace/seoNavConfig';
import { LIVE_MODULE_HIGHLIGHTS } from '@/lib/seo/workspace/seoNavConfig';
import { ModuleShell, Panel } from './ModuleShell';

export function LockedModule({ item }: { item: SeoNavItem }) {
  return (
    <ModuleShell
      title={item.label}
      purpose="This module is locked until real data integration is ready."
      honesty="We do not show demo graphs or fake Semrush-style market numbers here. Unlock happens when the feature uses real APIs or your own imported data."
    >
      <Panel>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" aria-hidden />
          </div>
          <div className="space-y-2 min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Coming soon — in development</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>{item.label}</strong> is locked for now so ToolVerse trust stays high. Yeh module tab tak nahi chalega jab tak
              real data (APIs / crawl / your verified imports) ready na ho. Fake market stats ya placeholder results show nahi karte.
            </p>
            <p className="text-xs text-slate-500">
              Classic free utilities under <Link href="/tools" className="text-brand-600 font-semibold hover:underline">/tools</Link> stay open.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="What is live right now">
        <p className="text-xs text-slate-500 mb-3">
          Use these modules today — they analyze URLs you fetch, ranks you enter, or data you paste (GSC / GA4 / lists).
        </p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {LIVE_MODULE_HIGHLIGHTS.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                <span className="truncate">{m.label}</span>
                <ArrowRight className="w-4 h-4 text-brand-600 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/workspace" className="inline-block mt-4 text-sm font-bold text-brand-600 hover:underline">
          ← Back to SEO Dashboard
        </Link>
      </Panel>
    </ModuleShell>
  );
}
