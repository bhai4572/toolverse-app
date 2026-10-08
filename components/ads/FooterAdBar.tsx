'use client';

import React from 'react';
import { AdSlot } from './AdSlot';
import { useSkipAds } from './useSkipAds';

/**
 * Dense footer ad strip — fills footer empty space without covering links.
 * Desktop: 728x90 + 300x250 row. Mobile: 320x50 + 300x250.
 * Skips homepage / workspace / admin.
 */
export function FooterAdBar() {
  const skip = useSkipAds();
  if (skip) return null;

  return (
    <div
      className="ad-footer my-6 flex flex-col items-center justify-center gap-4 w-full py-4 border-y border-slate-800/80"
      data-ad-region="footer"
      aria-label="Advertisement"
    >
      <div className="flex flex-col items-center justify-center gap-2 min-h-[50px] md:min-h-[90px] w-full">
        <AdSlot slot="footer" slotId="footer-banner" bare className="my-0 max-w-[728px] w-full" />
        <AdSlot slot="footer-mobile" bare className="my-0 max-w-[320px] w-full" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <AdSlot slot="in-content" bare className="my-0" />
        <AdSlot slot="native" bare className="my-0 hidden md:block max-w-[468px]" />
      </div>
    </div>
  );
}
