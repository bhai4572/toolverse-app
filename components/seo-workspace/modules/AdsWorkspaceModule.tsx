'use client';

import React, { useState, useMemo } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import {
  Megaphone,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Sparkles,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface Props {
  initialTab?: 'ppc-keywords' | 'copy' | 'simulator';
}

export function AdsWorkspaceModule({ initialTab = 'ppc-keywords' }: Props) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'ppc-keywords' | 'copy' | 'simulator'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. PPC Keyword Match Types State
  const [keywordInput, setKeywordInput] = useState(
    'seo audit tool\ntechnical seo service\nsite audit software\nrank tracking platform'
  );
  const [campaignName, setCampaignName] = useState('Search - Core Brand & Features');
  const [adGroupName, setAdGroupName] = useState('SEO Tools');
  const [includeBroad, setIncludeBroad] = useState(false);
  const [includePhrase, setIncludePhrase] = useState(true);
  const [includeExact, setIncludeExact] = useState(true);
  const [selectedNegatives, setSelectedNegatives] = useState<string[]>([
    'free',
    'crack',
    'torrent',
    'nulled',
    'jobs',
    'salary',
    'internship',
  ]);
  const [customNegatives, setCustomNegatives] = useState('');

  // 2. RSA Copy Tester State
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [displayPath1, setDisplayPath1] = useState('seo-tools');
  const [displayPath2, setDisplayPath2] = useState('audit');
  const [finalUrl, setFinalUrl] = useState(() => project.primaryUrl || 'https://toolverse.baby/workspace');

  const [headlines, setHeadlines] = useState<string[]>([
    'Free Technical SEO Site Audit',
    'Check Indexing & Broken Links',
    'Real-Time SEO Diagnostics',
    'No Credit Card Required',
    'Instant Crawl & Page Inspector',
  ]);

  const [descriptions, setDescriptions] = useState<string[]>([
    'Audit your entire website for technical SEO issues, canonical errors, and broken tags in seconds.',
    'Inspect on-page metadata, core web vitals proxies, and export white-label SEO client reports.',
  ]);

  // 3. Quality Score & Bid Simulator State
  const [targetCpc, setTargetCpc] = useState(2.5);
  const [qualityScore, setQualityScore] = useState(7);
  const [competitorMaxCpc, setCompetitorMaxCpc] = useState(3.0);
  const [competitorQualityScore, setCompetitorQualityScore] = useState(6);

  // Compute PPC Match Types
  const generatedKeywords = useMemo(() => {
    const rawLines = keywordInput
      .split('\n')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const rows: Array<{ keyword: string; matchType: 'Broad' | 'Phrase' | 'Exact'; formatted: string }> = [];

    for (const kw of rawLines) {
      if (includeBroad) {
        rows.push({ keyword: kw, matchType: 'Broad', formatted: kw });
      }
      if (includePhrase) {
        rows.push({ keyword: kw, matchType: 'Phrase', formatted: `"${kw}"` });
      }
      if (includeExact) {
        rows.push({ keyword: kw, matchType: 'Exact', formatted: `[${kw}]` });
      }
    }
    return rows;
  }, [keywordInput, includeBroad, includePhrase, includeExact]);

  // Compute Negative Keywords
  const allNegativeKeywords = useMemo(() => {
    const custom = customNegatives
      .split('\n')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const combined = Array.from(new Set([...selectedNegatives, ...custom]));
    return combined;
  }, [selectedNegatives, customNegatives]);

  // RSA Ad Strength Calculation
  const adStrength = useMemo(() => {
    const validHeadlines = headlines.filter((h) => h.trim().length > 0);
    const validDescriptions = descriptions.filter((d) => d.trim().length > 0);

    let score = 0;
    const checks: { label: string; passed: boolean }[] = [];

    // Min 3 headlines
    const hCountPassed = validHeadlines.length >= 3;
    checks.push({ label: 'At least 3 distinct headlines', passed: hCountPassed });
    if (hCountPassed) score += 25;

    // Optimal headline length (15-30 chars)
    const hLenPassed = validHeadlines.some((h) => h.length >= 15 && h.length <= 30);
    checks.push({ label: 'Headlines with 15-30 characters', passed: hLenPassed });
    if (hLenPassed) score += 25;

    // At least 2 descriptions
    const dCountPassed = validDescriptions.length >= 2;
    checks.push({ label: 'At least 2 rich descriptions', passed: dCountPassed });
    if (dCountPassed) score += 25;

    // Optimal description length (60-90 chars)
    const dLenPassed = validDescriptions.some((d) => d.length >= 60 && d.length <= 90);
    checks.push({ label: 'Descriptions with 60-90 characters', passed: dLenPassed });
    if (dLenPassed) score += 25;

    let tier: 'Poor' | 'Average' | 'Good' | 'Excellent' = 'Poor';
    if (score >= 90) tier = 'Excellent';
    else if (score >= 70) tier = 'Good';
    else if (score >= 50) tier = 'Average';

    return { score, tier, checks };
  }, [headlines, descriptions]);

  // Google Ads Auction Simulator Calculation
  const simulatorResult = useMemo(() => {
    // Google Ads Formula: Ad Rank = Max CPC * Quality Score
    const yourAdRank = targetCpc * qualityScore;
    const competitorAdRank = competitorMaxCpc * competitorQualityScore;

    // Actual CPC = (Competitor Ad Rank / Your Quality Score) + $0.01
    const actualCpc = yourAdRank >= competitorAdRank
      ? Math.min(targetCpc, +(competitorAdRank / Math.max(1, qualityScore) + 0.01).toFixed(2))
      : targetCpc;

    const rankPosition = yourAdRank >= competitorAdRank ? 1 : 2;
    const savingsPercent = targetCpc > 0 ? Math.round(((targetCpc - actualCpc) / targetCpc) * 100) : 0;

    return {
      yourAdRank: +yourAdRank.toFixed(2),
      competitorAdRank: +competitorAdRank.toFixed(2),
      actualCpc,
      rankPosition,
      savingsPercent: Math.max(0, savingsPercent),
    };
  }, [targetCpc, qualityScore, competitorMaxCpc, competitorQualityScore]);

  // Export Google Ads Editor CSV
  const exportEditorCsv = () => {
    const headers = ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type'];
    const rows = generatedKeywords.map((k) => [
      `"${campaignName}"`,
      `"${adGroupName}"`,
      `"${k.keyword}"`,
      k.matchType,
    ]);

    // Negative keywords rows
    for (const neg of allNegativeKeywords) {
      rows.push([`"${campaignName}"`, `"${adGroupName}"`, `"-${neg}"`, 'Negative']);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `google-ads-keywords-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleShell
      title="Advertising & PPC Intelligence"
      purpose="Plan PPC search campaigns, generate exact match types, build negative keyword lists, test Responsive Search Ads (RSA), and simulate Ad Rank."
      honesty="Production PPC planning tools. Generates formatted campaign structures and Google Ads Editor CSV exports. Bids and Ad Ranks are calculated using Google's published auction formula."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('ppc-keywords')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ppc-keywords'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          PPC Keyword Match Types & Negatives
        </button>
        <button
          onClick={() => setActiveTab('copy')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'copy'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Responsive Search Ad (RSA) Tester
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Quality Score & Bid Simulator
        </button>
      </div>

      {notice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: PPC Keywords */}
      {activeTab === 'ppc-keywords' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Seed Keywords & Campaign">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Campaign Name</label>
                    <input
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Ad Group Name</label>
                    <input
                      value={adGroupName}
                      onChange={(e) => setAdGroupName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Seed Keywords (One per line)</label>
                    <textarea
                      rows={6}
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Match Types to Generate</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeBroad}
                          onChange={(e) => setIncludeBroad(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Broad Match (e.g. <code>keyword</code>)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePhrase}
                          onChange={(e) => setIncludePhrase(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Phrase Match (e.g. <code>&quot;keyword&quot;</code>)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeExact}
                          onChange={(e) => setIncludeExact(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Exact Match (e.g. <code>[keyword]</code>)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Panel>

              {/* Negative Keywords Panel */}
              <Panel title="Negative Keyword Filters">
                <p className="text-xs text-slate-500 mb-3">
                  Prevent wasted spend by filtering out non-converting search intents.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    'free',
                    'crack',
                    'torrent',
                    'nulled',
                    'jobs',
                    'salary',
                    'careers',
                    'diy',
                    'internship',
                    'cheap',
                    'pdf download',
                  ].map((neg) => {
                    const active = selectedNegatives.includes(neg);
                    return (
                      <button
                        key={neg}
                        type="button"
                        onClick={() => {
                          setSelectedNegatives(
                            active ? selectedNegatives.filter((n) => n !== neg) : [...selectedNegatives, neg]
                          );
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition ${
                          active
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {active ? `-${neg} ✕` : `+ ${neg}`}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Custom Negatives (One per line)</label>
                  <textarea
                    rows={3}
                    value={customNegatives}
                    onChange={(e) => setCustomNegatives(e.target.value)}
                    placeholder="wholesale&#10;reddit&#10;login"
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
              </Panel>
            </div>

            {/* Generated Keywords Table & Export */}
            <div className="lg:col-span-7 space-y-4">
              <Panel title={`Formatted PPC Keywords (${generatedKeywords.length})`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="text-xs text-slate-500">
                    Active negatives: <span className="font-bold text-red-600">{allNegativeKeywords.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(generatedKeywords.map((k) => k.formatted).join('\n'))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Formatted
                    </button>
                    <button
                      type="button"
                      onClick={exportEditorCsv}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Google Ads CSV
                    </button>
                  </div>
                </div>

                <div className="max-h-[380px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {generatedKeywords.map((row, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {row.formatted}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.matchType === 'Exact'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : row.matchType === 'Phrase'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {row.matchType}
                      </span>
                    </div>
                  ))}
                  {generatedKeywords.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                      Please check at least one match type and input seed keywords.
                    </div>
                  )}
                </div>

                {allNegativeKeywords.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Negative Keywords</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {allNegativeKeywords.map((neg) => (
                        <span key={neg} className="px-2 py-0.5 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded font-mono text-[11px] border border-red-200 dark:border-red-900">
                          -{neg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RSA Copy Tester */}
      {activeTab === 'copy' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Headlines & Descriptions Editor */}
            <div className="lg:col-span-6 space-y-4">
              <Panel title="Headlines (Max 30 characters each)">
                <div className="space-y-2.5">
                  {headlines.map((hl, i) => {
                    const isOver = hl.length > 30;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 w-5 text-right">{i + 1}</span>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={hl}
                            maxLength={40}
                            onChange={(e) => {
                              const next = [...headlines];
                              next[i] = e.target.value;
                              setHeadlines(next);
                            }}
                            className={`w-full pr-12 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                              isOver
                                ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                            }`}
                          />
                          <span
                            className={`absolute right-2 top-2 text-[10px] font-bold ${
                              isOver ? 'text-red-600' : 'text-slate-400'
                            }`}
                          >
                            {hl.length}/30
                          </span>
                        </div>
                        {headlines.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setHeadlines(headlines.filter((_, idx) => idx !== i))}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {headlines.length < 15 && (
                    <button
                      type="button"
                      onClick={() => setHeadlines([...headlines, ''])}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Headline ({headlines.length}/15)
                    </button>
                  )}
                </div>
              </Panel>

              <Panel title="Descriptions (Max 90 characters each)">
                <div className="space-y-3">
                  {descriptions.map((desc, i) => {
                    const isOver = desc.length > 90;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-500">Description {i + 1}</span>
                          <span className={`font-bold ${isOver ? 'text-red-600' : 'text-slate-400'}`}>
                            {desc.length}/90
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            maxLength={110}
                            value={desc}
                            onChange={(e) => {
                              const next = [...descriptions];
                              next[i] = e.target.value;
                              setDescriptions(next);
                            }}
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-medium ${
                              isOver
                                ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                            }`}
                          />
                          {descriptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setDescriptions(descriptions.filter((_, idx) => idx !== i))}
                              className="text-slate-400 hover:text-red-500 p-1 mt-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {descriptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setDescriptions([...descriptions, ''])}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Description ({descriptions.length}/4)
                    </button>
                  )}
                </div>
              </Panel>
            </div>

            {/* Live Sponsored SERP Preview & Ad Strength */}
            <div className="lg:col-span-6 space-y-4">
              <Panel title="Google Ads Strength Score">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-slate-500">Ad Strength</div>
                    <div
                      className={`text-xl font-black ${
                        adStrength.tier === 'Excellent'
                          ? 'text-emerald-600'
                          : adStrength.tier === 'Good'
                          ? 'text-blue-600'
                          : adStrength.tier === 'Average'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {adStrength.tier} ({adStrength.score}/100)
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        adStrength.score >= 80 ? 'bg-emerald-500' : adStrength.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${adStrength.score}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {adStrength.checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {c.passed ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className={c.passed ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Live Preview Card */}
              <Panel title="Sponsored Search Result Preview">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">Google Search Preview</span>
                  <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 flex items-center gap-1 ${
                        previewDevice === 'mobile' ? 'bg-indigo-600 text-white font-bold' : 'bg-transparent text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" /> Mobile
                    </button>
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2.5 py-1 flex items-center gap-1 ${
                        previewDevice === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'bg-transparent text-slate-600'
                      }`}
                    >
                      <Monitor className="w-3 h-3" /> Desktop
                    </button>
                  </div>
                </div>

                {/* Google SERP Simulated Card */}
                <div
                  className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
                    previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 mb-1">
                    <span className="font-bold text-[11px] text-slate-900 dark:text-white">Sponsored</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 dark:text-slate-400 truncate">
                      {finalUrl.replace(/^https?:\/\//, '').split('/')[0]}
                      {displayPath1 && ` > ${displayPath1}`}
                      {displayPath2 && ` > ${displayPath2}`}
                    </span>
                  </div>

                  <h3 className="text-base text-blue-700 dark:text-blue-400 font-medium hover:underline cursor-pointer leading-snug">
                    {headlines.filter(Boolean).slice(0, 3).join(' | ') || 'Your Ad Headline Here'}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {descriptions.filter(Boolean).join(' ') || 'Your descriptions will appear here in the live Google Ads auction preview.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      createTask({
                        title: `Review RSA Copy for Campaign: ${campaignName}`,
                        category: 'content',
                        priority: 'high',
                        suggestedFix: `Headlines: ${headlines.filter(Boolean).slice(0, 3).join(' | ')}`,
                      });
                      setNotice('Ad copy task saved to Task Manager!');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Create Task for this Ad Copy
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Headlines:\n${headlines.filter(Boolean).join('\n')}\n\nDescriptions:\n${descriptions.filter(Boolean).join('\n')}`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy All Copy
                  </button>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Quality Score & Bid Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <Panel title="Google Ads Auction Parameters">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Your Max CPC Bid ($)</span>
                      <span className="font-bold text-indigo-600">${targetCpc.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={10.0}
                      step={0.25}
                      value={targetCpc}
                      onChange={(e) => setTargetCpc(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Your Quality Score (1-10)</span>
                      <span className="font-bold text-indigo-600">{qualityScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={qualityScore}
                      onChange={(e) => setQualityScore(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-500 mb-2">Closest Competitor in Auction</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-500">Competitor Max CPC</label>
                        <input
                          type="number"
                          step={0.1}
                          value={competitorMaxCpc}
                          onChange={(e) => setCompetitorMaxCpc(parseFloat(e.target.value) || 0)}
                          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500">Competitor Quality Score</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={competitorQualityScore}
                          onChange={(e) => setCompetitorQualityScore(parseInt(e.target.value, 10) || 1)}
                          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <Panel title="Auction Simulation Results">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Your Ad Rank</div>
                    <div className="text-2xl font-black text-indigo-600">{simulatorResult.yourAdRank}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Bid × QS ({targetCpc} × {qualityScore})</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500">Competitor Ad Rank</div>
                    <div className="text-2xl font-black text-slate-600 dark:text-slate-300">
                      {simulatorResult.competitorAdRank}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Bid × QS ({competitorMaxCpc} × {competitorQualityScore})</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Expected SERP Position:
                    </span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                      Position #{simulatorResult.rankPosition} {simulatorResult.rankPosition === 1 ? '🏆' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Actual Cost Per Click (CPC):
                    </span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                      ${simulatorResult.actualCpc.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 pt-1 border-t border-emerald-200 dark:border-emerald-800">
                    <span>Discount vs Max Bid:</span>
                    <span className="font-bold">{simulatorResult.savingsPercent}% saved through Quality Score</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed mt-2">
                  <strong>The Quality Score Advantage:</strong> Increasing your landing page relevance, CTR, and on-page technical health boosts your Quality Score, directly lowering your actual cost per click while keeping you above competitors with higher bids.
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
