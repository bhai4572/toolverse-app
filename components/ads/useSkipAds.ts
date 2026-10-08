'use client';

import { useEffect, useState } from 'react';
import { shouldSkipAds } from './adConfig';

type Listener = () => void;

const listeners = new Set<Listener>();
let patched = false;
let origPush: History['pushState'] | null = null;
let origReplace: History['replaceState'] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

function ensureHistoryPatch() {
  if (typeof window === 'undefined' || patched) return;
  patched = true;
  origPush = history.pushState.bind(history);
  origReplace = history.replaceState.bind(history);
  history.pushState = (...args: Parameters<History['pushState']>) => {
    origPush!(...args);
    notify();
  };
  history.replaceState = (...args: Parameters<History['replaceState']>) => {
    origReplace!(...args);
    notify();
  };
  window.addEventListener('popstate', notify);
}

/**
 * Reactive pathname for SPA navigations (pushState / popstate).
 */
export function useAdsPathname(): string {
  const [path, setPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    ensureHistoryPatch();
    const sync = () => setPath(window.location.pathname);
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  return path;
}

/**
 * Reactive skip flag for SPA navigations (pushState / popstate).
 * Workspace / admin stay ad-free after client-side route changes (homepage is monetized).
 */
export function useSkipAds(): boolean {
  const path = useAdsPathname();
  return shouldSkipAds(path);
}
