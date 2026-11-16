import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllPaymentDirectoryEntries,
  getAllPaymentCategories,
  getAllPaymentCountries,
  getAllPaymentCurrencies,
  filterPaymentDirectory,
  getDefaultPaymentFilterState,
} from '@/lib/payments/database';
import {
  PaymentDirectoryEntry,
  PaymentCategorySlug,
  PaymentDirectoryFilterState,
} from '@/lib/payments/types';
import {
  Search,
  Globe,
  Coins,
  Filter,
  Scale,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  X,
  Building2,
  Users,
} from 'lucide-react';

interface PaymentDirectoryPageProps {
  initialCategorySlug?: string;
  initialCompareMode?: boolean;
}

const ITEMS_PER_PAGE = 24;

export default function PaymentDirectoryPage({
  initialCategorySlug,
  initialCompareMode = false,
}: PaymentDirectoryPageProps) {
  const [entries, setEntries] = useState<PaymentDirectoryEntry[]>(() =>
    getAllPaymentDirectoryEntries()
  );
  const categories = useMemo(() => getAllPaymentCategories(), []);
  const countries = useMemo(() => getAllPaymentCountries(), []);
  const currencies = useMemo(() => getAllPaymentCurrencies(), []);

  const [filters, setFilters] = useState<PaymentDirectoryFilterState>(() => ({
    ...getDefaultPaymentFilterState(),
    categorySlug: (initialCategorySlug as PaymentCategorySlug) || 'all',
  }));
  const [searchInput, setSearchInput] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareIds, setCompareIds] = useState<string[]>([
    'prv_stripe',
    'prv_paypal',
    'prv_adyen',
  ]);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(initialCompareMode);

  useEffect(() => {
    const refresh = () => setEntries(getAllPaymentDirectoryEntries());
    window.addEventListener('toolverse_payments_changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('toolverse_payments_changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    if (initialCategorySlug) {
      setFilters((prev) => ({
        ...prev,
        categorySlug: initialCategorySlug as PaymentCategorySlug,
      }));
      setCurrentPage(1);
    }
  }, [initialCategorySlug]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
      setCurrentPage(1);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredEntries = useMemo(
    () => filterPaymentDirectory(entries, filters),
    [entries, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const comparedEntries = useMemo(
    () =>
      compareIds
        .map((id) => entries.find((e) => e.id === id))
        .filter((e): e is PaymentDirectoryEntry => Boolean(e)),
    [compareIds, entries]
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const resetFilters = () => {
    setSearchInput('');
    setFilters(getDefaultPaymentFilterState());
    setCurrentPage(1);
  };

  const activeCategoryObj =
    filters.categorySlug !== 'all'
      ? categories.find((c) => c.slug === filters.categorySlug)
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Breadcrumb & Hero Header */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white border-b border-slate-800 pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <a href="/" className="hover:text-white transition">Home</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href="/payment-methods" className="hover:text-white transition">Payment Methods</a>
            {activeCategoryObj && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-300 font-medium">{activeCategoryObj.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{entries.length} Verified Payment Gateways, Wallets, Rails & Networks</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {activeCategoryObj
                  ? `${activeCategoryObj.name} Directory`
                  : 'Global Payment Methods & Payment Gateways Directory'}
              </h1>
              <p className="mt-3 text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
                {activeCategoryObj
                  ? activeCategoryObj.description
                  : 'Compare 115+ payment processors, digital wallets, card schemes, real-time bank rails, local payment methods, BNPL providers, and cryptocurrency gateways across 25+ countries and 28+ currencies.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowComparisonMatrix((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition"
              >
                <Scale className="w-4 h-4" />
                <span>
                  {showComparisonMatrix ? 'Hide Comparison' : `Compare Providers (${compareIds.length}/4)`}
                </span>
              </button>
              <a
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Submit Product Payment Stack</span>
              </a>
            </div>
          </div>

          {/* Country Hub Quick Pills */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Country Payment Guides:
            </span>
            {countries.slice(0, 12).map((c) => (
              <a
                key={c.code}
                href={`/payment-methods/countries/${c.slug}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/40 border border-slate-700 text-xs text-slate-200 transition"
              >
                <span>{c.flagEmoji}</span>
                <span>{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Side-by-Side Comparison Matrix (2 to 4 Providers) */}
        {showComparisonMatrix && (
          <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-500/30 shadow-lg overflow-hidden">
            <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Side-by-Side Payment Provider & Method Comparison ({comparedEntries.length}/4)</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Select 2 to 4 payment providers or methods from the directory below to compare verified fees, merchant eligibility, customer coverage, and capabilities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowComparisonMatrix(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {comparedEntries.length < 2 ? (
              <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Please select at least 2 providers using the <strong>+ Compare</strong> button on any card below.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <th className="p-3.5 font-semibold text-slate-500 w-48">Dimension</th>
                      {comparedEntries.map((item) => (
                        <th key={item.id} className="p-3.5 min-w-[210px]">
                          <div className="flex items-center justify-between gap-2">
                            <a
                              href={`/payment-methods/${item.primaryCategorySlug}/${item.slug}`}
                              className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white hover:text-indigo-600"
                            >
                              <img src={item.logoUrl} alt={item.brandName} className="w-7 h-7 rounded-lg" />
                              <span>{item.brandName}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => toggleCompare(item.id)}
                              className="text-xs text-rose-500 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Classification</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5 font-semibold">{item.providerType}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Merchant Countries</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">
                          <span className="font-semibold">{item.merchantEligibleCountryCodes.length} countries</span>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.merchantEligibleCountryCodes.slice(0, 8).join(', ')}
                            {item.merchantEligibleCountryCodes.length > 8 ? '...' : ''}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Customer Countries</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">{item.customerPaymentCountryCodes.length}+ countries</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Supported Currencies</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">
                          {item.supportedCurrencies.slice(0, 7).join(', ')}
                          {item.supportedCurrencies.length > 7 ? ` +${item.supportedCurrencies.length - 7} more` : ''}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Transaction Fees</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5 font-medium text-emerald-700 dark:text-emerald-400">
                          {item.transactionFees}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Subscriptions / Recurring</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">
                          {item.subscriptionSupport || item.recurringPaymentSupport ? 'Supported' : 'One-Time Only'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Refunds & Chargebacks</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">
                          <div>{item.refundSupport}</div>
                          <div className="text-[11px] text-slate-500">
                            Chargebacks: {item.chargebackSupport ? 'Applicable' : 'None (Push Rail)'}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Crypto Support</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">
                          {item.cryptoDetails
                            ? `${item.cryptoDetails.supportedAssets.map((a) => a.symbol).join(', ')} (${item.cryptoDetails.custodyModel})`
                            : 'Fiat Only'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-slate-500">Integration Complexity</td>
                      {comparedEntries.map((item) => (
                        <td key={item.id} className="p-3.5">
                          {item.integrationComplexity} (API: {item.apiAvailable ? 'Yes' : 'No'}, Plugins: {item.pluginAvailable ? 'Yes' : 'No'})
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 11-Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setFilters((prev) => ({ ...prev, categorySlug: 'all' }));
              setCurrentPage(1);
            }}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              filters.categorySlug === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            All Categories ({entries.length})
          </button>
          {categories.map((cat) => {
            const count = entries.filter(
              (e) =>
                e.primaryCategorySlug === cat.slug || e.secondaryCategorySlugs.includes(cat.slug)
            ).length;
            const active = filters.categorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, categorySlug: cat.slug }));
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                {cat.shortName} ({count})
              </button>
            );
          })}
        </div>

        {/* Search, Country (Merchant vs Customer), Currency & Sort Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Stripe, JazzCash, Pix, USDC, SEPA, Shopify..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Country Selector + Merchant/Customer Role Toggle */}
            <div className="md:col-span-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  aria-label="Filter by Country"
                  value={filters.countryCode}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, countryCode: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm"
                >
                  <option value="all">All Countries (Global)</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flagEmoji} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 shrink-0"
                title="Switch between Merchant Account Onboarding vs Customer Checkout Availability"
              >
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, countryRoleMode: 'merchant' }))}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                    filters.countryRoleMode === 'merchant'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Merchant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, countryRoleMode: 'customer' }))}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                    filters.countryRoleMode === 'customer'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Payer</span>
                </button>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="md:col-span-2 relative">
              <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                aria-label="Filter by Currency"
                value={filters.currencyCode}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, currencyCode: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm"
              >
                <option value="all">All Currencies</option>
                {currencies.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} ({cur.symbol}) — {cur.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="md:col-span-2 flex items-center gap-2">
              <select
                aria-label="Sort Payment Methods"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as PaymentDirectoryFilterState['sortBy'],
                  }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm"
              >
                <option value="popularity">Sort: Most Popular</option>
                <option value="alphabetical">Sort: Alphabetical (A–Z)</option>
                <option value="country_coverage">Sort: Country Coverage</option>
                <option value="currency_coverage">Sort: Currency Support</option>
                <option value="integration_simplicity">Sort: Integration Simplicity</option>
                <option value="recently_verified">Sort: Recently Verified</option>
              </select>
            </div>
          </div>

          {/* Capability Quick Filters Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  ['supportsSubscriptions', 'Subscriptions & Recurring'],
                  ['supportsOneTime', 'One-Time Checkout'],
                  ['supportsCrypto', 'Crypto Supported'],
                  ['supportsCards', 'Card Acquiring'],
                  ['supportsBankTransfer', 'Bank Rails / A2A'],
                  ['supportsDigitalWallets', 'Digital Wallets'],
                  ['supportsBNPL', 'BNPL Installments'],
                  ['supportsLocalMethods', 'Local Methods'],
                  ['supportsPayouts', 'Mass Payouts'],
                  ['apiAvailable', 'REST API & Webhooks'],
                ] as const
              ).map(([key, label]) => {
                const active = Boolean(filters[key]);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      active
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((v) => !v)}
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{showAdvancedFilters ? 'Fewer Filters' : 'Business Model Filter'}</span>
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="text-slate-500 hover:text-rose-600 font-medium"
              >
                Reset All
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Business Model:</span>
              {(['all', 'SaaS', 'E-Commerce', 'Marketplace', 'Digital Downloads', 'In-Person / POS', 'Enterprise'] as const).map(
                (bm) => (
                  <button
                    key={bm}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, businessModel: bm }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      filters.businessModel === bm
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {bm === 'all' ? 'All Business Models' : bm}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Result Count & Active Country Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div>
            Showing <strong>{paginatedEntries.length}</strong> of{' '}
            <strong>{filteredEntries.length}</strong> verified payment entries
            {filters.countryCode !== 'all' && (
              <span className="ml-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                ({filters.countryRoleMode === 'merchant' ? 'Merchant Onboarding' : 'Customer Checkout'} in{' '}
                {countries.find((c) => c.code === filters.countryCode)?.name || filters.countryCode})
              </span>
            )}
          </div>
          {filters.countryCode !== 'all' && (
            <a
              href={`/payment-methods/countries/${
                countries.find((c) => c.code === filters.countryCode)?.slug || 'united-states'
              }`}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              <span>
                View Full {countries.find((c) => c.code === filters.countryCode)?.name} Payment Ecosystem Guide
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Directory Cards Grid */}
        {paginatedEntries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No payment providers or methods match your active filters.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              If a country restricts direct merchant onboarding (e.g. Stripe or PayPal in Pakistan), try switching the country mode to <strong>Payer</strong> or inspect Merchant of Record options like Paddle, Lemon Squeezy, Payoneer, or Safepay.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedEntries.map((item) => {
              const isSelectedForCompare = compareIds.includes(item.id);
              const detailUrl = `/payment-methods/${item.primaryCategorySlug}/${item.slug}`;
              return (
                <article
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition flex flex-col justify-between p-5"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <a href={detailUrl} className="flex items-center gap-3 group">
                        <img
                          src={item.logoUrl}
                          alt={`${item.brandName} logo`}
                          className="w-12 h-12 rounded-xl shrink-0 shadow-sm"
                          loading="lazy"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                              {item.brandName}
                            </h2>
                            {item.operationalStatus === 'Discontinued' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                Discontinued
                              </span>
                            ) : (
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-500 shrink-0"
                                title={item.verificationStatus}
                              />
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                            {item.providerType}
                          </span>
                        </div>
                      </a>

                      <button
                        type="button"
                        onClick={() => toggleCompare(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition shrink-0 ${
                          isSelectedForCompare
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {isSelectedForCompare ? '✓ Comparing' : '+ Compare'}
                      </button>
                    </div>

                    {/* Short Description */}
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                        <span className="text-slate-400 block">Merchant Onboarding</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.merchantEligibleCountryCodes.slice(0, 4).join(', ')}
                          {item.merchantEligibleCountryCodes.length > 4
                            ? ` +${item.merchantEligibleCountryCodes.length - 4}`
                            : ''}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                        <span className="text-slate-400 block">Supported Currencies</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.supportedCurrencies.slice(0, 4).join(', ')}
                          {item.supportedCurrencies.length > 4
                            ? ` +${item.supportedCurrencies.length - 4}`
                            : ''}
                        </span>
                      </div>
                    </div>

                    {/* Fee & Capability Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                        Fee: {item.transactionFees.slice(0, 38)}
                        {item.transactionFees.length > 38 ? '...' : ''}
                      </span>
                      {(item.subscriptionSupport || item.recurringPaymentSupport) && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                          Recurring
                        </span>
                      )}
                      {item.cryptoDetails && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                          Crypto ({item.cryptoDetails.supportedAssets.map((a) => a.symbol).slice(0, 3).join('/')})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <a
                      href={detailUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Full Review, Countries & Fees</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      title={`Official website of ${item.brandName}`}
                    >
                      <span>Official Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-bold border transition ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

