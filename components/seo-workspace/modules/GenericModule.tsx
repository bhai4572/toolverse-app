'use client';

import React, { useMemo, useState, useEffect } from 'react';
import type { SeoNavItem } from '@/lib/seo/workspace/seoNavConfig';
import {
  getChecklistState,
  setChecklistState,
  pushJob,
  getProject,
} from '@/lib/seo/workspace/workspaceStorage';
import { ModuleShell, Panel, StatCards, UrlForm } from '../ModuleShell';
import { BarChart, DonutScore } from '../SimpleChart';
import { normalizeUrl } from '@/lib/seo/workspace/fetchPage';
import Link from 'next/link';

const CHECKLISTS: Record<string, string[]> = {
  'ai-visibility': [
    'Brand name appears consistently on homepage title + About',
    'Clear entity description (who / what / for whom)',
    'FAQ schema or FAQ section with cited facts',
    'Author bios with credentials on key pages',
    'Public stats / unique data others can cite',
    'Same NAP / social profiles linked',
    'Prompt test: ask ChatGPT/Claude about your brand — note gaps',
    'Update Wikipedia / Wikidata only if notable & compliant',
  ],
  'local-checklist': [
    'Google Business Profile claimed & verified',
    'Primary category correct',
    'NAP consistent across top 5 directories',
    'Weekly photo / post cadence',
    'Respond to reviews within 48h',
    'Services list matches landing pages',
    'UTM on GBP website button',
    'Local landing page with map embed + FAQs',
  ],
  'ads-planner': [
    'One primary conversion goal defined',
    'Landing page matches ad promise',
    'Negative keyword list started',
    'UTM on all paid links',
    'Ad copy A/B: benefit vs offer',
    'Mobile load under ~3s (check Site Performance)',
    'Budget cap + daily review note',
  ],
  'ai-pr': [
    'One-sentence newsworthy hook',
    '3 proof points / metrics',
    'Target 10 relevant outlets',
    'Personalize first line per editor',
    'Asset pack: logo, founder photo, fact sheet',
    'Follow-up day +3 and +7',
    'Track mentions in a sheet',
  ],
  'generic-analyzer': [
    'Define the question this module should answer',
    'Collect your own data (GSC, Analytics, CRM)',
    'Run related ToolVerse free tool',
    'Save a job run for history charts',
    'Export notes for stakeholders',
  ],
  'market-explorer': [
    'List 3 competitor domains you care about',
    'Note their top 5 public pages (manual browse)',
    'Compare title/meta patterns (On Page Checker)',
    'Import YOUR traffic for baseline (Traffic Analytics)',
    'Track 5 shared keywords in Position Tracking',
  ],
  'app-center': [
    'Bookmark SEO Dashboard (/workspace)',
    'Prepare GSC export for backlink / query imports',
    'Prepare GA4 CSV for Traffic Analytics',
    'Set primary project URL in Domain Overview',
    'Explore free tools under /tools',
  ],
};

function scoreChecklist(state: Record<string, boolean>, items: string[]) {
  const done = items.filter((_, i) => state[String(i)]).length;
  return items.length ? Math.round((done / items.length) * 100) : 0;
}

