import React, { useState, useEffect } from 'react';
import { getCurrentAdminSession, logoutAdmin, getAdminAuditLogs, hasPermission } from '@/lib/admin/authEngine';
import { getStoredBusinesses, updateBusinessSpamStatus, getStoredCategories } from '@/lib/business/storageEngine';
import { getStoredVerificationRequests, reviewVerificationRequest } from '@/lib/business/verificationEngine';
import { getStoredBusinessReports, updateReportStatus } from '@/lib/business/moderationEngine';
import { getStoredPolicies, updatePolicyDocument } from '@/lib/business/policyEngine';
import { Business, VerificationRequest, BusinessReport, PolicyDocument } from '@/lib/business/types';
import { TOOLS, CATEGORIES } from '@/lib/tools/registry';
import { FEATURE_FLAGS } from '@/lib/product/featureFlags';
import { BLOG_POSTS } from '@/lib/blog/posts';
import {
  getAllPaymentDirectoryEntries,
  getAllPaymentCategories,
  getArchivedPaymentIds,
  toggleArchivePaymentEntry,
  updatePaymentSeoMetadata,
  evaluatePaymentSeoQuality,
  saveCustomPaymentEntry,
  getPaymentChangeHistory,
  getAllProductPaymentRelationships,
  saveProductPaymentRelationship,
} from '@/lib/payments/database';
import { buildPaymentEntry } from '@/lib/payments/catalogHelpers';
import { PaymentDirectoryEntry, PaymentCategorySlug } from '@/lib/payments/types';
import { getAllPhones } from '@/lib/phones/database';
import { AdminPhonesPanel } from '@/components/admin/AdminPhonesPanel';
import {
  LogOut,
  Lock,
} from 'lucide-react';

