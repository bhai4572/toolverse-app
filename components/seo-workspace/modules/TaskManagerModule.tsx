'use client';

import React, { useState } from 'react';
import { ModuleShell } from '../ModuleShell';
import {
  getActiveProject,
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from '@/lib/seo/workspace/workspaceStorage';
import type { TaskRecord, TaskStatus, SeverityLevel } from '@/lib/seo/workspace/workspaceTypes';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Filter,
  CheckSquare,
} from 'lucide-react';

export function TaskManagerModule() {
  const project = getActiveProject();
  const [tasks, setTasks] = useState<TaskRecord[]>(() => getTasks(project.id));
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | SeverityLevel>('all');

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('warning');
  const [newUrl, setNewUrl] = useState('');

  const refresh = () => {
    setTasks(getTasks(project.id));
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
    refresh();
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    refresh();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createTask({
      projectId: project.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      severity: newSeverity,
      status: 'open',
      url: newUrl.trim() || undefined,
    });

    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
    setShowAddModal(false);
    refresh();
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (severityFilter !== 'all' && t.severity !== severityFilter) return false;
    return true;
  });

  const openCount = tasks.filter((t) => t.status === 'open').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const resolvedCount = tasks.filter((t) => t.status === 'resolved').length;

  return (
    <ModuleShell
      title="Actionable SEO Tasks & Remediation"
      purpose="Track, prioritize, and verify technical and content fixes generated directly from Site Audits, Search Console opportunities, and manual review."
      honesty="Tasks represent internal remediation workflows for your website. Status updates and verification runs are tracked locally."
    >
      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Tasks</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {tasks.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Open
          </div>
          <div className="text-2xl font-black text-rose-500 mt-1">{openCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1">{inProgressCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </div>
          <div className="text-2xl font-black text-emerald-500 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              statusFilter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('open')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              statusFilter === 'open'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            Open ({openCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in-progress')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              statusFilter === 'in-progress'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              statusFilter === 'resolved'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                <tr className="text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Affected URL</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">
                          {task.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <SeverityBadge severity={task.severity} />
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                          task.status === 'resolved'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : task.status === 'in-progress'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs truncate text-[11px]">
                      {task.url ? (
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          <span className="truncate">{task.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Site-wide</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete task"
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
          <div className="p-8 text-center space-y-2">
            <CheckSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No tasks matching current filter
            </div>
            <p className="text-xs text-slate-500">
              Run a Site Audit or inspect URLs to generate remediation tasks.
            </p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Remediation Task
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add canonical tag to pricing page"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                  Description & Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Details, evidence, or instructions..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                    Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Notice / Info</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">
                    Affected URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/page"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-bold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}

function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  if (severity === 'critical') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400">
        Critical
      </span>
    );
  }
  if (severity === 'warning') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400">
        Warning
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400">
      Notice
    </span>
  );
}
