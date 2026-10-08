'use client';

import React from 'react';
import { AdSlot } from './AdSlot';
import { useSkipAds } from './useSkipAds';

/**
 * Single clean footer leaderboard row below the 4-column grid.
 * Desktop: 728×90. Mobile: 320×50. Skips homepage / workspace / admin.
 */
export function FooterAdBar() {
  const skip = useSkipAds();
  if (skip) return null;

  return (
    <div
      className="ad-footer my-6 flex flex-col items-center justify-center w-full py-4 border-y border-slate-800/80 min-h-[50px] md:min-h-[90px]"
      data-ad-region="footer"
      aria-label="Advertisement"
    >
      <AdSlot slot="footer" slotId="footer-banner" bare className="my-0 max-w-[728px] w-full" />
      <AdSlot slot="footer-mobile" bare className="my-0 max-w-[320px] w-full" />
    </div>
  );
}
