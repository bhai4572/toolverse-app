import React from 'react';

export interface MonetagAdSlotProps {
  className?: string;
  size?: '300x250' | '728x90' | '160x600';
  label?: string;
}

/**
 * Monetag display slot disabled during AdSense approval.
 */
export function MonetagAdSlot(_props: MonetagAdSlotProps) {
  return null;
}
