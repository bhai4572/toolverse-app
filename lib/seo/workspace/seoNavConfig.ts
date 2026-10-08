/**
 * Semrush-style left-nav tree for ToolVerse SEO Workspace.
 * Structure mirrors common SEO suite IA; labels are ToolVerse originals (not Semrush copy).
 *
 * Lock policy: `status: 'live'` = real user-data / fetch / paste analysis.
 * Everything else is `locked` until real data integration ships (visible in nav, not runnable as fake Semrush).
 */

export type NavStatus = 'live' | 'locked';

export interface SeoNavItem {
  id: string;
  label: string;
  /** Path segment under /workspace/ */
  slug: string;
  /** Module kind drives the interactive MVP */
  kind: ModuleKind;
  /** live = usable now; locked = coming soon panel (no fake market results) */
  status: NavStatus;
  toolSlug?: string;
  children?: SeoNavItem[];
}

export type ModuleKind =
  | 'home'
  | 'url-audit'
  | 'on-page'
  | 'site-performance'
  | 'domain-overview'
  | 'keyword-overview'
  | 'keyword-magic'
  | 'keyword-gap'
  | 'position-tracking'
  | 'organic-research'
  | 'link-extractor'
  | 'backlink-checklist'
  | 'content-optimizer'
  | 'topic-ideas'
  | 'writing-assistant'
  | 'traffic-your-data'
  | 'market-explorer'
  | 'ai-visibility'
  | 'local-checklist'
  | 'ads-planner'
  | 'ai-pr'
  | 'social-preview'
  | 'report-export'
  | 'app-center'
  | 'generic-analyzer';

export interface SeoNavGroup {
  id: string;
  label: string;
  icon: string;
  items: SeoNavItem[];
}

