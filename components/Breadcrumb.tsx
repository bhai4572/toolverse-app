import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
        <li className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" aria-hidden="true" />
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand-600 dark:hover:text-brand-400">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900 dark:text-slate-200 font-medium" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
