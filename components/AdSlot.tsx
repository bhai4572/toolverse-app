'use client';

import React from 'react';
import { ExternalLink, Sparkles, Zap, TrendingUp } from 'lucide-react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'sidebar' | 'in-article';
  className?: string;
}

export function AdSlot({ slotId = 'default-slot', format = 'auto', className = '' }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-8847204746483890';
  const monetagDirectUrl = 'https://omg10.com/4/11966216';

  if (format === 'sidebar') {
    return (
      <div className={`p-4 bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 border border-brand-500/30 rounded-2xl text-center shadow-md relative overflow-hidden space-y-3 ${className}`}>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-brand-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Sponsored
          </span>
          <span className="text-slate-500">Ad</span>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <h4 className="text-xs font-bold text-white leading-snug">
            Premium Web Hosting &amp; Software Deals ⚡
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Exclusive cloud servers, domains, and developer discounts.
          </p>
        </div>

        <div className="pt-1">
          <a
            href={monetagDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-all transform hover:-translate-y-0.5"
          >
            Claim Exclusive Offer <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {adsenseClient && (
          <ins
            className="adsbygoogle hidden"
            style={{ display: 'none' }}
            data-ad-client={adsenseClient}
            data-ad-slot={slotId}
            data-ad-format="rectangle"
            data-full-width-responsive="true"
          />
        )}
      </div>
    );
  }

  if (format === 'in-article') {
    return (
      <div className={`my-6 p-4 sm:p-5 bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-1 justify-center sm:justify-start">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Featured Partner Offer
          </div>
          <h4 className="text-sm font-bold text-white">
            Supercharge Your Workflow with High-Performance Cloud Tools
          </h4>
          <p className="text-xs text-slate-300">
            Special deals on verified web utilities, domains, and developer software.
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={monetagDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all whitespace-nowrap"
          >
            View Offers <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {adsenseClient && (
          <ins
            className="adsbygoogle hidden"
            style={{ display: 'none' }}
            data-ad-client={adsenseClient}
            data-ad-slot={slotId}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        )}
      </div>
    );
  }

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
            href={monetagDirectUrl}
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
          data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
