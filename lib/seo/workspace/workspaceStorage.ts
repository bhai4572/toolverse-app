/** Local-first persistence for SEO Workspace — YOUR data only (no fake market graphs). */

import type { AuditResult } from '@/lib/seo/seoEngine';

const KEYS = {
  audits: 'tv_seo_audits_v1',
  rankings: 'tv_seo_rankings_v1',
  jobs: 'tv_seo_jobs_v1',
  traffic: 'tv_seo_traffic_v1',
  checklists: 'tv_seo_checklists_v1',
  project: 'tv_seo_project_v1',
} as const;

export interface StoredAudit {
  id: string;
  url: string;
  score: number;
  errorCount: number;
  warningCount: number;
  passedCount: number;
  metrics: AuditResult['metrics'];
  issues: AuditResult['issues'];
  at: string;
  moduleId: string;
}

export interface RankEntry {
  keyword: string;
  domain: string;
  position: number;
  notes?: string;
  at: string;
}

export interface JobRun {
  id: string;
  moduleId: string;
  label: string;
  score: number;
  summary: string;
  at: string;
  chart?: Array<{ label: string; value: number }>;
}

export interface TrafficImportRow {
  date: string;
  sessions: number;
  users?: number;
  pageviews?: number;
  source?: string;
}

export interface ProjectMeta {
  name: string;
  primaryUrl: string;
  updatedAt: string;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAudits(): StoredAudit[] {
  return readJson<StoredAudit[]>(KEYS.audits, []);
}

export function saveAudit(audit: Omit<StoredAudit, 'id' | 'at'> & { id?: string; at?: string }): StoredAudit {
  const entry: StoredAudit = {
    ...audit,
    id: audit.id || `audit_${Date.now()}`,
    at: audit.at || new Date().toISOString(),
  };
  const list = [entry, ...getAudits()].slice(0, 50);
  writeJson(KEYS.audits, list);
  pushJob({
    moduleId: audit.moduleId,
    label: `Audit: ${audit.url}`,
    score: audit.score,
    summary: `${audit.errorCount} errors · ${audit.warningCount} warnings`,
    chart: [
      { label: 'Passed', value: audit.passedCount },
      { label: 'Warnings', value: audit.warningCount },
      { label: 'Errors', value: audit.errorCount },
    ],
  });
  return entry;
}

export function getRankings(): RankEntry[] {
  return readJson<RankEntry[]>(KEYS.rankings, []);
}

export function addRankEntry(entry: RankEntry) {
  const list = [...getRankings(), entry].slice(-200);
  writeJson(KEYS.rankings, list);
  return list;
}

export function clearRankings() {
  writeJson(KEYS.rankings, []);
}

export function getJobs(): JobRun[] {
  return readJson<JobRun[]>(KEYS.jobs, []);
}

export function pushJob(partial: Omit<JobRun, 'id' | 'at'> & { id?: string; at?: string }): JobRun {
  const job: JobRun = {
    ...partial,
    id: partial.id || `job_${Date.now()}`,
    at: partial.at || new Date().toISOString(),
  };
  const list = [job, ...getJobs()].slice(0, 80);
  writeJson(KEYS.jobs, list);
  return job;
}

export function getTrafficImports(): TrafficImportRow[] {
  return readJson<TrafficImportRow[]>(KEYS.traffic, []);
}

export function setTrafficImports(rows: TrafficImportRow[]) {
  writeJson(KEYS.traffic, rows.slice(0, 365));
}

export function getChecklistState(id: string): Record<string, boolean> {
  const all = readJson<Record<string, Record<string, boolean>>>(KEYS.checklists, {});
  return all[id] || {};
}

export function setChecklistState(id: string, state: Record<string, boolean>) {
  const all = readJson<Record<string, Record<string, boolean>>>(KEYS.checklists, {});
  all[id] = state;
  writeJson(KEYS.checklists, all);
}

export function getProject(): ProjectMeta {
  return readJson<ProjectMeta>(KEYS.project, {
    name: 'My site',
    primaryUrl: '',
    updatedAt: new Date().toISOString(),
  });
}

export function setProject(meta: Partial<ProjectMeta>) {
  const next = { ...getProject(), ...meta, updatedAt: new Date().toISOString() };
  writeJson(KEYS.project, next);
  return next;
}

export function getDashboardStats() {
  const audits = getAudits();
  const jobs = getJobs();
  const rankings = getRankings();
  const traffic = getTrafficImports();
  const avgScore =
    audits.length === 0 ? 0 : Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length);
  const scoreHistory = audits
    .slice(0, 12)
    .reverse()
    .map((a) => ({
      label: new Date(a.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: a.score,
    }));
  const keywordSeries = rankings.slice(-14).map((r) => ({
    label: r.keyword.slice(0, 12),
    value: r.position,
  }));
  return {
    auditCount: audits.length,
    jobCount: jobs.length,
    keywordCount: new Set(rankings.map((r) => r.keyword.toLowerCase())).size,
    trafficDays: traffic.length,
    avgScore,
    scoreHistory,
    keywordSeries,
    recentAudits: audits.slice(0, 5),
    recentJobs: jobs.slice(0, 8),
  };
}
