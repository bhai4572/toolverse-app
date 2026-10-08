'use client';

import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';
import { useSkipAds } from './useSkipAds';

interface FooterColumnAdProps {
  className?: string;
}

/**
 * Identical 160×300 unit under every footer link column.
 * Same min-height, centered, equal top spacing. Skips home / workspace / admin.
 */
export function FooterColumnAd({ className = '' }: FooterColumnAdProps) {
  const skip = useSkipAds();
  if (skip) return null;

  return (
    <div
      className={`mt-auto pt-6 border-t border-slate-800/80 flex justify-center items-start w-full min-h-[300px] ${className}`}
      data-ad-region="footer-column"
      aria-label="Advertisement"
    >
      <div className="w-[160px] h-[300px] overflow-hidden shrink-0">
        <AdsterraBanner size="160x300" />
      </div>
    </div>
  );
}
