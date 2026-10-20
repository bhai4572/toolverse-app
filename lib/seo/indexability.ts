/**
 * Indexability rules for ToolVerse (white-hat).
 * Keep sitemap + metaEngine + robots aligned with these decisions.
 */

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const ROBOTS_NOINDEX = 'noindex, follow';

/**
 * Soft-duplicate /how-to/* business guides.
 * Keep the stronger URL indexed; noindex near-duplicates to cut doorway risk.
 * Canonical topic mapping (documented in seo/FULL-SEO-AUDIT.md):
 * - verify → how-to-verify-business-ownership
 * - QR generate+print → how-to-generate-and-print-business-qr
 */
export const NOINDEX_HOW_TO_SLUGS = new Set([
  'how-to-verify-your-business',
  'how-to-generate-a-business-qr-code',
  'how-to-print-your-toolverse-qr',
]);

/** Utility / form / private surfaces — useful UX, not ranking targets. */
const NOINDEX_EXACT = new Set([
  '/404',
  '/badges',
  '/claim',
  '/submit',
  '/submit-startup',
  '/dashboard',
  '/admin',
  '/admin/login',
  '/guest-posts/create-pitch',
  '/business/register',
  '/business/dashboard',
  '/business-qr',
]);

const NOINDEX_PREFIXES = [
  '/workspace',
  '/seo-dashboard',
  '/admin/',
  '/dashboard/',
  '/scratch/',
  '/business/dashboard/',
];

/**
 * Path-level noindex (before content-specific rules like isToolGuide).
 */
export function pathShouldNoindex(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (NOINDEX_EXACT.has(clean)) return true;
  return NOINDEX_PREFIXES.some((p) => clean === p.replace(/\/$/, '') || clean.startsWith(p));
}

export function howToSlugShouldNoindex(slug: string): boolean {
  return NOINDEX_HOW_TO_SLUGS.has(slug);
}
