import React, { useState, useEffect, lazy, Suspense } from 'react';
import HomePage from '../app/page';
import ToolPage from '../app/tools/[slug]/page';
import CategoryPage from '../app/category/[slug]/page';
import LegalPage from '../app/legal/[slug]/page';
const BlogHubPage = lazy(() => import('../app/blog/page'));
const BlogPostPage = lazy(() => import('../app/blog/[slug]/page'));
const BlogTopicsPage = lazy(() => import('../app/blog/topics/page'));
const JobCategoryPage = lazy(() => import('../app/jobs/[slug]/page'));
const ProductDiscoveryHubPage = lazy(() => import('../app/products/page'));
const ProductProfilePage = lazy(() => import('../app/products/[slug]/page'));
const AlternativesHubPage = lazy(() => import('../app/alternatives/page'));
const AlternativeDetailPage = lazy(() => import('../app/alternatives/[slug]/page'));
const SideBySideComparisonPage = lazy(() => import('../app/compare/[slug]/page'));
const QuestionsHubPage = lazy(() => import('../app/questions/page'));
const QuestionDetailPage = lazy(() => import('../app/questions/[slug]/page'));
const CollectionsHubPage = lazy(() => import('../app/collections/page'));
const CollectionDetailPage = lazy(() => import('../app/collections/[slug]/page'));
const ProductSubmissionPage = lazy(() => import('../app/submit/page'));
const LeaderboardPage = lazy(() => import('../app/leaderboard/page'));
const BadgesGeneratorPage = lazy(() => import('../app/badges/page'));
const ProductClaimPage = lazy(() => import('../app/claim/page'));


// New Global Business Identity & QR System Imports
const BusinessDirectoryPage = lazy(() => import('../app/business/page'));
const BusinessProfilePage = lazy(() => import('../app/business/[slug]/page'));
const QrResolverPage = lazy(() => import('../app/b/[businessId]/page'));
const BusinessRegisterPage = lazy(() => import('../app/business/register/page'));
const BusinessQrPage = lazy(() => import('../app/business-qr/page'));
const BusinessBiddingPage = lazy(() => import('../app/business/bidding/page'));
const BusinessDashboardPage = lazy(() => import('../app/business/dashboard/page'));
const AdminLoginPage = lazy(() => import('../app/admin/login/page'));
const AdminPage = lazy(() => import('../app/admin/page'));
const HowToHubPage = lazy(() => import('../app/how-to/page'));
const HowToArticlePage = lazy(() => import('../app/how-to/[slug]/page'));

// Global Travel Intelligence Platform Imports
const TravelHubPage = lazy(() => import('../app/travel/page'));
const TravelRoutePage = lazy(() => import('../app/travel/route/page'));
const PassportDashboardPage = lazy(() => import('../app/travel/passport/page'));
const EmbassyDirectoryPage = lazy(() => import('../app/travel/embassies/page'));
const DestinationsPage = lazy(() => import('../app/travel/destinations/page'));
const JobsTravelPage = lazy(() => import('../app/travel/jobs/page'));
const TravelPlannerPage = lazy(() => import('../app/travel/planner/page'));
const AdminTravelPage = lazy(() => import('../app/admin/travel/page'));

// Startup Launch, Guest Posting, SEO Tools & Dashboard Imports
const StartupsDirectoryPage = lazy(() => import('../app/startups/page'));
const StartupProfilePage = lazy(() => import('../app/startups/[slug]/page'));
const SubmitStartupPage = lazy(() => import('../app/submit-startup/page'));
const GuestPostsMarketplacePage = lazy(() => import('../app/guest-posts/page'));
const PublisherProfilePage = lazy(() => import('../app/publishers/[slug]/page'));
const CreatePitchPage = lazy(() => import('../app/guest-posts/create-pitch/page'));
const BecomeAPublisherPage = lazy(() => import('../app/become-a-publisher/page'));
const SeoToolsPage = lazy(() => import('../app/seo-tools/page'));
const SeoSuitePage = lazy(() => import('../app/seo/page'));
const SeoWorkspacePage = lazy(() => import('../app/workspace/page'));
const ToolsHubPage = lazy(() => import('../app/tools/page'));
const PricingPage = lazy(() => import('../app/pricing/page'));
const StudyAbroadPage = lazy(() => import('../app/study/page'));
const StudyCountryPage = lazy(() => import('../app/study/[slug]/page'));
const ImmigrationPage = lazy(() => import('../app/immigration/page'));
const CarsHubPage = lazy(() => import('../app/cars/page'));
const DashboardPage = lazy(() => import('../app/dashboard/page'));
const UsHubPage = lazy(() => import('../app/us/page'));
const UkHubPage = lazy(() => import('../app/uk/page'));
const CaHubPage = lazy(() => import('../app/ca/page'));
const AuHubPage = lazy(() => import('../app/au/page'));
const PassportPhotosHubPage = lazy(() => import('../app/passport-photos/page'));
const NewsHubPage = lazy(() => import('../app/news/page'));
const HtmlSitemapPage = lazy(() => import('../app/sitemap/page'));
const CvMakerPage = lazy(() => import('../app/cv-maker/page'));
const PaymentDirectoryPage = lazy(() => import('../app/payment-methods/page'));
const CountryPaymentPage = lazy(() => import('../app/payment-methods/countries/[slug]/page'));
const PaymentDetailPage = lazy(() => import('../app/payment-methods/[category]/[slug]/page'));
const MobilePhonesDirectoryPage = lazy(() => import('../app/phones/page'));
const PhoneDetailPage = lazy(() => import('../app/phones/[slug]/page'));
import NotFoundPage from '../app/not-found';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEOHead } from './components/SEOHead';
import { AdGlobals } from '../components/ads/AdGlobals';
import { HeaderAdBar } from '../components/ads/HeaderAdBar';
import { shouldSkipAds } from '../components/ads/adConfig';

