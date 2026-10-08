'use client';

import React from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';

export function DataHonestyBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/80 dark:bg-sky-950/40 px-3 py-2.5 text-xs text-sky-900 dark:text-sky-200">
      <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-600" />
      <div>{children}</div>
    </div>
  );
}

export function ModuleShell({
  title,
  purpose,
  honesty,
  toolHref,
  children,
}: {
  title: string;
  purpose: string;
  honesty: string;
  toolHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{purpose}</p>
        </div>
        {toolHref && (
          <Link href={toolHref} className="text-xs font-bold text-brand-600 hover:underline shrink-0">
            Open classic tool →
          </Link>
        )}
      </div>
      <DataHonestyBanner>{honesty}</DataHonestyBanner>
      {children}
    </div>
  );
}

export function StatCards({
  items,
}: {
  items: Array<{ label: string; value: string | number; tone?: 'default' | 'good' | 'warn' | 'bad' }>;
}) {
  const toneClass = {
    default: 'text-slate-900 dark:text-white',
    good: 'text-emerald-600',
    warn: 'text-amber-600',
    bad: 'text-red-600',
  };
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
          <div className="text-[10px] uppercase font-bold tracking-wide text-slate-500">{s.label}</div>
          <div className={`text-2xl font-black mt-1 ${toneClass[s.tone || 'default']}`}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

export function Panel({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-3">
      {(title || actions) && (
        <div className="flex items-center justify-between gap-2">
          {title ? <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2> : <span />}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function UrlForm({
  url,
  setUrl,
  onRun,
  loading,
  extra,
  buttonLabel = 'Run analysis',
}: {
  url: string;
  setUrl: (v: string) => void;
  onRun: () => void;
  loading?: boolean;
  extra?: React.ReactNode;
  buttonLabel?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/page"
        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-brand-500"
        onKeyDown={(e) => e.key === 'Enter' && onRun()}
      />
      {extra}
      <button
        type="button"
        onClick={onRun}
        disabled={loading}
        className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold disabled:opacity-50"
      >
        {loading ? 'Working…' : buttonLabel}
      </button>
    </div>
  );
}
