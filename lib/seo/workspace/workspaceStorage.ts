/**
 * Local-first persistence for SEO Workspace — YOUR data only (no fake market graphs).
 * Multi-project tenancy: every record is owned by exactly one project. Deleting a
 * project deletes everything it owns. There is NO built-in default project.
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
} from './workspaceTypes';

const KEYS = {
  audits: 'tv_seo_audits_v1',
  rankings: 'tv_seo_rankings_v1',
  jobs: 'tv_seo_jobs_v1',
  traffic: 'tv_seo_traffic_v1',
  checklists: 'tv_seo_checklists_v1',
  projects: 'tv_seo_projects_v2',
  activeProjectId: 'tv_seo_active_project_id_v2',
  tasks: 'tv_seo_tasks_v2',
  auditRuns: 'tv_seo_audit_runs_v2',
  keywords: 'tv_seo_keywords_v2',
  backlinks: 'tv_seo_backlinks_v2',
  records: 'tv_seo_module_records_v1',
} as const;

/** Id used by the placeholder returned when the user has no website yet. */
export const NO_PROJECT_ID = 'none';

export interface StoredAudit {
  id: string;
  projectId?: string;
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
  projectId?: string;
  keyword: string;
  domain: string;
  position: number;
  notes?: string;
  at: string;
}

export interface JobRun {
  id: string;
  projectId?: string;
  moduleId: string;
  label: string;
  score: number;
  summary: string;
  at: string;
  chart?: Array<{ label: string; value: number }>;
}

export interface TrafficImportRow {
  projectId?: string;
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
    // quota / private mode: ignore
  }
}

// ==========================================
// Ownership helpers
// ==========================================

type Owned = { projectId?: string };

function firstProjectId(): string {
  return readJson<Project[]>(KEYS.projects, [])[0]?.id || '';
}

/** Records written before multi-project support have no projectId: they belong to the first project. */
function ownerOf(r: Owned): string {
  return r.projectId ?? firstProjectId();
}

function readAll<T>(key: string): T[] {
  return readJson<T[]>(key, []);
}

function forProject<T extends Owned>(list: T[], projectId: string): T[] {
  return list.filter((r) => ownerOf(r) === projectId);
}

/** Replace one project's records, keep every other project's records untouched. */
function replaceForProject<T extends Owned>(key: string, projectId: string, own: T[]) {
  const others = readAll<T>(key).filter((r) => ownerOf(r) !== projectId);
  writeJson(key, [...own.map((r) => ({ ...r, projectId })), ...others]);
}

// ==========================================
// 1. Projects & tenancy
// ==========================================

export function generateVerificationToken(domain: string): string {
  const clean = domain.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 10);
  const rand = Math.random().toString(36).substring(2, 10);
  return `toolverse-verify-${clean}-${rand}`;
}

function placeholderProject(): Project {
  const now = new Date().toISOString();
  return {
    id: NO_PROJECT_ID,
    name: 'No website yet',
    domain: '',
    scope: 'domain',
    targetCountry: 'Global',
    targetLanguage: 'en',
    competitors: [],
    verification: { token: '', verified: false },
    settings: { maxCrawlPages: 0, maxCrawlDepth: 0, includeQueryParams: false, respectRobotsTxt: true },
    createdAt: now,
    updatedAt: now,
  };
}

export function hasProjects(): boolean {
  return readJson<Project[]>(KEYS.projects, []).length > 0;
}

export function getProjects(): Project[] {
  return readJson<Project[]>(KEYS.projects, []);
}

export function getActiveProjectId(): string {
  const list = getProjects();
  const stored = readJson<string>(KEYS.activeProjectId, '');
  if (stored && list.some((p) => p.id === stored)) return stored;
  return list[0]?.id || NO_PROJECT_ID;
}

export function setActiveProjectId(id: string) {
  writeJson(KEYS.activeProjectId, id);
}

export function getActiveProject(): Project {
  const list = getProjects();
  const activeId = getActiveProjectId();
  return list.find((p) => p.id === activeId) || list[0] || placeholderProject();
}

export function saveProject(project: Project): Project {
  const list = getProjects();
  const idx = list.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = updated;
  else list.push(updated);
  writeJson(KEYS.projects, list);
  return updated;
}

