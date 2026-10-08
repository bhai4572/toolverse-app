import React, { useState } from 'react';
import { getStartupBySlug, upvoteStartup, getAllStartups } from '@/lib/startups/registry';

interface StartupProfilePageProps {
  params?: { slug?: string };
}

export default function StartupProfilePage({ params }: StartupProfilePageProps) {
  const slug = params?.slug || 'nexus-ai-writer';
  const startup = getStartupBySlug(slug) || getAllStartups()[0];

  const [upvotes, setUpvotes] = useState(startup.upvotesCount);
  const [hasVoted, setHasVoted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'founder' | 'faqs'>('overview');

  const handleVote = () => {
    if (!hasVoted) {
      upvoteStartup(startup.id);
      setUpvotes(prev => prev + 1);
      setHasVoted(true);
    }
  };

  const relatedStartups = getAllStartups({ category: startup.category }).filter(s => s.id !== startup.id);

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: startup.name,
    description: startup.description,
    applicationCategory: startup.category,
    operatingSystem: startup.platforms.join(', '),
    url: startup.websiteUrl,
    offers: {
      '@type': 'Offer',
      price: startup.pricingModel === 'FREE' ? '0' : 'Varies',
      priceCurrency: 'USD'
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img 
              src={startup.logoUrl} 
              alt={startup.name} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 bg-slate-950 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{startup.name}</h1>
                {startup.isVerified && (
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                    ✓ Verified Listing
                  </span>
                )}
              </div>
              <p className="text-base text-indigo-300 font-semibold">{startup.tagline}</p>
              <p className="text-xs text-slate-400">
                Category: <span className="text-slate-200">{startup.category}</span> | Country: <span className="text-slate-200">{startup.country}</span> | Funding: <span className="text-slate-200">{startup.fundingStage}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleVote}
              className={`px-5 py-3 rounded-2xl border font-bold text-sm flex items-center gap-2 transition shadow-lg ${
                hasVoted 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-indigo-600/30'
              }`}
            >
              <span>▲</span>
              <span>{hasVoted ? 'Upvoted' : 'Upvote Product'} ({upvotes})</span>
            </button>

            <a
              href={startup.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition"
            >
              Visit Website ↗
            </a>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
          {(['overview', 'features', 'founder', 'faqs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'overview' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">About {startup.name}</h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {startup.longDescription}
                </p>
              </div>

              {/* Screenshots Gallery */}
              {startup.screenshots.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-200">Product Interface Screenshots</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {startup.screenshots.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt={`${startup.name} screenshot ${i+1}`} 
                        className="rounded-xl border border-slate-800 object-cover w-full max-h-96 shadow-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-indigo-400">Problem Solved</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {startup.problemSolved}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white">Key Product Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {startup.keyFeatures.map((feat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'founder' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white">Founder & Company Details</h2>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500 font-semibold">Founder Name:</span>
                  <span className="text-white font-bold">{startup.founderName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500 font-semibold">Company Location:</span>
                  <span>{startup.city}, {startup.country}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500 font-semibold">Team Size:</span>
                  <span>{startup.teamSize} members</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500 font-semibold">Funding Stage:</span>
                  <span>{startup.fundingStage}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Quick Specifications */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Quick Information</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Pricing Model</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  {startup.pricingModel}
                </span>
                {startup.pricingDetails && <p className="text-[11px] text-slate-400 mt-1">{startup.pricingDetails}</p>}
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Platforms Supported</span>
                <div className="flex flex-wrap gap-1">
                  {startup.platforms.map((p, i) => (
                    <span key={i} className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono text-[10px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Launch Date</span>
                <span className="text-slate-200 font-medium">{startup.launchedAt}</span>
              </div>
            </div>
          </div>

          {/* Related Startups */}
          {relatedStartups.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Similar {startup.category} Startups</h3>
              <div className="space-y-3">
                {relatedStartups.slice(0, 3).map(rel => (
                  <a 
                    key={rel.id} 
                    href={`/startups/${rel.slug}`} 
                    className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-1"
                  >
                    <div className="font-bold text-xs text-white hover:text-indigo-400">{rel.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{rel.tagline}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
