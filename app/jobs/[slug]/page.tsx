import React from 'react';
import JobTools from '@/features/tools/JobTools';
import { AdSlot } from '@/components/AdSlot';

interface Props {
  params: {
    slug: string;
  };
}

interface JobCategoryConfig {
  title: string;
  subtitle: string;
  seoDescription: string;
  initialQuery?: string;
  initialCountry?: string;
  remoteOnly?: boolean;
}

const JOB_CATEGORIES: Record<string, JobCategoryConfig> = {
  'remote-jobs': {
    title: 'Remote Jobs Worldwide (2026)',
    subtitle: 'Find 1,000+ verified work from home vacancies in Tech, Support, Marketing, and Operations.',
    seoDescription: 'Apply online for verified remote jobs hiring worldwide. High-paying USD/EUR vacancies with flexible hours.',
    remoteOnly: true,
  },
  'usa-jobs': {
    title: 'Jobs in United States (USA)',
    subtitle: 'Browse thousands of active vacancies across major US cities & remote US-based roles.',
    seoDescription: 'Find software engineering, healthcare, finance, and marketing jobs in the USA.',
    initialCountry: 'United States',
  },
  'software-engineer-jobs': {
    title: 'Software Developer & Engineer Jobs',
    subtitle: 'Full-stack, Frontend, Backend, Mobile, and AI Engineering vacancies worldwide.',
    seoDescription: 'Search 500+ active software engineering jobs. Apply directly on official employer platforms.',
    initialQuery: 'Developer',
  },
  'data-entry-jobs': {
    title: 'Remote Data Entry & Virtual Assistant Jobs',
    subtitle: 'Entry-level work from home administrative, customer support, and data transcription jobs.',
    seoDescription: 'Apply for entry-level data entry, transcription, and virtual assistant jobs worldwide.',
    initialQuery: 'Data Entry',
  },
  'pakistan-govt-jobs': {
    title: 'Government Jobs in Pakistan (PPSC, FPSC, NTS)',
    subtitle: 'Federal and Provincial government job vacancies, BPS pay scales, and official recruitment ads.',
    seoDescription: 'Search government jobs in Pakistan (PPSC, FPSC, NTS, Federal Govt). View requirements and official links.',
    initialCountry: 'Pakistan',
  }
};

export default function JobCategoryPage({ params }: Props) {
  const config = JOB_CATEGORIES[params.slug] || {
    title: 'Global Job Search Engine',
    subtitle: 'Find 1,000+ active vacancies worldwide',
    seoDescription: 'Search 1,000+ active jobs across tech, government, banking, healthcare, and remote sectors.',
  };

  return (
    <div className="space-y-8 py-4">
      {/* Category Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-500/20 space-y-4 text-center sm:text-left">
        <span className="px-3.5 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider">
          ToolVerse Programmatic Job Portal
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          {config.title}
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
          {config.subtitle}
        </p>
      </div>

      <AdSlot placement="header" />

      {/* Interactive Job Engine Component */}
      <JobTools />

      <AdSlot placement="footer" />
    </div>
  );
}
