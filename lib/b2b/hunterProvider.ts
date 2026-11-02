/**
 * Hunter.io Domain Search provider (runtime-agnostic: Node + Cloudflare Workers).
 *
 * This is where Hunter.io-sized employee lists come from: Hunter's own index of
 * publicly found emails, with names, positions, departments, seniority, LinkedIn
 * and source URLs. We never generate or guess emails here — every record is
 * returned by Hunter along with its own verification status.
 *
 * Docs: https://hunter.io/api-documentation/v2#domain-search
 */

import {
  DiscoveredEmailRecord,
  VerificationStatus,
  inferDepartmentFromEmail,
  inferSeniorityFromRole,
  mapStatusToBadge,
} from './emailIntelligenceEngine';

export interface HunterDomainResult {
  emails: DiscoveredEmailRecord[];
  totalAvailable: number;
  pattern: string | null;
  domain: string | null;
  organization?: string;
  description?: string;
  industry?: string;
  country?: string;
  headquarters?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  acceptAll: boolean;
  error?: string;
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function mapHunterEmail(item: any, domain: string, acceptAll: boolean, checkedAt: string): DiscoveredEmailRecord | null {
  const email = String(item?.value || '').toLowerCase();
  if (!email) return null;

  const ver = String(item.verification?.status || '').toLowerCase();
  if (ver === 'invalid') return null;

  let status: VerificationStatus;
  if (ver === 'valid') status = 'valid';
  else if (ver === 'accept_all' || acceptAll) status = 'accept_all';
  else status = Number(item.confidence) >= 90 ? 'valid' : 'risky';

  const confidence = Number(item.confidence) || 50;
  const role: string | undefined = item.position || undefined;
  const sources = Array.isArray(item.sources) ? item.sources : [];
  const fullName = [item.first_name, item.last_name].filter(Boolean).join(' ') || undefined;

  return {
    email,
    firstName: item.first_name || undefined,
    lastName: item.last_name || undefined,
    fullName,
    role,
    department: item.department ? titleCase(String(item.department)) : inferDepartmentFromEmail(email, role),
    seniority: item.seniority ? titleCase(String(item.seniority)) : inferSeniorityFromRole(role, email),
    linkedinUrl: item.linkedin || undefined,
    status,
    statusBadge: mapStatusToBadge(status),
    confidence,
    lowConfidenceWarning: confidence < 70 ? 'Low confidence — do not use for outreach' : undefined,
    sourceUrl: sources[0]?.uri ? String(sources[0].uri) : `https://${domain}`,
    discoveryMethod: 'hunter_api',
    verificationProvider: 'Hunter.io',
    checkedAt: item.verification?.date || checkedAt,
  };
}

/**
 * Fetches ALL emails Hunter has for a domain (paginated), up to `maxResults`.
 * Pass `company` instead of `domain` when only a company name is known.
 */
export async function hunterDomainSearch(params: {
  apiKey: string;
  domain?: string | null;
  company?: string | null;
  maxResults?: number;
  timeoutMs?: number;
}): Promise<HunterDomainResult> {
  const maxResults = Math.max(10, params.maxResults ?? 100);
  const checkedAt = new Date().toISOString();
  const result: HunterDomainResult = {
    emails: [],
    totalAvailable: 0,
    pattern: null,
    domain: params.domain || null,
    acceptAll: false,
  };

  let pageSize = 100;
  let offset = 0;

  while (result.emails.length < maxResults) {
    const qs = new URLSearchParams({
      api_key: params.apiKey,
      limit: String(Math.min(pageSize, maxResults - result.emails.length)),
      offset: String(offset),
    });
    if (params.domain) qs.set('domain', params.domain);
    else if (params.company) qs.set('company', params.company);
    else break;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), params.timeoutMs ?? 9000);
    let res: Response;
    try {
      res = await fetch(`https://api.hunter.io/v2/domain-search?${qs}`, { signal: controller.signal });
    } catch {
      result.error = result.error || 'Hunter.io request timed out';
      break;
    } finally {
      clearTimeout(timer);
    }

    const json: any = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errId = String(json?.errors?.[0]?.id || '');
      // Free / starter plans cap `limit` at 10 — retry with a smaller page instead of failing.
      if (errId === 'pagination_error' && pageSize > 10) {
        pageSize = 10;
        continue;
      }
      result.error = json?.errors?.[0]?.details || `Hunter.io error ${res.status}`;
      break;
    }

    const data = json?.data || {};
    if (offset === 0) {
      result.totalAvailable = Number(json?.meta?.results) || 0;
      result.acceptAll = Boolean(data.accept_all);
      result.domain = data.domain || result.domain;
      result.pattern = data.pattern && result.domain ? `${data.pattern}@${result.domain}` : null;
      result.organization = data.organization || undefined;
      result.description = data.description || undefined;
      result.industry = data.industry || undefined;
      result.country = data.country || undefined;
      result.headquarters = [data.street, data.city, data.state, data.country].filter(Boolean).join(', ') || undefined;
      result.linkedin = data.linkedin || undefined;
      result.twitter = data.twitter ? `https://x.com/${String(data.twitter).replace(/^@/, '')}` : undefined;
      result.facebook = data.facebook || undefined;
      result.instagram = data.instagram || undefined;
      result.phone = data.phone_number || undefined;
    }

    const page = Array.isArray(data.emails) ? data.emails : [];
    for (const item of page) {
      const rec = mapHunterEmail(item, result.domain || '', result.acceptAll, checkedAt);
      if (rec) result.emails.push(rec);
    }

    offset += page.length;
    if (page.length === 0 || offset >= result.totalAvailable) break;
  }

  return result;
}

