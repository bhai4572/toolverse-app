'use client';

import { useEffect } from 'react';
import { ADSTERRA_SOCIAL_BAR_SRC } from './adConfig';
import { useSkipAds } from './useSkipAds';

const SCRIPT_ATTR = 'data-adsterra-social-bar';

/**
 * Social bar — load once on monetized routes (async). Skips workspace / admin.
 */
export function AdsterraSocialBar() {
  const skip = useSkipAds();

  useEffect(() => {
    if (typeof window === 'undefined' || skip) return;
    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.dataset.cfasync = 'false';
    script.setAttribute(SCRIPT_ATTR, '1');
    script.src = ADSTERRA_SOCIAL_BAR_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [skip]);

  return null;
}
