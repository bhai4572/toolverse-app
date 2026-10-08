import React, { useState } from 'react';
import { getAllPublishers, SAMPLE_PUBLISHERS } from '@/lib/guestposts/registry';
import { PublisherPricingModel, LinkAttribute } from '@/lib/guestposts/types';

export default function GuestPostsMarketplacePage() {
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [selectedPricing, setSelectedPricing] = useState<PublisherPricingModel | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publishers = getAllPublishers({
    niche: selectedNiche,
    pricingModel: selectedPricing || undefined,
    searchQuery
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
              Ethical Guest Posting & Publisher Marketplace
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Connect with <span className="text-indigo-400">Verified Publishers</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Earn legitimate editorial mentions and backlinks by submitting high-quality article pitches to verified website owners and technology blogs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/guest-posts/create-pitch"
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <span>📝</span> Submit Article Pitch
            </a>
            <a
              href="/become-a-publisher"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
            >
              Become a Publisher ↗
            </a>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <input
            type="text"
            placeholder="Search publishers, niches, or domain names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold outline-none"
          >
            <option value="">All Niches</option>
            <option value="SaaS & Software">SaaS & Software</option>
            <option value="Startup Launch & Growth">Startup Launch & Growth</option>
            <option value="Marketing & SEO">Marketing & SEO</option>
            <option value="Developer Tools">Developer Tools</option>
          </select>

          <select
            value={selectedPricing}
            onChange={(e) => setSelectedPricing(e.target.value as any)}
            className="bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold outline-none"
          >
            <option value="">All Pricing Models</option>
            <option value="FREE_EDITORIAL">Free Editorial Submission</option>
            <option value="SPONSORED_FEE">Sponsored Fee Placement</option>
          </select>
        </div>
      </div>

      {/* Publisher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishers.map(pub => (
          <div
            key={pub.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={pub.logoUrl}
                    alt={pub.websiteName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-950"
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition text-base flex items-center gap-1.5">
                      {pub.websiteName}
                      {pub.verificationStatus === 'VERIFIED_OWNER' && (
                        <span className="text-emerald-400 text-xs" title="Verified Website Owner">✓ Verified</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{pub.niche} • {pub.country}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                    DR {pub.domainRatingDR}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">DA {pub.domainAuthorityDA}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Monthly Traffic:</span>
                  <span className="text-slate-200 font-medium">{pub.monthlyTrafficRange}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Turnaround Time:</span>
                  <span className="text-slate-200 font-medium">{pub.publishingTurnaroundDays} days</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Supported Links:</span>
                  <div className="flex gap-1">
                    {pub.supportedLinkAttributes.map((attr, idx) => (
                      <span key={idx} className="text-[9px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Accepted Topics:</span>
                <div className="flex flex-wrap gap-1">
                  {pub.acceptedTopics.slice(0, 3).map((top, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400">
                {pub.pricingModel === 'FREE_EDITORIAL' ? 'Free Pitching' : 'Sponsored Option'}
              </span>

              <a
                href={`/publishers/${pub.slug}`}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-600/20"
              >
                View Guidelines & Pitch ➔
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
