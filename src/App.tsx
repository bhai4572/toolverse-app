import React, { useState, useEffect } from 'react';
import HomePage from '../app/page';
import ToolPage from '../app/tools/[slug]/page';
import CategoryPage from '../app/category/[slug]/page';
import LegalPage from '../app/legal/[slug]/page';
import BlogHubPage from '../app/blog/page';
import BlogPostPage from '../app/blog/[slug]/page';
import JobCategoryPage from '../app/jobs/[slug]/page';
import ProductDiscoveryHubPage from '../app/products/page';
import ProductProfilePage from '../app/products/[slug]/page';
import AlternativesHubPage from '../app/alternatives/page';
import AlternativeDetailPage from '../app/alternatives/[slug]/page';
import SideBySideComparisonPage from '../app/compare/[slug]/page';
import QuestionsHubPage from '../app/questions/page';
import QuestionDetailPage from '../app/questions/[slug]/page';
import CollectionsHubPage from '../app/collections/page';
import CollectionDetailPage from '../app/collections/[slug]/page';
import ProductSubmissionPage from '../app/submit/page';
import BadgesGeneratorPage from '../app/badges/page';
import ProductClaimPage from '../app/claim/page';

// New Global Business Identity & QR System Imports
import BusinessDirectoryPage from '../app/business/page';
import BusinessProfilePage from '../app/business/[slug]/page';
import QrResolverPage from '../app/b/[businessId]/page';
import BusinessRegisterPage from '../app/business/register/page';
import BusinessQrPage from '../app/business-qr/page';
import BusinessBiddingPage from '../app/business/bidding/page';
import BusinessDashboardPage from '../app/business/dashboard/page';
import AdminLoginPage from '../app/admin/login/page';
import AdminPage from '../app/admin/page';
import HowToHubPage from '../app/how-to/page';
import HowToArticlePage from '../app/how-to/[slug]/page';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEOHead } from './components/SEOHead';
import { AdBlockDetector } from '../components/AdBlockDetector';

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderContent = () => {
    const path = currentPath.replace(/\/$/, '') || '/';
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) {
      return <HomePage />;
    }

    // Permanent Business QR Code Resolver: /b/:businessId
    if (parts[0] === 'b' && parts[1]) {
      return <QrResolverPage params={{ businessId: parts[1] }} />;
    }

    // Business Identity & Discovery System
    if (parts[0] === 'business') {
      if (parts[1] === 'register') {
        return <BusinessRegisterPage />;
      }
      if (parts[1] === 'bidding') {
        return <BusinessBiddingPage />;
      }
      if (parts[1] === 'dashboard') {
        return <BusinessDashboardPage />;
      }
      if (parts[1]) {
        return <BusinessProfilePage params={{ slug: parts[1] }} />;
      }
      return <BusinessDirectoryPage />;
    }

    // Business QR Identity Generator Page
    if (parts[0] === 'business-qr') {
      return <BusinessQrPage />;
    }

    // Admin Control Center & Auth Routes
    if (parts[0] === 'admin') {
      if (parts[1] === 'login') {
        return <AdminLoginPage />;
      }
      return <AdminPage />;
    }

    // How-To Knowledge Base
    if (parts[0] === 'how-to') {
      if (parts[1]) {
        return <HowToArticlePage params={{ slug: parts[1] }} />;
      }
      return <HowToHubPage />;
    }

    if (parts[0] === 'products') {
      if (parts[1]) {
        return <ProductProfilePage params={{ slug: parts[1] }} />;
      }
      return <ProductDiscoveryHubPage />;
    }

    if (parts[0] === 'alternatives') {
      if (parts[1]) {
        return <AlternativeDetailPage params={{ slug: parts[1] }} />;
      }
      return <AlternativesHubPage />;
    }

    if (parts[0] === 'compare' && parts[1]) {
      return <SideBySideComparisonPage params={{ slug: parts[1] }} />;
    }

    if (parts[0] === 'questions') {
      if (parts[1]) {
        return <QuestionDetailPage params={{ slug: parts[1] }} />;
      }
      return <QuestionsHubPage />;
    }

    if (parts[0] === 'collections') {
      if (parts[1]) {
        return <CollectionDetailPage params={{ slug: parts[1] }} />;
      }
      return <CollectionsHubPage />;
    }

    if (parts[0] === 'submit') {
      return <ProductSubmissionPage />;
    }

    if (parts[0] === 'badges') {
      return <BadgesGeneratorPage />;
    }

    if (parts[0] === 'claim') {
      return <ProductClaimPage />;
    }

    if (parts[0] === 'tools' && parts[1]) {
      return <ToolPage params={{ slug: parts[1] }} />;
    }

    if (parts[0] === 'category' && parts[1]) {
      return <CategoryPage params={{ slug: parts[1] }} />;
    }

    if (parts[0] === 'legal' && parts[1]) {
      return <LegalPage params={{ slug: parts[1] }} />;
    }

    if (parts[0] === 'blog') {
      if (parts[1]) {
        return <BlogPostPage params={{ slug: parts[1] }} />;
      }
      return <BlogHubPage />;
    }

    if (parts[0] === 'jobs' && parts[1]) {
      return <JobCategoryPage params={{ slug: parts[1] }} />;
    }

    // Default fallback to home
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AdBlockDetector />
      <SEOHead pathname={currentPath} />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

