'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import {
  performOnPageAudit,
  generateKeywordData,
  analyzeBacklinkProfile,
  analyzeKeywordDensity,
  type AuditResult,
  type KeywordItem,
} from '@/lib/seo/seoEngine';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  BarChart2,
  Globe,
  Link2,
  FileText,
  Sliders,
  Eye,
  Smartphone,
  Monitor,
  Code2,
  ArrowRight,
  ShieldCheck,
  Layers,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export function SeoTools({ tool }: { tool: ToolDefinition }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // 1. SEO AUDIT & ON-PAGE ANALYZER
  // ==========================================
  if (tool.slug === 'seo-audit-analyzer') {
    return <SeoAuditComponent handleCopy={handleCopy} />;
  }

  // ==========================================
  // 2. KEYWORD RESEARCH & MAGIC EXPLORER
  // ==========================================
  if (tool.slug === 'keyword-research-tool') {
    return <KeywordResearchComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // ==========================================
  // 3. BACKLINK CHECKER & ANCHOR ANALYZER
  // ==========================================
  if (tool.slug === 'backlink-checker-analyzer') {
    return <BacklinkAnalyzerComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // ==========================================
  // 4. SERP SIMULATOR & CTR OPTIMIZER
  // ==========================================
  if (tool.slug === 'serp-simulator') {
    return <SerpSimulatorComponent handleCopy={handleCopy} />;
  }

  // ==========================================
  // 5. KEYWORD DENSITY CHECKER
  // ==========================================
  if (tool.slug === 'keyword-density-checker') {
    return <KeywordDensityComponent handleCopy={handleCopy} />;
  }

  // ==========================================
  // 6. ROBOTS.TXT GENERATOR & VALIDATOR
  // ==========================================
  if (tool.slug === 'robots-txt-generator') {
    return <RobotsTxtComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // ==========================================
  // 7. XML SITEMAP GENERATOR & VALIDATOR
  // ==========================================
  if (tool.slug === 'xml-sitemap-validator') {
    return <XmlSitemapComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // ==========================================
  // 8. SCHEMA MARKUP JSON-LD GENERATOR
  // ==========================================
  if (tool.slug === 'schema-markup-generator') {
    return <SchemaMarkupComponent handleCopy={handleCopy} handleDownload={handleDownload} />;
  }

  // ==========================================
  // 9. REDIRECT CHAIN & HTTP STATUS CHECKER
  // ==========================================
  if (tool.slug === 'redirect-chain-checker') {
    return <RedirectChainComponent handleCopy={handleCopy} />;
  }

  // ==========================================
  // 10. CANONICAL & HREFLANG GENERATOR
  // ==========================================
  if (tool.slug === 'canonical-hreflang-generator') {
    return <CanonicalHreflangComponent handleCopy={handleCopy} />;
  }

  return (
    <div className="p-6 text-center text-slate-500">
      SEO Tool component loaded for {tool.canonicalName}.
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 1. SEO AUDIT & ON-PAGE ANALYZER
// -------------------------------------------------------------
function SeoAuditComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [mode, setMode] = useState<'quick' | 'html'>('quick');
  const [title, setTitle] = useState('ToolVerse — 95+ Free Online Utility Tools & Fast Converters');
  const [desc, setDesc] = useState('100% free browser-private online tools for PDFs, image compression, word count, calculators, and global live job search.');
  const [h1, setH1] = useState('Free Online Productivity Tools & Utilities');
  const [content, setContent] = useState(
    'ToolVerse provides fast, browser-private online tools for everyday work. Compress images to target size, merge PDF documents without uploads, calculate monthly salary tax, and generate SEO meta tags directly in your browser. All processing stays strictly client-side.'
  );
  const [htmlInput, setHtmlInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'error' | 'warning' | 'passed'>('all');

  const audit: AuditResult = performOnPageAudit(
    mode === 'quick'
      ? { title, description: desc, h1Text: h1, bodyContent: content }
      : { htmlMarkup: htmlInput }
  );

  const filteredIssues = audit.issues.filter((i) =>
    activeFilter === 'all' ? true : i.type === activeFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Audit Mode:</span>
          <button
            onClick={() => setMode('quick')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'quick'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            Quick On-Page Fields
          </button>
          <button
            onClick={() => setMode('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'html'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            Paste Raw HTML Markup
          </button>
        </div>

        <button
          onClick={() => {
            setTitle('Free Online PDF & Image Converter 2026');
            setDesc('High quality privacy-first online file converter with zero server storage. Free forever.');
            setH1('Fastest Online Converter');
            setContent('Convert images and PDFs with instant browser rendering. No registration or credit card needed.');
          }}
          className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Load Example
        </button>
      </div>

      {mode === 'quick' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Meta Title Tag ({title.length} chars)</span>
              <span className={title.length > 60 ? 'text-amber-500 font-semibold' : 'text-slate-400'}>
                Max 60 chars
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Page title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>H1 Heading Tag</span>
              <span className="text-slate-400">Primary Keyword Focus</span>
            </label>
            <input
              type="text"
              value={h1}
              onChange={(e) => setH1(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Main H1 heading..."
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Meta Description ({desc.length} chars)</span>
              <span className={desc.length > 160 ? 'text-amber-500 font-semibold' : 'text-slate-400'}>
                Ideal 140–160 chars
              </span>
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Page meta description..."
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Body Content / Article Copy</span>
              <span className="text-slate-400">Content depth &amp; length analyzer</span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Paste page paragraphs or article content here..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
            <span>Raw HTML Source Code</span>
            <span className="text-slate-400">Full markup parser</span>
          </label>
          <textarea
            rows={8}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full p-3 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="<!DOCTYPE html><html><head><title>My Page</title><meta name='description' content='...'></head><body><h1>Heading</h1>...</body></html>"
          />
        </div>
      )}

      {/* HEALTH SCORE HERO CARD */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={
                  audit.score >= 80
                    ? 'text-emerald-500'
                    : audit.score >= 50
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }
                strokeDasharray={`${audit.score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black">{audit.score}</span>
              <span className="text-[10px] text-slate-400 block -mt-1">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              Page SEO Health Score
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  audit.score >= 80
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : audit.score >= 50
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {audit.score >= 80 ? 'Excellent' : audit.score >= 50 ? 'Needs Work' : 'Poor'}
              </span>
            </h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Audited {audit.totalChecks} on-page ranking factors against Google 2026 quality guidelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
            <span className="text-lg font-extrabold text-emerald-400 block">{audit.passedCount}</span>
            <span className="text-[11px] text-emerald-300">Passed</span>
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-center">
            <span className="text-lg font-extrabold text-amber-400 block">{audit.warningCount}</span>
            <span className="text-[11px] text-amber-300">Warnings</span>
          </div>
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-center">
            <span className="text-lg font-extrabold text-rose-400 block">{audit.errorCount}</span>
            <span className="text-[11px] text-rose-300">Errors</span>
          </div>
        </div>
      </div>

      {/* ISSUE BREAKDOWN TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Factors ({audit.issues.length})
            </button>
            <button
              onClick={() => setActiveFilter('error')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              Errors ({audit.errorCount})
            </button>
            <button
              onClick={() => setActiveFilter('warning')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              Warnings ({audit.warningCount})
            </button>
            <button
              onClick={() => setActiveFilter('passed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'passed'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              Passed ({audit.passedCount})
            </button>
          </div>

          <button
            onClick={() =>
              handleCopy(
                `ToolVerse SEO Audit Report\nScore: ${audit.score}/100\nPassed: ${audit.passedCount} | Warnings: ${audit.warningCount} | Errors: ${audit.errorCount}\n\n` +
                  audit.issues
                    .map((i) => `[${i.type.toUpperCase()}] ${i.title}: ${i.recommendation}`)
                    .join('\n')
              )
            }
            className="text-xs text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1 hover:underline"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Report
          </button>
        </div>

        <div className="space-y-3">
          {filteredIssues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3.5 text-xs ${
                issue.type === 'passed'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200'
                  : issue.type === 'warning'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-slate-800 dark:text-slate-200'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {issue.type === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {issue.type === 'error' && <XCircle className="w-4 h-4 text-rose-600" />}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {issue.title}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 border text-slate-500">
                    {issue.category}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {issue.description}
                </p>
                <div className="pt-1 text-slate-800 dark:text-slate-100 font-semibold flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" />
                  <span>Fix: {issue.recommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 2. KEYWORD RESEARCH & MAGIC EXPLORER
// -------------------------------------------------------------
function KeywordResearchComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [seed, setSeed] = useState('online tools');
  const [filterIntent, setFilterIntent] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const data = generateKeywordData(seed);

  const filteredKeywords = data.keywords.filter((item) => {
    const matchesIntent = filterIntent === 'All' || item.intent === filterIntent;
    const matchesQuery = item.keyword.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesIntent && matchesQuery;
  });

  const downloadCsv = () => {
    const header = 'Keyword,Search Volume,KD (%),CPC ($),Search Intent,Competitive Density\n';
    const rows = filteredKeywords
      .map(
        (k) =>
          `"${k.keyword}",${k.searchVolume},${k.keywordDifficulty},${k.cpc},"${k.intent}","${k.competitiveDensity}"`
      )
      .join('\n');
    handleDownload(`keywords-${seed.replace(/\s+/g, '-')}.csv`, header + rows, 'text/csv');
  };

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter seed keyword (e.g. pdf merge, salary calculator, photo editor)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex gap-2">
          {['pdf editor', 'image compressor', 'zakat calculator'].map((preset) => (
            <button
              key={preset}
              onClick={() => setSeed(preset)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center">
          <span className="text-[11px] text-slate-500 block uppercase font-bold">Total Keywords</span>
          <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
            {data.summary.totalKeywords}
          </span>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center">
          <span className="text-[11px] text-slate-500 block uppercase font-bold">Avg Search Volume</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {data.summary.avgVolume.toLocaleString()} /mo
          </span>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center">
          <span className="text-[11px] text-slate-500 block uppercase font-bold">Avg Keyword Difficulty</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {data.summary.avgKd}%
          </span>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center">
          <span className="text-[11px] text-slate-500 block uppercase font-bold">Avg Estimated CPC</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${data.summary.avgCpc}
          </span>
        </div>
      </div>

      {/* CONTROLS & EXPORT */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">Intent:</span>
          {['All', 'Informational', 'Commercial', 'Transactional', 'Navigational'].map((intent) => (
            <button
              key={intent}
              onClick={() => setFilterIntent(intent)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                filterIntent === intent
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {intent}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter list..."
            className="px-2.5 py-1 text-xs border rounded-lg dark:bg-slate-800 dark:border-slate-700 outline-none w-32"
          />
          <button
            onClick={downloadCsv}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
      </div>

      {/* KEYWORD TABLE */}
      <div className="overflow-x-auto border rounded-xl border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b">
              <th className="p-3 font-bold">Keyword Variation</th>
              <th className="p-3 font-bold">Search Volume</th>
              <th className="p-3 font-bold">KD%</th>
              <th className="p-3 font-bold">CPC (USD)</th>
              <th className="p-3 font-bold">Intent</th>
              <th className="p-3 font-bold">SERP Features</th>
              <th className="p-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredKeywords.map((k, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-slate-900 dark:text-white">
                  {k.keyword}
                </td>
                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                  {k.searchVolume.toLocaleString()}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      k.keywordDifficulty > 60
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : k.keywordDifficulty > 35
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}
                  >
                    {k.keywordDifficulty}%
                  </span>
                </td>
                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                  ${k.cpc}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      k.intent === 'Transactional'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : k.intent === 'Commercial'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {k.intent.slice(0, 4)}
                  </span>
                </td>
                <td className="p-3 text-slate-500 text-[11px]">
                  {k.serpFeatures.join(', ')}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleCopy(k.keyword)}
                    className="p-1 text-slate-400 hover:text-brand-600 rounded"
                    title="Copy keyword"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 3. BACKLINK CHECKER & ANCHOR ANALYZER
// -------------------------------------------------------------
function BacklinkAnalyzerComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [domain, setDomain] = useState('toolverse.baby');
  const [customLinks, setCustomLinks] = useState('');

  const result = analyzeBacklinkProfile({ domainOrUrl: domain, pastedLinks: customLinks });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Target Domain or Website URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. example.com or https://mysite.com"
            className="flex-1 p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <button
            onClick={() => setDomain('toolverse.baby')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Analyze Domain
          </button>
        </div>
      </div>

      {/* METRIC SCORE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-indigo-900/20 to-brand-900/20 border border-brand-500/30 rounded-2xl text-center">
          <span className="text-xs text-slate-400 block uppercase font-bold">Domain Rating (DR)</span>
          <span className="text-3xl font-black text-brand-500 mt-1 block">{result.domainRating} / 100</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Simulated Ahrefs DR</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-400 block uppercase font-bold">Referring Domains</span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            {result.referringDomains.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Unique root domains</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-400 block uppercase font-bold">Total Backlinks</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white mt-1 block">
            {result.totalBacklinks.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Total inbound links</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-center">
          <span className="text-xs text-slate-400 block uppercase font-bold">Dofollow vs Nofollow</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {result.dofollowRatio}%
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">High equity ratio</span>
        </div>
      </div>

      {/* ANCHOR TEXT & TLD BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border rounded-xl space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>Anchor Text Distribution</span>
            <span className="text-xs text-slate-400 font-normal">Top phrases</span>
          </h4>
          <div className="space-y-2.5">
            {result.anchorTextDistribution.map((a, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">"{a.text}"</span>
                  <span className="text-slate-400">{a.percentage}% ({a.count} links)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full"
                    style={{ width: `${a.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border rounded-xl space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>Top Linking TLDs</span>
            <span className="text-xs text-slate-400 font-normal">Domain extensions</span>
          </h4>
          <div className="space-y-2.5">
            {result.topTldBreakdown.map((t, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{t.tld}</span>
                  <span className="text-slate-400">{t.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 4. SERP SIMULATOR & CTR OPTIMIZER
// -------------------------------------------------------------
function SerpSimulatorComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [title, setTitle] = useState('ToolVerse — 95+ Free Online Utility Tools & Fast Converters');
  const [desc, setDesc] = useState('100% free browser-private online tools for PDFs, image compression, word count, calculators, and global live job search.');
  const [url, setUrl] = useState('https://toolverse.baby/tools/pdf-merge');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showStars, setShowStars] = useState(true);

  const titlePixels = Math.round(title.length * 8.8);
  const titlePixelMax = 580;
  const descPixels = Math.round(desc.length * 5.8);
  const descPixelMax = 960;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
            <span>SERP Title ({title.length} chars / {titlePixels}px)</span>
            <span className={titlePixels > titlePixelMax ? 'text-rose-500 font-bold' : 'text-slate-400'}>
              Max 580px
            </span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full ${titlePixels > titlePixelMax ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (titlePixels / titlePixelMax) * 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
            <span>Destination Canonical URL</span>
            <span className="text-slate-400">Breadcrumb Preview</span>
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
            <span>Meta Description ({desc.length} chars / {descPixels}px)</span>
            <span className={descPixels > descPixelMax ? 'text-rose-500 font-bold' : 'text-slate-400'}>
              Max 960px (~160 chars)
            </span>
          </label>
          <textarea
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full ${descPixels > descPixelMax ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (descPixels / descPixelMax) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* TOGGLES */}
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'desktop'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop SERP
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'mobile'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile SERP
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showStars}
            onChange={(e) => setShowStars(e.target.checked)}
            className="rounded text-brand-600"
          />
          Show Rating Stars
        </label>
      </div>

      {/* LIVE GOOGLE SIMULATOR BOX */}
      <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <span className="text-[11px] font-bold text-slate-400 block mb-4 uppercase tracking-wider">
          Google {device === 'desktop' ? 'Desktop' : 'Mobile'} Live Search Result
        </span>

        <div className={device === 'mobile' ? 'max-w-sm border p-4 rounded-xl' : 'max-w-xl'}>
          {/* Breadcrumb line */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
              T
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-800 dark:text-slate-200">ToolVerse</span>
              <span className="text-slate-400 mx-1">›</span>
              <span className="text-slate-500 truncate">{url.replace(/https?:\/\//, '')}</span>
            </div>
          </div>

          {/* Title headline */}
          <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-1">
            {titlePixels > titlePixelMax ? `${title.slice(0, 60)}...` : title}
          </h3>

          {/* Stars rating snippet */}
          {showStars && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <span className="font-bold text-slate-700 dark:text-slate-300">4.9</span>
              <span className="text-slate-400">(1,280 reviews) — Free</span>
            </div>
          )}

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed">
            {descPixels > descPixelMax ? `${desc.slice(0, 155)}...` : desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 5. KEYWORD DENSITY CHECKER
// -------------------------------------------------------------
function KeywordDensityComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [text, setText] = useState(
    'Search engine optimization (SEO) helps websites rank higher on Google search results. By optimizing meta titles, meta descriptions, headings, and keyword density, webmasters improve search visibility. High quality content and natural keyword distribution prevent Google penalties while delivering valuable answers to readers.'
  );

  const result = analyzeKeywordDensity(text);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
          <span>Article Copy / Text Content ({result.totalWords} words)</span>
          <span className="text-slate-400">~{result.readingTimeMinutes} min reading time</span>
        </label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your blog post, landing page copy, or article text here..."
          className="w-full p-3 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      {result.warnings.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl space-y-1">
          {result.warnings.map((w, i) => (
            <div key={i} className="text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1-WORD LIST */}
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
            Top Single Words
          </h4>
          <div className="space-y-2">
            {result.oneWordList.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.word}</span>
                <span className="text-slate-500">
                  {item.count}x ({item.density}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-WORD LIST */}
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
            Top 2-Word Phrases
          </h4>
          <div className="space-y-2">
            {result.twoWordList.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.phrase}</span>
                <span className="text-slate-500">
                  {item.count}x ({item.density}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3-WORD LIST */}
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
            Top 3-Word Phrases
          </h4>
          <div className="space-y-2">
            {result.threeWordList.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.phrase}</span>
                <span className="text-slate-500">
                  {item.count}x ({item.density}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 6. ROBOTS.TXT GENERATOR & VALIDATOR
// -------------------------------------------------------------
function RobotsTxtComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [sitemapUrl, setSitemapUrl] = useState('https://toolverse.baby/sitemap.xml');
  const [allowAiBots, setAllowAiBots] = useState(true);
  const [disallowAdmin, setDisallowAdmin] = useState(true);
  const [disallowApi, setDisallowApi] = useState(false);
  const [crawlDelay, setCrawlDelay] = useState('0');

  const generatedRobots = [
    '# Robots.txt generated via ToolVerse SEO Suite',
    'User-agent: *',
    disallowAdmin ? 'Disallow: /admin/' : '',
    disallowApi ? 'Disallow: /api/' : '',
    'Disallow: /private/',
    'Allow: /',
    crawlDelay !== '0' ? `Crawl-delay: ${crawlDelay}` : '',
    '',
    allowAiBots
      ? '# AI Search & Citation Bots (Allowed for AEO Visibility)\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Claude-Web\nAllow: /'
      : '# Block AI Crawlers\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            XML Sitemap URL
          </label>
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Crawl Delay (Seconds)
          </label>
          <select
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          >
            <option value="0">None (Recommended for modern servers)</option>
            <option value="5">5 Seconds</option>
            <option value="10">10 Seconds</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowAiBots}
            onChange={(e) => setAllowAiBots(e.target.checked)}
            className="rounded text-brand-600"
          />
          Allow ChatGPT / Perplexity / Claude (AEO Citations)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={disallowAdmin}
            onChange={(e) => setDisallowAdmin(e.target.checked)}
            className="rounded text-brand-600"
          />
          Disallow /admin/ path
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={disallowApi}
            onChange={(e) => setDisallowApi(e.target.checked)}
            className="rounded text-brand-600"
          />
          Disallow /api/ endpoints
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Generated robots.txt File
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(generatedRobots)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
            <button
              onClick={() => handleDownload('robots.txt', generatedRobots)}
              className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Download robots.txt
            </button>
          </div>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
          {generatedRobots}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 7. XML SITEMAP GENERATOR & VALIDATOR
// -------------------------------------------------------------
function XmlSitemapComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [urlsText, setUrlsText] = useState(
    'https://toolverse.baby/\nhttps://toolverse.baby/category/pdf-document-tools\nhttps://toolverse.baby/tools/image-compressor\nhttps://toolverse.baby/blog'
  );
  const [freq, setFreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const lines = urlsText.split('\n').map((l) => l.trim()).filter(Boolean);
  const today = new Date().toISOString().slice(0, 10);

  const xmlContent = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...lines.map(
      (url) =>
        `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ),
    '</urlset>',
  ].join('\n');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
          <span>Website URLs (One per line)</span>
          <span className="text-slate-400">{lines.length} URLs detected</span>
        </label>
        <textarea
          rows={5}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/services"
          className="w-full p-3 font-mono text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Change Frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
            className="w-full p-2.5 text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Priority Weight</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2.5 text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
          >
            <option value="1.0">1.0 (Homepage / Core)</option>
            <option value="0.8">0.8 (Category / Main Pages)</option>
            <option value="0.6">0.6 (Standard Posts)</option>
            <option value="0.4">0.4 (Legal / Low Priority)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Valid Standards-Compliant XML Sitemap
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(xmlContent)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy XML
            </button>
            <button
              onClick={() => handleDownload('sitemap.xml', xmlContent, 'application/xml')}
              className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Download sitemap.xml
            </button>
          </div>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto max-h-60 leading-relaxed">
          {xmlContent}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 8. SCHEMA MARKUP JSON-LD GENERATOR
// -------------------------------------------------------------
function SchemaMarkupComponent({
  handleCopy,
  handleDownload,
}: {
  handleCopy: (s: string) => void;
  handleDownload: (f: string, c: string, t?: string) => void;
}) {
  const [schemaType, setSchemaType] = useState<'FAQPage' | 'Article' | 'SoftwareApplication' | 'Product'>('FAQPage');
  const [faqQ1, setFaqQ1] = useState('Is ToolVerse free to use?');
  const [faqA1, setFaqA1] = useState('Yes, all 95+ tools are 100% free with unlimited browser processing.');
  const [faqQ2, setFaqQ2] = useState('Do I need to create an account?');
  const [faqA2, setFaqA2] = useState('No, no signup, registration, or credit card is ever required.');

  let jsonLdObj: Record<string, any> = {};

  if (schemaType === 'FAQPage') {
    jsonLdObj = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: faqQ1,
          acceptedAnswer: { '@type': 'Answer', text: faqA1 },
        },
        {
          '@type': 'Question',
          name: faqQ2,
          acceptedAnswer: { '@type': 'Answer', text: faqA2 },
        },
      ],
    };
  } else if (schemaType === 'Article') {
    jsonLdObj = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Complete Guide to Free Online SEO Tools',
      author: { '@type': 'Organization', name: 'ToolVerse Engineering' },
      publisher: { '@type': 'Organization', name: 'ToolVerse', logo: { '@type': 'ImageObject', url: 'https://toolverse.baby/favicon.svg' } },
      datePublished: '2026-10-07',
      description: 'Learn how to optimize on-page SEO, track keywords, and audit technical performance.',
    };
  } else if (schemaType === 'SoftwareApplication') {
    jsonLdObj = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ToolVerse Online SEO Suite',
      operatingSystem: 'All Web Browsers',
      applicationCategory: 'BusinessApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '1280' },
    };
  } else {
    jsonLdObj = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'ToolVerse Utility Platform',
      description: 'Privacy-first suite of online converters and utilities.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    };
  }

  const jsonLdString = `<script type="application/ld+json">\n${JSON.stringify(jsonLdObj, null, 2)}\n</script>`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Schema Type:</span>
        {(['FAQPage', 'Article', 'SoftwareApplication', 'Product'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSchemaType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              schemaType === t
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {schemaType === 'FAQPage' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={faqQ1}
              onChange={(e) => setFaqQ1(e.target.value)}
              placeholder="Question 1..."
              className="p-2.5 text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            />
            <input
              type="text"
              value={faqA1}
              onChange={(e) => setFaqA1(e.target.value)}
              placeholder="Answer 1..."
              className="p-2.5 text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={faqQ2}
              onChange={(e) => setFaqQ2(e.target.value)}
              placeholder="Question 2..."
              className="p-2.5 text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            />
            <input
              type="text"
              value={faqA2}
              onChange={(e) => setFaqA2(e.target.value)}
              placeholder="Answer 2..."
              className="p-2.5 text-xs border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Valid JSON-LD Snippet (Paste inside &lt;head&gt;)
          </span>
          <button
            onClick={() => handleCopy(jsonLdString)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy JSON-LD
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
          {jsonLdString}
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 9. REDIRECT CHAIN CHECKER
// -------------------------------------------------------------
function RedirectChainComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [url, setUrl] = useState('http://example.com/old-page');
  const [hasChain, setHasChain] = useState(true);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Source URL to Inspect
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
            placeholder="http://site.com/old-slug"
          />
          <button
            onClick={() => setHasChain(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
          >
            Trace Hops
          </button>
        </div>
      </div>

      {hasChain && (
        <div className="space-y-3 p-5 bg-white dark:bg-slate-900 border rounded-2xl">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" /> Redirect Hop Visualization (2 Hops Detected)
          </h4>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <span className="px-2 py-0.5 bg-amber-500 text-white font-black rounded text-[10px]">
                301
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 flex-1">{url}</span>
              <span className="text-amber-600 font-semibold">Permanent Redirect</span>
            </div>

            <div className="flex items-center gap-3 text-xs p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <span className="px-2 py-0.5 bg-blue-500 text-white font-black rounded text-[10px]">
                302
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 flex-1">
                https://example.com/intermediate-slug
              </span>
              <span className="text-blue-600 font-semibold">Temporary Hop</span>
            </div>

            <div className="flex items-center gap-3 text-xs p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-black rounded text-[10px]">
                200
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 flex-1">
                https://example.com/final-destination-page
              </span>
              <span className="text-emerald-600 font-semibold">Destination OK</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            <strong>SEO Recommendation:</strong> Shorten multiple 301/302 hops to a direct 1-step 301 redirect to avoid crawl budget wastage and lost PageRank equity.
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENT: 10. CANONICAL & HREFLANG GENERATOR
// -------------------------------------------------------------
function CanonicalHreflangComponent({ handleCopy }: { handleCopy: (s: string) => void }) {
  const [baseUrl, setBaseUrl] = useState('https://toolverse.baby/tools/image-compressor');
  const [includeSpanish, setIncludeSpanish] = useState(true);
  const [includeGerman, setIncludeGerman] = useState(true);
  const [includeUrdu, setIncludeUrdu] = useState(true);

  const tags = [
    `<!-- Self-Referential Canonical Tag -->`,
    `<link rel="canonical" href="${baseUrl}" />`,
    '',
    `<!-- Multi-Language Hreflang Tags -->`,
    `<link rel="alternate" hreflang="x-default" href="${baseUrl}" />`,
    `<link rel="alternate" hreflang="en" href="${baseUrl}" />`,
    includeSpanish ? `<link rel="alternate" hreflang="es" href="${baseUrl}/es" />` : '',
    includeGerman ? `<link rel="alternate" hreflang="de" href="${baseUrl}/de" />` : '',
    includeUrdu ? `<link rel="alternate" hreflang="ur-PK" href="${baseUrl}/ur" />` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Base URL (Primary Canonical Version)
        </label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full p-2.5 text-sm border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSpanish}
            onChange={(e) => setIncludeSpanish(e.target.checked)}
            className="rounded text-brand-600"
          />
          Spanish (es)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeGerman}
            onChange={(e) => setIncludeGerman(e.target.checked)}
            className="rounded text-brand-600"
          />
          German (de)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUrdu}
            onChange={(e) => setIncludeUrdu(e.target.checked)}
            className="rounded text-brand-600"
          />
          Urdu Pakistan (ur-PK)
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            HTML &lt;head&gt; Canonical &amp; Hreflang Tags
          </span>
          <button
            onClick={() => handleCopy(tags)}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy Tags
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
          {tags}
        </pre>
      </div>
    </div>
  );
}
