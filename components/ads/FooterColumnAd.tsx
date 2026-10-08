'use client';

import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';
import { useSkipAds } from './useSkipAds';
import type { BannerSize } from './adConfig';

interface FooterColumnAdProps {
  /** Prefer 160x300 (fits column) or 300x250 */
  size?: BannerSize;
  className?: string;
}

/**
 * Compact banner for empty space under each footer link column.
 * Visible on mobile stacked + desktop 4-col. Skips home / workspace / admin.
 */
export function FooterColumnAd({ size = '160x300', className = '' }: FooterColumnAdProps) {
  const skip = useSkipAds();
  if (skip) return null;

  const scaleClass =
    size === '300x250'
      ? 'origin-top scale-[0.92] sm:scale-100 max-w-[300px]'
      : 'origin-top scale-100 max-w-[160px]';

  return (
    <div
      className={`mt-6 pt-4 border-t border-slate-800/80 flex justify-center w-full ${className}`}
      data-ad-region="footer-column"
      aria-label="Advertisement"
    >
      <div className={`${scaleClass} overflow-hidden`}>
        <AdsterraBanner size={size} />
      </div>
    </div>
  );
}
