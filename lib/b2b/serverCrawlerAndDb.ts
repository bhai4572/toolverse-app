/**
 * Server-Side Persistent Database & Live Domain Contact Crawler
 * - Persists all discovered companies, emails, and executives in `data/email-intelligence-db.json`
 * - Serves cached records instantly when any user searches an existing company/website
 * - Crawls new websites safely (via ssrfGuard) and saves them to the database automatically
 */

import fs from 'fs';
import path from 'path';
import { safeFetch } from '@/lib/seo/audit/ssrfGuard';
import {
  CompanyIntelligenceRecord,
  ExecutiveContact,
  INITIAL_COMPANY_INTEL_DB,
  parseSearchInput,
  findCompanyInRecords,
  verifyDomainDnsViaDoH,
  extractCompanyIntelligenceFromPages,
  formatEmailFromPattern,
} from './emailIntelligenceEngine';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'email-intelligence-db.json');

export function readCompanyDatabase(): CompanyIntelligenceRecord[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_COMPANY_INTEL_DB, null, 2), 'utf8');
      return [...INITIAL_COMPANY_INTEL_DB];
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback to in-memory seed if filesystem is read-only
  }
  return [...INITIAL_COMPANY_INTEL_DB];
}

export function writeCompanyDatabase(records: CompanyIntelligenceRecord[]): void {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

/**
 * Resolve a company name (e.g. "Linear" or "Supabase") to a live domain by probing DNS DoH
 */
async function resolveCompanyNameToDomain(companyName: string): Promise<string> {
  const slug = companyName
    .trim()
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|limited|corp|corporation|co|group|technologies|technology|software|labs)\b/g, '')
    .replace(/[^a-z0-9]/g, '');

  if (!slug) return 'example.com';

  const candidates = [`${slug}.com`, `${slug}.io`, `${slug}.ai`, `${slug}.co`];
  for (const cand of candidates) {
    try {
      const res = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cand)}&type=A`,
        { headers: { Accept: 'application/dns-json' }, signal: AbortSignal.timeout(2500) }
      );
      if (res.ok) {
        const data: any = await res.json();
        if (Array.isArray(data.Answer) && data.Answer.length > 0) {
          return cand;
        }
      }
    } catch {
      // ignore and fall back to .com
    }
  }
  return `${slug}.com`;
}

/**
 * Crawl public pages of a domain (/, /about, /contact, /team) using SSRF-guarded fetch
 */
async function crawlPublicCompanyPages(domain: string): Promise<{ url: string; html: string }[]> {
  const cleanDomain = domain.toLowerCase().replace(/^www\./, '');
  const pathsToTry = ['/', '/about', '/contact', '/about-us', '/contact-us', '/team'];
  const results: { url: string; html: string }[] = [];

  // Fetch homepage first
  const baseUrls = [`https://${cleanDomain}`, `https://www.${cleanDomain}`];
  let workingOrigin = `https://${cleanDomain}`;

  for (const startUrl of baseUrls) {
    try {
      const res = await safeFetch(startUrl, { timeoutMs: 5500, maxBytes: 1.5 * 1024 * 1024 });
      if (res.statusCode >= 200 && res.statusCode < 400 && res.bodyText) {
        results.push({ url: res.finalUrl || startUrl, html: res.bodyText });
        try {
          workingOrigin = new URL(res.finalUrl || startUrl).origin;
        } catch {
          // keep default
        }
        break;
      }
    } catch {
      // try next base url
    }
  }

  // Fetch up to 3 subpages in parallel
  const subUrls = pathsToTry.slice(1, 4).map((p) => `${workingOrigin}${p}`);
  await Promise.all(
    subUrls.map(async (u) => {
      try {
        const r = await safeFetch(u, { timeoutMs: 4500, maxBytes: 1024 * 1024 });
        if (r.statusCode >= 200 && r.statusCode < 300 && r.bodyText) {
          results.push({ url: r.finalUrl || u, html: r.bodyText });
        }
      } catch {
        // ignore missing subpages
      }
    })
  );

  return results;
}

/**
 * Primary Lookup-or-Crawl Handler:
 * 1. Checks persistent DB first. If found (and not forceRefresh), returns immediately.
 * 2. Otherwise resolves domain, checks DNS MX/SPF/DMARC, crawls public pages,
 *    extracts emails & executives, saves into DB, and returns the saved record.
 */
