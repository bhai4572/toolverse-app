/**
 * Semrush-style left-nav tree for ToolVerse SEO Workspace.
 * Structure mirrors common SEO suite IA; labels are ToolVerse originals (not Semrush copy).
 */

export interface SeoNavItem {
  id: string;
  label: string;
  /** Path segment under /workspace/ */
  slug: string;
  /** Module kind drives the interactive MVP */
  kind: ModuleKind;
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
      },
      {
        id: 'traffic-analytics',
        label: 'Traffic Analytics',
        slug: 'traffic-analytics',
        kind: 'traffic-your-data',
        children: [
          { id: 'ta-overview', label: 'Overview', slug: 'traffic-analytics/overview', kind: 'traffic-your-data' },
          { id: 'ta-sources', label: 'Traffic Sources', slug: 'traffic-analytics/sources', kind: 'traffic-your-data' },
          { id: 'ta-geo', label: 'Geo Distribution', slug: 'traffic-analytics/geo', kind: 'traffic-your-data' },
          { id: 'ta-pages', label: 'Top Pages', slug: 'traffic-analytics/pages', kind: 'traffic-your-data' },
          { id: 'ta-subfolders', label: 'Subfolders', slug: 'traffic-analytics/subfolders', kind: 'traffic-your-data' },
          { id: 'ta-destinations', label: 'Destinations', slug: 'traffic-analytics/destinations', kind: 'traffic-your-data' },
          { id: 'ta-competitors', label: 'Competitors', slug: 'traffic-analytics/competitors', kind: 'generic-analyzer' },
          { id: 'ta-devices', label: 'Devices', slug: 'traffic-analytics/devices', kind: 'traffic-your-data' },
          { id: 'ta-trends', label: 'Trends', slug: 'traffic-analytics/trends', kind: 'traffic-your-data' },
        ],
      },
      {
        id: 'one2target',
        label: 'Audience Insights',
        slug: 'audience-insights',
        kind: 'generic-analyzer',
      },
      {
        id: 'eyeon',
        label: 'Trend Watch',
        slug: 'trend-watch',
        kind: 'generic-analyzer',
      },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: 'search',
    items: [
      { id: 'domain-overview', label: 'Domain Overview', slug: 'domain-overview', kind: 'domain-overview' },
      {
        id: 'organic-research',
        label: 'Organic Research',
        slug: 'organic-research',
        kind: 'organic-research',
        children: [
          { id: 'or-overview', label: 'Overview', slug: 'organic-research/overview', kind: 'organic-research' },
          { id: 'or-positions', label: 'Positions', slug: 'organic-research/positions', kind: 'position-tracking' },
          { id: 'or-pages', label: 'Pages', slug: 'organic-research/pages', kind: 'url-audit' },
          { id: 'or-competitors', label: 'Competitors', slug: 'organic-research/competitors', kind: 'keyword-gap' },
        ],
      },
      { id: 'keyword-overview', label: 'Keyword Overview', slug: 'keyword-overview', kind: 'keyword-overview', toolSlug: 'keyword-research-tool' },
      { id: 'keyword-magic', label: 'Keyword Magic', slug: 'keyword-magic', kind: 'keyword-magic', toolSlug: 'keyword-research-tool' },
      { id: 'keyword-gap', label: 'Keyword Gap', slug: 'keyword-gap', kind: 'keyword-gap' },
      { id: 'keyword-manager', label: 'Keyword Manager', slug: 'keyword-manager', kind: 'position-tracking' },
      { id: 'position-tracking', label: 'Position Tracking', slug: 'position-tracking', kind: 'position-tracking' },
      { id: 'site-audit', label: 'Site Audit', slug: 'site-audit', kind: 'url-audit', toolSlug: 'seo-audit-analyzer' },
      { id: 'on-page', label: 'On Page SEO Checker', slug: 'on-page-seo', kind: 'on-page', toolSlug: 'seo-audit-analyzer' },
      { id: 'site-performance', label: 'Site Performance', slug: 'site-performance', kind: 'site-performance' },
      {
        id: 'link-building',
        label: 'Link Building',
        slug: 'link-building',
        kind: 'link-extractor',
        children: [
          { id: 'lb-backlink-analytics', label: 'Backlink Analytics', slug: 'link-building/backlink-analytics', kind: 'backlink-checklist', toolSlug: 'backlink-checker-analyzer' },
          { id: 'lb-backlink-audit', label: 'Backlink Audit', slug: 'link-building/backlink-audit', kind: 'backlink-checklist' },
          { id: 'lb-link-building', label: 'Outreach Tracker', slug: 'link-building/outreach', kind: 'generic-analyzer' },
          { id: 'lb-bulk', label: 'Bulk URL Analysis', slug: 'link-building/bulk', kind: 'url-audit' },
          { id: 'lb-extractor', label: 'Page Link Extractor', slug: 'link-building/extractor', kind: 'link-extractor' },
        ],
      },
      { id: 'listing-mgmt', label: 'Listing Management', slug: 'listing-management', kind: 'local-checklist' },
    ],
  },
  {
    id: 'ai-visibility',
    label: 'AI Visibility',
    icon: 'sparkles',
    items: [
      { id: 'ai-overview', label: 'AI Overview', slug: 'ai-visibility', kind: 'ai-visibility' },
      { id: 'ai-prompts', label: 'Prompt Tracker', slug: 'ai-visibility/prompts', kind: 'ai-visibility' },
      { id: 'ai-brand', label: 'Brand Mentions Checklist', slug: 'ai-visibility/brand', kind: 'ai-visibility' },
      { id: 'ai-citations', label: 'Citation Readiness', slug: 'ai-visibility/citations', kind: 'ai-visibility' },
    ],
  },
  {
    id: 'local',
    label: 'Local',
    icon: 'map',
    items: [
      { id: 'map-rank', label: 'Map Pack Tracker', slug: 'local/map-rank', kind: 'local-checklist' },
      { id: 'gbp', label: 'GBP Checklist', slug: 'local/gbp', kind: 'local-checklist' },
      { id: 'local-listings', label: 'Listings Audit', slug: 'local/listings', kind: 'local-checklist' },
      { id: 'reviews', label: 'Reviews Workflow', slug: 'local/reviews', kind: 'local-checklist' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'file',
    items: [
      { id: 'seo-writing', label: 'SEO Writing Assistant', slug: 'content/writing', kind: 'writing-assistant', toolSlug: 'ai-article-writer' },
      { id: 'topic-research', label: 'Topic Research', slug: 'content/topics', kind: 'topic-ideas' },
      { id: 'content-optimizer', label: 'Content Optimizer', slug: 'content/optimizer', kind: 'content-optimizer', toolSlug: 'keyword-density-checker' },
      { id: 'content-brief', label: 'Content Brief Builder', slug: 'content/brief', kind: 'topic-ideas' },
      { id: 'content-audit', label: 'Content Audit', slug: 'content/audit', kind: 'content-optimizer' },
    ],
  },
  {
    id: 'advertising',
    label: 'Advertising',
    icon: 'megaphone',
    items: [
      { id: 'ads-research', label: 'Ads Research', slug: 'ads/research', kind: 'ads-planner' },
      { id: 'ppc-keywords', label: 'PPC Keyword Planner', slug: 'ads/ppc-keywords', kind: 'ads-planner' },
      { id: 'ad-copy', label: 'Ad Copy Tester', slug: 'ads/copy', kind: 'ads-planner' },
      { id: 'landing-audit', label: 'Landing Page Audit', slug: 'ads/landing', kind: 'on-page' },
    ],
  },
  {
    id: 'ai-pr',
    label: 'AI PR',
    icon: 'radio',
    items: [
      { id: 'pr-pitch', label: 'Pitch Generator', slug: 'ai-pr/pitch', kind: 'ai-pr' },
      { id: 'pr-media', label: 'Media List Builder', slug: 'ai-pr/media', kind: 'ai-pr' },
      { id: 'pr-monitor', label: 'Mention Monitor', slug: 'ai-pr/monitor', kind: 'ai-pr' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'share',
    items: [
      { id: 'social-preview', label: 'Post Preview', slug: 'social/preview', kind: 'social-preview' },
      { id: 'social-calendar', label: 'Post Calendar', slug: 'social/calendar', kind: 'social-preview' },
      { id: 'hashtag', label: 'Hashtag Analyzer', slug: 'social/hashtags', kind: 'social-preview' },
      { id: 'utm-campaigns', label: 'UTM Campaigns', slug: 'social/utm', kind: 'generic-analyzer', toolSlug: 'utm-builder' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'clipboard',
    items: [
      { id: 'my-reports', label: 'My Reports', slug: 'reports', kind: 'report-export' },
      { id: 'brand-report', label: 'Brand Report', slug: 'reports/brand', kind: 'report-export' },
      { id: 'audit-export', label: 'Audit PDF / HTML', slug: 'reports/export', kind: 'report-export' },
    ],
  },
  {
    id: 'app-center',
    label: 'App Center',
    icon: 'grid',
    items: [
      { id: 'apps', label: 'Connected Apps', slug: 'app-center', kind: 'app-center' },
      { id: 'gsc', label: 'Google Search Console', slug: 'app-center/gsc', kind: 'app-center' },
      { id: 'ga4', label: 'Google Analytics 4', slug: 'app-center/ga4', kind: 'app-center' },
      { id: 'tools-hub', label: 'All ToolVerse Tools', slug: 'app-center/tools', kind: 'app-center' },
    ],
  },
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