export function updateProject(id: string, patch: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
  const current = getProjects().find((p) => p.id === id);
  if (!current) return null;
  return saveProject({ ...current, ...patch });
}

export function normalizeDomain(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function createProject(params: {
  name: string;
  domain: string;
  scope?: ProjectScope;
  targetCountry?: string;
  targetLanguage?: string;
  businessCategory?: string;
  competitors?: string[];
}): Project {
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const domain = normalizeDomain(params.domain);
  const cleanDomain = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  const now = new Date().toISOString();
  const project: Project = {
    id,
    name: params.name.trim() || cleanDomain || 'New Project',
    domain,
    scope: params.scope || 'domain',
    targetCountry: params.targetCountry || 'Global',
    targetLanguage: params.targetLanguage || 'en',
    businessCategory: params.businessCategory,
    competitors: params.competitors || [],
    verification: { token: generateVerificationToken(cleanDomain), verified: false },
    settings: {
      maxCrawlPages: 0, // 0 = whole website
      maxCrawlDepth: 0,
      includeQueryParams: false,
      respectRobotsTxt: true,
      userAgent: 'ToolVerseBot/1.0 (+https://toolverse.baby/bot)',
    },
    createdAt: now,
    updatedAt: now,
  };

  // First project adopts any pre-multi-project data (it was owned by the first project anyway).
  const list = getProjects();
  writeJson(KEYS.projects, [...list, project]);
  setActiveProjectId(project.id);
  return project;
}

/** Deletes the project AND every record it owns. */
export function deleteProject(id: string): void {
  const list = getProjects();
  const owner = list[0]?.id;
  const isOwned = (r: Owned) => (r.projectId ?? owner) === id;

  const purge = <T extends Owned>(key: string) =>
    writeJson(key, readAll<T>(key).filter((r) => !isOwned(r)));

  purge(KEYS.audits);
  purge(KEYS.rankings);
  purge(KEYS.jobs);
  purge(KEYS.traffic);
  purge(KEYS.tasks);
  purge(KEYS.auditRuns);
  purge(KEYS.keywords);
  purge(KEYS.backlinks);
  purge(KEYS.records);

  const checklists = readJson<Record<string, unknown>>(KEYS.checklists, {});
  for (const k of Object.keys(checklists)) if (k.startsWith(`${id}:`)) delete checklists[k];
  writeJson(KEYS.checklists, checklists);

  const remaining = list.filter((p) => p.id !== id);
  writeJson(KEYS.projects, remaining);
  if (readJson<string>(KEYS.activeProjectId, '') === id) {
    setActiveProjectId(remaining[0]?.id || '');
  }
}

// ==========================================
// 2. Tasks
// ==========================================

export type NewTaskInput = Pick<TaskRecord, 'title'> & Partial<Omit<TaskRecord, 'id' | 'createdAt' | 'title'>>;

export function getTasks(projectId: string = getActiveProjectId()): TaskRecord[] {
  return forProject(readAll<TaskRecord>(KEYS.tasks), projectId);
}

export function createTask(task: NewTaskInput): TaskRecord {
  const newTask: TaskRecord = {
    projectId: getActiveProjectId(),
    description: '',
    severity: 'warning',
    status: 'open',
    ...task,
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  writeJson(KEYS.tasks, [newTask, ...readAll<TaskRecord>(KEYS.tasks)]);
  return newTask;
}

export function updateTaskStatus(taskId: string, status: TaskStatus): void {
  const all = readAll<TaskRecord>(KEYS.tasks);
  const idx = all.findIndex((t) => t.id === taskId);
  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
    };
    writeJson(KEYS.tasks, all);
  }
}

export function deleteTask(taskId: string): void {
  writeJson(KEYS.tasks, readAll<TaskRecord>(KEYS.tasks).filter((t) => t.id !== taskId));
}

// ==========================================
// 3. Deep audit runs
// ==========================================

export function getAuditRuns(projectId: string = getActiveProjectId()): AuditRunRecord[] {
  return forProject(readAll<AuditRunRecord>(KEYS.auditRuns), projectId);
}

export function saveAuditRun(run: AuditRunRecord): void {
  const own = [run, ...getAuditRuns(run.projectId)].slice(0, 30);
  replaceForProject(KEYS.auditRuns, run.projectId, own);
}

export function getLatestAuditRun(projectId?: string): AuditRunRecord | null {
  return getAuditRuns(projectId)[0] || null;
}

