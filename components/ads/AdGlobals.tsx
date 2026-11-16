'use client';

/**
 * AdGlobals: AdSense Compliance Mode
 * Push, vignette, and popup scripts (e.g. Monetag, Adsterra Social Bar) are completely disabled.
 * Only non-intrusive AdSense display ad slots are allowed.
 */
export function isJobTarget(_pathname: string, _search?: string): boolean {
  return false;
}

export function injectMonetagVignette(_zone?: string): boolean {
  return false;
}

export function triggerJobVignetteOnce(): boolean {
  return false;
}

export function AdGlobals() {
  return null;
}
