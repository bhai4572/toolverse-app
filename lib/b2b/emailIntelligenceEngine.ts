/**
 * Policy-Compliant, Zero-Hallucination B2B Email Discovery & Verification Engine
 *
 * ANTI-HALLUCINATION GUARANTEES:
 * 1. Never invent a first name, last name, phone number, address, social profile, or email.
 * 2. Never output an email unless:
 *    (a) Publicly found on an official web page with an exact sourceUrl, OR
 *    (b) Generated from a detected pattern AND verified as 'valid' or 'accept_all' by a verification provider.
 * 3. Never mark a generated email as 'valid' without third-party verification.
 * 4. If confidence < 70%, label it: "Low confidence — do not use for outreach".
 * 5. If domain is accept-all, warn: "Domain accepts all emails; individual mailbox may not exist."
 * 6. If no MX records exist, return: "No valid email infrastructure found".
 * 7. If website cannot be reached, return: "Website unreachable".
 */

export type VerificationStatus = 'valid' | 'accept_all' | 'risky' | 'unknown' | 'not_found';

export type EmailPatternType =
  | '{first}.{last}'
  | '{first}{last}'
  | '{f}.{last}'
  | '{first}'
  | '{last}'
  | '{first}_{last}';

export type DiscoveryMethod =
  | 'public_crawl'
  | 'hunter_api'
  | 'zerobounce_api'
  | 'emaillistverify_api'
  | 'pattern_verified';

export interface DiscoveredEmailRecord {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  department?: string;
  status: VerificationStatus;
  statusBadge: 'Verified' | 'Accept-all' | 'Risky' | 'Not found';
  confidence: number; // 0 - 100
  lowConfidenceWarning?: string; // "Low confidence — do not use for outreach" when confidence < 70
  sourceUrl: string;
  discoveryMethod: DiscoveryMethod;
  verificationProvider: string;
  checkedAt: string; // ISO date string
}

export interface CrawlSourceSummary {
  url: string;
  path: string;
  status: number;
  reachable: boolean;
  emailsFoundCount: number;
  emailsFound: string[];
  checkedAt: string;
}

export interface DnsDiagnostics {
  domainResolves: boolean;
  hasMx: boolean;
  mxRecords: string[];
  mailProvider: string;
  hasSpf: boolean;
  hasDmarc: boolean;
  isAcceptAll: boolean;
}

export interface CompanySearchFilters {
  country?: string;
  industry?: string;
  companySize?: string;
  targetRole?: string;
  firstName?: string;
  lastName?: string;
}

export interface CompanyEmailIntelligenceReport {
  query: string;
  domain: string;
  companyName: string;
  websiteUrl: string;
  description: string | null;
  industry: string | null;
  companySize: string | null;
  country: string | null;
  headquarters: string | null;
  phone: string | null;
  socialProfiles: {
    linkedin: string | null;
    twitter: string | null;
    facebook: string | null;
    instagram: string | null;
  };
  emailDomainsDetected: string[];
  detectedPattern: string | null; // e.g., "{first}.{last}@domain.com"
  patternType: EmailPatternType | null;
  websiteReachable: boolean;
  robotsTxtRespected: boolean;
  dns: DnsDiagnostics;
  statusBanner:
    | 'VERIFIED_EMAILS_FOUND'
    | 'NO_VERIFIED_EMAIL_FOUND'
    | 'NO_VALID_EMAIL_INFRASTRUCTURE'
    | 'WEBSITE_UNREACHABLE';
  statusMessage: string;
  acceptAllWarning: string | null;
  emails: DiscoveredEmailRecord[];
  sources: CrawlSourceSummary[];
  candidateLookup?: {
    firstName: string;
    lastName: string;
    candidateEmail: string | null;
    patternUsed: string | null;
    status: VerificationStatus;
    verified: boolean;
    message: string;
  } | null;
  providersCalled: string[];
  creditsCharged: number;
  fromCache: boolean;
  checkedAt: string;
  disclaimer: string;
}

export interface CreditPackOption {
  id: 'pack_100' | 'pack_500' | 'pack_1000';
  credits: number;
  priceUsd: number;
  label: string;
  costPerCredit: string;
}

export interface UserCreditSummary {
  userId: string;
  freeSearchesUsed: number;
  freeSearchesLimit: number;
  freeVerificationsUsed: number;
  freeVerificationsLimit: number;
  paidCreditsBalance: number;
  periodResetAt: string;
}

export interface SearchAuditLogEntry {
  id: string;
  query: string;
  domain: string;
  timestamp: string;
  sources: string[];
  verificationStatus: string;
  verifiedCount: number;
  creditsUsed: number;
  providersCalled: string[];
}

