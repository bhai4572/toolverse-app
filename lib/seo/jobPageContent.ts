/** Shared job landing copy for UI + meta/prerender. */

export interface JobPageContent {
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  relatedToolSlugs?: string[];
  relatedBlogSlugs?: string[];
  initialQuery?: string;
  initialCountry?: string;
  remoteOnly?: boolean;
}

export const JOB_PAGE_CONTENT: Record<string, JobPageContent> = {
  'remote-jobs': {
    title: 'Remote Jobs Worldwide (2026)',
    subtitle:
      'Browse remote and work-from-home roles across tech, support, marketing, and operations — then apply on the original employer or job board site.',
    seoTitle: 'Remote Jobs Worldwide — Work From Home Listings | ToolVerse',
    seoDescription:
      'Explore remote jobs hiring worldwide. Filter work-from-home roles and always apply on the official posting. Free ToolVerse job finder.',
    intro:
      'Remote roles can be fully distributed or “remote within one country.” Read location and timezone requirements carefully, and never pay upfront fees to “recruiters” who contact you off-platform.',
    sections: [
      {
        heading: 'How to use this job board safely',
        body: 'Open a listing, verify the company domain, and apply on the employer’s site or a known board (LinkedIn, Indeed, Greenhouse, Lever). ToolVerse helps you discover postings; we are not the employer.',
      },
      {
        heading: 'Prep your application pack',
        body: 'Keep a PDF resume and optional cover letter ready. Use ToolVerse PDF Merge if you need one file, and Compress Image to Target Size for portal photo limits.',
      },
    ],
    faqs: [
      {
        question: 'Does ToolVerse hire for these jobs?',
        answer:
          'No. Listings point to third-party sources. Apply on the original posting and verify employers independently.',
      },
      {
        question: 'Are remote jobs always worldwide?',
        answer:
          'Not always. Many “remote” roles are limited to specific countries for payroll and tax reasons.',
      },
    ],
    relatedToolSlugs: ['global-job-finder', 'pdf-merge', 'word-counter'],
    relatedBlogSlugs: ['top-high-paying-remote-jobs-worldwide'],
    remoteOnly: true,
  },
  'usa-jobs': {
    title: 'Jobs in the United States (USA)',
    subtitle:
      'Explore US-based and US-remote openings across major metros and industries, then apply on the official listing.',
    seoTitle: 'USA Jobs — United States Job Search | ToolVerse',
    seoDescription:
      'Browse jobs in the United States including remote-US roles. Verify employers and apply on the original job posting.',
    intro:
      'US listings may require work authorization. Confirm visa sponsorship language on the employer site before investing hours in an application.',
    sections: [
      {
        heading: 'City vs remote-US',
        body: 'Hybrid roles often expect commute days. Remote-US roles may still require a US address and tax ID. Filter carefully before applying.',
      },
      {
        heading: 'Application tips',
        body: 'Tailor your resume keywords to the posting. Keep files under portal size limits with ToolVerse PDF and image tools when uploads fail.',
      },
    ],
    faqs: [
      {
        question: 'Can I apply from outside the USA?',
        answer:
          'Only if the employer allows it. Many US jobs require existing authorization to work in the United States.',
      },
      {
        question: 'Are these government USAJobs.gov listings only?',
        answer:
          'No. Results can include private-sector and board listings. Always open the source link to confirm.',
      },
    ],
    relatedToolSlugs: ['global-job-finder', 'pdf-merge', 'jpg-to-pdf'],
    initialCountry: 'United States',
  },
  'software-engineer-jobs': {
    title: 'Software Developer & Engineer Jobs',
    subtitle:
      'Find full-stack, frontend, backend, mobile, and related engineering roles — then apply directly on employer career pages or known boards.',
    seoTitle: 'Software Engineer Jobs — Developer Roles | ToolVerse',
    seoDescription:
      'Search software engineering and developer jobs worldwide. Review stack requirements and apply on the official posting.',
    intro:
      'Match your stack honestly (languages, cloud, years). For take-home tests, never upload proprietary employer code to random online converters if NDAs apply — prefer local tools.',
    sections: [
      {
        heading: 'Reading the stack list',
        body: 'Prioritize required vs nice-to-have skills. A focused resume beats a keyword dump. Use Word Counter when portals enforce length limits on summaries.',
      },
      {
        heading: 'Portfolio and PDFs',
        body: 'Merge case-study PDFs with PDF Merge and keep screenshots compressed for career-page uploads.',
      },
    ],
    faqs: [
      {
        question: 'Do you submit applications for me?',
        answer:
          'No. ToolVerse helps you discover listings. You apply on the original site.',
      },
      {
        question: 'Are salary figures guaranteed?',
        answer:
          'No. Ranges on boards can be outdated. Confirm with the employer.',
      },
    ],
    relatedToolSlugs: ['global-job-finder', 'json-formatter', 'word-counter'],
    relatedBlogSlugs: ['top-high-paying-remote-jobs-worldwide'],
    initialQuery: 'Developer',
  },
  'data-entry-jobs': {
    title: 'Data Entry & Virtual Assistant Jobs',
    subtitle:
      'Explore entry-level admin, data entry, transcription, and VA-style roles. Prefer known employers and never pay for a job offer.',
    seoTitle: 'Data Entry Jobs & Virtual Assistant Roles | ToolVerse',
    seoDescription:
      'Find data entry and virtual assistant job listings. Verify employers, avoid upfront fee scams, and apply on official postings.',
    intro:
      'Entry-level remote admin roles attract scams. Legitimate employers do not ask you to buy gift cards, crypto, or “training kits” to get hired.',
    sections: [
      {
        heading: 'Red flags',
        body: 'Unsolicited chat apps, guarantee of huge pay for tiny hours, or payment to start equipment leases are common scam patterns. Walk away.',
      },
      {
        heading: 'Skills that help',
        body: 'Accurate typing, spreadsheet basics, and clear written English. Some roles require specific tools (Excel, Google Sheets, CRM).',
      },
    ],
    faqs: [
      {
        question: 'Is data entry always remote?',
        answer:
          'No. Some roles are on-site. Read the location field on the original posting.',
      },
      {
        question: 'Does ToolVerse charge applicants?',
        answer:
          'Browsing tools is free. We do not charge candidates to apply via third-party employer sites.',
      },
    ],
    relatedToolSlugs: ['global-job-finder', 'word-counter', 'text-case-converter'],
    initialQuery: 'Data Entry',
  },
  'pakistan-govt-jobs': {
    title: 'Government Jobs in Pakistan (PPSC, FPSC, NTS)',
    subtitle:
      'Discover Pakistan government and testing-body related openings. Confirm every ad on the official department or commission website before you apply.',
    seoTitle: 'Pakistan Government Jobs (PPSC, FPSC, NTS) | ToolVerse',
    seoDescription:
      'Browse Pakistan government job leads and always verify on official PPSC, FPSC, NTS, or department sites. Prep photos and PDFs with ToolVerse tools.',
    intro:
      'Fake job ads circulate on social media. Trust only official domains and newspaper/commission notices. ToolVerse is a discovery helper, not a government portal.',
    sections: [
      {
        heading: 'Documents and photo limits',
        body: 'Many forms need CNIC photos, signatures, or domicile scans under strict KB limits. Use Compress Image to Target Size and JPG/PDF tools before upload week.',
      },
      {
        heading: 'Salary tax planning',
        body: 'For rough take-home estimates after an offer, try the Pakistan Salary Tax Estimator — it is educational only, not FBR filing advice.',
      },
    ],
    faqs: [
      {
        question: 'Are these official PPSC results?',
        answer:
          'No. Always cross-check on the official commission or department website.',
      },
      {
        question: 'Can ToolVerse submit my application?',
        answer:
          'No. Submit only through the official application channel listed on the real notice.',
      },
    ],
    relatedToolSlugs: [
      'compress-image-target-size',
      'pakistan-salary-tax-estimator',
      'pdf-merge',
    ],
    relatedBlogSlugs: [
      'how-to-compress-image-to-target-size-under-50kb',
      'pakistan-salary-tax-calculator-slabs-guide',
    ],
    initialCountry: 'Pakistan',
  },
};

export function getJobPageContent(slug: string): JobPageContent | undefined {
  return JOB_PAGE_CONTENT[slug];
}
