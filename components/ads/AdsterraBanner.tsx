'use client';

import React, { useEffect, useRef } from 'react';
import { ADSTERRA_BANNERS, type BannerSize } from './adConfig';
import { useSkipAds } from './useSkipAds';

interface AdsterraBannerProps {
  size: BannerSize;
  className?: string;
}

/**
 * Isolated iframe loader for Adsterra atOptions banners.
 * Each mount gets its own document so concurrent atOptions keys never collide.
 */
export function AdsterraBanner({ size, className = '' }: AdsterraBannerProps) {
  const unit = ADSTERRA_BANNERS[size];
  const hostRef = useRef<HTMLDivElement>(null);
  const skip = useSkipAds();

  useEffect(() => {
    if (skip) return;

    const host = hostRef.current;
    if (!host) return;

    host.replaceChildren();

    const srcdoc = [
      '<!DOCTYPE html><html><head><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width,initial-scale=1">',
      '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>',
      '</head><body>',
      '<script type="text/javascript">',
      'atOptions = {',
      `  'key': '${unit.key}',`,
      "  'format': 'iframe',",
      `  'height': ${unit.height},`,
      `  'width': ${unit.width},`,
      "  'params': {}",
      '};',
      '</script>',
      `<script type="text/javascript" data-cfasync="false" src="${unit.invokeSrc}"><\/script>`,
      '</body></html>',
    ].join('\n');

    const iframe = document.createElement('iframe');
    iframe.title = `Advertisement ${unit.label}`;
    iframe.setAttribute('aria-label', 'Advertisement');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('loading', 'eager');
    iframe.style.cssText = `border:0;margin:0;padding:0;overflow:hidden;display:block;width:${unit.width}px;height:${unit.height}px;max-width:100%;background:transparent;`;
    iframe.srcdoc = srcdoc;

    host.appendChild(iframe);

    return () => {
      host.replaceChildren();
    };
  }, [skip, unit.key, unit.height, unit.width, unit.invokeSrc, unit.label]);

  if (skip) return null;

  return (
    <div
      className={`adsterra-banner flex justify-center items-center overflow-hidden bg-slate-100/60 dark:bg-slate-800/40 ${className}`}
      data-ad-label={unit.label}
      data-ad-size={size}
      ref={hostRef}
      style={{
        minWidth: Math.min(unit.width, 320),
        width: '100%',
        maxWidth: unit.width,
        minHeight: unit.height,
        height: unit.height,
      }}
    />
  );
}
