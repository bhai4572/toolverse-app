'use client';

import React from 'react';
import { SeoWorkspaceLayout } from '@/components/seo-workspace/SeoWorkspaceLayout';
import { WorkspaceHome } from '@/components/seo-workspace/WorkspaceHome';
import { ModuleRouter } from '@/components/seo-workspace/ModuleRouter';
import { findNavItemBySlug } from '@/lib/seo/workspace/seoNavConfig';

export default function SeoWorkspacePage({ slug = '' }: { slug?: string }) {
  const normalized = slug.replace(/^\/+|\/+$/g, '');
  const item = normalized ? findNavItemBySlug(normalized) : undefined;

  return (
    <SeoWorkspaceLayout slug={normalized || 'home'}>
      {!normalized || normalized === 'home' ? (
        <WorkspaceHome />
      ) : item ? (
        <ModuleRouter item={item} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-3">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Module not found</h1>
          <p className="text-sm text-slate-500">No workspace page for “{normalized}”.</p>
          <a href="/workspace" className="inline-block text-sm font-bold text-brand-600 hover:underline">
            Back to dashboard
          </a>
        </div>
      )}
    </SeoWorkspaceLayout>
  );
}
