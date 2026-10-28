import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProjects,
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
} from '../lib/seo/workspace/workspaceStorage';

describe('Workspace Storage & Tenancy Foundation', () => {
  beforeEach(() => {
    clearWorkspaceMemoryStore();
  });

  it('initializes default project when empty', () => {
    const projects = getProjects();
    expect(projects.length).toBeGreaterThanOrEqual(1);
    expect(projects[0].domain).toBeDefined();
    expect(projects[0].verification.token).toMatch(/^toolverse-verify-/);
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
