/**
 * ToolVerse Site Audit Crawler & Analyzer Engine v1
 * Performs authorized technical SEO site crawls, collects on-page elements & headers,
 * detects cross-page duplicates, and generates structured, evidence-backed findings.
 */

import { safeFetch, validateTargetUrl } from './ssrfGuard';

export type FindingSeverity = 'error' | 'warning' | 'info';

export type FindingCategory =
  | 'Indexability'
  | 'Metadata'
  | 'Content & Structure'
  | 'Links & Navigation'
  | 'Images & Media'
  | 'Technical & Security';

export interface AuditFinding {
  code: string;
  title: string;
  severity: FindingSeverity;
  category: FindingCategory;
  affectedUrls: string[];
  evidence: string;
  explanation: string;
  recommendation: string;
}

export interface CrawledPage {
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  contentType: string;
  redirectChain: string[];
  isHttps: boolean;
  xRobotsTag: string | null;
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  h1List: string[];
  h2Count: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  hasViewport: boolean;
  internalLinks: string[];
  externalLinks: string[];
  imagesTotal: number;
  imagesMissingAlt: number;
  missingAltSamples: string[];
  wordCount: number;
  errorMessage?: string;
}

export interface SiteAuditSummary {
  totalErrors: number;
  totalWarnings: number;
  totalInfo: number;
  totalPassed: number;
  healthScore: number;
}

export interface SiteAuditReport {
  auditId: string;
  targetUrl: string;
  domain: string;
  timestamp: string;
  durationMs: number;
  pagesDiscovered: number;
  pagesCrawled: number;
  pagesFailed: number;
  robotsTxt: {
    checked: boolean;
    found: boolean;
    url: string;
    rulesCount: number;
    hasSitemapDirective: boolean;
  };
  sitemapXml: {
    checked: boolean;
    found: boolean;
    url: string;
    urlsFound: number;
  };
  summary: SiteAuditSummary;
  pages: CrawledPage[];
  findings: AuditFinding[];
}

export interface CrawlProgress {
  status: 'queued' | 'running' | 'completed' | 'failed';
  discovered: number;
  crawled: number;
  currentUrl?: string;
  errorMessage?: string;
}

export interface SiteAuditOptions {
  maxPages?: number;
  respectRobots?: boolean;
  onProgress?: (progress: CrawlProgress) => void;
}

/** Helper to extract content inside HTML tags */
function extractTagContent(html: string, regex: RegExp): string[] {
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    if (m[1]) {
      // Strip nested tags and decode basic entities
      const text = m[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      if (text) matches.push(text);
    }
  }
  return matches;
}