export const PUBLIC_CRAWL_PATHS: readonly string[] = [
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
] as const;

export const COMPLIANCE_DISCLAIMER =
  'Emails are sourced from public web pages and verified through third-party verification services.';

export const LOW_CONFIDENCE_LABEL = 'Low confidence — do not use for outreach';
export const ACCEPT_ALL_WARNING = 'Domain accepts all emails; individual mailbox may not exist.';
export const NO_MX_MESSAGE = 'No valid email infrastructure found';
export const WEBSITE_UNREACHABLE_MESSAGE = 'Website unreachable';
export const NO_VERIFIED_EMAIL_MESSAGE = 'No verified email found';

export const MONETIZATION_CONFIG = {
  freeMonthlyCompanySearches: 5,
  freeMonthlyEmailVerifications: 10,
  creditPacks: [
    { id: 'pack_100', credits: 100, priceUsd: 9, label: '100 Credits — $9', costPerCredit: '$0.09/email' },
    { id: 'pack_500', credits: 500, priceUsd: 29, label: '500 Credits — $29', costPerCredit: '$0.058/email' },
    { id: 'pack_1000', credits: 1000, priceUsd: 49, label: '1,000 Credits — $49', costPerCredit: '$0.049/email' },
  ] as CreditPackOption[],
};

/**
 * Known company name -> official domain map for fast offline/deterministic resolution
 * before falling back to live Clearbit/DNS resolution.
 */
const KNOWN_COMPANY_DOMAINS: Record<string, string> = {
  intercom: 'intercom.com',
  stripe: 'stripe.com',
  github: 'github.com',
  gitlab: 'gitlab.com',
  cloudflare: 'cloudflare.com',
  vercel: 'vercel.com',
  supabase: 'supabase.com',
  openai: 'openai.com',
  anthropic: 'anthropic.com',
  notion: 'notion.so',
  figma: 'figma.com',
  canva: 'canva.com',
  hubspot: 'hubspot.com',
  hunter: 'hunter.io',
  apollo: 'apollo.io',
  shopify: 'shopify.com',
  slack: 'slack.com',
  zoom: 'zoom.us',
  atlassian: 'atlassian.com',
  linear: 'linear.app',
  dropbox: 'dropbox.com',
  twilio: 'twilio.com',
  datadog: 'datadoghq.com',
};

const VALID_TLD_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const INVALID_TLDS = new Set(['local', 'test', 'invalid', 'example', 'localhost', 'internal']);

/**
 * Step 1: Normalize company name or website input.
 * - Removes http/https, www, paths, query strings, trailing slashes.
 * - Rejects invalid TLDs.
 * - If a company name without TLD is entered, resolves known companies or returns a clean slug for Clearbit/DNS lookup.
 */
export function normalizeCompanyOrDomainInput(rawInput: string): {
  isDomainInput: boolean;
  normalizedDomain: string | null;
  companyQuery: string;
  error?: string;
} {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) {
    return { isDomainInput: false, normalizedDomain: null, companyQuery: '', error: 'Please enter a company name or website domain.' };
  }

  // Strip protocol, www, path, query, port
  let candidate = trimmed
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .split('?')[0]
    .split('#')[0]
    .split(':')[0]
    .trim()
    .toLowerCase();

  // If user typed a domain (contains a dot and no spaces)
  if (candidate.includes('.') && !/\s/.test(candidate)) {
    const parts = candidate.split('.');
    const tld = parts[parts.length - 1];
    if (!VALID_TLD_REGEX.test(candidate) || tld.length < 2 || INVALID_TLDS.has(tld) || /^\d+$/.test(tld)) {
      return {
        isDomainInput: true,
        normalizedDomain: null,
        companyQuery: trimmed,
        error: `Invalid domain or TLD: "${candidate}". Please enter a valid business domain (e.g., intercom.com).`,
      };
    }
    return {
      isDomainInput: true,
      normalizedDomain: candidate,
      companyQuery: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
    };
  }

  // User entered a company name (e.g., "Intercom" or "Stripe Inc")
  const cleanKey = trimmed
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|corp|corporation|co|company|gmbh|plc|limited)\b\.?/gi, '')
    .replace(/[^a-z0-9]/g, '');

  if (KNOWN_COMPANY_DOMAINS[cleanKey]) {
    return {
      isDomainInput: false,
      normalizedDomain: KNOWN_COMPANY_DOMAINS[cleanKey],
      companyQuery: trimmed,
    };
  }

  return {
    isDomainInput: false,
    normalizedDomain: cleanKey ? `${cleanKey}.com` : null,
    companyQuery: trimmed,
  };
}