export function ChecklistModule({ item, checklistKey }: { item: SeoNavItem; checklistKey: string }) {
  const items = CHECKLISTS[checklistKey] || CHECKLISTS['generic-analyzer'];
  const [state, setState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setState(getChecklistState(item.id));
  }, [item.id]);

  const score = scoreChecklist(state, items);

  const toggle = (i: number) => {
    const next = { ...state, [String(i)]: !state[String(i)] };
    setState(next);
    setChecklistState(item.id, next);
  };

  const save = () => {
    pushJob({
      moduleId: item.id,
      label: item.label,
      score,
      summary: `${Object.values(state).filter(Boolean).length}/${items.length} complete`,
      chart: [
        { label: 'Done', value: Object.values(state).filter(Boolean).length },
        { label: 'Left', value: items.length - Object.values(state).filter(Boolean).length },
      ],
    });
  };

  return (
    <ModuleShell
      title={item.label}
      purpose="Interactive checklist MVP — complete steps, save a scored run, and chart completion over time from your jobs."
      honesty="Workflow helper only. No proprietary AI/market databases. Charts reflect your checklist completions."
      toolHref={item.toolSlug ? `/tools/${item.toolSlug}` : undefined}
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel>
          <DonutScore score={score} label="Ready" />
          <button type="button" onClick={save} className="mt-3 w-full px-3 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold">
            Save run
          </button>
        </Panel>
        <Panel title="Progress">
          <BarChart
            data={[
              { label: 'Done', value: Object.values(state).filter(Boolean).length },
              { label: 'Left', value: items.length - Object.values(state).filter(Boolean).length },
            ]}
          />
        </Panel>
        <Panel title="Tips">
          <p className="text-xs text-slate-500">
            Re-open this module anytime — progress is stored in your browser localStorage.
          </p>
        </Panel>
      </div>
      <Panel title="Checklist">
        <ul className="space-y-2">
          {items.map((label, i) => (
            <li key={label}>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!state[String(i)]} onChange={() => toggle(i)} className="mt-1 accent-brand-600" />
                <span className={state[String(i)] ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}>{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </Panel>
    </ModuleShell>
  );
}

export function SocialPreviewModule({ item }: { item: SeoNavItem }) {
  const [title, setTitle] = useState('ToolVerse — Free SEO Dashboard');
  const [desc, setDesc] = useState('Audit pages, track your keywords, and export reports — your data only.');
  const [url, setUrl] = useState(getProject().primaryUrl || 'https://toolverse.baby');
  const [hashtags, setHashtags] = useState('#seo #marketing #toolverse');

  const tags = hashtags.split(/\s+/).filter((t) => t.startsWith('#'));
  const score = Math.min(100, Math.round((title.length > 20 && title.length < 70 ? 40 : 15) + (desc.length > 40 && desc.length < 160 ? 40 : 15) + Math.min(20, tags.length * 5)));

  return (
    <ModuleShell
      title={item.label}
      purpose="Preview social/OG-style cards and score title/description/hashtag readiness before you post."
      honesty="Client-side preview only — not live social analytics."
      toolHref={item.toolSlug ? `/tools/${item.toolSlug}` : '/tools/utm-builder'}
    >
      <Panel title="Post fields">
        <div className="space-y-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <button
            type="button"
            onClick={() =>
              pushJob({
                moduleId: item.id,
                label: item.label,
                score,
                summary: `${title.slice(0, 40)}…`,
                chart: [
                  { label: 'Title', value: title.length },
                  { label: 'Desc', value: desc.length },
                  { label: 'Tags', value: tags.length },
                ],
              })
            }
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold"
          >
            Score & save
          </button>
        </div>
      </Panel>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Card preview">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-950">
            <div className="h-28 bg-gradient-to-br from-slate-700 to-brand-800" />
            <div className="p-3 space-y-1">
              <div className="text-[10px] uppercase text-slate-500 truncate">{normalizeUrl(url) || url}</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{title}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{desc}</div>
            </div>
          </div>
        </Panel>
        <Panel title="Readiness">
          <DonutScore score={score} />
          <BarChart
            data={[
              { label: 'Title', value: title.length },
              { label: 'Desc', value: desc.length },
              { label: 'Tags', value: tags.length },
            ]}
            color="#0284c7"
          />
        </Panel>
      </div>
    </ModuleShell>
  );
}

export function WritingAssistantModule({ item }: { item: SeoNavItem }) {
  const [topic, setTopic] = useState('on-page SEO checklist');
  const [tone, setTone] = useState<'clear' | 'expert' | 'friendly'>('clear');
  const outline = useMemo(() => {
    const intros = {
      clear: `Here's a practical guide to ${topic}.`,
      expert: `From an SEO systems view, ${topic} hinges on measurable on-page signals.`,
      friendly: `Let's make ${topic} easy — no jargon overload.`,
    };
    return {
      title: `${topic}: a practical outline`,
      intro: intros[tone],
      h2: [`What ${topic} means`, `Step-by-step workflow`, `Common mistakes`, `Tools & templates`, 'Next actions'],
      cta: 'Run Site Audit on your URL, then fix errors before publishing.',
    };
  }, [topic, tone]);

  return (
    <ModuleShell
      title={item.label}
      purpose="Draft an SEO-friendly outline you can paste into your editor or ToolVerse writing tools."
      honesty="Template generator — not a live LLM API. Wire deeper writing tools via App Center /tools."
      toolHref="/tools"
    >
      <Panel title="Brief">
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <select value={tone} onChange={(e) => setTone(e.target.value as typeof tone)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950">
            <option value="clear">Clear</option>
            <option value="expert">Expert</option>
            <option value="friendly">Friendly</option>
          </select>
          <button
            type="button"
            onClick={() =>
              pushJob({
                moduleId: item.id,
                label: 'Writing outline',
                score: 70 + topic.length % 20,
                summary: outline.title,
                chart: outline.h2.map((h, i) => ({ label: `H2${i + 1}`, value: h.length })),
              })
            }
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold"
          >
            Save outline
          </button>
        </div>
      </Panel>
      <Panel title="Generated outline">
        <h3 className="font-bold text-slate-900 dark:text-white">{outline.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{outline.intro}</p>
        <ol className="list-decimal pl-5 mt-3 space-y-1 text-sm">
          {outline.h2.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ol>
        <p className="text-xs text-brand-600 mt-3 font-semibold">{outline.cta}</p>
        <BarChart data={outline.h2.map((h, i) => ({ label: `S${i + 1}`, value: h.length }))} />
      </Panel>
    </ModuleShell>
  );
}

export function KeywordGapModule({ item }: { item: SeoNavItem }) {
  const [yours, setYours] = useState('seo audit\nkeyword research\nmeta tags');
  const [theirs, setTheirs] = useState('seo audit\nbacklink checker\nrank tracker\ncontent brief');

  const analysis = useMemo(() => {
    const a = new Set(yours.split(/\n/).map((s) => s.trim().toLowerCase()).filter(Boolean));
    const b = new Set(theirs.split(/\n/).map((s) => s.trim().toLowerCase()).filter(Boolean));
    const shared = [...a].filter((k) => b.has(k));
    const onlyThem = [...b].filter((k) => !a.has(k));
    const onlyYou = [...a].filter((k) => !b.has(k));
    return { shared, onlyThem, onlyYou };
  }, [yours, theirs]);

  return (
    <ModuleShell
      title={item.label}
      purpose="Compare two keyword lists you paste (from GSC, exports, or Keyword Magic) to find gaps."
      honesty="List diff only — not a live competitor keyword database."
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Panel title="Your keywords (one per line)">
          <textarea value={yours} onChange={(e) => setYours(e.target.value)} rows={6} className="w-full text-xs font-mono px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
        </Panel>
        <Panel title="Competitor / target list">
          <textarea value={theirs} onChange={(e) => setTheirs(e.target.value)} rows={6} className="w-full text-xs font-mono px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
        </Panel>
      </div>
      <StatCards
        items={[
          { label: 'Shared', value: analysis.shared.length },
          { label: 'Only them (gaps)', value: analysis.onlyThem.length, tone: 'warn' },
          { label: 'Only you', value: analysis.onlyYou.length, tone: 'good' },
          { label: 'Total unique', value: analysis.shared.length + analysis.onlyThem.length + analysis.onlyYou.length },
        ]}
      />
      <Panel title="Gap chart">
        <BarChart
          data={[
            { label: 'Shared', value: analysis.shared.length },
            { label: 'Gaps', value: analysis.onlyThem.length },
            { label: 'Yours', value: analysis.onlyYou.length },
          ]}
        />
        <button
          type="button"
          className="mt-2 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold"
          onClick={() =>
            pushJob({
              moduleId: item.id,
              label: 'Keyword gap',
              score: analysis.onlyThem.length ? Math.min(100, analysis.onlyThem.length * 10) : 20,
              summary: `${analysis.onlyThem.length} gap keywords`,
              chart: [
                { label: 'Shared', value: analysis.shared.length },
                { label: 'Gaps', value: analysis.onlyThem.length },
              ],
            })
          }
        >
          Save gap run
        </button>
        {analysis.onlyThem.length > 0 && (
          <ul className="mt-3 text-xs space-y-1">
            {analysis.onlyThem.map((k) => (
              <li key={k} className="text-amber-700 dark:text-amber-300">
                Gap: {k}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </ModuleShell>
  );
}

export function AppCenterModule({ item }: { item: SeoNavItem }) {
  const [tokenNote, setTokenNote] = useState('');

  return (
    <ModuleShell
      title={item.label}
      purpose="Connect placeholders for GSC / GA4 and jump into ToolVerse free tools. Tokens stay in your notes locally for now."
      honesty="OAuth not live yet. Paste export files in Traffic / Backlink modules. Optional API token field is stored only as a local reminder — never sent to ToolVerse servers."
    >
      <StatCards
        items={[
          { label: 'GSC', value: 'Import CSV', tone: 'good' },
          { label: 'GA4', value: 'Import CSV', tone: 'good' },
          { label: 'OAuth', value: 'Later' },
          { label: 'Cost', value: 'Free' },
        ]}
      />
      <Panel title="Local connection notes">
        <textarea
          value={tokenNote}
          onChange={(e) => setTokenNote(e.target.value)}
          placeholder="e.g. GA4 property ID, GSC site URL — do not paste secrets you cannot rotate"
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <Link href="/workspace/traffic-analytics/overview" className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold">
            Open Traffic import
          </Link>
          <Link href="/workspace/link-building/backlink-audit" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold">
            Open Backlink import
          </Link>
          <Link href="/tools" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold">
            All tools
          </Link>
          <Link href="/seo-tools" className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold">
            Classic SEO tools
          </Link>
        </div>
      </Panel>
    </ModuleShell>
  );
}

export function OrganicResearchModule({ item }: { item: SeoNavItem }) {
  const [url, setUrl] = useState(getProject().primaryUrl || '');
  return (
    <ModuleShell
      title={item.label}
      purpose="Hub for organic work on your domain: audit pages, track positions you log, and gap lists you paste."
      honesty="Not a live SERP scrape. Jump to Position Tracking and Keyword Gap with your own data."
    >
      <Panel title="Quick links">
        <UrlForm url={url} setUrl={setUrl} onRun={() => {}} buttonLabel="Set URL" />
        <div className="flex flex-wrap gap-2 mt-3">
          <Link href="/workspace/site-audit" className="text-xs font-bold text-brand-600 hover:underline">
            Site Audit
          </Link>
          <Link href="/workspace/position-tracking" className="text-xs font-bold text-brand-600 hover:underline">
            Position Tracking
          </Link>
          <Link href="/workspace/keyword-gap" className="text-xs font-bold text-brand-600 hover:underline">
            Keyword Gap
          </Link>
          <Link href="/workspace/link-building/extractor" className="text-xs font-bold text-brand-600 hover:underline">
            Link Extractor
          </Link>
        </div>
      </Panel>
      <KeywordGapModule item={item} />
    </ModuleShell>
  );
}

export function AdsPlannerModule({ item }: { item: SeoNavItem }) {
  const [headline, setHeadline] = useState('Free SEO Audit in Your Browser');
  const [desc, setDesc] = useState('Check titles, meta, links & CWV estimates. No credit card.');
  const score = Math.min(100, (headline.length >= 20 && headline.length <= 40 ? 50 : 20) + (desc.length >= 60 && desc.length <= 90 ? 50 : 20));

  return (
    <ModuleShell
      title={item.label}
      purpose="Plan PPC angles: score ad copy length, checklist landing readiness, save runs."
      honesty="Not Google Ads auction insights. Copy tester + checklist MVP."
    >
      <Panel title="Ad copy tester">
        <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
        <div className="mt-2 text-xs text-slate-500">
          Headline {headline.length}/30–40 · Description {desc.length}/60–90 (RSA-style budgets)
        </div>
        <DonutScore score={score} label="Copy" />
        <button
          type="button"
          className="mt-2 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold"
          onClick={() =>
            pushJob({
              moduleId: item.id,
              label: 'Ad copy',
              score,
              summary: headline,
              chart: [
                { label: 'H len', value: headline.length },
                { label: 'D len', value: desc.length },
              ],
            })
          }
        >
          Save score
        </button>
      </Panel>
      <ChecklistModule item={item} checklistKey="ads-planner" />
    </ModuleShell>
  );
}