/** Parses HTML markup and extracts all on-page SEO signals */
export function analyzePageHtml(
  rawHtml: string,
  pageUrl: string,
  statusCode: number,
  statusText: string,
  headers: Headers,
  redirectChain: string[],
  responseTimeMs: number,
  finalUrl: string
): CrawledPage {
  const contentType = headers.get('content-type') || '';
  const isHttps = finalUrl.startsWith('https://');
  const xRobotsTag = headers.get('x-robots-tag');

  // Title
  const titleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : null;
  const titleLength = title ? title.length : 0;

  // Meta Description
  const descMatch =
    rawHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) ||
    rawHtml.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i);
  const description = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : null;
  const descriptionLength = description ? description.length : 0;

  // Headings
  const h1List = extractTagContent(rawHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2List = extractTagContent(rawHtml, /<h2[^>]*>([\s\S]*?)<\/h2>/gi);

  // Canonical Tag
  const canonicalMatch =
    rawHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    rawHtml.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;

  // Robots Meta
  const robotsMatch =
    rawHtml.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
    rawHtml.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i);
  const robotsMeta = robotsMatch ? robotsMatch[1].trim() : null;

  // Viewport Meta
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(rawHtml);

  // Images & Missing Alt attributes
  const imgMatches = rawHtml.match(/<img\b[^>]*>/gi) || [];
  let imagesMissingAlt = 0;
  const missingAltSamples: string[] = [];

  for (const imgTag of imgMatches) {
    const hasAlt = /\balt\s*=\s*["'][^"']*["']/i.test(imgTag);
    if (!hasAlt) {
      imagesMissingAlt++;
      const srcMatch = imgTag.match(/\bsrc\s*=\s*["']([^"']*)["']/i);
      if (srcMatch && missingAltSamples.length < 5) {
        missingAltSamples.push(srcMatch[1]);
      }
    }
  }

  // Links Extraction
  let baseUrl: URL;
  try {
    baseUrl = new URL(finalUrl);
  } catch {
    baseUrl = new URL('https://example.com');
  }

  const internalLinks = new Set<string>();
  const externalLinks = new Set<string>();

  const aMatches = rawHtml.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']*)["']/gi);
  for (const match of aMatches) {
    const rawHref = (match[1] || '').trim();
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      continue;
    }

    try {
      const resolved = new URL(rawHref, baseUrl);
      // Remove hash fragment
      resolved.hash = '';

      if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
        if (resolved.hostname.toLowerCase() === baseUrl.hostname.toLowerCase()) {
          internalLinks.add(resolved.href);
        } else {
          externalLinks.add(resolved.href);
        }
      }
    } catch {
      // Ignore unparseable link targets
    }
  }

  // Estimated Word Count of Visible Text
  const strippedText = rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = strippedText ? strippedText.split(' ').filter(Boolean).length : 0;

  return {
    url: pageUrl,
    finalUrl,
    statusCode,
    statusText,
    responseTimeMs,
    contentType,
    redirectChain,
    isHttps,
    xRobotsTag,
    title,
    titleLength,
    description,
    descriptionLength,
    h1List,
    h2Count: h2List.length,
    canonicalUrl,
    robotsMeta,
    hasViewport,
    internalLinks: Array.from(internalLinks),
    externalLinks: Array.from(externalLinks),
    imagesTotal: imgMatches.length,
    imagesMissingAlt,
    missingAltSamples,
    wordCount,
  };
}

/**
 * Checks for robots.txt availability on target root
 */
async function checkRobotsTxt(origin: string): Promise<{
  checked: boolean;
  found: boolean;
  url: string;
  rulesCount: number;
  hasSitemapDirective: boolean;
  disallowedPaths: string[];
}> {
  const robotsUrl = `${origin}/robots.txt`;
  try {
    const res = await safeFetch(robotsUrl, { timeoutMs: 5000, maxBytes: 256 * 1024 });
    if (res.statusCode >= 200 && res.statusCode < 300 && res.bodyText) {
      const lines = res.bodyText.split('\n');
      const rules = lines.filter((l) => /^\s*(user-agent|allow|disallow|sitemap):/i.test(l));
      const hasSitemap = /sitemap:\s*https?:\/\//i.test(res.bodyText);
      const disallowed = lines
        .filter((l) => /^\s*disallow:\s*/i.test(l))
        .map((l) => l.replace(/^\s*disallow:\s*/i, '').trim())
        .filter(Boolean);

      return {
        checked: true,
        found: true,
        url: robotsUrl,
        rulesCount: rules.length,
        hasSitemapDirective: hasSitemap,
        disallowedPaths: disallowed,
      };
    }
  } catch {
    // robots.txt missing or failed to fetch
  }

  return {
    checked: true,
    found: false,
    url: robotsUrl,
    rulesCount: 0,
    hasSitemapDirective: false,
    disallowedPaths: [],
  };
}

/**
 * Checks for sitemap.xml availability on target root
 */
async function checkSitemapXml(origin: string): Promise<{
  checked: boolean;
  found: boolean;
  url: string;
  urlsFound: number;
}> {
  const sitemapUrl = `${origin}/sitemap.xml`;
  try {
    const res = await safeFetch(sitemapUrl, { timeoutMs: 5000, maxBytes: 512 * 1024 });
    if (res.statusCode >= 200 && res.statusCode < 300 && res.bodyText) {
      const locMatches = res.bodyText.match(/<loc>([\s\S]*?)<\/loc>/gi) || [];
      return {
        checked: true,
        found: true,
        url: sitemapUrl,
        urlsFound: locMatches.length,
      };
    }
  } catch {
    // Sitemap missing
  }

  return {
    checked: true,
    found: false,
    url: sitemapUrl,
    urlsFound: 0,
  };
}

