'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export function AdSlot({ slotId = 'default-slot', format = 'auto', className = '' }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <div className={`my-8 p-4 sm:p-6 bg-gradient-to-r from-brand-900/40 via-slate-900 to-indigo-950/40 border border-brand-500/30 rounded-2xl text-center shadow-sm relative overflow-hidden ${className}`}>
      <div className="absolute top-2 right-3 text-[10px] uppercase tracking-wider font-semibold text-brand-400/70 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-400" /> Sponsored
      </div>

      <div className="space-y-2 pt-1">
        <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
          Discover Featured Online Tools &amp; Special Web Offers ⚡
        </h4>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          Check out trending software, hosting deals, and verified developer utilities.
        </p>

        <div className="pt-2 flex justify-center">
          <a
            href="https://omg10.com/4/11966216"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Explore Special Offers <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {adsenseClient && (
        <ins
          className="adsbygoogle hidden"
          style={{ display: 'none' }}
          data-ad-client={adsenseClient}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