export async function lookupOrCrawlCompany(
  rawQuery: string,
  options: { forceRefresh?: boolean } = {}
): Promise<{
  record: CompanyIntelligenceRecord;
  totalSavedCompanies: number;
}> {
  const db = readCompanyDatabase();
  const existing = findCompanyInRecords(rawQuery, db);

  if (existing && !options.forceRefresh) {
    existing.searchCount = (existing.searchCount || 1) + 1;
    existing.updatedAt = new Date().toISOString().split('T')[0];
    writeCompanyDatabase(db);
    return {
      record: { ...existing, cacheStatus: 'DATABASE_HIT' },
      totalSavedCompanies: db.length,
    };
  }

  const parsed = parseSearchInput(rawQuery);
  const targetDomain =
    parsed.mode === 'domain' && parsed.cleanDomain
      ? parsed.cleanDomain
      : existing?.domain || (await resolveCompanyNameToDomain(parsed.cleanQuery));

  const [dns, pages] = await Promise.all([
    verifyDomainDnsViaDoH(targetDomain),
    crawlPublicCompanyPages(targetDomain),
  ]);

  const extracted = extractCompanyIntelligenceFromPages(targetDomain, pages, dns);

  // If user searched by company name and title wasn't found on HTML, preserve user's company name capitalization
  if (parsed.mode === 'company_name' && pages.length === 0) {
    extracted.companyName = parsed.cleanQuery
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // Merge with any existing curated executives if refreshing an existing company
  if (existing) {
    const existingExecNames = new Set(extracted.executives.map((e) => e.name.toLowerCase()));
    for (const ex of existing.executives) {
      if (!existingExecNames.has(ex.name.toLowerCase())) {
        extracted.executives.push(ex);
      }
    }
    const existingEmailSet = new Set(extracted.emails.map((e) => e.email.toLowerCase()));
    for (const em of existing.emails) {
      if (!existingEmailSet.has(em.email.toLowerCase())) {
        extracted.emails.push(em);
      }
    }
    extracted.industry = existing.industry || extracted.industry;
    extracted.headquarters = existing.headquarters || extracted.headquarters;
    extracted.foundedYear = existing.foundedYear || extracted.foundedYear;
    extracted.companySize = existing.companySize || extracted.companySize;
    extracted.searchCount = (existing.searchCount || 1) + 1;
  }

  extracted.cacheStatus = 'LIVE_CRAWL_SAVED';

  const existingIdx = db.findIndex((r) => r.domain.toLowerCase() === extracted.domain.toLowerCase());
  if (existingIdx !== -1) {
    db[existingIdx] = extracted;
  } else {
    db.unshift(extracted);
  }
  writeCompanyDatabase(db);

  return {
    record: extracted,
    totalSavedCompanies: db.length,
  };
}

/**
 * Add & Persist a Custom / Discovered Executive Contact to a Company Record in DB
 */
export function addExecutiveToCompanyDb(
  domain: string,
  input: { firstName: string; lastName: string; role: string; department?: ExecutiveContact['department'] }
): CompanyIntelligenceRecord | null {
  const db = readCompanyDatabase();
  const target = db.find((r) => r.domain.toLowerCase() === domain.toLowerCase());
  if (!target) return null;

  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
  const email = formatEmailFromPattern(
    input.firstName,
    input.lastName,
    target.domain,
    target.emailPattern
  );
  const dept = input.department || 'Executive / C-Suite';

  const newExec: ExecutiveContact = {
    id: `${target.domain}-exec-${Date.now()}`,
    name: fullName,
    role: input.role.trim() || 'Executive Decision Maker',
    seniority: /CEO|CFO|CTO|COO|CMO|Chief/i.test(input.role) ? 'C-Suite' : 'VP / Director',
    department: dept,
    email,
    confidence: target.dns.mxValid ? 94 : 85,
    source: 'Domain Pattern Match',
    sourceUrl: target.websiteUrl,
  };

  if (!target.executives.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
    target.executives.unshift(newExec);
  }

  if (!target.emails.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
    target.emails.unshift({
      email,
      type: 'personal',
      department: dept,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      position: input.role.trim(),
      confidence: newExec.confidence,
      mxVerified: target.dns.mxValid,
      source: 'Domain Pattern Match',
      foundOnUrl: target.websiteUrl,
    });
  }

  target.updatedAt = new Date().toISOString().split('T')[0];
  writeCompanyDatabase(db);
  return target;
}

