import { describe, it, expect } from 'vitest';
import {
  parseSearchInput,
  formatEmailFromPattern,
  generateEmailPermutations,
  extractCompanyIntelligenceFromPages,
  findCompanyInRecords,
  INITIAL_COMPANY_INTEL_DB,
} from '../lib/b2b/emailIntelligenceEngine';
import {
  lookupOrCrawlCompany,
  addExecutiveToCompanyDb,
  readCompanyDatabase,
} from '../lib/b2b/serverCrawlerAndDb';
import { getToolBySlug } from '../lib/tools/registry';

describe('B2B Email Finder & Company Executive Intelligence Engine', () => {
  it('registers b2b-email-finder and resolves email-scraper / email-finder aliases', () => {
    const main = getToolBySlug('b2b-email-finder');
    const alias1 = getToolBySlug('email-scraper');
    const alias2 = getToolBySlug('email-finder');

    expect(main).toBeDefined();
    expect(main?.status).toBe('live');
    expect(alias1?.slug).toBe('b2b-email-finder');
    expect(alias2?.slug).toBe('b2b-email-finder');
  });

  it('parses domain URLs, email addresses, and company names accurately', () => {
    expect(parseSearchInput('https://www.stripe.com/pricing')).toEqual({
      mode: 'domain',
      cleanDomain: 'stripe.com',
      cleanQuery: 'stripe.com',
    });
    expect(parseSearchInput('OpenAI')).toEqual({
      mode: 'company_name',
      cleanQuery: 'OpenAI',
    });
    expect(parseSearchInput('patrick@stripe.com')).toEqual({
      mode: 'domain',
      cleanDomain: 'stripe.com',
      cleanQuery: 'stripe.com',
    });
  });

  it('finds existing companies in database by either domain or company name', () => {
    const byDomain = findCompanyInRecords('https://stripe.com', INITIAL_COMPANY_INTEL_DB);
    const byName = findCompanyInRecords('Systems Limited', INITIAL_COMPANY_INTEL_DB);
    const byName2 = findCompanyInRecords('OpenAI', INITIAL_COMPANY_INTEL_DB);

    expect(byDomain?.companyName).toBe('Stripe');
    expect(byDomain?.executives.some((e) => e.role.includes('CEO'))).toBe(true);
    expect(byDomain?.executives.some((e) => e.role.includes('CFO'))).toBe(true);

    expect(byName?.domain).toBe('systemsltd.com');
    expect(byName2?.domain).toBe('openai.com');
  });

  it('extracts public emails, CEO/CFO executives, and JSON-LD leadership from HTML', () => {
    const sampleHtml = `
      <html>
        <head>
          <title>AcmeCloud — Enterprise Cloud Infrastructure</title>
          <meta name="description" content="AcmeCloud builds cloud tools for global teams." />
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AcmeCloud",
              "email": "press@acmecloud.io",
              "founder": [
                { "@type": "Person", "name": "Elena Vance", "jobTitle": "CEO & Co-Founder" },
                { "@type": "Person", "name": "Marcus Sterling", "jobTitle": "Chief Financial Officer (CFO)" }
              ]
            }
          </script>
        </head>
        <body>
          <p>Contact our team at <a href="mailto:elena.vance@acmecloud.io">elena.vance@acmecloud.io</a> or sales@acmecloud.io</p>
        </body>
      </html>
    `;

    const record = extractCompanyIntelligenceFromPages(
      'acmecloud.io',
      [{ url: 'https://acmecloud.io', html: sampleHtml }],
      {
        mxValid: true,
        mxRecords: ['aspmx.l.google.com'],
        mailProvider: 'Google Workspace (Gmail Enterprise)',
        spfConfigured: true,
        dmarcConfigured: true,
        acceptsMail: true,
      }
    );

    expect(record.companyName).toBe('AcmeCloud');
    expect(record.emailPattern).toBe('{first}.{last}');
    expect(record.executives.length).toBeGreaterThanOrEqual(2);
    expect(record.executives.some((e) => e.name === 'Elena Vance' && e.role.includes('CEO'))).toBe(true);
    expect(record.executives.some((e) => e.name === 'Marcus Sterling' && e.role.includes('CFO'))).toBe(true);
    expect(record.emails.some((e) => e.email === 'elena.vance@acmecloud.io')).toBe(true);
    expect(record.emails.some((e) => e.email === 'press@acmecloud.io')).toBe(true);
  });

  it('saves newly searched companies to the persistent database and serves them from cache on repeat lookup', async () => {
    const testDomain = 'nexustech-demo-b2b.io';

    // First lookup: crawls & saves to database
    const first = await lookupOrCrawlCompany(testDomain, { forceRefresh: true });
    expect(first.record.domain).toBe(testDomain);
    expect(first.record.cacheStatus).toBe('LIVE_CRAWL_SAVED');

    // Second lookup by another user: must hit the saved database immediately
    const second = await lookupOrCrawlCompany(testDomain, { forceRefresh: false });
    expect(second.record.domain).toBe(testDomain);
    expect(second.record.cacheStatus).toBe('DATABASE_HIT');
    expect(second.record.searchCount).toBeGreaterThanOrEqual(2);

    // Add an executive (e.g. CFO) and verify it persists in the database
    const updated = addExecutiveToCompanyDb(testDomain, {
      firstName: 'Tariq',
      lastName: 'Mehmood',
      role: 'Chief Financial Officer (CFO)',
      department: 'Finance & Legal',
    });
    expect(updated).not.toBeNull();
    expect(updated?.executives.some((e) => e.email === `tariq.mehmood@${testDomain}`)).toBe(true);

    const dbNow = readCompanyDatabase();
    expect(dbNow.some((r) => r.domain === testDomain)).toBe(true);
  });

  it('generates ranked corporate email permutations', () => {
    const perms = generateEmailPermutations('John', 'Collison', 'stripe.com', '{first}');
    expect(perms[0].email).toBe('john@stripe.com');
    expect(perms[0].probability).toBe(96);
    expect(perms.some((p) => p.email === 'john.collison@stripe.com')).toBe(true);
  });
});

