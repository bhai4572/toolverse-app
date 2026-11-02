import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  ACCEPT_ALL_WARNING,
  COMPLIANCE_DISCLAIMER,
  CompanyEmailIntelligenceReport,
  CompanySearchFilters,
  CreditPackOption,
  DiscoveredEmailRecord,
  LOW_CONFIDENCE_LABEL,
  MONETIZATION_CONFIG,
  NO_MX_MESSAGE,
  NO_VERIFIED_EMAIL_MESSAGE,
  PUBLIC_CRAWL_PATHS,
  SearchAuditLogEntry,
  UserCreditSummary,
  WEBSITE_UNREACHABLE_MESSAGE,
} from '@/lib/b2b/emailIntelligenceEngine';

type ActiveTab = 'overview' | 'emails' | 'sources' | 'verification' | 'export' | 'admin';

export const EmailFinderTool: React.FC = () => {
  // Core & Optional Search Inputs
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Optional Provider API Keys (Waterfall: Hunter.io -> ZeroBounce -> EmailListVerify)
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [hunterApiKey, setHunterApiKey] = useState('');
  const [zeroBounceApiKey, setZeroBounceApiKey] = useState('');
  const [emailListVerifyApiKey, setEmailListVerifyApiKey] = useState('');

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CompanyEmailIntelligenceReport | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Admin & Credits State
  const [credits, setCredits] = useState<UserCreditSummary>({
    userId: 'default_user',
    freeSearchesUsed: 0,
    freeSearchesLimit: MONETIZATION_CONFIG.freeMonthlyCompanySearches,
    freeVerificationsUsed: 0,
    freeVerificationsLimit: MONETIZATION_CONFIG.freeMonthlyEmailVerifications,
    paidCreditsBalance: 0,
    periodResetAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
  });
  const [auditLogs, setAuditLogs] = useState<SearchAuditLogEntry[]>([]);
  const [cachedCount, setCachedCount] = useState(0);
  const [totalVerifiedCached, setTotalVerifiedCached] = useState(0);
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/email-finder');
      if (res.ok) {
        const data = await res.json();
        if (data.credits) setCredits(data.credits);
        if (Array.isArray(data.recentLogs)) setAuditLogs(data.recentLogs);
        if (typeof data.cachedCompaniesCount === 'number') setCachedCount(data.cachedCompaniesCount);
        if (typeof data.totalVerifiedEmailsCached === 'number') setTotalVerifiedCached(data.totalVerifiedEmailsCached);
      }
    } catch {
      // Non-fatal
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string, forceRefresh = false) => {
    if (e) e.preventDefault();
    const targetQ = (customQuery ?? query).trim();
    if (!targetQ) {
      setError('Please enter a company name or website domain (e.g., iana.org, gnu.org, or Intercom).');
      return;
    }

    setLoading(true);
    setError(null);

    const filters: CompanySearchFilters = {
      country: country.trim() || undefined,
      industry: industry.trim() || undefined,
      companySize: companySize.trim() || undefined,
      targetRole: targetRole.trim() || undefined,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
    };

    try {
      const res = await fetch('/api/email-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQ,
          filters,
          providerKeys: {
            hunterApiKey: hunterApiKey.trim() || undefined,
            zeroBounceApiKey: zeroBounceApiKey.trim() || undefined,
            emailListVerifyApiKey: emailListVerifyApiKey.trim() || undefined,
          },
          forceRefresh,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute B2B email discovery.');
      }

      if (data.report) {
        setReport(data.report);
        setActiveTab(data.report.emails.length > 0 ? 'emails' : 'overview');
      }
      if (data.credits) {
        setCredits(data.credits);
      }
      fetchAdminStats();
    } catch (err: any) {
      setError(err.message || 'Unable to complete request.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCreditPack = async (pack: CreditPackOption) => {
    try {
      const res = await fetch('/api/email-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchase_pack',
          packId: pack.id,
        }),
      });
      const data = await res.json();
      if (data.credits) {
        setCredits(data.credits);
        setPurchaseNotice(`Added ${pack.credits} verified email credits ($${pack.priceUsd}) to your balance.`);
        setTimeout(() => setPurchaseNotice(null), 4000);
      }
    } catch {
      // Ignore error
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Strictly export ONLY verified emails (status === 'valid' && confidence >= 70)
  const verifiedEmailsForExport: DiscoveredEmailRecord[] = (report?.emails || []).filter(
    (item) => item.status === 'valid'
  );

  const handleExportCsv = () => {
    if (!report || verifiedEmailsForExport.length === 0) return;
    const headers = [
      'Company Name',
      'Domain',
      'Email',
      'Verification Status',
      'Confidence %',
      'Department / Role',
      'Source URL',
      'Verification Provider',
      'Date Checked',
    ];
    const rows = verifiedEmailsForExport.map((e) => [
      report.companyName,
      report.domain,
      e.email,
      e.statusBadge,
      `${e.confidence}%`,
      e.role || e.department || 'General Business',
      e.sourceUrl,
      e.verificationProvider,
      e.checkedAt,
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.domain}-verified-emails.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportXlsx = () => {
    if (!report || verifiedEmailsForExport.length === 0) return;
    const worksheetData = verifiedEmailsForExport.map((e) => ({
      Company: report.companyName,
      Domain: report.domain,
      Email: e.email,
      Status: e.statusBadge,
      Confidence: `${e.confidence}%`,
      Department: e.role || e.department || 'General Business',
      SourceURL: e.sourceUrl,
      Provider: e.verificationProvider,
      CheckedAt: e.checkedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Verified Business Emails');
    XLSX.writeFile(wb, `${report.domain}-verified-emails.xlsx`);
  };

  const renderStatusBadge = (badge: DiscoveredEmailRecord['statusBadge']) => {
    switch (badge) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Verified
          </span>
        );
      case 'Accept-all':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Accept-all
          </span>
        );
      case 'Risky':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Risky
          </span>
        );
      case 'Not found':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Not found
          </span>
        );
    }
  };

  const freeSearchesRemaining = Math.max(0, credits.freeSearchesLimit - credits.freeSearchesUsed);

  return (
    <div className="space-y-6">
      {/* Top Compliance & Credit Status Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span>Zero-Hallucination Verified B2B Discovery</span>
              <span>•</span>
              <span>12 Public Routes + DNS/MX + Provider Waterfall</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              B2B Business Email Finder &amp; Domain Verifier
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Discover real, publicly sourced business email addresses and official company metadata. Never fabricates or guesses unverified emails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs">
            <div>
              <span className="text-slate-400 block">Free Monthly Searches</span>
              <span className="font-bold text-white text-sm">
                {freeSearchesRemaining} / {credits.freeSearchesLimit} left
              </span>
            </div>
            <div className="h-7 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 block">Credit Pack Balance</span>
              <span className="font-bold text-emerald-400 text-sm">{credits.paidCreditsBalance} credits</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="ml-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
            >
              Credits &amp; Logs
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={(e) => handleSearch(e)} className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter company name or website (e.g., iana.org, gnu.org, apache.org, or Intercom)"
                aria-label="Enter company name or website"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/90 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-sm sm:text-base shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Crawling &amp; Verifying…</span>
                </>
              ) : (
                <span>Find Verified Emails</span>
              )}
            </button>
          </div>

          {/* Quick Live Test Domains & Filter/API Key Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400">Try live public crawl examples:</span>
              {['iana.org', 'gnu.org', 'apache.org', 'python.org', 'intercom.com'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setQuery(sample);
                    handleSearch(undefined, sample);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono transition"
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="text-indigo-300 hover:text-indigo-200 underline font-medium"
              >
                {showFilters ? 'Hide Filters & Person Lookup' : '+ Optional Role / Person Filters'}
              </button>
              <button
                type="button"
                onClick={() => setShowApiKeys((v) => !v)}
                className="text-emerald-300 hover:text-emerald-200 underline font-medium"
              >
                {showApiKeys ? 'Hide Provider API Keys' : '+ Configure Hunter / ZeroBounce Keys'}
              </button>
            </div>
          </div>

          {/* Optional Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Target Role (Optional)
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. CEO, Marketing, Press"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Industry (Optional)
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. SaaS, FinTech"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, UK"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Company Size (Optional)
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="">Any Size</option>
                  <option value="1-10">1–10 employees</option>
                  <option value="11-50">11–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="201-1000">201–1,000 employees</option>
                  <option value="1000+">1,000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Person First Name (Pattern Check)
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Person Last Name (Pattern Check)
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Optional Provider Waterfall API Keys */}
          {showApiKeys && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 bg-slate-950/60 p-3 rounded-xl">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  1. Hunter.io API Key (Primary Provider)
                </label>
                <input
                  type="password"
                  value={hunterApiKey}
                  onChange={(e) => setHunterApiKey(e.target.value)}
                  placeholder="Optional HUNTER_API_KEY"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  2. ZeroBounce API Key (Fallback Verifier)
                </label>
                <input
                  type="password"
                  value={zeroBounceApiKey}
                  onChange={(e) => setZeroBounceApiKey(e.target.value)}
                  placeholder="Optional ZEROBOUNCE_API_KEY"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  3. EmailListVerify Key (Secondary Fallback)
                </label>
                <input
                  type="password"
                  value={emailListVerifyApiKey}
                  onChange={(e) => setEmailListVerifyApiKey(e.target.value)}
                  placeholder="Optional EMAILLISTVERIFY_API_KEY"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Purchase Notice */}
      {purchaseNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold">
          {purchaseNotice}
        </div>
      )}

      {/* Company Profile Card (Shown when a search report is active) */}
      {report && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Status Banner */}
          <div
            className={`px-5 py-3 text-xs sm:text-sm font-semibold flex flex-wrap items-center justify-between gap-2 ${
              report.statusBanner === 'VERIFIED_EMAILS_FOUND'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-b border-emerald-200 dark:border-emerald-900'
                : report.statusBanner === 'NO_VERIFIED_EMAIL_FOUND'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-b border-amber-200 dark:border-amber-900'
                : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-b border-red-200 dark:border-red-900'
            }`}
          >
            <div>
              {report.statusBanner === 'WEBSITE_UNREACHABLE' && (
                <span>{WEBSITE_UNREACHABLE_MESSAGE}: {report.statusMessage}</span>
              )}
              {report.statusBanner === 'NO_VALID_EMAIL_INFRASTRUCTURE' && (
                <span>{NO_MX_MESSAGE} — No MX records exist for {report.domain || report.query}.</span>
              )}
              {report.statusBanner === 'NO_VERIFIED_EMAIL_FOUND' && (
                <span>{report.statusMessage}</span>
              )}
              {report.statusBanner === 'VERIFIED_EMAILS_FOUND' && (
                <span>{report.statusMessage}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
                Credits Charged: {report.creditsCharged} {report.creditsCharged === 0 ? '(No charge for Not Found / Cached)' : ''}
              </span>
              {report.domain && (
                <button
                  type="button"
                  onClick={() => handleSearch(undefined, report.domain, true)}
                  className="underline text-xs font-bold hover:opacity-80"
                >
                  Re-Crawl Live
                </button>
              )}
            </div>
          </div>

          {/* Accept-All Warning Banner (Anti-Hallucination Rule) */}
          {report.acceptAllWarning && (
            <div className="px-5 py-2.5 bg-amber-100/80 dark:bg-amber-950/80 border-b border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
              <span>⚠️ {ACCEPT_ALL_WARNING}</span>
            </div>
          )}

          {/* Company Profile Summary */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 border-b border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {report.companyName}
                </h3>
                {report.domain && (
                  <a
                    href={`https://${report.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 text-xs font-mono font-semibold hover:underline"
                  >
                    {report.domain} ↗
                  </a>
                )}
                {report.industry && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                    {report.industry}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {report.description || 'No public meta description published on the company homepage.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Headquarters / Address: </span>
                  <span>{report.headquarters || 'Not publicly listed on website'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Public Phone: </span>
                  <span>{report.phone || 'Not publicly listed on website'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Email Domains Detected: </span>
                  <span className="font-mono">
                    {report.emailDomainsDetected.length > 0
                      ? report.emailDomainsDetected.join(', ')
                      : 'None detected in public HTML'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Common Email Pattern: </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {report.detectedPattern || 'No personal pattern detected'}
                  </span>
                </div>
              </div>

              {/* Public Social Profiles */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-slate-500">Public Social Profiles:</span>
                {report.socialProfiles.linkedin ? (
                  <a
                    href={report.socialProfiles.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">LinkedIn: Not listed</span>
                )}
                {report.socialProfiles.twitter ? (
                  <a
                    href={report.socialProfiles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:underline"
                  >
                    Twitter/X ↗
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Twitter/X: Not listed</span>
                )}
                {report.socialProfiles.facebook ? (
                  <a
                    href={report.socialProfiles.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:underline"
                  >
                    Facebook ↗
                  </a>
                ) : null}
                {report.socialProfiles.instagram ? (
                  <a
                    href={report.socialProfiles.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-semibold hover:underline"
                  >
                    Instagram ↗
                  </a>
                ) : null}
              </div>
            </div>

            {/* Right Column: Infrastructure Quick Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                Domain &amp; Mail Infrastructure
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Website Reachable:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {report.websiteReachable ? 'Yes (HTTP 200)' : 'Unreachable'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MX Records Valid:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {report.dns.hasMx ? `Yes (${report.dns.mailProvider})` : NO_MX_MESSAGE}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accept-All Status:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {report.dns.isAcceptAll ? 'Accept-All Gateway' : 'Standard Mailbox Check'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SPF / DMARC:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  SPF: {report.dns.hasSpf ? 'Pass' : 'None'} • DMARC: {report.dns.hasDmarc ? 'Pass' : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Public Emails Found:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {report.emails.length}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs: Overview, Emails, Sources, Verification, Export, Admin */}
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 px-4">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'emails', label: `Emails (${report.emails.length})` },
                { id: 'sources', label: `Sources (${report.sources.length})` },
                { id: 'verification', label: 'Verification' },
                { id: 'export', label: `Export (${verifiedEmailsForExport.length})` },
                { id: 'admin', label: 'Admin & Credits' },
              ] as { id: ActiveTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-5 sm:p-6 space-y-5">
              {report.emails.length === 0 ? (
                <div className="p-6 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                  <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
                    {NO_VERIFIED_EMAIL_MESSAGE}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    {report.statusMessage}
                  </p>
                  <ul className="list-disc list-inside text-xs text-amber-800 dark:text-amber-300 space-y-1 pt-1">
                    <li>
                      <strong>MX Infrastructure:</strong>{' '}
                      {report.dns.hasMx
                        ? `Active (${report.dns.mxRecords.slice(0, 3).join(', ')})`
                        : NO_MX_MESSAGE}
                    </li>
                    <li>
                      <strong>Accept-All Policy:</strong>{' '}
                      {report.dns.isAcceptAll ? ACCEPT_ALL_WARNING : 'Domain is not flagged as accept-all.'}
                    </li>
                    <li>
                      <strong>Public Web Crawl:</strong> Checked {report.sources.length} official routes ({PUBLIC_CRAWL_PATHS.join(', ')}).
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Discovered Public &amp; Verified Business Contacts ({report.emails.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('emails')}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      View Full Emails Table →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.emails.slice(0, 6).map((item) => (
                      <div
                        key={item.email}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-sm text-slate-900 dark:text-white truncate">
                            {item.email}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {item.role || item.department} • Source:{' '}
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {item.sourceUrl}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {renderStatusBadge(item.statusBadge)}
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {item.confidence}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EMAILS */}
          {activeTab === 'emails' && (
            <div className="p-5 sm:p-6 space-y-4">
              {report.emails.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {NO_VERIFIED_EMAIL_MESSAGE}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                    {report.statusMessage}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[11px]">
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Status Badge</th>
                        <th className="py-3 px-3">Confidence %</th>
                        <th className="py-3 px-3">Source URL</th>
                        <th className="py-3 px-3">Verification Date</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {report.emails.map((item) => (
                        <tr key={item.email} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-3.5 px-3">
                            <div className="font-mono font-bold text-slate-900 dark:text-white">
                              {item.email}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.fullName ? `${item.fullName} • ` : ''}
                              {item.role || item.department || 'Business Contact'}
                            </div>
                          </td>
                          <td className="py-3.5 px-3">{renderStatusBadge(item.statusBadge)}</td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {item.confidence}%
                            </div>
                            {item.confidence < 70 && (
                              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                {LOW_CONFIDENCE_LABEL}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-3 max-w-xs truncate">
                            {item.sourceUrl.startsWith('http') ? (
                              <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono text-xs"
                              >
                                {item.sourceUrl} ↗
                              </a>
                            ) : (
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {item.sourceUrl}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-xs text-slate-500 whitespace-nowrap">
                            {new Date(item.checkedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(item.email)}
                              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                            >
                              {copiedEmail === item.email ? 'Copied!' : 'Copy'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOURCES */}
          {activeTab === 'sources' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Public website pages inspected under <code className="font-mono">robots.txt</code> compliance:
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[11px]">
                      <th className="py-2.5 px-3">Public Page URL</th>
                      <th className="py-2.5 px-3">HTTP Status</th>
                      <th className="py-2.5 px-3">Emails Extracted</th>
                      <th className="py-2.5 px-3">Checked Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {report.sources.map((src) => (
                      <tr key={src.url}>
                        <td className="py-2.5 px-3 font-mono text-xs">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {src.url} ↗
                          </a>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              src.status >= 200 && src.status < 300
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {src.status || 'Timeout'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold">
                          {src.emailsFoundCount > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {src.emailsFoundCount} ({src.emailsFound.join(', ')})
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-500">
                          {new Date(src.checkedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    DNS &amp; Mail Server Verification
                  </h4>
                  <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <div>
                      <strong>Domain Resolves (A Record):</strong> {report.dns.domainResolves ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <strong>MX Records Present:</strong> {report.dns.hasMx ? 'Yes' : NO_MX_MESSAGE}
                    </div>
                    <div>
                      <strong>Mail Gateway Provider:</strong> {report.dns.mailProvider}
                    </div>
                    <div>
                      <strong>SPF Policy:</strong> {report.dns.hasSpf ? 'Valid v=spf1 record' : 'No SPF record'}
                    </div>
                    <div>
                      <strong>DMARC Policy:</strong> {report.dns.hasDmarc ? 'Valid v=DMARC1 record' : 'No DMARC record'}
                    </div>
                    {report.dns.mxRecords.length > 0 && (
                      <div className="pt-1">
                        <strong>MX Hosts:</strong>
                        <ul className="list-disc list-inside font-mono text-[11px] text-slate-500 mt-1">
                          {report.dns.mxRecords.map((mx) => (
                            <li key={mx}>{mx}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Pattern &amp; Candidate Verification Status
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Detected Public Pattern:</strong>{' '}
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      {report.detectedPattern || 'None (no personal emails publicly exposed)'}
                    </span>
                  </p>
                  {report.candidateLookup ? (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                      <div>
                        <strong>Candidate Requested:</strong> {report.candidateLookup.firstName}{' '}
                        {report.candidateLookup.lastName}
                      </div>
                      <div>
                        <strong>Verification Result:</strong> {report.candidateLookup.message}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Never marks a generated candidate email as valid without third-party mailbox verification.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT (Verified Emails Only) */}
          {activeTab === 'export' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    Export Verified Business Emails Only ({verifiedEmailsForExport.length} eligible)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    In compliance with anti-hallucination rules, only verified emails are included in exports. Unverified or not-found entries are excluded.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={verifiedEmailsForExport.length === 0}
                    onClick={handleExportCsv}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition"
                  >
                    Export Verified CSV ({verifiedEmailsForExport.length})
                  </button>
                  <button
                    type="button"
                    disabled={verifiedEmailsForExport.length === 0}
                    onClick={handleExportXlsx}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition"
                  >
                    Export Verified XLSX ({verifiedEmailsForExport.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN & CREDITS */}
          {activeTab === 'admin' && (
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MONETIZATION_CONFIG.creditPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        Pay-As-You-Go Credit Pack
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {pack.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {pack.costPerCredit} • Charged only on verified email results (0 credits for Not found)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBuyCreditPack(pack)}
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                    >
                      Add {pack.credits} Credits (${pack.priceUsd})
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Recent Search &amp; Verification Audit Logs ({auditLogs.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                        <th className="py-2 px-2.5">Query</th>
                        <th className="py-2 px-2.5">Domain</th>
                        <th className="py-2 px-2.5">Status</th>
                        <th className="py-2 px-2.5">Verified Emails</th>
                        <th className="py-2 px-2.5">Credits Used</th>
                        <th className="py-2 px-2.5">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="py-2 px-2.5 font-medium">{log.query}</td>
                          <td className="py-2 px-2.5 font-mono">{log.domain || '—'}</td>
                          <td className="py-2 px-2.5">{log.verificationStatus}</td>
                          <td className="py-2 px-2.5 font-bold">{log.verifiedCount}</td>
                          <td className="py-2 px-2.5">{log.creditsUsed}</td>
                          <td className="py-2 px-2.5 text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standalone Admin & Credit Packs View when no search has been run yet */}
      {!report && activeTab === 'admin' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Admin Usage Dashboard &amp; Credit Packs ({cachedCount} Cached Domains, {totalVerifiedCached} Verified Emails)
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Close Admin View
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MONETIZATION_CONFIG.creditPacks.map((pack) => (
              <div
                key={pack.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">{pack.label}</div>
                  <div className="text-xs text-slate-500">{pack.costPerCredit} • No charge for Not Found results</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBuyCreditPack(pack)}
                  className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Add {pack.credits} Credits (${pack.priceUsd})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Compliance Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
        {COMPLIANCE_DISCLAIMER}
      </div>
    </div>
  );
};

export default EmailFinderTool;
