'use client';

import { useEffect } from 'react';
import {
  ADSENSE_REVIEW_MODE,
  MONETAG_JOB_VIGNETTE_ENABLED,
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

/** Check if current page is the jobs section or a shared job link */
export function isJobTarget(pathname: string, search?: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/jobs' || p.startsWith('/jobs/') || p === '/tools/global-job-finder') {
    return true;
  }
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  if (s) {
    try {
      const params = new URLSearchParams(s);
      if (params.has('job') || params.has('jobId') || params.has('job_id') || params.has('id')) {
        return true;
      }
    } catch {}
  }
  return false;
}

/**
 * Standard Monetag Vignette loader matching official snippet:
 * (function(s){s.dataset.zone='12140232',s.src='https://n6wxm.com/vignette.min.js'})(...)
 */
export function injectMonetagVignette(zone: string = MONETAG_VIGNETTE_ZONE): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.getAttribute('data-tv-monetag-vignette') === '1') {
    return false;
  }
  document.documentElement.setAttribute('data-tv-monetag-vignette', '1');

  try {
    const parent = [document.documentElement, document.body].filter(Boolean).pop();
    if (!parent) return false;
    const s = document.createElement('script');
    s.dataset.zone = zone;
    s.src = 'https://n6wxm.com/vignette.min.js';
    parent.appendChild(s);
    return true;
  } catch (err) {
    console.error('Monetag vignette injection error:', err);
    return false;
  }
}

/** Helper to trigger Monetag vignette once per session (e.g. from job card clicks) */
export function triggerJobVignetteOnce(): boolean {
  if (typeof window === 'undefined') return false;
  if (shouldSkipAds(window.location.pathname)) return false;
  if (sessionStorage.getItem(VIGNETTE_DONE_KEY) === '1') return false;
  const ok = injectMonetagVignette(MONETAG_VIGNETTE_ZONE);
  if (ok) {
    try {
      sessionStorage.setItem(VIGNETTE_DONE_KEY, '1');
    } catch {}
  }
  return ok;
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
 * Global ad loaders.
 * - When users enter the Jobs section or open a shared job link: Monetag Vignette loads once.
 * - During ADSENSE_REVIEW_MODE: other intrusive overlays stay off.
 */
export function AdGlobals() {
  const skip = useSkipAds();
  const pathname = useAdsPathname();

  useEffect(() => {
    if (skip || typeof window === 'undefined') return;

    // 1. Jobs Section or Shared Job Link: Show Monetag Vignette once per session
    if (MONETAG_JOB_VIGNETTE_ENABLED && isJobTarget(pathname, window.location.search)) {
      if (ssGet(VIGNETTE_DONE_KEY) !== '1') {
        if (injectMonetagVignette(MONETAG_VIGNETTE_ZONE)) {
          ssSet(VIGNETTE_DONE_KEY, '1');
        }
      }
      return;
    }

    // 2. General site monetization (inactive while ADSENSE_REVIEW_MODE is on)
    if (ADSENSE_REVIEW_MODE) return;

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
      if (injectMonetagVignette(MONETAG_VIGNETTE_ZONE)) {
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

