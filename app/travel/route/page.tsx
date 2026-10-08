import React, { useState } from 'react';
import { 
  getCountryByCodeOrName, 
  getAllCountries 
} from '@/lib/travel/countryRegistry';
import { 
  getVisaRule, 
  getRequiredDocuments, 
  calculateFeeWithConversion 
} from '@/lib/travel/visaEngine';
import { getEmbassiesForRoute } from '@/lib/travel/embassyRegistry';
import { generateTravelRouteSchema } from '@/lib/travel/travelSeoEngine';
import { TravelPurpose } from '@/lib/travel/types';

interface TravelRoutePageProps {
  nationalityCode?: string;
  destinationCode?: string;
}

export default function TravelRoutePage({ nationalityCode = 'PK', destinationCode = 'GB' }: TravelRoutePageProps) {
  const [natCode, setNatCode] = useState(nationalityCode);
  const [destCode, setDestCode] = useState(destinationCode);
  const [purpose, setPurpose] = useState<TravelPurpose>('tourism');
  const [employmentStatus, setEmploymentStatus] = useState<string>('employed');
  const [completedDocs, setCompletedDocs] = useState<Record<string, boolean>>({});

  const allCountries = getAllCountries();
  const natCountry = getCountryByCodeOrName(natCode) || allCountries[0];
  const destCountry = getCountryByCodeOrName(destCode) || allCountries[1];

  const visaRule = getVisaRule(natCountry.iso2, destCountry.iso2, purpose);
  const feeInfo = calculateFeeWithConversion(visaRule.feeUsd, natCountry.currency.code);
  const documentChecklist = getRequiredDocuments(visaRule, purpose, employmentStatus);
  const routeEmbassies = getEmbassiesForRoute(natCountry.iso2, destCountry.iso2);

  const toggleDoc = (docId: string) => {
    setCompletedDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const completedCount = Object.values(completedDocs).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (documentChecklist.length || 1)) * 100);

  const seoSchema = generateTravelRouteSchema(visaRule, natCountry, destCountry);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'VISA FREE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'VISA ON ARRIVAL': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'eVISA': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'ETA REQUIRED': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'EMBASSY / CONSULAR VISA': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ENTRY RESTRICTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: formatJsonLd(seoSchema) }}
      />

      {/* Navigation Header Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{natCountry.flag}</span>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Passport</div>
                <select
                  value={natCode}
                  onChange={(e) => setNatCode(e.target.value)}
                  className="bg-slate-800 text-slate-100 font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allCountries.map(c => (
                    <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-slate-500 font-bold px-2">➔</div>

            <div className="flex items-center gap-2">
              <span className="text-3xl">{destCountry.flag}</span>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Destination</div>
                <select
                  value={destCode}
                  onChange={(e) => setDestCode(e.target.value)}
                  className="bg-slate-800 text-slate-100 font-bold px-3 py-1.5 rounded-lg border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allCountries.map(c => (
                    <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Purpose</div>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as TravelPurpose)}
                className="bg-slate-800 text-slate-100 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tourism">Tourism & Travel</option>
                <option value="business">Business & Meetings</option>
                <option value="work">Work & Employment</option>
                <option value="study">Study & University</option>
                <option value="transit">Airport Transit</option>
                <option value="family">Family Visit</option>
                <option value="digital_nomad">Digital Nomad</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Result Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 text-9xl opacity-5 pointer-events-none">
          {destCountry.flag}
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                Official Travel Intelligence
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                {destCountry.name} Visa for {natCountry.demonym} Citizens
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Travel Purpose: <span className="text-slate-200 capitalize font-medium">{purpose.replace('_', ' ')}</span> | Destination Capital: <span className="text-slate-200">{destCountry.capital}</span>
              </p>
            </div>

            <div className={`px-5 py-3 rounded-2xl border text-center ${getStatusBadgeColor(visaRule.status)} backdrop-blur-md`}>
              <div className="text-xs uppercase tracking-widest font-semibold opacity-75">Entry Requirement</div>
              <div className="text-xl font-black mt-0.5">{visaRule.status}</div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xs text-slate-400 font-medium">Official Fee</div>
              <div className="text-lg font-bold text-white mt-1">
                ${visaRule.feeUsd} USD
              </div>
              <div className="text-xs text-emerald-400 font-mono">≈ {feeInfo.convertedFormatted}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xs text-slate-400 font-medium">Processing Time</div>
              <div className="text-lg font-bold text-white mt-1">
                {visaRule.processingTimeDays.standard} Business Days
              </div>
              <div className="text-xs text-slate-400">{visaRule.processingTimeDays.expedited ? `Expedited: ${visaRule.processingTimeDays.expedited} days` : 'Standard Queue'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xs text-slate-400 font-medium">Allowed Stay</div>
              <div className="text-lg font-bold text-white mt-1">
                {visaRule.maxStayDays ? `${visaRule.maxStayDays} Days` : 'Varies'}
              </div>
              <div className="text-xs text-slate-400">{visaRule.entriesAllowed} Entry</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xs text-slate-400 font-medium">Passport Validity</div>
              <div className="text-lg font-bold text-white mt-1">
                {visaRule.passportValidityMonthsReq} Months
              </div>
              <div className="text-xs text-slate-400">beyond travel date</div>
            </div>
          </div>

          {/* Verification Source Box */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Source: {visaRule.sourceName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Verified: {visaRule.lastVerifiedDate}</span>
            </div>
            {visaRule.officialPortalUrl && (
              <a 
                href={visaRule.officialPortalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
              >
                Official Application Portal ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Entry Conditions & Guidelines */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📋</span> Key Visa Requirements & Rules
            </h2>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              {visaRule.notes}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-lg">🛡️</span>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Travel Insurance</div>
                  <div className="text-xs text-slate-400">
                    {visaRule.insuranceRequired ? 'Mandatory official travel medical coverage required.' : 'Recommended for international coverage.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-lg">💉</span>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Vaccination / Health</div>
                  <div className="text-xs text-slate-400">
                    {visaRule.vaccinationRequired ? `Required: ${visaRule.vaccinationRequired}` : 'Standard WHO routine immunizations.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-lg">💰</span>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Financial Proof</div>
                  <div className="text-xs text-slate-400">
                    {visaRule.financialProofMinUsd ? `Min. ~$${visaRule.financialProofMinUsd} USD in bank balance.` : 'Proof of sufficient funds required.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-lg">🎫</span>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Return / Onward Ticket</div>
                  <div className="text-xs text-slate-400">
                    {visaRule.returnTicketRequired ? 'Confirmed return flight booking mandatory at check-in.' : 'Required for entry clearance.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Visa Document Checklist Engine */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📄</span> Personalized Document Checklist Builder
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your profile to customize required visa documentation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Employment:</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  <option value="employed">Employed (Company worker)</option>
                  <option value="self_employed">Self-Employed / Business owner</option>
                  <option value="student">Student / Academic</option>
                  <option value="unemployed">Retiree / Independent</option>
                </select>
              </div>
            </div>

            {/* Checklist Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Checklist Completion Progress</span>
                <span className="text-blue-400 font-mono">{completedCount} of {documentChecklist.length} ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Document Items List */}
            <div className="space-y-3">
              {documentChecklist.map((doc) => {
                const isChecked = !!completedDocs[doc.id];
                return (
                  <div 
                    key={doc.id} 
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isChecked 
                        ? 'bg-slate-950/80 border-emerald-500/40 text-slate-300' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-100'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {doc.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                          doc.requirementLevel === 'REQUIRED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          doc.requirementLevel === 'CONDITIONAL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {doc.requirementLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">
                        {doc.description}
                      </p>
                      {doc.specifications && (
                        <div className="text-[11px] text-blue-400 bg-blue-500/5 px-2.5 py-1 rounded border border-blue-500/10 inline-block font-mono">
                          Note: {doc.specifications}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checklist Utility Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition"
              >
                <span>🖨️</span> Print Document Checklist
              </button>
              <div className="text-xs text-slate-500">
                🔒 Data stays private on your local device.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Embassy Finder & Fast Action Portal */}
        <div className="space-y-6">
          {/* Embassy / Consulate Directory Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="text-xl">🏛️</span>
              <div>
                <h3 className="text-base font-bold text-white">Consular & Application Center</h3>
                <p className="text-xs text-slate-400">{destCountry.name} representation in {natCountry.name}</p>
              </div>
            </div>

            {routeEmbassies.length > 0 ? (
              <div className="space-y-4">
                {routeEmbassies.map((embassy) => (
                  <div key={embassy.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {embassy.type}
                      </span>
                      <span className="text-xs text-slate-400">📍 {embassy.city}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-200">{embassy.name}</h4>
                    <p className="text-xs text-slate-400">{embassy.address}</p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
                      <div><span className="text-slate-500">Phone:</span> {embassy.phone}</div>
                      <div><span className="text-slate-500">Email:</span> {embassy.email}</div>
                      {embassy.appointmentUrl && (
                        <a 
                          href={embassy.appointmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block text-blue-400 hover:underline font-semibold mt-1"
                        >
                          Book Appointment ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center space-y-2">
                <p>No direct embassy located in {natCountry.name}. Applications are processed online or through regional diplomatic jurisdiction.</p>
                {visaRule.officialPortalUrl && (
                  <a
                    href={visaRule.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-400 hover:underline font-bold"
                  >
                    Apply on Official E-Visa Portal ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Fast Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>✈️</span> Ready to Plan Your Trip?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore available tourist spots, estimated hotel budgets, and job opportunities in {destCountry.name}.
            </p>

            <div className="space-y-2">
              <a
                href="/travel/planner"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
              >
                Calculate Total Trip Budget ➔
              </a>
              <a
                href="/travel/destinations"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                Explore {destCountry.name} Attractions ↗
              </a>
              <a
                href="/travel/jobs"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                Check {destCountry.name} Work Visas & Jobs ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatJsonLd(schema: object) {
  return JSON.stringify(schema);
}
