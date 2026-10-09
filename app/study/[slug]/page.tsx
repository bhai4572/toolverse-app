'use client';

import React from 'react';
import Link from 'next/link';
import { StudyDestinationPage } from '@/components/StudyDestinationPage';
import { getStudyDestination } from '@/lib/study/destinations';

export default function StudyCountryPage({ params }: { params: { slug: string } }) {
  const dest = getStudyDestination(params.slug);

  if (!dest) {
    return (
      <div className="py-12 text-center space-y-3 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Destination not found</h1>
        <p className="text-sm text-slate-500">
          We publish guides for USA, UK, Canada, Australia, New Zealand, and Europe.
        </p>
        <Link href="/study" className="inline-block text-sm font-semibold text-brand-600 hover:underline">
          ← Back to Study Abroad
        </Link>
      </div>
    );
  }

  return <StudyDestinationPage dest={dest} />;
}
