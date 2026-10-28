'use client';

import React, { useState, useMemo } from 'react';
import { ModuleShell } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import { expandKeywords } from '@/lib/seo/keywords/keywordEngine';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  PlusCircle,
  BookOpen,
  BarChart2,
  Clock,
  Layers,
  Heading,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

// Syllable counter helper for Flesch-Kincaid formula
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length <= 3) return 1;
  const stripped = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
  const syllables = stripped.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

export function ContentWorkspaceModule({ mode = 'writing' }: { mode?: 'writing' | 'topics' | 'brief' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'writing' | 'topics' | 'brief'>(mode);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. SEO Writing Assistant State
  const [content, setContent] = useState(
    `# Complete Guide to Technical SEO Auditing\n\nTechnical SEO is the process of ensuring that your website complies with the technical criteria set by modern search engines. The goal is to enhance organic search rankings by making your site faster, easier to crawl, and understandable for search indexers.\n\n## Why Technical SEO Matters\n\nWithout a strong technical foundation, great content cannot rank. Search crawlers encounter roadblocks like HTTP 404 errors, redirect loops, missing canonical tags, and mobile viewport errors.\n\n## Core Technical Pillars\n\n1. Crawlability & Indexability\n2. Mobile Responsiveness\n3. Structured Data Schema\n4. Internal Link Architecture\n`
  );
  const [targetKeywordsInput, setTargetKeywordsInput] = useState('technical seo, audit, canonical');

  // 2. Topic Research & Brief Generator State
  const [topicSeed, setTopicSeed] = useState('technical seo audit');
  const [targetAudience, setTargetAudience] = useState('SaaS founders, marketers, and developers');
  const [briefIntent, setBriefIntent] = useState<'informational' | 'commercial' | 'transactional'>('informational');

  // Text analysis calculations
  const stats = useMemo(() => {
    const raw = content.trim();
    if (!raw) {
      return {
        words: 0,
        characters: 0,
        sentences: 0,
        readingTimeMin: 0,
        fleschScore: 0,
        gradeLevel: 0,
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        keywordDensities: [],
      };
    }

    const wordsArr = raw.split(/\s+/).filter(Boolean);
    const wordCount = wordsArr.length;
    const charCount = raw.length;
    const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
    const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

    // Syllables calculation
    const totalSyllables = wordsArr.reduce((acc, w) => acc + countSyllables(w), 0);

    // Flesch Reading Ease Formula
    // 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
    const flesch = Math.round(
      Math.max(
        0,
        Math.min(
          100,
          206.835 - 1.015 * (wordCount / sentences) - 84.6 * (totalSyllables / wordCount)
        )
      )
    );

    // Flesch-Kincaid Grade Level
    const grade = Math.max(
      1,
      Math.round((0.39 * (wordCount / sentences) + 11.8 * (totalSyllables / wordCount) - 15.59) * 10) / 10
    );

    // Headings
    const h1Count = (raw.match(/^#\s+/gm) || []).length;
    const h2Count = (raw.match(/^##\s+/gm) || []).length;
    const h3Count = (raw.match(/^###\s+/gm) || []).length;

    // Keyword density
    const targets = targetKeywordsInput
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const lowerRaw = raw.toLowerCase();
    const keywordDensities = targets.map((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = lowerRaw.match(regex) || [];
      const density = wordCount > 0 ? Math.round((matches.length / wordCount) * 1000) / 10 : 0;
      return { keyword: kw, count: matches.length, density };
    });

    return {
      words: wordCount,
      characters: charCount,
      sentences,
      readingTimeMin,
      fleschScore: flesch,
      gradeLevel: grade,
      h1Count,
      h2Count,
      h3Count,
      keywordDensities,
    };
  }, [content, targetKeywordsInput]);

  // Brief Generation Logic
  const generatedBrief = useMemo(() => {
    const cleanTopic = topicSeed.trim();
    const ideas = expandKeywords(cleanTopic);
    const questions = ideas.filter((i) => i.category === 'question').slice(0, 5);

    return {
      topic: cleanTopic,
      titleVariants: [
        `How to Master ${cleanTopic}: The Complete 2026 Guide`,
        `${cleanTopic}: Best Practices, Checklists & Examples`,
        `The Ultimate Handbook to ${cleanTopic} for ${targetAudience}`,
      ],
      metaDescription: `Learn the essential steps to execute an effective ${cleanTopic}. Discover actionable strategies, tools, and best practices tailored for ${targetAudience}.`,
      targetWordCount: 1800,
      searchIntent: briefIntent,
      recommendedOutlines: [
        `What is ${cleanTopic}? (Core Fundamentals & Definitions)`,
        `Key Benefits and Return on Investment`,
        `Step-by-Step Implementation Workflow`,
        `Common Mistakes to Avoid`,
        `Essential Tools, Checklists & Frameworks`,
      ],
      mustAnswerQuestions: questions.map((q) => q.keyword),
      suggestedInternalLinks: [
        '/workspace/site-audit',
        '/workspace/on-page-seo',
        '/workspace/keyword-overview',
      ],
    };
  }, [topicSeed, targetAudience, briefIntent]);

  const handleExportBriefMarkdown = () => {
    const md = `# SEO Content Brief: ${generatedBrief.topic}
**Target Audience:** ${targetAudience}
**Primary Intent:** ${generatedBrief.searchIntent.toUpperCase()}
**Target Word Count:** ~${generatedBrief.targetWordCount} words

---

## 1. Title Tag Options
${generatedBrief.titleVariants.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## 2. Meta Description
${generatedBrief.metaDescription}

## 3. Recommended H2 / H3 Outline Structure
${generatedBrief.recommendedOutlines.map((h, i) => `### 2.${i + 1} ${h}`).join('\n')}

## 4. Key Questions to Answer
${generatedBrief.mustAnswerQuestions.map((q) => `- [ ] ${q}`).join('\n')}

## 5. Suggested Internal Link Opportunities
${generatedBrief.suggestedInternalLinks.map((l) => `- ${project.domain}${l}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-brief-${topicSeed.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <ModuleShell
      title="Content Workspace & SEO Writing Suite"
      purpose="Draft content with real-time Flesch-Kincaid readability scoring, keyword density tracking, and structured SEO Content Brief generation."
      honesty="Readability formulas and keyword density metrics are computed locally in real time. We do not generate fake AI hallucinations."
    >
      {/* Top Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('writing')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'writing'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          SEO Writing Assistant
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('brief')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'brief'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Content Brief Generator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('topics')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'topics'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          Topic Research & Outline
        </button>
      </div>

      {activeTab === 'writing' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Writing Area */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Keywords (Comma-Separated)
                </label>
                <span className="text-[11px] text-slate-400">Optimal density: 1.0% – 2.5%</span>
              </div>
              <input
                type="text"
                value={targetKeywordsInput}
                onChange={(e) => setTargetKeywordsInput(e.target.value)}
                placeholder="e.g. technical seo, crawlability, canonical tag"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Drafting Editor (Markdown Supported)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(content)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Text
                  </button>
                </div>
              </div>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or paste your article markdown here..."
                className="w-full p-3 font-mono text-xs leading-relaxed rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Right Rail Analysis & Real-time Metrics */}
          <div className="lg:col-span-4 space-y-4">
            {/* Readability & Content Score */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-brand-500" />
                Readability & Grade Level
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reading Ease</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    {stats.fleschScore}/100
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    {stats.fleschScore >= 60 ? 'Standard / Clear' : 'Complex Text'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Grade Level</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    {stats.gradeLevel}th
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">US School Grade</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{stats.words}</div>
                  <div className="text-[10px] text-slate-500">Words</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{stats.sentences}</div>
                  <div className="text-[10px] text-slate-500">Sentences</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{stats.readingTimeMin} min</div>
                  <div className="text-[10px] text-slate-500">Reading</div>
                </div>
              </div>
            </div>

            {/* Keyword Density Monitor */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Target Keyword Density
              </h4>

              {stats.keywordDensities.length > 0 ? (
                <div className="space-y-2">
                  {stats.keywordDensities.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {item.keyword}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.count} occurrences</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            item.density >= 0.8 && item.density <= 3.0
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}
                        >
                          {item.density}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Enter keywords above to monitor density.</p>
              )}
            </div>

            {/* Document Structure Diagnostic */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Heading className="w-4 h-4 text-blue-400" />
                Heading Hierarchy
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{stats.h1Count}</div>
                  <div className="text-[10px] text-slate-400">H1 (Title)</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{stats.h2Count}</div>
                  <div className="text-[10px] text-slate-400">H2 Sections</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{stats.h3Count}</div>
                  <div className="text-[10px] text-slate-400">H3 Subs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Content Brief & Topic Research Generator */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Target Topic / Primary Keyword *
              </label>
              <input
                type="text"
                value={topicSeed}
                onChange={(e) => setTopicSeed(e.target.value)}
                placeholder="e.g. programmatic seo, pdf compression"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Target Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Enterprise SEO Managers"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Search Intent
              </label>
              <select
                value={briefIntent}
                onChange={(e) => setBriefIntent(e.target.value as any)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="informational">Informational (Guide / Tutorial)</option>
                <option value="commercial">Commercial (Best / Comparison)</option>
                <option value="transactional">Transactional (Pricing / Service)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Generated SEO Content Brief
              </h3>
              <button
                type="button"
                onClick={handleExportBriefMarkdown}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Brief (.md)
              </button>
            </div>

            {/* Title Tag Options */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended Title Tag Options
              </span>
              <div className="grid sm:grid-cols-3 gap-3">
                {generatedBrief.titleVariants.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-col justify-between"
                  >
                    <span>{t}</span>
                    <span className="text-[10px] text-slate-400 mt-2">{t.length} characters</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Meta Description Draft
              </span>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {generatedBrief.metaDescription} ({generatedBrief.metaDescription.length} characters)
              </div>
            </div>

            {/* H2 Outlines */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended H2 & H3 Section Outlines
              </span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                {generatedBrief.recommendedOutlines.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-brand-500 font-bold">H2.{idx + 1}</span>
                    <span className="text-slate-800 dark:text-slate-200">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Answer */}
            {generatedBrief.mustAnswerQuestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Must-Answer User Questions (High Search Intent)
                </span>
                <div className="grid sm:grid-cols-2 gap-2">
                  {generatedBrief.mustAnswerQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      {q}?
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