// ==========================================
// 4. Keyword & backlink repositories
// ==========================================

export function getKeywords(projectId: string = getActiveProjectId()): KeywordItem[] {
  return forProject(readAll<KeywordItem>(KEYS.keywords), projectId);
}

export function saveKeywords(items: KeywordItem[]): void {
  const map = new Map<string, KeywordItem>();
  for (const c of readAll<KeywordItem>(KEYS.keywords)) map.set(c.id, c);
  for (const item of items) map.set(item.id, item);
  writeJson(KEYS.keywords, Array.from(map.values()).slice(0, 5000));
}

export function deleteKeyword(id: string): void {
  writeJson(KEYS.keywords, readAll<KeywordItem>(KEYS.keywords).filter((k) => k.id !== id));
}

export function getBacklinks(projectId: string = getActiveProjectId()): BacklinkItem[] {
  return forProject(readAll<BacklinkItem>(KEYS.backlinks), projectId);
}

export function saveBacklinks(items: BacklinkItem[]): void {
  const map = new Map<string, BacklinkItem>();
  for (const c of readAll<BacklinkItem>(KEYS.backlinks)) map.set(c.id, c);
  for (const item of items) map.set(item.id, item);
  writeJson(KEYS.backlinks, Array.from(map.values()).slice(0, 10000));
}

// ==========================================
// 5. Generic per-project record store (used by tools that keep user-entered lists)
// ==========================================

interface ModuleRecord extends Owned {
  collection: string;
  id: string;
  data: unknown;
}

export function getRecords<T>(collection: string, projectId: string = getActiveProjectId()): T[] {
  return forProject(readAll<ModuleRecord>(KEYS.records), projectId)
    .filter((r) => r.collection === collection)
    .map((r) => r.data as T);
}

export function setRecords<T>(collection: string, items: T[], projectId: string = getActiveProjectId()) {
  const all = readAll<ModuleRecord>(KEYS.records);
  const keep = all.filter((r) => !(ownerOf(r) === projectId && r.collection === collection));
  const fresh: ModuleRecord[] = items.map((data, i) => ({
    collection,
    id: `${collection}_${i}`,
    projectId,
    data,
  }));
  writeJson(KEYS.records, [...fresh, ...keep]);
}

// ==========================================
// 6. Backup & restore
// ==========================================

export function exportFullWorkspaceBackup(): string {
  const dump = {
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    projects: getProjects(),
    activeProjectId: readJson<string>(KEYS.activeProjectId, ''),
    tasks: readAll(KEYS.tasks),
    auditRuns: readAll(KEYS.auditRuns),
    keywords: readAll(KEYS.keywords),
    backlinks: readAll(KEYS.backlinks),
    audits: readAll(KEYS.audits),
    rankings: readAll(KEYS.rankings),
    jobs: readAll(KEYS.jobs),
    traffic: readAll(KEYS.traffic),
    records: readAll(KEYS.records),
  };
  return JSON.stringify(dump, null, 2);
}

