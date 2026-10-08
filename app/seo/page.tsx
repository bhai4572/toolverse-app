'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools/registry';
import { SEO_SUITE_GROUPS } from '@/lib/product/featureFlags';

export default function SeoSuitePage() {
  return (
    <div className="space-y-12 py-4">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white px-6 py-10 sm:px-12 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.35),_transparent_55%)] pointer-events-none" />
        <div className="relative max-w-2xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-300">SEO Suite</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Tool<span className="text-brand-400">Verse</span> SEO Software
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            ToolVerse SEO Suite is a free Semrush-style workspace with nested left nav for Site Audit, keywords, performance, and reports — plus classic free SEO utilities.
            Everything is free right now. Charts use your audits and imports — not fake market data. Incomplete modules stay locked until real integrations ship.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/workspace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold">
              Open SEO Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tools/seo-audit-analyzer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600 hover:border-brand-400 text-sm font-bold text-slate-100">
              Classic free audit
            </Link>
          </div>
        </div>
      </section>

      {SEO_SUITE_GROUPS.map((group) => (
        <section key={group.id} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{group.name}</h2>
            <p className="text-sm text-slate-500">{group.description}</p>
          </div>

          {group.id === 'workspace' && (
            <Link
              href="/workspace"
              className="block p-5 rounded-2xl border border-brand-500/40 bg-brand-50/50 dark:bg-brand-950/30 hover:border-brand-500 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Launch full workspace</h3>
                  <p className="text-xs text-slate-500 mt-1">Left sidebar · nested modules · local history · free</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-600" />
              </div>
            </Link>
          )}

          {group.tools.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.tools.map((item) => {
                const tool = getToolBySlug(item.slug);
                if (!tool) return null;
                return (
                  <Link
                    key={`${group.id}-${item.slug}`}
                    href={`/tools/${item.slug}`}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{tool.canonicalName}</h3>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Free
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{tool.shortDescription}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ))}

      <p className="text-xs text-slate-500">
        Also available: classic generators at{' '}
        <Link href="/seo-tools" className="text-brand-600 hover:underline">/seo-tools</Link>
        {' '}(meta, robots, FAQ schema, pitch templates).
      </p>
    </div>
  );
}
