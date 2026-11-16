import React from 'react';
import {
  getCountryPaymentEcosystem,
  getAllPaymentCountries,
} from '@/lib/payments/database';
import {
  ChevronRight,
  Building2,
  Users,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Landmark,
  Wallet,
  CreditCard,
  Coins,
} from 'lucide-react';

interface CountryPaymentPageProps {
  countrySlug: string;
}

export default function CountryPaymentPage({ countrySlug }: CountryPaymentPageProps) {
  const ecosystem = getCountryPaymentEcosystem(countrySlug);
  const allCountries = getAllPaymentCountries();

  if (!ecosystem) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Country Payment Ecosystem Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Select one of the verified country payment guides below:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {allCountries.map((c) => (
            <a
              key={c.code}
              href={`/payment-methods/countries/${c.slug}`}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:border-indigo-500"
            >
              {c.flagEmoji} {c.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  const {
    country,
    merchantAvailableProviders,
    customerAvailableProviders,
    localAndCustomerMethods,
    wallets,
    bankRails,
    localMethods,
    cards,
    bnpl,
    cryptoGateways,
  } = ecosystem;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolverse.baby/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Payment Methods',
            item: 'https://toolverse.baby/payment-methods',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${country.name} Payment Gateways & Methods`,
            item: `https://toolverse.baby/payment-methods/countries/${country.slug}`,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: `Payment Gateways & Local Payment Methods in ${country.name} (${country.code})`,
        description: country.marketSummary,
        url: `https://toolverse.baby/payment-methods/countries/${country.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800 pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href="/payment-methods" className="hover:text-white">Payment Methods</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-300 font-medium">{country.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
                <span>{country.flagEmoji}</span>
                <span>{country.region} • Primary Currency: {country.defaultCurrency}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Payment Gateways & Local Payment Methods in {country.name}
              </h1>
              <p className="mt-3 text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
                {country.marketSummary}
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 min-w-[260px] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Central Bank / Regulator:</span>
                <a
                  href={country.regulatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>{country.regulatorName.split('(')[0].trim()}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Merchant Gateways:</span>
                <span className="font-bold text-emerald-400">
                  {merchantAvailableProviders.length} Available
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Customer Methods:</span>
                <span className="font-bold text-indigo-300">
                  {localAndCustomerMethods.length} Supported
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Supported Currencies:</span>
                <span className="font-semibold">{country.supportedCurrencies.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-10">
        {/* Banking Rails, Onboarding KYB & Restrictions Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Landmark className="w-4 h-4" />
              <span>Local Banking & Mobile Rails</span>
            </h2>
            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block">Interbank Rails:</strong>
                {country.localBankingRails.join(' • ')}
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block">Mobile & Wallet Systems:</strong>
                {country.mobilePaymentSystems.join(' • ')}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Merchant KYB Onboarding Requirements</span>
            </h2>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {country.onboardingRequirements}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Regulatory & Crypto Availability Notes</span>
            </h2>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {country.restrictionsNote}
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              <strong>Crypto Policy:</strong> {country.cryptoRegulatoryNote}
            </p>
          </div>
        </div>

        {/* Section 1: Available Payment Gateways for Merchants Domiciled in Country */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>
                  1. Payment Gateways Supporting Merchant Onboarding in {country.name} ({merchantAvailableProviders.length})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Businesses, SaaS founders, and e-commerce stores legally registered in {country.name} ({country.code}) can open merchant accounts or receive settlements with these providers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchantAvailableProviders.map((prov) => (
              <a
                key={prov.id}
                href={`/payment-methods/${prov.primaryCategorySlug}/${prov.slug}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-4 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img src={prov.logoUrl} alt={prov.brandName} className="w-10 h-10 rounded-xl" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {prov.brandName}
                      </h3>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {prov.providerType}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {prov.shortDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {prov.transactionFees.slice(0, 32)}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    Inspect →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 2: Local Payment Methods, Bank Rails, Wallets & Cards Used by Customers */}
        <section>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>
              2. Customer Checkout Payment Methods in {country.name} ({localAndCustomerMethods.length})
            </span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Payment methods actively used by shoppers and businesses in {country.name} across local payment rails ({localMethods.length}), bank transfers ({bankRails.length}), digital wallets ({wallets.length}), cards ({cards.length}), and BNPL ({bnpl.length}).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {localAndCustomerMethods.map((method) => (
              <a
                key={method.id}
                href={`/payment-methods/${method.primaryCategorySlug}/${method.slug}`}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 p-4 transition"
              >
                <div className="flex items-center gap-2.5">
                  <img src={method.logoUrl} alt={method.brandName} className="w-9 h-9 rounded-lg" />
                  <div>
                    <h3 className="font-bold text-sm">{method.brandName}</h3>
                    <span className="text-[10px] text-slate-500">{method.providerType}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {method.shortDescription}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Section 3: Crypto Gateways & Cross-Border Acceptance */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span>3. Cross-Border & Cryptocurrency Payment Gateways ({cryptoGateways.length})</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-4">
            International merchants accepting customers from {country.name} ({customerAvailableProviders.length} gateways) and borderless cryptocurrency processors:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {cryptoGateways.map((cg) => (
              <a
                key={cg.id}
                href={`/payment-methods/${cg.primaryCategorySlug}/${cg.slug}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-semibold"
              >
                <img src={cg.logoUrl} alt={cg.brandName} className="w-5 h-5 rounded" />
                <span>{cg.brandName}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Other Country Guides */}
        <section className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            Explore Other Country Payment Ecosystems
          </h2>
          <div className="flex flex-wrap gap-2">
            {allCountries.map((c) => (
              <a
                key={c.code}
                href={`/payment-methods/countries/${c.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  c.code === country.code
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                {c.flagEmoji} {c.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

