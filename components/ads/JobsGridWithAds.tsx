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
 * 2-column jobs grid with a full-width ad break after every `every` cards.
 */
export function JobsGridWithAds({ cards, every = 4, className = '' }: JobsGridWithAdsProps) {
  const chunks: React.ReactNode[][] = [];
  for (let i = 0; i < cards.length; i += every) {
    chunks.push(cards.slice(i, i + every));
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {chunks.map((chunk, chunkIdx) => (
        <React.Fragment key={`jobs-chunk-${chunkIdx}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{chunk}</div>
          {chunkIdx < chunks.length - 1 && (
            <div
              className="flex justify-center py-2 min-h-[90px] md:min-h-[250px] items-center w-full"
              data-ad-region="incontent"
            >
              {chunkIdx % 2 === 0 ? (
                <AdSlot slot="in-content" bare />
              ) : (
                <>
                  <AdSlot slot="leaderboard" bare className="w-full max-w-[728px]" />
                  <AdSlot slot="mobile-banner" bare className="w-full max-w-[320px]" />
                </>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