export const SEO_NAV_GROUPS: SeoNavGroup[] = [
  {
    id: 'traffic-market',
    label: 'Traffic & Market',
    icon: 'globe',
    items: [
      {
        id: 'market-explorer',
        label: 'Market Explorer',
        slug: 'market-explorer',
        kind: 'market-explorer',
        status: 'locked',
      },
      {
        id: 'traffic-analytics',
        label: 'Traffic Analytics',
        slug: 'traffic-analytics',
        kind: 'traffic-your-data',
        status: 'live',
        children: [
          { id: 'ta-overview', label: 'Overview', slug: 'traffic-analytics/overview', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-sources', label: 'Traffic Sources', slug: 'traffic-analytics/sources', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-geo', label: 'Geo Distribution', slug: 'traffic-analytics/geo', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-pages', label: 'Top Pages', slug: 'traffic-analytics/pages', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-subfolders', label: 'Subfolders', slug: 'traffic-analytics/subfolders', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-destinations', label: 'Destinations', slug: 'traffic-analytics/destinations', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-competitors', label: 'Competitors', slug: 'traffic-analytics/competitors', kind: 'generic-analyzer', status: 'locked' },
          { id: 'ta-devices', label: 'Devices', slug: 'traffic-analytics/devices', kind: 'traffic-your-data', status: 'live' },
          { id: 'ta-trends', label: 'Trends', slug: 'traffic-analytics/trends', kind: 'traffic-your-data', status: 'live' },
        ],
      },
      {
        id: 'one2target',
        label: 'Audience Insights',
        slug: 'audience-insights',
        kind: 'generic-analyzer',
        status: 'locked',
      },
      {
        id: 'eyeon',
        label: 'Trend Watch',
        slug: 'trend-watch',
        kind: 'generic-analyzer',
        status: 'locked',
      },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: 'search',
    items: [
      { id: 'domain-overview', label: 'Domain Overview', slug: 'domain-overview', kind: 'domain-overview', status: 'live' },
      {
        id: 'organic-research',
        label: 'Organic Research',
        slug: 'organic-research',
        kind: 'organic-research',
        status: 'live',
        children: [
          { id: 'or-overview', label: 'Overview', slug: 'organic-research/overview', kind: 'organic-research', status: 'live' },
          { id: 'or-positions', label: 'Positions', slug: 'organic-research/positions', kind: 'position-tracking', status: 'live' },
          { id: 'or-pages', label: 'Pages', slug: 'organic-research/pages', kind: 'url-audit', status: 'live' },
          { id: 'or-competitors', label: 'Competitors', slug: 'organic-research/competitors', kind: 'keyword-gap', status: 'live' },
        ],
      },
      { id: 'keyword-overview', label: 'Keyword Overview', slug: 'keyword-overview', kind: 'keyword-overview', toolSlug: 'keyword-research-tool', status: 'locked' },
      { id: 'keyword-magic', label: 'Keyword Magic', slug: 'keyword-magic', kind: 'keyword-magic', toolSlug: 'keyword-research-tool', status: 'locked' },
      { id: 'keyword-gap', label: 'Keyword Gap', slug: 'keyword-gap', kind: 'keyword-gap', status: 'live' },
      { id: 'keyword-manager', label: 'Keyword Manager', slug: 'keyword-manager', kind: 'position-tracking', status: 'live' },
      { id: 'position-tracking', label: 'Position Tracking', slug: 'position-tracking', kind: 'position-tracking', status: 'live' },
      { id: 'site-audit', label: 'Site Audit', slug: 'site-audit', kind: 'url-audit', toolSlug: 'seo-audit-analyzer', status: 'live' },
      { id: 'on-page', label: 'On Page SEO Checker', slug: 'on-page-seo', kind: 'on-page', toolSlug: 'seo-audit-analyzer', status: 'live' },
      { id: 'site-performance', label: 'Site Performance', slug: 'site-performance', kind: 'site-performance', status: 'live' },
      {
        id: 'link-building',
        label: 'Link Building',
        slug: 'link-building',
        kind: 'link-extractor',
        status: 'live',
        children: [
          { id: 'lb-backlink-analytics', label: 'Backlink Analytics', slug: 'link-building/backlink-analytics', kind: 'backlink-checklist', toolSlug: 'backlink-checker-analyzer', status: 'live' },
          { id: 'lb-backlink-audit', label: 'Backlink Audit', slug: 'link-building/backlink-audit', kind: 'backlink-checklist', status: 'live' },
          { id: 'lb-link-building', label: 'Outreach Tracker', slug: 'link-building/outreach', kind: 'generic-analyzer', status: 'locked' },
          { id: 'lb-bulk', label: 'Bulk URL Analysis', slug: 'link-building/bulk', kind: 'url-audit', status: 'live' },
          { id: 'lb-extractor', label: 'Page Link Extractor', slug: 'link-building/extractor', kind: 'link-extractor', status: 'live' },
        ],
      },
      { id: 'listing-mgmt', label: 'Listing Management', slug: 'listing-management', kind: 'local-checklist', status: 'locked' },
    ],
  },
  {
    id: 'ai-visibility',
    label: 'AI Visibility',
    icon: 'sparkles',
    items: [
      { id: 'ai-overview', label: 'AI Overview', slug: 'ai-visibility', kind: 'ai-visibility', status: 'locked' },
      { id: 'ai-prompts', label: 'Prompt Tracker', slug: 'ai-visibility/prompts', kind: 'ai-visibility', status: 'locked' },
      { id: 'ai-brand', label: 'Brand Mentions Checklist', slug: 'ai-visibility/brand', kind: 'ai-visibility', status: 'locked' },
      { id: 'ai-citations', label: 'Citation Readiness', slug: 'ai-visibility/citations', kind: 'ai-visibility', status: 'locked' },
    ],
  },
  {
    id: 'local',
    label: 'Local',
    icon: 'map',
    items: [
      { id: 'map-rank', label: 'Map Pack Tracker', slug: 'local/map-rank', kind: 'local-checklist', status: 'locked' },
      { id: 'gbp', label: 'GBP Checklist', slug: 'local/gbp', kind: 'local-checklist', status: 'locked' },
      { id: 'local-listings', label: 'Listings Audit', slug: 'local/listings', kind: 'local-checklist', status: 'locked' },
      { id: 'reviews', label: 'Reviews Workflow', slug: 'local/reviews', kind: 'local-checklist', status: 'locked' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'file',
    items: [
      { id: 'seo-writing', label: 'SEO Writing Assistant', slug: 'content/writing', kind: 'writing-assistant', toolSlug: 'ai-article-writer', status: 'locked' },
      { id: 'topic-research', label: 'Topic Research', slug: 'content/topics', kind: 'topic-ideas', status: 'locked' },
      { id: 'content-optimizer', label: 'Content Optimizer', slug: 'content/optimizer', kind: 'content-optimizer', toolSlug: 'keyword-density-checker', status: 'live' },
      { id: 'content-brief', label: 'Content Brief Builder', slug: 'content/brief', kind: 'topic-ideas', status: 'locked' },
      { id: 'content-audit', label: 'Content Audit', slug: 'content/audit', kind: 'content-optimizer', status: 'live' },
    ],
  },
  {
    id: 'advertising',
    label: 'Advertising',
    icon: 'megaphone',
    items: [
      { id: 'ads-research', label: 'Ads Research', slug: 'ads/research', kind: 'ads-planner', status: 'locked' },
      { id: 'ppc-keywords', label: 'PPC Keyword Planner', slug: 'ads/ppc-keywords', kind: 'ads-planner', status: 'locked' },
      { id: 'ad-copy', label: 'Ad Copy Tester', slug: 'ads/copy', kind: 'ads-planner', status: 'locked' },
      { id: 'landing-audit', label: 'Landing Page Audit', slug: 'ads/landing', kind: 'on-page', status: 'live' },
    ],
  },
  {
    id: 'ai-pr',
    label: 'AI PR',
    icon: 'radio',
    items: [
      { id: 'pr-pitch', label: 'Pitch Generator', slug: 'ai-pr/pitch', kind: 'ai-pr', status: 'locked' },
      { id: 'pr-media', label: 'Media List Builder', slug: 'ai-pr/media', kind: 'ai-pr', status: 'locked' },
      { id: 'pr-monitor', label: 'Mention Monitor', slug: 'ai-pr/monitor', kind: 'ai-pr', status: 'locked' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'share',
    items: [
      { id: 'social-preview', label: 'Post Preview', slug: 'social/preview', kind: 'social-preview', status: 'locked' },
      { id: 'social-calendar', label: 'Post Calendar', slug: 'social/calendar', kind: 'social-preview', status: 'locked' },
      { id: 'hashtag', label: 'Hashtag Analyzer', slug: 'social/hashtags', kind: 'social-preview', status: 'locked' },
      { id: 'utm-campaigns', label: 'UTM Campaigns', slug: 'social/utm', kind: 'generic-analyzer', toolSlug: 'utm-builder', status: 'locked' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'clipboard',
    items: [
      { id: 'my-reports', label: 'My Reports', slug: 'reports', kind: 'report-export', status: 'live' },
      { id: 'brand-report', label: 'Brand Report', slug: 'reports/brand', kind: 'report-export', status: 'live' },
      { id: 'audit-export', label: 'Audit PDF / HTML', slug: 'reports/export', kind: 'report-export', status: 'live' },
    ],
  },
  {
    id: 'app-center',
    label: 'App Center',
    icon: 'grid',
    items: [
      { id: 'apps', label: 'Connected Apps', slug: 'app-center', kind: 'app-center', status: 'locked' },
      { id: 'gsc', label: 'Google Search Console', slug: 'app-center/gsc', kind: 'app-center', status: 'locked' },
      { id: 'ga4', label: 'Google Analytics 4', slug: 'app-center/ga4', kind: 'app-center', status: 'locked' },
      { id: 'tools-hub', label: 'All ToolVerse Tools', slug: 'app-center/tools', kind: 'app-center', status: 'locked' },
    ],
  },
];

/** Top-level live modules for lock-screen “what works now” links (deduped by id). */
export const LIVE_MODULE_HIGHLIGHTS: Array<{ label: string; href: string }> = [
  { label: 'Site Audit', href: '/workspace/site-audit' },
  { label: 'On Page SEO Checker', href: '/workspace/on-page-seo' },
  { label: 'Site Performance', href: '/workspace/site-performance' },
  { label: 'Domain Overview', href: '/workspace/domain-overview' },
  { label: 'Position Tracking', href: '/workspace/position-tracking' },
  { label: 'Keyword Gap', href: '/workspace/keyword-gap' },
  { label: 'Page Link Extractor', href: '/workspace/link-building/extractor' },
  { label: 'Backlink Audit', href: '/workspace/link-building/backlink-audit' },
  { label: 'Traffic Analytics', href: '/workspace/traffic-analytics/overview' },
  { label: 'Content Optimizer', href: '/workspace/content/optimizer' },
  { label: 'Audit PDF / HTML', href: '/workspace/reports/export' },
];

export function flattenNavItems(groups: SeoNavGroup[] = SEO_NAV_GROUPS): SeoNavItem[] {
  const out: SeoNavItem[] = [];
  const walk = (items: SeoNavItem[]) => {
    for (const item of items) {
      out.push(item);
      if (item.children) walk(item.children);
    }
  };
  for (const g of groups) walk(g.items);
  return out;
}

export function findNavItemBySlug(slug: string): SeoNavItem | undefined {
  const normalized = slug.replace(/^\/+|\/+$/g, '');
  return flattenNavItems().find((i) => i.slug === normalized);
}

export function isNavItemLive(item: SeoNavItem): boolean {
  return item.status === 'live';
}

export function getBreadcrumbs(slug: string): Array<{ label: string; href: string }> {
  const crumbs: Array<{ label: string; href: string }> = [
    { label: 'SEO Dashboard', href: '/workspace' },
  ];
  if (!slug || slug === 'home') return crumbs;

  for (const group of SEO_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.slug === slug) {
        crumbs.push({ label: group.label, href: `/workspace/${item.slug}` });
        crumbs.push({ label: item.label, href: `/workspace/${item.slug}` });
        return crumbs;
      }
      if (item.children) {
        const child = item.children.find((c) => c.slug === slug);
        if (child) {
          crumbs.push({ label: group.label, href: `/workspace/${item.slug}` });
          crumbs.push({ label: item.label, href: `/workspace/${item.slug}` });
          crumbs.push({ label: child.label, href: `/workspace/${child.slug}` });
          return crumbs;
        }
      }
    }
  }
  return crumbs;
}
