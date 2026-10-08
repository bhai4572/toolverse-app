'use client';

import React from 'react';
import { AdSlot } from './AdSlot';
import { renderInlineMarkdown } from '@/lib/blog/renderInlineMarkdown';

interface InArticleAdsProps {
  /** Raw markdown body (paragraphs split on blank lines) */
  markdown: string;
  /** Insert an in-content ad after every N prose paragraphs (default 2) */
  every?: number;
  className?: string;
}

function isProseParagraph(trimmed: string): boolean {
  if (!trimmed) return false;
  if (trimmed.startsWith('#')) return false;
  if (trimmed === '---') return false;
  if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) return false;
  return true;
}

function renderBlock(trimmed: string, key: number): React.ReactNode {
  if (!trimmed) return null;
  if (trimmed.startsWith('# ')) return null;
  if (trimmed.startsWith('## ')) {
    return (
      <h2
        key={key}
        className="text-2xl font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-800"
      >
        {trimmed.replace(/^##\s+/, '')}
      </h2>
    );
  }
  if (trimmed.startsWith('### ')) {
    return (
      <h3 key={key} className="text-xl font-semibold text-slate-900 dark:text-white pt-2">
        {trimmed.replace(/^###\s+/, '')}
      </h3>
    );
  }
  if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
    const ordered = /^\d+\.\s/.test(trimmed);
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <Tag
        key={key}
        className={`${ordered ? 'list-decimal' : 'list-disc'} list-inside space-y-2 pl-4 text-slate-700 dark:text-slate-300`}
      >
        {trimmed.split('\n').map((item, itemIdx) => (
          <li key={itemIdx}>{renderInlineMarkdown(item.replace(/^(- |\d+\.\s)/, ''))}</li>
        ))}
      </Tag>
    );
  }
  if (trimmed === '---') {
    return <hr key={key} className="border-slate-200 dark:border-slate-800" />;
  }
  return (
    <p key={key} className="leading-relaxed">
      {renderInlineMarkdown(trimmed)}
    </p>
  );
}

/**
 * AdSense-style in-article ads: render markdown blocks and inject a 300x250
 * (or native) unit after every N prose paragraphs. Never gates content.
 */
export function InArticleAds({ markdown, every = 2, className = '' }: InArticleAdsProps) {
  const blocks = markdown.split('\n\n');
  const nodes: React.ReactNode[] = [];
  let proseCount = 0;
  let adIdx = 0;

  blocks.forEach((paragraph, idx) => {
    const trimmed = paragraph.trim();
    const block = renderBlock(trimmed, idx);
    if (block) nodes.push(block);

    if (isProseParagraph(trimmed)) {
      proseCount += 1;
      if (proseCount % every === 0) {
        adIdx += 1;
        nodes.push(
          <div
            key={`in-article-ad-${adIdx}`}
            className="not-prose flex justify-center py-4 my-2"
            data-ad-region="incontent"
          >
            {adIdx % 3 === 0 ? (
              <AdSlot slot="native" bare className="w-full max-w-[728px]" />
            ) : (
              <AdSlot slot="in-content" bare />
            )}
          </div>
        );
      }
    }
  });

  return (
    <div
      className={`prose prose-indigo dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed space-y-6 ${className}`}
    >
      {nodes}
    </div>
  );
}