/**
 * Role-based prefixes that are generic department inboxes (not personal name patterns).
 */
const GENERIC_ROLE_PREFIXES = new Set([
  'info',
  'contact',
  'hello',
  'support',
  'help',
  'sales',
  'press',
  'media',
  'pr',
  'careers',
  'jobs',
  'hr',
  'legal',
  'privacy',
  'security',
  'abuse',
  'billing',
  'finance',
  'accounts',
  'admin',
  'office',
  'team',
  'enquiries',
  'inquiries',
  'marketing',
  'partners',
  'investors',
  'compliance',
  'dpo',
  'webmaster',
  'noreply',
  'no-reply',
]);

export function isRoleOrGenericEmail(email: string): boolean {
  const local = email.split('@')[0]?.toLowerCase() || '';
  return GENERIC_ROLE_PREFIXES.has(local);
}

export function inferDepartmentFromEmail(email: string, role?: string): string {
  const local = (email.split('@')[0] || '').toLowerCase();
  const r = (role || '').toLowerCase();
  if (local.includes('sales') || local.includes('partner') || r.includes('sales')) return 'Sales & Partnerships';
  if (local.includes('press') || local.includes('media') || local.includes('marketing') || r.includes('marketing')) return 'Marketing & PR';
  if (local.includes('career') || local.includes('job') || local.includes('hr') || r.includes('hr') || r.includes('talent')) return 'HR & Recruiting';
  if (local.includes('legal') || local.includes('privacy') || local.includes('dpo') || local.includes('compliance')) return 'Legal & Privacy';
  if (local.includes('support') || local.includes('help') || local.includes('success')) return 'Customer Support';
  if (local.includes('finance') || local.includes('billing') || r.includes('cfo') || r.includes('finance')) return 'Finance';
  if (local.includes('security') || r.includes('cto') || r.includes('engineer')) return 'Engineering & Security';
  if (r.includes('ceo') || r.includes('founder') || r.includes('president')) return 'Executive';
  return 'General Business';
}

/**
 * Step 5: Detect email patterns ONLY from publicly found personal emails on the target domain.
 * Supported patterns:
 * - {first}.{last}@domain.com
 * - {first}{last}@domain.com
 * - {f}.{last}@domain.com
 * - {first}@domain.com
 * - {last}@domain.com
 * - {first}_{last}@domain.com
 *
 * Never invents a pattern if no personal email structure is present in publicly found emails.
 */
export function detectEmailPatternFromPublicEmails(
  emails: Array<{ email: string; firstName?: string; lastName?: string }>,
  domain: string
): { patternType: EmailPatternType | null; formattedPattern: string | null } {
  const targetDomain = domain.toLowerCase();
  const counts: Record<EmailPatternType, number> = {
    '{first}.{last}': 0,
    '{first}{last}': 0,
    '{f}.{last}': 0,
    '{first}': 0,
    '{last}': 0,
    '{first}_{last}': 0,
  };

  for (const item of emails) {
    const [localRaw, emailDomain] = (item.email || '').toLowerCase().split('@');
    if (!localRaw || emailDomain !== targetDomain) continue;
    if (GENERIC_ROLE_PREFIXES.has(localRaw)) continue;

    const fn = item.firstName?.toLowerCase().replace(/[^a-z]/g, '');
    const ln = item.lastName?.toLowerCase().replace(/[^a-z]/g, '');

    if (fn && ln) {
      if (localRaw === `${fn}.${ln}`) counts['{first}.{last}'] += 2;
      else if (localRaw === `${fn}${ln}`) counts['{first}{last}'] += 2;
      else if (localRaw === `${fn[0]}.${ln}`) counts['{f}.{last}'] += 2;
      else if (localRaw === `${fn}_${ln}`) counts['{first}_{last}'] += 2;
      else if (localRaw === fn) counts['{first}'] += 2;
      else if (localRaw === ln) counts['{last}'] += 2;
      continue;
    }

    // Structural heuristic on non-role personal local parts
    if (/^[a-z]{1}\.[a-z]{2,}$/.test(localRaw)) {
      counts['{f}.{last}'] += 1;
    } else if (/^[a-z]{2,}\.[a-z]{2,}$/.test(localRaw)) {
      counts['{first}.{last}'] += 1;
    } else if (/^[a-z]{2,}_[a-z]{2,}$/.test(localRaw)) {
      counts['{first}_{last}'] += 1;
    }
  }

  let bestPattern: EmailPatternType | null = null;
  let bestScore = 0;
  for (const [pat, score] of Object.entries(counts) as [EmailPatternType, number][]) {
    if (score > bestScore) {
      bestScore = score;
      bestPattern = pat;
    }
  }

  if (!bestPattern || bestScore === 0) {
    return { patternType: null, formattedPattern: null };
  }

  return {
    patternType: bestPattern,
    formattedPattern: `${bestPattern}@${targetDomain}`,
  };
}

