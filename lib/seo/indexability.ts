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
