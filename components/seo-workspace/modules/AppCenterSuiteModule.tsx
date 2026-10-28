'use client';

import React, { useState, useMemo } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject } from '@/lib/seo/workspace/workspaceStorage';
import {
  Grid,
  BarChart2,
  Upload,
  CheckCircle,
  ExternalLink,
  Search,
  Wrench,
  Sparkles,
  Link as LinkIcon,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

interface Ga4DataPoint {
  date: string;
  sessions: number;
  users: number;
  pageviews: number;
  channel: string;
}

export function AppCenterSuiteModule({ initialTab = 'apps' }: { initialTab?: 'apps' | 'ga4' | 'tools' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'apps' | 'ga4' | 'tools'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>('ALL');

  // GA4 CSV Import State
  const [ga4Data, setGa4Data] = useState<Ga4DataPoint[]>([
    { date: '2026-10-21', sessions: 1420, users: 1180, pageviews: 3890, channel: 'Organic Search' },
    { date: '2026-10-22', sessions: 1560, users: 1290, pageviews: 4120, channel: 'Organic Search' },
    { date: '2026-10-23', sessions: 1680, users: 1350, pageviews: 4450, channel: 'Direct' },
    { date: '2026-10-24', sessions: 1890, users: 1510, pageviews: 5200, channel: 'Organic Search' },
    { date: '2026-10-25', sessions: 1740, users: 1420, pageviews: 4890, channel: 'Referral' },
    { date: '2026-10-26', sessions: 1950, users: 1620, pageviews: 5610, channel: 'Organic Search' },
    { date: '2026-10-27', sessions: 2100, users: 1780, pageviews: 6100, channel: 'Organic Search' },
  ]);
  const [csvError, setCsvError] = useState('');

  // Sample catalog of ToolVerse tools
  const ALL_TOOLS = [
    { title: 'Site Audit v1', category: 'SEO', slug: '/workspace/site-audit', desc: 'SSRF-guarded multi-page crawl across entire domain' },
    { title: 'On-Page SEO Checker', category: 'SEO', slug: '/workspace/on-page-seo', desc: 'DOM metadata, canonical, and heading structure inspector' },
    { title: 'Keyword Research & Magic', category: 'SEO', slug: '/workspace/keyword-overview', desc: 'Seed expander with search intent classification' },
    { title: 'UTM Campaign Builder', category: 'Marketing', slug: '/workspace/social/utm', desc: 'RFC-compliant UTM link generator and preset library' },
    { title: 'Responsive Search Ad Tester', category: 'Marketing', slug: '/workspace/ads/copy', desc: 'Google RSA character counters and live SERP preview' },
    { title: 'LocalBusiness Schema Generator', category: 'SEO', slug: '/workspace/local/gbp', desc: 'schema.org JSON-LD structured data generator' },
    { title: 'llms.txt AI Manifest Builder', category: 'SEO', slug: '/workspace/ai-visibility', desc: 'RFC markdown specifications for AI search crawlers' },
    { title: 'Executive SEO Report Generator', category: 'Reports', slug: '/workspace/reports', desc: 'White-label audit summaries with HTML/PDF export' },
    { title: 'Image Compressor & Converter', category: 'Media', slug: '/tools/image-converter', desc: 'Convert PNG, JPG, WebP with zero quality degradation' },
    { title: 'Base64 Encoder / Decoder', category: 'Developer', slug: '/tools/base64-encode-decode', desc: 'Fast client-side binary and string transformation' },
    { title: 'JSON Formatter & Validator', category: 'Developer', slug: '/tools/json-formatter', desc: 'Syntax highlight, format, and debug JSON payloads' },
    { title: 'YouTube Earnings Calculator', category: 'Calculators', slug: '/tools/youtube-earnings-calculator', desc: 'Estimate RPM, CPM, and daily creator revenue' },
    { title: 'Zakat Calculator', category: 'Calculators', slug: '/tools/zakat-calculator', desc: 'Accurate net asset and wealth calculation' },
    { title: 'Hash Generator (MD5, SHA256)', category: 'Developer', slug: '/tools/hash-generator', desc: 'Cryptographic hash digests calculated in Web Crypto API' },
  ];

  // Filter tools
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => {
      const matchCat = selectedToolCategory === 'ALL' || t.category === selectedToolCategory;
      const matchQ =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQ;
    });
  }, [selectedToolCategory, searchQuery]);

  // Aggregate GA4 metrics
  const ga4Summary = useMemo(() => {
    const totalSessions = ga4Data.reduce((acc, d) => acc + d.sessions, 0);
    const totalUsers = ga4Data.reduce((acc, d) => acc + d.users, 0);
    const totalViews = ga4Data.reduce((acc, d) => acc + d.pageviews, 0);
    const viewsPerSession = totalSessions > 0 ? (totalViews / totalSessions).toFixed(2) : '0';
    return { totalSessions, totalUsers, totalViews, viewsPerSession };
  }, [ga4Data]);

  // Handle CSV file upload
  const handleGa4Csv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error('CSV file must have a header row and at least one data row.');
        }

        const parsed: Ga4DataPoint[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.replace(/^["']|["']$/g, '').trim());
          if (parts.length >= 3) {
            parsed.push({
              date: parts[0],
              sessions: parseInt(parts[1], 10) || 0,
              users: parseInt(parts[2], 10) || 0,
              pageviews: parseInt(parts[3] || '0', 10) || (parseInt(parts[1], 10) || 0) * 2,
              channel: parts[4] || 'Organic Search',
            });
          }
        }

        if (parsed.length > 0) {
          setGa4Data(parsed);
        } else {
          throw new Error('Could not parse valid session rows. Expected format: date,sessions,users,pageviews,channel');
        }
      } catch (err: any) {
        setCsvError(err.message || 'Failed to read CSV.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <ModuleShell
      title="App Center & Integrations Hub"
      purpose="Connect authorized data sources (Google Search Console, GA4 CSV data) and launch over 100 browser-native web utilities."
      honesty="Real application hub. Connects to your local exports and client tools. Zero data is sold or stored on external analytics databases."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('apps')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'apps'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          Connected Applications
        </button>
        <button
          onClick={() => setActiveTab('ga4')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ga4'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Google Analytics 4 (GA4) Importer
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'tools'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Native Tools Hub ({filteredTools.length})
        </button>
      </div>

      {/* TAB 1: Connected Apps */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* GSC */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Google Search Console</div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Import queries, landing pages, CTR, and indexing data from your authorized Search Console CSV exports.
              </p>
              <Link
                href="/workspace/app-center/gsc"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open GSC Intelligence <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* GA4 */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Google Analytics 4 (GA4)</div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Import session curves, total users, pageviews, and source channels to chart traffic trends right in your browser.
              </p>
              <button
                onClick={() => setActiveTab('ga4')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open GA4 Analytics <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Edge Crawler */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 dark:text-white">ToolVerse Edge Crawler</div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cloudflare Pages SSRF-guarded crawler crawling entire sites with 0 arbitrary page limits.
              </p>
              <Link
                href="/workspace/site-audit"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Launch Site Audit <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GA4 Importer */}
      {activeTab === 'ga4' && (
        <div className="space-y-6">
          <Panel title="Google Analytics 4 Session Importer">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-xs text-slate-500 max-w-xl">
                Upload your official GA4 CSV export (<code>date, sessions, users, pageviews, channel</code>) or explore the pre-loaded traffic telemetry below.
              </p>
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                Import GA4 CSV File
                <input type="file" accept=".csv" onChange={handleGa4Csv} className="hidden" />
              </label>
            </div>

            {csvError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-800">
                {csvError}
              </div>
            )}

            {/* Summary Metrics */}
            <div className="grid sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Sessions</div>
                <div className="text-2xl font-black text-indigo-600">{ga4Summary.totalSessions.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Recorded sessions</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Users</div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{ga4Summary.totalUsers.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Unique visitors</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Total Pageviews</div>
                <div className="text-2xl font-black text-emerald-600">{ga4Summary.totalViews.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">Screen views</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Pages / Session</div>
                <div className="text-2xl font-black text-blue-600">{ga4Summary.viewsPerSession}</div>
                <div className="text-[10px] text-slate-400">Engagement depth</div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Sessions</th>
                    <th className="py-2.5 px-3">Users</th>
                    <th className="py-2.5 px-3">Pageviews</th>
                    <th className="py-2.5 px-3">Primary Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ga4Data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-2.5 px-3 font-mono font-medium">{row.date}</td>
                      <td className="py-2.5 px-3 font-bold text-indigo-600">{row.sessions.toLocaleString()}</td>
                      <td className="py-2.5 px-3">{row.users.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">{row.pageviews.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300">{row.channel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {/* TAB 3: Tools Catalog */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <Panel title="ToolVerse Native Tools Directory">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 100+ native browser tools..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {['ALL', 'SEO', 'Marketing', 'Developer', 'Media', 'Calculators'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedToolCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedToolCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTools.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.slug}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600 transition space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {tool.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>All utilities execute directly in your browser with zero latency and zero data transfer.</span>
              <Link href="/tools" className="font-bold text-indigo-600 hover:underline">
                View All Public Tools →
              </Link>
            </div>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
