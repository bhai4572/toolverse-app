'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import {
  Radio,
  Send,
  Users,
  Eye,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Mail,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface MediaContact {
  id: string;
  name: string;
  outlet: string;
  beat: string;
  email: string;
  status: 'prospect' | 'pitched' | 'followup' | 'won' | 'passed';
}

interface BrandMention {
  id: string;
  sourceUrl: string;
  outletName: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  hasBacklink: boolean;
  discoveredDate: string;
}

const STORAGE_KEY_PR_MEDIA = 'tv_pr_media_contacts';
const STORAGE_KEY_PR_MENTIONS = 'tv_pr_brand_mentions';

export function AiPrSuiteModule({ initialTab = 'pitch' }: { initialTab?: 'pitch' | 'media' | 'mentions' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'pitch' | 'media' | 'mentions'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. Pitch Generator State
  const [angle, setAngle] = useState<'data' | 'contrarian' | 'launch'>('data');
  const [journalistName, setJournalistName] = useState('Sarah Jenkins');
  const [outletName, setOutletName] = useState('TechCrunch');
  const [storyHook, setStoryHook] = useState(
    '68% of commercial SaaS websites suffer from silent indexing blockers and canonical mismatches'
  );
  const [productName, setProductName] = useState('ToolVerse Technical SEO Engine');
  const [keyFinding, setKeyFinding] = useState(
    'After auditing over 10,000 live URLs, we found that mobile viewport configuration errors and missing canonical tags cause up to 40% of page drops in Google Search Console.'
  );

  // 2. Media Directory State
  const [mediaList, setMediaList] = useState<MediaContact[]>([]);
  const [newName, setNewName] = useState('');
  const [newOutlet, setNewOutlet] = useState('');
  const [newBeat, setNewBeat] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // 3. Mentions Monitor State
  const [mentions, setMentions] = useState<BrandMention[]>([]);

  useEffect(() => {
    try {
      const savedMedia = localStorage.getItem(STORAGE_KEY_PR_MEDIA);
      if (savedMedia) {
        setMediaList(JSON.parse(savedMedia));
      } else {
        setMediaList([
          {
            id: 'm_1',
            name: 'Sarah Jenkins',
            outlet: 'TechCrunch',
            beat: 'Developer Tools & SaaS',
            email: 'sarah.j@techcrunch.com',
            status: 'prospect',
          },
          {
            id: 'm_2',
            name: 'David Chen',
            outlet: 'Search Engine Land',
            beat: 'Technical SEO & Search Algorithms',
            email: 'david@searchengineland.com',
            status: 'pitched',
          },
        ]);
      }

      const savedMentions = localStorage.getItem(STORAGE_KEY_PR_MENTIONS);
      if (savedMentions) {
        setMentions(JSON.parse(savedMentions));
      } else {
        setMentions([
          {
            id: 'bm_1',
            sourceUrl: 'https://news.ycombinator.com/item?id=391829',
            outletName: 'Hacker News',
            sentiment: 'positive',
            hasBacklink: true,
            discoveredDate: new Date().toISOString().split('T')[0],
          },
        ]);
      }
    } catch {}
  }, []);

  const saveMedia = (updated: MediaContact[]) => {
    setMediaList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PR_MEDIA, JSON.stringify(updated));
    } catch {}
  };

  const saveMentions = (updated: BrandMention[]) => {
    setMentions(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PR_MENTIONS, JSON.stringify(updated));
    } catch {}
  };

  // Generate Personalized Pitch
  const pitchOutput = useMemo(() => {
    const jName = journalistName.trim() || 'there';
    const oName = outletName.trim() || 'your publication';

    let subject = '';
    let body = '';

    if (angle === 'data') {
      subject = `Data: ${storyHook.slice(0, 38)}…`;
      body = `Hi ${jName},\n\nI’ve followed your coverage of tech infrastructure at ${oName} and thought your readers would find this proprietary dataset compelling:\n\n${keyFinding}\n\nWe’ve packaged these findings into an open technical report along with interactive reproduction steps using our zero-cost crawler (${productName}).\n\nWould you be interested in reviewing the full benchmark dataset or an embargoed preview of the research?\n\nBest regards,\n[Your Name]\n${project.primaryUrl || 'https://toolverse.baby'}`;
    } else if (angle === 'contrarian') {
      subject = `Why traditional SEO tools fail modern developers`;
      body = `Hi ${jName},\n\nMost modern dev teams still rely on legacy SEO suites that gate basic diagnostics behind $200/mo paywalls. With modern search algorithms enforcing strict Core Web Vitals and machine-readable data, developers need browser-native diagnostics.\n\nWe launched ${productName} to offer complete technical auditing with zero synthetic search volume fluff.\n\nHere's the core story: ${storyHook}.\n\nWould love to share early access and developer insights if this aligns with an upcoming piece at ${oName}.\n\nBest,\n[Your Name]`;
    } else {
      subject = `Launch: ${productName} brings free technical audits to webmasters`;
      body = `Hi ${jName},\n\nExcited to share that we’ve launched ${productName} — a free, browser-native suite of over 100 web utilities and SSRF-guarded site audit crawlers designed for creators and webmasters.\n\nKey highlights:\n- Full-site technical crawl with 0 arbitrary page limits\n- Real-time DOM inspection for canonical, metadata, and schema\n- Exportable client reports with zero fake metrics\n\nFull announcement: ${project.primaryUrl || 'https://toolverse.baby'}\n\nHappy to provide quotes, screenshots, or background context for ${oName}.\n\nWarm regards,\n[Your Name]`;
    }

    return { subject, body };
  }, [angle, journalistName, outletName, storyHook, keyFinding, productName, project.primaryUrl]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMedia = () => {
    if (!newName.trim() || !newOutlet.trim()) return;
    const contact: MediaContact = {
      id: `m_${Date.now()}`,
      name: newName.trim(),
      outlet: newOutlet.trim(),
      beat: newBeat.trim() || 'General Tech',
      email: newEmail.trim() || 'editor@example.com',
      status: 'prospect',
    };
    saveMedia([contact, ...mediaList]);
    setNewName('');
    setNewOutlet('');
    setNewBeat('');
    setNewEmail('');
    setNotice('Media contact added to CRM directory!');
  };

  const handleDeleteMedia = (id: string) => {
    saveMedia(mediaList.filter((m) => m.id !== id));
  };

  const handleUpdateStatus = (id: string, status: MediaContact['status']) => {
    saveMedia(mediaList.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  return (
    <ModuleShell
      title="Digital PR & Outreach Intelligence"
      purpose="Draft data-backed journalist pitches, manage high-authority media contacts, and monitor brand mentions and unlinked citations."
      honesty="Production PR outreach workflow. Generates customized pitch angles with subject-line length validation and CRM contact tracking."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pitch')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'pitch'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          Journalist Pitch Generator
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'media'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Media Contact Directory ({mediaList.length})
        </button>
        <button
          onClick={() => setActiveTab('mentions')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'mentions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          Brand Mention & Link Monitor ({mentions.length})
        </button>
      </div>

      {notice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: Pitch Generator */}
      {activeTab === 'pitch' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Pitch Strategy & Story Hook">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Journalistic Angle</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setAngle('data')}
                        className={`p-2 rounded-lg border text-xs font-bold transition ${
                          angle === 'data'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        📊 Data / Research
                      </button>
                      <button
                        type="button"
                        onClick={() => setAngle('contrarian')}
                        className={`p-2 rounded-lg border text-xs font-bold transition ${
                          angle === 'contrarian'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        ⚡ Contrarian
                      </button>
                      <button
                        type="button"
                        onClick={() => setAngle('launch')}
                        className={`p-2 rounded-lg border text-xs font-bold transition ${
                          angle === 'launch'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        🚀 Launch Milestone
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Journalist Name</label>
                      <input
                        value={journalistName}
                        onChange={(e) => setJournalistName(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Publication</label>
                      <input
                        value={outletName}
                        onChange={(e) => setOutletName(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Story Hook / Headline</label>
                    <input
                      value={storyHook}
                      onChange={(e) => setStoryHook(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Key Finding / Proof Point</label>
                    <textarea
                      rows={3}
                      value={keyFinding}
                      onChange={(e) => setKeyFinding(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title="Personalized Email Draft">
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-bold">Subject Line</span>
                      <span className={pitchOutput.subject.length <= 50 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                        {pitchOutput.subject.length}/50 chars (Mobile Optimized)
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white select-all">
                      {pitchOutput.subject}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <pre className="font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                      {pitchOutput.body}
                    </pre>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        createTask({
                          title: `Pitch ${outletName} (${journalistName}) with ${angle} angle`,
                          category: 'content',
                          priority: 'high',
                          suggestedFix: pitchOutput.subject,
                        });
                        setNotice('Pitch task saved to Task Manager!');
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      + Create Outreach Task
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(`Subject: ${pitchOutput.subject}\n\n${pitchOutput.body}`)
                      }
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Subject & Pitch
                    </button>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Media Directory */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Add Journalist / Outlet">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Journalist Name *</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Alex Heath"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Publication / Outlet *</label>
                    <input
                      value={newOutlet}
                      onChange={(e) => setNewOutlet(e.target.value)}
                      placeholder="e.g. The Verge"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Beat / Coverage Area</label>
                    <input
                      value={newBeat}
                      onChange={(e) => setNewBeat(e.target.value)}
                      placeholder="e.g. Big Tech, Search Engines"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Contact Email</label>
                    <input
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. alex@theverge.com"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={!newName.trim() || !newOutlet.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Save Contact
                  </button>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title={`Media CRM Contacts (${mediaList.length})`}>
                <div className="space-y-3">
                  {mediaList.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {contact.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {contact.outlet} · <span className="text-slate-400">{contact.beat}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={contact.status}
                            onChange={(e) => handleUpdateStatus(contact.id, e.target.value as any)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border border-transparent ${
                              contact.status === 'won'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : contact.status === 'pitched'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : contact.status === 'followup'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <option value="prospect">Prospect</option>
                            <option value="pitched">Pitched</option>
                            <option value="followup">Followed Up</option>
                            <option value="won">Coverage Won 🏆</option>
                            <option value="passed">Passed</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(contact.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {contact.email && (
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${contact.email}`} className="hover:text-indigo-600">
                            {contact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}

                  {mediaList.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No media contacts saved. Build your outreach CRM on the left.
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Mentions Monitor */}
      {activeTab === 'mentions' && (
        <div className="space-y-6">
          <Panel title="Brand Mentions & Unlinked Citation Tracker">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
              {mentions.map((m) => (
                <div key={m.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {m.outletName}
                      <span className="text-[10px] text-slate-400">{m.discoveredDate}</span>
                    </div>
                    <a
                      href={m.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 font-mono text-[11px] hover:text-indigo-600 flex items-center gap-1 truncate max-w-md"
                    >
                      {m.sourceUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.hasBacklink
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {m.hasBacklink ? 'Dofollow Link Included' : 'Unlinked Mention (Outreach Opportunity)'}
                    </span>
                    {!m.hasBacklink && (
                      <button
                        type="button"
                        onClick={() => {
                          createTask({
                            title: `Reach out to ${m.outletName} for unlinked brand mention backlink`,
                            category: 'technical',
                            priority: 'medium',
                            suggestedFix: `Source: ${m.sourceUrl}`,
                          });
                          setNotice('Outreach task created in Task Manager!');
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-500 transition"
                      >
                        Claim Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
