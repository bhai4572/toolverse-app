import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Compass, Globe, ShieldCheck, MapPin, Briefcase, GraduationCap, DollarSign, Calendar, Clock, ArrowRight, ExternalLink, FileText, CheckCircle2, AlertTriangle, Building2, UserCheck, Plane } from 'lucide-react';
import { UN_COUNTRIES, getCountryByIso2 } from '@/lib/travel/countryRegistry';
import { getVisaRule, getPassportAccessSummary } from '@/lib/travel/visaEngine';
import { TravelPurpose } from '@/lib/travel/types';

export default function GlobalTravelPortalPage() {
  const [nationalityIso2, setNationalityIso2] = useState('PK');
  const [destinationIso2, setDestinationIso2] = useState('GB');
  const [purpose, setPurpose] = useState<TravelPurpose>('TOURISM');

  const selectedNationality = getCountryByIso2(nationalityIso2) || UN_COUNTRIES[0];
  const selectedDestination = getCountryByIso2(destinationIso2) || UN_COUNTRIES[1];
  const visaRule = getVisaRule(nationalityIso2, destinationIso2, purpose);
  const passportSummary = getPassportAccessSummary(nationalityIso2);

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>Toolverse Global Travel Intelligence System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Where can your <span className="text-blue-600 dark:text-blue-500">passport</span> take you?
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Instant verified travel intelligence across 193 UN Member States. Discover visa requirements, official government application links, document checklists, embassies, hotels, jobs, and cost of living.
        </p>
      </section>

      {/* Travel Intelligence Query Form */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nationality Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Your Passport / Nationality
            </label>
            <select
              value={nationalityIso2}
              onChange={(e) => setNationalityIso2(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500"
            >
              {UN_COUNTRIES.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {c.flagEmoji} {c.commonName} ({c.iso2})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Destination Country
            </label>
            <select
              value={destinationIso2}
              onChange={(e) => setDestinationIso2(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500"
            >
              {UN_COUNTRIES.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {c.flagEmoji} {c.commonName} ({c.iso2})
                </option>
              ))}
            </select>
          </div>

          {/* Purpose Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. Travel Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as TravelPurpose)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500"
            >
              <option value="TOURISM">Tourism &amp; Sightseeing</option>
              <option value="BUSINESS">Business &amp; Conference</option>
              <option value="WORK">Work &amp; Skilled Employment</option>
              <option value="STUDY">Higher Education / Student</option>
              <option value="FAMILY_VISIT">Family &amp; Friend Visit</option>
              <option value="TRANSIT">Airport Transit</option>
              <option value="DIGITAL_NOMAD">Digital Nomad / Remote</option>
            </select>
          </div>
        </div>

        {/* Live Requirement Summary Card */}
        <div className="p-6 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedNationality.flagEmoji}</span>
              <span className="text-slate-400 font-bold">&rarr;</span>
              <span className="text-2xl">{selectedDestination.flagEmoji}</span>
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold uppercase">
                {visaRule.status.replace(/_/g, ' ')}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {visaRule.statusLabel}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {visaRule.notes}
            </p>
          </div>

          <Link
            href={`/travel/${nationalityIso2.toLowerCase()}/${destinationIso2.toLowerCase()}`}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>View Full Requirements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Passport Summary Dashboard */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{selectedNationality.flagEmoji}</span>
              <span>Your {selectedNationality.commonName} Passport Power</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Global travel freedom analysis indexed across verified UN Member States.
            </p>
          </div>
          <Link
            href={`/travel/passport/${nationalityIso2.toLowerCase()}`}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore Complete Passport Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-1">
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
              {passportSummary.visaFreeCount}
            </div>
            <div className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">Visa Free</div>
          </div>

          <div className="p-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl text-center space-y-1">
            <div className="text-3xl font-black text-blue-700 dark:text-blue-300">
              {passportSummary.visaOnArrivalCount}
            </div>
            <div className="text-xs font-bold uppercase text-blue-800 dark:text-blue-400">Visa on Arrival</div>
          </div>

          <div className="p-5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl text-center space-y-1">
            <div className="text-3xl font-black text-purple-700 dark:text-purple-300">
              {passportSummary.eVisaCount}
            </div>
            <div className="text-xs font-bold uppercase text-purple-800 dark:text-purple-400">eVisa / ETA</div>
          </div>

          <div className="p-5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center space-y-1">
            <div className="text-3xl font-black text-slate-700 dark:text-slate-300">
              {passportSummary.visaRequiredCount}
            </div>
            <div className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Advance Visa</div>
          </div>
        </div>
      </section>

      {/* Feature Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link href="/travel/embassies" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-blue-500 transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
            Embassy &amp; Consulate Directory 🏛️
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Find official embassies, consulates, and visa application centers (VFS, TLScontact) in your city with verified phone, email, address, and appointment URLs.
          </p>
        </Link>

        <Link href="/travel/destinations" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-blue-500 transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
            City &amp; Tourism Explorer 🗺️
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Explore world top tourist attractions, ticket prices, opening hours, best seasons to visit, and verified hotel options.
          </p>
        </Link>

        <Link href="/travel/jobs" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:border-blue-500 transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 text-purple-600 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
            Work Travel &amp; Job Sponsorship 💼
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Discover verified jobs offering visa sponsorship, work permit rules, skilled worker eligibility, and salary vs cost of living calculators.
          </p>
        </Link>
      </section>

      {/* Source Verification Trust Footer */}
      <section className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <div className="font-bold text-sm">Level 1 Government Source Hierarchy</div>
            <div className="text-slate-400">All high-risk visa rules and fees are cross-verified with official interior &amp; foreign ministry portals.</div>
          </div>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          193/193 UN Member States Covered
        </div>
      </section>
    </div>
  );
}
