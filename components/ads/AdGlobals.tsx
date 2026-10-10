'use client';

import { useEffect } from 'react';
import {
  MONETAG_PUSH_ZONE,
  MONETAG_VIGNETTE_ZONE,
  shouldSkipAds,
} from './adConfig';
import { useAdsPathname, useSkipAds } from './useSkipAds';

const VIGNETTE_OK_KEY = 'tv_monetag_vignette_ok';
const VIGNETTE_DONE_KEY = 'tv_monetag_vignette_done';
const ENTRY_PATH_KEY = 'tv_monetag_entry_path';
const VIGNETTE_DELAY_MS = 18_000;

/** Inner content surfaces — vignette never on bare homepage. */
function isVignettePath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  return (
    p === '/tools' ||
    p.startsWith('/tools/') ||
    p === '/blog' ||
    p.startsWith('/blog/') ||
    p === '/jobs' ||
    p.startsWith('/jobs/') ||
    p.startsWith('/category/') ||
    p === '/how-to' ||
    p.startsWith('/how-to/') ||
    p === '/study' ||
    p.startsWith('/study/') ||
    p === '/immigration' ||
    p.startsWith('/immigration/') ||
    p === '/cars' ||
    p.startsWith('/cars/')
  );
}

function injectOnce(markerAttr: string, src: string, zone: string): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.getAttribute(markerAttr) === '1') return false;
  document.documentElement.setAttribute(markerAttr, '1');
  const s = document.createElement('script');
  s.async = true;
  s.dataset.zone = zone;
  s.src = src;
  (document.body || document.documentElement).appendChild(s);
  return true;
}

function ssGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function ssSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

/**
 * Global ad loaders. Adsterra Social Bar removed.
 * Monetag In-Page Push (public) + gated Vignette (inner pages, once/session).
 * Never gates tools. No popunder.
 */
export function AdGlobals() {
  const skip = useSkipAds();
  const pathname = useAdsPathname();

  useEffect(() => {
    if (skip || typeof window === 'undefined') return;

    // In-Page Push — low layout impact; once per document
    injectOnce(
      'data-tv-monetag-push',
      'https://nap5k.com/tag.min.js',
      MONETAG_PUSH_ZONE
    );

    if (!ssGet(ENTRY_PATH_KEY)) {
      ssSet(ENTRY_PATH_KEY, window.location.pathname);
    }

    const tryInjectVignette = () => {
      if (shouldSkipAds(window.location.pathname)) return;
      if (ssGet(VIGNETTE_OK_KEY) !== '1') return;
      if (ssGet(VIGNETTE_DONE_KEY) === '1') return;
      if (!isVignettePath(window.location.pathname)) return;
      if (
        injectOnce(
          'data-tv-monetag-vignette',
          'https://n6wxm.com/vignette.min.js',
          MONETAG_VIGNETTE_ZONE
        )
      ) {
        ssSet(VIGNETTE_DONE_KEY, '1');
      }
    };

    const enableAndMaybeInject = () => {
      ssSet(VIGNETTE_OK_KEY, '1');
      tryInjectVignette();
    };

    if (ssGet(VIGNETTE_OK_KEY) === '1') {
      tryInjectVignette();
      return;
    }

    // Unlock after leaving landing path, or after ~18s (protects first paint)
    const entry = ssGet(ENTRY_PATH_KEY) || window.location.pathname;
    if (window.location.pathname !== entry) {
      enableAndMaybeInject();
      return;
    }

    const timer = window.setTimeout(enableAndMaybeInject, VIGNETTE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [skip, pathname]);

  return null;
}
