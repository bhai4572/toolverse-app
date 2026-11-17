/**
 * Indexability rules for ToolVerse (100% indexing compliant).
 * Strategy: Allow all public pages to be crawled and indexed by Google and other search engines.
 * Only private /admin surfaces and 404 pages are disallowed from indexing.
 */

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const ROBOTS_NOINDEX = 'noindex, nofollow';

/** All How-To guides are indexable content assets. */
export const NOINDEX_HOW_TO_SLUGS = new Set<string>();

/** Only 404 pages are noindexed. */
const NOINDEX_EXACT = new Set<string>([
  '/404',
]);

/** Only private admin routes are noindexed. */
const NOINDEX_PREFIXES: string[] = [
  '/admin',
  '/admin/',
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
 * Returns true ONLY for /admin and /404. All public site pages return false (indexable).
 */
export function pathShouldNoindex(pathname: string): boolean {
  if (!pathname) return false;
  const p = (pathname.replace(/\/$/, '') || '/').toLowerCase();
  if (NOINDEX_EXACT.has(p)) return true;
  return NOINDEX_PREFIXES.some((prefix) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix));
}

export function howToSlugShouldNoindex(_slug: string): boolean {
  return false;
}
