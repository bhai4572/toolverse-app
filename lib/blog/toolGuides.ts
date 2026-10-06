/**
 * Scalable per-tool how-to guides generated from the live registry + TOOL_PAGE_CONTENT.
 * Tools that already have a hand-written pillar guide are mapped (not duplicated) to avoid cannibalization.
 */
import type { BlogPost } from './types';
import {
  getLiveTools,
  getToolById,
  getToolBySlug,
  type ToolDefinition,
} from '@/lib/tools/registry';
import { getToolPageContent } from '@/lib/seo/toolPageContent';

/** Hand-written pillar posts that already cover these tools — do not generate a second near-duplicate. */
export const PILLAR_GUIDE_BY_TOOL: Record<string, string> = {
  'compress-image-target-size': 'how-to-compress-image-to-target-size-under-50kb',
  'pdf-merge': 'how-to-merge-pdf-files-privately-without-uploading',
  'heic-to-jpg': 'convert-heic-to-jpg-windows-iphone',
  'barcode-generator': 'how-to-generate-barcodes-free-code-128-ean-upc',
  'pakistan-salary-tax-estimator': 'pakistan-salary-tax-calculator-slabs-guide',
  'utm-builder': 'how-to-build-utm-campaign-urls',
  'global-job-finder': 'top-high-paying-remote-jobs-worldwide',
};

const CATEGORY_IMAGES: Record<string, string> = {
  'pdf-document-tools':
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
  'image-design-tools':
    'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=1200&q=80',
  'social-image-presets':
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
  'text-writing-student-tools':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'calculators-converters':
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  'business-finance-tools':
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'creator-social-tools':
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80',
  'seo-url-tools':
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
  'developer-cybersecurity-tools':
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'file-archive-utilities':
    'https://images.unsplash.com/photo-1544396821-4dd40101eef6?auto=format&fit=crop&w=1200&q=80',
  'country-regional-tools':
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
  'writing-grammar-academic-integrity-tools':
    'https://images.unsplash.com/photo-1456513080080-2a034d687c49?auto=format&fit=crop&w=1200&q=80',
  'career-jobs-employment-engine':
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
};

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function getGeneratedGuideSlug(toolSlug: string): string {
  return `how-to-${toolSlug}`;
}

/** Canonical guide slug for a tool (pillar override or generated how-to). */
export function getGuideSlugForTool(toolSlug: string): string {
  return PILLAR_GUIDE_BY_TOOL[toolSlug] ?? getGeneratedGuideSlug(toolSlug);
}

export function toolHasPillarGuide(toolSlug: string): boolean {
  return Boolean(PILLAR_GUIDE_BY_TOOL[toolSlug]);
}

function mapBlogCategory(categorySlug: string): BlogPost['category'] {
  switch (categorySlug) {
    case 'pdf-document-tools':
    case 'image-design-tools':
    case 'social-image-presets':
      return 'Image & PDF Tools';
    case 'developer-cybersecurity-tools':
    case 'seo-url-tools':
    case 'file-archive-utilities':
      return 'Developers & SEO';
    case 'calculators-converters':
    case 'business-finance-tools':
    case 'country-regional-tools':
      return 'Finance & Calculators';
    case 'career-jobs-employment-engine':
      return 'Career & Jobs';
    case 'creator-social-tools':
      return 'Creator & Social';
    case 'text-writing-student-tools':
    case 'writing-grammar-academic-integrity-tools':
      return 'Writing & Students';
    default:
      return 'Developers & SEO';
  }
}

function buildTitle(tool: ToolDefinition): string {
  const name = tool.canonicalName;
  const variant = hashSlug(tool.slug) % 4;
  switch (variant) {
    case 0:
      return `How to Use ${name}: Step-by-Step Guide`;
    case 1:
      return `${name} Guide: When to Use It and How`;
    case 2:
      return `Practical Guide to ${name} (Steps, Tips & Mistakes)`;
    default:
      return `Using ${name} the Right Way: Checklist & Workflow`;
  }
}

function buildDescription(tool: ToolDefinition): string {
  const privacyHint =
    tool.processingMode === 'client'
      ? ' Works in your browser for privacy-sensitive workflows.'
      : '';
  return `Learn when to use ${tool.canonicalName}, follow clear steps, avoid common mistakes, and open the free ToolVerse utility when you are ready.${privacyHint}`.slice(
    0,
    160
  );
}

