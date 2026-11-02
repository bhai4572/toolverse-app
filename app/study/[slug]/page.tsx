'use client';

import React from 'react';
import Link from 'next/link';
import { StudyDestinationPage, UniversityProfilePage } from '@/components/StudyDestinationPage';
import { getStudyDestination } from '@/lib/study/destinations';
import { getUniversityBySlugs } from '@/lib/study/globalUniversityEngine';

export default function StudyCountryPage({
  params,
}: {
  params: { slug: string; uniSlug?: string };
}) {
  const dest = getStudyDestination(params.slug);

  if (!dest) {
    return (
      <div className="py-12 text-center space-y-3 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Destination not found</h1>
        <p className="text-sm text-slate-500">
          Browse our complete directory of 193 countries, universities, programs, and DIY admission guides.
        </p>
        <Link href="/study" className="inline-block text-sm font-semibold text-brand-600 hover:underline">
          ← Back to Global Study Abroad Hub (193 Countries)
        </Link>
      </div>
    );
  }

  if (params.uniSlug) {
    const uni = getUniversityBySlugs(params.slug, params.uniSlug);
    if (uni) {
      return <UniversityProfilePage uni={uni} dest={dest} />;
    }
  }

  return <StudyDestinationPage dest={dest} />;
}
