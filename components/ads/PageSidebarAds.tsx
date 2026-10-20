import React from 'react';
import { AdSlot } from './AdSlot';
import { AdRegion } from './AdRegion';

interface PageSidebarAdsProps {
  /** Main article / tool / jobs column */
  children: React.ReactNode;
  /** Optional widgets under right-rail ad */
  rightRail?: React.ReactNode;
  className?: string;
}

/**
 * Light content chassis: main column + single right-rail ad (desktop).
 * No left skyscraper / stacked in-content — AdSense review density.
 */
export function PageSidebarAds({ children, rightRail, className = '' }: PageSidebarAdsProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start ${className}`}>
      <div className="min-w-0 lg:col-span-9 space-y-6">{children}</div>

      <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 self-start">
        <AdRegion name="sidebar" className="hidden lg:flex flex-col items-center min-h-[300px]">
          <AdSlot slot="sidebar-half" bare />
        </AdRegion>
        {rightRail}
      </aside>
    </div>
  );
}
