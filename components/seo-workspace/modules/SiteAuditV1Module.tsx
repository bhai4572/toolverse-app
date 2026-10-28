'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { SiteAuditReport, AuditFinding, CrawledPage, FindingSeverity } from '@/lib/seo/audit/crawlerEngine';
import { executeSiteAudit } from '@/lib/seo/audit/crawlerEngine';
import { validateTargetUrl } from '@/lib/seo/audit/ssrfGuard';
import {
  getProject,
  setProject,
  saveAudit,
  saveAuditRun,
  getActiveProject,
  createTask,
} from '@/lib/seo/workspace/workspaceStorage';
import { ModuleShell, Panel } from '../ModuleShell';
import {
  Globe,
  Search,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

const STORAGE_KEY_LAST_AUDIT = 'tv_site_audit_v1_last_report';

export function SiteAuditV1Module() {
  const [urlInput, setUrlInput] = useState(() => getProject().primaryUrl || '');
  const [maxPages, setMaxPages] = useState<number>(10);
  const [authorized, setAuthorized] = useState<boolean>(true);

  // States: 'idle' | 'running' | 'completed' | 'error'
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [progressText, setProgressText] = useState<string>('');
  const [pagesCrawledCount, setPagesCrawledCount] = useState<number>(0);
  const [pagesDiscoveredCount, setPagesDiscoveredCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [report, setReport] = useState<SiteAuditReport | null>(null);

  // Active view tab in completed report
  const [activeTab, setActiveTab] = useState<'findings' | 'pages' | 'overview'>('findings');

  // Findings Filters & Sort
  const [severityFilter, setSeverityFilter] = useState<'ALL' | FindingSeverity>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'severity' | 'name' | 'urls'>('severity');
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});

  // Restore last audit from localStorage on initial render if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_AUDIT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.auditId && parsed.findings) {
          setReport(parsed);
          setStatus('completed');
          if (parsed.targetUrl && !urlInput) {
            setUrlInput(parsed.targetUrl);
          }
        }
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const handleStartAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a website URL to audit (e.g. https://example.com).');
      return;
    }

    const validation = validateTargetUrl(trimmed);
    if (!validation.valid || !validation.sanitizedUrl) {
      setErrorMessage(validation.error || 'Invalid URL format or restricted address.');
      return;
    }

    if (!authorized) {
      setErrorMessage('You must confirm authorization to crawl this domain.');
      return;
    }

    setStatus('running');
    setProgressText('Initiating SSRF-guarded crawl session...');
    setPagesCrawledCount(0);
    setPagesDiscoveredCount(1);

    try {
      // 1. Try server endpoint first (/api/site-audit)
      let data: SiteAuditReport | null = null;

      try {
        const res = await fetch('/api/site-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: validation.sanitizedUrl,
            maxPages,
          }),
        });

        if (res.ok) {
          data = await res.json();
        } else {
          const errRes = await res.json().catch(() => ({}));
          throw new Error(errRes.error || `Server returned HTTP ${res.status}`);
        }
      } catch (serverErr: any) {
        // Fallback directly to client/browser engine if API endpoint is unavailable in certain environments
        setProgressText('Running browser-isolated crawl engine...');
        data = await executeSiteAudit(validation.sanitizedUrl, {
          maxPages,
          onProgress: (p) => {
            setPagesCrawledCount(p.crawled);
            setPagesDiscoveredCount(p.discovered);
            if (p.currentUrl) {
              setProgressText(`Crawling: ${p.currentUrl}`);
            }
          },
        });
      }

      if (!data) {
        throw new Error('Audit engine produced empty report.');
      }

      setReport(data);
      setStatus('completed');
      setProject({ primaryUrl: data.targetUrl });

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY_LAST_AUDIT, JSON.stringify(data));
      } catch {}

      // Save to ToolVerse workspace history
      saveAudit({
        url: data.targetUrl,
        score: data.summary.healthScore,
        errorCount: data.summary.totalErrors,
        warningCount: data.summary.totalWarnings,
        passedCount: data.summary.totalPassed,
        metrics: {
          titleLength: data.pages[0]?.titleLength || 0,
          titlePixels: Math.round((data.pages[0]?.titleLength || 0) * 9.5),
          descriptionLength: data.pages[0]?.descriptionLength || 0,
          h1Count: data.pages[0]?.h1List.length || 0,
          h2Count: data.pages[0]?.h2Count || 0,
          wordCount: data.pages[0]?.wordCount || 0,
          internalLinks: data.pages[0]?.internalLinks.length || 0,
          externalLinks: data.pages[0]?.externalLinks.length || 0,
          imagesCount: data.pages[0]?.imagesTotal || 0,
          imagesWithoutAlt: data.pages[0]?.imagesMissingAlt || 0,
          hasCanonical: Boolean(data.pages[0]?.canonicalUrl),
          hasRobots: Boolean(data.pages[0]?.robotsMeta || data.pages[0]?.xRobotsTag),
          hasOpenGraph: false,
        },
        issues: data.findings.map((f) => ({
          type: f.severity === 'error' ? 'error' : f.severity === 'warning' ? 'warning' : 'passed',
          category: 'Technical',
          title: f.title,
          description: f.explanation,
          recommendation: f.recommendation,
        })),
        moduleId: 'site-audit',
      });

      // Save deep audit run for Page Inspector & Executive Reports
      const activeProj = getActiveProject();
      saveAuditRun({
        id: data.auditId || `run_${Date.now()}`,
        projectId: activeProj.id,
        targetUrl: data.targetUrl,
        crawledPagesCount: data.summary.pagesCrawled,
        healthScore: data.summary.healthScore,
        criticalCount: data.summary.totalErrors,
        warningCount: data.summary.totalWarnings,
        infoCount: data.summary.totalInfo,
        passedCount: data.summary.totalPassed,
        pages: data.pages.map((p) => ({
          requestedUrl: p.requestedUrl,
          finalUrl: p.finalUrl,
          httpStatus: p.httpStatus,
          depth: p.depth,
          timingMs: p.fetchTimeMs,
          contentType: p.contentType,
          title: p.title,
          titleLength: p.titleLength,
          metaDescription: p.description,
          metaDescriptionLength: p.descriptionLength,
          h1: p.h1List,
          canonical: p.canonicalUrl || '',
          isCanonicalSelf: Boolean(p.canonicalUrl && p.canonicalUrl === p.finalUrl),
          robotsMeta: p.robotsMeta || p.xRobotsTag || '',
          isNoindex: p.isNoindex,
          isNofollow: p.isNofollow,
          wordCount: p.wordCount,
          isThinContent: p.isThinContent,
          inboundLinksCount: 0,
          outboundInternalCount: p.internalLinks.length,
          outboundExternalCount: p.externalLinks.length,
          imagesMissingAltCount: p.imagesMissingAlt,
          issuesCount: p.issues.length,
        })),
        findings: data.findings.map((f) => ({
          id: f.code,
          ruleId: f.code,
          ruleVersion: '1.0',
          category: 'indexability',
          severity: f.severity === 'error' ? 'critical' : f.severity === 'warning' ? 'warning' : 'info',
          title: f.title,
          explanation: f.explanation,
          recommendation: f.recommendation,
          affectedUrls: f.affectedUrls,
        })),
        internalLinks: data.pages.flatMap((p) =>
          p.internalLinks.map((l) => ({
            sourceUrl: p.finalUrl || p.requestedUrl,
            targetUrl: l.href,
            anchorText: l.text || '',
            isNofollow: l.isNofollow,
          }))
        ),
        at: data.timestamp,
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Audit encountered an unexpected error.');
    }
  };

  const toggleExpand = (code: string) => {
    setExpandedIssues((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Filtered and Sorted Findings
  const filteredFindings = useMemo(() => {
    if (!report) return [];
    return report.findings
      .filter((f) => {
        if (severityFilter !== 'ALL' && f.severity !== severityFilter) return false;
        if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;
        if (searchFilter) {
          const q = searchFilter.toLowerCase();
          const matchesTitle = f.title.toLowerCase().includes(q);
          const matchesCode = f.code.toLowerCase().includes(q);
          const matchesExp = f.explanation.toLowerCase().includes(q);
          const matchesUrl = f.affectedUrls.some((u) => u.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCode && !matchesExp && !matchesUrl) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'severity') {
          const order = { error: 0, warning: 1, info: 2 };
          return order[a.severity] - order[b.severity];
        }
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'urls') return b.affectedUrls.length - a.affectedUrls.length;
        return 0;
      });
  }, [report, severityFilter, categoryFilter, searchFilter, sortBy]);

  // Export report as JSON file
  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-audit-${report.domain}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ModuleShell
      title="Site Audit v1"
      purpose="Perform an authorized, real-time technical crawl across your website pages to detect indexing blockers, metadata omissions, broken tags, and technical SEO issues."
      honesty="This is a real technical audit tool. Findings are extracted from live responses and HTML payloads — not synthetic market estimates or ranking guarantees."
    >
      {/* 1. Target URL Input & Configuration Panel */}
      <Panel title="Audit Target & Authorization">
        <form onSubmit={handleStartAudit} className="space-y-4">
          <div className="grid sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-8 space-y-1.5">
              <label htmlFor="audit-url" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Target Website URL
              </label>
              <div className="relative">
                <input
                  id="audit-url"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  disabled={status === 'running'}
                  className="w-full pl-3 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                  HTTP / HTTPS
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="max-pages" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Crawl Limit
              </label>
              <select
                id="max-pages"
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                disabled={status === 'running'}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value={5}>5 Pages (Quick)</option>
                <option value={10}>10 Pages (Standard)</option>
                <option value={15}>15 Pages (Deep)</option>
                <option value={20}>20 Pages (Comprehensive)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'running'}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
              >
                {status === 'running' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Start Audit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Authorization Checkbox & Scope Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <input
              id="auth-check"
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="auth-check" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
              <strong className="text-slate-900 dark:text-slate-200">Authorized Audit Declaration:</strong> I confirm that I own this domain or have explicit authorization to crawl and test its public endpoints. Private IPs, loopbacks, internal hostnames, and unauthorized scraping are strictly blocked by SSRF enforcement.
            </label>
          </div>

          {/* Validation / Execution Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      </Panel>

      {/* 2. Crawl Progress State */}
      {status === 'running' && (
        <Panel title="Crawl in Progress">
          <div className="space-y-4 py-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                </span>
                Active Crawl Status: <span className="text-indigo-600 dark:text-indigo-400">Executing</span>
              </span>
              <span>
                Pages Crawled: {pagesCrawledCount} / {pagesDiscoveredCount} discovered
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(10, Math.round((pagesCrawledCount / Math.max(1, maxPages)) * 100)))}%`,
                }}
              />
            </div>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
              {progressText || 'Inspecting target host, robots.txt, and sitemap.xml...'}
            </p>
          </div>
        </Panel>
      )}

      {/* 3. Empty State (When no audit has been run yet) */}
      {status === 'idle' && !report && (
        <div className="p-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Ready to Audit Your Website</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Enter your domain above and click <strong>Start Audit</strong>. The crawler will fetch your public pages, evaluate titles, descriptions, headings, canonicals, robots directives, image alt attributes, and report actionable findings with evidence.
          </p>
        </div>
      )}

      {/* 4. Completed Report View */}
      {report && (
        <div className="space-y-6">
          {/* Executive KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Health Score</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
                <span className={report.summary.healthScore >= 80 ? 'text-emerald-600' : report.summary.healthScore >= 50 ? 'text-amber-500' : 'text-rose-600'}>
                  {report.summary.healthScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Technical benchmark</div>
            </div>

            <div className="p-4 rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm">
              <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Errors
              </div>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
                {report.summary.totalErrors}
              </div>
              <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">Critical issues</div>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm">
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Warnings
              </div>
              <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                {report.summary.totalWarnings}
              </div>
              <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">Needs attention</div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm">
              <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Passed Checks
              </div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {report.summary.totalPassed}
              </div>
              <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">Satisfied standards</div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm col-span-2 md:col-span-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Crawled Pages
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {report.pagesCrawled} <span className="text-xs font-normal text-slate-400">/ {report.pagesDiscovered}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Duration: {(report.durationMs / 1000).toFixed(1)}s
              </div>
            </div>
          </div>

          {/* Navigation Tabs & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('findings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'findings'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Findings ({report.findings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pages')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'pages'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Pages Inventory ({report.pages.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'overview'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Architecture &amp; Signals
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Audit run: {new Date(report.timestamp).toLocaleTimeString()}
              </span>
              <button
                type="button"
                onClick={handleExportJson}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-1 text-slate-700 dark:text-slate-300"
              >
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
            </div>
          </div>

          {/* TAB 1: Filterable & Sortable Findings */}
          {activeTab === 'findings' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5 relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search issue name, code, or URL..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-4 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        severityFilter === 'ALL'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All ({report.findings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('error')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        severityFilter === 'error'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      Errors ({report.summary.totalErrors})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('warning')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        severityFilter === 'warning'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      Warnings ({report.summary.totalWarnings})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('info')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        severityFilter === 'info'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}
                    >
                      Info ({report.summary.totalInfo})
                    </button>
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-end gap-2 text-xs">
                    <span className="text-slate-400 text-[11px]">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="severity">By Severity</option>
                      <option value="name">By Issue Title</option>
                      <option value="urls">By Affected URLs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Findings List */}
              {filteredFindings.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                  No findings match the selected filter criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFindings.map((finding) => {
                    const isExpanded = expandedIssues[finding.code];
                    const badgeStyles =
                      finding.severity === 'error'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/60'
                        : finding.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/60'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/60';

                    return (
                      <div
                        key={finding.code}
                        className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
                      >
                        <div
                          onClick={() => toggleExpand(finding.code)}
                          className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 select-none"
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 shrink-0">
                              {finding.severity === 'error' ? (
                                <AlertCircle className="w-5 h-5 text-rose-600" />
                              ) : finding.severity === 'warning' ? (
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Info className="w-5 h-5 text-blue-500" />
                              )}
                            </span>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                  {finding.title}
                                </h3>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${badgeStyles}`}>
                                  {finding.severity}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                  {finding.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {finding.explanation}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-semibold text-slate-500">
                              {finding.affectedUrls.length} {finding.affectedUrls.length === 1 ? 'URL' : 'URLs'}
                            </span>
                            <button
                              type="button"
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              aria-label="Toggle details"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Evidence & Recommended Fix */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                            {/* Evidence */}
                            <div>
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Technical Evidence Captured
                              </div>
                              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all">
                                {finding.evidence}
                              </div>
                            </div>

                            {/* Recommendation */}
                            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                                  Actionable Recommendation
                                </div>
                                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                                  {finding.recommendation}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  createTask({
                                    projectId: getActiveProject().id,
                                    title: `Fix ${finding.title}`,
                                    description: `${finding.explanation}\n\nRecommended: ${finding.recommendation}`,
                                    severity: finding.severity === 'error' ? 'critical' : finding.severity === 'warning' ? 'warning' : 'info',
                                    status: 'open',
                                    url: finding.affectedUrls[0],
                                    findingRuleId: finding.code,
                                  });
                                  alert(`Task created for "${finding.title}" in your Task Tracker!`);
                                }}
                                className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                              >
                                + Create Task
                              </button>
                            </div>

                            {/* Affected URLs List */}
                            <div>
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Affected URL Paths ({finding.affectedUrls.length})
                              </div>
                              <ul className="space-y-1 max-h-40 overflow-y-auto">
                                {finding.affectedUrls.map((u, idx) => (
                                  <li key={idx} className="text-xs font-mono text-indigo-600 dark:text-indigo-400 truncate flex items-center gap-1.5">
                                    <span className="text-slate-400 text-[10px]">{idx + 1}.</span>
                                    <a href={u} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                      {u} <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Pages Inventory */}
          {activeTab === 'pages' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold">
                      <th className="py-3 px-4">URL</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Title</th>
                      <th className="py-3 px-3">H1 Tags</th>
                      <th className="py-3 px-3">Canonical</th>
                      <th className="py-3 px-3">Images (Missing Alt)</th>
                      <th className="py-3 px-3">Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.pages.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 max-w-xs truncate font-mono font-medium text-slate-800 dark:text-slate-200">
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-600 dark:text-indigo-400">
                            {p.url}
                          </a>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              p.statusCode === 200
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                            }`}
                          >
                            {p.statusCode || 'Err'}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate" title={p.title || 'Missing'}>
                          {p.title ? (
                            <span>{p.title} <span className="text-[10px] text-slate-400">({p.titleLength} chars)</span></span>
                          ) : (
                            <span className="text-rose-600 font-bold">Missing</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {p.h1List.length === 1 ? (
                            <span className="text-emerald-600 font-semibold">1 (OK)</span>
                          ) : p.h1List.length === 0 ? (
                            <span className="text-rose-600 font-bold">0 (Missing)</span>
                          ) : (
                            <span className="text-amber-600 font-semibold">{p.h1List.length} (Multiple)</span>
                          )}
                        </td>
                        <td className="py-3 px-3 max-w-[140px] truncate">
                          {p.canonicalUrl ? (
                            <span className="text-emerald-600 font-mono text-[11px]" title={p.canonicalUrl}>Present</span>
                          ) : (
                            <span className="text-rose-600 font-bold">Missing</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {p.imagesTotal === 0 ? (
                            <span className="text-slate-400">0</span>
                          ) : p.imagesMissingAlt > 0 ? (
                            <span className="text-amber-600 font-bold">{p.imagesMissingAlt} / {p.imagesTotal}</span>
                          ) : (
                            <span className="text-emerald-600">All set ({p.imagesTotal})</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {p.responseTimeMs ? `${p.responseTimeMs}ms` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Site Architecture & Signals */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-4">
              <Panel title="robots.txt Status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Availability</span>
                    <span className={`font-bold ${report.robotsTxt.found ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {report.robotsTxt.found ? 'Found & Accessible' : 'Missing (404)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Rules Detected</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{report.robotsTxt.rulesCount} rules</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Sitemap Directive Listed</span>
                    <span className={`font-bold ${report.robotsTxt.hasSitemapDirective ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {report.robotsTxt.hasSitemapDirective ? 'Yes (Present)' : 'No (Missing)'}
                    </span>
                  </div>
                  <div className="pt-1">
                    <a href={report.robotsTxt.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      Inspect robots.txt <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Panel>

              <Panel title="sitemap.xml Status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Availability</span>
                    <span className={`font-bold ${report.sitemapXml.found ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {report.sitemapXml.found ? 'Found & Accessible' : 'Missing (404)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Indexed URLs in XML</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{report.sitemapXml.urlsFound} entries</span>
                  </div>
                  <div className="pt-1">
                    <a href={report.sitemapXml.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      Inspect sitemap.xml <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Panel>
            </div>
          )}
        </div>
      )}
    </ModuleShell>
  );
}
