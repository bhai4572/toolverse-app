'use client';

import { useEffect } from 'react';
import {
  ADSTERRA_POPUNDER_SRC,
  POPUNDER_SESSION_KEY,
  shouldSkipAds,
} from './adConfig';

const SCRIPT_ATTR = 'data-adsterra-popunder';

/**
 * Popunder — max once per browser session (localStorage gate).
 * Skips workspace/admin routes.
 */
export function AdsterraPopunder() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shouldSkipAds(window.location.pathname)) return;

    try {
      if (localStorage.getItem(POPUNDER_SESSION_KEY) === '1') return;
    } catch {
      // private mode — still allow one load this page view via DOM flag
    }

    if (document.querySelector(`script[${SCRIPT_ATTR}]`)) return;

    const script = document.createElement('script');
    script.dataset.cfasync = 'false';
    script.setAttribute(SCRIPT_ATTR, '1');
    script.src = ADSTERRA_POPUNDER_SRC;
    script.async = true;
    document.body.appendChild(script);

    try {
      localStorage.setItem(POPUNDER_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
