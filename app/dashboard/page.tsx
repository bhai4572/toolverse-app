import React, { useState } from 'react';
import { 
  CURRENT_MOCK_USER, 
  getFounderMetrics, 
  getPublisherMetrics 
} from '@/lib/user/dashboardEngine';
import { INITIAL_STARTUPS } from '@/lib/startups/registry';
import { INITIAL_PITCHES, SAMPLE_PUBLISHERS } from '@/lib/guestposts/registry';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'founder' | 'publisher' | 'pitches' | 'bookmarks'>('founder');

  const founderMetrics = getFounderMetrics();
  const publisherMetrics = getPublisherMetrics();

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Dashboard Top Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={CURRENT_MOCK_USER.avatarUrl} 
              alt={CURRENT_MOCK_USER.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Role: {CURRENT_MOCK_USER.role}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">{CURRENT_MOCK_USER.name}</h1>
              <p className="text-xs text-slate-400">{CURRENT_MOCK_USER.email} • {CURRENT_MOCK_USER.companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/submit-startup"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
            >
              + Submit New Startup
            </a>
            <a
              href="/guest-posts/create-pitch"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              + Create Guest Pitch
            </a>
          </div>
        </div>

        {/* Dashboard Role Tabs */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('founder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'founder' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            🚀 Founder Analytics & Listings
          </button>
          <button
            onClick={() => setActiveTab('publisher')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'publisher' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            🏢 Publisher Control Center
          </button>
          <button
            onClick={() => setActiveTab('pitches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'pitches' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            📝 Guest Post Pitches ({INITIAL_PITCHES.length})
          </button>
        </div>
      </div>

      {/* Founder View */}
      {activeTab === 'founder' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Profile Views</span>
              <div className="text-3xl font-black text-white mt-1">{founderMetrics.totalViewsCount.toLocaleString()}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Outbound Clicks</span>
              <div className="text-3xl font-black text-indigo-400 mt-1">{founderMetrics.totalOutboundClicksCount.toLocaleString()}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Community Upvotes</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">{founderMetrics.totalUpvotesCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Active Guest Pitches</span>
              <div className="text-3xl font-black text-amber-400 mt-1">{founderMetrics.activePitchesCount}</div>
            </div>
          </div>

          {/* Active Listings Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">Your Listed Startups ({INITIAL_STARTUPS.slice(0, 2).length})</h2>
            <div className="divide-y divide-slate-800 text-xs">
              {INITIAL_STARTUPS.slice(0, 2).map(s => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={s.logoUrl} alt={s.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-white text-sm">{s.name}</div>
                      <div className="text-slate-400">{s.tagline}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {s.status}
                    </span>
                    <a href={`/startups/${s.slug}`} className="text-indigo-400 hover:underline font-bold">
                      View Profile ➔
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Publisher View */}
      {activeTab === 'publisher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Verified Websites</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">{publisherMetrics.verifiedWebsitesCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Incoming Pitches</span>
              <div className="text-3xl font-black text-amber-400 mt-1">{publisherMetrics.pendingPitchesCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Accepted Pitches</span>
              <div className="text-3xl font-black text-indigo-400 mt-1">{publisherMetrics.acceptedPitchesCount}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Published Articles</span>
              <div className="text-3xl font-black text-white mt-1">{publisherMetrics.publishedArticlesCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Pitches View */}
      {activeTab === 'pitches' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white">Submitted Guest Post Pitches</h2>
          <div className="space-y-3">
            {INITIAL_PITCHES.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-indigo-400">{p.proposedTitle}</span>
                  <span className="font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>
                <div className="text-slate-400">Target Publisher: <span className="text-white font-medium">{p.publisherName}</span> | Anchor: <span className="text-white font-mono">"{p.desiredAnchorText}"</span></div>
                {p.publishedUrl && (
                  <a href={p.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-block font-semibold">
                    Published Live Article ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
