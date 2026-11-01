'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe2, Plus, Trash2, ArrowRight, Rocket, Search, ShieldCheck } from 'lucide-react';
import {
  createProject,
  deleteProject,
  getActiveProjectId,
  getProjects,
  getProjectSummary,
  setActiveProjectId,
  type ProjectSummary,
} from '@/lib/seo/workspace/workspaceStorage';
import type { Project } from '@/lib/seo/workspace/workspaceTypes';

export const PROJECTS_CHANGED_EVENT = 'tv-projects-changed';

export function notifyProjectsChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PROJECTS_CHANGED_EVENT));
}

/** Re-reads the project list whenever projects are created / deleted / switched. */
export function useProjects() {
  const [state, setState] = useState(() => ({ projects: getProjects(), activeId: getActiveProjectId() }));
  const refresh = useCallback(() => setState({ projects: getProjects(), activeId: getActiveProjectId() }), []);
  useEffect(() => {
    window.addEventListener(PROJECTS_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROJECTS_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);
  return { ...state, refresh };
}

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-brand-500';

export function NewProjectForm({ onCreated, compact }: { onCreated?: (p: Project) => void; compact?: boolean }) {
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Global');
  const [competitors, setCompetitors] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domain.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(clean)) {
      setError('Valid domain likho, jaise example.com');
      return;
    }
    const created = createProject({
      name: name.trim() || clean,
      domain: clean,
      targetCountry: country.trim() || 'Global',
      competitors: competitors
        .split(/[\s,\n]+/)
        .map((c) => c.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, ''))
        .filter(Boolean)
        .slice(0, 5),
    });
    setDomain('');
    setName('');
    setCompetitors('');
    setError('');
    notifyProjectsChanged();
    onCreated?.(created);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300" htmlFor="np-domain">
          Website domain *
        </label>
        <input id="np-domain" className={inputCls} placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
      </div>
      <div className={compact ? 'space-y-3' : 'grid sm:grid-cols-2 gap-3'}>
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300" htmlFor="np-name">
            Project name (optional)
          </label>
          <input id="np-name" className={inputCls} placeholder="My Store" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300" htmlFor="np-country">
            Target country
          </label>
          <input id="np-country" className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300" htmlFor="np-comp">
          Competitors (optional, comma separated, max 5)
        </label>
        <input id="np-comp" className={inputCls} placeholder="rival1.com, rival2.com" value={competitors} onChange={(e) => setCompetitors(e.target.value)} />
      </div>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold">
        <Plus className="w-4 h-4" /> Create project
      </button>
    </form>
  );
}

/** Shown instead of any module while the user has no project yet. */
export function ProjectOnboarding() {
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Rocket className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Apni pehli website add karo</h1>
        <p className="text-sm text-slate-500">
          Har website ek alag project hai, uska apna audit, keywords, tasks aur reports. Jitni chaho utni websites add kar sako ge.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <NewProjectForm />
      </div>
      <ol className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
        {[
          [Globe2, '1. Domain add karo', 'Sirf domain likho, baqi sab auto.'],
          [Search, '2. Site Audit chalao', 'Poori website crawl hoti hai, koi page limit nahi.'],
          [ShieldCheck, '3. Issues fix karo', 'Tasks banao aur report export karo.'],
        ].map(([Icon, t, d]) => {
          const I = Icon as React.ComponentType<{ className?: string }>;
          return (
            <li key={t as string} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white/60 dark:bg-slate-900/60">
              <I className="w-4 h-4 text-brand-600 mb-1" />
              <div className="font-bold text-slate-900 dark:text-white">{t as string}</div>
              <div>{d as string}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Semrush-style "Projects" grid with open / delete. */
export function ProjectsGrid() {
  const { projects, activeId, refresh } = useProjects();
  const [adding, setAdding] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, ProjectSummary>>({});

  useEffect(() => {
    setSummaries(Object.fromEntries(projects.map((p) => [p.id, getProjectSummary(p.id)])));
  }, [projects]);

  const open = (id: string) => {
    setActiveProjectId(id);
    notifyProjectsChanged();
  };

  const remove = (id: string) => {
    deleteProject(id);
    setConfirmId(null);
    notifyProjectsChanged();
    refresh();
  };

  return (
    <section className="space-y-3" aria-label="Projects">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Your projects ({projects.length})</h2>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5" /> New project
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <NewProjectForm onCreated={() => setAdding(false)} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {projects.map((p) => {
          const s = summaries[p.id];
          const isActive = p.id === activeId;
          return (
            <div
              key={p.id}
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-4 space-y-3 ${
                isActive ? 'border-brand-500 ring-1 ring-brand-500/30' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 dark:text-white truncate">{p.name}</div>
                  <div className="text-xs font-mono text-slate-500 truncate">{p.domain.replace(/^https?:\/\//i, '')}</div>
                </div>
                {isActive && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-600/15 text-brand-600">ACTIVE</span>}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  ['Health', s?.latestScore ?? '—'],
                  ['Pages', s?.pagesCrawled || '—'],
                  ['Critical', s?.latestScore == null ? '—' : s.criticalIssues],
                  ['Tasks', s?.openTasks ?? 0],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-lg bg-slate-50 dark:bg-slate-950 py-1.5">
                    <div className="text-sm font-black text-slate-900 dark:text-white">{v as React.ReactNode}</div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">{k as string}</div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-slate-500">
                {s?.latestAuditAt ? `Last audit: ${new Date(s.latestAuditAt).toLocaleString()}` : 'Abhi tak audit nahi hua'}
              </div>
              {confirmId === p.id ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-red-600 flex-1">Project aur uska saara data delete hoga?</span>
                  <button type="button" onClick={() => remove(p.id)} className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-bold">
                    Haan, delete
                  </button>
                  <button type="button" onClick={() => setConfirmId(null)} className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/workspace/site-audit"
                    onClick={() => open(p.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                  >
                    Open & audit <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {!isActive && (
                    <button type="button" onClick={() => open(p.id)} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold">
                      Select
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Delete ${p.name}`}
                    onClick={() => setConfirmId(p.id)}
                    className="p-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
