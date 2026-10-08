import React, { useEffect } from 'react';
import { getBusinessBySlugOrId, recordQRScan } from '@/lib/business/storageEngine';

interface QRResolverPageProps {
  params: { businessId: string };
}

export default function PermanentQRResolverPage({ params }: QRResolverPageProps) {
  const business = getBusinessBySlugOrId(params.businessId);

  useEffect(() => {
    if (business) {
      recordQRScan(business.id);
      // Redirect to canonical profile URL
      if (typeof window !== 'undefined') {
        window.location.replace(`/business/${business.slug}`);
      }
    }
  }, [business]);

  if (!business) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">QR Code Not Found</h1>
        <p className="text-slate-500 text-sm">This Toolverse Business ID ({params.businessId}) is not registered or has been moved.</p>
        <a href="/business" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Explore Business Directory
        </a>
      </div>
    );
  }

  return (
    <div className="p-12 text-center space-y-3 max-w-md mx-auto">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
        Resolving permanent digital identity for <strong>{business.name}</strong>...
      </p>
    </div>
  );
}
