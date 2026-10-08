'use client';

import React from 'react';
import { ADSTERRA_SMART_LINK } from './adConfig';

interface AdsterraSmartLinkProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Smart link — ONLY for explicit sponsored / optional outbound text.
 * Do not wrap internal nav links.
 */
export function AdsterraSmartLink({
  children = 'Sponsored',
  className = '',
}: AdsterraSmartLinkProps) {
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
