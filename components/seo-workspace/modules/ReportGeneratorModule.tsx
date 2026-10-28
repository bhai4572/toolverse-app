'use client';

import React from 'react';
import { ModuleShell } from '../ModuleShell';
import {
  getActiveProject,
  getLatestAuditRun,
  getTasks,
  getKeywords,
  getDashboardStats,
} from '@/lib/seo/workspace/workspaceStorage';
import {
  Printer,
  Download,
  ShieldCheck,
  Globe2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export function ReportGeneratorModule() {
  const project = getActiveProject();
  const latestAudit = getLatestAuditRun(project.id);
  const tasks = getTasks(project.id);
  const keywords = getKeywords(project.id);
  const stats = getDashboardStats();

  const openTasks = tasks.filter((t) => t.status !== 'resolved');
  const resolvedTasks = tasks.filter((t) => t.status === 'resolved');

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCsv = () => {
    const sanitize = (val: string) => {
      const trimmed = String(val).trim();
      if (/^[=+\-@\t\r]/.test(trimmed)) {
        return `"'${trimmed.replace(/"/g, '""')}"`;
      }
      return `"${trimmed.replace(/"/g, '""')}"`;
    };

    const lines = [
      'ToolVerse Executive SEO Report',
      `Project Name,${sanitize(project.name)}`,
      `Domain,${sanitize(project.domain)}`,
      `Target Country,${sanitize(project.targetCountry)}`,
      `Report Date,${new Date().toISOString()}`,
      '',
      'Metric,Value,Data Provenance',
      `Health Score,${latestAudit ? `${latestAudit.healthScore}/100` : 'N/A'},Directly Measured (Edge Crawler)`,
      `Crawled Pages,${latestAudit ? latestAudit.crawledPagesCount : 0},Directly Measured`,
      `Critical Issues,${latestAudit ? latestAudit.criticalCount : 0},Directly Measured`,
      `Warnings,${latestAudit ? latestAudit.warningCount : 0},Directly Measured`,
      `Passed Checks,${latestAudit ? latestAudit.passedCount : 0},Directly Measured`,
      `Open Tasks,${openTasks.length},User Workspace`,
      `Resolved Tasks,${resolvedTasks.length},User Workspace`,
      `Tracked Keywords,${keywords.length},User Workspace / GSC Import`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seo_executive_report_${project.name.replace(/[^a-z0-9]/gi, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ModuleShell
      title="Executive Reports & Audit Export"
      purpose="Generate comprehensive, unadulterated executive SEO reports combining technical crawl findings, remediation tasks, and organic performance."
      honesty="Every metric discloses its exact provenance. ToolVerse reports do not display synthetic market share or invented competitor rankings."
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm print:hidden">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Export Options
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Download executive CSV summary or print / save as branded PDF.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportSummaryCsv}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Executive Report Sheet */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-brand-500 mb-1">
              ToolVerse SEO Intelligence Platform
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Executive SEO Audit Report
            </h2>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                {project.name} ({project.domain})
              </span>
              <span>&bull;</span>
              <span>Scope: {project.scope}</span>
              <span>&bull;</span>
              <span>Target: {project.targetCountry}</span>
              <span>&bull;</span>
              <span>Generated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${
                project.verification.verified
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {project.verification.verified ? 'Verified Property' : 'Unverified Property'}
            </span>
          </div>
        </div>

        {/* Section 1: Technical Health Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            1. Technical Crawl & Site Health
          </h3>

          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Health Score</div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {latestAudit ? `${latestAudit.healthScore}/100` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Measured via ToolVerse formula
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Crawled Pages</div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {latestAudit ? latestAudit.crawledPagesCount : 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Pages within crawl scope</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-bold text-rose-500 uppercase">Critical Errors</div>
              <div className="text-3xl font-black text-rose-500 mt-1">
                {latestAudit ? latestAudit.criticalCount : 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Require immediate fix</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-bold text-amber-500 uppercase">Warnings</div>
              <div className="text-3xl font-black text-amber-500 mt-1">
                {latestAudit ? latestAudit.warningCount : 0}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Opportunities to optimize</div>
            </div>
          </div>
        </div>

        {/* Section 2: Priority Remediation Tasks */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            2. Priority Remediation Tasks ({openTasks.length} Open)
          </h3>

          {openTasks.length > 0 ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 font-bold uppercase text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Task</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Affected URL</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {openTasks.slice(0, 8).map((task) => (
                    <tr key={task.id}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </td>
                      <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-amber-400">
                        {task.severity}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                        {task.url || 'Site-wide'}
                      </td>
                      <td className="py-2.5 px-3 capitalize font-semibold">{task.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All remediation tasks for this project have been resolved!
            </div>
          )}
        </div>

        {/* Section 3: Targeted Keyword Strategy */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            3. Target Keyword Portfolio ({keywords.length} Saved)
          </h3>

          {keywords.length > 0 ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 font-bold uppercase text-[10px] text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Keyword</th>
                    <th className="py-2.5 px-3">Intent</th>
                    <th className="py-2.5 px-3">Tags</th>
                    <th className="py-2.5 px-3">Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {keywords.slice(0, 10).map((kw) => (
                    <tr key={kw.id}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {kw.keyword}
                      </td>
                      <td className="py-2.5 px-3 capitalize">{kw.intent}</td>
                      <td className="py-2.5 px-3 text-slate-400">{kw.tags.join(', ')}</td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500">
                        {kw.provenanceLabel || kw.provenance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No target keywords saved yet. Use the Keyword Research workspace to add priority targets.
            </p>
          )}
        </div>

        {/* Legal & Data Provenance Notice */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>Data Integrity Statement:</strong> All audit health scores, metadata observations, and directive evaluations presented in this report were directly measured by the ToolVerse Server Crawler Engine against public HTTP responses. Search metrics are ingested from authorized Google Search Console accounts without synthetic modifications. ToolVerse does not fabricate third-party ranking curves or synthetic search volume.
          </p>
        </div>
      </div>
    </ModuleShell>
  );
}
