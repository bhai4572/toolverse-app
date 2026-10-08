import React from 'react';
import { getPublisherBySlug, getAllPublishers } from '@/lib/guestposts/registry';

interface PublisherProfilePageProps {
  params?: { slug?: string };
}

export default function PublisherProfilePage({ params }: PublisherProfilePageProps) {
  const slug = params?.slug || 'tech-vision-journal';
  const publisher = getPublisherBySlug(slug) || getAllPublishers()[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Publisher Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img 
              src={publisher.logoUrl} 
              alt={publisher.websiteName} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 bg-slate-950 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{publisher.websiteName}</h1>
                {publisher.verificationStatus === 'VERIFIED_OWNER' && (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Verified Owner ({publisher.verificationMethod})
                  </span>
                )}
              </div>
              <p className="text-sm text-indigo-300 font-semibold">{publisher.websiteUrl}</p>
              <p className="text-xs text-slate-400">
                Niche: <span className="text-slate-200">{publisher.niche}</span> | Country: <span className="text-slate-200">{publisher.country}</span> | Response Rate: <span className="text-emerald-400 font-bold">{publisher.responseRatePercentage}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/guest-posts/create-pitch?publisherId=${publisher.id}`}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <span>📝</span> Pitch Guest Article
            </a>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Domain Rating (DR)</span>
            <span className="text-2xl font-black text-indigo-400 font-mono mt-0.5 block">{publisher.domainRatingDR}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Domain Authority (DA)</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5 block">{publisher.domainAuthorityDA}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Monthly Traffic</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">{publisher.monthlyTrafficRange}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold block">Turnaround Time</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">{publisher.publishingTurnaroundDays} Business Days</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Editorial Guidelines */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📜</span> Editorial & Quality Guidelines
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {publisher.editorialGuidelines}
            </p>
          </div>

          {/* Topics Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">Accepted & Rejected Topics</h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">✓ Accepted Topics</span>
                <div className="flex flex-wrap gap-2">
                  {publisher.acceptedTopics.map((top, idx) => (
                    <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-lg">
                      {top}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">✕ Rejected / Prohibited Topics</span>
                <div className="flex flex-wrap gap-2">
                  {publisher.rejectedTopics.map((top, idx) => (
                    <span key={idx} className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-3 py-1 rounded-lg">
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Rules & Link Attributes */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Link & Content Rules</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500 font-semibold">Min Word Count:</span>
                <span className="font-mono text-white font-bold">{publisher.minimumWordCount} words</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500 font-semibold">Max Links Allowed:</span>
                <span className="font-mono text-white font-bold">{publisher.maximumExternalLinks} links</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500 font-semibold">Link Attributes:</span>
                <div className="flex gap-1">
                  {publisher.supportedLinkAttributes.map((attr, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500 font-semibold">Pricing Model:</span>
                <span className="font-bold text-emerald-400">
                  {publisher.pricingModel === 'FREE_EDITORIAL' ? 'Free Pitching' : 'Sponsored Fee'}
                </span>
              </div>
            </div>

            <a
              href={`/guest-posts/create-pitch?publisherId=${publisher.id}`}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition block text-center mt-4"
            >
              Submit Pitch Now ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
