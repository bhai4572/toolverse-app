'use client';

import React from 'react';
import { AdSlot } from './AdSlot';

interface JobsGridWithAdsProps {
  /** Job card elements (already rendered) */
  cards: React.ReactNode[];
  /** Insert a content-break ad after every N cards (default 4 = 2 rows × 2 cols) */
  every?: number;
  className?: string;
}

/**
 * 2-column jobs grid with at most one ad break (after the first chunk).
 * Default every=8 keeps listing density content-first for AdSense review.
 */
export function JobsGridWithAds({ cards, every = 8, className = '' }: JobsGridWithAdsProps) {
  const chunks: React.ReactNode[][] = [];
  for (let i = 0; i < cards.length; i += every) {
    chunks.push(cards.slice(i, i + every));
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {chunks.map((chunk, chunkIdx) => (
        <React.Fragment key={`jobs-chunk-${chunkIdx}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{chunk}</div>
          {chunkIdx === 0 && chunkIdx < chunks.length - 1 && (
            <div
              className="flex justify-center py-2 min-h-[250px] items-center w-full"
              data-ad-region="incontent"
            >
              <AdSlot slot="in-content" bare />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