export default function AdminControlPanelPage() {
  const [session, setSession] = useState(getCurrentAdminSession());
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'phones' | 'verification' | 'businesses' | 'reports' | 'categories' | 'policies' | 'audit'>('overview');

  // Payment Directory Admin State
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedPaymentEntry, setSelectedPaymentEntry] = useState<PaymentDirectoryEntry | null>(null);
  const [seoTitleDraft, setSeoTitleDraft] = useState('');
  const [seoDescDraft, setSeoDescDraft] = useState('');
  const [seoNoindexDraft, setSeoNoindexDraft] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderSlug, setNewProviderSlug] = useState('');
  const [newProviderCategory, setNewProviderCategory] = useState<PaymentCategorySlug>('gateways');
  const [newProviderWebsite, setNewProviderWebsite] = useState('');
  const [newProviderFees, setNewProviderFees] = useState('2.9% + $0.30');

  // Re-fetch triggers
  const [refreshKey, setRefreshKey] = useState(0);

  // Rejection Reason Modal
  const [rejectionModalReq, setRejectionModalReq] = useState<VerificationRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Policy Edit Modal
  const [editPolicy, setEditPolicy] = useState<PolicyDocument | null>(null);
  const [policyMarkdownInput, setPolicyMarkdownInput] = useState('');

  useEffect(() => {
    const s = getCurrentAdminSession();
    if (!s && typeof window !== 'undefined') {
      window.location.replace('/admin/login');
    } else {
      setSession(s);
    }
  }, [refreshKey]);

  if (!session) return null;

  const businesses = getStoredBusinesses();
  const verRequests = getStoredVerificationRequests();
  const reports = getStoredBusinessReports();
  const categories = getStoredCategories();
  const auditLogs = getAdminAuditLogs();
  const policies = getStoredPolicies();

  const handleApproveVerification = (reqId: string) => {
    reviewVerificationRequest(reqId, 'APPROVE', session.username);
    setRefreshKey((k) => k + 1);
  };

  const handleRejectVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalReq) return;
    reviewVerificationRequest(rejectionModalReq.id, 'REJECT', session.username, rejectionReasonInput);
    setRejectionModalReq(null);
    setRejectionReasonInput('');
    setRefreshKey((k) => k + 1);
  };

  const handleSpamToggle = (bizId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SPAM' ? 'CLEAN' : 'SPAM';
    updateBusinessSpamStatus(bizId, nextStatus as any, session.username);
    setRefreshKey((k) => k + 1);
  };

  const handleReportAction = (reportId: string, status: BusinessReport['status']) => {
    updateReportStatus(reportId, status, session.username);
    setRefreshKey((k) => k + 1);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPolicy) return;
    updatePolicyDocument(editPolicy.slug, policyMarkdownInput, session.username);
    setEditPolicy(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-xs">
      {/* Header Bar */}
      <header className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Toolverse Admin Control Center</h1>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold border border-indigo-400/30">
                {session.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs">Logged in as {session.username} ({session.email})</p>
          </div>
        </div>

        <button
          onClick={() => {
            logoutAdmin();
            window.location.replace('/admin/login');
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 border border-slate-700"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      {/* Inventory metrics — real counts only (no fake traffic) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Tools</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{TOOLS.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Tool categories</div>
          <div className="text-2xl font-black text-brand-600">{CATEGORIES.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">SEO tools</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{TOOLS.filter((t) => t.categorySlug === 'seo-url-tools').length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Blog posts</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{BLOG_POSTS.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Businesses</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{businesses.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Pending verif.</div>
          <div className="text-2xl font-black text-amber-500">{verRequests.filter((r) => r.status === 'PENDING').length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Spam flagged</div>
          <div className="text-2xl font-black text-rose-500">{businesses.filter((b) => b.spamStatus === 'SPAM').length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-2xl">
          <div className="text-slate-400 text-[11px]">Audit events</div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{auditLogs.length}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b overflow-x-auto pb-2">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'payments', label: `Payment Directory & SEO (${getAllPaymentDirectoryEntries(true).length})` },
            { id: 'phones', label: `Mobile Phones (${getAllPhones(true).length})` },
            { id: 'verification', label: `Verifications (${verRequests.filter((r) => r.status === 'PENDING').length})` },
            { id: 'businesses', label: `Business Manager (${businesses.length})` },
            { id: 'reports', label: `Spam Reports (${reports.filter((r) => r.status === 'NEW').length})` },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'policies', label: 'Policy Center' },
            { id: 'audit', label: 'Admin Audit Logs' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'payments' && hasPermission(session.role, 'MANAGE_PAYMENTS') && (
        <section className="space-y-6">
          {/* 1. Quick Add Payment Provider / Method */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Add New Payment Gateway or Payment Method
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProviderName.trim() || !newProviderWebsite.trim()) return;
                const slug =
                  newProviderSlug.trim() ||
                  newProviderName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                const created = buildPaymentEntry({
                  id: `prv_custom_${slug}`,
                  slug,
                  entryKind: 'provider',
                  officialName: newProviderName.trim(),
                  brandName: newProviderName.trim(),
                  brandColor: '#4F46E5',
                  primaryCategorySlug: newProviderCategory,
                  providerType: 'Payment Gateway',
                  shortDescription: `${newProviderName.trim()} payment gateway and checkout solution integrated on ToolVerse.`,
                  uniqueIntroduction: `${newProviderName.trim()} provides online payment processing and checkout infrastructure.`,
                  overview: `Supports online checkout, API webhooks, and merchant settlement.`,
                  howItWorks: [
                    `Merchant connects ${newProviderName.trim()} API or checkout plugin.`,
                    'Customer authorizes payment at checkout.',
                    'Funds settle to the verified merchant bank account.',
                  ],
                  officialWebsite: newProviderWebsite.trim(),
                  documentationUrl: newProviderWebsite.trim(),
                  apiAvailable: true,
                  sdkAvailable: true,
                  pluginAvailable: true,
                  supportedPlatforms: ['Web', 'API', 'Shopify', 'WooCommerce'],
                  supportedIntegrationTypes: ['REST API', 'Hosted Checkout'],
                  supportedBusinessModels: ['SaaS', 'E-Commerce'],
                  merchantEligibleCountryCodes: ['US', 'GB', 'CA', 'AU', 'DE'],
                  merchantEligibilitySummary: 'Available to verified merchants in supported countries.',
                  customerPaymentCountryCodes: ['US', 'GB', 'CA', 'AU', 'DE', 'PK', 'IN'],
                  customerCoverageSummary: 'Accepts international customer payments.',
                  supportedCurrencies: ['USD', 'EUR', 'GBP'],
                  settlementCurrencies: ['USD', 'EUR', 'GBP'],
                  transactionFees: newProviderFees.trim() || '2.9% + $0.30',
                  refundSupport: 'Full & Partial Refunds',
                  refundDetails: 'Supports full and partial refunds via dashboard or API.',
                  recurringPaymentSupport: true,
                  subscriptionSupport: true,
                  recurringAndSubscriptionDetails: 'Supports recurring billing and webhooks.',
                  chargebackSupport: true,
                  chargebackDetails: 'Standard dispute evidence handling.',
                  paymentLinksSupport: true,
                  invoicingSupport: true,
                  payoutSupport: true,
                  payoutDetails: 'Settles to verified merchant bank accounts.',
                  kycKybRequirements: 'Standard KYB business verification.',
                  businessEligibilityDetails: 'Registered business entity or sole proprietor.',
                  onlinePaymentSupported: true,
                  inPersonPaymentSupported: false,
                  oneTimePaymentSupported: true,
                  freeIntegrationAvailable: true,
                  integrationComplexity: 'Low',
                  features: ['REST API & Webhooks', 'Hosted Checkout'],
                  advantages: ['Fast merchant integration'],
                  limitations: ['Standard KYB underwriting required'],
                  alternativeIds: ['prv_stripe', 'prv_paypal'],
                  linkedEntityIds: ['pm_visa', 'pm_mastercard'],
                  popularityRank: 90,
                });
                saveCustomPaymentEntry(created, session.email, 'Added via Admin Payment Directory');
                setNewProviderName('');
                setNewProviderSlug('');
                setNewProviderWebsite('');
                setRefreshKey((k) => k + 1);
              }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
            >
              <input
                type="text"
                placeholder="Brand Name (e.g. Tap Payments)"
                value={newProviderName}
                onChange={(e) => setNewProviderName(e.target.value)}
                required
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Slug (optional)"
                value={newProviderSlug}
                onChange={(e) => setNewProviderSlug(e.target.value)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <select
                value={newProviderCategory}
                onChange={(e) => setNewProviderCategory(e.target.value as PaymentCategorySlug)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              >
                {getAllPaymentCategories().map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.shortName}
                  </option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Official URL (https://...)"
                value={newProviderWebsite}
                onChange={(e) => setNewProviderWebsite(e.target.value)}
                required
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                + Add Payment Entry
              </button>
            </form>
          </div>

          {/* 2. SEO Metadata Editor & SERP Preview Modal/Drawer */}
          {selectedPaymentEntry && (
            <div className="p-6 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-400/40 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold">
                  SEO Metadata &amp; Quality Checklist: {selectedPaymentEntry.brandName}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentEntry(null)}
                  className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold"
                >
                  Close Editor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-bold">SEO Title (Max 60 chars)</label>
                      <span
                        className={`font-bold ${
                          seoTitleDraft.length > 60 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {seoTitleDraft.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitleDraft}
                      onChange={(e) => setSeoTitleDraft(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-bold">Meta Description (Target 150–160 chars)</label>
                      <span
                        className={`font-bold ${
                          seoDescDraft.length > 160 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {seoDescDraft.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={seoDescDraft}
                      onChange={(e) => setSeoDescDraft(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={seoNoindexDraft}
                      onChange={(e) => setSeoNoindexDraft(e.target.checked)}
                    />
                    <span>Set meta robots to noindex (exclude from search indexing)</span>
                  </label>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        updatePaymentSeoMetadata(
                          selectedPaymentEntry.id,
                          {
                            seoTitle: seoTitleDraft,
                            metaDescription: seoDescDraft,
                            noindex: seoNoindexDraft,
                          },
                          session.email
                        );
                        setSelectedPaymentEntry(null);
                        setRefreshKey((k) => k + 1);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
                    >
                      Save SEO Metadata &amp; Log Audit
                    </button>
                  </div>
                </div>

                {/* Live Google SERP Preview + Quality Checklist */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Google SERP Preview
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 truncate">
                      {selectedPaymentEntry.seo.canonicalUrl}
                    </div>
                    <div className="text-base font-bold text-blue-700 dark:text-blue-400 line-clamp-1 mt-0.5">
                      {seoTitleDraft}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                      {seoDescDraft}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    {(() => {
                      const report = evaluatePaymentSeoQuality(selectedPaymentEntry);
                      return (
                        <>
                          <div className="font-bold">
                            SEO Quality Score: {report.score}% (
                            {report.isIndexable ? 'Indexable' : 'Blocked'})
                          </div>
                          {report.checks.map((chk, ci) => (
                            <div key={ci} className="flex items-center justify-between text-[11px]">
                              <span>
                                {chk.passed ? '✅' : '⚠️'} {chk.label}
                              </span>
                              <span className="text-slate-400">{chk.detail.slice(0, 32)}</span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Payment Directory Inventory Table */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Payment Methods &amp; Gateways Inventory ({getAllPaymentDirectoryEntries(true).length})
                </h2>
                <p className="text-slate-500">
                  Manage providers, methods, countries, SEO metadata, verification dates, and archive states.
                </p>
              </div>
              <input
                type="text"
                placeholder="Search payment entries..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-64"
              />
            </div>

            <div className="overflow-x-auto max-h-[420px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-800 font-bold">
                    <th className="p-3">Provider / Method</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Countries (M / C)</th>
                    <th className="p-3">SEO Score</th>
                    <th className="p-3">Verified</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {getAllPaymentDirectoryEntries(true)
                    .filter(
                      (e) =>
                        !paymentSearch.trim() ||
                        e.brandName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        e.slug.includes(paymentSearch.toLowerCase())
                    )
                    .map((item) => {
                      const archivedSet = new Set(getArchivedPaymentIds());
                      const isArchived = item.isArchived || archivedSet.has(item.id);
                      const seoRep = evaluatePaymentSeoQuality(item);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img src={item.logoUrl} alt={item.brandName} className="w-6 h-6 rounded" />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {item.brandName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  /payment-methods/{item.primaryCategorySlug}/{item.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">{item.providerType}</td>
                          <td className="p-3">
                            {item.merchantEligibleCountryCodes.length}M /{' '}
                            {item.customerPaymentCountryCodes.length}C
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                              {seoRep.score}%
                            </span>
                          </td>
                          <td className="p-3">{item.lastVerifiedDate}</td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPaymentEntry(item);
                                setSeoTitleDraft(item.seo.seoTitle);
                                setSeoDescDraft(item.seo.metaDescription);
                                setSeoNoindexDraft(item.seo.noindex);
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold"
                            >
                              Edit SEO
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                toggleArchivePaymentEntry(item.id, !isArchived, session.email);
                                setRefreshKey((k) => k + 1);
                              }}
                              className={`px-2.5 py-1 rounded font-bold ${
                                isArchived
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {isArchived ? 'Restore' : 'Archive'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. User-Submitted Product Payment Claims & Payment Change History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <h3 className="text-base font-extrabold">
                Product Payment Claims ({Object.keys(getAllProductPaymentRelationships()).length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.values(getAllProductPaymentRelationships()).map((rel) => (
                  <div
                    key={rel.productSlug}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold capitalize">{rel.productSlug}</div>
                      <div className="text-[10px] text-slate-500">
                        {rel.acceptedGatewayIds.length} gateways • {rel.acceptedMethodIds.length} methods •{' '}
                        {rel.verificationStatus}
                      </div>
                    </div>
                    {rel.verificationStatus !== 'Confirmed by Official Documentation' && (
                      <button
                        type="button"
                        onClick={() => {
                          saveProductPaymentRelationship({
                            ...rel,
                            verificationStatus: 'Confirmed by Official Documentation',
                            lastVerifiedDate: new Date().toISOString().split('T')[0],
                          });
                          setRefreshKey((k) => k + 1);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                      >
                        Approve Claim
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <h3 className="text-base font-extrabold">
                Payment Directory Change History ({getPaymentChangeHistory().length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getPaymentChangeHistory().length === 0 ? (
                  <p className="text-slate-400">No manual edits recorded in this session yet.</p>
                ) : (
                  getPaymentChangeHistory().map((chg) => (
                    <div
                      key={chg.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]"
                    >
                      <div className="font-bold">
                        {chg.entityName} — {chg.fieldChanged}
                      </div>
                      <div className="text-slate-500">
                        {chg.previousValue} &rarr; {chg.newValue} ({chg.changedBy})
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'phones' && (
        <AdminPhonesPanel onMutated={() => setRefreshKey((k) => k + 1)} />
      )}

      {activeTab === 'overview' && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Product overview</h2>
            <p className="text-slate-500 mt-1">
              Traffic / pageviews: use Microsoft Clarity (site tag) and Cloudflare Analytics until first-party events ship.
              End-user block list requires auth — not available yet. Business spam toggle remains below.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Feature flags (Free vs Pro)</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {FEATURE_FLAGS.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{f.name}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    f.tier === 'free'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                  }`}>
                    {f.tier} · {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <a href="/workspace/search-console" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              GSC Search Intelligence &amp; URL Map
            </a>
            <a href="/workspace" className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
              Free SEO Dashboard
            </a>
            <a href="/cv-maker" className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold">
              CV Maker Studio
            </a>
            <a href="/tools/b2b-email-finder" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold">
              B2B Email Finder
            </a>
            <a href="/seo" className="px-3 py-1.5 rounded-lg border font-bold">SEO Suite</a>
            <a href="/pricing" className="px-3 py-1.5 rounded-lg border font-bold">Pricing</a>
            <a href="/tools" className="px-3 py-1.5 rounded-lg border font-bold">Tools hub</a>
          </div>
        </section>
      )}

      {/* Tab 1: Verification Portal */}
      {activeTab === 'verification' && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Document Verification Portal</h2>

          {verRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-semibold">No pending verification requests in database.</div>
          ) : (
            <div className="space-y-4">
              {verRequests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{req.businessName}</h3>
                      <p className="text-slate-500">{req.ownerEmail} &bull; {req.country} &bull; {req.categoryName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-300">
                    <strong>Required Evidence:</strong> {req.requiredDocuments.join(', ')}
                  </div>

                  {req.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 rounded-lg">
                      <strong>Rejection Reason:</strong> {req.rejectionReason}
                    </div>
                  )}

                  {req.status === 'PENDING' && (
                    <div className="pt-2 flex gap-2 justify-end">
                      <button
                        onClick={() => setRejectionModalReq(req)}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                      >
                        Reject with Reason
                      </button>
                      <button
                        onClick={() => handleApproveVerification(req.id)}
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Approve Verification
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Business Manager */}
      {activeTab === 'businesses' && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">All Registered Businesses</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <th className="p-3">ID / Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Risk Status</th>
                  <th className="p-3">Spam State</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{b.id}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{b.categoryName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{b.city}, {b.country}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${b.riskStatus === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {b.riskStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${b.spamStatus === 'SPAM' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {b.spamStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSpamToggle(b.id, b.spamStatus)}
                        className={`px-3 py-1 rounded font-bold text-[11px] ${
                          b.spamStatus === 'SPAM' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {b.spamStatus === 'SPAM' ? 'Mark Clean' : 'Tag SPAM'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Rejection Modal */}
      {rejectionModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Reject Verification Request</h3>
            <form onSubmit={handleRejectVerificationSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Business registration document is unclear or expired..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalReq(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg shadow">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
