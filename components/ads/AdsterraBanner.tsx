'use client';

import React, { useEffect, useRef } from 'react';
import { ADSTERRA_BANNERS, type BannerSize } from './adConfig';

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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.replaceChildren();

    const iframe = document.createElement('iframe');
    iframe.title = `Advertisement ${unit.label}`;
    iframe.setAttribute('aria-label', 'Advertisement');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.cssText = `border:0;margin:0;padding:0;overflow:hidden;display:block;width:${unit.width}px;height:${unit.height}px;max-width:100%;`;

    host.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
        '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>' +
        '</head><body></body></html>',
    );
    doc.close();

    // Adsterra Banner — set atOptions then load invoke.js (exact network pattern)
    const opts = doc.createElement('script');
    opts.type = 'text/javascript';
    opts.text = [
      'atOptions = {',
      `  'key': '${unit.key}',`,
      "  'format': 'iframe',",
      `  'height': ${unit.height},`,
      `  'width': ${unit.width},`,
      "  'params': {}",
      '};',
    ].join('\n');
    doc.body.appendChild(opts);

    const invoke = doc.createElement('script');
    invoke.type = 'text/javascript';
    invoke.src = unit.invokeSrc;
    doc.body.appendChild(invoke);

    return () => {
      host.replaceChildren();
    };
  }, [unit.key, unit.height, unit.width, unit.invokeSrc, unit.label]);

  return (
    <div
      className={`adsterra-banner flex justify-center overflow-hidden ${className}`}
      data-ad-label={unit.label}
      data-ad-size={size}
      ref={hostRef}
      style={{ minHeight: unit.height }}
    />
  );
}
