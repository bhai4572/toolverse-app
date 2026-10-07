import { describe, it, expect } from 'vitest';
import {
  getMetadataForPath,
  SITE_URL,
  ORGANIZATION_ID,
  WEBSITE_ID,
  mapCategoryToApplicationCategory,
} from '../lib/seo/metaEngine';
import { TOOLS, CATEGORIES } from '../lib/tools/registry';
import { BLOG_POSTS } from '../lib/blog/posts';

describe('ToolVerse Advanced Schema.org & Structured Data Architecture', () => {
  it('homepage generates unified @graph with Organization, WebSite, WebPage, and FAQPage', () => {
    const meta = getMetadataForPath('/');
    expect(meta.jsonLd).toBeDefined();
    expect(meta.jsonLd?.length).toBe(1);

    const root = meta.jsonLd![0];
    expect(root['@context']).toBe('https://schema.org');
    expect(Array.isArray(root['@graph'])).toBe(true);

    const graph = root['@graph'] as Record<string, unknown>[];
    const org = graph.find((n) => n['@type'] === 'Organization');
    const website = graph.find((n) => n['@type'] === 'WebSite');
    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    const faq = graph.find((n) => n['@type'] === 'FAQPage');

    expect(org).toBeDefined();
    expect(org!['@id']).toBe(ORGANIZATION_ID);
    expect(org!['name']).toBe('ToolVerse');
    expect(org!['url']).toBe(`${SITE_URL}/`);
    expect(org!['email']).toBe('support@toolverse.baby');

    expect(website).toBeDefined();
    expect(website!['@id']).toBe(WEBSITE_ID);
    expect(website!['publisher']).toEqual({ '@id': ORGANIZATION_ID });
    expect(website!['potentialAction']).toBeDefined();

    expect(webpage).toBeDefined();
    expect(webpage!['@id']).toBe(`${SITE_URL}/#webpage`);
    expect(webpage!['isPartOf']).toEqual({ '@id': WEBSITE_ID });
    expect(webpage!['about']).toEqual({ '@id': ORGANIZATION_ID });

    expect(faq).toBeDefined();
    expect(faq!['@id']).toBe(`${SITE_URL}/#faq`);
    expect(Array.isArray(faq!['mainEntity'])).toBe(true);
  });

  it('tool pages generate WebApplication schema with connected WebPage and Breadcrumbs', () => {
    const liveTools = TOOLS.filter((t) => t.status === 'live');
    expect(liveTools.length).toBeGreaterThan(0);

    for (const tool of liveTools.slice(0, 10)) {
      const canonical = `${SITE_URL}/tools/${tool.slug}`;
      const meta = getMetadataForPath(`/tools/${tool.slug}`);
      expect(meta.jsonLd).toBeDefined();

      const graph = (meta.jsonLd![0]['@graph'] as Record<string, unknown>[]);
      const webApp = graph.find((n) => {
        const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
        return types.includes('WebApplication');
      });
      const breadcrumb = graph.find((n) => n['@type'] === 'BreadcrumbList');
      const webpage = graph.find((n) => n['@type'] === 'ItemPage');

      expect(webApp).toBeDefined();
      expect(webApp!['@id']).toBe(`${canonical}#software`);
      expect(webApp!['name']).toBe(tool.canonicalName);
      expect(webApp!['url']).toBe(canonical);
      expect(webApp!['browserRequirements']).toBe('Requires JavaScript. Requires HTML5.');
      expect(webApp!['operatingSystem']).toBe('All (Web Browser)');
      expect(webApp!['isAccessibleForFree']).toBe(true);
      expect(webApp!['offers']).toEqual({
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });

      // Check anti-spam: No fake reviews or ratings
      expect(webApp!['aggregateRating']).toBeUndefined();
      expect(webApp!['review']).toBeUndefined();

      expect(webpage).toBeDefined();
      expect(webpage!['@id']).toBe(`${canonical}#webpage`);
      expect(webpage!['isPartOf']).toEqual({ '@id': WEBSITE_ID });
      expect(webpage!['mainEntity']).toEqual({ '@id': `${canonical}#software` });

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb!['@id']).toBe(`${canonical}#breadcrumb`);
      const listElements = breadcrumb!['itemListElement'] as { position: number; item: string }[];
      expect(listElements.length).toBe(3);
      expect(listElements[0].item).toBe(`${SITE_URL}/`);
      expect(listElements[1].item).toBe(`${SITE_URL}/category/${tool.categorySlug}`);
      expect(listElements[2].item).toBe(canonical);
    }
  });

  it('tool categories correctly map to Schema.org applicationCategory specifications', () => {
    expect(mapCategoryToApplicationCategory('pdf-document-tools')).toBe('UtilitiesApplication');
    expect(mapCategoryToApplicationCategory('image-design-tools')).toBe('DesignApplication');
    expect(mapCategoryToApplicationCategory('developer-cybersecurity-tools')).toBe('DeveloperApplication');
    expect(mapCategoryToApplicationCategory('business-finance-tools')).toBe('BusinessApplication');
    expect(mapCategoryToApplicationCategory('text-writing-student-tools')).toBe('EducationalApplication');
    expect(mapCategoryToApplicationCategory('creator-social-tools')).toBe('SocialNetworkingApplication');
  });

  it('category hubs generate CollectionPage and ItemList of tools', () => {
    for (const cat of CATEGORIES) {
      const canonical = `${SITE_URL}/category/${cat.slug}`;
      const meta = getMetadataForPath(`/category/${cat.slug}`);
      const graph = (meta.jsonLd![0]['@graph'] as Record<string, unknown>[]);

      const collection = graph.find((n) => n['@type'] === 'CollectionPage');
      const itemList = graph.find((n) => n['@type'] === 'ItemList');
      const breadcrumb = graph.find((n) => n['@type'] === 'BreadcrumbList');

      expect(collection).toBeDefined();
      expect(collection!['@id']).toBe(`${canonical}#webpage`);
      expect(collection!['mainEntity']).toEqual({ '@id': `${canonical}#itemlist` });

      expect(itemList).toBeDefined();
      expect(itemList!['@id']).toBe(`${canonical}#itemlist`);
      expect(Array.isArray(itemList!['itemListElement'])).toBe(true);

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb!['@id']).toBe(`${canonical}#breadcrumb`);
    }
  });

  it('blog posts generate BlogPosting with factual editorial attribution and no fake authors', () => {
    for (const post of BLOG_POSTS.slice(0, 10)) {
      const canonical = `${SITE_URL}/blog/${post.slug}`;
      const meta = getMetadataForPath(`/blog/${post.slug}`);
      const graph = (meta.jsonLd![0]['@graph'] as Record<string, unknown>[]);

      const article = graph.find((n) => n['@type'] === 'BlogPosting');
      const webpage = graph.find((n) => n['@type'] === 'ItemPage');
      const breadcrumb = graph.find((n) => n['@type'] === 'BreadcrumbList');

      expect(article).toBeDefined();
      expect(article!['@id']).toBe(`${canonical}#article`);
      expect(article!['headline']).toBe(post.title);
      expect(article!['publisher']).toEqual({ '@id': ORGANIZATION_ID });
      expect(article!['mainEntityOfPage']).toEqual({ '@id': `${canonical}#webpage` });

      // Editorial attribution
      const author = article!['author'] as Record<string, unknown>;
      expect(author).toBeDefined();
      if (post.author === 'ToolVerse Editorial Team') {
        expect(author['@type']).toBe('Organization');
        expect(author['@id']).toBe(ORGANIZATION_ID);
      } else {
        expect(author['worksFor']).toEqual({ '@id': ORGANIZATION_ID });
      }

      expect(webpage).toBeDefined();
      expect(breadcrumb).toBeDefined();
    }
  });

  it('job landing pages generate CollectionPage and valid JobPosting entities', () => {
    const jobSlugs = ['remote-jobs', 'usa-jobs', 'software-engineer-jobs', 'data-entry-jobs', 'pakistan-govt-jobs'];
    for (const slug of jobSlugs) {
      const canonical = `${SITE_URL}/jobs/${slug}`;
      const meta = getMetadataForPath(`/jobs/${slug}`);
      const graph = (meta.jsonLd![0]['@graph'] as Record<string, unknown>[]);

      const collection = graph.find((n) => n['@type'] === 'CollectionPage');
      const postings = graph.filter((n) => n['@type'] === 'JobPosting');

      expect(collection).toBeDefined();
      expect(postings.length).toBeGreaterThan(0);

      for (const posting of postings) {
        expect(posting['@id']).toBeDefined();
        expect(posting['title']).toBeDefined();
        expect(posting['hiringOrganization']).toBeDefined();
        expect(posting['directApply']).toBe(true);
      }
    }
  });

  it('legal and policy pages generate connected WebPage, AboutPage, or ContactPage', () => {
    const aboutMeta = getMetadataForPath('/legal/about');
    const aboutGraph = aboutMeta.jsonLd![0]['@graph'] as Record<string, unknown>[];
    const aboutPage = aboutGraph.find((n) => n['@type'] === 'AboutPage');
    expect(aboutPage).toBeDefined();
    expect(aboutPage!['mainEntity']).toEqual({ '@id': ORGANIZATION_ID });

    const contactMeta = getMetadataForPath('/legal/contact');
    const contactGraph = contactMeta.jsonLd![0]['@graph'] as Record<string, unknown>[];
    const contactPage = contactGraph.find((n) => n['@type'] === 'ContactPage');
    expect(contactPage).toBeDefined();
    expect(contactPage!['mainEntity']).toEqual({ '@id': ORGANIZATION_ID });

    const privacyMeta = getMetadataForPath('/legal/privacy-policy');
    const privacyGraph = privacyMeta.jsonLd![0]['@graph'] as Record<string, unknown>[];
    const privacyPage = privacyGraph.find((n) => n['@type'] === 'WebPage');
    expect(privacyPage).toBeDefined();
  });
});
