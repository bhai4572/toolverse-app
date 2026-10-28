'use client';

import React, { useState, useEffect } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import {
  Link2,
  Mail,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  Clock,
  Send,
} from 'lucide-react';

interface OutreachLead {
  id: string;
  targetDomain: string;
  articleUrl: string;
  contactEmail: string;
  desiredAnchor: string;
  targetLandingPage: string;
  status: 'prospect' | 'contacted' | 'negotiating' | 'won' | 'rejected';
  lastContactDate: string;
  notes: string;
}

const STORAGE_KEY_OUTREACH = 'tv_link_outreach_leads';

export function LinkOutreachModule() {
  const project = getActiveProject();
  const [leads, setLeads] = useState<OutreachLead[]>([]);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // Form State
  const [targetDomain, setTargetDomain] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [desiredAnchor, setDesiredAnchor] = useState('technical SEO audit');
  const [targetLandingPage, setTargetLandingPage] = useState(() => project.primaryUrl || 'https://toolverse.baby');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OUTREACH);
      if (saved) {
        setLeads(JSON.parse(saved));
      } else {
        setLeads([
          {
            id: 'lead_1',
            targetDomain: 'smashingmagazine.com',
            articleUrl: 'https://www.smashingmagazine.com/2026/02/modern-webmaster-tools/',
            contactEmail: 'editors@smashingmagazine.com',
            desiredAnchor: 'free site audit crawler',
            targetLandingPage: 'https://toolverse.baby/workspace/site-audit',
            status: 'contacted',
            lastContactDate: new Date().toISOString().split('T')[0],
            notes: 'Pitched developer tools roundup inclusion.',
          },
          {
            id: 'lead_2',
            targetDomain: 'css-tricks.com',
            articleUrl: 'https://css-tricks.com/core-web-vitals-guide/',
            contactEmail: 'team@css-tricks.com',
            desiredAnchor: 'on-page DOM inspector',
            targetLandingPage: 'https://toolverse.baby/workspace/on-page-seo',
            status: 'negotiating',
            lastContactDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
            notes: 'Agreed to mention ToolVerse in updated resource list.',
          },
        ]);
      }
    } catch {}
  }, []);

  const saveLeads = (updated: OutreachLead[]) => {
    setLeads(updated);
    try {
      localStorage.setItem(STORAGE_KEY_OUTREACH, JSON.stringify(updated));
    } catch {}
  };

  const handleAddLead = () => {
    if (!targetDomain.trim()) return;
    const cleanDomain = targetDomain.trim().replace(/^https?:\/\//, '').split('/')[0];
    const newLead: OutreachLead = {
      id: `lead_${Date.now()}`,
      targetDomain: cleanDomain,
      articleUrl: articleUrl.trim() || `https://${cleanDomain}`,
      contactEmail: contactEmail.trim(),
      desiredAnchor: desiredAnchor.trim() || 'brand anchor',
      targetLandingPage: targetLandingPage.trim(),
      status: 'prospect',
      lastContactDate: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
    };
    saveLeads([newLead, ...leads]);
    setTargetDomain('');
    setArticleUrl('');
    setContactEmail('');
    setNotes('');
    setNotice('Outreach prospect added to campaign!');
  };

  const handleDeleteLead = (id: string) => {
    saveLeads(leads.filter((l) => l.id !== id));
  };

  const handleUpdateStatus = (id: string, status: OutreachLead['status']) => {
    saveLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <ModuleShell
      title="Link Building Outreach & Campaign CRM"
      purpose="Track external link building outreach, webmaster negotiations, target anchor texts, and secured backlinks."
      honesty="Production link outreach manager. Manage real backlink pipeline and communication states directly in your browser."
    >
      {notice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <Panel title="Add New Outreach Target">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Website Domain *</label>
                <input
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  placeholder="e.g. techcrunch.com"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Article URL</label>
                <input
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  placeholder="https://example.com/blog/best-tools"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Contact / Webmaster Email</label>
                  <input
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="editor@example.com"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Anchor Text</label>
                  <input
                    value={desiredAnchor}
                    onChange={(e) => setDesiredAnchor(e.target.value)}
                    placeholder="e.g. SEO audit tool"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Landing Page URL</label>
                <input
                  value={targetLandingPage}
                  onChange={(e) => setTargetLandingPage(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Outreach Angle / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Resource page broken link replacement pitch..."
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleAddLead}
                disabled={!targetDomain.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add to Outreach Pipeline
              </button>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Panel title={`Active Outreach Pipeline (${leads.length})`}>
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        {lead.targetDomain}
                        {lead.articleUrl && (
                          <a
                            href={lead.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Anchor: <span className="font-semibold text-indigo-600 dark:text-indigo-400">&ldquo;{lead.desiredAnchor}&rdquo;</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border border-transparent ${
                          lead.status === 'won'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : lead.status === 'negotiating'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : lead.status === 'prospect'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        }`}
                      >
                        <option value="prospect">Prospect</option>
                        <option value="contacted">Pitched / Contacted</option>
                        <option value="negotiating">Negotiating</option>
                        <option value="won">Backlink Won 🏆</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {lead.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg leading-relaxed">
                      {lead.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Last updated: {lead.lastContactDate}</span>
                    {lead.contactEmail && (
                      <a
                        href={`mailto:${lead.contactEmail}?subject=Quick question regarding your resource guide`}
                        className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> Email Webmaster
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {leads.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No outreach leads in pipeline. Add target domains on the left.
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </ModuleShell>
  );
}
