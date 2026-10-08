'use client';

import React from 'react';
import { AdsterraSocialBar } from './AdsterraSocialBar';
import { AdsterraPopunder } from './AdsterraPopunder';
import { AdsterraBanner } from './AdsterraBanner';

/**
 * Global Adsterra loaders + mobile sticky 320x50 (non-blocking, under chrome).
 * Does not gate tools. Skips workspace/admin via child components.
 */
export function AdGlobals() {
  return (
    <>
      <AdsterraSocialBar />
      <AdsterraPopunder />
      {/* Mobile 320x50 — fixed bottom, leaves CTAs usable (pb on body via spacer) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex flex-col items-center pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/80 w-full flex justify-center py-1">
          <AdsterraBanner size="320x50" />
        </div>
      </div>
      <div className="md:hidden h-14 shrink-0" aria-hidden />
    </>
  );
}
