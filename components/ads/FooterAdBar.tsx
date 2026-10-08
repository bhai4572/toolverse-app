'use client';

import React, { useEffect, useState } from 'react';
import { AdSlot } from './AdSlot';
import { shouldSkipAds } from './adConfig';

/**
 * Site footer ad bar — 728x90 desktop / 320x50 mobile (in-flow).
 * Skips workspace/admin. Not sticky (avoids fighting tool CTAs).
 */
export function FooterAdBar() {
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && shouldSkipAds(window.location.pathname)) {
      setSkip(true);
    }
  }, []);

  if (skip) return null;

  return (
    <div
      className="ad-footer my-6 flex flex-col items-center justify-center gap-2 min-h-[50px] md:min-h-[90px]"
      data-ad-region="footer"
      aria-label="Advertisement"
    >
      <AdSlot slot="footer" slotId="footer-banner" bare className="my-0" />
      <AdSlot slot="footer-mobile" bare className="my-0" />
    </div>
  );
}
