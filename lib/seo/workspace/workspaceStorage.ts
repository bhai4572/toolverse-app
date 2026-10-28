/**
 * Local-first persistence for SEO Workspace — YOUR data only (no fake market graphs).
 * Comprehensive multi-project tenancy, tasks, audits, keywords, and backup engine.
 */

import type { AuditResult } from '@/lib/seo/seoEngine';
import type {
  Project,
  ProjectScope,
  TaskRecord,
  TaskStatus,
  AuditRunRecord,
  KeywordItem,
  BacklinkItem,
  VerificationMethod,
} from './workspaceTypes';

const KEYS = {
  audits: 'tv_seo_audits_v1',
  rankings: 'tv_seo_rankings_v1',
  jobs: 'tv_seo_jobs_v1',
  traffic: 'tv_seo_traffic_v1',
  checklists: 'tv_seo_checklists_v1',
  project: 'tv_seo_project_v1',
  // V2 Multi-Tenant Keys
  projects: 'tv_seo_projects_v2',
  activeProjectId: 'tv_seo_active_project_id_v2',
  tasks: 'tv_seo_tasks_v2',
  auditRuns: 'tv_seo_audit_runs_v2',
  keywords: 'tv_seo_keywords_v2',
  backlinks: 'tv_seo_backlinks_v2',
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

const memoryStore = new Map<string, string>();

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (k: string) => memoryStore.get(k) ?? null,
    setItem: (k: string, v: string) => memoryStore.set(k, v),
    removeItem: (k: string) => memoryStore.delete(k),
  };
}

export function clearWorkspaceMemoryStore() {
  memoryStore.clear();
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = getStorage().getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    getStorage().setItem(key, JSON.stringify(value));
  } catch {
    // safe fallback
  }
}

// ==========================================
// 1. Projects & Tenancy Management
// ==========================================

export function generateVerificationToken(domain: string): string {
  const clean = domain.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 10);
  const rand = Math.random().toString(36).substring(2, 10);
  return `toolverse-verify-${clean}-${rand}`;
}

