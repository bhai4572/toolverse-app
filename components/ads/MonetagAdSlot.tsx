'use client';

import React, { useEffect, useRef } from 'react';
import { MONETAG_BANNER_ZONE } from './adConfig';

interface MonetagAdSlotProps {
  /** Visual size hint for reserved space */
  size?: '300x250' | '728x90' | '160x300' | '468x60';
  className?: string;
  /** Shown under the slot so it’s obvious this is Monetag (not Adsterra) */
  label?: string;
}

const SIZE_PX: Record<NonNullable<MonetagAdSlotProps['size']>, { w: number; h: number }> = {
  '300x250': { w: 300, h: 250 },
  '728x90': { w: 728, h: 90 },
  '160x300': { w: 160, h: 300 },
  '468x60': { w: 468, h: 60 },
};

/**
 * Monetag display/banner slot.
 * No banner zone ID was found in git history (only push/vignette + omg10 link CTAs).
 * Paste your Monetag banner zone into MONETAG_BANNER_ZONE in adConfig.ts to activate.
 */
export function MonetagAdSlot({
  size = '300x250',
  className = '',
  label = 'Monetag banner',
}: MonetagAdSlotProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const { w, h } = SIZE_PX[size];
  const zone = MONETAG_BANNER_ZONE?.trim();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !zone) return;

    host.replaceChildren();

    // Standard Monetag display tag pattern (zone-driven). Swap host if dashboard gives a different CDN.
    const script = document.createElement('script');
    script.async = true;
    script.dataset.zone = zone;
    script.dataset.cfasync = 'false';
    script.src = 'https://nap5k.com/tag.min.js';
    host.appendChild(script);

    return () => {
      host.replaceChildren();
    };
  }, [zone]);

  return (
    <aside
      className={`monetag-ad-slot flex flex-col items-center justify-center gap-1 ${className}`}
      data-ad-network="monetag"
      data-ad-label={label}
      aria-label="Advertisement — Monetag"
      style={{ minWidth: Math.min(w, 300), maxWidth: w, width: '100%' }}
    >
      <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
        {label}
      </span>
      <div
        ref={hostRef}
        className="flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-100/80 dark:bg-slate-800/50 text-center px-3"
        style={{ width: '100%', maxWidth: w, minHeight: h, height: h }}
      >
        {!zone && (
          <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 max-w-[240px]">
            Monetag banner placeholder — paste banner zone ID into{' '}
            <code className="text-[10px]">MONETAG_BANNER_ZONE</code> in adConfig.ts
          </p>
        )}
      </div>
    </aside>
  );
}