/**
 * Step 6: Generate a candidate email for a person ONLY when a pattern has been detected.
 * Returns null if no pattern was detected or if first/last name is missing.
 */
export function generateCandidateFromPattern(
  firstName: string,
  lastName: string,
  domain: string,
  patternType: EmailPatternType | null
): string | null {
  if (!patternType) return null;
  const fn = (firstName || '').trim().toLowerCase().replace(/[^a-z]/g, '');
  const ln = (lastName || '').trim().toLowerCase().replace(/[^a-z]/g, '');
  const d = (domain || '').trim().toLowerCase();
  if (!fn || !ln || !d) return null;

  switch (patternType) {
    case '{first}.{last}':
      return `${fn}.${ln}@${d}`;
    case '{first}{last}':
      return `${fn}${ln}@${d}`;
    case '{f}.{last}':
      return `${fn[0]}.${ln}@${d}`;
    case '{first}':
      return `${fn}@${d}`;
    case '{last}':
      return `${ln}@${d}`;
    case '{first}_{last}':
      return `${fn}_${ln}@${d}`;
    default:
      return null;
  }
}

/**
 * Maps verification status to the exact UI badge required by specification:
 * Verified / Accept-all / Risky / Not found
 */
export function mapStatusToBadge(
  status: VerificationStatus
): 'Verified' | 'Accept-all' | 'Risky' | 'Not found' {
  switch (status) {
    case 'valid':
      return 'Verified';
    case 'accept_all':
      return 'Accept-all';
    case 'risky':
    case 'unknown':
      return 'Risky';
    case 'not_found':
    default:
      return 'Not found';
  }
}

/**
 * Computes confidence score and attaches mandatory anti-hallucination warning if < 70%.
 */
export function computeEmailConfidence(params: {
  hasPublicSourceUrl: boolean;
  foundInMailtoOrSchema: boolean;
  providerVerifiedStatus?: VerificationStatus;
  hasMx: boolean;
  hasSpf: boolean;
  hasDmarc: boolean;
  isAcceptAll: boolean;
}): { confidence: number; lowConfidenceWarning?: string } {
  if (!params.hasMx) {
    return { confidence: 0, lowConfidenceWarning: LOW_CONFIDENCE_LABEL };
  }

  let score = 0;

  if (params.providerVerifiedStatus === 'valid') {
    score = 95;
  } else if (params.hasPublicSourceUrl) {
    score = params.foundInMailtoOrSchema ? 92 : 84;
    if (params.hasSpf) score += 2;
    if (params.hasDmarc) score += 2;
  } else if (params.providerVerifiedStatus === 'accept_all') {
    score = 65;
  } else {
    score = 45;
  }

  if (params.isAcceptAll && score > 68) {
    score = 68;
  }

  const clamped = Math.max(0, Math.min(99, score));
  return {
    confidence: clamped,
    lowConfidenceWarning: clamped < 70 ? LOW_CONFIDENCE_LABEL : undefined,
  };
}

/**
 * Strictly validates emails extracted from raw HTML so image filenames, Sentry keys,
 * CSS tokens, and placeholder domains are never mistaken for real business emails.
 */
export function isValidExtractedBusinessEmail(email: string, targetDomain?: string): boolean {
  const clean = (email || '').trim().toLowerCase();
  if (!clean || clean.length > 120 || !clean.includes('@')) return false;

  const [local, domain] = clean.split('@');
  if (!local || !domain || !domain.includes('.')) return false;

  // Reject image/asset extensions
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|map|json|xml|pdf)$/i.test(clean)) {
    return false;
  }

  // Reject placeholder, sentry, example, or tracking domains
  const blockedFragments = [
    'example.com',
    'domain.com',
    'yourdomain',
    'email.com',
    'sentry.io',
    'wixpress.com',
    'cloudflare.com',
    'schema.org',
    'w3.org',
    'googleapis.com',
    'googleusercontent.com',
  ];
  for (const frag of blockedFragments) {
    if (domain.includes(frag) && targetDomain !== frag) return false;
  }

  // Reject numeric/hash local parts (like Sentry DSNs)
  if (/^[0-9a-f]{20,}$/i.test(local)) return false;
  if (!/^[a-z0-9._+-]+$/i.test(local)) return false;

  return true;
}
