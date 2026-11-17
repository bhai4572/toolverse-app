import React from 'react';
import type { AdSlotName } from './adConfig';
import { ADS_ENABLED } from './adConfig';

interface AdSlotProps {
  /** Preferred: named slot */
  slot?: AdSlotName;
  /** Legacy format from older pages */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'sidebar' | 'in-article';
  /** Legacy placement from blog/jobs */
  placement?: 'header' | 'footer' | string;
  slotId?: string;
  className?: string;
  bare?: boolean;
}

/**
 * AdSlot placeholder. All third-party networks (Adsterra, Monetag) were removed on
 * 2026-11-17. Renders nothing until AdSense units are implemented here and
 * ADS_ENABLED is true.
 */
export function AdSlot(_props: AdSlotProps): React.ReactElement | null {
  if (!ADS_ENABLED) return null;
  return null;
}