/**
 * Generates all structured findings across crawled pages and site-wide metrics.
 */
export function evaluateAuditFindings(
  pages: CrawledPage[],
  robotsInfo: { found: boolean; hasSitemapDirective: boolean },
  sitemapInfo: { found: boolean }
): { findings: AuditFinding[]; summary: SiteAuditSummary } {
  const findings: AuditFinding[] = [];

  // Groupings for multi-page duplicate detection
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();

  for (const p of pages) {
    // Group duplicates
    if (p.title) {
      const normTitle = p.title.toLowerCase();
      const list = titleMap.get(normTitle) || [];
      list.push(p.url);
      titleMap.set(normTitle, list);
    }

    if (p.description) {
      const normDesc = p.description.toLowerCase();
      const list = descMap.get(normDesc) || [];
      list.push(p.url);
      descMap.set(normDesc, list);
    }

    // 1. HTTP Status & Errors
    if (p.statusCode >= 400) {
      findings.push({
        code: 'HTTP_STATUS_ERROR',
        title: `HTTP ${p.statusCode} Error Encountered`,
        severity: 'error',
        category: 'Indexability',
        affectedUrls: [p.url],
        evidence: `Server responded with HTTP status ${p.statusCode} (${p.statusText})`,
        explanation: 'Search engine crawlers and users cannot access pages returning 4xx client errors or 5xx server errors.',
        recommendation: 'Fix broken links, restore the missing content, or implement a 301 redirect to an active canonical page.',
      });
    }

    // 2. HTTPS Usage
    if (!p.isHttps) {
      findings.push({
        code: 'NON_HTTPS_PAGE',
        title: 'Insecure HTTP Protocol',
        severity: 'warning',
        category: 'Technical & Security',
        affectedUrls: [p.url],
        evidence: `Page served over unencrypted HTTP: ${p.finalUrl}`,
        explanation: 'HTTPS is an essential security standard and a recognized search signal.',
        recommendation: 'Enforce automatic 301 redirection from HTTP to HTTPS with an active SSL/TLS certificate.',
      });
    }

    // 3. Title Checks
    if (!p.title) {
      findings.push({
        code: 'MISSING_TITLE',
        title: 'Missing HTML Title Tag',
        severity: 'error',
        category: 'Metadata',
        affectedUrls: [p.url],
        evidence: '<title> tag is missing or empty in page <head>',
        explanation: 'The title tag is one of the most critical on-page SEO signals and defines your primary SERP headline.',
        recommendation: 'Add a concise, descriptive title tag (between 30 and 65 characters) that includes your primary keyword.',
      });
    } else if (p.titleLength < 25) {
      findings.push({
        code: 'TITLE_TOO_SHORT',
        title: 'Title Tag is Too Short',
        severity: 'warning',
        category: 'Metadata',
        affectedUrls: [p.url],
        evidence: `Title length is ${p.titleLength} characters: "${p.title}"`,
        explanation: 'Very short titles under 25 characters miss valuable keyword context and SERP click opportunities.',
        recommendation: 'Expand the title to 30–65 characters by adding relevant secondary keywords or brand context.',
      });
    } else if (p.titleLength > 65) {
      findings.push({
        code: 'TITLE_TOO_LONG',
        title: 'Title Tag is Too Long',
        severity: 'warning',
        category: 'Metadata',
        affectedUrls: [p.url],
        evidence: `Title length is ${p.titleLength} characters (exceeds recommended 65 char limit)`,
        explanation: 'Titles exceeding 65 characters will be truncated with an ellipsis (…) in search engine results.',
        recommendation: 'Shorten your title tag to under 65 characters while keeping the most important keywords at the beginning.',
      });
    }

    // 4. Meta Description Checks
    if (!p.description) {
      findings.push({
        code: 'MISSING_META_DESCRIPTION',
        title: 'Missing Meta Description',
        severity: 'warning',
        category: 'Metadata',
        affectedUrls: [p.url],
        evidence: '<meta name="description"> tag was not found in page HTML',
        explanation: 'Without a meta description, search engines generate automated page snippets that may not be compelling.',
        recommendation: 'Write an actionable meta description between 120 and 160 characters summarizing the page value.',
      });
    } else if (p.descriptionLength < 70) {
      findings.push({
        code: 'META_DESCRIPTION_TOO_SHORT',
        title: 'Meta Description is Too Short',
        severity: 'info',
        category: 'Metadata',
        affectedUrls: [p.url],
        evidence: `Description length is only ${p.descriptionLength} characters`,
        explanation: 'Short meta descriptions under 70 characters underutilize available SERP preview real estate.',
        recommendation: 'Expand the meta description to 120–160 characters to improve search click-through rate (CTR).',
      });
    } else if (p.descriptionLength > 165) {
      findings.push({
        code: 'META_DESCRIPTION_TOO_LONG',
        title: 'Meta Description is Too Long',
        severity: 'info',
        category: 'Metadata',
        affectedUrls: [p.url],
        evidence: `Description length is ${p.descriptionLength} characters (exceeds 165 char standard)`,
        explanation: 'Descriptions longer than 165 characters are truncated on mobile search results.',
        recommendation: 'Keep the meta description concise (between 120 and 160 characters).',
      });
    }

    // 5. H1 Tag Checks
    if (p.h1List.length === 0) {
      findings.push({
        code: 'MISSING_H1',
        title: 'Missing H1 Heading',
        severity: 'error',
        category: 'Content & Structure',
        affectedUrls: [p.url],
        evidence: 'Zero <h1> tags found in page markup',
        explanation: 'An H1 tag provides the primary topic heading for both visitors and assistive reading technologies.',
        recommendation: 'Add a single, clear <h1> heading at the top of the main page body.',
      });
    } else if (p.h1List.length > 1) {
      findings.push({
        code: 'MULTIPLE_H1',
        title: 'Multiple H1 Headings Detected',
        severity: 'warning',
        category: 'Content & Structure',
        affectedUrls: [p.url],
        evidence: `Found ${p.h1List.length} distinct <h1> tags: ${p.h1List.slice(0, 3).map((h) => `"${h}"`).join(', ')}`,
        explanation: 'Having multiple H1 tags can dilute primary topical focus across page sections.',
        recommendation: 'Maintain a single primary <h1> per page and structure subordinate subsections with <h2> and <h3> tags.',
      });
    }

    // 6. Canonical URL Checks
    if (!p.canonicalUrl) {
      findings.push({
        code: 'MISSING_CANONICAL',
        title: 'Missing Canonical Tag',
        severity: 'warning',
        category: 'Indexability',
        affectedUrls: [p.url],
        evidence: 'No <link rel="canonical"> tag found in page HTML',
        explanation: 'Canonical tags specify the authoritative master copy of a webpage, preventing duplicate content confusion.',
        recommendation: 'Add a self-referencing absolute <link rel="canonical" href="..."> tag to every indexable page.',
      });
    }

    // 7. Robots Directives
    const combinedRobots = `${p.robotsMeta || ''} ${p.xRobotsTag || ''}`.toLowerCase();
    if (combinedRobots.includes('noindex')) {
      findings.push({
        code: 'NOINDEX_DIRECTIVE_FOUND',
        title: 'Page Blocked from Indexing (noindex)',
        severity: 'info',
        category: 'Indexability',
        affectedUrls: [p.url],
        evidence: `Robots directive: "${combinedRobots.trim()}"`,
        explanation: 'A noindex directive instructs search engines not to display this page in search results.',
        recommendation: 'If this page is intended for public search traffic, remove the "noindex" tag from HTML or response headers.',
      });
    }

    // 8. Viewport / Mobile
    if (!p.hasViewport) {
      findings.push({
        code: 'MISSING_VIEWPORT',
        title: 'Missing Mobile Viewport Meta Tag',
        severity: 'error',
        category: 'Technical & Security',
        affectedUrls: [p.url],
        evidence: '<meta name="viewport"> tag missing from <head>',
        explanation: 'Without a viewport meta tag, mobile browsers render desktop-width layouts, failing mobile usability criteria.',
        recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> to your document <head>.',
      });
    }

    // 9. Images Missing Alt Attributes
    if (p.imagesMissingAlt > 0) {
      findings.push({
        code: 'IMAGES_MISSING_ALT',
        title: `${p.imagesMissingAlt} Images Missing Alt Text`,
        severity: 'warning',
        category: 'Images & Media',
        affectedUrls: [p.url],
        evidence: `Found ${p.imagesMissingAlt} of ${p.imagesTotal} images without alt text. Samples: ${p.missingAltSamples.join(', ')}`,
        explanation: 'Image alt attributes provide accessible descriptions for screen readers and context for image search indexing.',
        recommendation: 'Add descriptive alt="..." attributes to all meaningful content images.',
      });
    }

    // 10. Low Word Count / Thin Content
    if (p.statusCode === 200 && p.wordCount < 100) {
      findings.push({
        code: 'THIN_CONTENT',
        title: 'Very Low Word Count (< 100 words)',
        severity: 'warning',
        category: 'Content & Structure',
        affectedUrls: [p.url],
        evidence: `Extracted body text contains approximately ${p.wordCount} words`,
        explanation: 'Pages with sparse text may be flagged as low-value or thin content by automated search indexers.',
        recommendation: 'Expand the page content with clear explanations, FAQs, or functional documentation.',
      });
    }
  }

  // Cross-page Duplicate Title Detection
  for (const [normTitle, urlList] of titleMap.entries()) {
    if (urlList.length > 1) {
      findings.push({
        code: 'DUPLICATE_TITLE',
        title: `Duplicate Title Tag Across ${urlList.length} Pages`,
        severity: 'error',
        category: 'Metadata',
        affectedUrls: urlList,
        evidence: `Title: "${normTitle}" is shared by ${urlList.length} pages`,
        explanation: 'Identical title tags make it difficult for search engines to distinguish between pages.',
        recommendation: 'Ensure every crawled page has a unique title describing its distinct topic.',
      });
    }
  }

  // Cross-page Duplicate Meta Description Detection
  for (const [normDesc, urlList] of descMap.entries()) {
    if (urlList.length > 1) {
      findings.push({
        code: 'DUPLICATE_META_DESCRIPTION',
        title: `Duplicate Meta Description Across ${urlList.length} Pages`,
        severity: 'warning',
        category: 'Metadata',
        affectedUrls: urlList,
        evidence: `Description: "${normDesc.slice(0, 90)}..." is shared by ${urlList.length} pages`,
        explanation: 'Duplicate meta descriptions reduce the uniqueness and CTR of your SERP listings.',
        recommendation: 'Provide unique, compelling meta descriptions for each page.',
      });
    }
  }

  // Site-wide robots.txt check
  if (!robotsInfo.found) {
    findings.push({
      code: 'MISSING_ROBOTS_TXT',
      title: 'Missing robots.txt File',
      severity: 'warning',
      category: 'Indexability',
      affectedUrls: ['/robots.txt'],
      evidence: 'robots.txt returned 404 or connection error',
      explanation: 'A robots.txt file guides search engine crawlers on which areas of your website should or should not be accessed.',
      recommendation: 'Create a standard robots.txt file at your website root with valid User-agent and Allow/Disallow rules.',
    });
  } else if (!robotsInfo.hasSitemapDirective) {
    findings.push({
      code: 'ROBOTS_MISSING_SITEMAP',
      title: 'robots.txt Missing Sitemap Directive',
      severity: 'info',
      category: 'Indexability',
      affectedUrls: ['/robots.txt'],
      evidence: 'robots.txt does not contain a "Sitemap: ..." entry',
      explanation: 'Listing your XML sitemap URL inside robots.txt allows web crawlers to quickly discover your sitemap index.',
      recommendation: 'Add "Sitemap: https://yourdomain.com/sitemap.xml" to the bottom of robots.txt.',
    });
  }

  // Site-wide sitemap.xml check
  if (!sitemapInfo.found) {
    findings.push({
      code: 'MISSING_XML_SITEMAP',
      title: 'Missing XML Sitemap',
      severity: 'warning',
      category: 'Indexability',
      affectedUrls: ['/sitemap.xml'],
      evidence: 'sitemap.xml returned 404 or connection error',
      explanation: 'An XML sitemap helps search engines discover all canonical URLs on your domain efficiently.',
      recommendation: 'Generate an XML sitemap listing your public pages and submit it to Google Search Console.',
    });
  }

  // Calculate Summary Metrics
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInfo = 0;

  for (const f of findings) {
    if (f.severity === 'error') totalErrors++;
    else if (f.severity === 'warning') totalWarnings++;
    else if (f.severity === 'info') totalInfo++;
  }

  // Estimate a balanced technical health score (0-100) based on checked standards
  const totalChecksAttempted = pages.length * 10 + 2;
  const penalties = totalErrors * 8 + totalWarnings * 3 + totalInfo * 1;
  const healthScore = Math.max(10, Math.min(100, Math.round(100 - (penalties / Math.max(1, totalChecksAttempted)) * 30)));
  const totalPassed = Math.max(0, totalChecksAttempted - (totalErrors + totalWarnings));

  return {
    findings,
    summary: {
      totalErrors,
      totalWarnings,
      totalInfo,
      totalPassed,
      healthScore,
    },
  };
}

