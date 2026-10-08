import React, { useState } from 'react';
import { 
  getAllStartups, 
  STARTUP_CATEGORIES, 
  upvoteStartup 
} from '@/lib/startups/registry';
import { PricingModel, FundingStage } from '@/lib/startups/types';

export default function StartupDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | ''>('');
  const [selectedFunding, setSelectedFunding] = useState<FundingStage | ''>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'votes' | 'alphabetical'>('trending');
  const [upvotedMap, setUpvotedMap] = useState<Record<string, number>>({});

  const startups = getAllStartups({
    category: selectedCategory,
    pricingModel: selectedPricing || undefined,
    fundingStage: selectedFunding || undefined,
    searchQuery,
    sortBy
  });

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newCount = upvoteStartup(id);
    setUpvotedMap(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-4">
      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
              Global Startup Launch & Discovery Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Discover Next-Gen <span className="text-indigo-400">Startups & SaaS</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Explore newly launched software products, indie hacker tools, and AI startups. Vote for your favorite products and connect directly with founders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/submit-startup"
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <span>🚀</span> Launch Your Startup +
            </a>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <input
            type="text"
            placeholder="Search startups, keywords, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold outline-none"
          >
            <option value="">All Categories</option>
            {STARTUP_CATEGORIES.map(c => (
              <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold outline-none"
          >
            <option value="trending">🔥 Trending First</option>
            <option value="votes">⭐ Most Voted</option>
            <option value="newest">✨ Newest Launch</option>
            <option value="alphabetical">🔤 Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedCategory === '' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          All Startups ({startups.length})
        </button>
        {STARTUP_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Startups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map(startup => {
          const addedVotes = upvotedMap[startup.id] || 0;
          const currentUpvotes = startup.upvotesCount + addedVotes;

          return (
            <a
              key={startup.id}
              href={`/startups/${startup.slug}`}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={startup.logoUrl} 
                      alt={startup.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-950"
                    />
                    <div>
                      <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition text-base flex items-center gap-1.5">
                        {startup.name}
                        {startup.isVerified && <span className="text-blue-400 text-xs" title="Verified Owner">✓</span>}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{startup.category} • {startup.country}</p>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={(e) => handleUpvote(startup.id, e)}
                    className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 transition"
                  >
                    <span className="text-xs">▲</span>
                    <span className="text-xs font-bold font-mono">{currentUpvotes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-semibold line-clamp-1">
                  "{startup.tagline}"
                </p>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {startup.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {startup.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {startup.pricingModel}
                </span>

                <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-1">
                  Explore Profile ➔
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
