'use client';

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  JobListing, 
  JobFilterParams, 
  GLOBAL_MASTER_JOBS_DATABASE,
  fetchLiveCrawledJobs,
  generateExpandedGlobalJobs,
  filterJobListings
} from '@/lib/jobs/jobEngine';
import { 
  Search, MapPin, Briefcase, Landmark, Globe, RefreshCw, 
  Sparkles, Clock, CheckCircle2, Building2, Flame, Share2, 
  Bookmark, BookmarkCheck, DollarSign, ChevronRight, X, 
  MessageCircle, Copy, Linkedin, Facebook 
} from 'lucide-react';

const POPULAR_COUNTRIES = [
  { code: 'all', name: 'All Countries 🌐' },
  { code: 'Pakistan', name: 'Pakistan 🇵🇰' },
  { code: 'United States', name: 'United States 🇺🇸' },
  { code: 'United Kingdom', name: 'United Kingdom 🇬🇧' },
  { code: 'United Arab Emirates', name: 'United Arab Emirates 🇦🇪' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia 🇸🇦' },
  { code: 'Canada', name: 'Canada 🇨🇦' },
  { code: 'Germany', name: 'Germany 🇩🇪' },
  { code: 'India', name: 'India 🇮🇳' },
  { code: 'Remote', name: 'Global Remote 🚀' }
];

const SECTORS = [
  'All',
  'Government & Public',
  'Banking & Finance',
  'Software & IT',
  'Medical & Healthcare',
  'Civil & Engineering',
  'Education & Teaching',
  'Customer Support & BPO',
  'Sales & Marketing',
  'Skilled Trades & Admin'
];

const JOB_TYPES = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

// Fallback safety helper
function safeGetInitialJobs(): JobListing[] {
  try {
    const expanded = generateExpandedGlobalJobs();
    const master = GLOBAL_MASTER_JOBS_DATABASE || [];
    return [...expanded, ...master];
  } catch (e) {
    return GLOBAL_MASTER_JOBS_DATABASE || [];
  }
}

// React Error Boundary Component to catch any UI render crashes
class JobErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Job Finder Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold text-lg">
            !
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Job Finder Encountered a Rendering Glitch
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click reset below to reload the job database cleanly.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-lg"
          >
            Reload Job Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function JobFinderContent() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [isGovernmentOnly, setIsGovernmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'relevance'>('latest');

  // Load initial jobs instantly from memory
  const [allMasterJobs] = useState<JobListing[]>(safeGetInitialJobs);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>(safeGetInitialJobs);
  
  const [visibleCount, setVisibleCount] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [shareModalJob, setShareModalJob] = useState<JobListing | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Load saved bookmarked jobs
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolverse_saved_jobs');
      if (stored) {
        setSavedJobIds(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // Filter jobs synchronously whenever user changes controls
  useEffect(() => {
    try {
      const res = filterJobListings(allMasterJobs, {
        query,
        city,
        country: selectedCountry,
        sector: selectedSector,
        jobType: selectedJobType,
        isRemoteOnly,
        isGovernmentOnly,
        sortBy
      });
      setFilteredJobs(res || []);
    } catch (err) {
      setFilteredJobs(allMasterJobs);
    }
  }, [query, city, selectedCountry, selectedSector, selectedJobType, isRemoteOnly, isGovernmentOnly, sortBy, allMasterJobs]);

  // Check URL parameters for shared job deep link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const sharedJobId = searchParams.get('job') || searchParams.get('id');
      if (sharedJobId) {
        const found = allMasterJobs.find(j => j && j.id === sharedJobId);
        if (found) {
          setSelectedJob(found);
        }
      }
    }
  }, [allMasterJobs]);

  // Background Live Crawl
  const handleLiveCrawl = async () => {
    setIsLoading(true);
    try {
      const liveResults = await fetchLiveCrawledJobs({
        query,
        city,
        country: selectedCountry,
        sector: selectedSector,
        jobType: selectedJobType,
        isRemoteOnly,
        isGovernmentOnly,
        sortBy
      });

      if (Array.isArray(liveResults) && liveResults.length > 0) {
        setFilteredJobs(liveResults);
      }
    } catch (err) {
      console.error('Live crawl error:', err);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const toggleBookmark = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter(id => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }
    setSavedJobIds(updated);
    try {
      localStorage.setItem('toolverse_saved_jobs', JSON.stringify(updated));
    } catch (e) {}
  };

  const getToolVerseShareUrl = (jobId?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://toolverse.baby';
    return `${baseUrl}/tools/global-job-finder?job=${encodeURIComponent(jobId || '1')}`;
  };

  const openShareModal = (job: JobListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShareModalJob(job);
  };

  const copyShareLink = (job: JobListing) => {
    const shareUrl = getToolVerseShareUrl(job?.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Search Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl overflow-hidden border border-brand-800/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI-Powered Global &amp; Regional Multi-Source Job Engine</span>
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              Find Jobs by City, Country, Sector &amp; Role 💼
            </h2>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              Indexing Global Govt Portals (USAJobs 🇺🇸, UK Civil Service 🇬🇧, UAE Govt 🇦🇪, Saudi Vision 2030 🇸🇦, Canada GC 🇨🇦, EU Careers 🇪🇺, India UPSC 🇮🇳, Pakistan PPSC 🇵🇰), Banks, IT, &amp; Remote jobs worldwide.
            </p>
          </div>

          {/* Search Bar Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleLiveCrawl(); }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 shadow-2xl"
          >
            {/* Keyword Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, skill, or department (e.g. Teacher, Nurse, Engineer, Accountant)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* City Input */}
            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="City (e.g. Lahore, Karachi, Islamabad, Dubai, London)..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Indexing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Jobs</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Popular Country Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium mr-1">Popular Countries:</span>
            {POPULAR_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCountry(c.code)}
                className={`text-xs px-3 py-1.5 rounded-lg transition ${
                  selectedCountry === c.code 
                    ? 'bg-brand-500 text-white font-semibold shadow-sm' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Filter Pills */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Browse Industry Sectors:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SECTORS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedSector === sec
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Job Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Type:</span>
          {JOB_TYPES.map((jt) => (
            <button
              key={jt}
              onClick={() => setSelectedJobType(jt)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedJobType === jt
                  ? 'bg-slate-900 text-white dark:bg-brand-600 dark:text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {jt}
            </button>
          ))}
        </div>

        {/* Govt & Remote Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-amber-700 dark:text-amber-400">
            <input
              type="checkbox"
              checked={isGovernmentOnly}
              onChange={(e) => setIsGovernmentOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-amber-500" />
              Govt Jobs Only
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isRemoteOnly}
              onChange={(e) => setIsRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              Remote Only
            </span>
          </label>

          <button
            onClick={() => handleLiveCrawl()}
            title="Crawl latest jobs from web APIs"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{(filteredJobs || []).length}</span> live active job opportunities
          {selectedCountry !== 'all' && <span> in <strong className="text-brand-600 dark:text-brand-400">{selectedCountry}</strong></span>}
          {selectedSector !== 'All' && <span> ({selectedSector})</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Last indexed: {lastRefreshed}</span>
        </div>
      </div>

      {/* Toast Alert */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 transition animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>ToolVerse job link copied to clipboard!</span>
        </div>
      )}

      {/* Job Cards Grid */}
      {(filteredJobs || []).length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No jobs found matching these exact criteria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Try searching with broader terms or select "All Countries" and "All Sectors".
            </p>
          </div>
          <button
            onClick={() => { setQuery(''); setCity(''); setSelectedCountry('all'); setSelectedSector('All'); setSelectedJobType('All'); setIsRemoteOnly(false); setIsGovernmentOnly(false); }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(filteredJobs || []).slice(0, visibleCount).map((job, idx) => {
              if (!job) return null;
              const jobId = job.id || `job-${idx}`;
              const isBookmarked = savedJobIds.includes(jobId);
              const companyName = job.company || 'Verified Employer';
              const jobTitle = job.title || 'Job Vacancy';
              const jobLocation = job.location || 'Worldwide';
              const jobType = job.jobType || 'Full-Time';

              return (
                <div
                  key={jobId}
                  onClick={() => setSelectedJob(job)}
                  className="group relative cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-bold text-base shrink-0">
                          {companyName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Building2 className="w-3 h-3" />
                            <span>{companyName}</span>

                            {job.isGovernment && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                                GOVT
                              </span>
                            )}
                            {job.isUrgent && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold text-[10px]">
                                <Flame className="w-2.5 h-2.5 fill-rose-500" />
                                URGENT
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition line-clamp-1 mt-0.5">
                            {jobTitle}
                          </h3>
                        </div>
                      </div>

                      {/* Share & Bookmark Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => openShareModal(job, e)}
                          title="Share Job Card"
                          className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => toggleBookmark(jobId, e)}
                          title={isBookmarked ? "Remove Bookmark" : "Save Job"}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-brand-600 fill-brand-600 dark:text-brand-400 dark:fill-brand-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Location & Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        <MapPin className="w-3 h-3 text-brand-500" />
                        {jobLocation}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-lg font-medium ${
                        job.isRemote 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}>
                        {jobType}
                      </span>

                      {job.salary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {job.description || 'View details and apply online on official portal.'}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium text-[11px]">
                      Posted: {job.postedDate || '2026-10-06'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold group-hover:translate-x-0.5 transition-transform">
                      View &amp; Apply
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < (filteredJobs || []).length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 40)}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md transition transform hover:-translate-y-0.5"
              >
                Load More Active Jobs (Showing {Math.min(visibleCount, (filteredJobs || []).length)} of {(filteredJobs || []).length} Opportunities)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                  {(selectedJob?.company || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    {selectedJob?.title || 'Job Opportunity'}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                    <span>{selectedJob?.company || 'Employer'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-500" />{selectedJob?.location || 'Worldwide'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
                  {selectedJob?.jobType || 'Full-Time'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  Sector: {selectedJob?.sector || 'Software & IT'}
                </span>
                {selectedJob?.salary && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                    💰 {selectedJob.salary}
                  </span>
                )}
                {selectedJob?.isGovernment && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    🏛️ Official Government Vacancy
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Job Description &amp; Official Details
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedJob?.description || 'Full vacancy details available on official portal.'}
                </p>
              </div>

              {/* Skill Tags */}
              {Array.isArray(selectedJob?.tags) && selectedJob.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Key Keywords &amp; Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Apply Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleBookmark(selectedJob.id, e)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {savedJobIds.includes(selectedJob.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-brand-600" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Save Job</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => openShareModal(selectedJob, e)}
                  className="px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100 text-xs font-semibold flex items-center gap-1.5 transition border border-brand-200 dark:border-brand-800"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share ToolVerse Link</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedJob?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-brand-600/30"
                >
                  <span>Apply on Official Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Sharing Modal */}
      {shareModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-brand-600" /> Share Job Opportunity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Shares ToolVerse link to bring traffic directly to your website first!
                </p>
              </div>
              <button
                onClick={() => setShareModalJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-brand-950 text-white space-y-2 border border-brand-800/40 shadow-inner">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {(shareModalJob?.company || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-brand-300 font-semibold">{shareModalJob?.company || 'Employer'}</div>
                  <h4 className="text-xs font-bold truncate">{shareModalJob?.title || 'Job Opportunity'}</h4>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 flex items-center gap-3">
                <span>📍 {shareModalJob?.location || 'Worldwide'}</span>
                <span>💼 {shareModalJob?.jobType || 'Full-Time'}</span>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span className="truncate">{getToolVerseShareUrl(shareModalJob?.id)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🔥 NEW JOB: ${shareModalJob?.title || 'Job'} at ${shareModalJob?.company || 'Employer'}\n📍 Location: ${shareModalJob?.location || 'Worldwide'} | 💼 Type: ${shareModalJob?.jobType || 'Full-Time'}\n\n👉 View Details & Apply on ToolVerse:\n${getToolVerseShareUrl(shareModalJob?.id)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" /> Share WhatsApp
              </a>

              <button
                onClick={() => copyShareLink(shareModalJob)}
                className="flex items-center justify-center gap-2 p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Copy className="w-4 h-4" /> Copy Link
              </button>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getToolVerseShareUrl(shareModalJob?.id))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getToolVerseShareUrl(shareModalJob?.id))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobTools() {
  return (
    <JobErrorBoundary>
      <JobFinderContent />
    </JobErrorBoundary>
  );
}
export { JobTools as JobFinderTool };
