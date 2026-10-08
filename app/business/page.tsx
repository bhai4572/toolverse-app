import React, { useState } from 'react';
import { getStoredBusinesses, getStoredCategories } from '@/lib/business/storageEngine';
import { Business } from '@/lib/business/types';
import { getActiveSponsoredPositions } from '@/lib/business/biddingEngine';
import { Search, MapPin, ShieldCheck, Sparkles, Star, Trophy, ExternalLink, ArrowUpRight, QrCode } from 'lucide-react';

export default function BusinessDiscoveryDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'top-rated' | 'trending' | 'sponsored' | 'verified'>('all');

  const categories = getStoredCategories();
  const allBusinesses = getStoredBusinesses().filter((b) => b.spamStatus === 'CLEAN');

  const filteredBusinesses = allBusinesses.filter((b) => {
    if (selectedCategory !== 'all' && b.categorySlug !== selectedCategory) return false;
    if (selectedCountry !== 'all' && b.country !== selectedCountry) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeTab === 'top-rated') return b.ratingAverage >= 4.8;
    if (activeTab === 'trending') return b.qrScansCount > 500 || b.upvotesCount > 200;
    if (activeTab === 'sponsored') return b.isSponsored;
    if (activeTab === 'verified') return b.isVerified;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Global Business Discovery &amp; Digital Identity Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Businesses, Services &amp; SaaS</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Search canonical business profiles, scan permanent Toolverse Business IDs, read genuine customer reviews, and explore local and global service providers.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="/business/register"
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Create Free Business Profile &rarr;
            </a>
            <a
              href="/business-qr"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur transition-all"
            >
              <QrCode className="w-4 h-4" /> Download Printable Business QR
            </a>
          </div>
        </div>
      </header>

      {/* Search & Filter Controls */}
      <section className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search business name, Business ID (e.g. TV-BIZ-8F4K2P), city, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Countries</option>
              <option value="Pakistan">Pakistan</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="United States">United States</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800 pt-3">
          {(['all', 'top-rated', 'trending', 'sponsored', 'verified'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </section>

      {/* Business Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Showing {filteredBusinesses.length} Verified Businesses
          </h2>
          <span className="text-xs text-slate-500">Sorted by verified community trust signals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  <a href={`/business/${business.slug}`}>{business.name}</a>
                </h3>
                {business.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Business" />
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium">{business.categoryName}</span>
            </div>
          </div>

          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border">
            {business.id}
          </span>
        </div>

        {/* Sponsored Label if present */}
        {business.isSponsored && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold rounded-md uppercase">
            <Trophy className="w-3 h-3 text-amber-500" /> Sponsored #{business.sponsoredPosition || 1}
          </div>
        )}

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{business.description}</p>

        {/* Location & Rating */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {business.city}, {business.country}
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {business.ratingAverage} ({business.ratingCount})
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <a href={`/business/${business.slug}`} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
          View Profile <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        <a href={`/b/${business.id}`} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px] font-mono">
          <QrCode className="w-3.5 h-3.5" /> ID QR
        </a>
      </div>
    </div>
  );
}
