'use client';

import React from 'react';
import { AdsterraSocialBar } from './AdsterraSocialBar';

/**
 * Global Adsterra loaders — social bar only (floating, not a banner slot).
 * Mobile 320x50 is in-flow via tool header / site footer — no second sticky bar.
 * Never gates tools. Child skips workspace/admin.
 */
export function AdGlobals() {
  return <AdsterraSocialBar />;
}
