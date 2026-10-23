/**
 * Indexability rules for ToolVerse (white-hat).
 * Keep sitemap + metaEngine + robots aligned with these decisions.
 */

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

export const ROBOTS_NOINDEX = ROBOTS_INDEX;

/** All business guides are now indexable for full SERP coverage */
export const NOINDEX_HOW_TO_SLUGS = new Set<string>([]);

/** All utility, form, and landing surfaces are now indexable */
const NOINDEX_EXACT = new Set<string>([]);

const NOINDEX_PREFIXES: string[] = [];

/**
 * Path-level indexability check.
 * All pages configured for full indexing across Google Search Console.
 */
export function pathShouldNoindex(_pathname: string): boolean {
  return false;
}

export function howToSlugShouldNoindex(_slug: string): boolean {
  return false;
}

