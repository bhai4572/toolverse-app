/**
 * Toolverse Free SEO Toolkit Generators Engine
 */

export interface MetaTitleResult {
  title: string;
  characterCount: number;
  pixelEstimateWidth: number;
  status: 'OPTIMAL' | 'TOO_SHORT' | 'TOO_LONG';
  suggestions: string[];
}

export interface MetaDescriptionResult {
  description: string;
  characterCount: number;
  status: 'OPTIMAL' | 'TOO_SHORT' | 'TOO_LONG';
  suggestions: string[];
}

export function generateMetaTitle(topicOrKeyword: string, brandName: string = 'ToolVerse'): MetaTitleResult {
  const kw = topicOrKeyword.trim();
  if (!kw) {
    return {
      title: `Free Online Tools & Software Directory — ${brandName}`,
      characterCount: 48,
      pixelEstimateWidth: 420,
      status: 'OPTIMAL',
      suggestions: ['Enter a target keyword to generate tailored title tags.']
    };
  }

  const generated = `${kw.charAt(0).toUpperCase() + kw.slice(1)} (2026) — Guide | ${brandName}`;
  const count = generated.length;
  const pixelWidth = count * 9.5;

  let status: 'OPTIMAL' | 'TOO_SHORT' | 'TOO_LONG' = 'OPTIMAL';
  const suggestions: string[] = [];

  if (count < 30) {
    status = 'TOO_SHORT';
    suggestions.push('Add modifier words like "Best", "Free", "2026", or "Guide" to increase CTR.');
  } else if (count > 65) {
    status = 'TOO_LONG';
    suggestions.push('Title exceeds 65 characters. Search engines may truncate it in SERP snippets.');
  } else {
    suggestions.push('Perfect title length! Fits desktop and mobile Google SERP snippets.');
  }

  return {
    title: generated,
    characterCount: count,
    pixelEstimateWidth: Math.round(pixelWidth),
    status,
    suggestions
  };
}

export function generateMetaDescription(topicOrKeyword: string, valueProp: string = 'Discover privacy-first free online tools, SaaS software, and ethical growth resources.'): MetaDescriptionResult {
  const kw = topicOrKeyword.trim();
  const desc = kw 
    ? `Explore top ${kw} for startup founders, developers, and growth teams. ${valueProp} Fast, free, and privacy-focused.`
    : `${valueProp} Compare features, pricing, alternatives, and launch your startup today.`;

  const count = desc.length;
  let status: 'OPTIMAL' | 'TOO_SHORT' | 'TOO_LONG' = 'OPTIMAL';
  const suggestions: string[] = [];

  if (count < 100) {
    status = 'TOO_SHORT';
    suggestions.push('Consider expanding the description to 140-155 characters for maximum SERP real estate.');
  } else if (count > 165) {
    status = 'TOO_LONG';
    suggestions.push('Exceeds 165 characters. Mobile Google search results will truncate the ending.');
  } else {
    suggestions.push('Optimal description length! Effective for desktop & mobile snippet previews.');
  }

  return {
    description: desc,
    characterCount: count,
    status,
    suggestions
  };
}

export function generateRobotsTxt(allowCrawl: boolean = true, sitemapUrl: string = 'https://toolverse.baby/sitemap.xml'): string {
  if (!allowCrawl) {
    return `# Robots.txt - Toolverse Generated
User-agent: *
Disallow: /
`;
  }

  return `# Robots.txt - Toolverse Generated
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/private/

Sitemap: ${sitemapUrl}
`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateFaqSchemaJsonLd(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };
}

export function generateGuestPostPitchTemplate(targetPublisher: string, topic: string, founderName: string, companyName: string): string {
  return `Subject: Guest Article Idea for ${targetPublisher}: ${topic}

Hi ${targetPublisher} Editorial Team,

I've been following your recent publications on ${targetPublisher} and loved your insights on software growth and engineering.

I'd like to contribute an original, in-depth article titled:
"${topic}"

Key takeaways I will cover for your readers:
1. Practical steps to implement without fluff
2. Real-world code/data metrics from our experience at ${companyName}
3. Actionable checklist for your audience

You can check some of my previous writing here:
- Previous article/case study sample

Let me know if this topic resonates with your editorial calendar!

Best regards,
${founderName}
${companyName}`;
}
