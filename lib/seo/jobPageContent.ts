/** Shared job landing copy for UI + meta/prerender. */

export interface JobPostingSchema {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
  hiringOrganization: {
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocationType?: 'TELECOMMUTE';
  applicantLocationRequirements?: string;
  jobLocation?: {
    locality: string;
    region?: string;
    country: string;
  };
  salary?: {
    currency: string;
    value: number;
    unitText: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
  applicationUrl?: string;
}

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
  featuredPostings?: JobPostingSchema[];
}

export function buildJobPostingJsonLd(posting: JobPostingSchema, pageUrl: string): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: posting.title,
    description: posting.description,
    datePosted: posting.datePosted,
    validThrough: posting.validThrough,
    employmentType: posting.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: posting.hiringOrganization.name,
      sameAs: posting.hiringOrganization.sameAs || pageUrl,
      logo: posting.hiringOrganization.logo || 'https://toolverse.baby/favicon.svg',
    },
    directApply: true,
  };

  if (posting.jobLocationType === 'TELECOMMUTE') {
    schema.jobLocationType = 'TELECOMMUTE';
    if (posting.applicantLocationRequirements) {
      schema.applicantLocationRequirements = {
        '@type': 'Country',
        name: posting.applicantLocationRequirements,
      };
    }
  }

  if (posting.jobLocation) {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: posting.jobLocation.locality,
        ...(posting.jobLocation.region ? { addressRegion: posting.jobLocation.region } : {}),
        addressCountry: posting.jobLocation.country,
      },
    };
  }

  if (posting.salary) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: posting.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        value: posting.salary.value,
        unitText: posting.salary.unitText,
      },
    };
  }

  return schema;
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
    featuredPostings: [
      {
        title: 'Senior Full Stack Software Engineer (Remote Worldwide)',
        description:
          'Global technology team seeking an experienced Full Stack Engineer. Responsibilities include building scalable web applications with TypeScript, React, and Node.js, designing cloud APIs, and collaborating with distributed teams.',
        datePosted: '2026-10-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Distributed Cloud Technologies',
          sameAs: 'https://toolverse.baby/jobs/remote-jobs',
        },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: 'Worldwide',
        salary: {
          currency: 'USD',
          value: 125000,
          unitText: 'YEAR',
        },
      },
      {
        title: 'Customer Success & Tech Support Specialist (Remote)',
        description:
          'Fast-growing SaaS company hiring remote customer support specialists. Responsibilities include troubleshooting user questions, guiding software onboarding, and documenting technical workflows across time zones.',
        datePosted: '2026-10-02',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Global Enterprise Support',
          sameAs: 'https://toolverse.baby/jobs/remote-jobs',
        },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: 'Worldwide',
        salary: {
          currency: 'USD',
          value: 62000,
          unitText: 'YEAR',
        },
      },
    ],
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
    relatedBlogSlugs: [
      'top-high-paying-remote-jobs-worldwide',
      'how-to-merge-pdf-files-privately-without-uploading',
    ],
    initialCountry: 'United States',
    featuredPostings: [
      {
        title: 'Cybersecurity Analyst & Systems Administrator (GS-12)',
        description:
          'Enterprise information security analyst position. Duties include network intrusion monitoring, vulnerability remediation, firewall rule auditing, and Federal cyber compliance documentation.',
        datePosted: '2026-10-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Federal Systems & Technology Group',
          sameAs: 'https://toolverse.baby/jobs/usa-jobs',
        },
        jobLocation: {
          locality: 'Washington',
          region: 'DC',
          country: 'US',
        },
        salary: {
          currency: 'USD',
          value: 115000,
          unitText: 'YEAR',
        },
      },
      {
        title: 'Cloud DevOps Infrastructure Engineer (US Remote)',
        description:
          'US-based cloud infrastructure engineer. Responsible for Kubernetes cluster administration, AWS Terraform pipeline automation, and zero-downtime microservice deployments.',
        datePosted: '2026-10-03',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Apex US Cloud Systems',
          sameAs: 'https://toolverse.baby/jobs/usa-jobs',
        },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: 'United States',
        salary: {
          currency: 'USD',
          value: 140000,
          unitText: 'YEAR',
        },
      },
    ],
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
    featuredPostings: [
      {
        title: 'Lead Frontend Engineer (React, Next.js & TypeScript)',
        description:
          'High-performance product team seeking a Frontend Lead to architect web applications, optimize Web Vitals, and build interactive UI component systems.',
        datePosted: '2026-10-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Modern Web Engineering Corp',
          sameAs: 'https://toolverse.baby/jobs/software-engineer-jobs',
        },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: 'Worldwide',
        salary: {
          currency: 'USD',
          value: 130000,
          unitText: 'YEAR',
        },
      },
      {
        title: 'Backend Systems Architect (Go, Node.js & PostgreSQL)',
        description:
          'Design and maintain low-latency REST and gRPC microservices, implement database indexing strategies, and ensure 99.99% uptime for global transactional platforms.',
        datePosted: '2026-10-02',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Core Backend Technologies',
          sameAs: 'https://toolverse.baby/jobs/software-engineer-jobs',
        },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: 'Worldwide',
        salary: {
          currency: 'USD',
          value: 145000,
          unitText: 'YEAR',
        },
      },
    ],
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
    relatedBlogSlugs: [
      'top-high-paying-remote-jobs-worldwide',
      'how-to-compress-image-to-target-size-under-50kb',
    ],
    initialQuery: 'Data Entry',
    featuredPostings: [
      {
        title: 'Remote Data Entry Specialist & Records Coordinator',
        description:
          'Accurate data entry professional to manage spreadsheet records, customer profile updates, database indexing, and clerical verification. High typing speed and attention to detail required.',
        datePosted: '2026-10-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Global Operations Admin Group',
          sameAs: 'https://toolverse.baby/jobs/data-entry-jobs',
        },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: 'Worldwide',
        salary: {
          currency: 'USD',
          value: 45000,
          unitText: 'YEAR',
        },
      },
    ],
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
    featuredPostings: [
      {
        title: 'Assistant Director / Computer Specialist (BPS-17)',
        description:
          'Punjab Public Service Commission (PPSC) recruitment for BPS-17 officer. Duties include government departmental IT systems administration, database security, and civil digitization projects.',
        datePosted: '2026-10-01',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'Punjab Public Service Commission (PPSC)',
          sameAs: 'https://www.ppsc.gop.pk/',
        },
        jobLocation: {
          locality: 'Lahore',
          region: 'Punjab',
          country: 'PK',
        },
        salary: {
          currency: 'PKR',
          value: 120000,
          unitText: 'MONTH',
        },
      },
      {
        title: 'Secondary School Teacher (SST Science & Math BPS-16)',
        description:
          'School Education Department recruitment via testing commission. Candidates will deliver high-school curriculum, supervise lab practicals, and manage student assessments.',
        datePosted: '2026-10-02',
        validThrough: '2026-12-31',
        employmentType: 'FULL_TIME',
        hiringOrganization: {
          name: 'School Education Department Pakistan',
          sameAs: 'https://toolverse.baby/jobs/pakistan-govt-jobs',
        },
        jobLocation: {
          locality: 'Islamabad',
          region: 'Federal',
          country: 'PK',
        },
        salary: {
          currency: 'PKR',
          value: 85000,
          unitText: 'MONTH',
        },
      },
    ],
  },
};

export function getJobPageContent(slug: string): JobPageContent | undefined {
  return JOB_PAGE_CONTENT[slug];
}
