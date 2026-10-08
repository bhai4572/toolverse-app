/** Static feature flags — Pro paused; everything free for now. See docs/TOOLVERSE-PRODUCT-BLUEPRINT.md */

export type PlanTier = 'free' | 'pro';

export interface FeatureFlag {
  id: string;
  name: string;
  tier: PlanTier;
  status: 'live' | 'coming';
  notes?: string;
}

/** All product surfaces are free while Pro is paused. */
export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'core-utilities', name: 'PDF / Image / QR / Calculators', tier: 'free', status: 'live' },
  { id: 'seo-workspace', name: 'SEO Dashboard (Semrush-style workspace)', tier: 'free', status: 'live' },
  { id: 'seo-meta-lite', name: 'Meta, SERP preview, robots, schema', tier: 'free', status: 'live' },
  { id: 'seo-audit-lite', name: 'Site Audit / On-page (URL fetch + HTML)', tier: 'free', status: 'live' },
  { id: 'site-performance', name: 'Site Performance (CWV-style estimates)', tier: 'free', status: 'live' },
  { id: 'keyword-lite', name: 'Keyword Magic / Overview (modeled ideation)', tier: 'free', status: 'live' },
  { id: 'position-tracking', name: 'Position Tracking (your logged ranks)', tier: 'free', status: 'live' },
  { id: 'backlink-workflow', name: 'Link extractor + GSC backlink import', tier: 'free', status: 'live' },
  { id: 'traffic-your-data', name: 'Traffic Analytics (your GA4/CSV import)', tier: 'free', status: 'live' },
  { id: 'reports-export', name: 'Audit HTML / PDF export', tier: 'free', status: 'live' },
  { id: 'ads-supported', name: 'Ad-supported free tier', tier: 'free', status: 'live' },
  // Pro roadmap kept for later — not gated in UI right now
  { id: 'site-audit-full', name: 'Full multi-page site audit crawl', tier: 'pro', status: 'coming', notes: 'Paused — free workspace first' },
  { id: 'backlinks-real', name: 'Real backlink index (third-party/API)', tier: 'pro', status: 'coming', notes: 'Paused' },
  { id: 'fewer-ads', name: 'Fewer / no ads', tier: 'pro', status: 'coming', notes: 'Paused' },
];

export const SEO_SUITE_GROUPS = [
  {
    id: 'workspace',
    name: 'SEO Dashboard',
    description: 'Full Semrush-style left-nav workspace — all modules free. Your data + honest analyzers.',
    tools: [
      { slug: 'seo-audit-analyzer', free: true },
      { slug: 'keyword-research-tool', free: true },
      { slug: 'backlink-checker-analyzer', free: true },
    ],
    proStubs: [] as { name: string; blurb: string }[],
  },
  {
    id: 'onpage',
    name: 'On-Page & Technical',
    description: 'Titles, meta, robots, sitemaps, schema, single-page health.',
    tools: [
      { slug: 'meta-tag-generator', free: true },
      { slug: 'serp-simulator', free: true },
      { slug: 'robots-txt-generator', free: true },
      { slug: 'xml-sitemap-validator', free: true },
      { slug: 'schema-markup-generator', free: true },
      { slug: 'canonical-hreflang-generator', free: true },
      { slug: 'seo-audit-analyzer', free: true },
    ],
    proStubs: [] as { name: string; blurb: string }[],
  },
  {
    id: 'keywords',
    name: 'Keywords & Content',
    description: 'Ideas, density, and content checks — free.',
    tools: [
      { slug: 'keyword-research-tool', free: true },
      { slug: 'keyword-density-checker', free: true },
    ],
    proStubs: [] as { name: string; blurb: string }[],
  },
  {
    id: 'links',
    name: 'Links & Authority',
    description: 'Page link extractor + GSC import workflows (honest labels).',
    tools: [
      { slug: 'backlink-checker-analyzer', free: true },
      { slug: 'utm-builder', free: true },
      { slug: 'url-shortener', free: true },
    ],
    proStubs: [] as { name: string; blurb: string }[],
  },
] as const;
