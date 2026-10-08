'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { performOnPageAudit, generateKeywordData, analyzeKeywordDensity, type AuditResult } from '@/lib/seo/seoEngine';
import { fetchPageHtml, estimatePerformance, extractLinks, normalizeUrl } from '@/lib/seo/workspace/fetchPage';
import {
  saveAudit,
  getAudits,
  getRankings,
  addRankEntry,
  pushJob,
  getTrafficImports,
  setTrafficImports,
  getProject,
  setProject,
  type RankEntry,
  type TrafficImportRow,
} from '@/lib/seo/workspace/workspaceStorage';
import { ModuleShell, Panel, StatCards, UrlForm } from '../ModuleShell';
import { BarChart, DonutScore, LineChart } from '../SimpleChart';
import { CheckCircle2, AlertTriangle, XCircle, Download } from 'lucide-react';

function IssueList({ issues }: { issues: AuditResult['issues'] }) {
  return (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {issues.map((issue, i) => (
        <li key={i} className="flex gap-2 text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
          {issue.type === 'passed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : issue.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-100">{issue.title}</div>
            <div className="text-slate-500">{issue.description}</div>
            <div className="text-brand-600 mt-0.5">{issue.recommendation}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function UrlAuditModule({ title, moduleId }: { title: string; moduleId: string }) {
  const [url, setUrl] = useState(() => getProject().primaryUrl || '');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [meta, setMeta] = useState<{ fetchMs?: number; proxy?: string }>({});

  const run = async (fromPaste = false) => {
    setError('');
    setLoading(true);
    try {
      let markup = html;
      let target = normalizeUrl(url) || url;
      if (!fromPaste || !markup) {
        const page = await fetchPageHtml(url);
        markup = page.html;
        target = page.url;
        setHtml(markup);
        setMeta({ fetchMs: page.fetchMs, proxy: page.proxyUsed });
        setProject({ primaryUrl: page.url });
      }
      const audit = performOnPageAudit({ url: target, htmlMarkup: markup });
      setResult(audit);
      saveAudit({
        url: target,
        score: audit.score,
        errorCount: audit.errorCount,
        warningCount: audit.warningCount,
        passedCount: audit.passedCount,
        metrics: audit.metrics,
        issues: audit.issues,
        moduleId,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Audit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title={title}
      purpose="Multi-check on-page / technical health for a single URL you enter. Score and issues come from real HTML analysis."
      honesty="This is YOUR page audit — not Semrush crawl index data. Fetch uses a public CORS proxy when possible; paste HTML if blocked."
      toolHref="/tools/seo-audit-analyzer"
    >
      <Panel title="Target URL">
        <UrlForm url={url} setUrl={setUrl} onRun={() => run(false)} loading={loading} buttonLabel="Fetch & audit" />
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Or paste page HTML here…"
          rows={4}
          className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono outline-none focus:border-brand-500"
        />
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={() => run(true)} disabled={loading || !html} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            Audit pasted HTML
          </button>
          {meta.fetchMs != null && (
            <span className="text-[11px] text-slate-500 self-center">
              Fetched in {meta.fetchMs}ms via {meta.proxy}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </Panel>

      {result && (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            <Panel>
              <DonutScore score={result.score} label="Health" />
            </Panel>
            <Panel title="Checks">
              <StatCards
                items={[
                  { label: 'Passed', value: result.passedCount, tone: 'good' },
                  { label: 'Warnings', value: result.warningCount, tone: 'warn' },
                  { label: 'Errors', value: result.errorCount, tone: 'bad' },
                  { label: 'Words', value: result.metrics.wordCount },
                ]}
              />
            </Panel>
            <Panel title="Issue mix (your audit)">
              <BarChart
                data={[
                  { label: 'Pass', value: result.passedCount },
                  { label: 'Warn', value: result.warningCount },
                  { label: 'Err', value: result.errorCount },
                ]}
              />
            </Panel>
          </div>
          <Panel title="Findings">
            <IssueList issues={result.issues} />
          </Panel>
        </>
      )}
    </ModuleShell>
  );
}

export function OnPageModule() {
  return <UrlAuditModule title="On Page SEO Checker" moduleId="on-page" />;
}

export function SiteAuditModule() {
  return <UrlAuditModule title="Site Audit" moduleId="site-audit" />;
}

export function SitePerformanceModule() {
  const [url, setUrl] = useState(() => getProject().primaryUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [perf, setPerf] = useState<ReturnType<typeof estimatePerformance> | null>(null);

  const run = async () => {
    setError('');
    setLoading(true);
    try {
      const page = await fetchPageHtml(url);
      const metrics = estimatePerformance(page.html, page.fetchMs);
      setPerf(metrics);
      setProject({ primaryUrl: page.url });
      pushJob({
        moduleId: 'site-performance',
        label: `Performance: ${page.url}`,
        score: metrics.score,
        summary: `LCP~${metrics.estimatedLcpMs}ms · ${metrics.htmlKb}KB HTML`,
        chart: [
          { label: 'LCP', value: metrics.estimatedLcpMs },
          { label: 'FID', value: metrics.estimatedFidMs },
          { label: 'KB', value: metrics.htmlKb },
        ],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell
      title="Site Performance"
      purpose="Estimate Core Web Vitals-style lab signals from fetched HTML weight, scripts, and images — plus fetch time."
      honesty="Not Google CrUX field data and not PageSpeed Insights API (no key). Estimates from YOUR fetched page only. Labels are estimates."
    >
      <Panel title="URL">
        <UrlForm url={url} setUrl={setUrl} onRun={run} loading={loading} buttonLabel="Measure" />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </Panel>
      {perf && (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            <Panel>
              <DonutScore score={perf.score} label="Perf est." />
            </Panel>
            <Panel title="Estimates (your page)">
              <StatCards
                items={[
                  { label: 'Fetch ms', value: perf.fetchMs },
                  { label: 'LCP est.', value: perf.estimatedLcpMs, tone: perf.estimatedLcpMs > 2500 ? 'bad' : 'good' },
                  { label: 'CLS est.', value: perf.estimatedCls, tone: perf.estimatedCls > 0.1 ? 'warn' : 'good' },
                  { label: 'HTML KB', value: perf.htmlKb },
                ]}
              />
            </Panel>
            <Panel title="Asset counts">
              <BarChart
                data={[
                  { label: 'JS', value: perf.scriptCount },
                  { label: 'CSS', value: perf.stylesheetCount },
                  { label: 'IMG', value: perf.imageCount },
                ]}
                color="#0ea5e9"
              />
            </Panel>
          </div>
          {perf.notes.length > 0 && (
            <Panel title="Recommendations">
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {perf.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}
    </ModuleShell>
  );
}

export function DomainOverviewModule() {
  const audits = getAudits();
  const latest = audits[0];
  const history = audits
    .slice(0, 10)
    .reverse()
    .map((a) => ({
      label: new Date(a.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: a.score,
    }));

  return (
    <ModuleShell
      title="Domain Overview"
      purpose="Aggregate of your saved workspace audits and jobs for the primary URL — a dashboard of YOUR runs."
      honesty="No global traffic, authority, or competitor market share. Connect GSC/GA later for real search/traffic stats."
    >
      <StatCards
        items={[
          { label: 'Audits saved', value: audits.length },
          { label: 'Latest score', value: latest?.score ?? '—', tone: latest && latest.score >= 70 ? 'good' : 'warn' },
          { label: 'Latest errors', value: latest?.errorCount ?? '—' },
          { label: 'Primary URL', value: getProject().primaryUrl ? 'Set' : 'None' },
        ]}
      />
      <Panel title="Score history (your audits)">
        <LineChart data={history} />
      </Panel>
      {latest && (
        <Panel title={`Latest: ${latest.url}`}>
          <IssueList issues={latest.issues.slice(0, 8)} />
        </Panel>
      )}
      {!latest && (
        <Panel>
          <p className="text-sm text-slate-500">
            Run <strong>Site Audit</strong> first to populate overview.
          </p>
        </Panel>
      )}
    </ModuleShell>
  );
}

export function KeywordMagicModule({ title = 'Keyword Magic' }: { title?: string }) {
  const [seed, setSeed] = useState('free seo tools');
  const data = useMemo(() => generateKeywordData(seed), [seed]);

  useEffect(() => {
    if (data.keywords.length) {
      pushJob({
        moduleId: 'keyword-magic',
        label: `Keywords: ${seed}`,
        score: 100 - data.summary.avgKd,
        summary: `${data.summary.totalKeywords} ideas · avg vol ${data.summary.avgVolume}`,
        chart: Object.entries(data.summary.intentBreakdown).map(([label, value]) => ({ label, value })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = () => {
    const next = generateKeywordData(seed);
    pushJob({
      moduleId: 'keyword-magic',
      label: `Keywords: ${seed}`,
      score: 100 - next.summary.avgKd,
      summary: `${next.summary.totalKeywords} ideas · avg vol ${next.summary.avgVolume}`,
      chart: Object.entries(next.summary.intentBreakdown).map(([label, value]) => ({ label, value })),
    });
  };

  return (
    <ModuleShell
      title={title}
      purpose="Expand a seed into keyword ideas with modeled volume, KD, CPC, and intent for brainstorming."
      honesty="Volumes/KD/CPC are modeled heuristics (hash-based), not live Semrush/Google Ads databases. Use for ideation; verify in GSC/Ads."
      toolHref="/tools/keyword-research-tool"
    >
      <Panel title="Seed keyword">
        <div className="flex gap-2">
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <button type="button" onClick={run} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold">
            Generate
          </button>
        </div>
      </Panel>
      <StatCards
        items={[
          { label: 'Ideas', value: data.summary.totalKeywords },
          { label: 'Avg vol (modeled)', value: data.summary.avgVolume },
          { label: 'Avg KD', value: data.summary.avgKd },
          { label: 'Avg CPC $', value: data.summary.avgCpc },
        ]}
      />
      <Panel title="Intent mix (modeled)">
        <BarChart data={Object.entries(data.summary.intentBreakdown).map(([label, value]) => ({ label, value }))} color="#059669" />
      </Panel>
      <Panel title="Keyword list">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 pr-2">Keyword</th>
                <th className="py-2 pr-2">Vol*</th>
                <th className="py-2 pr-2">KD*</th>
                <th className="py-2 pr-2">CPC*</th>
                <th className="py-2">Intent</th>
              </tr>
            </thead>
            <tbody>
              {data.keywords.map((k) => (
                <tr key={k.keyword} className="border-b border-slate-100 dark:border-slate-800/80">
                  <td className="py-1.5 pr-2 font-medium text-slate-800 dark:text-slate-100">{k.keyword}</td>
                  <td className="py-1.5 pr-2">{k.searchVolume}</td>
                  <td className="py-1.5 pr-2">{k.keywordDifficulty}</td>
                  <td className="py-1.5 pr-2">${k.cpc}</td>
                  <td className="py-1.5">{k.intent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">* Modeled estimates — not live search database.</p>
      </Panel>
    </ModuleShell>
  );
}

export function PositionTrackingModule() {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState(() => getProject().primaryUrl.replace(/^https?:\/\//, '').split('/')[0] || '');
  const [position, setPosition] = useState(10);
  const [rows, setRows] = useState<RankEntry[]>([]);

  useEffect(() => {
    setRows(getRankings());
  }, []);

  const byKeyword = useMemo(() => {
    const map = new Map<string, RankEntry[]>();
    for (const r of rows) {
      const key = r.keyword.toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [rows]);

  const chartData = useMemo(() => {
    if (!keyword.trim()) {
      return rows.slice(-12).map((r) => ({ label: r.keyword.slice(0, 10), value: r.position }));
    }
    return (byKeyword.get(keyword.trim().toLowerCase()) || []).map((r) => ({
      label: new Date(r.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: r.position,
    }));
  }, [rows, keyword, byKeyword]);

  const add = () => {
    if (!keyword.trim() || !domain.trim()) return;
    const entry: RankEntry = {
      keyword: keyword.trim(),
      domain: domain.trim(),
      position: Math.max(1, Math.min(100, Number(position) || 100)),
      at: new Date().toISOString(),
    };
    setRows(addRankEntry(entry));
    pushJob({
      moduleId: 'position-tracking',
      label: `Rank: ${entry.keyword}`,
      score: Math.max(0, 100 - entry.position),
      summary: `#${entry.position} on ${entry.domain}`,
      chart: chartData,
    });
  };

  return (
    <ModuleShell
      title="Position Tracking"
      purpose="Log keyword positions you observe (from GSC, Incognito SERP, or rank tools). Charts plot YOUR entries over time."
      honesty="We do not scrape Google SERPs. Enter positions you verify yourself. This is a local tracker — not live rank polling."
    >
      <Panel title="Add observation">
        <div className="grid sm:grid-cols-4 gap-2">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Domain" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <input type="number" min={1} max={100} value={position} onChange={(e) => setPosition(Number(e.target.value))} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold">
            Save position
          </button>
        </div>
      </Panel>
      <Panel title="Your rank history (lower is better)">
        <LineChart data={chartData} emptyLabel="Add at least two observations to see a trend." />
        <BarChart data={chartData} invert color="#d97706" />
      </Panel>
      <Panel title="Log">
        <ul className="text-xs space-y-1 max-h-60 overflow-y-auto">
          {[...rows].reverse().slice(0, 30).map((r, i) => (
            <li key={`${r.at}-${i}`} className="flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800 py-1">
              <span>
                <strong>{r.keyword}</strong> @ {r.domain}
              </span>
              <span className="font-mono">#{r.position}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </ModuleShell>
  );
}

export function LinkExtractorModule() {
  const [url, setUrl] = useState(() => getProject().primaryUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof extractLinks>>([]);

  const run = async () => {
    setError('');
    setLoading(true);
    try {
      const page = await fetchPageHtml(url);
      const extracted = extractLinks(page.html, page.url);
      setLinks(extracted);
      const internal = extracted.filter((l) => l.internal).length;
      const external = extracted.length - internal;
      pushJob({
        moduleId: 'link-extractor',
        label: `Links: ${page.url}`,
        score: Math.min(100, extracted.length),
        summary: `${extracted.length} links · ${internal} internal · ${external} outbound`,
        chart: [
          { label: 'Internal', value: internal },
          { label: 'Outbound', value: external },
        ],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const internal = links.filter((l) => l.internal).length;
  const external = links.length - internal;
  const nofollow = links.filter((l) => /nofollow/i.test(l.rel)).length;

  return (
    <ModuleShell
      title="Page Link Extractor"
      purpose="Pull internal and outbound links from a live page HTML. Use for link inventory and outreach prep."
      honesty="This analyzes outbound/internal links ON the page — not a global backlink index. For referring domains, paste a GSC Links export in Backlink Audit."
      toolHref="/tools/backlink-checker-analyzer"
    >
      <Panel title="URL">
        <UrlForm url={url} setUrl={setUrl} onRun={run} loading={loading} />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </Panel>
      {links.length > 0 && (
        <>
          <StatCards
            items={[
              { label: 'Total', value: links.length },
              { label: 'Internal', value: internal },
              { label: 'Outbound', value: external },
              { label: 'Nofollow', value: nofollow },
            ]}
          />
          <Panel title="Link mix (this page)">
            <BarChart
              data={[
                { label: 'Internal', value: internal },
                { label: 'Outbound', value: external },
                { label: 'Nofollow', value: nofollow },
              ]}
            />
          </Panel>
          <Panel title="Links">
            <ul className="text-xs space-y-1 max-h-72 overflow-y-auto">
              {links.slice(0, 100).map((l, i) => (
                <li key={`${l.href}-${i}`} className="truncate">
                  <span className={`font-bold ${l.internal ? 'text-emerald-600' : 'text-sky-600'}`}>{l.internal ? 'INT' : 'EXT'}</span>{' '}
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {l.text || l.href}
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </ModuleShell>
  );
}

export function BacklinkChecklistModule() {
  const [paste, setPaste] = useState('');
  const [rows, setRows] = useState<string[]>([]);

  const parse = () => {
    const urls = paste
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.split(/[\t,]/)[0]);
    setRows(urls);
    const domains = new Set(
      urls.map((u) => {
        try {
          return new URL(u.startsWith('http') ? u : `https://${u}`).hostname;
        } catch {
          return u;
        }
      })
    );
    pushJob({
      moduleId: 'backlink-checklist',
      label: 'GSC / backlink import',
      score: Math.min(100, domains.size),
      summary: `${urls.length} URLs · ${domains.size} domains`,
      chart: [
        { label: 'URLs', value: urls.length },
        { label: 'Domains', value: domains.size },
      ],
    });
  };

  const domains = useMemo(() => {
    const map = new Map<string, number>();
    for (const u of rows) {
      try {
        const h = new URL(u.startsWith('http') ? u : `https://${u}`).hostname;
        map.set(h, (map.get(h) || 0) + 1);
      } catch {
        map.set(u, (map.get(u) || 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const checklist = [
    'Export Links → Top linking sites from Google Search Console',
    'Paste referring URLs below (one per line)',
    'Flag spammy exact-match anchors manually',
    'Disavow only after careful review (Google Disavow Tool)',
    'Track outreach prospects in Link Building → Outreach',
  ];

  return (
    <ModuleShell
      title="Backlink Audit"
      purpose="Honest backlink workflow: import YOUR referring URLs from GSC (or any list) and review domain concentration."
      honesty="No fake referring-domain index. ToolVerse does not claim Semrush/Ahrefs backlink coverage. Prefer GSC export."
    >
      <Panel title="Workflow checklist">
        <ol className="list-decimal pl-5 text-sm space-y-1 text-slate-600 dark:text-slate-300">
          {checklist.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </Panel>
      <Panel title="Paste referring URLs / GSC export column">
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={6}
          placeholder={'https://blog.example.com/post\nhttps://news.site/article'}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
        />
        <button type="button" onClick={parse} className="mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold">
          Analyze list
        </button>
      </Panel>
      {rows.length > 0 && (
        <>
          <StatCards
            items={[
              { label: 'URLs', value: rows.length },
              { label: 'Domains', value: domains.length },
              { label: 'Top domain links', value: domains[0]?.[1] ?? 0 },
              { label: 'Concentration', value: domains[0] ? `${Math.round((domains[0][1] / rows.length) * 100)}%` : '—' },
            ]}
          />
          <Panel title="Top referring domains (from your paste)">
            <BarChart data={domains.slice(0, 8).map(([label, value]) => ({ label: label.slice(0, 12), value }))} />
          </Panel>
        </>
      )}
    </ModuleShell>
  );
}

export function ContentOptimizerModule() {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('');
  const result = text.trim() ? analyzeKeywordDensity(text) : null;
  const targetCount = target
    ? (text.toLowerCase().match(new RegExp(target.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    : 0;
  const density = result && target ? Number(((targetCount / Math.max(1, result.totalWords)) * 100).toFixed(2)) : 0;

  const runSave = () => {
    if (!result) return;
    pushJob({
      moduleId: 'content-optimizer',
      label: 'Content optimize',
      score: Math.min(100, Math.round(result.totalWords / 10)),
      summary: `${result.totalWords} words · target density ${density}%`,
      chart: result.oneWordList.slice(0, 6).map((w) => ({ label: w.word, value: w.count })),
    });
  };

  return (
    <ModuleShell
      title="Content Optimizer"
      purpose="Analyze pasted draft for density, phrases, and target keyword usage — then iterate."
      honesty="Local text analysis only. No live SERP content gap database."
      toolHref="/tools/keyword-density-checker"
    >
      <Panel title="Draft + target keyword">
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target keyword"
          className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste your article draft…"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950"
        />
        <button type="button" onClick={runSave} disabled={!result} className="mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold disabled:opacity-50">
          Score & save run
        </button>
      </Panel>
      {result && (
        <>
          <StatCards
            items={[
              { label: 'Words', value: result.totalWords },
              { label: 'Unique', value: result.uniqueWords },
              { label: 'Read min', value: result.readingTimeMinutes },
              { label: 'Target %', value: density },
            ]}
          />
          <Panel title="Top terms (your draft)">
            <BarChart data={result.oneWordList.slice(0, 8).map((w) => ({ label: w.word, value: w.count }))} color="#7c3aed" />
          </Panel>
          {result.warnings.length > 0 && (
            <Panel title="Warnings">
              <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                {result.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}
    </ModuleShell>
  );
}

export function TopicIdeasModule() {
  const [seed, setSeed] = useState('seo audit');
  const ideas = useMemo(() => {
    const bases = [
      `How to ${seed} in 2026`,
      `${seed} checklist for beginners`,
      `${seed} vs competitors`,
      `Common ${seed} mistakes`,
      `${seed} tools comparison`,
      `Step-by-step ${seed} guide`,
      `${seed} templates (free)`,
      `Case study: ${seed} results`,
    ];
    return bases.map((title, i) => ({
      title,
      intent: i % 3 === 0 ? 'Informational' : i % 3 === 1 ? 'Commercial' : 'Transactional',
      score: 60 + ((seed.length * 7 + i * 11) % 35),
    }));
  }, [seed]);

  return (
    <ModuleShell
      title="Topic Research"
      purpose="Generate content angles and brief starters from a seed topic."
      honesty="Ideas are rule-based expansions — not a proprietary topic database."
    >
      <Panel title="Seed topic">
        <div className="flex gap-2">
          <input value={seed} onChange={(e) => setSeed(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-950" />
          <button
            type="button"
            onClick={() =>
              pushJob({
                moduleId: 'topic-ideas',
                label: `Topics: ${seed}`,
                score: ideas[0]?.score || 0,
                summary: `${ideas.length} angles`,
                chart: ideas.slice(0, 6).map((i) => ({ label: i.title.slice(0, 10), value: i.score })),
              })
            }
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold"
          >
            Save run
          </button>
        </div>
      </Panel>
      <Panel title="Angles">
        <BarChart data={ideas.map((i) => ({ label: i.title.slice(0, 10), value: i.score }))} />
        <ul className="mt-3 space-y-2">
          {ideas.map((idea) => (
            <li key={idea.title} className="text-sm flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800 py-2">
              <span>
                <span className="font-semibold">{idea.title}</span>
                <span className="text-xs text-slate-500 ml-2">{idea.intent}</span>
              </span>
              <span className="font-mono text-xs">{idea.score}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </ModuleShell>
  );
}

export function TrafficYourDataModule({ title = 'Traffic Analytics' }: { title?: string }) {
  const [paste, setPaste] = useState('2026-04-01,120\n2026-04-02,140\n2026-04-03,110\n2026-04-04,180\n2026-04-05,160');
  const [rows, setRows] = useState<TrafficImportRow[]>([]);

  useEffect(() => {
    setRows(getTrafficImports());
  }, []);

  const importRows = () => {
    const parsed: TrafficImportRow[] = paste
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [date, sessions, users, pageviews, source] = l.split(/[,\t]/).map((x) => x.trim());
        return {
          date,
          sessions: Number(sessions) || 0,
          users: users ? Number(users) : undefined,
          pageviews: pageviews ? Number(pageviews) : undefined,
          source,
        };
      })
      .filter((r) => r.date && r.sessions >= 0);
    setTrafficImports(parsed);
    setRows(parsed);
    pushJob({
      moduleId: 'traffic-your-data',
      label: 'Traffic import',
      score: Math.min(100, parsed.reduce((s, r) => s + r.sessions, 0) / 10),
      summary: `${parsed.length} days imported`,
      chart: parsed.slice(-8).map((r) => ({ label: r.date.slice(5), value: r.sessions })),
    });
  };

  const total = rows.reduce((s, r) => s + r.sessions, 0);

  return (
    <ModuleShell
      title={title}
      purpose="Import GA4 / CSV sessions (date,sessions[,users,pageviews,source]) and chart YOUR traffic — not competitor market data."
      honesty="Labeled Your data only. No Semrush clickstream. Paste exports or connect GA4 token later in App Center."
    >
      <Panel title="Paste GA4 / CSV export">
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-slate-50 dark:bg-slate-950"
        />
        <button type="button" onClick={importRows} className="mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold">
          Import & chart
        </button>
      </Panel>
      <StatCards
        items={[
          { label: 'Days', value: rows.length },
          { label: 'Sessions', value: total },
          { label: 'Avg / day', value: rows.length ? Math.round(total / rows.length) : 0 },
          { label: 'Source', value: 'Your paste' },
        ]}
      />
      <Panel title="Sessions (your data)">
        <LineChart data={rows.map((r) => ({ label: r.date.slice(5), value: r.sessions }))} />
      </Panel>
    </ModuleShell>
  );
}

export function ReportExportModule() {
  const audits = getAudits();
  const latest = audits[0];

  const exportHtml = () => {
    if (!latest) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>ToolVerse Audit — ${latest.url}</title>
<style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:0 16px;color:#0f172a}h1{font-size:1.5rem}.score{font-size:3rem;font-weight:800}.issue{border:1px solid #e2e8f0;padding:12px;border-radius:8px;margin:8px 0}</style></head><body>
<h1>ToolVerse SEO Audit Report</h1>
<p><strong>URL:</strong> ${latest.url}</p>
<p><strong>Date:</strong> ${new Date(latest.at).toLocaleString()}</p>
<p class="score">${latest.score}/100</p>
<p>Passed ${latest.passedCount} · Warnings ${latest.warningCount} · Errors ${latest.errorCount}</p>
${latest.issues.map((i) => `<div class="issue"><strong>[${i.type}] ${i.title}</strong><br/>${i.description}<br/><em>${i.recommendation}</em></div>`).join('')}
<p style="color:#64748b;font-size:12px">Generated by ToolVerse — your data only. Not Semrush market data.</p>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `toolverse-audit-${Date.now()}.html`;
    a.click();
  };

  const exportPdf = async () => {
    if (!latest) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('ToolVerse SEO Audit', 14, 20);
    doc.setFontSize(10);
    doc.text(`URL: ${latest.url}`, 14, 30);
    doc.text(`Score: ${latest.score}/100`, 14, 36);
    doc.text(`Passed ${latest.passedCount} · Warnings ${latest.warningCount} · Errors ${latest.errorCount}`, 14, 42);
    let y = 52;
    for (const issue of latest.issues.slice(0, 18)) {
      const line = `[${issue.type}] ${issue.title}`;
      const wrapped = doc.splitTextToSize(line, 180);
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(wrapped, 14, y);
      y += wrapped.length * 5 + 4;
    }
    doc.save(`toolverse-audit-${Date.now()}.pdf`);
  };

  return (
    <ModuleShell
      title="Reports"
      purpose="Export your latest saved audit as HTML or PDF for clients or notes."
      honesty="Reports reflect YOUR workspace audits only — free, no Pro paywall."
    >
      <Panel title="Latest audit">
        {latest ? (
          <>
            <StatCards
              items={[
                { label: 'Score', value: latest.score },
                { label: 'URL', value: latest.url.slice(0, 28) },
                { label: 'Errors', value: latest.errorCount, tone: 'bad' },
                { label: 'When', value: new Date(latest.at).toLocaleDateString() },
              ]}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <button type="button" onClick={exportHtml} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold">
                <Download className="w-4 h-4" /> HTML report
              </button>
              <button type="button" onClick={exportPdf} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold">
                <Download className="w-4 h-4" /> PDF report
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">No audits yet — run Site Audit first.</p>
        )}
      </Panel>
    </ModuleShell>
  );
}