export function importFullWorkspaceBackup(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') return false;
    const arr = (k: keyof typeof KEYS, v: unknown) => Array.isArray(v) && writeJson(KEYS[k], v);
    arr('projects', data.projects);
    if (typeof data.activeProjectId === 'string') writeJson(KEYS.activeProjectId, data.activeProjectId);
    arr('tasks', data.tasks);
    arr('auditRuns', data.auditRuns);
    arr('keywords', data.keywords);
    arr('backlinks', data.backlinks);
    arr('audits', data.audits);
    arr('rankings', data.rankings);
    arr('jobs', data.jobs);
    arr('traffic', data.traffic);
    arr('records', data.records);
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// 7. Per-project legacy-named accessors
// ==========================================

export function getAudits(projectId: string = getActiveProjectId()): StoredAudit[] {
  return forProject(readAll<StoredAudit>(KEYS.audits), projectId);
}

export function saveAudit(audit: Omit<StoredAudit, 'id' | 'at'> & { id?: string; at?: string }): StoredAudit {
  const projectId = audit.projectId ?? getActiveProjectId();
  const entry: StoredAudit = {
    ...audit,
    projectId,
    id: audit.id || `audit_${Date.now()}`,
    at: audit.at || new Date().toISOString(),
  };
  replaceForProject(KEYS.audits, projectId, [entry, ...getAudits(projectId)].slice(0, 50));
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

export function getRankings(projectId: string = getActiveProjectId()): RankEntry[] {
  return forProject(readAll<RankEntry>(KEYS.rankings), projectId);
}

export function addRankEntry(entry: RankEntry) {
  const projectId = entry.projectId ?? getActiveProjectId();
  const list = [...getRankings(projectId), { ...entry, projectId }].slice(-500);
  replaceForProject(KEYS.rankings, projectId, list);
  return list;
}

export function clearRankings() {
  replaceForProject<RankEntry>(KEYS.rankings, getActiveProjectId(), []);
}

export function getJobs(projectId: string = getActiveProjectId()): JobRun[] {
  return forProject(readAll<JobRun>(KEYS.jobs), projectId);
}

export function pushJob(partial: Omit<JobRun, 'id' | 'at'> & { id?: string; at?: string }): JobRun {
  const projectId = partial.projectId ?? getActiveProjectId();
  const job: JobRun = {
    ...partial,
    projectId,
    id: partial.id || `job_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    at: partial.at || new Date().toISOString(),
  };
  replaceForProject(KEYS.jobs, projectId, [job, ...getJobs(projectId)].slice(0, 80));
  return job;
}

export function getTrafficImports(projectId: string = getActiveProjectId()): TrafficImportRow[] {
  return forProject(readAll<TrafficImportRow>(KEYS.traffic), projectId);
}

export function setTrafficImports(rows: TrafficImportRow[]) {
  replaceForProject(KEYS.traffic, getActiveProjectId(), rows.slice(0, 730));
}

export function getChecklistState(id: string): Record<string, boolean> {
  const all = readJson<Record<string, Record<string, boolean>>>(KEYS.checklists, {});
  return all[`${getActiveProjectId()}:${id}`] || {};
}

export function setChecklistState(id: string, state: Record<string, boolean>) {
  const all = readJson<Record<string, Record<string, boolean>>>(KEYS.checklists, {});
  all[`${getActiveProjectId()}:${id}`] = state;
  writeJson(KEYS.checklists, all);
}

export function getProject(): ProjectMeta {
  const active = getActiveProject();
  return { name: active.name, primaryUrl: active.domain, updatedAt: active.updatedAt };
}

export function setProject(meta: Partial<ProjectMeta>) {
  if (!hasProjects()) {
    if (!meta.primaryUrl) return getProject();
    const created = createProject({ name: meta.name || '', domain: meta.primaryUrl });
    return { name: created.name, primaryUrl: created.domain, updatedAt: created.updatedAt };
  }
  const active = getActiveProject();
  const next = saveProject({
    ...active,
    name: meta.name ?? active.name,
    domain: meta.primaryUrl ?? active.domain,
  });
  return { name: next.name, primaryUrl: next.domain, updatedAt: next.updatedAt };
}

// ==========================================
// 8. Dashboard aggregates (all per project)
// ==========================================

export interface ProjectSummary {
  projectId: string;
  auditCount: number;
  latestScore: number | null;
  latestAuditAt: string | null;
  pagesCrawled: number;
  criticalIssues: number;
  openTasks: number;
  keywordCount: number;
  trackedRankings: number;
}

export function getProjectSummary(projectId: string): ProjectSummary {
  const runs = getAuditRuns(projectId);
  const audits = getAudits(projectId);
  const latestRun = runs[0];
  const latestAudit = audits[0];
  return {
    projectId,
    auditCount: Math.max(runs.length, audits.length),
    latestScore: latestRun ? latestRun.healthScore : latestAudit ? latestAudit.score : null,
    latestAuditAt: latestRun?.at || latestAudit?.at || null,
    pagesCrawled: latestRun?.crawledPagesCount || 0,
    criticalIssues: latestRun?.criticalCount || 0,
    openTasks: getTasks(projectId).filter((t) => t.status !== 'resolved').length,
    keywordCount: getKeywords(projectId).length,
    trackedRankings: new Set(getRankings(projectId).map((r) => r.keyword.toLowerCase())).size,
  };
}

export function getDashboardStats() {
  const audits = getAudits();
  const jobs = getJobs();
  const rankings = getRankings();
  const traffic = getTrafficImports();
  const openTasks = getTasks().filter((t) => t.status !== 'resolved').length;
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
