import React, { useState, useEffect } from 'react';
import HomePage from '../app/page';
import ToolPage from '../app/tools/[slug]/page';
import CategoryPage from '../app/category/[slug]/page';
import LegalPage from '../app/legal/[slug]/page';
import BlogHubPage from '../app/blog/page';
import BlogPostPage from '../app/blog/[slug]/page';
import JobCategoryPage from '../app/jobs/[slug]/page';
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
