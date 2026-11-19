/**
 * Indexability rules for ToolVerse (SEO & AdSense Quality Compliance).
 * Strategy:
 * - High-value core tools, hand-written guides, and rich regional hubs are fully indexed.
 * - Thin doorway shells (188 auto-generated /study/* country shells), auto-generated template how-to posts,
 *   SaaS directory stubs (/products/*), app utility surfaces (/dashboard, /workspace), and /pricing are marked NOINDEX
 *   to eliminate thin content penalties and ensure rapid AdSense approval.
 */

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const ROBOTS_NOINDEX = 'noindex, nofollow';

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

/** Exactly matched thin surfaces disallowed from indexing. */
const NOINDEX_EXACT = new Set<string>([
  '/404',
  '/dashboard',
  '/workspace',
  '/pricing',
  '/news',
]);

/** Prefixes disallowed from indexing. */
const NOINDEX_PREFIXES: string[] = [
  '/admin',
  '/admin/',
  '/products',
  '/products/',
  '/badges',
  '/claim',
];

/**
 * Thin / programmatic sections kept live (URLs work, users can still use them) but
 * briefly de-indexed on 2026-11-17. Owner decision (same day): keep them INDEXED for traffic,
 * so THIN_NOINDEX_ENABLED = false. Flip to true (here AND in scripts/generate-sitemap.mjs)
 * to noindex + drop them from the sitemap again.
 * Uses "noindex, follow" so link equity still flows to tools/guides.
 */
export const THIN_NOINDEX_ENABLED = false;

export const ROBOTS_NOINDEX_FOLLOW = 'noindex, follow';

export const THIN_NOINDEX_EXACT = new Set<string>([
  '/products',
  '/leaderboard',
  '/submit',
  '/claim',
  '/badges',
  '/study',
  '/travel',
  '/jobs',
  '/tools/global-job-finder',
  '/tools/b2b-email-finder',
  '/business',
  '/business-qr',
  '/startups',
  '/submit-startup',
  '/guest-posts',
  '/become-a-publisher',
  '/dashboard',
]);

export const THIN_NOINDEX_PREFIXES: string[] = [
  '/products/',
  '/study/',
  '/travel/',
  '/jobs/',
  '/business/',
  '/b/',
  '/startups/',
  '/guest-posts/',
  '/publishers/',
];

export function pathIsThinNoindex(pathname: string): boolean {
  if (!THIN_NOINDEX_ENABLED || !pathname) return false;
  const p = (pathname.replace(/\/$/, '') || '/').toLowerCase();
  if (THIN_NOINDEX_EXACT.has(p)) return true;
  return THIN_NOINDEX_PREFIXES.some((prefix) => p.startsWith(prefix));
}

/**
 * Path-level indexability check.
 * Enforces quality thresholds for Google Search Console and AdSense.
 */
export function pathShouldNoindex(pathname: string): boolean {
  if (!pathname) return false;
  const p = (pathname.replace(/\/$/, '') || '/').toLowerCase();

  if (NOINDEX_EXACT.has(p)) return true;
  if (NOINDEX_PREFIXES.some((prefix) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix))) {
    return true;
  }

  // Filter thin /study/* countries: only keep verified Tier-1 rich guides
  if (p.startsWith('/study/')) {
    const slug = p.replace(/^\/study\//, '').split('/')[0];
    if (slug && !INDEXABLE_STUDY_SLUGS.has(slug)) {
      return true;
    }
  }

  // Filter template /blog/how-to-* posts (keep hand-written guides)
  if (p.startsWith('/blog/how-to-')) {
    const slug = p.replace(/^\/blog\//, '');
    if (!INDEXABLE_PILLAR_GUIDES.has(slug)) {
      return true;
    }
  }

  return false;
}

export function howToSlugShouldNoindex(slug: string): boolean {
  if (!slug) return true;
  return !INDEXABLE_PILLAR_GUIDES.has(slug);
}
