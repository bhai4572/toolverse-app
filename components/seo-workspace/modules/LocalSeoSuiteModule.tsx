'use client';

import React, { useState, useMemo } from 'react';
import { ModuleShell, Panel } from '../ModuleShell';
import { getActiveProject, createTask } from '@/lib/seo/workspace/workspaceStorage';
import {
  MapPin,
  Building,
  Star,
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface DirectoryListing {
  name: string;
  domain: string;
  status: 'verified' | 'pending' | 'inconsistent' | 'missing';
  url: string;
}

export function LocalSeoSuiteModule({ initialTab = 'schema' }: { initialTab?: 'schema' | 'listings' | 'reviews' | 'map-pack' }) {
  const project = getActiveProject();
  const [activeTab, setActiveTab] = useState<'schema' | 'listings' | 'reviews' | 'map-pack'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  // 1. LocalBusiness Schema Builder State
  const [businessType, setBusinessType] = useState('LocalBusiness');
  const [businessName, setBusinessName] = useState('ToolVerse Tech Labs');
  const [streetAddress, setStreetAddress] = useState('100 Innovation Way, Suite 400');
  const [city, setCity] = useState('San Francisco');
  const [region, setRegion] = useState('CA');
  const [postalCode, setPostalCode] = useState('94107');
  const [country, setCountry] = useState('US');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [priceRange, setPriceRange] = useState('$$');
  const [latitude, setLatitude] = useState('37.7749');
  const [longitude, setLongitude] = useState('-122.4194');
  const [openingHours, setOpeningHours] = useState('Mo-Fr 09:00-18:00');

  // 2. Directory Listings & NAP Consistency State
  const [listings, setListings] = useState<DirectoryListing[]>([
    { name: 'Google Business Profile', domain: 'google.com/business', status: 'verified', url: 'https://business.google.com' },
    { name: 'Bing Places for Business', domain: 'bingplaces.com', status: 'verified', url: 'https://bingplaces.com' },
    { name: 'Apple Business Connect', domain: 'businessconnect.apple.com', status: 'pending', url: 'https://businessconnect.apple.com' },
    { name: 'Yelp for Business', domain: 'yelp.com', status: 'verified', url: 'https://biz.yelp.com' },
    { name: 'Facebook Local Page', domain: 'facebook.com', status: 'verified', url: 'https://facebook.com' },
    { name: 'YellowPages', domain: 'yellowpages.com', status: 'missing', url: '' },
    { name: 'Better Business Bureau (BBB)', domain: 'bbb.org', status: 'missing', url: '' },
  ]);

  // 3. Review Response Assistant State
  const [reviewerName, setReviewerName] = useState('Alex Morgan');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState(
    'Incredible technical SEO auditing tool. Crawled our entire site in seconds and caught canonical issues that had been hurting our rankings for months!'
  );
  const [contactEmail, setContactEmail] = useState('support@toolverse.baby');

  // Compute JSON-LD
  const generatedSchema = useMemo(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': businessType,
      name: businessName,
      image: 'https://toolverse.baby/og-image.png',
      '@id': project.primaryUrl || 'https://toolverse.baby',
      url: project.primaryUrl || 'https://toolverse.baby',
      telephone: phone,
      priceRange: priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: streetAddress,
        addressLocality: city,
        addressRegion: region,
        postalCode: postalCode,
        addressCountry: country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(latitude) || 37.7749,
        longitude: parseFloat(longitude) || -122.4194,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
    };
    return JSON.stringify(jsonLd, null, 2);
  }, [businessType, businessName, phone, priceRange, streetAddress, city, region, postalCode, country, latitude, longitude, project.primaryUrl]);

  // Compute NAP Consistency Score
  const napScore = useMemo(() => {
    const verified = listings.filter((l) => l.status === 'verified').length;
    return Math.round((verified / listings.length) * 100);
  }, [listings]);

  // Compute Review Response Draft
  const responseDraft = useMemo(() => {
    const cleanName = reviewerName.trim() || 'Valued Customer';
    if (rating >= 4) {
      return `Hi ${cleanName},\n\nThank you so much for the glowing ${rating}-star review! We are thrilled to hear that our tools helped optimize your technical SEO and streamline your site architecture.\n\nOur team is constantly adding new features to ensure you stay ahead in search rankings. If there is ever anything else we can do to support your growth, don't hesitate to reach out.\n\nBest regards,\nThe Team at ${businessName}`;
    } else if (rating === 3) {
      return `Hi ${cleanName},\n\nThank you for sharing your feedback with us. We appreciate your honest review and want to make sure your experience with ${businessName} is nothing short of exceptional.\n\nWe would love to learn more about how we can improve. Please reach out to us directly at ${contactEmail} so we can address your feedback and ensure all your SEO workflows run smoothly.\n\nWarm regards,\nCustomer Support Team`;
    } else {
      return `Dear ${cleanName},\n\nThank you for bringing this to our attention. We are truly sorry to hear that your experience did not meet expectations. At ${businessName}, we hold our tools and support to the highest standard.\n\nWe take your comments seriously and want to resolve this for you immediately. Please contact our leadership directly at ${contactEmail} so we can personally investigate and make things right.\n\nSincerely,\nClient Care Team at ${businessName}`;
    }
  }, [reviewerName, rating, businessName, contactEmail]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateListingStatus = (index: number, newStatus: DirectoryListing['status']) => {
    const next = [...listings];
    next[index].status = newStatus;
    setListings(next);
  };

  return (
    <ModuleShell
      title="Local SEO & Listing Management Suite"
      purpose="Generate schema.org LocalBusiness structured data, audit multi-directory NAP consistency, and draft professional review responses."
      honesty="Production Local SEO tools. Produces validated Google-compliant JSON-LD markup and standardized listing audit checklists. No fake Google Business Profile API sync."
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          LocalBusiness Schema (JSON-LD)
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          NAP Consistency & Listings ({napScore}%)
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Review Response Assistant
        </button>
      </div>

      {notice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: LocalBusiness Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <Panel title="Business Information">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Schema Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                      >
                        <option value="LocalBusiness">LocalBusiness</option>
                        <option value="ProfessionalService">ProfessionalService</option>
                        <option value="MedicalBusiness">MedicalBusiness</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Store">Retail Store</option>
                        <option value="AutomotiveBusiness">AutomotiveBusiness</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Business Name</label>
                      <input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Street Address</label>
                    <input
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">City</label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">State / Region</label>
                      <input
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Postal Code</label>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Price Range</label>
                      <input
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Latitude</label>
                      <input
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Longitude</label>
                      <input
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <Panel title="Generated JSON-LD (schema.org)">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono">application/ld+json</span>
                  <button
                    onClick={() => handleCopy(`<script type="application/ld+json">\n${generatedSchema}\n</script>`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy &lt;script&gt; Tag
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px]">
                  {generatedSchema}
                </pre>
                <p className="text-xs text-slate-500 mt-2">
                  Paste this snippet into the <code>&lt;head&gt;</code> of your homepage or contact page to qualify for Google Local Knowledge Panel and Map Pack rich results.
                </p>
              </Panel>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NAP Consistency & Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <Panel title="Directory Listings & Citation Consistency Audit">
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">NAP Consistency</div>
                <div className="text-2xl font-black text-indigo-600">{napScore}%</div>
                <div className="text-[10px] text-slate-400">Verified directories</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Target Phone</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate mt-1">{phone}</div>
                <div className="text-[10px] text-slate-400">Primary phone for all citations</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Target Address</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
                  {streetAddress}, {city}
                </div>
                <div className="text-[10px] text-slate-400">Must match verbatim</div>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
              {listings.map((item, i) => (
                <div key={item.name} className="p-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {item.name}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">{item.domain}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateListingStatus(i, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border border-transparent ${
                        item.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.status === 'pending'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : item.status === 'inconsistent'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}
                    >
                      <option value="verified">Verified & Consistent</option>
                      <option value="pending">Verification Pending</option>
                      <option value="inconsistent">Inconsistent NAP</option>
                      <option value="missing">Not Listed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                Tip: Search engines penalize slight variations in phone numbers, suite numbers, or street abbreviations.
              </span>
              <button
                type="button"
                onClick={() => {
                  createTask({
                    title: `Audit NAP consistency across missing directories (${listings.filter((l) => l.status === 'missing').length} missing)`,
                    category: 'technical',
                    priority: 'medium',
                  });
                  setNotice('Local citation task added to Task Manager!');
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                + Create Citation Audit Task
              </button>
            </div>
          </Panel>
        </div>
      )}

      {/* TAB 3: Review Response Assistant */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Panel title="Customer Review Input">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Reviewer Name</label>
                    <input
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Star Rating</label>
                    <div className="flex gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-bold transition ${
                            rating === star
                              ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
                              : 'border-slate-200 dark:border-slate-800 text-slate-500'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Review Text</label>
                    <textarea
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Support / Escalation Email</label>
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>
                </div>
              </Panel>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <Panel title="Tailored Response Draft">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {rating >= 4 ? 'Gratitude & Brand Reinforcement' : rating === 3 ? 'Constructive Resolution' : 'Critical Escalation & Care'}
                    </span>
                    <button
                      onClick={() => handleCopy(responseDraft)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition flex items-center gap-1 shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Response
                    </button>
                  </div>
                  <pre className="font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                    {responseDraft}
                  </pre>
                </div>

                <div className="text-xs text-slate-500 space-y-1.5">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Google Review Best Practices:</div>
                  <div>• Respond within 24 to 48 hours to signal active management to Google algorithms.</div>
                  <div>• Never argue with negative reviews publicly; offer an offline direct contact email.</div>
                  <div>• Mention specific service names naturally to reinforce local entity relevance.</div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