/**
 * Route-level code splitting: rarely visited sections load on demand. While a lazy route's
 * chunk downloads on first paint, we keep showing the crawler-visible prerendered HTML that
 * scripts/prerender.mjs wrote into <main>, so there is no blank flash or layout shift.
 */
const INITIAL_PATH = typeof window !== 'undefined' ? window.location.pathname : '/';
const PRERENDERED_MAIN_HTML =
  typeof document !== 'undefined'
    ? document.querySelector('#root main')?.innerHTML ?? ''
    : '';

function RouteFallback({ path }: { path: string }) {
  if (path === INITIAL_PATH && PRERENDERED_MAIN_HTML) {
    return <div dangerouslySetInnerHTML={{ __html: PRERENDERED_MAIN_HTML }} />;
  }
  return (
    <div role="status" className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
      Loading…
    </div>
  );
}

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

  /** Unknown routes render NotFound (not homepage) to avoid soft-404 SEO damage. */
  let isNotFound = false;

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
      if (parts[1]) {
        return <StudyCountryPage params={{ slug: parts[1], uniSlug: parts[2] }} />;
      }
      return <StudyAbroadPage />;
    }

    if (parts[0] === 'immigration') {
      return <ImmigrationPage />;
    }

    if (parts[0] === 'cars') {
      return <CarsHubPage />;
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

    if (parts[0] === 'news') {
      return <NewsHubPage />;
    }

    if (parts[0] === 'sitemap' || parts[0] === 'site-map') {
      return <HtmlSitemapPage />;
    }

    if (
      parts[0] === 'cv-maker' ||
      parts[0] === 'resume-builder' ||
      parts[0] === 'free-cv-maker'
    ) {
      return <CvMakerPage />;
    }

    // 100+ Payment Methods & Payment Gateways Directory
    if (parts[0] === 'payment-methods') {
      if (!parts[1]) {
        return <PaymentDirectoryPage />;
      }
      if (parts[1] === 'compare') {
        return <PaymentDirectoryPage initialCompareMode={true} />;
      }
      if (parts[1] === 'countries' && parts[2]) {
        return <CountryPaymentPage countrySlug={parts[2]} />;
      }
      if (parts[1] && parts[2]) {
        return <PaymentDetailPage categorySlug={parts[1]} slug={parts[2]} />;
      }
      return <PaymentDirectoryPage initialCategorySlug={parts[1]} />;
    }

    // Mobile Phones & Technical Specifications Directory (/phones/*)
    if (parts[0] === 'phones') {
      if (!parts[1]) {
        return <MobilePhonesDirectoryPage />;
      }
      if (parts[1] === 'compare') {
        return <MobilePhonesDirectoryPage initialCompareMode={true} />;
      }
      if (parts[1] === 'brand' && parts[2]) {
        return <MobilePhonesDirectoryPage initialBrandSlug={parts[2]} />;
      }
      if (parts[1] === 'category' && parts[2]) {
        return <MobilePhonesDirectoryPage initialCategorySlug={parts[2]} />;
      }
      return <PhoneDetailPage slug={parts[1]} />;
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

    if (parts[0] === 'leaderboard') {
      return <LeaderboardPage />;
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
      if (parts[1] === 'topics') {
        return <BlogTopicsPage />;
      }
      if (parts[1]) {
        return <BlogPostPage params={{ slug: parts[1] }} />;
      }
      return <BlogHubPage />;
    }

    if (parts[0] === 'jobs' && parts[1]) {
      return <JobCategoryPage params={{ slug: parts[1] }} />;
    }

    // Soft-404 fix: never serve the homepage for unknown URLs
    isNotFound = true;
    return <NotFoundPage />;
  };

  // Resolve once so isNotFound is known before SEOHead / ad skip
  const pageContent = renderContent();
  const skipAds = shouldSkipAds(isNotFound ? '/404' : pathNormalized);
  const seoPath = isNotFound ? '/404' : currentPath;

  const isCvStudio =
    pathNormalized === '/cv-maker' ||
    pathNormalized === '/resume-builder' ||
    pathNormalized === '/free-cv-maker' ||
    pathNormalized === '/tools/cv-maker' ||
    pathNormalized === '/tools/resume-builder';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <SEOHead pathname={seoPath} />
      <Header />
      {/* Persistent header ad bar — skipped on workspace / admin / 404 */}
      {!skipAds && <HeaderAdBar />}
      <main
        className={
          isWorkspace
            ? 'flex-1 w-full'
            : isCvStudio
            ? 'flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-6'
            : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }
      >
        <Suspense fallback={<RouteFallback path={currentPath} />}>{pageContent}</Suspense>
      </main>
      {!isWorkspace && <Footer />}
      {/* Ad hooks: third-party networks removed; AdSense to be added after approval */}
      {!skipAds && <AdGlobals />}
    </div>
  );
}

