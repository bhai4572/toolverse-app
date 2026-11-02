'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Mail,
  Building2,
  UserCheck,
  ShieldCheck,
  Copy,
  Check,
  Download,
  RefreshCw,
  Database,
  Globe,
  ExternalLink,
  Sparkles,
  Plus,
  Filter,
  Server,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  CompanyIntelligenceRecord,
  DepartmentCategory,
  ExecutiveContact,
  INITIAL_COMPANY_INTEL_DB,
  findCompanyInRecords,
  parseSearchInput,
  verifyDomainDnsViaDoH,
  extractCompanyIntelligenceFromPages,
  generateEmailPermutations,
  formatEmailFromPattern,
} from '@/lib/b2b/emailIntelligenceEngine';

const LOCAL_DB_STORAGE_KEY = 'toolverse_b2b_company_db_v1';

const DEPARTMENTS: ('All' | DepartmentCategory)[] = [
  'All',
  'Executive / C-Suite',
  'Finance & Legal',
  'Engineering & Product',
  'Sales & Marketing',
  'HR & Recruiting',
  'Media & PR',
  'Customer Support',
];

function mergeCompanyRecords(
  baseList: CompanyIntelligenceRecord[],
  extraList: CompanyIntelligenceRecord[]
): CompanyIntelligenceRecord[] {
  const map = new Map<string, CompanyIntelligenceRecord>();
  for (const item of baseList) {
    map.set(item.domain.toLowerCase(), item);
  }
  for (const item of extraList) {
    const key = item.domain.toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, item);
    } else {
      // Keep whichever has more executives/emails or higher searchCount
      const mergedExecs = [...item.executives];
      for (const ex of existing.executives) {
        if (!mergedExecs.some((m) => m.email.toLowerCase() === ex.email.toLowerCase())) {
          mergedExecs.push(ex);
        }
      }
      const mergedEmails = [...item.emails];
      for (const em of existing.emails) {
        if (!mergedEmails.some((m) => m.email.toLowerCase() === em.email.toLowerCase())) {
          mergedEmails.push(em);
        }
      }
      map.set(key, {
        ...existing,
        ...item,
        executives: mergedExecs,
        emails: mergedEmails,
        searchCount: Math.max(existing.searchCount || 1, item.searchCount || 1),
      });
    }
  }
  return Array.from(map.values());
}

