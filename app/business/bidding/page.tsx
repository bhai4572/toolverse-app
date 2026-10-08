import React, { useState } from 'react';
import { getStoredBusinesses, getStoredCategories } from '@/lib/business/storageEngine';
import { getStoredBiddingCampaigns, createOrUpdateBiddingCampaign, getActiveSponsoredPositions } from '@/lib/business/biddingEngine';
import { Trophy, Sparkles, TrendingUp, CheckCircle, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export default function Top3BiddingMarketplacePage() {
  const businesses = getStoredBusinesses();
  const categories = getStoredCategories();
  const campaigns = getStoredBiddingCampaigns();

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.slug || 'barber-shops-salons');
  const [selectedBizId, setSelectedBizId] = useState(businesses[0]?.id || 'TV-BIZ-8F4K2P');
  const [targetPos, setTargetPos] = useState<1 | 2 | 3>(1);
  const [dailyBudget, setDailyBudget] = useState(25);
  const [durationDays, setDurationDays] = useState<1 | 7 | 30 | 90>(30);
  const [submitted, setSubmitted] = useState(false);

  const activePositions = getActiveSponsoredPositions(selectedCategory);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    const biz = businesses.find((b) => b.id === selectedBizId);
    if (!biz) return;

    createOrUpdateBiddingCampaign(biz, targetPos, dailyBudget, dailyBudget, durationDays);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="p-8 sm:p-12 bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl space-y-4 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase">
          <Trophy className="w-3.5 h-3.5" /> Category Sponsored Top 3 Bidding Marketplace
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">Compete for Sponsored Category Visibility</h1>
        <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
          Transparent, auction-based daily sponsored placements for verified businesses. Clearly labeled as Sponsored #1, #2, and #3.
        </p>
      </header>

      {/* Current Category Leaderboard Auction Standings */}
      <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Active Auction Standings</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((pos) => {
            const camp = activePositions[pos];
            return (
              <div
                key={pos}
                className={`p-5 rounded-2xl border space-y-3 ${
                  pos === 1
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : pos === 2
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700'
                    : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" /> Position #{pos}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-white dark:bg-slate-900 border rounded font-bold">
                    {camp ? `$${camp.currentBid}/day` : 'Open Seat'}
                  </span>
                </div>

                {camp ? (
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{camp.businessName}</div>
                    <div className="text-slate-500 text-[11px]">Active until {camp.endDate}</div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">No active bidder. Minimum bid $10/day.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bid Placement Form */}
      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white border-b pb-3">Place or Increase Campaign Bid</h2>

        {submitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 rounded-2xl text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-emerald-900 dark:text-emerald-200">Bid Placed Successfully!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">Your campaign is active and positioned in category rankings.</p>
          </div>
        ) : (
          <form onSubmit={handlePlaceBid} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Your Business</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Sponsored Position</label>
                <select
                  value={targetPos}
                  onChange={(e) => setTargetPos(Number(e.target.value) as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-indigo-600"
                >
                  <option value={1}>🥇 Sponsored #1</option>
                  <option value={2}>🥈 Sponsored #2</option>
                  <option value={3}>🥉 Sponsored #3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Daily Max Budget (USD)</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Campaign Duration</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value) as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                >
                  <option value={1}>24 Hours (1 Day)</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <span className="text-slate-500">Transparent placement. Transparent labels.</span>
              <button
                type="submit"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Submit Sponsored Bid &rarr;
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
