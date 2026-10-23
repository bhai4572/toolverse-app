/**
 * Indexability rules for ToolVerse (white-hat).
 * Keep sitemap (scripts/generate-sitemap.mjs) + metaEngine + robots aligned with these decisions.
 *
 * Strategy: only pages with real, unique content should compete for Google's index.
 * Placeholder/demo data, app shells, private surfaces and thin templated pages are
 * noindex,follow (and excluded from the sitemap) until they carry real content.
 */

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const ROBOTS_NOINDEX = 'noindex, follow';

/** Business "how-to" guides are thin, templated duplicates of the blog guides. */
export const NOINDEX_HOW_TO_SLUGS = new Set<string>([
  'how-to-create-a-business-profile',
  'how-to-generate-and-print-business-qr',
  'how-business-rankings-work',
  'how-to-verify-business-ownership',
  'how-to-verify-your-business',
  'how-to-get-a-toolverse-business-id',
  'how-to-generate-a-business-qr-code',
  'how-to-print-your-toolverse-qr',
  'how-to-collect-honest-customer-reviews',
  'how-sponsored-ranking-works',
  'how-to-claim-a-business',
  'how-to-report-a-fake-business',
]);

/** Utility / app / placeholder surfaces with no standalone search value. */
const NOINDEX_EXACT = new Set<string>([
  '/404',
  '/dashboard',
  '/seo-dashboard', // duplicate of /workspace
  '/sitemap', // HTML sitemap
  '/business', // directory contains demo listings only
  '/business-qr',
  '/submit-startup',
  '/startups', // demo startups only
  '/claim',
  '/guest-posts',
  '/guest-posts/create-pitch',
  '/become-a-publisher',
  '/how-to',
]);

const NOINDEX_PREFIXES: string[] = [
  '/admin',
  '/b/', // QR resolver for demo business IDs
  '/business/', // demo profiles, register, bidding
  '/startups/', // demo startup profiles
  '/publishers/', // demo publisher profiles
  '/how-to/',
];

/**
 * Path-level indexability check.
 */
export function pathShouldNoindex(pathname: string): boolean {
  const p = (pathname.replace(/\/$/, '') || '/').toLowerCase();
  if (NOINDEX_EXACT.has(p)) return true;
  return NOINDEX_PREFIXES.some((prefix) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix));
}

export function howToSlugShouldNoindex(slug: string): boolean {
  return NOINDEX_HOW_TO_SLUGS.has(slug);
}