function whenNotToUse(tool: ToolDefinition): string {
  const name = tool.canonicalName;
  if (tool.categorySlug.includes('writing') || tool.categorySlug.includes('text')) {
    return `${name} is a drafting aid, not a substitute for your judgment, institutional rules, or subject-matter accuracy. Do not treat checker output as proof of originality or a grade guarantee.`;
  }
  if (tool.categorySlug.includes('country') || tool.slug.includes('tax') || tool.slug.includes('zakat')) {
    return `${name} provides educational estimates for planning. It is not an official filing portal, tax advice, or a substitute for an accountant or regulator guidance.`;
  }
  if (tool.categorySlug.includes('career') || tool.slug.includes('job')) {
    return `Use ${name} to discover leads, then verify employers and apply on the original posting. ToolVerse is not the employer and never asks for upfront “recruiting fees.”`;
  }
  if (tool.processingMode === 'client' && (tool.categorySlug.includes('pdf') || tool.categorySlug.includes('image'))) {
    return `Skip browser-only tools when you need heavy OCR, collaborative cloud editing, or batch jobs that exceed what a phone browser can handle comfortably. Match the tool to file sensitivity and size.`;
  }
  if (tool.limitations.length) {
    return `Skip ${name} when your workflow needs features outside its scope — especially: ${tool.limitations[0]} Prefer a specialist product for those edge cases.`;
  }
  return `Skip ${name} when you need team collaboration, server-side automation, or features it does not advertise. Keep the job simple and local when privacy or speed matters most.`;
}

function privacyOrSafetyTip(tool: ToolDefinition): string {
  if (tool.processingMode === 'client') {
    return `${tool.privacyMessage} For sensitive files (IDs, contracts, unpublished drafts), confirm in DevTools → Network that your document is not uploaded as a multipart request.`;
  }
  if (tool.categorySlug.includes('career')) {
    return `Never share passwords, OTPs, or payment for “guaranteed jobs.” Open listings on the source site and verify company domains before you apply.`;
  }
  return tool.privacyMessage;
}

function commonMistakes(tool: ToolDefinition): string[] {
  const mistakes: string[] = [];
  if (tool.limitations[0]) {
    mistakes.push(`Ignoring known limits: ${tool.limitations[0]}`);
  }
  if (tool.categorySlug.includes('image') || tool.categorySlug.includes('pdf')) {
    mistakes.push('Uploading the only copy of a file without keeping the original backup.');
    mistakes.push('Skipping a quick preview of the download before submitting to a portal.');
  } else if (tool.categorySlug.includes('writing') || tool.categorySlug.includes('text')) {
    mistakes.push('Accepting every suggestion without reading the surrounding sentence.');
    mistakes.push('Pasting confidential client or exam text into tools you have not vetted for privacy.');
  } else if (tool.categorySlug.includes('calculators') || tool.categorySlug.includes('business') || tool.categorySlug.includes('country')) {
    mistakes.push('Treating an estimate as a final official figure without checking source assumptions.');
    mistakes.push('Mixing monthly and annual inputs (or tax years) and trusting the first output.');
  } else if (tool.categorySlug.includes('developer') || tool.categorySlug.includes('seo')) {
    mistakes.push('Pasting production secrets or live tokens into a page you have not verified runs locally.');
    mistakes.push('Copying generated values into production without a second local check.');
  } else {
    mistakes.push(`Skipping the on-page instructions for ${tool.canonicalName} and guessing the workflow.`);
    mistakes.push('Not opening related tools when the job clearly needs a second step (e.g. compress then merge).');
  }
  return mistakes.slice(0, 3);
}

function relatedToolLinks(tool: ToolDefinition): { name: string; slug: string }[] {
  const links: { name: string; slug: string }[] = [];
  for (const id of tool.relatedToolIds || []) {
    const rel = getToolById(id);
    if (rel && rel.status === 'live' && rel.slug !== tool.slug) {
      links.push({ name: rel.canonicalName, slug: rel.slug });
    }
    if (links.length >= 3) break;
  }
  return links;
}

function buildFaqs(tool: ToolDefinition): BlogPost['faqs'] {
  const seo = getToolPageContent(tool.slug);
  if (seo?.faqs?.length) {
    return seo.faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    }));
  }
  return [
    {
      question: `How do I start with ${tool.canonicalName}?`,
      answer: `Open the free tool, follow the on-page steps (${tool.instructions[0] || 'enter your inputs'}), then download or copy the result. No account is required for core use.`,
    },
    {
      question: `Is ${tool.canonicalName} free?`,
      answer: `Yes. ${tool.canonicalName} on ToolVerse is free to use for everyday workflows without a signup wall for core features.`,
    },
    {
      question: `Where does my data go?`,
      answer: tool.privacyMessage,
    },
  ];
}

