/** Static Free vs Pro flags — no backend yet. See docs/TOOLVERSE-PRODUCT-BLUEPRINT.md */

export type PlanTier = 'free' | 'pro';

export interface FeatureFlag {
  id: string;
  name: string;
  tier: PlanTier;
  status: 'live' | 'coming';
  notes?: string;
}

export const FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'core-utilities', name: 'PDF / Image / QR / Calculators', tier: 'free', status: 'live' },
  { id: 'seo-meta-lite', name: 'Meta, SERP preview, robots, schema', tier: 'free', status: 'live' },
  { id: 'seo-audit-lite', name: 'On-page audit (single page / paste HTML)', tier: 'free', status: 'live' },
  { id: 'keyword-lite', name: 'Keyword ideas (lite / modeled)', tier: 'free', status: 'live' },
  { id: 'ads-supported', name: 'Ad-supported free tier', tier: 'free', status: 'live' },
  { id: 'site-audit-full', name: 'Full multi-page site audit crawl', tier: 'pro', status: 'coming' },
  { id: 'keyword-depth', name: 'Keyword research depth + saved sets', tier: 'pro', status: 'coming' },
  { id: 'rank-tracking', name: 'Rank tracking', tier: 'pro', status: 'coming' },
  { id: 'backlinks-real', name: 'Real backlink index', tier: 'pro', status: 'coming' },
  { id: 'competitor-gap', name: 'Competitor keyword gaps', tier: 'pro', status: 'coming' },
  { id: 'white-label', name: 'White-label PDF reports', tier: 'pro', status: 'coming' },
  { id: 'fewer-ads', name: 'Fewer / no ads', tier: 'pro', status: 'coming' },
  { id: 'api-access', name: 'API access', tier: 'pro', status: 'coming' },
  { id: 'team-seats', name: 'Team seats', tier: 'pro', status: 'coming' },
];

export const SEO_SUITE_GROUPS = [
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
    proStubs: [
      { name: 'Full-site crawl audit', blurb: 'Crawl hundreds of URLs, issue queue, history.' },
      { name: 'Core Web Vitals lab', blurb: 'Field + lab metrics per URL (Pro).' },
    ],
  },
  {
    id: 'keywords',
    name: 'Keywords & Content',
    description: 'Ideas, density, and content checks — lite free, depth paid.',
    tools: [
      { slug: 'keyword-research-tool', free: true },
      { slug: 'keyword-density-checker', free: true },
    ],
    proStubs: [
      { name: 'Keyword Magic depth', blurb: 'Larger sets, filters, saved lists, CSV history.' },
      { name: 'Content briefs', blurb: 'Outline + intent briefs from seed keywords.' },
    ],
  },
  {
    id: 'links',
    name: 'Links & Authority',
    description: 'Link helpers today; real index later (honest labels on modeled tools).',
    tools: [
      { slug: 'backlink-checker-analyzer', free: true },
      { slug: 'utm-builder', free: true },
      { slug: 'url-shortener', free: true },
    ],
    proStubs: [
      { name: 'Live backlink index', blurb: 'Referring domains from a real crawl/API — not modeled estimates alone.' },
      { name: 'Toxic link review', blurb: 'Risk scoring + disavow export.' },
    ],
  },
  {
    id: 'tracking',
    name: 'Tracking & Competitors',
    description: 'Coming in Pro phases — no fake dashboards.',
    tools: [] as { slug: string; free: boolean }[],
    proStubs: [
      { name: 'Rank tracker', blurb: 'Daily positions for your keywords × domains.' },
      { name: 'Competitor gap', blurb: 'Keywords they rank for that you don’t.' },
      { name: 'White-label reports', blurb: 'PDF reports with your agency logo.' },
    ],
  },
] as const;
