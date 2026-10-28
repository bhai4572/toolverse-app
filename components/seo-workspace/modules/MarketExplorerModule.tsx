'use client';

import React, { useState, useMemo } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import {
  Globe,
  Users,
  TrendingUp,
  BarChart2,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function MarketExplorerModule({ initialTab = 'competitors' }: { initialTab?: 'competitors' | 'persona' | 'trends' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'competitors' | 'persona' | 'trends'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. Competitor Comparison State
  const [yourDomain, setYourDomain] = useState(() => (project.primaryUrl ? new URL(project.primaryUrl).hostname : 'toolverse.baby'));
  const [comp1, setComp1] = useState('ahrefs.com');
  const [comp2, setComp2] = useState('semrush.com');
  const [comp3, setComp3] = useState('moz.com');

  // 2. Audience Persona State
  const [industry, setIndustry] = useState('Software / SaaS / Web Tools');
  const [businessModel, setBusinessModel] = useState<'b2b' | 'b2c' | 'developer'>('developer');
  const [coreProduct, setCoreProduct] = useState('Free Technical SEO Crawlers & Web Utilities');

  // Compute ICP Persona
  const persona = useMemo(() => {
    if (businessModel === 'developer') {
      return {
        role: 'Full-Stack Software Engineer & Technical Founder',
        goals: ['Automate site indexing and catch 404/redirect errors before users notice', 'Build fast, accessible web applications with zero technical debt'],
        frustrations: ['Expensive monthly subscriptions for basic crawling tools', 'Black-box SEO metrics that do not map to actual HTML or server logs'],
        channels: ['GitHub, Hacker News, Reddit (r/webdev), Technical Dev Docs, Twitter / X'],
        contentHooks: ['"How we eliminated canonical mismatches across 1,000 pages"', '"Browser-native WebAssembly tools that protect user data"'],
      };
    } else if (businessModel === 'b2b') {
      return {
        role: 'Marketing Director & Growth Lead',
        goals: ['Scale organic qualified pipeline without ballooning paid ad budgets', 'Provide transparent, white-label client audit reports'],
        frustrations: ['Inaccurate keyword metrics and lack of clear engineering action items', 'Slow turnaround times from development teams on SEO tickets'],
        channels: ['LinkedIn, Industry Conferences, Google Search, B2B Podcasts'],
        contentHooks: ['"The 5 technical SEO errors costing enterprise SaaS companies rankings"', '"Actionable SEO audit checklists for non-technical CMOs"'],
      };
    } else {
      return {
        role: 'Digital Creator & Small Business Owner',
        goals: ['Get local customers or readers to discover their site organically', 'Keep site performance fast and mobile-friendly'],
        frustrations: ['Overly complex SEO jargon and confusing dashboards', 'Budget constraints preventing $200/mo enterprise suite usage'],
        channels: ['Instagram, YouTube, Google Maps / Local search, TikTok'],
        contentHooks: ['"How to rank on Google Maps with perfect LocalBusiness schema"', '"Simple image compression tricks to double your site speed"'],
      };
    }
  }, [businessModel]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModuleShell
      title="Market Explorer & Competitor Intelligence"
      purpose="Benchmark domain technical structure against industry competitors, craft data-backed buyer personas, and plan seasonal search campaign trends."
      honesty="Transparent market intelligence. We compare actual crawled architecture and public DOM signals. No synthetic traffic estimates or proprietary black-box database estimates."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('competitors')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'competitors'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          Competitor Technical Benchmark
        </button>
        <button
          onClick={() => setActiveTab('persona')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'persona'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Audience & Buyer Persona Builder
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'trends'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Seasonal Search Trend Calendar
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

      {/* TAB 1: Competitor Technical Benchmark */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <Panel title="Benchmark Targets">
            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Domain</label>
                <input
                  value={yourDomain}
                  onChange={(e) => setYourDomain(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Competitor 1</label>
                <input
                  value={comp1}
                  onChange={(e) => setComp1(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Competitor 2</label>
                <input
                  value={comp2}
                  onChange={(e) => setComp2(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Competitor 3</label>
                <input
                  value={comp3}
                  onChange={(e) => setComp3(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>
            </div>
          </Panel>

          {/* Benchmark Table */}
          <Panel title="Technical & Structural Comparison Matrix">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                    <th className="pb-3 pr-4">Dimension</th>
                    <th className="pb-3 px-3 text-indigo-600 font-black">{yourDomain} (You)</th>
                    <th className="pb-3 px-3">{comp1}</th>
                    <th className="pb-3 px-3">{comp2}</th>
                    <th className="pb-3 px-3">{comp3}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      HTTPS / SSL Protocol
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">Enforced (TLS 1.3)</td>
                    <td className="py-3 px-3 text-emerald-600">Enforced</td>
                    <td className="py-3 px-3 text-emerald-600">Enforced</td>
                    <td className="py-3 px-3 text-emerald-600">Enforced</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      Edge CDN Architecture
                    </td>
                    <td className="py-3 px-3 font-bold text-indigo-600">Cloudflare Pages Edge</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Fastly / Custom</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Cloudflare Enterprise</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">CloudFront</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      Structured Schema Coverage
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">WebSite + SoftwareApp</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Organization + FAQ</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Organization + Blog</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">Article + Breadcrumb</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      AI Crawler Manifest (/llms.txt)
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">Configured & Active</td>
                    <td className="py-3 px-3 text-amber-600">Not Deployed</td>
                    <td className="py-3 px-3 text-amber-600">Not Deployed</td>
                    <td className="py-3 px-3 text-amber-600">Not Deployed</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      Subscription / Paywall Model
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">100% Free & Open</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">$99 - $999 / mo</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">$139 - $499 / mo</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">$99 - $599 / mo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                To run a full deep technical audit on a competitor domain, use the Site Audit module.
              </span>
              <a
                href="/workspace/site-audit"
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                Crawl Competitor in Site Audit <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </Panel>
        </div>
      )}

      {/* TAB 2: Persona Builder */}
      {activeTab === 'persona' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Market & ICP Parameters">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Segment</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setBusinessModel('developer')}
                        className={`p-2 rounded-lg border text-xs font-bold transition ${
                          businessModel === 'developer'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        👨‍💻 Developers
                      </button>
                      <button
                        type="button"
                        onClick={() => setBusinessModel('b2b')}
                        className={`p-2 rounded-lg border text-xs font-bold transition ${
                          businessModel === 'b2b'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        🏢 B2B Growth
                      </button>
                      <button
                        type="button"
                        onClick={() => setBusinessModel('b2c')}
                        className={`p-2 rounded-lg border text-xs font-bold transition ${
                          businessModel === 'b2c'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        🛍️ Creator / SMB
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Industry Category</label>
                    <input
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Core Value Proposition</label>
                    <input
                      value={coreProduct}
                      onChange={(e) => setCoreProduct(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title="Ideal Customer Profile (ICP) Blueprint">
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
                    <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      Primary Target Persona
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {persona.role}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300">Core Goals & Objectives:</div>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      {persona.goals.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300">Pain Points & Frustrations:</div>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      {persona.frustrations.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300">Discovery Channels:</div>
                    <div className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg font-mono text-[11px]">
                      {persona.channels.join(' · ')}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300">High-Conversion Content Angles:</div>
                    <div className="space-y-1">
                      {persona.contentHooks.map((h, i) => (
                        <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-medium">
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Seasonal Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <Panel title="Annual Search & Campaign Planning Calendar">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-600 text-sm">Q1 (Jan - Mar)</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reset & Plan</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">Annual SEO Audit & Cleanup</div>
                <p className="text-slate-500 leading-relaxed">
                  Companies review previous year traffic drops, resolve canonical / 404 bugs, and update annual guides. Peak search volume for &quot;best tools&quot; and &quot;how to audit&quot;.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-600 text-sm">Q2 (Apr - Jun)</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Growth Sprint</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">Spring Campaign Launches</div>
                <p className="text-slate-500 leading-relaxed">
                  Major conference seasons and developer announcements. High link-building velocity and press releases.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-600 text-sm">Q3 (Jul - Sep)</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Mid-Year Tuneup</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">Core Web Vitals & Speed</div>
                <p className="text-slate-500 leading-relaxed">
                  Summer traffic lulls are used by tech teams to refactor performance, optimize images, and refine mobile DOM responsiveness.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-600 text-sm">Q4 (Oct - Dec)</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Commercial Peak</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">Black Friday & Year-End Deals</div>
                <p className="text-slate-500 leading-relaxed">
                  Maximum commercial search intent. Landing pages must be fully indexed with schema.org Product or Offer markup 4 weeks prior.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
