import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getLiveTools } from '../lib/tools/registry';
import { getToolRendererKey, TOOL_RENDERER_MAP } from '../features/tools/ToolRenderer';
import { getMetadataForPath } from '../lib/seo/metaEngine';
import { pathShouldNoindex } from '../lib/seo/indexability';

const root = process.cwd();

describe('AdSense Blocker Regression Suite — ToolRenderer (134 Live Tools) & Sitemap Integrity', () => {
  it('maps ALL live tools in registry.ts explicitly without silent ImageCompressorTool fallthrough', () => {
    const liveTools = getLiveTools();
    expect(liveTools.length).toBeGreaterThanOrEqual(134);

    const unmapped: string[] = [];
    const wronglyMappedToImageCompressor: string[] = [];

    for (const tool of liveTools) {
      const key = getToolRendererKey(tool.slug);
      if (!key) {
        unmapped.push(tool.slug);
      } else if (
        key === 'ImageCompressorTool' &&
        tool.slug !== 'image-compressor' &&
        tool.slug !== 'compress-image-target-size'
      ) {
        wronglyMappedToImageCompressor.push(tool.slug);
      }
    }

    expect(unmapped).toEqual([]);
    expect(wronglyMappedToImageCompressor).toEqual([]);
  });

  it('maps the previously broken 21 tools to their exact real components', () => {
    const expectedMappings: Record<string, string> = {
      'seo-audit-analyzer': 'SeoTools',
      'keyword-research-tool': 'SeoTools',
      'backlink-checker-analyzer': 'SeoTools',
      'serp-simulator': 'SeoTools',
      'keyword-density-checker': 'SeoTools',
      'robots-txt-generator': 'SeoTools',
      'xml-sitemap-validator': 'SeoTools',
      'schema-markup-generator': 'SeoTools',
      'redirect-chain-checker': 'SeoTools',
      'canonical-hreflang-generator': 'SeoTools',
      'youtube-thumbnail-downloader': 'TrendingTools',
      'chatgpt-prompt-generator': 'TrendingTools',
      'midjourney-prompt-builder': 'TrendingTools',
      'glassmorphism-css-generator': 'TrendingTools',
      'instagram-hashtag-generator': 'TrendingTools',
      'twitter-thread-splitter': 'TrendingTools',
      'srt-subtitle-cleaner': 'TrendingTools',
      'markdown-html-converter': 'TrendingTools',
      'curl-to-code-converter': 'TrendingTools',
      'svg-to-png-converter': 'TrendingTools',
      'gpa-calculator': 'CalculatorTools',
    };

    for (const [slug, expectedKey] of Object.entries(expectedMappings)) {
      expect(TOOL_RENDERER_MAP[slug]).toBe(expectedKey);
    }
  });

  it('returns undefined for unknown slugs and never references undefined ToolLoadingFallback', () => {
    expect(getToolRendererKey('nonexistent-unknown-tool-xyz')).toBeUndefined();

    const rendererSrc = fs.readFileSync(path.join(root, 'features/tools/ToolRenderer.tsx'), 'utf8');
    expect(rendererSrc).not.toContain('ToolLoadingFallback');
    expect(rendererSrc).toContain('fallback={<ToolLoading />}');
    expect(rendererSrc).toContain('UnavailableToolNotice');
  });

  it('ensures ALL sitemap.xml URLs are genuinely indexable (zero noindex URLs in sitemap)', () => {
    const sm = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
    const locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(150);
    expect(new Set(locs).size).toBe(locs.length);

    const violations: string[] = [];
    for (const loc of locs) {
      const pathname = loc.replace('https://toolverse.baby', '') || '/';
      if (pathShouldNoindex(pathname)) {
        violations.push(`${pathname} (pathShouldNoindex=true)`);
        continue;
      }
      const meta = getMetadataForPath(pathname);
      if (meta.robots && /noindex/i.test(meta.robots)) {
        violations.push(`${pathname} (meta.robots=${meta.robots})`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('discloses Google Tag Manager and Microsoft Clarity in Privacy Policy & Cookie Policy', () => {
    const legalSrc = fs.readFileSync(path.join(root, 'app/legal/[slug]/page.tsx'), 'utf8');
    expect(legalSrc).toContain('Google Tag Manager');
    expect(legalSrc).toContain('Microsoft Clarity');
    expect(legalSrc).not.toContain('<<<<<<<');
  });
});

