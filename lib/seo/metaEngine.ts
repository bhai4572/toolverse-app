import { getToolBySlug, getToolsByCategory, CATEGORIES } from '@/lib/tools/registry';
import { getBlogPostBySlug } from '@/lib/blog/posts';
import { getToolPageContent } from '@/lib/seo/toolPageContent';
import { getCategoryPageContent } from '@/lib/seo/categoryPageContent';
import { getJobPageContent, buildJobPostingJsonLd } from '@/lib/seo/jobPageContent';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>[];
}

/** Always use the live production domain for canonicals/schema (not preview hosts). */
export const SITE_URL = 'https://toolverse.baby';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

export function getSiteUrl(): string {
  return SITE_URL;
}

/** Standard brand/entity node for ToolVerse */
export function buildOrganizationNode(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'ToolVerse',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: `${SITE_URL}/favicon.svg`,
      contentUrl: `${SITE_URL}/favicon.svg`,
      caption: 'ToolVerse Logo',
      inLanguage: 'en-US',
    },
    image: { '@id': LOGO_ID },
    description:
      'Privacy-first free online tools for PDFs, images, calculators, writing, developers, and job search. Most tools process data locally in your browser memory.',
    email: 'support@toolverse.baby',
    foundingDate: '2025',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@toolverse.baby',
        url: `${SITE_URL}/legal/contact`,
        availableLanguage: ['English'],
      },
    ],
  };
}

/** Root WebSite node with official search action pointing to real search query parameter */
export function buildWebSiteNode(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'ToolVerse',
    description:
      'Free privacy-first online tools for PDFs, images, calculators, writing, developers, and job search.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
  };
}

