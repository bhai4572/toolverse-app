import React from 'react';
import { ADS_ENABLED } from './adConfig';

export type AdRegionName = 'header' | 'sidebar' | 'incontent' | 'footer';

interface AdRegionProps {
  name: AdRegionName;
  className?: string;
  children: React.ReactNode;
}

/**
 * Semantic ad region wrapper (WP-theme-style chassis slots).
 * Never overlays tool controls — spacing only.
 */
export function AdRegion({ name, className = '', children }: AdRegionProps) {
  if (!ADS_ENABLED) return null;
  return (
    <aside
      data-ad-region={name}
      className={`ad-${name} ${className}`}
      aria-label="Advertisement"
    >
      {children}
    </aside>
  );
}
