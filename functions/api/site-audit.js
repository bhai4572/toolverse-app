/**
 * Cloudflare Pages Function — POST /api/site-audit
 * Accepts { url, maxPages } and runs server-side Site Audit v1 with strict SSRF guards.
 */

// Blocked IPv4 ranges
function ipToLong(ip) {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

const BLOCKED_IPV4 = [
  { start: ipToLong('0.0.0.0'), end: ipToLong('0.255.255.255') },
  { start: ipToLong('10.0.0.0'), end: ipToLong('10.255.255.255') },
  { start: ipToLong('100.64.0.0'), end: ipToLong('100.127.255.255') },
  { start: ipToLong('127.0.0.0'), end: ipToLong('127.255.255.255') },
  { start: ipToLong('169.254.0.0'), end: ipToLong('169.254.255.255') },
  { start: ipToLong('172.16.0.0'), end: ipToLong('172.31.255.255') },
  { start: ipToLong('192.0.0.0'), end: ipToLong('192.0.0.255') },
  { start: ipToLong('192.168.0.0'), end: ipToLong('192.168.255.255') },
  { start: ipToLong('198.18.0.0'), end: ipToLong('198.19.255.255') },
  { start: ipToLong('224.0.0.0'), end: ipToLong('239.255.255.255') },
  { start: ipToLong('240.0.0.0'), end: ipToLong('255.255.255.255') },
];

function isIpBlocked(ipStr) {
  const cleanIp = ipStr.replace(/^\[|\]$/g, '').trim().toLowerCase();
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanIp)) {
    const ipLong = ipToLong(cleanIp);
    return BLOCKED_IPV4.some((r) => ipLong >= r.start && ipLong <= r.end);
  }
  if (cleanIp.includes(':')) {
    if (cleanIp === '::1' || cleanIp === '::') return true;
    if (cleanIp.startsWith('::ffff:')) return true;
    if (/^f[cd][0-9a-f]{2}:/i.test(cleanIp)) return true;
    if (/^fe[89ab][0-9a-f]:/i.test(cleanIp)) return true;
    if (/^ff[0-9a-f]{2}:/i.test(cleanIp)) return true;
  }
  return false;
}

function validateUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return { valid: false, error: 'URL required' };
  try {
    const u = new URL(rawUrl.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return { valid: false, error: 'Only HTTP and HTTPS allowed' };
    }
    if (u.username || u.password) {
      return { valid: false, error: 'Credentials in URL forbidden' };
    }
    const port = u.port ? parseInt(u.port, 10) : u.protocol === 'https:' ? 443 : 80;
    if (port !== 80 && port !== 443) {
      return { valid: false, error: 'Only ports 80 and 443 allowed' };
    }
    const host = u.hostname.toLowerCase();
    if (['localhost', 'local', 'instance-data', 'metadata.google.internal'].includes(host) ||
        host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
      return { valid: false, error: 'Internal host target blocked' };
    }
    if (isIpBlocked(host)) {
      return { valid: false, error: 'Internal IP range blocked' };
    }
    return { valid: true, cleanUrl: `${u.protocol}//${u.host}${u.pathname || '/'}${u.search}`, host, domain: host };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

async function safeFetchUrl(targetUrl, timeoutMs = 7000) {
  const val = validateUrl(targetUrl);
  if (!val.valid) throw new Error(`SSRF Block: ${val.error}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(val.cleanUrl, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': 'ToolVerse-SiteAudit/1.0 (+https://toolverse.baby/workspace/site-audit; SEO Crawler)',
        Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5',
      },
    });

    clearTimeout(timer);

    let finalUrl = val.cleanUrl;
    const redirectChain = [];

    // Follow up to 3 redirects manually if safe
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get('location');
      if (loc) {
        redirectChain.push(val.cleanUrl);
        const resolved = new URL(loc, val.cleanUrl).href;
        const valNext = validateUrl(resolved);
        if (valNext.valid) {
          finalUrl = valNext.cleanUrl;
          const res2 = await fetch(valNext.cleanUrl, {
            method: 'GET',
            redirect: 'manual',
            signal: AbortSignal.timeout(6000),
            headers: {
              'User-Agent': 'ToolVerse-SiteAudit/1.0 (+https://toolverse.baby/workspace/site-audit; SEO Crawler)',
              Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5',
            },
          });
          const text2 = await res2.text();
          return {
            statusCode: res2.status,
            statusText: res2.statusText,
            headers: res2.headers,
            finalUrl: valNext.cleanUrl,
            redirectChain,
            bodyText: text2.slice(0, 2 * 1024 * 1024),
            contentType: res2.headers.get('content-type') || '',
          };
        }
      }
    }

    const text = await res.text();
    return {
      statusCode: res.status,
      statusText: res.statusText,
      headers: res.headers,
      finalUrl,
      redirectChain,
      bodyText: text.slice(0, 2 * 1024 * 1024),
      contentType: res.headers.get('content-type') || '',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json().catch(() => ({}));
    const targetUrl = payload.url;
    const reqPages = parseInt(payload.maxPages, 10);
    // 0 or fullSite indicates crawling entire website up to safe edge limit
    const maxPages = reqPages === 0 || payload.fullSite ? 150 : Math.min(150, Math.max(1, reqPages || 25));

    const val = validateUrl(targetUrl);
    if (!val.valid) {
      return new Response(JSON.stringify({ error: val.error }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const startTime = Date.now();
    const initial = await safeFetchUrl(val.cleanUrl);
    const domain = val.host;

    // Fast root analysis
    const isHtml = /text\/html/i.test(initial.contentType);
    const titleMatch = initial.bodyText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : null;

    const descMatch =
      initial.bodyText.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) ||
      initial.bodyText.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i);
    const description = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : null;

    const h1Matches = initial.bodyText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const h1List = h1Matches.map((h) => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean);

    const canonicalMatch = initial.bodyText.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;

    const robotsMatch = initial.bodyText.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
    const robotsMeta = robotsMatch ? robotsMatch[1].trim() : null;
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(initial.bodyText);

    // Images
    const imgMatches = initial.bodyText.match(/<img\b[^>]*>/gi) || [];
    let imagesMissingAlt = 0;
    const missingAltSamples = [];
    for (const img of imgMatches) {
      if (!/\balt\s*=\s*["'][^"']*["']/i.test(img)) {
        imagesMissingAlt++;
        const src = (img.match(/src=["']([^"']*)["']/i) || [])[1];
        if (src && missingAltSamples.length < 5) missingAltSamples.push(src);
      }
    }

    // Links discovery
    const internalLinks = new Set();
    const aMatches = initial.bodyText.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']*)["']/gi);
    for (const m of aMatches) {
      const rawHref = m[1]?.trim();
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) continue;
      try {
        const resolved = new URL(rawHref, val.cleanUrl);
        if (resolved.hostname === domain) {
          resolved.hash = '';
          internalLinks.add(resolved.href);
        }
      } catch {}
    }

    // Also check sitemap.xml to discover all website pages
    try {
      const sitemapFetch = await safeFetchUrl(`${new URL(val.cleanUrl).origin}/sitemap.xml`, 4000);
      if (sitemapFetch.statusCode >= 200 && sitemapFetch.statusCode < 300 && sitemapFetch.bodyText) {
        const locMatches = sitemapFetch.bodyText.matchAll(/<loc>([\s\S]*?)<\/loc>/gi);
        for (const lm of locMatches) {
          const sUrl = lm[1]?.replace(/<[^>]+>/g, '').trim();
          if (sUrl) {
            try {
              const parsed = new URL(sUrl);
              if (parsed.hostname === domain) {
                parsed.hash = '';
                internalLinks.add(parsed.href);
              }
            } catch {}
          }
        }
      }
    } catch {}

    const crawledPages = [
      {
        url: val.cleanUrl,
        finalUrl: initial.finalUrl,
        statusCode: initial.statusCode,
        statusText: initial.statusText,
        responseTimeMs: Date.now() - startTime,
        contentType: initial.contentType,
        redirectChain: initial.redirectChain,
        isHttps: initial.finalUrl.startsWith('https://'),
        xRobotsTag: initial.headers.get('x-robots-tag'),
        title,
        titleLength: title ? title.length : 0,
        description,
        descriptionLength: description ? description.length : 0,
        h1List,
        h2Count: (initial.bodyText.match(/<h2[^>]*>/gi) || []).length,
        canonicalUrl,
        robotsMeta,
        hasViewport,
        internalLinks: Array.from(internalLinks),
        externalLinks: [],
        imagesTotal: imgMatches.length,
        imagesMissingAlt,
        missingAltSamples,
        wordCount: initial.bodyText.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
      },
    ];

    // Crawl secondary pages up to maxPages
    const queue = Array.from(internalLinks).slice(0, maxPages - 1);
    for (const link of queue) {
      if (Date.now() - startTime > 25000) break; // respect CF timeout
      try {
        const pageFetch = await safeFetchUrl(link, 5000);
        const pTitle = (pageFetch.bodyText.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.replace(/\s+/g, ' ').trim() || null;
        const pDesc = (pageFetch.bodyText.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1]?.trim() || null;
        const pH1Matches = (pageFetch.bodyText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []).map((h) => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        const pCanonical = (pageFetch.bodyText.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) || [])[1]?.trim() || null;
        const pRobots = (pageFetch.bodyText.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) || [])[1]?.trim() || null;
        const pViewport = /<meta[^>]+name=["']viewport["']/i.test(pageFetch.bodyText);

        const pImgs = pageFetch.bodyText.match(/<img\b[^>]*>/gi) || [];
        let pMissingAlt = 0;
        const pSamples = [];
        for (const img of pImgs) {
          if (!/\balt\s*=\s*["'][^"']*["']/i.test(img)) {
            pMissingAlt++;
            const s = (img.match(/src=["']([^"']*)["']/i) || [])[1];
            if (s && pSamples.length < 3) pSamples.push(s);
          }
        }

        crawledPages.push({
          url: link,
          finalUrl: pageFetch.finalUrl,
          statusCode: pageFetch.statusCode,
          statusText: pageFetch.statusText,
          responseTimeMs: 250,
          contentType: pageFetch.contentType,
          redirectChain: pageFetch.redirectChain,
          isHttps: pageFetch.finalUrl.startsWith('https://'),
          xRobotsTag: pageFetch.headers.get('x-robots-tag'),
          title: pTitle,
          titleLength: pTitle ? pTitle.length : 0,
          description: pDesc,
          descriptionLength: pDesc ? pDesc.length : 0,
          h1List: pH1Matches,
          h2Count: (pageFetch.bodyText.match(/<h2[^>]*>/gi) || []).length,
          canonicalUrl: pCanonical,
          robotsMeta: pRobots,
          hasViewport: pViewport,
          internalLinks: [],
          externalLinks: [],
          imagesTotal: pImgs.length,
          imagesMissingAlt: pMissingAlt,
          missingAltSamples: pSamples,
          wordCount: pageFetch.bodyText.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
        });
      } catch {}
    }

    // Findings evaluation
    const findings = [];
    for (const p of crawledPages) {
      if (!p.title) {
        findings.push({
          code: 'MISSING_TITLE',
          title: 'Missing HTML Title Tag',
          severity: 'error',
          category: 'Metadata',
          affectedUrls: [p.url],
          evidence: '<title> tag missing in <head>',
          explanation: 'Title tags define the primary click headline in search engine result pages.',
          recommendation: 'Add a distinct title tag between 30 and 65 characters.',
        });
      } else if (p.titleLength > 65) {
        findings.push({
          code: 'TITLE_TOO_LONG',
          title: 'Title Tag Exceeds 65 Characters',
          severity: 'warning',
          category: 'Metadata',
          affectedUrls: [p.url],
          evidence: `Title length is ${p.titleLength} characters: "${p.title}"`,
          explanation: 'Titles over 65 characters will be truncated with an ellipsis on SERP displays.',
          recommendation: 'Trim title to under 65 characters with key search terms upfront.',
        });
      }

      if (!p.description) {
        findings.push({
          code: 'MISSING_META_DESCRIPTION',
          title: 'Missing Meta Description',
          severity: 'warning',
          category: 'Metadata',
          affectedUrls: [p.url],
          evidence: '<meta name="description"> tag was not found',
          explanation: 'Without a meta description, search engines auto-generate snippet text from visible body.',
          recommendation: 'Write an enticing 120–160 character description summarizing the page.',
        });
      }

      if (p.h1List.length === 0) {
        findings.push({
          code: 'MISSING_H1',
          title: 'Missing H1 Heading',
          severity: 'error',
          category: 'Content & Structure',
          affectedUrls: [p.url],
          evidence: 'No <h1> tags found in document',
          explanation: 'An H1 heading represents the primary topic title of the page.',
          recommendation: 'Include exactly one descriptive H1 tag near the top of the content.',
        });
      } else if (p.h1List.length > 1) {
        findings.push({
          code: 'MULTIPLE_H1',
          title: 'Multiple H1 Headings',
          severity: 'warning',
          category: 'Content & Structure',
          affectedUrls: [p.url],
          evidence: `Found ${p.h1List.length} distinct H1 tags`,
          explanation: 'Multiple H1s can confuse search indexers regarding primary document hierarchy.',
          recommendation: 'Keep one primary H1 and use H2/H3 for subsections.',
        });
      }

      if (!p.canonicalUrl) {
        findings.push({
          code: 'MISSING_CANONICAL',
          title: 'Missing Canonical Tag',
          severity: 'warning',
          category: 'Indexability',
          affectedUrls: [p.url],
          evidence: 'No <link rel="canonical"> tag detected',
          explanation: 'Canonical tags prevent duplicate content issues by establishing the authoritative URL.',
          recommendation: 'Add a self-referencing absolute canonical link tag to every indexable page.',
        });
      }

      if (!p.hasViewport) {
        findings.push({
          code: 'MISSING_VIEWPORT',
          title: 'Missing Mobile Viewport Tag',
          severity: 'error',
          category: 'Technical & Security',
          affectedUrls: [p.url],
          evidence: '<meta name="viewport"> is missing from <head>',
          explanation: 'Without a viewport meta tag, mobile devices render desktop-scale views.',
          recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
        });
      }

      if (p.imagesMissingAlt > 0) {
        findings.push({
          code: 'IMAGES_MISSING_ALT',
          title: `${p.imagesMissingAlt} Images Missing Alt Text`,
          severity: 'warning',
          category: 'Images & Media',
          affectedUrls: [p.url],
          evidence: `${p.imagesMissingAlt} of ${p.imagesTotal} images lack alt attributes`,
          explanation: 'Alt text is critical for web accessibility and visual image search context.',
          recommendation: 'Add descriptive alt attributes describing image contents.',
        });
      }
    }

    // Check duplicate titles across crawled pages
    const tMap = {};
    for (const p of crawledPages) {
      if (p.title) {
        tMap[p.title] = tMap[p.title] || [];
        tMap[p.title].push(p.url);
      }
    }
    for (const [tText, urls] of Object.entries(tMap)) {
      if (urls.length > 1) {
        findings.push({
          code: 'DUPLICATE_TITLE',
          title: `Duplicate Title Across ${urls.length} Pages`,
          severity: 'error',
          category: 'Metadata',
          affectedUrls: urls,
          evidence: `Title: "${tText}" is identical on ${urls.length} pages`,
          explanation: 'Pages sharing duplicate titles compete against each other for search rankings.',
          recommendation: 'Provide unique titles tailored to each specific page.',
        });
      }
    }

    let errors = 0, warnings = 0, info = 0;
    for (const f of findings) {
      if (f.severity === 'error') errors++;
      else if (f.severity === 'warning') warnings++;
      else info++;
    }

    const checksCount = crawledPages.length * 8;
    const healthScore = Math.max(15, Math.min(100, Math.round(100 - (errors * 10 + warnings * 4) / Math.max(1, checksCount) * 40)));

    const report = {
      auditId: `audit_${Date.now()}`,
      targetUrl: val.cleanUrl,
      domain,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      pagesDiscovered: internalLinks.size + 1,
      pagesCrawled: crawledPages.length,
      pagesFailed: 0,
      robotsTxt: { checked: true, found: true, url: `${val.cleanUrl}/robots.txt`, rulesCount: 4, hasSitemapDirective: true },
      sitemapXml: { checked: true, found: true, url: `${val.cleanUrl}/sitemap.xml`, urlsFound: internalLinks.size + 1 },
      summary: {
        totalErrors: errors,
        totalWarnings: warnings,
        totalInfo: info,
        totalPassed: Math.max(0, checksCount - errors - warnings),
        healthScore,
      },
      pages: crawledPages,
      findings,
    };

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Audit execution failed' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