/** BreadcrumbList node matching visible breadcrumb navigation */
export function buildBreadcrumbNode(
  canonicalUrl: string,
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebPage / ItemPage / CollectionPage / AboutPage / ContactPage node */
export function buildWebPageNode(params: {
  canonicalUrl: string;
  name: string;
  description: string;
  type?: string;
  hasBreadcrumbs?: boolean;
  mainEntityId?: string;
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': params.type || 'WebPage',
    '@id': `${params.canonicalUrl}#webpage`,
    url: params.canonicalUrl,
    name: params.name,
    description: params.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };

  if (params.hasBreadcrumbs) {
    node.breadcrumb = { '@id': `${params.canonicalUrl}#breadcrumb` };
  }

  if (params.mainEntityId) {
    node.mainEntity = { '@id': params.mainEntityId };
  }

  return node;
}

/** Maps ToolVerse internal category slug to Schema.org standard applicationCategory */
export function mapCategoryToApplicationCategory(categorySlug: string): string {
  switch (categorySlug) {
    case 'pdf-document-tools':
    case 'file-archive-utilities':
      return 'UtilitiesApplication';
    case 'image-design-tools':
    case 'social-image-presets':
      return 'DesignApplication';
    case 'developer-cybersecurity-tools':
      return 'DeveloperApplication';
    case 'seo-url-tools':
      return 'UtilitiesApplication';
    case 'calculators-converters':
      return 'UtilitiesApplication';
    case 'business-finance-tools':
    case 'country-regional-tools':
    case 'career-jobs-employment-engine':
      return 'BusinessApplication';
    case 'text-writing-student-tools':
    case 'writing-grammar-academic-integrity-tools':
      return 'EducationalApplication';
    case 'creator-social-tools':
      return 'SocialNetworkingApplication';
    default:
      return 'UtilitiesApplication';
  }
}

/** Wraps a list of connected Schema.org graph nodes into a unified JSON-LD graph envelope. */
export function wrapInGraph(nodes: (Record<string, unknown> | null | undefined)[]): Record<string, unknown>[] {
  const validNodes = nodes.filter((n): n is Record<string, unknown> => Boolean(n));
  return [
    {
      '@context': 'https://schema.org',
      '@graph': validNodes,
    },
  ];
}

export function getMetadataForPath(pathname: string): PageMetadata {
  const baseUrl = SITE_URL;
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);

  // 1. Homepage (/)
  if (parts.length === 0) {
    const canonicalUrl = `${baseUrl}/`;
    const title = 'ToolVerse — 100+ Free Online Tools for Everyday Work | Privacy-First';
    const description =
      'Free privacy-first online tools for PDFs, images, calculators, writing, developers, and job search. Most tools run locally in your browser — no sign-up required.';

    const pageFaqs = [
      {
        question: 'Are ToolVerse tools free?',
        answer: 'Yes. Core utilities are free to use in your browser without creating an account for basic workflows.',
      },
      {
        question: 'Do you upload my PDFs or photos?',
        answer: 'Client-side tools process files in your browser memory. Your documents are not uploaded to ToolVerse servers for those tools.',
      },
      {
        question: 'Where should I start?',
        answer: 'Use site search, pick a category, or open popular tools like target-size image compression, PDF merge, or the guides blog.',
      },
    ];

    const graph = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'WebPage',
      }),
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ];

    return {
      title,
      description,
      keywords: [
        'free online tools',
        'pdf tools',
        'image compressor',
        'word counter',
        'zakat calculator',
        'privacy first tools',
        'toolverse',
      ],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 2. Tool Pages (/tools/[slug])
  if (parts[0] === 'tools' && parts[1]) {
    const tool = getToolBySlug(parts[1]);
    if (tool) {
      const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;
      const pageSeo = getToolPageContent(tool.slug);
      const pageTitle =
        pageSeo?.seoTitle ?? `${tool.canonicalName} — Free Online Tool | ToolVerse`;
      const pageDesc =
        pageSeo?.seoDescription ??
        `${tool.shortDescription} Free, fast, and private — processed locally in your browser.`;

      const webAppId = `${canonicalUrl}#software`;

      const webAppSchema: Record<string, unknown> = {
        '@type': ['WebApplication', 'SoftwareApplication'],
        '@id': webAppId,
        name: tool.canonicalName,
        url: canonicalUrl,
        description: pageSeo?.answerFirst || tool.shortDescription,
        applicationCategory: mapCategoryToApplicationCategory(tool.categorySlug),
        operatingSystem: 'All (Web Browser)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        publisher: { '@id': ORGANIZATION_ID },
        author: { '@id': ORGANIZATION_ID },
        inLanguage: 'en-US',
      };

      if (tool.instructions && tool.instructions.length > 0) {
        webAppSchema.featureList = tool.instructions;
      }

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: tool.category, url: `${baseUrl}/category/${tool.categorySlug}` },
        { name: tool.canonicalName, url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: pageTitle,
        description: pageDesc,
        type: 'ItemPage',
        hasBreadcrumbs: true,
        mainEntityId: webAppId,
      });

      const pageFaqs =
        pageSeo?.faqs ??
        ([
          {
            question: `Is ${tool.canonicalName} completely free to use?`,
            answer: `Yes, ${tool.canonicalName} is free with unlimited usage. No hidden fees or sign-up required.`,
          },
          {
            question: `Is my data safe and private when using ${tool.canonicalName}?`,
            answer: `${tool.privacyMessage} Client-side tools process data in your browser where possible.`,
          },
          {
            question: `Does ${tool.canonicalName} work on mobile phones and tablets?`,
            answer: `Yes. ${tool.canonicalName} is responsive and works on phones, tablets, and desktops.`,
          },
        ] as const);

      const faqNode = {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };

      const howToNode =
        tool.instructions && tool.instructions.length >= 2
          ? {
              '@type': 'HowTo',
              '@id': `${canonicalUrl}#howto`,
              name: `How to Use ${tool.canonicalName}`,
              description: pageSeo?.answerFirst || tool.shortDescription,
              step: tool.instructions.map((inst, index) => ({
                '@type': 'HowToStep',
                position: index + 1,
                name: `Step ${index + 1}`,
                text: inst,
              })),
            }
          : null;

      const graph = [
        buildOrganizationNode(),
        buildWebSiteNode(),
        pageNode,
        breadcrumbs,
        webAppSchema,
        faqNode,
        howToNode,
      ];

      return {
        title: pageTitle,
        description: pageDesc,
        keywords: tool.keywords,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph(graph),
      };
    }
  }

  // 3. Category Pages (/category/[slug])
  if (parts[0] === 'category' && parts[1]) {
    const category = CATEGORIES.find((c) => c.slug === parts[1]);
    if (category) {
      const canonicalUrl = `${baseUrl}/category/${category.slug}`;
      const catSeo = getCategoryPageContent(category.slug);
      const catTools = getToolsByCategory(category.slug);
      const pageTitle = catSeo?.seoTitle ?? `${category.name} — Free Online Tools | ToolVerse`;
      const pageDesc =
        catSeo?.seoDescription ??
        `${category.description} Free, fast, privacy-first browser utilities.`;

      const itemListId = `${canonicalUrl}#itemlist`;

      const itemListNode: Record<string, unknown> = {
        '@type': 'ItemList',
        '@id': itemListId,
        name: `${category.name} Tools Collection`,
        description: catSeo?.intro || category.description,
        numberOfItems: catTools.length,
        itemListElement: catTools.map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.canonicalName,
          url: `${baseUrl}/tools/${t.slug}`,
          description: t.shortDescription,
        })),
      };

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: category.name, url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: pageTitle,
        description: pageDesc,
        type: 'CollectionPage',
        hasBreadcrumbs: true,
        mainEntityId: itemListId,
      });

      const graph = [
        buildOrganizationNode(),
        buildWebSiteNode(),
        pageNode,
        breadcrumbs,
        itemListNode,
      ];

      return {
        title: pageTitle,
        description: pageDesc,
        keywords: [category.name.toLowerCase(), 'free online tools', 'toolverse'],
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph(graph),
      };
    }
  }

  // 4. Blog Posts & Blog Index (/blog and /blog/[slug])
  if (parts[0] === 'blog') {
    if (parts[1]) {
      const post = getBlogPostBySlug(parts[1]);
      if (post) {
        const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
        const ogImage = post.featuredImage || DEFAULT_OG_IMAGE;
        const pageTitle = `${post.title} — ToolVerse`;
        const articleId = `${canonicalUrl}#article`;

        const isEditorialTeam =
          post.author.toLowerCase().includes('editorial') ||
          post.author.toLowerCase().includes('team') ||
          post.author.toLowerCase().includes('toolverse');

        const authorNode: Record<string, unknown> = isEditorialTeam
          ? {
              '@type': 'Organization',
              '@id': ORGANIZATION_ID,
              name: post.author,
              url: `${baseUrl}/legal/about`,
            }
          : {
              '@type': 'Person',
              name: post.author,
              worksFor: { '@id': ORGANIZATION_ID },
            };

        const blogPostingNode: Record<string, unknown> = {
          '@type': 'BlogPosting',
          '@id': articleId,
          headline: post.title,
          description: post.description,
          image: [ogImage],
          datePublished: post.publishDate,
          dateModified: post.publishDate,
          mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
          isPartOf: { '@id': `${canonicalUrl}#webpage` },
          publisher: { '@id': ORGANIZATION_ID },
          author: authorNode,
          inLanguage: 'en-US',
        };

        const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Guides & Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: canonicalUrl },
        ]);

        const pageNode = buildWebPageNode({
          canonicalUrl,
          name: pageTitle,
          description: post.description,
          type: 'ItemPage',
          hasBreadcrumbs: true,
          mainEntityId: articleId,
        });

        const faqNode =
          post.faqs && post.faqs.length > 0
            ? {
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                mainEntity: post.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              }
            : null;

        const graph = [
          buildOrganizationNode(),
          buildWebSiteNode(),
          pageNode,
          breadcrumbs,
          blogPostingNode,
          faqNode,
        ];

        return {
          title: pageTitle,
          description: post.description,
          keywords: post.keywords,
          canonicalUrl,
          ogType: 'article',
          ogImage,
          jsonLd: wrapInGraph(graph),
        };
      }
    }

    // Blog Index (/blog)
    const canonicalUrl = `${baseUrl}/blog`;
    const title = 'ToolVerse Blog — Practical Guides for Tools, Careers & Privacy';
    const description =
      'Practical guides on image compression, PDF privacy, barcodes, remote jobs, and Pakistan salary tax — with links to free ToolVerse utilities.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Guides & Blog', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      pageNode,
      breadcrumbs,
    ];

    return {
      title,
      description,
      keywords: ['toolverse blog', 'career guides', 'remote jobs guide', 'pdf tutorial'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 5. Job Hub Pages (/jobs/[slug])
  if (parts[0] === 'jobs' && parts[1]) {
    const job = getJobPageContent(parts[1]);
    const canonicalUrl = `${baseUrl}/jobs/${parts[1]}`;
    const formattedTitle = parts[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const pageTitle = job?.seoTitle ?? `${formattedTitle} (2026) — ToolVerse Job Finder`;
    const pageDesc =
      job?.seoDescription ??
      `Browse ${formattedTitle.toLowerCase()} listings. Filter remote, government, and tech roles and apply on the original posting sites.`;

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Job Finder', url: `${baseUrl}/tools/global-job-finder` },
      { name: job?.title ?? formattedTitle, url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: pageTitle,
      description: pageDesc,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph: (Record<string, unknown> | null)[] = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      pageNode,
      breadcrumbs,
    ];

    if (job?.faqs?.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: job.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }

    if (job?.featuredPostings?.length) {
      job.featuredPostings.forEach((posting, idx) => {
        const postingSchema = buildJobPostingJsonLd(posting, canonicalUrl);
        delete (postingSchema as Record<string, unknown>)['@context'];
        (postingSchema as Record<string, unknown>)['@id'] = `${canonicalUrl}#job-${idx + 1}`;
        graph.push(postingSchema);
      });
    }

    return {
      title: pageTitle,
      description: pageDesc,
      keywords: [parts[1].replace(/-/g, ' '), 'toolverse jobs', 'remote jobs'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 6. Legal & Policy Pages (/legal/[slug])
  if (parts[0] === 'legal' && parts[1]) {
    const slug = parts[1];
    const formattedSlug = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const pageTitle = `${formattedSlug} — ToolVerse`;
    const canonicalUrl = `${baseUrl}/legal/${slug}`;
    const pageDesc = `Official ToolVerse ${slug.replace(/-/g, ' ')}. Learn more about our privacy-first policies, security, and editorial standards.`;

    let pageType = 'WebPage';
    let mainEntityId: string | undefined = undefined;

    if (slug === 'about') {
      pageType = 'AboutPage';
      mainEntityId = ORGANIZATION_ID;
    } else if (slug === 'contact') {
      pageType = 'ContactPage';
      mainEntityId = ORGANIZATION_ID;
    }

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: formattedSlug, url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: pageTitle,
      description: pageDesc,
      type: pageType,
      hasBreadcrumbs: true,
      mainEntityId,
    });

    const graph = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      pageNode,
      breadcrumbs,
    ];

    return {
      title: pageTitle,
      description: pageDesc,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 7. Fallback / Default
  const fallbackUrl = `${baseUrl}/`;
  const fallbackTitle = 'ToolVerse — Free Online Tools';
  const fallbackDesc = 'Free, fast, privacy-first online tools for everyday work.';

  const fallbackGraph = [
    buildOrganizationNode(),
    buildWebSiteNode(),
    buildWebPageNode({
      canonicalUrl: fallbackUrl,
      name: fallbackTitle,
      description: fallbackDesc,
      type: 'WebPage',
    }),
  ];

  return {
    title: fallbackTitle,
    description: fallbackDesc,
    canonicalUrl: fallbackUrl,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: wrapInGraph(fallbackGraph),
  };
}

export function updateDOMMetadata(meta: PageMetadata) {
  if (typeof document === 'undefined') return;

  document.title = meta.title;

  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLinkTag = (relVal: string, hrefVal: string) => {
    let el = document.querySelector(`link[rel="${relVal}"]:not([hreflang])`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', relVal);
      document.head.appendChild(el);
    }
    el.setAttribute('href', hrefVal);
  };

  setMetaTag(
    'meta[name="robots"]',
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  setLinkTag('canonical', meta.canonicalUrl);

  // Remove stale hreflang (single-language site — avoid Bing conflicts)
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  if (meta.keywords?.length) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords.join(', '));
  }

  const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;

  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ToolVerse');
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
  setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

  // Replace all JSON-LD so static index.html schema does not duplicate after SPA navigation
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => script.remove());

  if (meta.jsonLd) {
    meta.jsonLd.forEach((schemaData) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-seo', 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });
  }
}
