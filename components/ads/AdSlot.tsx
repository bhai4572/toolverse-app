'use client';

import React from 'react';
import { AdsterraBanner } from './AdsterraBanner';
import { AdsterraNative } from './AdsterraNative';
import type { AdSlotName, BannerSize } from './adConfig';
import { SLOT_TO_BANNER } from './adConfig';

interface AdSlotProps {
  /** Preferred: named slot */
  slot?: AdSlotName;
  /** Legacy format from older pages */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'sidebar' | 'in-article';
  /** Legacy placement from blog/jobs */
  placement?: 'header' | 'footer' | string;
  slotId?: string;
  className?: string;
  /** Hide wrapper label chrome; ads stay visible */
  bare?: boolean;
}

function resolveSize(props: AdSlotProps): BannerSize | 'native' {
  if (props.slot === 'native') return 'native';
  if (props.slot && SLOT_TO_BANNER[props.slot]) {
    return SLOT_TO_BANNER[props.slot]!;
  }

  // Legacy slotId hints
  if (props.slotId === 'tool-sidebar-primary') return '160x600';
  if (props.slotId === 'tool-sidebar-secondary') return '160x300';
  if (props.slotId === 'tool-inline-top' || props.slotId === 'tool-content-break') {
    return props.format === 'horizontal' ? '728x90' : '300x250';
  }
  if (props.slotId === 'footer-banner') return '728x90';

  if (props.format === 'sidebar') {
    return props.slotId?.includes('secondary') ? '160x300' : '160x600';
  }
  if (props.format === 'in-article' || props.format === 'rectangle') return '300x250';
  if (props.format === 'horizontal') return '728x90';

  if (props.placement === 'footer') return '728x90';
  if (props.placement === 'header') return '728x90';
  if (props.placement === 'native') return 'native';

  return '300x250';
}

/**
 * AdSlot — maps named/legacy placements to Adsterra units.
 * Never blocks tool UI; decorative wrapper only.
 */
export function AdSlot(props: AdSlotProps) {
  const { className = '', bare = false } = props;
  const resolved = resolveSize(props);

  if (resolved === 'native') {
    return <AdsterraNative className={className} />;
  }

  const responsiveHide =
    resolved === '160x600' || resolved === '160x300'
      ? 'hidden lg:flex'
      : resolved === '728x90'
        ? 'hidden md:flex'
        : resolved === '320x50'
          ? 'flex md:hidden'
          : resolved === '468x60'
            ? 'hidden sm:flex lg:hidden'
            : 'flex';

  const inner = <AdsterraBanner size={resolved} />;

  if (bare) {
    return <div className={`${responsiveHide} justify-center ${className}`}>{inner}</div>;
  }

  return (
    <aside
      className={`${responsiveHide} flex-col items-center justify-center gap-1 my-4 ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Ad
      </span>
      {inner}
    </aside>
  );
}

export { AdsterraBanner } from './AdsterraBanner';
export { AdsterraNative } from './AdsterraNative';
export { AdsterraSocialBar } from './AdsterraSocialBar';
export { AdsterraPopunder } from './AdsterraPopunder';
export { AdsterraSmartLink } from './AdsterraSmartLink';
