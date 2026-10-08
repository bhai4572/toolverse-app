'use client';

import { useEffect } from 'react';
import { ADSTERRA_SOCIAL_BAR_SRC, shouldSkipAds } from './adConfig';

const SCRIPT_ATTR = 'data-adsterra-social-bar';

/**
 * Social bar — load once globally (async). Skips workspace/admin.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shouldSkipAds(window.location.pathname)) return;
    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.dataset.cfasync = 'false';
    script.setAttribute(SCRIPT_ATTR, '1');
    script.src = ADSTERRA_SOCIAL_BAR_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
