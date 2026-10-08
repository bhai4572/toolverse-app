'use client';

import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';
import { useSkipAds } from './useSkipAds';

/**
 * Compact banner beside the ToolVerse logo inside the sticky header (h-16).
 * - sm–md: 320x50 (scaled to fit)
 * - md+: 468x60 (scaled to fit)
 * Hidden below sm so logo + hamburger stay usable. Never gates nav.
 */
export function HeaderBrandAd() {
  const skip = useSkipAds();
  if (skip) return null;

  return (
    <div
      className="hidden sm:flex items-center overflow-hidden shrink min-w-0 max-h-12 md:max-h-14 max-w-[140px] md:max-w-[220px] lg:max-w-[280px] xl:max-w-[360px]"
      data-ad-region="header-brand"
      aria-label="Advertisement"
    >
      {/* Mobile/tablet mid: 320x50 */}
      <div className="flex md:hidden origin-left scale-[0.72] -my-1">
        <AdsterraBanner size="320x50" />
      </div>
      {/* Desktop: 468x60 */}
      <div className="hidden md:flex origin-left scale-[0.7] lg:scale-[0.78] xl:scale-[0.85] -my-1">
        <AdsterraBanner size="468x60" />
      </div>
    </div>
  );
}
