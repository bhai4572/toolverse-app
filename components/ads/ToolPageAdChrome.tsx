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
 * Content-first chassis for tool pages (AdSense review density).
 *
 * Visible display units (plus App HeaderAdBar + FooterAdBar):
 * - Desktop: after-tool 300×250 · optional right-rail 160×300
 * - Mobile: after-tool 300×250
 *
 * No left skyscraper, no under-title stack, no native mid-band.
 * Ads never cover tool controls.
 */
export function ToolPageAdChrome({ header, tool, below, rail }: ToolPageAdChromeProps) {
  return (
    <div className="tool-page-ad-chrome w-full py-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Main column — tool UI stays unobstructed */}
        <div className="min-w-0 lg:col-span-9 space-y-8">
          <div className="space-y-3">{header}</div>

          {/* Tool shell — ads never inside this card */}
          <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
            {tool}
          </div>

          {/* Single content-break after tool */}
          <AdRegion
            name="incontent"
            className="flex justify-center py-2 min-h-[250px] items-center"
          >
            <AdSlot slot="in-content" bare />
          </AdRegion>

          {below}
        </div>

        {/* Right rail: one half-page + widgets */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-20 self-start">
          <AdRegion
            name="sidebar"
            className="hidden lg:flex flex-col items-center min-h-[300px]"
          >
            <AdSlot slot="sidebar-half" bare />
          </AdRegion>
          {rail}
        </aside>
      </div>
    </div>
  );
}
