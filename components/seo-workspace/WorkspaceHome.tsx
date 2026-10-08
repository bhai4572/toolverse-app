'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats, getProject, setProject } from '@/lib/seo/workspace/workspaceStorage';
import { ModuleShell, Panel, StatCards, UrlForm } from './ModuleShell';
import { BarChart, LineChart, DonutScore } from './SimpleChart';
import { ArrowRight } from 'lucide-react';

const QUICK = [
  { href: '/workspace/site-audit', label: 'Site Audit', blurb: 'Fetch URL → health score' },
  { href: '/workspace/on-page-seo', label: 'On-Page Checker', blurb: 'Meta, headings, alt' },
  { href: '/workspace/site-performance', label: 'Site Performance', blurb: 'CWV-style estimates' },
  { href: '/workspace/position-tracking', label: 'Position Tracking', blurb: 'Log your ranks' },
  { href: '/workspace/traffic-analytics/overview', label: 'Traffic Analytics', blurb: 'Paste GA4 / CSV' },
  { href: '/workspace/reports/export', label: 'Export Report', blurb: 'HTML / PDF of last audit' },
];

export function WorkspaceHome() {
  const [stats, setStats] = useState(() => getDashboardStats());
  const [url, setUrl] = useState(() => getProject().primaryUrl || '');

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  const saveProject = () => {
    setProject({ primaryUrl: url, name: getProject().name || 'My site' });
    setStats(getDashboardStats());
  };

  return (
    <ModuleShell
      title="SEO Dashboard"
      purpose="Semrush-style workspace — free forever for now. Charts and stats come from audits and jobs you run in this browser."
      honesty="No fake global traffic or competitor market share. Locked nav items stay visible but show Coming soon until real data is ready."
    >
      <Panel title="Primary project URL">
        <UrlForm url={url} setUrl={setUrl} onRun={saveProject} buttonLabel="Save project" />
      </Panel>

      <StatCards
        items={[
          { label: 'Audits', value: stats.auditCount },
          { label: 'Avg score', value: stats.avgScore || '—', tone: stats.avgScore >= 70 ? 'good' : 'warn' },
          { label: 'Tracked KWs', value: stats.keywordCount },
          { label: 'Job runs', value: stats.jobCount },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Health trend (your audits)">
          {stats.avgScore > 0 ? <DonutScore score={stats.avgScore} /> : <p className="text-xs text-slate-500">Run Site Audit to see scores.</p>}
          <LineChart data={stats.scoreHistory} />
        </Panel>
        <Panel title="Recent job mix">
          <BarChart
            data={stats.recentJobs.slice(0, 6).map((j) => ({ label: j.label.slice(0, 8), value: Math.round(j.score) }))}
            emptyLabel="Run any module to populate."
          />
        </Panel>
        <Panel title="Rank log sample">
          <BarChart data={stats.keywordSeries} invert color="#d97706" emptyLabel="Add positions in Position Tracking." />
        </Panel>
      </div>

      <Panel title="Quick actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{q.label}</div>
                <div className="text-[11px] text-slate-500">{q.blurb}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-600 shrink-0" />
            </Link>
          ))}
        </div>
      </Panel>

      {stats.recentAudits.length > 0 && (
        <Panel title="Recent audits">
          <ul className="text-xs space-y-2">
            {stats.recentAudits.map((a) => (
              <li key={a.id} className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800 py-1.5">
                <span className="truncate">{a.url}</span>
                <span className="font-bold shrink-0">{a.score}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </ModuleShell>
  );
}
