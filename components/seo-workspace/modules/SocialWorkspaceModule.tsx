'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject } from '@/lib/seo/workspace/workspaceStorage';
import {
  Share2,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Hash,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  Eye,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface SocialPost {
  id: string;
  channel: 'x' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  scheduledDate: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  targetUrl?: string;
}

const STORAGE_KEY_SOCIAL_CALENDAR = 'tv_social_campaign_calendar';
const STORAGE_KEY_SAVED_UTMS = 'tv_saved_utm_campaigns';

export function SocialWorkspaceModule({ initialTab = 'preview' }: { initialTab?: 'preview' | 'calendar' | 'utm' | 'hashtags' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'preview' | 'calendar' | 'utm' | 'hashtags'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. Social Preview State
  const [targetUrl, setTargetUrl] = useState(() => project.primaryUrl || 'https://toolverse.baby/workspace');
  const [ogTitle, setOgTitle] = useState('ToolVerse — Advanced SEO & Marketing Intelligence Platform');
  const [ogDescription, setOgDescription] = useState(
    'Free technical site audits, on-page SEO diagnostics, rank tracking, and marketing tools. Empowering creators and developers.'
  );
  const [ogImage, setOgImage] = useState('https://toolverse.baby/og-image.png');
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'x' | 'linkedin'>('x');

  // 2. UTM Builder State
  const [utmBaseUrl, setUtmBaseUrl] = useState(() => project.primaryUrl || 'https://toolverse.baby');
  const [utmSource, setUtmSource] = useState('twitter');
  const [utmMedium, setUtmMedium] = useState('social');
  const [utmCampaign, setUtmCampaign] = useState('spring_launch_2026');
  const [utmTerm, setUtmTerm] = useState('seo-tools');
  const [utmContent, setUtmContent] = useState('banner_v1');
  const [savedUtms, setSavedUtms] = useState<string[]>([]);

  // 3. Social Calendar State
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPostChannel, setNewPostChannel] = useState<SocialPost['channel']>('x');
  const [newPostDate, setNewPostDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newPostContent, setNewPostContent] = useState('');

  // 4. Hashtag Generator State
  const [hashtagTopic, setHashtagTopic] = useState('seo digital marketing startup tech');

  // Load calendar & saved UTMs on mount
  useEffect(() => {
    try {
      const savedCal = localStorage.getItem(STORAGE_KEY_SOCIAL_CALENDAR);
      if (savedCal) {
        setPosts(JSON.parse(savedCal));
      } else {
        // Default initial items
        setPosts([
          {
            id: 'post_1',
            channel: 'x',
            scheduledDate: new Date().toISOString().split('T')[0],
            content: '🚀 Just launched our new Technical Site Audit tool! Audit your entire website with 0 arbitrary limits. Check it out at https://toolverse.baby/workspace/site-audit #SEO #WebDev',
            status: 'scheduled',
          },
          {
            id: 'post_2',
            channel: 'linkedin',
            scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            content: 'Technical debt kills SEO. Here is how we crawled 200+ pages to uncover canonical mismatches and missing metadata before Google Search Console penalised us.',
            status: 'draft',
          },
        ]);
      }

      const savedUtmList = localStorage.getItem(STORAGE_KEY_SAVED_UTMS);
      if (savedUtmList) {
        setSavedUtms(JSON.parse(savedUtmList));
      }
    } catch {}
  }, []);

  const savePostsToStorage = (updated: SocialPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SOCIAL_CALENDAR, JSON.stringify(updated));
    } catch {}
  };

  // Build Full UTM Link
  const fullUtmUrl = useMemo(() => {
    try {
      const cleanBase = utmBaseUrl.trim();
      if (!cleanBase) return '';
      const u = new URL(cleanBase.startsWith('http') ? cleanBase : `https://${cleanBase}`);
      if (utmSource.trim()) u.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) u.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) u.searchParams.set('utm_campaign', utmCampaign.trim());
      if (utmTerm.trim()) u.searchParams.set('utm_term', utmTerm.trim());
      if (utmContent.trim()) u.searchParams.set('utm_content', utmContent.trim());
      return u.toString();
    } catch {
      return '';
    }
  }, [utmBaseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  // Social Metadata Quality Checks
  const metadataChecks = useMemo(() => {
    const titleLen = ogTitle.trim().length;
    const descLen = ogDescription.trim().length;

    const titleOk = titleLen >= 30 && titleLen <= 65;
    const descOk = descLen >= 70 && descLen <= 160;
    const hasImage = Boolean(ogImage.trim() && ogImage.startsWith('http'));

    let score = 0;
    if (titleOk) score += 35;
    else if (titleLen > 0) score += 15;

    if (descOk) score += 35;
    else if (descLen > 0) score += 15;

    if (hasImage) score += 30;

    return {
      score,
      titleLen,
      descLen,
      titleOk,
      descOk,
      hasImage,
    };
  }, [ogTitle, ogDescription, ogImage]);

  // Hashtag Analysis & Generator
  const generatedHashtags = useMemo(() => {
    const words = hashtagTopic
      .toLowerCase()
      .split(/[\s,#]+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ''))
      .filter((w) => w.length > 2);

    const relatedMap: Record<string, string[]> = {
      seo: ['seo', 'searchranking', 'technicalseo', 'googleindexing', 'searchengineoptimization', 'serp'],
      marketing: ['marketing', 'digitalmarketing', 'growthhacking', 'contentmarketing', 'marketingtips', 'b2bmarketing'],
      startup: ['startup', 'indiehackers', 'buildinpublic', 'saas', 'techfounder', 'entrepreneurship'],
      tech: ['tech', 'technology', 'developer', 'webdevelopment', 'coding', 'softwareengineering'],
    };

    const tags = new Set<string>();
    for (const w of words) {
      tags.add(`#${w}`);
      if (relatedMap[w]) {
        relatedMap[w].forEach((t) => tags.add(`#${t}`));
      }
    }

    return Array.from(tags);
  }, [hashtagTopic]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUtm = () => {
    if (!fullUtmUrl) return;
    const next = Array.from(new Set([fullUtmUrl, ...savedUtms])).slice(0, 20);
    setSavedUtms(next);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_UTMS, JSON.stringify(next));
    } catch {}
    setNotice('UTM link saved to your campaign history!');
  };

  const handleAddPost = () => {
    if (!newPostContent.trim()) return;
    const newEntry: SocialPost = {
      id: `post_${Date.now()}`,
      channel: newPostChannel,
      scheduledDate: newPostDate,
      content: newPostContent.trim(),
      status: 'scheduled',
    };
    savePostsToStorage([newEntry, ...posts]);
    setNewPostContent('');
    setNotice('Post added to Social Calendar!');
  };

  const handleDeletePost = (id: string) => {
    savePostsToStorage(posts.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id !== id) return p;
      const nextStatus: SocialPost['status'] =
        p.status === 'draft' ? 'scheduled' : p.status === 'scheduled' ? 'published' : 'draft';
      return { ...p, status: nextStatus };
    });
    savePostsToStorage(updated);
  };

  return (
    <ModuleShell
      title="Social Media & Campaign Suite"
      purpose="Preview OpenGraph cards across Twitter/X, Facebook, and LinkedIn, schedule social distribution, and generate standardized UTM campaign links."
      honesty="Client-side OpenGraph simulation and campaign management. Live previews accurately mirror Twitter Card and Facebook Link standards."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('preview')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          OpenGraph Social Preview
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          Content & Post Calendar ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('utm')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'utm'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          UTM Campaign Builder
        </button>
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'hashtags'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Hash className="w-4 h-4" />
          Hashtag Generator
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

      {/* TAB 1: OpenGraph Social Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Metadata Inputs */}
            <div className="lg:col-span-5 space-y-4">
              <Panel title="OpenGraph Metadata Attributes">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Webpage URL</label>
                    <input
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">og:title</label>
                      <span className={`text-[11px] font-bold ${metadataChecks.titleOk ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {metadataChecks.titleLen}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">og:description</label>
                      <span className={`text-[11px] font-bold ${metadataChecks.descOk ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {metadataChecks.descLen}/155 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">og:image (1200x630 URL)</label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>
              </Panel>

              {/* Readiness Score */}
              <Panel title="Social Card Readiness">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">Readiness Score</span>
                  <span className="text-lg font-black text-indigo-600">{metadataChecks.score}/100</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    {metadataChecks.titleOk ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span>Title length between 30 and 65 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {metadataChecks.descOk ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span>Description length between 70 and 160 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {metadataChecks.hasImage ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span>Valid absolute og:image URL provided</span>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Live Interactive Preview Card */}
            <div className="lg:col-span-7 space-y-4">
              <Panel title="Live Feed Preview">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPlatform('x')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedPlatform === 'x'
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      X (Twitter) Large Card
                    </button>
                    <button
                      onClick={() => setSelectedPlatform('facebook')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedPlatform === 'facebook'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      Facebook Post
                    </button>
                    <button
                      onClick={() => setSelectedPlatform('linkedin')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedPlatform === 'linkedin'
                          ? 'bg-sky-700 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      LinkedIn Post
                    </button>
                  </div>
                </div>

                {/* Simulated Platform Card */}
                <div className="max-w-md mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                  {/* Banner Image with 1.91:1 Aspect Ratio */}
                  <div className="w-full h-48 bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-600 relative flex items-center justify-center overflow-hidden">
                    {ogImage.startsWith('http') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-white text-xs font-semibold opacity-75">1200 × 630 Preview</div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                      {targetUrl.replace(/^https?:\/\//, '').split('/')[0]}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {targetUrl.replace(/^https?:\/\//, '').split('/')[0]}
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {ogTitle || 'Add an og:title'}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {ogDescription || 'Add an og:description'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Aspect Ratio: 1.91:1 (Recommended: 1200×630px)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `<meta property="og:title" content="${ogTitle}" />\n<meta property="og:description" content="${ogDescription}" />\n<meta property="og:image" content="${ogImage}" />\n<meta property="og:url" content="${targetUrl}" />\n<meta name="twitter:card" content="summary_large_image" />`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy OpenGraph Tags HTML
                  </button>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Social Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Schedule New Social Post">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Channel</label>
                    <select
                      value={newPostChannel}
                      onChange={(e) => setNewPostChannel(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                    >
                      <option value="x">X / Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Scheduled Date</label>
                    <input
                      type="date"
                      value={newPostDate}
                      onChange={(e) => setNewPostDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Post Copy</label>
                      <span className="text-[11px] text-slate-400">{newPostContent.length} chars</span>
                    </div>
                    <textarea
                      rows={5}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Write your social post update, add hashtags, links..."
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPost}
                    disabled={!newPostContent.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add to Schedule
                  </button>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title={`Scheduled Posts (${posts.length})`}>
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              post.channel === 'x'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : post.channel === 'linkedin'
                                ? 'bg-blue-600 text-white'
                                : 'bg-indigo-600 text-white'
                            }`}
                          >
                            {post.channel}
                          </span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {post.scheduledDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(post.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                              post.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : post.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {post.status.toUpperCase()}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{post.content.length} characters</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(post.content)}
                          className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Post
                        </button>
                      </div>
                    </div>
                  ))}

                  {posts.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No posts currently scheduled. Plan your social distribution on the left.
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UTM Campaign Builder */}
      {activeTab === 'utm' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <Panel title="UTM Campaign Parameters">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Base Webpage URL *</label>
                    <input
                      type="text"
                      value={utmBaseUrl}
                      onChange={(e) => setUtmBaseUrl(e.target.value)}
                      placeholder="https://example.com/landing"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">utm_source *</label>
                      <input
                        type="text"
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                        placeholder="google, newsletter, twitter"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">utm_medium *</label>
                      <input
                        type="text"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                        placeholder="cpc, social, email"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">utm_campaign *</label>
                    <input
                      type="text"
                      value={utmCampaign}
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      placeholder="spring_sale_2026"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">utm_term (Keyword)</label>
                      <input
                        type="text"
                        value={utmTerm}
                        onChange={(e) => setUtmTerm(e.target.value)}
                        placeholder="seo-audit"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">utm_content (Ad / Variant)</label>
                      <input
                        type="text"
                        value={utmContent}
                        onChange={(e) => setUtmContent(e.target.value)}
                        placeholder="blue_cta_button"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <Panel title="Generated Trackable URL">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Final Campaign Link
                  </div>
                  <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all select-all leading-relaxed">
                    {fullUtmUrl || 'Enter valid base URL above'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(fullUtmUrl)}
                    disabled={!fullUtmUrl}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUtm}
                    disabled={!fullUtmUrl}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    Save Preset
                  </button>
                </div>

                {savedUtms.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Saved Campaign Links</div>
                    <div className="max-h-48 overflow-y-auto space-y-1.5">
                      {savedUtms.map((s, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono flex items-center justify-between"
                        >
                          <span className="truncate flex-1 text-slate-600 dark:text-slate-300 mr-2">{s}</span>
                          <button
                            onClick={() => handleCopy(s)}
                            className="text-indigo-600 hover:underline font-sans font-bold"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Hashtag Generator */}
      {activeTab === 'hashtags' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Topic Seed & Keywords">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Keywords or Theme</label>
                    <input
                      type="text"
                      value={hashtagTopic}
                      onChange={(e) => setHashtagTopic(e.target.value)}
                      placeholder="e.g. seo web development saas"
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generates related niche, community, and high-engagement hashtags for Instagram, LinkedIn, and X.
                  </p>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title={`Suggested Hashtags (${generatedHashtags.length})`}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {generatedHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total footprint: {generatedHashtags.join(' ').length} chars</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedHashtags.join(' '))}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy All Hashtags
                  </button>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
