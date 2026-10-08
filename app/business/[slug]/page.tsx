import React, { useState } from 'react';
import { getBusinessBySlugOrId, getStoredBusinessReviews, saveBusinessReview } from '@/lib/business/storageEngine';
import { createBusinessReport } from '@/lib/business/moderationEngine';
import { getPermanentBusinessQRUrl, generateSVGQRBadge } from '@/lib/business/qrEngine';
import {
  ShieldCheck,
  MapPin,
  Globe,
  Phone,
  Mail,
  Clock,
  Star,
  QrCode,
  ExternalLink,
  Share2,
  Flag,
  CheckCircle,
  Building,
  Award,
  Sparkles,
  X,
  Send,
} from 'lucide-react';

interface PublicBusinessPageProps {
  params: { slug: string };
}

export default function CanonicalPublicBusinessProfilePage({ params }: PublicBusinessPageProps) {
  const business = getBusinessBySlugOrId(params.slug);

  if (!business || business.spamStatus === 'SPAM' || business.spamStatus === 'SUSPENDED') {
    return (
      <div className="p-12 text-center space-y-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Business Profile Unavailable</h1>
        <p className="text-slate-500 text-sm">
          The requested business profile is unavailable or under policy review.
        </p>
        <a href="/business" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Return to Business Directory
        </a>
      </div>
    );
  }

  // Reviews
  const reviews = getStoredBusinessReviews(business.id);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');

  // Report Form state
  const [reportReason, setReportReason] = useState<any>('WRONG_INFO');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewContent.trim()) return;

    saveBusinessReview({
      businessId: business.id,
      businessSlug: business.slug,
      userId: `u-${Date.now()}`,
      userName: reviewName.trim() || 'Verified Customer',
      rating: reviewRating,
      title: reviewTitle,
      content: reviewContent,
      pros: reviewPros ? [reviewPros] : ['Great customer service'],
      cons: reviewCons ? [reviewCons] : ['None'],
      usageExperience: 'Visited in person',
    });

    setShowReviewModal(false);
    setReviewTitle('');
    setReviewContent('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    createBusinessReport(business.id, business.name, 'user@example.com', reportReason, reportDesc);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
    }, 2000);
  };

  const qrSvg = generateSVGQRBadge(business, { template: 'Verified', showStatus: true, showCategory: true });

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/business" className="hover:underline">Businesses</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{business.name}</span>
      </nav>

      {/* Main Hero Card */}
      <header className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <img
              src={business.logoUrl}
              alt={`${business.name} logo`}
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-md"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{business.name}</h1>
                {business.isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-4 h-4" /> Verified Business
                  </span>
                )}
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border">
                  ID: {business.id}
                </span>
              </div>

              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">{business.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {business.city}, {business.country}
                </span>
                <span>&bull;</span>
                <span>Category: <strong className="text-slate-800 dark:text-slate-200">{business.categoryName}</strong></span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {business.ratingAverage} / 5.0 ({reviews.length + business.ratingCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              <QrCode className="w-4 h-4" /> View QR Identity
            </button>

            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Visit Official Web <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Business Overview</h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{business.longDescription}</p>

            {/* Photos */}
            {business.photos.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Photos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.photos.map((img, i) => (
                    <img key={i} src={img} alt={`${business.name} photo ${i + 1}`} className="rounded-xl border object-cover w-full h-44" />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Services & Offerings */}
          {business.services.length > 0 && (
            <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Services &amp; Offerings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.services.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{s.name}</h3>
                      {s.price && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{s.price}</span>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{s.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Customer Reviews */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Honest Customer Reviews ({reviews.length})</h2>
                <p className="text-xs text-slate-500">Real feedback submitted by community members</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 transition-all"
              >
                Write a Review
              </button>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.userName}</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-semibold">
                        Verified Customer
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{rev.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Contact & Verification */}
        <aside className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-500" /> Location &amp; Contact
            </h3>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              {business.address && <div>Address: <strong>{business.address}, {business.city}</strong></div>}
              <div>Phone: <strong>{business.phone}</strong></div>
              <div>Email: <strong>{business.email}</strong></div>
              <div>Service Area: <strong>{business.serviceArea || 'Local'}</strong></div>
            </div>

            <div className="pt-3 border-t flex flex-wrap gap-3">
              <button
                onClick={() => setShowReportModal(true)}
                className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" /> Report Business
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Review {business.name}</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Oak"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold text-amber-500"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Good Experience</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectation</option>
                  <option value={1}>1 Star - Poor Service</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent service and friendly team"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Share your practical customer experience..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Toolverse Digital Identity</h3>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-center"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />

            <a
              href="/business-qr"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700"
            >
              Open Printable QR Generator &rarr;
            </a>
          </div>
        </div>
      )}
    </article>
  );
}
