import React, { useState } from 'react';
import { getProductBySlug, PRODUCTS } from '@/lib/products/registry';
import { ProductReview } from '@/lib/products/types';
import { getStoredReviews, saveReview, isUpvoted, toggleUpvote } from '@/lib/products/storageEngine';
import { getToolsByCategory, TOOLS } from '@/lib/tools/registry';
import {
  ExternalLink,
  ShieldCheck,
  Star,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Check,
  X,
  Share2,
  Code,
  Building,
  Calendar,
  Globe,
  ArrowRight,
} from 'lucide-react';

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductProfilePage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Product Not Found</h1>
        <p className="text-slate-500">The product page you requested does not exist or has been removed.</p>
        <a href="/products" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Back to Product Discovery
        </a>
      </div>
    );
  }

  // Reviews state
  const storedReviews = getStoredReviews(product.slug);
  const [reviews, setReviews] = useState<ProductReview[]>(storedReviews);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newProText, setNewProText] = useState('');
  const [newConText, setNewConText] = useState('');

  // Upvotes
  const [upvotes, setUpvotes] = useState(product.upvotesCount);
  const [hasVoted, setHasVoted] = useState(isUpvoted(product.id));

  // Related Toolverse Tools
  const relatedTools = TOOLS.filter((t) => product.relatedToolverseToolSlugs.includes(t.slug) && t.status === 'live');

  // Related Products
  const relatedProducts = PRODUCTS.filter((p) => product.relatedProductSlugs.includes(p.slug) && p.slug !== product.slug);

  const handleVote = () => {
    const voted = toggleUpvote(product.id);
    setHasVoted(voted);
    setUpvotes((prev) => (voted ? prev + 1 : prev - 1));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewContent.trim()) return;

    const rev = saveReview({
      productId: product.id,
      productSlug: product.slug,
      userId: `u-${Date.now()}`,
      userName: newUserName.trim() || 'Verified User',
      rating: newRating,
      title: newReviewTitle,
      content: newReviewContent,
      pros: newProText ? [newProText] : ['Intuitive interface'],
      cons: newConText ? [newConText] : ['Minor feature limitations on free plan'],
      usagePeriod: '6+ months',
    });

    setReviews([rev, ...reviews]);
    setShowReviewModal(false);
    setNewReviewTitle('');
    setNewReviewContent('');
    setNewUserName('');
  };

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/products" className="hover:underline">Products</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{product.name}</span>
      </nav>

      {/* Header Banner */}
      <header className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={product.logoUrl}
              alt={`${product.name} logo`}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{product.name}</h1>
                {product.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Product
                  </span>
                )}
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">{product.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span>Category: <strong className="text-slate-800 dark:text-slate-200">{product.categoryName}</strong></span>
                <span>&bull;</span>
                <span>Country: <strong className="text-slate-800 dark:text-slate-200">{product.country}</strong></span>
                <span>&bull;</span>
                <span>Rating: <strong className="text-amber-500 font-bold">{product.ratingAverage} / 5.0</strong> ({product.ratingCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleVote}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                hasVoted
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4" /> Upvote {upvotes}
            </button>

            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Visit Official Site <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Overview, Features, Pricing */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Product Overview</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{product.longDescription}</p>

            {/* Screenshots */}
            {product.screenshots.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Screenshots</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.screenshots.map((img, i) => (
                    <img key={i} src={img} alt={`${product.name} screenshot ${i + 1}`} className="rounded-xl border object-cover w-full h-40" />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Features */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feat, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{feat.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Pricing &amp; Plans</h2>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-xs">
                Model: {product.pricingModel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-3 flex flex-col justify-between ${
                    plan.isPopular
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-2">
                    {plan.isPopular && (
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-bold text-[10px] uppercase">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{plan.name}</h3>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {plan.price}
                      {plan.period && <span className="text-xs text-slate-500 font-normal"> / {plan.period}</span>}
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pros & Cons */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Pros &amp; Cons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-2">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Key Strengths (Pros)
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {product.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">&bull; {p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl space-y-2">
                <h3 className="font-bold text-rose-900 dark:text-rose-300 text-sm flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-600" /> Drawbacks (Cons)
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {product.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">&bull; {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* User Reviews */}
          <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">User Reviews ({reviews.length})</h2>
                <p className="text-xs text-slate-500">Genuine reviews submitted by verified community members</p>
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
                        Verified
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{rev.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Company & Founder Details */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-500" /> Company Metadata
            </h3>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <div>Founder: <strong>{product.founderName || 'Verified Team'}</strong></div>
              <div>Company: <strong>{product.companyName}</strong></div>
              <div>Launch Date: <strong>{product.launchDate}</strong></div>
              <div>Platforms: <strong>{product.platforms.join(', ')}</strong></div>
            </div>

            <div className="pt-2 border-t flex flex-wrap gap-2">
              <a href="/claim" className="text-indigo-600 font-bold hover:underline">
                Claim this Product Profile &rarr;
              </a>
            </div>
          </div>

          {/* Related Toolverse Tools */}
          {relatedTools.length > 0 && (
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Free Toolverse Online Utilities
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300">
                Use these free client-side tools alongside {product.name}:
              </p>
              <div className="space-y-2">
                {relatedTools.map((t) => (
                  <a
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="block p-3 bg-white dark:bg-slate-900 border rounded-xl hover:border-indigo-500 transition-all text-xs"
                  >
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{t.canonicalName}</div>
                    <div className="text-slate-500 dark:text-slate-400 line-clamp-1">{t.shortDescription}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Alternatives Quick Bar */}
          {relatedProducts.length > 0 && (
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Popular Alternatives</h3>
              <div className="space-y-2">
                {relatedProducts.map((p) => (
                  <a
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <img src={p.logoUrl} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
                      <div className="text-slate-500 text-[11px]">{p.pricingModel}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Write Review for {product.name}</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. David Chen"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold text-amber-500"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Unusable</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Essential tool for our team workflow"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Review</label>
                <textarea
                  rows={3}
                  placeholder="Share your practical experience using this software..."
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
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
                  Submit Genuine Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
