import { PolicyDocument } from './types';

const POLICIES_KEY = 'toolverse_policy_documents';

export const INITIAL_POLICIES: PolicyDocument[] = [
  {
    slug: 'privacy-policy',
    title: 'Toolverse Privacy & Data Minimization Policy',
    version: '2.1.0',
    effectiveDate: '2026-10-01',
    contentMarkdown: 'Toolverse is committed to privacy-first operations. Document verification files are stored in private encrypted storage and accessible solely to authorized reviewers. User IP addresses and analytics are aggregated according to strict data minimization principles.',
    requiresConsent: true,
    status: 'published',
  },
  {
    slug: 'terms-of-use',
    title: 'Platform Terms of Use & Business Identity Guidelines',
    version: '2.0.0',
    effectiveDate: '2026-10-01',
    contentMarkdown: 'Every registered business receives a permanent Business ID. Business owners agree to provide truthful information and maintain accurate services, contact details, and location data.',
    requiresConsent: true,
    status: 'published',
  },
  {
    slug: 'business-bidding-terms',
    title: 'Sponsored Listing & Category Bidding Terms',
    version: '1.5.0',
    effectiveDate: '2026-10-01',
    contentMarkdown: 'Sponsored Top 3 placements are transparently labeled as Sponsored. Paid campaign placements do not manipulate organic user review scores or community trust rankings.',
    requiresConsent: false,
    status: 'published',
  },
  {
    slug: 'verification-policy',
    title: 'Risk-Based Business Verification Policy',
    version: '1.2.0',
    effectiveDate: '2026-10-01',
    contentMarkdown: 'Toolverse applies risk-based verification. Verification Level 0 (Unverified) to Level 4 (Enhanced Document Verification). Admin document requests require corporate email or official business registration evidence.',
    requiresConsent: false,
    status: 'published',
  },
];

export function getStoredPolicies(): PolicyDocument[] {
  if (typeof window === 'undefined') return INITIAL_POLICIES;
  try {
    const raw = localStorage.getItem(POLICIES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_POLICIES;
  } catch {
    return INITIAL_POLICIES;
  }
}

export function updatePolicyDocument(slug: string, newContent: string, adminUsername: string): PolicyDocument | null {
  const policies = getStoredPolicies();
  const p = policies.find((item) => item.slug === slug);
  if (!p) return null;

  p.contentMarkdown = newContent;
  p.status = 'published';
  p.lastReviewedBy = adminUsername;
  p.lastReviewedAt = new Date().toISOString();

  // Increment minor version
  const parts = p.version.split('.');
  if (parts.length === 3) {
    p.version = `${parts[0]}.${parseInt(parts[1], 10) + 1}.0`;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));
  }

  return p;
}
