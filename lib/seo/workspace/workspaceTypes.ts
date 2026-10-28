/**
 * ToolVerse Workspace & SEO Domain Types
 * Strict typing across tenancy, projects, crawling, keywords, backlinks, and tasks.
 */

export type ProjectScope = 'domain' | 'subdomain' | 'subfolder';

export type VerificationMethod = 'meta-tag' | 'dns-txt' | 'file-upload';

export interface OwnershipVerification {
  token: string;
  verified: boolean;
  verifiedAt?: string;
  method?: VerificationMethod;
}

export interface ProjectSettings {
  maxCrawlPages: number;
  maxCrawlDepth: number;
  includeQueryParams: boolean;
  respectRobotsTxt: boolean;
  userAgent?: string;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  scope: ProjectScope;
  targetCountry: string;
  targetLanguage: string;
  businessCategory?: string;
  competitors: string[];
  verification: OwnershipVerification;
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
}

export type SeverityLevel = 'critical' | 'warning' | 'info';

export type FindingCategory =
  | 'indexability'
  | 'content'
  | 'architecture'
  | 'performance'
  | 'links'
  | 'security'
  | 'schema';

export interface AuditFindingEvidence {
  url: string;
  element?: string;
  expected?: string;
  actual?: string;
  context?: string;
}

export interface AuditFinding {
  id: string;
  ruleId: string;
  ruleVersion: string;
  category: FindingCategory;
  severity: SeverityLevel;
  title: string;
  explanation: string;
  recommendation: string;
  affectedUrls: string[];
  evidence?: AuditFindingEvidence[];
  recheckStatus?: 'pending' | 'resolved' | 'regressed';
}

export interface InternalLinkItem {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  rel?: string;
  isNofollow: boolean;
}

export interface PageInventoryItem {
  requestedUrl: string;
  finalUrl: string;
  httpStatus: number;
  depth: number;
  timingMs: number;
  contentType: string;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1: string[];
  canonical: string;
  isCanonicalSelf: boolean;
  robotsMeta: string;
  isNoindex: boolean;
  isNofollow: boolean;
  wordCount: number;
  isThinContent: boolean;
  inboundLinksCount: number;
  outboundInternalCount: number;
  outboundExternalCount: number;
  imagesMissingAltCount: number;
  issuesCount: number;
}

export interface AuditRunRecord {
  id: string;
  projectId: string;
  targetUrl: string;
  crawledPagesCount: number;
  healthScore: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  passedCount: number;
  pages: PageInventoryItem[];
  findings: AuditFinding[];
  internalLinks: InternalLinkItem[];
  at: string;
}

export type TaskStatus = 'open' | 'in-progress' | 'resolved';

export interface TaskRecord {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: TaskStatus;
  assignee?: string;
  url?: string;
  findingRuleId?: string;
  dueDate?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type ProvenanceType =
  | 'measured'
  | 'third_party_estimate'
  | 'ai_inference'
  | 'user_input'
  | 'unavailable'
  | 'not_checked';

export interface KeywordItem {
  id: string;
  projectId: string;
  keyword: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  tags: string[];
  targetUrl?: string;
  monthlyVolume?: number;
  cpcUsd?: number;
  difficulty?: number;
  provenance: ProvenanceType;
  provenanceLabel?: string;
  createdAt: string;
}

export interface BacklinkItem {
  id: string;
  projectId: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  isDofollow: boolean;
  firstSeen?: string;
  lastChecked?: string;
  status: 'active' | 'lost' | 'broken';
  provenance: ProvenanceType;
}

export interface GscPerformanceRow {
  query: string;
  page?: string;
  country?: string;
  device?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
