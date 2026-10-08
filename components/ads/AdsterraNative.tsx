'use client';

import React, { useEffect, useRef } from 'react';
import { ADSTERRA_NATIVE } from './adConfig';
import { useSkipAds } from './useSkipAds';

interface AdsterraNativeProps {
  className?: string;
}

/**
 * Native banner — script + container div (exact Adsterra snippet).
 * Use on tool hubs, category pages, blog index (mid-content) — not every tool page.
 */
export function AdsterraNative({ className = '' }: AdsterraNativeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const skip = useSkipAds();

  useEffect(() => {
    if (skip) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    // Unique container per mount (network id kept for Adsterra matching)
    const container = document.createElement('div');
    container.id = ADSTERRA_NATIVE.containerId;
    wrap.appendChild(container);

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = ADSTERRA_NATIVE.scriptSrc;
    wrap.appendChild(script);

    return () => {
      wrap.replaceChildren();
    };
  }, [skip]);

  if (skip) return null;

  return (
    <div
      ref={wrapRef}
      className={`adsterra-native my-6 min-h-[90px] ${className}`}
      data-ad-label="Native banner"
      aria-label="Sponsored content"
    />
  );
}