function expandSeoSections(tool: ToolDefinition): string {
  const seo = getToolPageContent(tool.slug);
  if (!seo?.sections?.length) return '';
  return seo.sections
    .map((section) => {
      // Rephrase heading so the guide is not a copy of the tool-page SEO block
      const heading = section.heading.replace(/^(Why|How|What|When)\b/i, (m) => m);
      const guideHeading =
        hashSlug(tool.slug + section.heading) % 2 === 0
          ? `Context: ${heading}`
          : `Deeper look — ${heading}`;
      return `## ${guideHeading}\n\n${section.body}\n`;
    })
    .join('\n');
}

function buildContent(tool: ToolDefinition): string {
  const name = tool.canonicalName;
  const seo = getToolPageContent(tool.slug);
  const intro =
    seo?.answerFirst ||
    `${name} helps you ${tool.shortDescription.replace(/\.$/, '').toLowerCase()}. This guide focuses on when to use it, how to run the workflow, and mistakes to avoid — then links you to the live tool.`;

  const steps = tool.instructions
    .map((step, i) => `${i + 1}. ${step}`)
    .join('\n');

  const useCases = tool.useCases.map((u) => `- ${u}`).join('\n');
  const mistakes = commonMistakes(tool)
    .map((m) => `- ${m}`)
    .join('\n');
  const related = relatedToolLinks(tool);
  const relatedMd = related
    .map((r) => `- [${r.name}](/tools/${r.slug})`)
    .join('\n');
  const relatedGuides = related
    .slice(0, 3)
    .map((r) => `- [${r.name} guide](/blog/${getGuideSlugForTool(r.slug)})`)
    .join('\n');

  const longBits = tool.longDescription ? `\n\n${tool.longDescription}\n` : '\n';

  return `
# ${buildTitle(tool)}

${intro}
${longBits}
Open the free utility anytime: [${name}](/tools/${tool.slug}).

---

## When this guide helps

Use this walkthrough when you need a clear checklist for ${name}, want to understand limits before you start, or are choosing between related ToolVerse utilities in [${tool.category}](/category/${tool.categorySlug}).

---

## When not to use ${name}

${whenNotToUse(tool)}

---

## How to use ${name} (step-by-step)

${steps}

After you finish, keep a copy of the output and the original input until you confirm the downstream form, client, or portal accepted the result.

---

## Common use cases

${useCases}

---

## Privacy & safety tip

${privacyOrSafetyTip(tool)}

---

## Common mistakes to avoid

${mistakes}

${expandSeoSections(tool)}
---

## Open the tool

Ready to run the workflow? Launch **[${name}](/tools/${tool.slug})** — free, no signup for core use.

Browse more in [${tool.category}](/category/${tool.categorySlug}).

---

## Related tools

${relatedMd || `- Explore the [${tool.category}](/category/${tool.categorySlug}) hub for sibling utilities.`}

## Related guides

${relatedGuides || `- [Privacy-first tools shortlist](/blog/best-free-privacy-first-online-tools-2026)`}
`.trim();
}

function estimateReadMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).length;
  return Math.max(4, Math.min(12, Math.round(words / 180)));
}

export function buildToolGuidePost(tool: ToolDefinition): BlogPost {
  const contentMarkdown = buildContent(tool);
  const keywords = [
    `how to use ${tool.canonicalName.toLowerCase()}`,
    ...tool.keywords.slice(0, 3),
    'toolverse guide',
  ];

  return {
    slug: getGeneratedGuideSlug(tool.slug),
    title: buildTitle(tool),
    description: buildDescription(tool),
    category: mapBlogCategory(tool.categorySlug),
    author: 'ToolVerse Editorial Team',
    publishDate: '2026-10-07',
    readTimeMinutes: estimateReadMinutes(contentMarkdown),
    featuredImage: CATEGORY_IMAGES[tool.categorySlug] || CATEGORY_IMAGES['developer-cybersecurity-tools'],
    keywords,
    relatedToolSlug: tool.slug,
    isToolGuide: true,
    faqs: buildFaqs(tool),
    contentMarkdown: `\n${contentMarkdown}\n    `,
  };
}

/** One guide post per live tool that does not already have a pillar article. */
export function generateToolGuidePosts(): BlogPost[] {
  return getLiveTools()
    .filter((tool) => !toolHasPillarGuide(tool.slug))
    .map((tool) => buildToolGuidePost(tool));
}

export function getToolSlugFromGuideSlug(guideSlug: string): string | undefined {
  const pillarHit = Object.entries(PILLAR_GUIDE_BY_TOOL).find(([, s]) => s === guideSlug);
  if (pillarHit) return pillarHit[0];
  if (guideSlug.startsWith('how-to-')) {
    const toolSlug = guideSlug.slice('how-to-'.length);
    return getToolBySlug(toolSlug) ? toolSlug : undefined;
  }
  return undefined;
}
