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
 * Desktop lg+ (≥5 visible units + global header/footer bars):
 * - under-title 468x60 · left 160x600 · after-tool 300x250 · right 160x300 · mid-below native
 * - plus HeaderAdBar 728x90 + FooterAdBar 728x90/300x250 (App chrome)
 *
 * Mobile (≥3–4): header 320x50 · under-title · after-tool 300x250 · footer 320x50
 *
 * No social bar / popunder. Monetag push+vignette load from AdGlobals. Ads never cover tool controls.
 */
export function ToolPageAdChrome({ header, tool, below, rail }: ToolPageAdChromeProps) {
  return (
    <div className="tool-page-ad-chrome w-full py-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Left skyscraper — lg+ */}
        <AdRegion
          name="sidebar"
          className="hidden lg:flex lg:col-span-2 flex-col items-center sticky top-20 self-start min-h-[600px]"
        >
          <AdSlot slot="sidebar-skyscraper" bare />
        </AdRegion>

        {/* Main column — tool UI stays unobstructed */}
        <div className="min-w-0 lg:col-span-7 xl:col-span-7 space-y-8">
          <div className="space-y-3">{header}</div>

          {/* Above tool UI */}
          <AdRegion
            name="header"
            className="flex flex-col items-center justify-center w-full min-h-[50px] sm:min-h-[60px]"
          >
            <AdSlot slot="under-title" bare className="w-full max-w-[468px]" />
            <AdSlot slot="mobile-banner" bare className="w-full max-w-[320px] sm:hidden" />
          </AdRegion>

          {/* Tool shell — ads never inside this card */}
          <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
            {tool}
          </div>

          {/* Content-break after tool */}
          <AdRegion
            name="incontent"
            className="flex justify-center py-2 min-h-[250px] items-center"
          >
            <AdSlot slot="in-content" bare />
          </AdRegion>

          {below}

          {/* Mid-article density below FAQs / related */}
          <AdRegion name="incontent" className="flex justify-center py-2 min-h-[90px] items-center">
            <AdSlot slot="native" bare className="w-full max-w-[728px]" />
          </AdRegion>
        </div>

        {/* Right rail: 160x300 + extra 300x250 from lg */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 self-start">
          <AdRegion
            name="sidebar"
            className="hidden lg:flex flex-col items-center min-h-[300px]"
          >
            <AdSlot slot="sidebar-half" bare />
          </AdRegion>
          <AdRegion
            name="incontent"
            className="hidden lg:flex flex-col items-center min-h-[250px]"
          >
            <AdSlot slot="in-content" bare />
          </AdRegion>
          {rail}
        </aside>
      </div>
    </div>
  );
}
