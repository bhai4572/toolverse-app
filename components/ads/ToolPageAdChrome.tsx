import React from 'react';
import { AdSlot } from './AdSlot';
import { AdRegion } from './AdRegion';

interface ToolPageAdChromeProps {
  /** Title / breadcrumb / privacy chip — above the tool UI */
  header: React.ReactNode;
  /** Interactive tool card only (never wrap ads inside controls) */
  tool: React.ReactNode;
  /** Guide CTA, how-to, FAQs, related tools, etc. */
  below: React.ReactNode;
  /** Right-rail widgets (SEO suite, category explorer) — desktop */
  rail?: React.ReactNode;
}

/**
 * WordPress-theme-like ad chassis for tool pages.
 *
 * Visible banners (capped ~4–5):
 * - Desktop xl: header 728x90 · sidebar 160x600 · after-tool 300x250 · footer (site) 728x90
 * - Desktop 2xl+: + optional 160x300 secondary
 * - Mobile: header 320x50 · after-tool 300x250 · footer (site) 320x50
 *
 * Social bar is global (AdGlobals). No popunder. Ads never cover tool controls.
 */
export function ToolPageAdChrome({ header, tool, below, rail }: ToolPageAdChromeProps) {
  return (
    <div className="tool-page-ad-chrome max-w-7xl mx-auto py-4 space-y-6">
      {/* Top leaderboard — one bar only */}
      <AdRegion
        name="header"
        className="flex flex-col items-center justify-center min-h-[50px] md:min-h-[90px]"
      >
        <AdSlot slot="leaderboard" bare className="w-full" />
        <AdSlot slot="mobile-banner" bare className="w-full" />
      </AdRegion>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Left skyscraper — xl+ only (ad sidebar) */}
        <AdRegion
          name="sidebar"
          className="hidden xl:flex xl:col-span-2 flex-col items-center sticky top-20 self-start"
        >
          <AdSlot slot="sidebar-skyscraper" bare />
        </AdRegion>

        {/* Main column — tool UI stays unobstructed */}
        <div className="min-w-0 lg:col-span-8 xl:col-span-7 2xl:col-span-6 space-y-8">
          <div className="space-y-3">{header}</div>

          {/* Tool shell — ads never inside this card */}
          <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
            {tool}
          </div>

          {/* Content-break after tool */}
          <AdRegion name="incontent" className="flex justify-center py-2">
            <AdSlot slot="in-content" bare />
          </AdRegion>

          {below}
        </div>

        {/* Right rail: widgets from lg; optional 160x300 at 2xl */}
        <aside className="lg:col-span-4 xl:col-span-3 2xl:col-span-4 space-y-6 lg:sticky lg:top-20 self-start">
          <AdRegion name="sidebar" className="hidden 2xl:flex flex-col items-center">
            <AdSlot slot="sidebar-half" bare />
          </AdRegion>
          {rail}
        </aside>
      </div>
    </div>
  );
}
