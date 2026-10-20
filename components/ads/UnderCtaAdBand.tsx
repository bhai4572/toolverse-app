'use client';

import React from 'react';
import { AdSlot } from './AdSlot';

type UnderCtaVariant = 'leaderboard' | 'rectangle' | 'both';

interface UnderCtaAdBandProps {
  /** leaderboard = 728×90 / 320×50; rectangle = 300×250; both = all responsive */
  variant?: UnderCtaVariant;
  region?: string;
  className?: string;
}

/**
 * Single under-CTA ad band. Default is one leaderboard (not stacked units).
 * Display-only — never gates tools; no popunder.
 */
export function UnderCtaAdBand({
  variant = 'leaderboard',
  region = 'under-cta',
  className = '',
}: UnderCtaAdBandProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-4 w-full ${className}`}
      data-ad-region={region}
      aria-label="Advertisement"
    >
      {(variant === 'leaderboard' || variant === 'both') && (
        <>
          <AdSlot slot="leaderboard" bare className="my-0 max-w-[728px] w-full" />
          <AdSlot slot="mobile-banner" bare className="my-0 max-w-[320px] w-full" />
        </>
      )}
      {(variant === 'rectangle' || variant === 'both') && (
        <AdSlot slot="in-content" bare className="my-0" />
      )}
    </div>
  );
}
