import React from 'react';

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
