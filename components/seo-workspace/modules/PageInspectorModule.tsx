'use client';

import React, { useState, useEffect } from 'react';
import { ModuleShell } from '../ModuleShell';
import {
  getActiveProject,
  getLatestAuditRun,
  createTask,
  getTasks,
} from '@/lib/seo/workspace/workspaceStorage';
import type { PageInventoryItem, InternalLinkItem } from '@/lib/seo/workspace/workspaceTypes';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  PlusCircle,
  Link as LinkIcon,
  FileCode2,
  Sparkles,
} from 'lucide-react';

export function PageInspectorModule() {
  const project = getActiveProject();
  const latestAudit = getLatestAuditRun(project.id);
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [taskNotice, setTaskNotice] = useState<string>('');

  const pages: PageInventoryItem[] = latestAudit?.pages || [];
  const allLinks: InternalLinkItem[] = latestAudit?.internalLinks || [];

  useEffect(() => {
    if (pages.length > 0 && !selectedUrl) {
      setSelectedUrl(pages[0].finalUrl || pages[0].requestedUrl);
    }
  }, [pages, selectedUrl]);

  const activePage = pages.find(
    (p) => p.finalUrl === selectedUrl || p.requestedUrl === selectedUrl
  );

  // Incoming links to this page from other crawled pages
  const inboundLinks = allLinks.filter(
    (l) => l.targetUrl === selectedUrl || l.targetUrl === activePage?.finalUrl
  );

  // Outbound links from this page
  const outboundLinks = allLinks.filter(
    (l) => l.sourceUrl === selectedUrl || l.sourceUrl === activePage?.requestedUrl
  );

  const handleCreateTask = (title: string, description: string, ruleId: string) => {
    createTask({
      projectId: project.id,
      title,
      description,
      severity: 'warning',
      status: 'open',
      url: selectedUrl,
      findingRuleId: ruleId,
    });
    setTaskNotice(`Task created: "${title}"`);
    setTimeout(() => setTaskNotice(''), 4000);
  };

  return (
    <ModuleShell
      title="Page Inspector & Internal Linking"
      purpose="Deep URL-level diagnostic evidence: inspect metadata, HTTP headers, directives, heading structure, and internal link architecture."
      honesty="Measured directly from server crawl inventory. Internal links represent pages observed within the crawl scope."
    >
      {/* URL Selector Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Crawled URL ({pages.length} Available in Latest Crawl)
            </label>
            {pages.length > 0 ? (
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full text-sm font-medium px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                {pages.map((p, idx) => (
                  <option key={idx} value={p.finalUrl || p.requestedUrl}>
                    {p.httpStatus} | {p.finalUrl || p.requestedUrl} (Depth {p.depth})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-500 font-semibold">
                No crawled pages found for project "{project.name}". Run a Site Audit first to populate inventory.
              </p>
            )}
          </div>
          <div className="flex items-end">
            <a
              href="/workspace/site-audit"
              className="text-xs font-bold px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-500 inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Run New Audit
            </a>
          </div>
        </div>

        {taskNotice && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
            <span>{taskNotice}</span>
            <a href="/workspace/tasks" className="underline hover:text-emerald-300">
              View Tasks &rarr;
            </a>
          </div>
        )}
      </div>

      {activePage ? (
        <div className="space-y-6">
          {/* URL Overview Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/15 text-brand-400 mb-1">
                  URL Inspection
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 break-all flex items-center gap-2">
                  <span>{activePage.finalUrl || activePage.requestedUrl}</span>
                  <a
                    href={activePage.finalUrl || activePage.requestedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-brand-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-md font-bold ${
                    activePage.httpStatus >= 200 && activePage.httpStatus < 300
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  HTTP {activePage.httpStatus}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  Depth: {activePage.depth}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  Timing: {activePage.timingMs}ms
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  Words: {activePage.wordCount}
                </span>
              </div>
            </div>

            {/* Diagnostic Signals Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Indexability</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  {activePage.isNoindex ? (
                    <span className="text-amber-500 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Noindex Directives
                    </span>
                  ) : (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Indexable
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  Robots: {activePage.robotsMeta || 'index, follow (default)'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Canonical URL</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  {activePage.canonical ? (
                    activePage.isCanonicalSelf ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Self-Referential
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Cross-Domain / Alternate
                      </span>
                    )
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Missing Canonical
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate" title={activePage.canonical}>
                  {activePage.canonical || 'No canonical tag present'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Internal Links</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                  <span>In: {inboundLinks.length}</span>
                  <span>Out: {outboundLinks.length}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {inboundLinks.length === 0 ? (
                    <span className="text-rose-400 font-semibold">Orphan candidate (0 in-links)</span>
                  ) : (
                    'Connected in internal graph'
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Image Alt Status</div>
                <div className="mt-1 text-sm font-semibold">
                  {activePage.imagesMissingAltCount > 0 ? (
                    <span className="text-amber-500">
                      {activePage.imagesMissingAltCount} Missing Alt
                    </span>
                  ) : (
                    <span className="text-emerald-500">All Images Have Alt</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {activePage.isThinContent ? 'Thin Content (<100 words)' : 'Word count adequate'}
                </div>
              </div>
            </div>
          </div>

          {/* On-Page Metadata & Headings Inspector */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-brand-500" />
                  Meta Title & Description
                </h4>
                {(!activePage.title || !activePage.metaDescription) && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCreateTask(
                        `Fix missing metadata on ${activePage.finalUrl}`,
                        'Review title and meta description length and presence.',
                        'meta_metadata'
                      )
                    }
                    className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Create Task
                  </button>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Title Tag</span>
                  <span>{activePage.titleLength} characters</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200">
                  {activePage.title || <span className="text-rose-400">Missing title tag</span>}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Meta Description</span>
                  <span>{activePage.metaDescriptionLength} characters</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200">
                  {activePage.metaDescription || (
                    <span className="text-rose-400">Missing meta description</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  H1 Heading Hierarchy
                </h4>
                {activePage.h1.length !== 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCreateTask(
                        `Fix H1 heading on ${activePage.finalUrl}`,
                        `Found ${activePage.h1.length} H1 tags. Recommended: Exactly 1 distinct H1 tag.`,
                        'h1_structure'
                      )
                    }
                    className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Create Task
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-medium">
                  {activePage.h1.length === 1 ? (
                    <span className="text-emerald-500 font-bold">1 H1 Found (Optimal)</span>
                  ) : activePage.h1.length === 0 ? (
                    <span className="text-rose-500 font-bold">0 H1 Found (Missing)</span>
                  ) : (
                    <span className="text-amber-500 font-bold">
                      {activePage.h1.length} H1 Headings Found (Multiple)
                    </span>
                  )}
                </div>
                {activePage.h1.length > 0 ? (
                  activePage.h1.map((heading, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      {heading}
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    No &lt;h1&gt; tags detected in HTML. Primary topical hierarchy is missing.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Internal Linking Architecture (Inbound & Outbound) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-500" />
                  Inbound Internal Links ({inboundLinks.length})
                </span>
                {inboundLinks.length === 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCreateTask(
                        `Add internal links to orphan page: ${activePage.finalUrl}`,
                        'This page has 0 internal incoming links from other crawled pages.',
                        'orphan_page'
                      )
                    }
                    className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold"
                  >
                    + Task: Fix Orphan
                  </button>
                )}
              </h4>
              <p className="text-xs text-slate-500">
                Pages in the crawl that link directly to this destination URL.
              </p>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {inboundLinks.length > 0 ? (
                  inboundLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                    >
                      <div className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {link.sourceUrl}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Anchor: "{link.anchorText || '<No Text>'}"</span>
                        {link.isNofollow && (
                          <span className="text-amber-500 font-bold">nofollow</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-400 text-center text-xs">
                    No inbound links detected from other crawled pages.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-500" />
                Outbound Internal Links ({outboundLinks.length})
              </h4>
              <p className="text-xs text-slate-500">
                Destination links on this page pointing to other internal URLs.
              </p>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {outboundLinks.length > 0 ? (
                  outboundLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                    >
                      <div className="font-mono text-slate-700 dark:text-slate-300 truncate">
                        {link.targetUrl}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Anchor: "{link.anchorText || '<No Text>'}"</span>
                        {link.isNofollow && (
                          <span className="text-amber-500 font-bold">nofollow</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-400 text-center text-xs">
                    No outbound links detected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No URL Selected
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Run a Site Audit crawl on your project domain to extract complete page inventory, heading hierarchies, and internal link graphs.
          </p>
        </div>
      )}
    </ModuleShell>
  );
}
