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

// Global Travel Intelligence Platform Imports
import TravelHubPage from '../app/travel/page';
import TravelRoutePage from '../app/travel/route/page';
import PassportDashboardPage from '../app/travel/passport/page';
import EmbassyDirectoryPage from '../app/travel/embassies/page';
import DestinationsPage from '../app/travel/destinations/page';
import JobsTravelPage from '../app/travel/jobs/page';
import TravelPlannerPage from '../app/travel/planner/page';
import AdminTravelPage from '../app/admin/travel/page';

// Startup Launch, Guest Posting, SEO Tools & Dashboard Imports
import StartupsDirectoryPage from '../app/startups/page';
import StartupProfilePage from '../app/startups/[slug]/page';
import SubmitStartupPage from '../app/submit-startup/page';
import GuestPostsMarketplacePage from '../app/guest-posts/page';
import PublisherProfilePage from '../app/publishers/[slug]/page';
import CreatePitchPage from '../app/guest-posts/create-pitch/page';
import BecomeAPublisherPage from '../app/become-a-publisher/page';
import SeoToolsPage from '../app/seo-tools/page';
import SeoSuitePage from '../app/seo/page';
import SeoWorkspacePage from '../app/workspace/page';
import ToolsHubPage from '../app/tools/page';
import PricingPage from '../app/pricing/page';
import StudyAbroadPage from '../app/study/page';
import ImmigrationPage from '../app/immigration/page';
import DashboardPage from '../app/dashboard/page';
import UsHubPage from '../app/us/page';
import UkHubPage from '../app/uk/page';
import CaHubPage from '../app/ca/page';
import AuHubPage from '../app/au/page';
import PassportPhotosHubPage from '../app/passport-photos/page';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEOHead } from './components/SEOHead';
import { AdGlobals } from '../components/ads/AdGlobals';

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

  const pathNormalized = currentPath.replace(/\/$/, '') || '/';
  const isWorkspace =
    pathNormalized === '/workspace' ||
    pathNormalized.startsWith('/workspace/') ||
    pathNormalized === '/seo-dashboard' ||
    pathNormalized.startsWith('/seo-dashboard/');

  const renderContent = () => {
    const path = pathNormalized;
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
      if (parts[1] === 'travel') {
        return <AdminTravelPage />;
      }
      return <AdminPage />;
    }

    // Global Travel Intelligence Platform Routes
    if (parts[0] === 'travel') {
      if (parts[1] === 'passport') {
        return <PassportDashboardPage />;
      }
      if (parts[1] === 'embassies') {
        return <EmbassyDirectoryPage />;
      }
      if (parts[1] === 'destinations') {
        return <DestinationsPage />;
      }
      if (parts[1] === 'jobs') {
        return <JobsTravelPage />;
      }
      if (parts[1] === 'planner') {
        return <TravelPlannerPage />;
      }
      if (parts[1] && parts[2]) {
        return <TravelRoutePage nationalityCode={parts[1]} destinationCode={parts[2]} />;
      }
      return <TravelHubPage />;
    }

    // Startup Launch & Discovery Routes
    if (parts[0] === 'startups') {
      if (parts[1]) {
        return <StartupProfilePage params={{ slug: parts[1] }} />;
      }
      return <StartupsDirectoryPage />;
    }

    if (parts[0] === 'submit-startup') {
      return <SubmitStartupPage />;
    }

    // Guest Posting & Publisher Marketplace Routes
    if (parts[0] === 'guest-posts') {
      if (parts[1] === 'create-pitch') {
        return <CreatePitchPage />;
      }
      return <GuestPostsMarketplacePage />;
    }

    if (parts[0] === 'publishers' && parts[1]) {
      return <PublisherProfilePage params={{ slug: parts[1] }} />;
    }

    if (parts[0] === 'become-a-publisher') {
      return <BecomeAPublisherPage />;
    }

    if (parts[0] === 'workspace' || parts[0] === 'seo-dashboard') {
      const slug = parts.slice(1).join('/');
      return <SeoWorkspacePage slug={slug} />;
    }

    if (parts[0] === 'seo' || parts[0] === 'seo-suite') {
      return <SeoSuitePage />;
    }

    if (parts[0] === 'seo-tools') {
      return <SeoToolsPage />;
    }

    if (parts[0] === 'pricing') {
      return <PricingPage />;
    }

    if (parts[0] === 'study') {
      return <StudyAbroadPage />;
    }

    if (parts[0] === 'immigration') {
      return <ImmigrationPage />;
    }

    if (parts[0] === 'tools' && !parts[1]) {
      return <ToolsHubPage />;
    }

    if (parts[0] === 'us') {
      return <UsHubPage />;
    }
    if (parts[0] === 'uk') {
      return <UkHubPage />;
    }
    if (parts[0] === 'ca') {
      return <CaHubPage />;
    }
    if (parts[0] === 'au') {
      return <AuHubPage />;
    }
    if (parts[0] === 'passport-photos') {
      return <PassportPhotosHubPage />;
    }

    if (parts[0] === 'dashboard') {
      return <DashboardPage />;
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

  const skipAds =
    isWorkspace ||
    pathNormalized === '/admin' ||
    pathNormalized.startsWith('/admin/') ||
    pathNormalized === '/business/dashboard' ||
    pathNormalized.startsWith('/business/dashboard/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <SEOHead pathname={currentPath} />
      <Header />
      <main
        className={
          isWorkspace
            ? 'flex-1 w-full'
            : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }
      >
        {renderContent()}
      </main>
      {!isWorkspace && <Footer />}
      {/* Adsterra: social bar + mobile 320x50 — never gates tools */}
      {!skipAds && <AdGlobals />}
    </div>
  );
}

