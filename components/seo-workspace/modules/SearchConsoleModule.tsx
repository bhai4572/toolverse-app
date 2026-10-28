'use client';

import React, { useState } from 'react';
import { ModuleShell } from '../ModuleShell';
import {
  parseGscCsv,
  type GscParsedReport,
} from '@/lib/seo/importers/gscCsvParser';
import {
  getActiveProject,
  createTask,
  saveKeywords,
} from '@/lib/seo/workspace/workspaceStorage';
import type { GscPerformanceRow } from '@/lib/seo/workspace/workspaceTypes';
import {
  Search,
  UploadCloud,
  FileSpreadsheet,
  TrendingUp,
  MousePointerClick,
  Eye,
  Percent,
  Hash,
  PlusCircle,
  Key,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export function SearchConsoleModule() {
  const project = getActiveProject();
  const [report, setReport] = useState<GscParsedReport | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'opportunities' | 'connect'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [notice, setNotice] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseGscCsv(text);
        setReport(parsed);
        setNotice(`Successfully imported ${parsed.rows.length} queries from ${file.name}`);
        setTimeout(() => setNotice(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleCreateTaskForQuery = (query: string, ctr: number, impressions: number) => {
    createTask({
      projectId: project.id,
      title: `Optimize CTR for query: "${query}"`,
      description: `Target query has ${impressions} impressions with low CTR (${ctr}%). Improve page title, meta description, and rich snippet markup.`,
      severity: 'warning',
      status: 'open',
      findingRuleId: 'gsc_ctr_opportunity',
    });
    setNotice(`Remediation task created for "${query}"`);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleAddToKeywords = (row: GscPerformanceRow) => {
    saveKeywords([
      {
        id: `kw_gsc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projectId: project.id,
        keyword: row.query,
        intent: 'informational',
        tags: ['GSC', 'Imported'],
        targetUrl: row.page,
        monthlyVolume: row.impressions,
        provenance: 'measured',
        provenanceLabel: 'Google Search Console (Impressions)',
        createdAt: new Date().toISOString(),
      },
    ]);
    setNotice(`Added "${row.query}" to Project Keyword Workspace`);
    setTimeout(() => setNotice(''), 4000);
  };

  const filteredRows = (report?.rows || []).filter((r) =>
    r.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <ModuleShell
      title="Google Search Console & Performance"
      purpose="Real search performance intelligence from official Google Search Console records (clicks, impressions, CTR, average position)."
      honesty="Requires your authorized GSC account credentials or official GSC CSV export. ToolVerse never invents fake search volume or artificial clicks."
    >
      {/* Top Banner Notice */}
      {notice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <span>{notice}</span>
          <a href="/workspace/tasks" className="underline hover:text-emerald-300">
            View Task Tracker &rarr;
          </a>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Search Performance ({report?.rows.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('opportunities')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'opportunities'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <SparklesIcon className="w-4 h-4 text-amber-400" />
          High CTR Opportunities ({report?.opportunities.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('connect')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'connect'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          OAuth & API Setup
        </button>
      </div>

      {activeTab === 'connect' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Official Google Search Console Integration Guide
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ToolVerse supports both live Google API integration and instant file ingestion. We never store your Google credentials on third-party servers.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Method A: Instant CSV File Drop (Recommended)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                1. Open your <strong>Google Search Console</strong> property.<br />
                2. Navigate to <strong>Performance &gt; Search Results</strong>.<br />
                3. Click <strong>Export &gt; Download CSV</strong>.<br />
                4. Drop the exported <code>Queries.csv</code> or <code>Pages.csv</code> in the import panel below.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Method B: Google Cloud OAuth 2.0 Credentials
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                To enable automated daily polling via Google Cloud:<br />
                1. Enable <strong>Google Search Console API</strong> in Google Cloud Console.<br />
                2. Create an OAuth 2.0 Client ID with scope <code>webmasters.readonly</code>.<br />
                3. Add <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to your <code>.env</code> file.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* CSV File Dropzone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-6 text-center shadow-sm space-y-3 hover:border-brand-500/50 transition-colors">
        <UploadCloud className="w-10 h-10 text-brand-500 mx-auto" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Import Official GSC Export CSV
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select or drag your <code>Queries.csv</code> or <code>Pages.csv</code> file exported from Google Search Console.
          </p>
        </div>
        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-bold cursor-pointer hover:bg-brand-500 transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Browse GSC CSV File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* KPI Cards */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Clicks</span>
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {report.totalClicks.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Impressions</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {report.totalImpressions.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Average CTR</span>
              <Percent className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {report.avgCtr}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Average Position</span>
              <Hash className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              #{report.avgPosition}
            </div>
          </div>
        </div>
      )}

      {/* High Opportunity Queries Panel */}
      {activeTab === 'opportunities' && report && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              High-Opportunity Search Queries
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              These queries rank on page 1 or 2 (Positions 3–20) with high impressions but low CTR (&lt;3.5%). Improving title tags and snippets for these pages delivers the fastest traffic gains.
            </p>
          </div>

          {report.opportunities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Query</th>
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Impressions</th>
                    <th className="py-2.5 px-3">CTR</th>
                    <th className="py-2.5 px-3">Clicks</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {report.opportunities.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {row.query}
                      </td>
                      <td className="py-3 px-3 font-mono">#{row.position}</td>
                      <td className="py-3 px-3">{row.impressions.toLocaleString()}</td>
                      <td className="py-3 px-3 text-amber-400 font-bold">{row.ctr}%</td>
                      <td className="py-3 px-3 text-emerald-400">{row.clicks}</td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCreateTaskForQuery(row.query, row.ctr, row.impressions)}
                          className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-bold"
                        >
                          + Create Task
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToKeywords(row)}
                          className="px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 font-bold"
                        >
                          + Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No low-CTR opportunities detected in this dataset.
            </p>
          )}
        </div>
      )}

      {/* Main Queries Table */}
      {activeTab === 'all' && report && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Query Performance ({filteredRows.length})
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter search queries..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr className="text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Search Query</th>
                  <th className="py-2.5 px-3">Clicks</th>
                  <th className="py-2.5 px-3">Impressions</th>
                  <th className="py-2.5 px-3">CTR</th>
                  <th className="py-2.5 px-3">Position</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredRows.slice(0, 100).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {row.query}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{row.clicks}</td>
                    <td className="py-2.5 px-3">{row.impressions.toLocaleString()}</td>
                    <td className="py-2.5 px-3">{row.ctr}%</td>
                    <td className="py-2.5 px-3 font-mono">#{row.position}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleAddToKeywords(row)}
                        className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 text-[11px] font-bold"
                      >
                        + Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  );
}