export function createDefaultProject(domain = 'https://toolverse.baby'): Project {
  return {
    id: 'proj_default',
    name: 'ToolVerse Platform',
    domain,
    scope: 'domain',
    targetCountry: 'United States',
    targetLanguage: 'en',
    businessCategory: 'SaaS / Marketing Tools',
    competitors: ['semrush.com', 'ahrefs.com', 'moz.com'],
    verification: {
      token: generateVerificationToken('toolverse.baby'),
      verified: true,
      verifiedAt: new Date().toISOString(),
      method: 'meta-tag',
    },
    settings: {
      maxCrawlPages: 25,
      maxCrawlDepth: 3,
      includeQueryParams: false,
      respectRobotsTxt: true,
      userAgent: 'ToolVerseBot/1.0 (+https://toolverse.baby/bot)',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getProjects(): Project[] {
  const projects = readJson<Project[]>(KEYS.projects, []);
  if (projects.length === 0) {
    const def = createDefaultProject();
    writeJson(KEYS.projects, [def]);
    return [def];
  }
  return projects;
}

export function getActiveProjectId(): string {
  const stored = readJson<string>(KEYS.activeProjectId, '');
  if (stored) return stored;
  const list = getProjects();
  const firstId = list[0]?.id || 'proj_default';
  setActiveProjectId(firstId);
  return firstId;
}

export function setActiveProjectId(id: string) {
  writeJson(KEYS.activeProjectId, id);
}

export function getActiveProject(): Project {
  const activeId = getActiveProjectId();
  const list = getProjects();
  const found = list.find((p) => p.id === activeId);
  return found || list[0] || createDefaultProject();
}

export function saveProject(project: Project): Project {
  const list = getProjects();
  const idx = list.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    list[idx] = updated;
  } else {
    list.push(updated);
  }
  writeJson(KEYS.projects, list);
  return updated;
}

export function createProject(params: {
  name: string;
  domain: string;
  scope?: ProjectScope;
  targetCountry?: string;
  targetLanguage?: string;
  competitors?: string[];
}): Project {
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cleanDomain = params.domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();
  const newProj: Project = {
    id,
    name: params.name || cleanDomain || 'New Project',
    domain: params.domain.startsWith('http') ? params.domain : `https://${params.domain}`,
    scope: params.scope || 'domain',
    targetCountry: params.targetCountry || 'United States',
    targetLanguage: params.targetLanguage || 'en',
    competitors: params.competitors || [],
    verification: {
      token: generateVerificationToken(cleanDomain),
      verified: false,
    },
    settings: {
      maxCrawlPages: 25,
      maxCrawlDepth: 3,
      includeQueryParams: false,
      respectRobotsTxt: true,
      userAgent: 'ToolVerseBot/1.0 (+https://toolverse.baby/bot)',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const list = getProjects();
  list.push(newProj);
  writeJson(KEYS.projects, list);
  setActiveProjectId(newProj.id);
  return newProj;
}

export function deleteProject(id: string): void {
  const list = getProjects().filter((p) => p.id !== id);
  if (list.length === 0) {
    list.push(createDefaultProject());
  }
  writeJson(KEYS.projects, list);
  if (getActiveProjectId() === id) {
    setActiveProjectId(list[0].id);
  }
}

// ==========================================
// 2. Centralized Task Management
// ==========================================

export function getTasks(projectId?: string): TaskRecord[] {
  const allTasks = readJson<TaskRecord[]>(KEYS.tasks, []);
  if (!projectId) return allTasks;
  return allTasks.filter((t) => t.projectId === projectId);
}

export function createTask(task: Omit<TaskRecord, 'id' | 'createdAt'>): TaskRecord {
  const allTasks = getTasks();
  const newTask: TaskRecord = {
    ...task,
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const list = [newTask, ...allTasks];
  writeJson(KEYS.tasks, list);
  return newTask;
}

export function updateTaskStatus(taskId: string, status: TaskStatus): void {
  const allTasks = getTasks();
  const idx = allTasks.findIndex((t) => t.id === taskId);
  if (idx >= 0) {
    allTasks[idx] = {
      ...allTasks[idx],
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
    };
    writeJson(KEYS.tasks, allTasks);
  }
}

export function deleteTask(taskId: string): void {
  const allTasks = getTasks().filter((t) => t.id !== taskId);
  writeJson(KEYS.tasks, allTasks);
}

// ==========================================
// 3. Deep Audit Runs with Inventory
// ==========================================

export function getAuditRuns(projectId?: string): AuditRunRecord[] {
  const runs = readJson<AuditRunRecord[]>(KEYS.auditRuns, []);
  if (!projectId) return runs;
  return runs.filter((r) => r.projectId === projectId);
}

export function saveAuditRun(run: AuditRunRecord): void {
  const list = [run, ...getAuditRuns()].slice(0, 30);
  writeJson(KEYS.auditRuns, list);
}

export function getLatestAuditRun(projectId?: string): AuditRunRecord | null {
  const runs = getAuditRuns(projectId);
  return runs[0] || null;
}

// ==========================================
// 4. Keyword & Backlink Repositories
// ==========================================

export function getKeywords(projectId?: string): KeywordItem[] {
  const items = readJson<KeywordItem[]>(KEYS.keywords, []);
  if (!projectId) return items;
  return items.filter((k) => k.projectId === projectId);
}

export function saveKeywords(items: KeywordItem[]): void {
  const current = getKeywords();
  const map = new Map<string, KeywordItem>();
  for (const c of current) map.set(c.id, c);
  for (const item of items) map.set(item.id, item);
  writeJson(KEYS.keywords, Array.from(map.values()).slice(0, 1000));
}

export function deleteKeyword(id: string): void {
  const current = getKeywords().filter((k) => k.id !== id);
  writeJson(KEYS.keywords, current);
}

export function getBacklinks(projectId?: string): BacklinkItem[] {
  const items = readJson<BacklinkItem[]>(KEYS.backlinks, []);
  if (!projectId) return items;
  return items.filter((b) => b.projectId === projectId);
}

export function saveBacklinks(items: BacklinkItem[]): void {
  const current = getBacklinks();
  const map = new Map<string, BacklinkItem>();
  for (const c of current) map.set(c.id, c);
  for (const item of items) map.set(item.id, item);
  writeJson(KEYS.backlinks, Array.from(map.values()).slice(0, 2000));
}

// ==========================================
// 5. Backup & Restore
// ==========================================

export function exportFullWorkspaceBackup(): string {
  const dump = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    projects: getProjects(),
    activeProjectId: getActiveProjectId(),
    tasks: getTasks(),
    auditRuns: getAuditRuns(),
    keywords: getKeywords(),
    backlinks: getBacklinks(),
    audits: getAudits(),
    rankings: getRankings(),
    jobs: getJobs(),
    traffic: getTrafficImports(),
  };
  return JSON.stringify(dump, null, 2);
}

export function importFullWorkspaceBackup(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') return false;
    if (Array.isArray(data.projects)) writeJson(KEYS.projects, data.projects);
    if (typeof data.activeProjectId === 'string') writeJson(KEYS.activeProjectId, data.activeProjectId);
    if (Array.isArray(data.tasks)) writeJson(KEYS.tasks, data.tasks);
    if (Array.isArray(data.auditRuns)) writeJson(KEYS.auditRuns, data.auditRuns);
    if (Array.isArray(data.keywords)) writeJson(KEYS.keywords, data.keywords);
    if (Array.isArray(data.backlinks)) writeJson(KEYS.backlinks, data.backlinks);
    if (Array.isArray(data.audits)) writeJson(KEYS.audits, data.audits);
    if (Array.isArray(data.rankings)) writeJson(KEYS.rankings, data.rankings);
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// 6. Legacy / Compatibility Adapters
// ==========================================

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
  const active = getActiveProject();
  return {
    name: active.name,
    primaryUrl: active.domain,
    updatedAt: active.updatedAt,
  };
}

export function setProject(meta: Partial<ProjectMeta>) {
  const active = getActiveProject();
  const next = saveProject({
    ...active,
    name: meta.name ?? active.name,
    domain: meta.primaryUrl ?? active.domain,
    updatedAt: new Date().toISOString(),
  });
  return {
    name: next.name,
    primaryUrl: next.domain,
    updatedAt: next.updatedAt,
  };
}

export function getDashboardStats() {
  const audits = getAudits();
  const jobs = getJobs();
  const rankings = getRankings();
  const traffic = getTrafficImports();
  const tasks = getTasks();
  const openTasks = tasks.filter((t) => t.status !== 'resolved').length;
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
    openTasksCount: openTasks,
    avgScore,
    scoreHistory,
    keywordSeries,
    recentAudits: audits.slice(0, 5),
    recentJobs: jobs.slice(0, 8),
  };
}
