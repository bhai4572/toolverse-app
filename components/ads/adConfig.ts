/**
 * Ad configuration.
 *
 * 2026-11-17: All third-party ad networks (Adsterra banners/native/Smart Link, Monetag
 * push/vignette) were removed from the codebase for AdSense review. No ad network code
 * loads anywhere. When AdSense is approved, implement AdSense units inside AdSlot and
 * flip ADS_ENABLED to true. Until then every ad wrapper renders nothing (no empty gaps).
 */
export const ADS_ENABLED = false;

/** Kept for callers that check review mode. */
export const ADSENSE_REVIEW_MODE = true;

/** Monetag zones completely disabled for AdSense compliance */
export const MONETAG_PUSH_ZONE = '';
export const MONETAG_VIGNETTE_ZONE = '';
export const MONETAG_JOB_VIGNETTE_ENABLED = false;
export const MONETAG_BANNER_ZONE = '';
export type BannerSize =
  | '468x60'
  | '160x300'
  | '320x50'
  | '728x90'
  | '160x600'
  | '300x250';

/** Named slots used by AdSlot */
export type AdSlotName =
  | 'sidebar-skyscraper'
  | 'sidebar-half'
  | 'leaderboard'
  | 'mobile-banner'
  | 'mobile-sticky'
  | 'under-title'
  | 'in-content'
  | 'native'
  | 'footer'
  | 'footer-mobile';

export const SLOT_TO_BANNER: Partial<Record<AdSlotName, BannerSize>> = {
  'sidebar-skyscraper': '160x600',
  'sidebar-half': '160x300',
  leaderboard: '728x90',
  /** In-flow mobile top/footer — not fixed sticky */
  'mobile-banner': '320x50',
  /** @deprecated Prefer mobile-banner; kept for legacy callers */
  'mobile-sticky': '320x50',
  'under-title': '468x60',
  'in-content': '300x250',
  footer: '728x90',
  'footer-mobile': '320x50',
};

/** Routes where ads must not load (workspace, admin, legal/policy, 404) */
export function shouldSkipAds(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/workspace' || p.startsWith('/workspace/')) return true;
  if (p === '/seo-dashboard' || p.startsWith('/seo-dashboard/')) return true;
  if (p === '/admin' || p.startsWith('/admin/')) return true;
  if (p === '/business/dashboard' || p.startsWith('/business/dashboard/')) return true;
  if (p === '/404') return true;
  // Policy / trust pages — keep ad-free for AdSense review & accidental-click risk
  if (p.startsWith('/legal/')) return true;
  return false;
}
