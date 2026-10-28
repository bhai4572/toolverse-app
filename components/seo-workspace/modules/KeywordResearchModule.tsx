'use client';

import React, { useState } from 'react';
import { ModuleShell } from '../ModuleShell';
import {
  expandKeywords,
  clusterKeywords,
  type KeywordIdea,
  type KeywordIntent,
} from '@/lib/seo/keywords/keywordEngine';
import {
  getActiveProject,
  saveKeywords,
  getKeywords,
  deleteKeyword,
} from '@/lib/seo/workspace/workspaceStorage';
import type { KeywordItem } from '@/lib/seo/workspace/workspaceTypes';
import {
  Search,
  Sparkles,
  Download,
  PlusCircle,
  HelpCircle,
  ShoppingBag,
  Info,
  FolderTree,
  Trash2,
  Bookmark,
} from 'lucide-react';

export function KeywordResearchModule({ title = 'Keyword Research & Strategy' }: { title?: string }) {
  const project = getActiveProject();
  const [seed, setSeed] = useState('seo audit tool');
  const [ideas, setIdeas] = useState<KeywordIdea[]>(() => expandKeywords('seo audit tool'));
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'commercial' | 'clusters' | 'saved'>('all');
  const [savedKeywords, setSavedKeywords] = useState<KeywordItem[]>(() => getKeywords(project.id));
  const [notice, setNotice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim()) return;
    const expanded = expandKeywords(seed);
    setIdeas(expanded);
  };

  const handleSaveKeyword = (idea: KeywordIdea) => {
    const item: KeywordItem = {
      id: `kw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId: project.id,
      keyword: idea.keyword,
      intent: idea.intent,
      tags: [idea.category, 'Discovery'],
      provenance: 'algorithmic' as any,
      provenanceLabel: 'Semantic Intent Expansion',
      createdAt: new Date().toISOString(),
    };
    saveKeywords([item]);
    setSavedKeywords(getKeywords(project.id));
    setNotice(`Saved "${idea.keyword}" to project keyword repository.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    deleteKeyword(id);
    setSavedKeywords(getKeywords(project.id));
  };

  const handleExportCsv = (rows: Array<{ keyword: string; intent: string; category?: string }>) => {
    if (rows.length === 0) return;
    // Protect against spreadsheet formula injection
    const sanitize = (val: string) => {
      const trimmed = String(val).trim();
      if (/^[=+\-@\t\r]/.test(trimmed)) {
        return `"'${trimmed.replace(/"/g, '""')}"`;
      }
      return `"${trimmed.replace(/"/g, '""')}"`;
    };

    const header = 'Keyword,Intent,Category,Data Provenance\n';
    const body = rows
      .map(
        (r) =>
          `${sanitize(r.keyword)},${sanitize(r.intent)},${sanitize(
            r.category || 'General'
          )},"Semantic Expansion (ToolVerse Engine)"`
      )
      .join('\n');

    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keywords_${seed.replace(/[^a-z0-9]/gi, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (activeTab === 'questions') return idea.category === 'question';
    if (activeTab === 'commercial') return idea.category === 'commercial' || idea.category === 'comparison';
    return true;
  });

  const clusters = clusterKeywords(ideas);

  return (
    <ModuleShell
      title={title}
      purpose="Discover high-intent keyword expansions, question modifiers, and semantic topic clusters tailored to your site."
      honesty="Keywords are generated via algorithmic lexical expansion and intent classification. We do not invent arbitrary search volumes or fake CPC curves. Volume estimates require authorized Google Ads or DataForSEO credentials."
    >
      {/* Top Banner Notice */}
      {notice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className="underline hover:text-emerald-300"
          >
            View Saved ({savedKeywords.length})
          </button>
        </div>
      )}

      {/* Seed Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Enter seed topic (e.g., pdf editor, rank tracking, vegan recipes)..."
              className="w-full text-sm font-medium pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Explore Keywords
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Views:</span>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg font-semibold ${
                activeTab === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Ideas ({ideas.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                activeTab === 'questions'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Questions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('commercial')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                activeTab === 'commercial'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Commercial & Comparison
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clusters')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                activeTab === 'clusters'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Topic Clusters
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                activeTab === 'saved'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Project Repository ({savedKeywords.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleExportCsv(activeTab === 'saved' ? savedKeywords : filteredIdeas)}
            className="text-slate-400 hover:text-brand-400 font-semibold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Topic Clusters View */}
      {activeTab === 'clusters' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((cluster, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {cluster.rootTopic}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400">
                  {cluster.count} Terms
                </span>
              </div>
              <ul className="space-y-1 text-xs">
                {cluster.keywords.slice(0, 6).map((kw, i) => (
                  <li
                    key={i}
                    className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 font-medium text-slate-700 dark:text-slate-300 truncate"
                  >
                    {kw}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : activeTab === 'saved' ? (
        /* Saved Project Keywords View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Project Keywords Repository ({savedKeywords.length})
            </h3>
            <span className="text-xs text-slate-400">
              Scoped to project: <strong>{project.name}</strong>
            </span>
          </div>

          {savedKeywords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3">Keyword</th>
                    <th className="py-2 px-3">Intent</th>
                    <th className="py-2 px-3">Tags</th>
                    <th className="py-2 px-3">Provenance</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {savedKeywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {kw.keyword}
                      </td>
                      <td className="py-2.5 px-3">
                        <IntentBadge intent={kw.intent} />
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {kw.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {kw.provenanceLabel || kw.provenance}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteSaved(kw.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          title="Remove from project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No saved keywords yet for this project. Search above and click "+ Save" to build your target strategy.
            </p>
          )}
        </div>
      ) : (
        /* Discovery Ideas Table */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Keyword Suggestions ({filteredIdeas.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Categorized by search intent & semantic modifier
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Keyword Idea</th>
                  <th className="py-2.5 px-3">Intent</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Estimated Volume</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredIdeas.map((idea, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {idea.keyword}
                    </td>
                    <td className="py-3 px-3">
                      <IntentBadge intent={idea.intent} />
                    </td>
                    <td className="py-3 px-3 text-slate-400 capitalize">{idea.category}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Info className="w-3 h-3 text-slate-500" />
                        Unchecked (Connect API)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveKeyword(idea)}
                        className="px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <PlusCircle className="w-3 h-3" /> Save
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

function IntentBadge({ intent }: { intent: KeywordIntent }) {
  if (intent === 'commercial') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400">
        Commercial
      </span>
    );
  }
  if (intent === 'transactional') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400">
        Transactional
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400">
      Informational
    </span>
  );
}
