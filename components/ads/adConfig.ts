/**
 * Adsterra unit registry — human labels match publisher dashboard names.
 * Tools stay free; these units are display-only (never gate UI).
 */

export const ADSTERRA_SMART_LINK =
  'https://araplhn.org/4/24aa254faf80eeda68f896182a2eeb8c';

/** Social bar — load once globally */
export const ADSTERRA_SOCIAL_BAR_SRC =
  'https://bauval.org/14/7f71d90df46e94f6cfe7f371e0ab7756';

/** Native banner */
export const ADSTERRA_NATIVE = {
  scriptSrc: 'https://bauval.org/21/6be7d1c14bcef8d4c03340fddce77229',
  containerId: 'container-6be7d1c14bcef8d4c03340fddce77229',
} as const;

export type BannerSize =
  | '468x60'
  | '160x300'
  | '320x50'
  | '728x90'
  | '160x600'
  | '300x250';

export interface BannerUnit {
  /** Human label for code comments / debugging */
  label: string;
  key: string;
  width: number;
  height: number;
  /** Official Adsterra Banner invoke host (bauval.org/22/{key}/invoke.js 404s) */
  invokeSrc: string;
}

function banner(label: string, key: string, width: number, height: number): BannerUnit {
  return {
    label,
    key,
    width,
    height,
    // Classic atOptions banners use highperformanceformat.com — not bauval.org /22/
    invokeSrc: `https://www.highperformanceformat.com/${key}/invoke.js`,
  };
}

export const ADSTERRA_BANNERS: Record<BannerSize, BannerUnit> = {
  // Banner 468x60
  '468x60': banner('Banner 468x60', '2db4d3571c1acfe734e32c93812badd8', 468, 60),
  // Banner 160x300
  '160x300': banner('Banner 160x300', '4d94a3faa8574eca56593d84b413342e', 160, 300),
  // Banner 320x50
  '320x50': banner('Banner 320x50', '3790727e50dd38c6b9b6c18c9aa7ba5f', 320, 50),
  // Banner 728x90
  '728x90': banner('Banner 728x90', '58b421f12fd34338fc030df8a87fc620', 728, 90),
  // Banner 160x600
  '160x600': banner('Banner 160x600', 'a1e5416d8b97a0f092d1487a1b3cb184', 160, 600),
  // Banner 300x250
  '300x250': banner('Banner 300x250', 'a3cfffec40c430dc3afe55490e310592', 300, 250),
};

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

/** Routes where ads must not load (SEO workspace / admin) */
export function shouldSkipAds(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/workspace' || p.startsWith('/workspace/')) return true;
  if (p === '/seo-dashboard' || p.startsWith('/seo-dashboard/')) return true;
  if (p === '/admin' || p.startsWith('/admin/')) return true;
  if (p === '/business/dashboard' || p.startsWith('/business/dashboard/')) return true;
  return false;
}
