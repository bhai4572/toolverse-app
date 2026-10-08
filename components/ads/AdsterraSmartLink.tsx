'use client';

import React from 'react';
import { ADSTERRA_SMART_LINK } from './adConfig';
import { useSkipAds } from './useSkipAds';

interface AdsterraSmartLinkProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Smart link — ONLY for explicit sponsored / optional outbound text.
 * Do not wrap internal nav links. Hidden on workspace / admin.
 */
export function AdsterraSmartLink({
  children = 'Sponsored',
  className = '',
}: AdsterraSmartLinkProps) {
  const skip = useSkipAds();
  if (skip) return null;

  return (
    <a
      href={ADSTERRA_SMART_LINK}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      data-ad-label="Smart link"
    >
      {children}
    </a>
  );
}
