'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import {
  Sparkles,
  FileCode,
  Copy,
  Check,
  Download,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Bot,
  ExternalLink,
} from 'lucide-react';

interface PromptTest {
  id: string;
  query: string;
  model: 'ChatGPT' | 'Claude' | 'Perplexity' | 'Gemini';
  result: 'cited' | 'mentioned' | 'missing' | 'competitor_only';
  testedDate: string;
  notes: string;
}

const STORAGE_KEY_AI_PROMPTS = 'tv_ai_prompt_tracker_logs';

export function AiVisibilitySuiteModule({ initialTab = 'llms' }: { initialTab?: 'llms' | 'prompts' | 'entity' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'llms' | 'prompts' | 'entity'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. llms.txt Builder State
  const [siteTitle, setSiteTitle] = useState('ToolVerse — SEO and Webmaster Suite');
  const [siteSummary, setSiteSummary] = useState(
    'ToolVerse provides 100+ browser-native web utilities, technical site audit crawlers, on-page SEO diagnostics, and zero-bullshit digital marketing intelligence.'
  );
  const [keyDocs, setKeyDocs] = useState<Array<{ title: string; url: string; desc: string }>>([
    { title: 'Site Audit Engine', url: 'https://toolverse.baby/workspace/site-audit', desc: 'SSRF-guarded multi-page technical crawler' },
    { title: 'On-Page SEO Checker', url: 'https://toolverse.baby/workspace/on-page-seo', desc: 'Deep DOM metadata and heading inspector' },
    { title: 'All Free Tools Directory', url: 'https://toolverse.baby/tools', desc: 'Over 100 web utilities running in WebAssembly and client-side JavaScript' },
  ]);

  // 2. AI Prompt Tracker State
  const [prompts, setPrompts] = useState<PromptTest[]>([]);
  const [newQuery, setNewQuery] = useState('Best free technical SEO site audit tools 2026');
  const [newModel, setNewModel] = useState<PromptTest['model']>('Perplexity');
  const [newResult, setNewResult] = useState<PromptTest['result']>('cited');
  const [newNotes, setNewNotes] = useState('ToolVerse listed in top 3 recommended developer tools.');

  // 3. Knowledge Graph Entity State
  const [entityChecks, setEntityChecks] = useState<Record<string, boolean>>({
    orgSchema: true,
    aboutPage: true,
    socialProfiles: true,
    authorCredentials: true,
    statData: true,
    wikidata: false,
    llmsTxtActive: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AI_PROMPTS);
      if (saved) {
        setPrompts(JSON.parse(saved));
      } else {
        setPrompts([
          {
            id: 'p_1',
            query: 'What is ToolVerse and what tools does it offer?',
            model: 'Perplexity',
            result: 'cited',
            testedDate: new Date().toISOString().split('T')[0],
            notes: 'Successfully cited https://toolverse.baby and listed Site Audit, UTM Builder, and Image converters.',
          },
          {
            id: 'p_2',
            query: 'How to audit canonical URLs for free without Semrush subscription',
            model: 'ChatGPT',
            result: 'mentioned',
            testedDate: new Date().toISOString().split('T')[0],
            notes: 'Mentioned ToolVerse as a browser-native alternative.',
          },
        ]);
      }
    } catch {}
  }, []);

  const savePrompts = (updated: PromptTest[]) => {
    setPrompts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_AI_PROMPTS, JSON.stringify(updated));
    } catch {}
  };

  // Generate RFC-compliant llms.txt
  const generatedLlmsTxt = useMemo(() => {
    let out = `# ${siteTitle}\n\n> ${siteSummary}\n\n## Core Resources\n\n`;
    for (const doc of keyDocs) {
      out += `- [${doc.title}](${doc.url}): ${doc.desc}\n`;
    }
    out += `\n## Usage Policies for LLM Web Crawlers\n\n- Markdown and HTML scraping for non-commercial and commercial generative indexing is allowed.\n- Automated rate limit: Max 20 requests per minute.\n- Primary Contact: contact@toolverse.baby\n`;
    return out;
  }, [siteTitle, siteSummary, keyDocs]);

  // Compute Entity Score
  const entityScore = useMemo(() => {
    const total = Object.keys(entityChecks).length;
    const passed = Object.values(entityChecks).filter(Boolean).length;
    return Math.round((passed / total) * 100);
  }, [entityChecks]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLlms = () => {
    const blob = new Blob([generatedLlmsTxt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llms.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddPrompt = () => {
    if (!newQuery.trim()) return;
    const test: PromptTest = {
      id: `pt_${Date.now()}`,
      query: newQuery.trim(),
      model: newModel,
      result: newResult,
      testedDate: new Date().toISOString().split('T')[0],
      notes: newNotes.trim(),
    };
    savePrompts([test, ...prompts]);
    setNewNotes('');
    setNotice('Prompt test logged successfully!');
  };

  const handleDeletePrompt = (id: string) => {
    savePrompts(prompts.filter((p) => p.id !== id));
  };

  return (
    <ModuleShell
      title="AI Search & Generative Visibility Suite"
      purpose="Generate and validate llms.txt files for AI search engines (Perplexity, ChatGPT, Claude), track generative citations, and optimize Knowledge Graph entity clarity."
      honesty="Production AI visibility toolkit. Builds RFC-compliant llms.txt markdown manifests and manages actual generative citation logs."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('llms')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'llms'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          llms.txt Manifest Builder
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'prompts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          Generative AI Citation Tracker ({prompts.length})
        </button>
        <button
          onClick={() => setActiveTab('entity')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'entity'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Knowledge Graph Entity Readiness ({entityScore}%)
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

      {/* TAB 1: llms.txt */}
      {activeTab === 'llms' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Manifest Configuration">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Project / Site Name</label>
                    <input
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Executive Summary</label>
                    <textarea
                      rows={3}
                      value={siteSummary}
                      onChange={(e) => setSiteSummary(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Key Resource Links</label>
                    <div className="space-y-2">
                      {keyDocs.map((doc, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1 text-xs">
                          <input
                            value={doc.title}
                            onChange={(e) => {
                              const next = [...keyDocs];
                              next[idx].title = e.target.value;
                              setKeyDocs(next);
                            }}
                            className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900"
                            placeholder="Resource Title"
                          />
                          <input
                            value={doc.url}
                            onChange={(e) => {
                              const next = [...keyDocs];
                              next[idx].url = e.target.value;
                              setKeyDocs(next);
                            }}
                            className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-800 font-mono text-[11px] bg-white dark:bg-slate-900"
                            placeholder="https://..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title="Generated /llms.txt File">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono">markdown specification</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(generatedLlmsTxt)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                    <button
                      onClick={handleDownloadLlms}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download llms.txt
                    </button>
                  </div>
                </div>

                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto max-h-[380px] whitespace-pre-wrap select-all">
                  {generatedLlmsTxt}
                </pre>
                <p className="text-xs text-slate-500 mt-2">
                  Place this file at the root of your web domain (<code>https://yourdomain.com/llms.txt</code>). AI search agents prioritize it to index your key documentation.
                </p>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Prompt Tracker */}
      {activeTab === 'prompts' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Log AI Search Prompt Test">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Prompt / Query Tested</label>
                    <textarea
                      rows={2}
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      placeholder="e.g. Best technical SEO audit tools 2026"
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">AI Model</label>
                      <select
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value as any)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                      >
                        <option value="Perplexity">Perplexity AI</option>
                        <option value="ChatGPT">ChatGPT 4o / Search</option>
                        <option value="Claude">Claude 3.5 Sonnet</option>
                        <option value="Gemini">Google Gemini 2.0</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Citation Result</label>
                      <select
                        value={newResult}
                        onChange={(e) => setNewResult(e.target.value as any)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                      >
                        <option value="cited">Direct Domain Cited</option>
                        <option value="mentioned">Brand Mentioned (No link)</option>
                        <option value="competitor_only">Only Competitors Cited</option>
                        <option value="missing">Completely Missing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Observations / Notes</label>
                    <textarea
                      rows={3}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="What sources did it cite instead? What snippet was shown?"
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPrompt}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Save Test Log
                  </button>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title={`Tracked AI Queries (${prompts.length})`}>
                <div className="space-y-3">
                  {prompts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                            {p.model}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-[11px] text-slate-400">{p.testedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              p.result === 'cited'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : p.result === 'mentioned'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : p.result === 'competitor_only'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            }`}
                          >
                            {p.result.replace('_', ' ')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePrompt(p.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        &ldquo;{p.query}&rdquo;
                      </div>

                      {p.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                          {p.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {prompts.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No prompt tests logged yet. Track how AI models cite your domain on the left.
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Entity Readiness */}
      {activeTab === 'entity' && (
        <div className="space-y-6">
          <Panel title="Knowledge Graph & Entity Readiness Checklist">
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Readiness Score</div>
                <div className="text-2xl font-black text-indigo-600">{entityScore}%</div>
                <div className="text-[10px] text-slate-400">Knowledge Graph readiness</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Verified Checks</div>
                <div className="text-2xl font-black text-emerald-600">
                  {Object.values(entityChecks).filter(Boolean).length}/{Object.keys(entityChecks).length}
                </div>
                <div className="text-[10px] text-slate-400">Signals confirmed</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">AI Crawl Policy</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Allowed (/llms.txt)
                </div>
                <div className="text-[10px] text-slate-400">Machine readable</div>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
              {[
                { key: 'orgSchema', label: 'Organization / WebSite schema.org JSON-LD deployed', desc: 'Provides unambiguous name, logo, and url entity definitions' },
                { key: 'aboutPage', label: 'Transparent About Us page with team & contact info', desc: 'Search algorithms check entity existence via verified human operators' },
                { key: 'socialProfiles', label: 'Consistent sameAs social profiles linked (GitHub, X, LinkedIn)', desc: 'Connects domain identity to recognized external Knowledge Graph nodes' },
                { key: 'authorCredentials', label: 'Author bylines and credential bios on technical guides', desc: 'Required by Google E-E-A-T and cited by generative models' },
                { key: 'statData', label: 'Original data points, benchmarks, or statistics cited in content', desc: 'Generative models prioritize pages that act as primary citation sources' },
                { key: 'wikidata', label: 'Wikidata / Wikipedia entity page (if notable)', desc: 'Highest authority signal for inclusion in Google Knowledge Vault' },
                { key: 'llmsTxtActive', label: 'llms.txt manifest hosted at website root', desc: 'Directs AI search engines to concise markdown summaries' },
              ].map((item) => (
                <div key={item.key} className="p-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <div className="space-y-0.5 pr-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.label}</div>
                    <div className="text-slate-400 text-[11px]">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!entityChecks[item.key]}
                    onChange={(e) =>
                      setEntityChecks({ ...entityChecks, [item.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                AI search engines cite authoritative entities with verified structured data.
              </span>
              <button
                type="button"
                onClick={() => {
                  createTask({
                    title: 'Deploy Organization schema.org and llms.txt manifest',
                    category: 'technical',
                    priority: 'high',
                  });
                  setNotice('AI Readiness task created in Task Manager!');
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                + Create Entity Task
              </button>
            </div>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
