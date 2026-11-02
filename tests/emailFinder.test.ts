import { describe, it, expect } from 'vitest';
import {
  ACCEPT_ALL_WARNING,
  COMPLIANCE_DISCLAIMER,
  LOW_CONFIDENCE_LABEL,
  MONETIZATION_CONFIG,
  NO_MX_MESSAGE,
  NO_VERIFIED_EMAIL_MESSAGE,
  PUBLIC_CRAWL_PATHS,
  WEBSITE_UNREACHABLE_MESSAGE,
  computeEmailConfidence,
  detectEmailPatternFromPublicEmails,
  generateCandidateFromPattern,
  isValidExtractedBusinessEmail,
  mapStatusToBadge,
  normalizeCompanyOrDomainInput,
} from '../lib/b2b/emailIntelligenceEngine';

describe('Policy-Compliant Zero-Hallucination B2B Email Finder Engine', () => {
  it('crawls all 12 required public website paths', () => {
    expect(PUBLIC_CRAWL_PATHS).toEqual([
      '/',
      '/contact',
      '/contact-us',
      '/about',
      '/about-us',
      '/team',
      '/people',
      '/staff',
      '/support',
      '/careers',
      '/privacy',
      '/terms',
    ]);
  });

  it('normalizes company names and domains while rejecting invalid TLDs', () => {
    const d1 = normalizeCompanyOrDomainInput('https://www.intercom.com/pricing?ref=nav');
    expect(d1.isDomainInput).toBe(true);
    expect(d1.normalizedDomain).toBe('intercom.com');

    const c1 = normalizeCompanyOrDomainInput('Intercom');
    expect(c1.isDomainInput).toBe(false);
    expect(c1.normalizedDomain).toBe('intercom.com');

    const bad = normalizeCompanyOrDomainInput('company.invalid');
    expect(bad.normalizedDomain).toBeNull();
    expect(bad.error).toBeDefined();
  });

  it('never invents an email pattern from generic role emails (contact@, finance@, careers@)', () => {
    const res = detectEmailPatternFromPublicEmails(
      [
        { email: 'contact@acme.com' },
        { email: 'finance@acme.com' },
        { email: 'careers@acme.com' },
        { email: 'support@acme.com' },
      ],
      'acme.com'
    );
    expect(res.patternType).toBeNull();
    expect(res.formattedPattern).toBeNull();

    // Candidate generation must return null when no pattern is detected
    const candidate = generateCandidateFromPattern('Jane', 'Doe', 'acme.com', res.patternType);
    expect(candidate).toBeNull();
  });

  it('detects all 6 supported personal email patterns when real personal emails exist', () => {
    const firstDotLast = detectEmailPatternFromPublicEmails(
      [{ email: 'sarah.connor@acme.com', firstName: 'Sarah', lastName: 'Connor' }],
      'acme.com'
    );
    expect(firstDotLast.patternType).toBe('{first}.{last}');
    expect(firstDotLast.formattedPattern).toBe('{first}.{last}@acme.com');
    expect(generateCandidateFromPattern('John', 'Smith', 'acme.com', firstDotLast.patternType)).toBe(
      'john.smith@acme.com'
    );

    const fDotLast = detectEmailPatternFromPublicEmails(
      [{ email: 's.connor@acme.com', firstName: 'Sarah', lastName: 'Connor' }],
      'acme.com'
    );
    expect(fDotLast.patternType).toBe('{f}.{last}');
    expect(generateCandidateFromPattern('John', 'Smith', 'acme.com', fDotLast.patternType)).toBe(
      'j.smith@acme.com'
    );

    const firstUnderscoreLast = detectEmailPatternFromPublicEmails(
      [{ email: 'sarah_connor@acme.com', firstName: 'Sarah', lastName: 'Connor' }],
      'acme.com'
    );
    expect(firstUnderscoreLast.patternType).toBe('{first}_{last}');
    expect(generateCandidateFromPattern('John', 'Smith', 'acme.com', firstUnderscoreLast.patternType)).toBe(
      'john_smith@acme.com'
    );
  });

  it('enforces anti-hallucination confidence labels (<70%) and status badges', () => {
    const acceptAllScore = computeEmailConfidence({
      hasPublicSourceUrl: true,
      foundInMailtoOrSchema: true,
      providerVerifiedStatus: 'accept_all',
      hasMx: true,
      hasSpf: true,
      hasDmarc: true,
      isAcceptAll: true,
    });
    expect(acceptAllScore.confidence).toBeLessThan(70);
    expect(acceptAllScore.lowConfidenceWarning).toBe(LOW_CONFIDENCE_LABEL);

    const verifiedScore = computeEmailConfidence({
      hasPublicSourceUrl: true,
      foundInMailtoOrSchema: true,
      providerVerifiedStatus: 'valid',
      hasMx: true,
      hasSpf: true,
      hasDmarc: true,
      isAcceptAll: false,
    });
    expect(verifiedScore.confidence).toBeGreaterThanOrEqual(90);
    expect(verifiedScore.lowConfidenceWarning).toBeUndefined();

    expect(mapStatusToBadge('valid')).toBe('Verified');
    expect(mapStatusToBadge('accept_all')).toBe('Accept-all');
    expect(mapStatusToBadge('risky')).toBe('Risky');
    expect(mapStatusToBadge('not_found')).toBe('Not found');
  });

  it('rejects asset filenames, placeholder domains, and Sentry hashes during HTML extraction', () => {
    expect(isValidExtractedBusinessEmail('banner@2x.png', 'acme.com')).toBe(false);
    expect(isValidExtractedBusinessEmail('user@example.com', 'acme.com')).toBe(false);
    expect(isValidExtractedBusinessEmail('a8f9d0c1e2b3a4f5d6e7c8b9@sentry.io', 'acme.com')).toBe(false);
    expect(isValidExtractedBusinessEmail('press@iana.org', 'iana.org')).toBe(true);
  });

  it('matches required monetization limits, credit packs, and compliance messages', () => {
    expect(MONETIZATION_CONFIG.freeMonthlyCompanySearches).toBe(5);
    expect(MONETIZATION_CONFIG.freeMonthlyEmailVerifications).toBe(10);
    expect(MONETIZATION_CONFIG.creditPacks).toEqual([
      { id: 'pack_100', credits: 100, priceUsd: 9, label: '100 Credits — $9', costPerCredit: '$0.09/email' },
      { id: 'pack_500', credits: 500, priceUsd: 29, label: '500 Credits — $29', costPerCredit: '$0.058/email' },
      { id: 'pack_1000', credits: 1000, priceUsd: 49, label: '1,000 Credits — $49', costPerCredit: '$0.049/email' },
    ]);
    expect(COMPLIANCE_DISCLAIMER).toBe(
      'Emails are sourced from public web pages and verified through third-party verification services.'
    );
    expect(ACCEPT_ALL_WARNING).toBe('Domain accepts all emails; individual mailbox may not exist.');
    expect(NO_MX_MESSAGE).toBe('No valid email infrastructure found');
    expect(WEBSITE_UNREACHABLE_MESSAGE).toBe('Website unreachable');
    expect(NO_VERIFIED_EMAIL_MESSAGE).toBe('No verified email found');
  });
});
