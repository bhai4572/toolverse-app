import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProjects,
  hasProjects,
  createProject,
  getActiveProject,
  setActiveProjectId,
  deleteProject,
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  exportFullWorkspaceBackup,
  importFullWorkspaceBackup,
  generateVerificationToken,
  clearWorkspaceMemoryStore,
  addRankEntry,
  getRankings,
  getProjectSummary,
  NO_PROJECT_ID,
} from '../lib/seo/workspace/workspaceStorage';

describe('Workspace Storage & Tenancy Foundation', () => {
  beforeEach(() => {
    clearWorkspaceMemoryStore();
  });

  it('starts with NO project (no hard-coded default website)', () => {
    expect(getProjects()).toHaveLength(0);
    expect(hasProjects()).toBe(false);
    expect(getActiveProject().id).toBe(NO_PROJECT_ID);
    expect(getActiveProject().domain).toBe('');
  });

  it('keeps data isolated per project and cascades on delete', () => {
    const a = createProject({ name: 'A', domain: 'a.example' });
    addRankEntry({ keyword: 'alpha', domain: 'a.example', position: 3, at: new Date().toISOString() });
    createTask({ title: 'task A' });
    const b = createProject({ name: 'B', domain: 'b.example' });
    addRankEntry({ keyword: 'beta', domain: 'b.example', position: 9, at: new Date().toISOString() });

    expect(getRankings(a.id).map((r) => r.keyword)).toEqual(['alpha']);
    expect(getRankings(b.id).map((r) => r.keyword)).toEqual(['beta']);
    expect(getTasks(a.id)).toHaveLength(1);
    expect(getTasks(b.id)).toHaveLength(0);
    expect(getProjectSummary(a.id).openTasks).toBe(1);

    deleteProject(a.id);
    expect(getProjects().map((p) => p.id)).toEqual([b.id]);
    expect(getRankings(a.id)).toHaveLength(0);
    expect(getTasks(a.id)).toHaveLength(0);
    expect(getRankings(b.id)).toHaveLength(1);
    expect(getActiveProject().id).toBe(b.id);

    deleteProject(b.id);
    expect(hasProjects()).toBe(false);
  });

  it('createTask fills projectId/status/severity defaults', () => {
    const p = createProject({ name: 'T', domain: 't.example' });
    const t = createTask({ title: 'quick' });
    expect(t.projectId).toBe(p.id);
    expect(t.status).toBe('open');
    expect(t.severity).toBe('warning');
  });

  it('creates and switches active projects', () => {
    const created = createProject({
      name: 'Client Alpha',
      domain: 'https://client-alpha.example',
      targetCountry: 'United Kingdom',
      targetLanguage: 'en',
    });

    expect(created.id).toMatch(/^proj_/);
    expect(created.name).toBe('Client Alpha');
    expect(created.verification.verified).toBe(false);

    const active = getActiveProject();
    expect(active.id).toBe(created.id);
    expect(active.name).toBe('Client Alpha');
  });

  it('manages task lifecycle and updates status', () => {
    const project = getActiveProject();
    const task = createTask({
      projectId: project.id,
      title: 'Fix missing H1 on homepage',
      description: 'Crawl identified 0 H1 tags on https://client-alpha.example',
      severity: 'critical',
      status: 'open',
      url: 'https://client-alpha.example',
      findingRuleId: 'h1_missing',
    });

    expect(task.id).toMatch(/^task_/);
    expect(task.status).toBe('open');

    let tasks = getTasks(project.id);
    expect(tasks.some((t) => t.id === task.id)).toBe(true);

    updateTaskStatus(task.id, 'resolved');
    tasks = getTasks(project.id);
    const updated = tasks.find((t) => t.id === task.id);
    expect(updated?.status).toBe('resolved');
    expect(updated?.resolvedAt).toBeDefined();

    deleteTask(task.id);
    tasks = getTasks(project.id);
    expect(tasks.some((t) => t.id === task.id)).toBe(false);
  });

  it('generates consistent domain-specific verification tokens', () => {
    const token = generateVerificationToken('test-domain.org');
    expect(token).toMatch(/^toolverse-verify-testdomain-[a-z0-9]+/);
  });

  it('exports and imports workspace backup snapshots', () => {
    createProject({
      name: 'Backup Test Site',
      domain: 'https://backup-test.org',
    });

    const backupJson = exportFullWorkspaceBackup();
    expect(backupJson).toContain('Backup Test Site');

    clearWorkspaceMemoryStore();
    const success = importFullWorkspaceBackup(backupJson);
    expect(success).toBe(true);

    const restored = getProjects();
    expect(restored.some((p) => p.name === 'Backup Test Site')).toBe(true);
  });
});