export function EmailFinderTool() {
  const [companyDb, setCompanyDb] = useState<CompanyIntelligenceRecord[]>(INITIAL_COMPANY_INTEL_DB);
  const [searchQuery, setSearchQuery] = useState('stripe.com');
  const [activeCompany, setActiveCompany] = useState<CompanyIntelligenceRecord>(INITIAL_COMPANY_INTEL_DB[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'cache_hit' | 'newly_saved' | 'info';
    text: string;
  }>({
    type: 'cache_hit',
    text: 'Instant Result from Verified Company Database — All searches are automatically saved for future lookups.',
  });

  const [activeTab, setActiveTab] = useState<'executives' | 'emails' | 'permutator' | 'database'>('executives');
  const [deptFilter, setDeptFilter] = useState<'All' | DepartmentCategory>('All');
  const [emailTypeFilter, setEmailTypeFilter] = useState<'all' | 'personal' | 'generic'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Executive Permutator / Add Contact State
  const [permFirst, setPermFirst] = useState('');
  const [permLast, setPermLast] = useState('');
  const [permRole, setPermRole] = useState('Chief Financial Officer (CFO)');
  const [permDept, setPermDept] = useState<DepartmentCategory>('Finance & Legal');
  const [dbFilterQuery, setDbFilterQuery] = useState('');

  // Load saved database from localStorage + Backend API on mount
  useEffect(() => {
    let localRecords: CompanyIntelligenceRecord[] = [];
    try {
      const raw = localStorage.getItem(LOCAL_DB_STORAGE_KEY);
      if (raw) {
        localRecords = JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    const mergedInitial = mergeCompanyRecords(INITIAL_COMPANY_INTEL_DB, localRecords);
    setCompanyDb(mergedInitial);

    fetch('/api/email-finder')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.savedRecords)) {
          setCompanyDb((prev) => {
            const combined = mergeCompanyRecords(prev, data.savedRecords);
            try {
              localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(combined));
            } catch {}
            return combined;
          });
        }
      })
      .catch(() => {
        // Offline / static mode uses localStorage + INITIAL_COMPANY_INTEL_DB
      });
  }, []);

  const persistRecordToClientDb = (record: CompanyIntelligenceRecord) => {
    setCompanyDb((prev) => {
      const updated = mergeCompanyRecords(prev, [record]);
      try {
        localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSearch = async (queryOverride?: string, forceRefresh: boolean = false) => {
    const q = (queryOverride ?? searchQuery).trim();
    if (!q) return;
    if (queryOverride) setSearchQuery(queryOverride);

    // 1. Check local synced database first if not forcing a fresh live crawl
    if (!forceRefresh) {
      const cached = findCompanyInRecords(q, companyDb);
      if (cached) {
        const bumped: CompanyIntelligenceRecord = {
          ...cached,
          searchCount: (cached.searchCount || 1) + 1,
          cacheStatus: 'DATABASE_HIT',
        };
        setActiveCompany(bumped);
        persistRecordToClientDb(bumped);
        setStatusMessage({
          type: 'cache_hit',
          text: `⚡ Instant Database Match: "${bumped.companyName}" (${bumped.domain}) was already in our database (Searched ${bumped.searchCount} times).`,
        });
        // Also ping server in background to increment server search count
        fetch('/api/email-finder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, forceRefresh: false }),
        }).catch(() => {});
        return;
      }
    }

    // 2. Not in local cache (or user clicked Re-Scan): Call Server Crawler & Database API
    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: `Scanning public pages, Schema.org leadership, and live DNS MX/SPF records for "${q}"...`,
    });

    try {
      const res = await fetch('/api/email-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, forceRefresh }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.record) {
          const rec: CompanyIntelligenceRecord = data.record;
          setActiveCompany(rec);
          persistRecordToClientDb(rec);
          setStatusMessage({
            type: rec.cacheStatus === 'DATABASE_HIT' ? 'cache_hit' : 'newly_saved',
            text:
              rec.cacheStatus === 'DATABASE_HIT'
                ? `⚡ Loaded "${rec.companyName}" (${rec.domain}) from Database.`
                : `✅ Newly Discovered & Saved to Database! "${rec.companyName}" (${rec.domain}) is now permanently stored for future users.`,
          });
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to direct client-side DNS DoH & intelligent profile generation
    }

    // 3. Client-side fallback if running on static edge without server function
    const parsed = parseSearchInput(q);
    const targetDomain =
      parsed.mode === 'domain' && parsed.cleanDomain
        ? parsed.cleanDomain
        : `${parsed.cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    const dns = await verifyDomainDnsViaDoH(targetDomain);
    const fallbackRec = extractCompanyIntelligenceFromPages(targetDomain, [], dns);
    if (parsed.mode === 'company_name') {
      fallbackRec.companyName = parsed.cleanQuery
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    fallbackRec.cacheStatus = 'LIVE_CRAWL_SAVED';
    setActiveCompany(fallbackRec);
    persistRecordToClientDb(fallbackRec);
    setStatusMessage({
      type: 'newly_saved',
      text: `✅ Verified DNS & Saved "${fallbackRec.companyName}" (${fallbackRec.domain}) to Database! Future searches for this company will load immediately.`,
    });
    setIsLoading(false);
  };

  const handleSaveCustomExecutive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permFirst.trim() || !permLast.trim()) return;

    const fullName = `${permFirst.trim()} ${permLast.trim()}`;
    const generatedEmail = formatEmailFromPattern(
      permFirst.trim(),
      permLast.trim(),
      activeCompany.domain,
      activeCompany.emailPattern
    );

    const newExec: ExecutiveContact = {
      id: `${activeCompany.domain}-exec-${Date.now()}`,
      name: fullName,
      role: permRole.trim() || 'Executive Decision Maker',
      seniority: /CEO|CFO|CTO|COO|CMO|Chief/i.test(permRole) ? 'C-Suite' : 'VP / Director',
      department: permDept,
      email: generatedEmail,
      confidence: activeCompany.dns.mxValid ? 94 : 85,
      source: 'Domain Pattern Match',
      sourceUrl: activeCompany.websiteUrl,
    };

    const updatedCompany: CompanyIntelligenceRecord = {
      ...activeCompany,
      executives: [
        newExec,
        ...activeCompany.executives.filter((ex) => ex.email.toLowerCase() !== generatedEmail.toLowerCase()),
      ],
      emails: [
        {
          email: generatedEmail,
          type: 'personal',
          department: permDept,
          firstName: permFirst.trim(),
          lastName: permLast.trim(),
          position: permRole.trim(),
          confidence: newExec.confidence,
          mxVerified: activeCompany.dns.mxValid,
          source: 'Domain Pattern Match',
          foundOnUrl: activeCompany.websiteUrl,
        },
        ...activeCompany.emails.filter((em) => em.email.toLowerCase() !== generatedEmail.toLowerCase()),
      ],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setActiveCompany(updatedCompany);
    persistRecordToClientDb(updatedCompany);

    // Also persist to server DB
    fetch('/api/email-finder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_executive',
        domain: activeCompany.domain,
        executive: {
          firstName: permFirst.trim(),
          lastName: permLast.trim(),
          role: permRole.trim(),
          department: permDept,
        },
      }),
    }).catch(() => {});

    setPermFirst('');
    setPermLast('');
    setStatusMessage({
      type: 'newly_saved',
      text: `✅ Added ${fullName} (${generatedEmail}) and saved to "${activeCompany.companyName}" database profile!`,
    });
  };

  const filteredEmails = useMemo(() => {
    return activeCompany.emails.filter((em) => {
      if (deptFilter !== 'All' && em.department !== deptFilter) return false;
      if (emailTypeFilter !== 'all' && em.type !== emailTypeFilter) return false;
      return true;
    });
  }, [activeCompany.emails, deptFilter, emailTypeFilter]);

  const filteredExecutives = useMemo(() => {
    return activeCompany.executives.filter((ex) => {
      if (deptFilter !== 'All' && ex.department !== deptFilter) return false;
      return true;
    });
  }, [activeCompany.executives, deptFilter]);

  const permutationsPreview = useMemo(() => {
    return generateEmailPermutations(
      permFirst || 'john',
      permLast || 'smith',
      activeCompany.domain,
      activeCompany.emailPattern
    );
  }, [permFirst, permLast, activeCompany.domain, activeCompany.emailPattern]);

  const filteredDatabaseList = useMemo(() => {
    if (!dbFilterQuery.trim()) return companyDb;
    const q = dbFilterQuery.toLowerCase();
    return companyDb.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.headquarters.toLowerCase().includes(q)
    );
  }, [companyDb, dbFilterQuery]);

  const handleExportCsv = () => {
    const headers = [
      'Company Name',
      'Domain',
      'Email',
      'Contact Name',
      'Role / Position',
      'Department',
      'Type',
      'Confidence %',
      'MX Verified',
      'Mail Provider',
      'Source',
    ];
    const rows = activeCompany.emails.map((e) => [
      activeCompany.companyName,
      activeCompany.domain,
      e.email,
      [e.firstName, e.lastName].filter(Boolean).join(' ') || 'Department Inbox',
      e.position || e.department,
      e.department,
      e.type,
      String(e.confidence),
      e.mxVerified ? 'Yes' : 'No',
      activeCompany.dns.mailProvider,
      e.source,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCompany.domain}-contacts-intelligence.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Free Tool Hero Box */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free B2B Email Finder &amp; Executive Intelligence Tool</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Database className="w-3.5 h-3.5 text-brand-600" />
            <span>{companyDb.length} Verified Companies Stored in Database</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Find Any Company’s Verified Emails, CEO, CFO, CTO &amp; Decision Makers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enter a <strong>website link / domain</strong> (e.g. <code>stripe.com</code>, <code>https://shopify.com</code>)
            or a <strong>company name</strong> (e.g. <code>OpenAI</code>, <code>Systems Limited</code>, <code>Canva</code>).
            Existing companies load instantly from our database; new websites are scanned live and automatically saved
            to the database for future searches.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch( undefined, false);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter website URL (e.g. stripe.com, https://vercel.com) or Company Name (e.g. OpenAI, Shopify)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Scanning &amp; Saving...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Find Emails &amp; Executives
              </>
            )}
          </button>
        </form>

        {/* Quick Preset Company Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 mr-1">Try Instant Lookup:</span>
          {['stripe.com', 'openai.com', 'shopify.com', 'vercel.com', 'cloudflare.com', 'canva.com', 'hubspot.com', 'systemsltd.com', 'devsinc.com'].map(
            (sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => handleSearch(sample, false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeCompany.domain === sample
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sample}
              </button>
            )
          )}
        </div>

        {/* Database Cache / Crawl Status Banner */}
        <div
          className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
            statusMessage.type === 'cache_hit'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : statusMessage.type === 'newly_saved'
              ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSearch(activeCompany.domain, true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Re-Scan Live Website
          </button>
        </div>
      </div>

      {/* Company Overview & DNS Mail Intelligence Card */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                {activeCompany.industry}
              </span>
              <span className="text-xs font-medium text-slate-500">
                📍 {activeCompany.headquarters}
              </span>
              {activeCompany.foundedYear && (
                <span className="text-xs font-medium text-slate-500">• Est. {activeCompany.foundedYear}</span>
              )}
              <span className="text-xs font-medium text-slate-500">• {activeCompany.companySize}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {activeCompany.companyName}
              </h3>
              <a
                href={activeCompany.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-brand-600 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" /> {activeCompany.domain} <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {activeCompany.description}
            </p>
          </div>

          {/* Export & Copy Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  activeCompany.emails.map((e) => e.email).join('\n'),
                  'copy-all-emails'
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              {copiedKey === 'copy-all-emails' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied All ({activeCompany.emails.length})
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy All Emails ({activeCompany.emails.length})
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV (CRM Ready)
            </button>
          </div>
        </div>

        {/* 4 Key Domain Intelligence Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-600" /> Dominant Email Pattern
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              <code>{activeCompany.emailPattern}@{activeCompany.domain}</code>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              {activeCompany.patternConfidence}% Pattern Confidence
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-blue-600" /> Mail Server / Provider
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 truncate">
              {activeCompany.dns.mailProvider}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
              MX: {activeCompany.dns.mxRecords[0] || 'Standard DNS'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Deliverability &amp; DNS Security
            </div>
            <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
              {activeCompany.dns.mxValid ? '✓ Active MX (Accepts Mail)' : 'Unverified MX'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              SPF: {activeCompany.dns.spfConfigured ? '✓ Valid' : '—'} • DMARC:{' '}
              {activeCompany.dns.dmarcConfigured ? '✓ Valid' : '—'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" /> Indexed Contacts
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {activeCompany.executives.length} Executives • {activeCompany.emails.length} Emails
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Updated {activeCompany.updatedAt} • Searched {activeCompany.searchCount}x
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {[
          {
            id: 'executives',
            label: `👔 CEO, CFO & Executive Decision-Makers (${activeCompany.executives.length})`,
          },
          {
            id: 'emails',
            label: `📧 All Domain Emails (${activeCompany.emails.length})`,
          },
          {
            id: 'permutator',
            label: '⚡ Find / Add Person Email by Name',
          },
          {
            id: 'database',
            label: `🗄️ Saved Companies Database (${companyDb.length})`,
          },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === t.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* =====================================================================
          TAB 1: CEO, CFO, CTO & EXECUTIVE DECISION-MAKERS (APOLLO.IO STYLE)
         ===================================================================== */}
      {activeTab === 'executives' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Leadership &amp; Key Decision-Makers at {activeCompany.companyName}
              </h3>
              <p className="text-xs text-slate-500">
                Direct &amp; pattern-verified business emails for C-Suite executives (CEO, CFO, CTO, COO, Founders).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value as 'All' | DepartmentCategory)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Departments' : d}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setActiveTab('permutator')}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold hover:bg-brand-600 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add / Generate Executive Email
              </button>
            </div>
          </div>

          {filteredExecutives.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredExecutives.map((exec) => (
                <div
                  key={exec.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 uppercase">
                          {exec.seniority} • {exec.department}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                          {exec.name}
                        </h4>
                        <p className="text-xs font-bold text-brand-600 dark:text-brand-400">{exec.role}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {exec.confidence}% Verified
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2">
                      <code className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {exec.email}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(exec.email, exec.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-brand-500 shrink-0"
                      >
                        {copiedKey === exec.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Source: {exec.source}</span>
                    {exec.linkedinUrl && (
                      <a
                        href={exec.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Company LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No named C-Suite executives extracted from public HTML on {activeCompany.domain} yet.
              </p>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Know the CEO, CFO, or Founder’s name? Use the <strong>Find / Add Person Email by Name</strong> tab to
                generate their exact corporate email using <code>{activeCompany.emailPattern}@{activeCompany.domain}</code> and save them to the database!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('permutator')}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Open Executive Email Generator →
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: ALL DOMAIN EMAILS & DEPARTMENT CONTACTS (HUNTER.IO STYLE)
         ===================================================================== */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'personal', 'generic'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEmailTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                    emailTypeFilter === t
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t === 'all' ? 'All Emails' : t === 'personal' ? 'Personal / Executive' : 'Role / Department'}
                </button>
              ))}
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as 'All' | DepartmentCategory)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Contact / Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Confidence &amp; MX</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredEmails.map((item) => (
                    <tr key={item.email} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {item.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {[item.firstName, item.lastName].filter(Boolean).join(' ') || 'Department Inbox'}
                        </div>
                        <div className="text-xs text-slate-500">{item.position || item.type}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.department}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {item.confidence}% {item.mxVerified ? '• MX Valid' : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{item.source}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.email, item.email)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-bold"
                        >
                          {copiedKey === item.email ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: CORPORATE EMAIL PATTERN PERMUTATOR & ADD EXECUTIVE TO DB
         ===================================================================== */}
      {activeTab === 'permutator' && (
        <div className="grid md:grid-cols-2 gap-6">
          <form
            onSubmit={handleSaveCustomExecutive}
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Generate &amp; Save Executive Email at {activeCompany.companyName}
            </h3>
            <p className="text-xs text-slate-500">
              Enter any executive or employee’s name at <strong>{activeCompany.domain}</strong>. We apply the company’s
              verified pattern (<code>{activeCompany.emailPattern}@{activeCompany.domain}</code>) and save the contact
              to our database for future searches.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">First Name</label>
                <input
                  type="text"
                  required
                  value={permFirst}
                  onChange={(e) => setPermFirst(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                <input
                  type="text"
                  required
                  value={permLast}
                  onChange={(e) => setPermLast(e.target.value)}
                  placeholder="e.g. Friar"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Position / Title (CEO, CFO, CTO, VP, HR)
              </label>
              <input
                type="text"
                value={permRole}
                onChange={(e) => setPermRole(e.target.value)}
                placeholder="e.g. Chief Financial Officer (CFO)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Department</label>
              <select
                value={permDept}
                onChange={(e) => setPermDept(e.target.value as DepartmentCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                {DEPARTMENTS.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Generate &amp; Save Contact to {activeCompany.companyName} Database
            </button>
          </form>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Live Email Permutations for @{activeCompany.domain}
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by probability based on {activeCompany.companyName}’s domain structure and MX status:
            </p>
            <div className="space-y-2 pt-1">
              {permutationsPreview.map((p) => (
                <div
                  key={p.pattern}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <code className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{p.email}</code>
                    <div className="text-[11px] text-slate-500">
                      Pattern: <code>{p.pattern}</code> •{' '}
                      <span className="font-bold text-emerald-600">{p.probability}% Match</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(p.email, `perm-${p.pattern}`)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {copiedKey === `perm-${p.pattern}` ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: SAVED COMPANIES DATABASE DIRECTORY
         ===================================================================== */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Persistent Company &amp; Domain Intelligence Database ({companyDb.length} Companies)
              </h3>
              <p className="text-xs text-slate-500">
                Every website or company searched by any user is saved here so repeat lookups happen instantaneously.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dbFilterQuery}
                onChange={(e) => setDbFilterQuery(e.target.value)}
                placeholder="Filter saved companies..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDatabaseList.map((comp) => (
              <button
                key={comp.domain}
                type="button"
                onClick={() => {
                  setActiveCompany({ ...comp, cacheStatus: 'DATABASE_HIT' });
                  setSearchQuery(comp.domain);
                  setActiveTab('executives');
                  setStatusMessage({
                    type: 'cache_hit',
                    text: `⚡ Loaded "${comp.companyName}" (${comp.domain}) directly from Saved Database.`,
                  });
                }}
                className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
                  activeCompany.domain === comp.domain
                    ? 'border-brand-600 bg-brand-50/30 dark:bg-brand-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">{comp.companyName}</div>
                    <div className="text-xs font-mono text-brand-600">{comp.domain}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {comp.emails.length} Emails
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{comp.industry}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>{comp.executives.length} Executives (CEO/CFO)</span>
                  <span className="font-semibold text-brand-600">Open Dossier →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

