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
 * Dense WP-style chassis: sticky left skyscraper + sticky right half-page
 * around a main content column. Desktop lg+ only for side rails.
 */
export function PageSidebarAds({ children, rightRail, className = '' }: PageSidebarAdsProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start ${className}`}>
      <AdRegion
        name="sidebar"
        className="hidden lg:flex lg:col-span-2 flex-col items-center sticky top-20 self-start min-h-[600px]"
      >
        <AdSlot slot="sidebar-skyscraper" bare />
      </AdRegion>

      <div className="min-w-0 lg:col-span-7 xl:col-span-7 space-y-6">{children}</div>

      <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 self-start">
        <AdRegion name="sidebar" className="hidden lg:flex flex-col items-center min-h-[300px]">
          <AdSlot slot="sidebar-half" bare />
        </AdRegion>
        <AdRegion name="incontent" className="hidden lg:flex flex-col items-center min-h-[250px]">
          <AdSlot slot="in-content" bare />
        </AdRegion>
        {rightRail}
      </aside>
    </div>
  );
}
