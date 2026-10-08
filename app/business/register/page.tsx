import React, { useState } from 'react';
import { getStoredCategories, saveCategory, saveBusiness } from '@/lib/business/storageEngine';
import { BusinessType } from '@/lib/business/types';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Building, MapPin, Globe, Phone, Mail, Clock, Plus, Search } from 'lucide-react';

export default function BusinessOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submittedBiz, setSubmittedBiz] = useState<any>(null);

  const categories = getStoredCategories();

  // Form State
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('Local Business');
  const [categorySlug, setCategorySlug] = useState('barber-shops-salons');
  const [customCatInput, setCustomCatInput] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [isGlobalOnline, setIsGlobalOnline] = useState(false);
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  const handleCreateCategoryIfNeeded = () => {
    if (customCatInput.trim()) {
      const newCat = saveCategory(customCatInput.trim(), 'User generated business category');
      setCategorySlug(newCat.slug);
      setCustomCatInput('');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const selectedCat = categories.find((c) => c.slug === categorySlug) || categories[0];

    const biz = saveBusiness({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      businessType,
      categorySlug: selectedCat.slug,
      categoryName: selectedCat.name,
      description: description || `${name} offers professional ${selectedCat.name} services.`,
      longDescription: description || `${name} is a verified provider of ${selectedCat.name} serving customers in ${city}, ${country}.`,
      logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop',
      photos: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&fit=crop'],
      websiteUrl: websiteUrl.trim() || `https://toolverse.baby/business`,
      email,
      phone: phone || '+1 555 0192',
      address,
      city,
      country,
      isGlobalOnline,
      serviceArea: isGlobalOnline ? 'Worldwide' : `${city} Metropolitan`,
      businessHours: [
        { day: 'Monday', openTime: '09:00 AM', closeTime: '06:00 PM' },
        { day: 'Tuesday', openTime: '09:00 AM', closeTime: '06:00 PM' },
        { day: 'Wednesday', openTime: '09:00 AM', closeTime: '06:00 PM' },
        { day: 'Thursday', openTime: '09:00 AM', closeTime: '06:00 PM' },
        { day: 'Friday', openTime: '09:00 AM', closeTime: '05:00 PM' }
      ],
      services: serviceName ? [{ id: 's1', name: serviceName, description: 'Core service', price: servicePrice }] : [],
      verificationLevel: 1,
      isVerified: false,
      ownerEmail: email,
      isSponsored: false,
    });

    setSubmittedBiz(biz);
  };

  if (submittedBiz) {
    return (
      <div className="p-10 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">Business Identity Created!</h2>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          Your canonical profile is now live. Your permanent Business ID is:
        </p>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl font-mono text-lg font-bold text-indigo-600">
          {submittedBiz.id}
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <a href={`/business/${submittedBiz.slug}`} className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow">
            View Public Profile &rarr;
          </a>
          <a href={`/b/${submittedBiz.id}`} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border">
            Test Permanent QR Resolver
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Digital Identity Onboarding
        </div>
        <h1 className="text-3xl font-black">Register Your Business Identity</h1>
        <p className="text-slate-300 text-xs max-w-md mx-auto">
          Get a permanent Business ID, printable QR badge, canonical public profile, and customer discovery features.
        </p>
      </header>

      <form onSubmit={handleFinalSubmit} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 text-xs">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-slate-500 font-bold border-b pb-3">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? 'Basic Info' : step === 2 ? 'Category & Type' : step === 3 ? 'Location & Contact' : 'Details & Submit'}</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name *</label>
              <input
                type="text"
                placeholder="e.g. Ali Barber Studio"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tagline or Short Description</label>
              <input
                type="text"
                placeholder="e.g. Premier men grooming studio in Gulberg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="px-5 py-2.5 bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center gap-1"
              >
                Next: Category <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                <option value="Local Business">Local Business</option>
                <option value="Agency">Agency</option>
                <option value="Restaurant">Restaurant</option>
                <option value="SaaS">SaaS / Cloud Software</option>
                <option value="Service">Service Provider</option>
                <option value="Retail">Retail Store</option>
                <option value="Professional Service">Professional Service</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Primary Category</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Don't see your category? Suggest New</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Vintage Car Restoration"
                  value={customCatInput}
                  onChange={(e) => setCustomCatInput(e.target.value)}
                  className="flex-1 p-2 bg-white dark:bg-slate-900 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleCreateCategoryIfNeeded}
                  className="px-3 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg"
                >
                  Add Category
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow flex items-center gap-1"
              >
                Next: Location <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Country *</label>
                <input
                  type="text"
                  placeholder="e.g. Pakistan, UK, Canada, USA"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Lahore, London, Toronto"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address (Optional for Online)</label>
              <input
                type="text"
                placeholder="e.g. Block M, Main Boulevard, Gulberg III"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Email *</label>
                <input
                  type="email"
                  placeholder="owner@business.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 300 8472910"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!email.trim()}
                className="px-5 py-2.5 bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center gap-1"
              >
                Next: Finalize <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Logo Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Haircut"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price</label>
                <input
                  type="text"
                  placeholder="e.g. $15"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Create Digital Identity &rarr;
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