/**
 * Runs a multi-page Site Audit crawl against an authorized domain.
 */
export async function executeSiteAudit(
  targetUrl: string,
  options: SiteAuditOptions = {}
): Promise<SiteAuditReport> {
  const maxPages = Math.min(25, Math.max(1, options.maxPages || 10));
  const startTime = performance.now();

  const validation = validateTargetUrl(targetUrl);
  if (!validation.valid || !validation.sanitizedUrl) {
    throw new Error(validation.error || 'Invalid target URL');
  }

  const initialUrl = validation.sanitizedUrl;
  const parsedTarget = new URL(initialUrl);
  const domain = parsedTarget.hostname.toLowerCase();
  const origin = parsedTarget.origin;

  options.onProgress?.({
    status: 'running',
    discovered: 1,
    crawled: 0,
    currentUrl: initialUrl,
  });

  // 1. Fetch robots.txt and sitemap.xml in parallel
  const [robotsInfo, sitemapInfo] = await Promise.all([
    checkRobotsTxt(origin),
    checkSitemapXml(origin),
  ]);

  // 2. Multi-page Crawl Queue
  const crawlQueue: string[] = [initialUrl];
  const visitedUrls = new Set<string>();
  const crawledPages: CrawledPage[] = [];
  let pagesFailed = 0;

  while (crawlQueue.length > 0 && crawledPages.length < maxPages) {
    // Respect overall crawl duration limit (45s max)
    if (performance.now() - startTime > 45000) {
      break;
    }

    const currentUrl = crawlQueue.shift()!;
    if (visitedUrls.has(currentUrl)) continue;
    visitedUrls.add(currentUrl);

    options.onProgress?.({
      status: 'running',
      discovered: crawlQueue.length + visitedUrls.size,
      crawled: crawledPages.length,
      currentUrl,
    });

    try {
      // Fetch page safely with SSRF protection
      const fetchResult = await safeFetch(currentUrl, {
        timeoutMs: 8000,
        maxBytes: 2 * 1024 * 1024,
      });

      // Parse HTML only if content-type is HTML
      const isHtml = /text\/html|application\/xhtml\+xml/i.test(fetchResult.contentType);
      if (isHtml) {
        const pageData = analyzePageHtml(
          fetchResult.bodyText,
          currentUrl,
          fetchResult.statusCode,
          fetchResult.statusText,
          fetchResult.headers,
          fetchResult.redirectChain,
          fetchResult.responseTimeMs,
          fetchResult.finalUrl
        );

        crawledPages.push(pageData);

        // Queue newly discovered internal links (same domain only)
        for (const link of pageData.internalLinks) {
          if (!visitedUrls.has(link) && !crawlQueue.includes(link)) {
            try {
              const parsedLink = new URL(link);
              if (parsedLink.hostname.toLowerCase() === domain) {
                // Avoid crawling non-html files like pdfs, images, zips
                if (!/\.(pdf|zip|tar|gz|jpg|jpeg|png|gif|svg|webp|mp4|mp3|exe|dmg)$/i.test(parsedLink.pathname)) {
                  crawlQueue.push(link);
                }
              }
            } catch {
              // Ignore invalid link format
            }
          }
        }
      } else {
        // Non-HTML page fetched
        crawledPages.push({
          url: currentUrl,
          finalUrl: fetchResult.finalUrl,
          statusCode: fetchResult.statusCode,
          statusText: fetchResult.statusText,
          responseTimeMs: fetchResult.responseTimeMs,
          contentType: fetchResult.contentType,
          redirectChain: fetchResult.redirectChain,
          isHttps: fetchResult.finalUrl.startsWith('https://'),
          xRobotsTag: fetchResult.headers.get('x-robots-tag'),
          title: null,
          titleLength: 0,
          description: null,
          descriptionLength: 0,
          h1List: [],
          h2Count: 0,
          canonicalUrl: null,
          robotsMeta: null,
          hasViewport: false,
          internalLinks: [],
          externalLinks: [],
          imagesTotal: 0,
          imagesMissingAlt: 0,
          missingAltSamples: [],
          wordCount: 0,
        });
      }
    } catch (err: any) {
      pagesFailed++;
      crawledPages.push({
        url: currentUrl,
        finalUrl: currentUrl,
        statusCode: 0,
        statusText: 'Crawl Error',
        responseTimeMs: 0,
        contentType: '',
        redirectChain: [],
        isHttps: currentUrl.startsWith('https://'),
        xRobotsTag: null,
        title: null,
        titleLength: 0,
        description: null,
        descriptionLength: 0,
        h1List: [],
        h2Count: 0,
        canonicalUrl: null,
        robotsMeta: null,
        hasViewport: false,
        internalLinks: [],
        externalLinks: [],
        imagesTotal: 0,
        imagesMissingAlt: 0,
        missingAltSamples: [],
        wordCount: 0,
        errorMessage: err.message || 'Failed to fetch page',
      });
    }

    // Polite request delay (300ms) between pages
    await new Promise((r) => setTimeout(r, 300));
  }

  // 3. Generate Findings & Report
  const { findings, summary } = evaluateAuditFindings(crawledPages, robotsInfo, sitemapInfo);
  const durationMs = Math.round(performance.now() - startTime);

  options.onProgress?.({
    status: 'completed',
    discovered: visitedUrls.size + crawlQueue.length,
    crawled: crawledPages.length,
  });

  return {
    auditId: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    targetUrl: initialUrl,
    domain,
    timestamp: new Date().toISOString(),
    durationMs,
    pagesDiscovered: visitedUrls.size + crawlQueue.length,
    pagesCrawled: crawledPages.length,
    pagesFailed,
    robotsTxt: {
      checked: robotsInfo.checked,
      found: robotsInfo.found,
      url: robotsInfo.url,
      rulesCount: robotsInfo.rulesCount,
      hasSitemapDirective: robotsInfo.hasSitemapDirective,
    },
    sitemapXml: {
      checked: sitemapInfo.checked,
      found: sitemapInfo.found,
      url: sitemapInfo.url,
      urlsFound: sitemapInfo.urlsFound,
    },
    summary,
    pages: crawledPages,
    findings,
  };
}
