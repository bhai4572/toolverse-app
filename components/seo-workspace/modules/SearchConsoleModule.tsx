'use client';

import React, { useState } from 'react';
import { ModuleShell } from '../ModuleShell';
import {
  parseGscCsv,
  BASELINE_GSC_AUDIT_CSV,
  GSC_CATEGORY_META,
  type GscParsedReport,
  type GscClassifiedRow,
  type GscQueryCategoryCode,
} from '@/lib/seo/importers/gscCsvParser';
import {
  getActiveProject,
  createTask,
  saveKeywords,
} from '@/lib/seo/workspace/workspaceStorage';
import {
  Search,
  UploadCloud,
  FileSpreadsheet,
  TrendingUp,
  MousePointerClick,
  Eye,
  Percent,
  Hash,
  Key,
  ShieldCheck,
  AlertTriangle,
  GitMerge,
  ClipboardPaste,
  ExternalLink,
} from 'lucide-react';

export function SearchConsoleModule() {
  const project = getActiveProject();
  const [report, setReport] = useState<GscParsedReport>(() => parseGscCsv(BASELINE_GSC_AUDIT_CSV));
  const [dataSourceLabel, setDataSourceLabel] = useState<string>(
    'Toolverse Phase 2–3 Baseline Audit Dataset (Upload or Paste Your Live GSC CSV Anytime)'
  );
  const [activeTab, setActiveTab] = useState<
    'all' | 'opportunities' | 'cannibalization' | 'paste' | 'connect'
  >('all');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | GscQueryCategoryCode>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [pasteBuffer, setPasteBuffer] = useState('');
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
        setDataSourceLabel(`Imported GSC File: ${file.name} (${parsed.rows.length} rows)`);
        setNotice(`Successfully imported and classified ${parsed.rows.length} queries from ${file.name}`);
        setTimeout(() => setNotice(''), 4500);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!pasteBuffer.trim()) return;
    const parsed = parseGscCsv(pasteBuffer);
    setReport(parsed);
    setDataSourceLabel(`Pasted GSC Table (${parsed.rows.length} rows)`);
    setActiveTab('all');
    setNotice(`Classified ${parsed.rows.length} pasted GSC rows across Categories A–G`);
    setTimeout(() => setNotice(''), 4500);
  };

  const handleCreateTaskForQuery = (row: GscClassifiedRow) => {
    createTask({
      projectId: project.id,
      title: `[${row.categoryCode}] Optimize "${row.query}" → ${row.canonicalTargetUrl}`,
      description: `${row.recommendedAction} (Current Pos: #${row.position}, Impressions: ${row.impressions}, CTR: ${row.ctr}%).`,
      severity: row.categoryCode === 'A' ? 'critical' : 'warning',
      status: 'open',
      findingRuleId: 'gsc_ctr_opportunity',
    });
    setNotice(`Remediation task created for "${row.query}"`);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleAddToKeywords = (row: GscClassifiedRow) => {
    const mappedIntent =
      row.searchIntent === 'tool'
        ? 'transactional'
        : row.searchIntent === 'irrelevant'
        ? 'informational'
        : row.searchIntent;

    saveKeywords([
      {
        id: `kw_gsc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projectId: project.id,
        keyword: row.query,
        intent: mappedIntent,
        tags: ['GSC', `Cat-${row.categoryCode}`],
        targetUrl: row.canonicalTargetUrl.startsWith('/') ? row.canonicalTargetUrl : row.page,
        monthlyVolume: row.impressions,
        provenance: 'measured',
        provenanceLabel: 'Google Search Console (Impressions)',
        createdAt: new Date().toISOString(),
      },
    ]);
    setNotice(`Added "${row.query}" (${row.canonicalTargetUrl}) to Keyword Workspace`);
    setTimeout(() => setNotice(''), 4000);
  };

  const filteredRows = (report?.rows || []).filter((r) => {
    const matchesCategory = categoryFilter === 'ALL' || r.categoryCode === categoryFilter;
    const matchesSearch =
      !searchFilter.trim() ||
      r.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.canonicalTargetUrl.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.matchedToolOrHub.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ModuleShell
      title="Google Search Console Intelligence & Keyword-to-URL Engine"
      purpose="Classify GSC queries into Categories A–G, map every search cluster to a single canonical URL, diagnose high-impression zero-click queries, and prevent keyword cannibalization."
      honesty="Displays your imported GSC CSV/TSV data or the audited Toolverse baseline keyword matrix. Never fabricates clicks or impressions."
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

      {/* Active Dataset Provenance Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold">Active Dataset:</span>
          <span className="text-slate-400">{dataSourceLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-600 text-white font-bold cursor-pointer hover:bg-brand-500 transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Upload GSC CSV
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 text-slate-200 hover:border-brand-400 font-bold"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste GSC Table
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
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
          A–G Query Intelligence &amp; URL Map ({report.rows.length})
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
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          High-CTR &amp; Zero-Click Alerts ({report.opportunities.length + report.zeroClickHighImpressions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cannibalization')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'cannibalization'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <GitMerge className="w-4 h-4 text-emerald-400" />
          De-Cannibalization &amp; Canonical Map ({report.cannibalizationAlerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'paste'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <ClipboardPaste className="w-4 h-4" />
          Paste Raw GSC Data
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
          OAuth &amp; Export Guide
        </button>
      </div>

      {/* KPI Cards */}
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

      {/* Category A–G Filter Pills */}
      {activeTab === 'all' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              categoryFilter === 'ALL'
                ? 'bg-brand-600 text-white border-brand-500'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Queries ({report.rows.length})
          </button>
          {(['A', 'B', 'C', 'D', 'E', 'F', 'G'] as GscQueryCategoryCode[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCategoryFilter(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                categoryFilter === code
                  ? GSC_CATEGORY_META[code].badgeClass
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={GSC_CATEGORY_META[code].description}
            >
              {GSC_CATEGORY_META[code].label} ({report.categorySummary[code] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Paste Raw GSC Table Panel */}
      {activeTab === 'paste' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Paste Google Search Console CSV or Tab-Separated Rows
          </h3>
          <p className="text-xs text-slate-500">
            Include a header row such as <code>Top queries,Page,Clicks,Impressions,CTR,Position</code> (or tab-separated columns copied from Google Sheets / Excel). Every query will be automatically classified into Categories A–G and mapped to its canonical Toolverse URL.
          </p>
          <textarea
            rows={8}
            value={pasteBuffer}
            onChange={(e) => setPasteBuffer(e.target.value)}
            placeholder={`Top queries,Page,Clicks,Impressions,CTR,Position\nfree seo dashboard,https://toolverse.baby/workspace,14,420,3.3%,6.4`}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono text-slate-900 dark:text-slate-100"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePasteImport}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
            >
              Classify &amp; Map Queries
            </button>
            <button
              type="button"
              onClick={() => {
                setReport(parseGscCsv(BASELINE_GSC_AUDIT_CSV));
                setDataSourceLabel('Toolverse Phase 2–3 Baseline Audit Dataset');
                setActiveTab('all');
              }}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-brand-400 text-xs font-bold"
            >
              Reset to Baseline Audit Dataset
            </button>
          </div>
        </div>
      )}

      {/* OAuth & Connect Guide */}
      {activeTab === 'connect' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Official Google Search Console Integration Guide
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ToolVerse supports both live Google API integration and instant CSV/TSV ingestion. We never store your Google credentials on third-party servers.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Method A: Instant CSV File Drop (Recommended)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                1. Open your <strong>Google Search Console</strong> property (<code>https://toolverse.baby</code>).<br />
                2. Navigate to <strong>Performance &gt; Search Results</strong>.<br />
                3. Click <strong>Export &gt; Download CSV</strong>.<br />
                4. Upload <code>Queries.csv</code> or <code>Pages.csv</code> using the <strong>Upload GSC CSV</strong> button above.
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
                3. Add <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to your environment configuration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* High Opportunity & Zero-Click Diagnosis Panel */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                High-Impression / Low-CTR Opportunities (Positions 2–20, Exclude Category G)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Queries where Toolverse already ranks in the top 20 with strong impressions, excluding accidental/irrelevant Category G terms.
              </p>
            </div>

            {report.opportunities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Query</th>
                      <th className="py-2.5 px-3">Cat</th>
                      <th className="py-2.5 px-3">Canonical Target</th>
                      <th className="py-2.5 px-3">Pos</th>
                      <th className="py-2.5 px-3">Impr.</th>
                      <th className="py-2.5 px-3">CTR</th>
                      <th className="py-2.5 px-3">Recommended Action</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {report.opportunities.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {row.query}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${GSC_CATEGORY_META[row.categoryCode].badgeClass}`}>
                            {row.categoryCode}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-brand-400">
                          {row.canonicalTargetUrl.startsWith('/') ? (
                            <a href={row.canonicalTargetUrl} className="hover:underline inline-flex items-center gap-1">
                              {row.canonicalTargetUrl} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            row.canonicalTargetUrl
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono">#{row.position}</td>
                        <td className="py-3 px-3">{row.impressions.toLocaleString()}</td>
                        <td className="py-3 px-3 text-amber-400 font-bold">{row.ctr}%</td>
                        <td className="py-3 px-3 text-slate-400 max-w-xs">{row.recommendedAction}</td>
                        <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleCreateTaskForQuery(row)}
                            className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-bold"
                          >
                            + Task
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToKeywords(row)}
                            className="px-2 py-1 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 font-bold"
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

          {/* High-Impression Zero-Click Diagnosis */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Zero-Click High-Impression Diagnosis (Intent vs. Accidental Relevance)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Distinguishes genuine CTR opportunities from accidental keyword impressions (such as Category G printer spooler queries).
              </p>
            </div>
            {report.zeroClickHighImpressions.length > 0 ? (
              <div className="space-y-2.5">
                {report.zeroClickHighImpressions.map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${GSC_CATEGORY_META[row.categoryCode].badgeClass}`}>
                          {row.categoryLabel}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{row.query}</span>
                        <span className="text-slate-400 font-mono">
                          ({row.impressions} impr · 0 clicks · Pos #{row.position})
                        </span>
                      </div>
                      <p className="text-slate-400">
                        <strong>Diagnosis:</strong> {row.zeroClickDiagnosis || row.recommendedAction}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-brand-400 shrink-0">
                      Target: {row.canonicalTargetUrl}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No zero-click queries in current dataset.</p>
            )}
          </div>
        </div>
      )}

      {/* De-Cannibalization & Canonical URL Mapping Matrix (Phase 3) */}
      {activeTab === 'cannibalization' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Keyword-to-URL Canonical Mapping &amp; Cannibalization Guardrails
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Every core keyword cluster is assigned exactly one primary canonical URL to prevent internal SERP competition.
            </p>
          </div>
          <div className="space-y-3">
            {report.cannibalizationAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Cluster: &ldquo;{alert.keywordCluster}&rdquo;
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-bold">
                    Primary Owner: {alert.primaryCanonicalUrl}
                  </span>
                </div>
                <p className="text-slate-400">
                  <strong>Previously Competing / Alias URLs:</strong> {alert.competingUrls.join(', ')}
                </p>
                <p className="text-emerald-400/90 font-medium">{alert.resolution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Classified Queries Table */}
      {activeTab === 'all' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Classified Search Queries &amp; Canonical URL Map ({filteredRows.length})
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by query, tool, or target URL..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 w-full sm:w-72"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[560px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr className="text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Search Query</th>
                  <th className="py-2.5 px-3">Category (A–G)</th>
                  <th className="py-2.5 px-3">Intent</th>
                  <th className="py-2.5 px-3">Canonical Target URL</th>
                  <th className="py-2.5 px-3">Clicks</th>
                  <th className="py-2.5 px-3">Impr.</th>
                  <th className="py-2.5 px-3">CTR</th>
                  <th className="py-2.5 px-3">Pos</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredRows.slice(0, 150).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 max-w-xs">
                      <div>{row.query}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {row.recommendedAction}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] font-bold ${GSC_CATEGORY_META[row.categoryCode].badgeClass}`}
                      >
                        {row.categoryLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-400">
                      {row.searchIntent}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-brand-400 whitespace-nowrap">
                      {row.canonicalTargetUrl.startsWith('/') ? (
                        <a
                          href={row.canonicalTargetUrl}
                          className="hover:underline inline-flex items-center gap-1"
                        >
                          {row.canonicalTargetUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500">{row.canonicalTargetUrl}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{row.clicks}</td>
                    <td className="py-2.5 px-3">{row.impressions.toLocaleString()}</td>
                    <td className="py-2.5 px-3">{row.ctr}%</td>
                    <td className="py-2.5 px-3 font-mono">#{row.position}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1">
                      {row.categoryCode !== 'G' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCreateTaskForQuery(row)}
                            className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[11px] font-bold"
                          >
                            + Task
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToKeywords(row)}
                            className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 text-[11px] font-bold"
                          >
                            + Track
                          </button>
                        </>
                      )}
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
