'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

export function AdBlockDetector() {
  const [isAdBlockActive, setIsAdBlockActive] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const detectAdBlocker = async () => {
    setIsChecking(true);
    let blocked = false;

    // Test Method 1: DOM Bait Probe Element
    const bait = document.createElement('div');
    bait.className = 'adsbygoogle ad-slot ad-banner ads-holder header-ad ad-unit pub_300x250';
    bait.style.position = 'absolute';
    bait.style.left = '-9999px';
    bait.style.top = '-9999px';
    bait.style.height = '10px';
    bait.style.width = '10px';
    document.body.appendChild(bait);

    window.setTimeout(() => {
      if (
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetLeft === 0 ||
        bait.clientHeight === 0 ||
        window.getComputedStyle(bait).getPropertyValue('display') === 'none' ||
        window.getComputedStyle(bait).getPropertyValue('visibility') === 'hidden'
      ) {
        blocked = true;
      }
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    }, 100);

    // Test Method 2: Fetch Ad Network Script URL (Google AdSense script probe)
    try {
      const adUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      const response = await fetch(new Request(adUrl, { mode: 'no-cors' }));
      if (!response || response.type === 'opaque') {
        // Fetch succeeded (no network block)
      }
    } catch (err) {
      // Network fetch blocked by browser ad blocker extension
      blocked = true;
    }

    setTimeout(() => {
      setIsAdBlockActive(blocked);
      setIsChecking(false);
    }, 400);
  };

  useEffect(() => {
    detectAdBlocker();
  }, []);

  const handleRecheck = () => {
    detectAdBlocker();
    if (!isAdBlockActive) {
      window.location.reload();
    }
  };

  if (isChecking || !isAdBlockActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-500 flex items-center justify-center shrink-0 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              AdBlocker Detected 🛡️
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Please disable your AdBlocker to continue using ToolVerse.
            </p>
          </div>
        </div>

        {/* Friendly Explanation */}
        <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
          <p>
            ToolVerse provides <strong className="text-white">100+ free online tools</strong> (PDF merger, image converters, calculators, job engine, &amp; developer tools) with zero subscriptions or signups.
          </p>
          <p>
            To keep all tools <strong className="text-emerald-400">100% free and server infrastructure running</strong>, we rely on non-intrusive advertisements.
          </p>
        </div>

        {/* How to Disable Step-by-Step */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-brand-400" /> How to whitelist ToolVerse:
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-brand-400 shrink-0">1.</span>
              <span>Click your AdBlocker icon (uBlock Origin, AdGuard, Brave Shield, or AdBlock Plus) in your browser toolbar.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-brand-400 shrink-0">2.</span>
              <span>Select <strong className="text-white">"Pause / Turn Off for toolverse.baby"</strong> or click the Power icon.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-brand-400 shrink-0">3.</span>
              <span>Click the button below to refresh and unlock all tools.</span>
            </li>
          </ul>
        </div>

        {/* Action Recheck Button */}
        <div className="pt-2">
          <button
            onClick={handleRecheck}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition transform active:scale-98"
          >
            <RefreshCw className="w-4 h-4" />
            <span>I Have Disabled My AdBlocker (Refresh Site)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
