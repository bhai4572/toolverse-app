/**
 * Centralized Indexability Rules for ToolVerse (SEO & AdSense Quality Compliance).
 *
 * Strategy:
 * - INDEX: Homepage, all live canonical browser tools, 13 tool categories, CV Maker,
 *   original hand-written blog/pillar guides, legal/trust pages, curated regional/topical hubs,
 *   and the 7 rich study-abroad guides.
 * - NOINDEX (noindex, nofollow): Private/app utility routes (/admin, /dashboard, /workspace, /pricing, /404)
 *   and redirected duplicate aliases (/tools/cv-maker).
 * - NOINDEX (noindex, follow): Thin, repetitive, empty, aggregated, or unrelated programmatic directories
 *   (/how-to/*, /products/*, /payment-methods/*, /phones/*, /business/*, /startups/*, /guest-posts/*,
 *   /publishers/*, /travel/*, /jobs/*, /news/*, /submit*, /claim, /badges, /leaderboard,
 *   /alternatives/*, /compare/*, /collections/*, /questions/*, and 186 thin /study/* country shells).
 *   URLs remain live for users, and link equity continues to flow to core tools and guides.
 */

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const ROBOTS_NOINDEX = 'noindex, nofollow';

export const ROBOTS_NOINDEX_FOLLOW = 'noindex, follow';

/** Hand-written pillar guides that MUST be indexed (keep in sync with lib/blog/toolGuides.ts). */
export const INDEXABLE_PILLAR_GUIDES = new Set<string>([
  'best-free-privacy-first-online-tools-2026',
  'how-to-compress-image-to-target-size-under-50kb',
  'how-to-merge-pdf-files-privately-without-uploading',
  'convert-heic-to-jpg-windows-iphone',
  'how-to-generate-barcodes-free-code-128-ean-upc',
  'pakistan-salary-tax-calculator-slabs-guide',
  'how-to-build-utm-campaign-urls',
  'top-high-paying-remote-jobs-worldwide',
  'best-free-semrush-ahrefs-alternatives-2026',
  'freelance-rate-calculator-guide-paypal-stripe-fees',
  'compress-pdf-for-visa-immigration-portal-guide',
  'us-uk-schengen-passport-photo-dimensions-guide',
  'how-to-check-current-print-jobs-in-queue-windows',
]);

/** Rich, hand-crafted study destinations. Thin doorway shells are noindexed. */
export const INDEXABLE_STUDY_SLUGS = new Set<string>([
  'usa',
  'uk',
  'canada',
  'australia',
  'new-zealand',
  'europe',
  'germany',
]);

/** Private / non-public app surfaces & redirected aliases (strict noindex, nofollow). */
const NOINDEX_EXACT = new Set<string>([
  '/404',
  '/dashboard',
  '/workspace',
  '/seo-dashboard',
  '/pricing',
  '/tools/cv-maker',
  '/business/dashboard',
]);

/** Private prefixes (strict noindex, nofollow). */
const NOINDEX_PREFIXES: string[] = [
  '/admin',
  '/admin/',
  '/workspace/',
  '/seo-dashboard/',
];

/**
 * Thin / empty / aggregated / programmatic sections kept live for users
 * but marked noindex, follow and excluded from sitemap.xml to protect
 * site-wide quality and AdSense compliance.
 */
export const THIN_NOINDEX_ENABLED = true;

export const THIN_NOINDEX_EXACT = new Set<string>([
  '/how-to',
  '/products',
  '/payment-methods',
  '/phones',
  '/leaderboard',
  '/submit',
  '/claim',
  '/badges',
  '/travel',
  '/jobs',
  '/news',
  '/tools/global-job-finder',
  '/tools/b2b-email-finder',
  '/business',
  '/business-qr',
  '/startups',
  '/submit-startup',
  '/guest-posts',
  '/become-a-publisher',
  '/alternatives',
  '/collections',
  '/questions',
]);

export const THIN_NOINDEX_PREFIXES: string[] = [
  '/how-to/',
  '/products/',
  '/payment-methods/',
  '/phones/',
  '/travel/',
  '/jobs/',
  '/news/',
  '/business/',
  '/b/',
  '/startups/',
  '/guest-posts/',
  '/publishers/',
  '/alternatives/',
  '/compare/',
  '/collections/',
  '/questions/',
];

export function pathIsThinNoindex(pathname: string): boolean {
  if (!THIN_NOINDEX_ENABLED || !pathname) return false;
  const p = (pathname.replace(/\/$/, '') || '/').toLowerCase();
  if (THIN_NOINDEX_EXACT.has(p)) return true;
  if (THIN_NOINDEX_PREFIXES.some((prefix) => p.startsWith(prefix))) return true;

  // Filter thin /study/* countries: only keep verified Tier-1 rich guides
  if (p.startsWith('/study/')) {
    const slug = p.replace(/^\/study\//, '').split('/')[0];
    if (slug && !INDEXABLE_STUDY_SLUGS.has(slug)) {
      return true;
    }
  }

  // Filter template /blog/how-to-* posts (keep hand-written pillar guides)
  if (p.startsWith('/blog/how-to-')) {
    const slug = p.replace(/^\/blog\//, '');
    if (!INDEXABLE_PILLAR_GUIDES.has(slug)) {
      return true;
    }
  }

  return false;
}

/**
 * Strict noindex, nofollow check for private/app/admin/duplicate routes.
 */
export function pathShouldNoindex(pathname: string): boolean {
  if (!pathname) return false;
  const p = (pathname.replace(/\/$/, '') || '/').toLowerCase();

  if (NOINDEX_EXACT.has(p)) return true;
  if (NOINDEX_PREFIXES.some((prefix) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix))) {
    return true;
  }

  // Also return true for thin noindex paths when callers only check pathShouldNoindex
  if (pathIsThinNoindex(p)) return true;

  return false;
}

export function howToSlugShouldNoindex(slug: string): boolean {
  if (!slug) return true;
  return !INDEXABLE_PILLAR_GUIDES.has(slug);
}
