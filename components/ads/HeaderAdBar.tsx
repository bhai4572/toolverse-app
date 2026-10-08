'use client';

import React from 'react';
import { AdSlot } from './AdSlot';
import { useSkipAds } from './useSkipAds';

/**
 * Persistent top ad bar — 728x90 desktop / 320x50 mobile (in-flow under site header).
 * Skips workspace / admin. Not sticky (site Header stays sticky).
 */
export function HeaderAdBar() {
  const skip = useSkipAds();
  if (skip) return null;

  return (
    <div
      className="ad-header-bar w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80"
      data-ad-region="header"
      aria-label="Advertisement"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col items-center justify-center gap-1 min-h-[50px] md:min-h-[90px]">
        <AdSlot slot="leaderboard" bare className="my-0 max-w-[728px] w-full" />
        <AdSlot slot="mobile-banner" bare className="my-0 max-w-[320px] w-full" />
      </div>
    </div>
  );
}
