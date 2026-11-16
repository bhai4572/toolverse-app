import React from 'react';
import {
  getPaymentEntryByCategoryAndSlug,
  getPaymentEntryById,
  getAllPaymentCountries,
  getProductsUsingPaymentEntry,
  getPaymentCategoryBySlug,
} from '@/lib/payments/database';
import { getProductBySlug } from '@/lib/products/registry';
import {
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Globe,
  Coins,
  Code2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Building2,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PaymentDetailPageProps {
  categorySlug: string;
  slug: string;
}

export default function PaymentDetailPage({ categorySlug, slug }: PaymentDetailPageProps) {
  const entry = getPaymentEntryByCategoryAndSlug(categorySlug, slug);
  const countries = getAllPaymentCountries();

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Payment Provider or Method Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          The requested payment solution could not be located in the ToolVerse Payment Directory.
        </p>
        <a
          href="/payment-methods"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Browse All 115+ Payment Gateways & Methods
        </a>
      </div>
    );
  }

  const category = getPaymentCategoryBySlug(entry.primaryCategorySlug);
  const linkedEntities = (
    entry.entryKind === 'provider' ? entry.supportedMethodIds : entry.supportedByProviderIds
  )
    .map((id) => getPaymentEntryById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const alternatives = entry.alternativeIds
    .map((id) => getPaymentEntryById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const productRels = getProductsUsingPaymentEntry(entry.id);

  // Valid JSON-LD Schema (BreadcrumbList + WebPage + FAQPage — no fabricated ratings)
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
            name: category?.name || entry.primaryCategorySlug,
            item: `https://toolverse.baby/payment-methods/${entry.primaryCategorySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: entry.brandName,
            item: entry.seo.canonicalUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: entry.seo.seoTitle,
        description: entry.seo.metaDescription,
        url: entry.seo.canonicalUrl,
        dateModified: entry.lastVerifiedDate,
      },
      {
        '@type': 'FAQPage',
        mainEntity: entry.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800 pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-5">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a href="/payment-methods" className="hover:text-white">Payment Methods</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <a
              href={`/payment-methods/${entry.primaryCategorySlug}`}
              className="hover:text-white"
            >
              {category?.shortName || entry.primaryCategorySlug}
            </a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-300 font-medium">{entry.brandName}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={entry.logoUrl}
                alt={`${entry.brandName} official logo`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                    {entry.providerType}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      entry.operationalStatus === 'Discontinued'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {entry.operationalStatus}
                  </span>
                  <span className="text-xs text-slate-400">
                    Verified: {entry.lastVerifiedDate}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {entry.seo.h1Heading}
                </h1>
                <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl">
                  {entry.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={entry.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow transition"
              >
                <span>Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={entry.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold transition"
              >
                <Code2 className="w-4 h-4" />
                <span>API & Developer Docs</span>
              </a>
            </div>
          </div>

          {/* Hero Stat Strip */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block">Merchant Countries</span>
              <span className="text-lg font-extrabold text-white">
                {entry.merchantEligibleCountryCodes.length} Countries
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block">Customer Checkout</span>
              <span className="text-lg font-extrabold text-white">
                {entry.customerPaymentCountryCodes.length}+ Countries
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block">Supported Currencies</span>
              <span className="text-lg font-extrabold text-white">
                {entry.supportedCurrencies.length} Currencies
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <span className="text-slate-400 block">Standard Fee</span>
              <span className="text-sm font-bold text-emerald-400 line-clamp-1">
                {entry.transactionFees}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* 2. OVERVIEW & 3. HOW IT WORKS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">
              2. Overview — What is {entry.brandName}?
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              {entry.uniqueIntroduction}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {entry.overview}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <strong>Official Legal Entity / Scheme:</strong> {entry.officialName}
            </div>
          </section>

          <section className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">
              3. How {entry.brandName} Works (Step-by-Step)
            </h2>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {entry.howItWorks.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* 4. SUPPORTED COUNTRIES FOR MERCHANTS & 5. SUPPORTED COUNTRIES FOR CUSTOMERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>4. Supported Countries for Merchants ({entry.merchantEligibleCountryCodes.length})</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {entry.merchantEligibilitySummary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {entry.merchantEligibleCountryCodes.map((code) => {
                const c = countries.find((item) => item.code === code);
                return (
                  <a
                    key={code}
                    href={c ? `/payment-methods/countries/${c.slug}` : '/payment-methods'}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-medium transition"
                  >
                    <span>{c?.flagEmoji || '🌐'}</span>
                    <span>{c?.name || code}</span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>5. Supported Countries for Customers ({entry.customerPaymentCountryCodes.length}+)</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {entry.customerCoverageSummary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {entry.customerPaymentCountryCodes.map((code) => {
                const c = countries.find((item) => item.code === code);
                return (
                  <a
                    key={code}
                    href={c ? `/payment-methods/countries/${c.slug}` : '/payment-methods'}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-600 hover:text-white transition"
                  >
                    <span>{c?.flagEmoji || '🌐'}</span>
                    <span>{c?.name || code}</span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        {/* 6. SUPPORTED CURRENCIES & 7. SUPPORTED PAYMENT METHODS / GATEWAYS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>6. Supported Currencies & Settlement</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Presentment / Charging Currencies ({entry.supportedCurrencies.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {entry.supportedCurrencies.map((cur) => (
                    <span
                      key={cur}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold"
                    >
                      {cur}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Settlement Currencies ({entry.settlementCurrencies.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {entry.settlementCurrencies.map((cur) => (
                    <span
                      key={cur}
                      className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold"
                    >
                      {cur}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>
                7. {entry.entryKind === 'provider' ? 'Supported Payment Methods' : 'Payment Gateways Supporting This Method'} ({linkedEntities.length})
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {linkedEntities.map((rel) => (
                <a
                  key={rel.id}
                  href={`/payment-methods/${rel.primaryCategorySlug}/${rel.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-xs font-semibold transition"
                >
                  <img src={rel.logoUrl} alt={rel.brandName} className="w-5 h-5 rounded" />
                  <span>{rel.brandName}</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* 8. PRICING & FEES + 9. PAYOUT & SETTLEMENT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">8. Pricing and Fees</h2>
            <dl className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-500">Transaction Fees:</dt>
                <dd className="font-semibold text-right text-emerald-700 dark:text-emerald-400">
                  {entry.transactionFees}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-500">Monthly Fees:</dt>
                <dd className="font-medium text-right">{entry.monthlyFees}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <dt className="text-slate-500">Setup Fees:</dt>
                <dd className="font-medium text-right">{entry.setupFees}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5">
                <dt className="text-slate-500">Minimum Transaction:</dt>
                <dd className="font-medium text-right">{entry.minimumTransactionAmount}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">9. Payout and Settlement Details</h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              {entry.payoutDetails}
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block">Mass Payouts / Connect</span>
                <span className="font-bold">
                  {entry.payoutSupport ? 'Supported via API / Dashboard' : 'Merchant Settlement Only'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block">Payment Links & Invoicing</span>
                <span className="font-bold">
                  {entry.paymentLinksSupport ? 'Supported' : 'API Only'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 10. INTEGRATION OPTIONS & 11. BUSINESS MODEL SUITABILITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">10. Integration Options & Platforms</h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block mb-1.5">Integration Methods:</span>
                <div className="flex flex-wrap gap-1.5">
                  {entry.supportedIntegrationTypes.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-1.5">Supported Platforms & Plugins:</span>
                <div className="flex flex-wrap gap-1.5">
                  {entry.supportedPlatforms.map((p) => (
                    <span key={p} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">11. Business Model Suitability</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {entry.supportedBusinessModels.map((bm) => (
                <span
                  key={bm}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
                >
                  ✓ {bm}
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>
                <strong>Online Checkout:</strong> {entry.onlinePaymentSupported ? 'Yes' : 'No'} •{' '}
                <strong>In-Person POS:</strong> {entry.inPersonPaymentSupported ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Integration Complexity:</strong> {entry.integrationComplexity}
              </div>
            </div>
          </section>
        </div>

        {/* 12. RECURRING & SUBSCRIPTIONS + 13. REFUNDS & CHARGEBACKS + 14. KYC/KYB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              <span>12. Recurring & Subscriptions</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {entry.recurringAndSubscriptionDetails}
            </p>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>13. Refunds & Chargebacks</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              <strong>{entry.refundSupport}:</strong> {entry.refundDetails}
            </p>
            <p className="text-[11px] text-slate-500">{entry.chargebackDetails}</p>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-base font-bold flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>14. KYC / KYB Verification</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              {entry.kycKybRequirements}
            </p>
            <p className="text-[11px] text-slate-500">{entry.businessEligibilityDetails}</p>
          </section>
        </div>

        {/* 15. CRYPTO DETAILS (Conditional — Explicit Per-Asset Blockchain Networks) */}
        {entry.cryptoDetails && (
          <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-500/30 p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>15. Cryptocurrency Asset & Blockchain Network Support</span>
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              Never assume a coin ticker implies support for every chain. Below are the exact verified blockchain networks, custody model, and confirmation requirements for {entry.brandName}:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {entry.cryptoDetails.supportedAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-amber-300">
                      {asset.symbol} — {asset.name}
                    </span>
                    {asset.isStablecoin && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Stablecoin
                      </span>
                    )}
                  </div>
                  <div className="text-slate-300">
                    <strong>Supported Networks:</strong> {asset.networks.join(' • ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/70 rounded-xl p-4 border border-slate-800">
              <div>
                <span className="text-slate-400 block">Custody Model:</span>
                <span className="font-semibold">{entry.cryptoDetails.custodyModel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Block Confirmations:</span>
                <span className="font-semibold">{entry.cryptoDetails.blockchainConfirmationRequirements}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Settlement & Off-Ramp:</span>
                <span className="font-semibold">{entry.cryptoDetails.settlementOptions}</span>
              </div>
            </div>
          </section>
        )}

        {/* 16. ADVANTAGES & 17. LIMITATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-3">
              16. Key Features & Advantages
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {[...entry.features, ...entry.advantages].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-3">
              17. Limitations & Considerations
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {entry.limitations.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 18. BEST ALTERNATIVES */}
        {alternatives.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-3">
              18. Best {entry.brandName} Alternatives & Competitors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {alternatives.map((alt) => (
                <a
                  key={alt.id}
                  href={`/payment-methods/${alt.primaryCategorySlug}/${alt.slug}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={alt.logoUrl} alt={alt.brandName} className="w-9 h-9 rounded-lg" />
                    <div>
                      <h3 className="font-bold text-sm">{alt.brandName}</h3>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
                        {alt.providerType}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {alt.shortDescription}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 19. PRODUCTS ON TOOLVERSE USING THIS PAYMENT METHOD */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>19. Products on ToolVerse Using {entry.brandName}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Verified software products and SaaS tools in the ToolVerse directory accepting or powered by {entry.brandName}.
              </p>
            </div>
            <a
              href="/submit"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + List Your Product with {entry.brandName}
            </a>
          </div>

          {productRels.length === 0 ? (
            <p className="text-xs text-slate-500">
              Are you building a product that accepts {entry.brandName}?{' '}
              <a href="/submit" className="text-indigo-600 underline font-semibold">
                Submit your product
              </a>{' '}
              to link it directly on this page.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {productRels.map((rel) => {
                const prod = getProductBySlug(rel.productSlug);
                return (
                  <a
                    key={rel.productSlug}
                    href={`/products/${rel.productSlug}`}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm capitalize">
                        {prod?.name || rel.productSlug}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {rel.pricingModel} • {rel.billingCurrency}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* 20. FREQUENTLY ASKED QUESTIONS */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>20. Frequently Asked Questions about {entry.brandName}</span>
          </h2>
          <div className="space-y-4">
            {entry.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 21. OFFICIAL SOURCES AND LAST VERIFIED DATE */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>21. Official Sources & Verification Audit Trail</span>
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap gap-3">
              {entry.officialSources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 font-medium"
                >
                  <span>{src.label} ({src.sourceType})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {entry.verificationStatus}
              </span>{' '}
              • Last Verified: <strong>{entry.lastVerifiedDate}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

