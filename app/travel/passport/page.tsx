import React, { useState } from 'react';
import { 
  getAllCountries, 
  getCountryByCodeOrName 
} from '@/lib/travel/countryRegistry';
import { 
  getPassportMobilitySummary 
} from '@/lib/travel/visaEngine';

export default function PassportDashboardPage() {
  const [selectedNat, setSelectedNat] = useState<string>('PK');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const allCountries = getAllCountries();
  const currentCountry = getCountryByCodeOrName(selectedNat) || allCountries[0];
  const mobility = getPassportMobilitySummary(currentCountry.iso2);

  const filterCountries = (items: typeof mobility.visaFree) => {
    return items.filter(destIso => {
      const country = getCountryByCodeOrName(destIso);
      if (!country) return false;
      if (!searchFilter) return true;
      return country.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
             country.continent.toLowerCase().includes(searchFilter.toLowerCase());
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              Global Passport Index & Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <span>{currentCountry.flag}</span> {currentCountry.name} Passport Access
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Explore visa-free travel destinations, visa-on-arrival eligibility, eVisas, and advance consular visa requirements worldwide.
            </p>
          </div>

          {/* Country Selector */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 min-w-[260px]">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Passport Country</label>
            <select
              value={selectedNat}
              onChange={(e) => setSelectedNat(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobility Stats Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80">
          <button 
            onClick={() => setActiveTab('visaFree')}
            className={`p-3 rounded-2xl border text-left transition ${activeTab === 'visaFree' ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="text-xs text-emerald-400 font-medium">Visa-Free</div>
            <div className="text-2xl font-black text-white mt-1">{mobility.counts.visaFree}</div>
            <div className="text-[11px] text-slate-400">destinations</div>
          </button>

          <button 
            onClick={() => setActiveTab('visaOnArrival')}
            className={`p-3 rounded-2xl border text-left transition ${activeTab === 'visaOnArrival' ? 'bg-teal-500/20 border-teal-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="text-xs text-teal-400 font-medium">Visa on Arrival</div>
            <div className="text-2xl font-black text-white mt-1">{mobility.counts.visaOnArrival}</div>
            <div className="text-[11px] text-slate-400">destinations</div>
          </button>

          <button 
            onClick={() => setActiveTab('eVisa')}
            className={`p-3 rounded-2xl border text-left transition ${activeTab === 'eVisa' ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="text-xs text-cyan-400 font-medium">eVisa / Online</div>
            <div className="text-2xl font-black text-white mt-1">{mobility.counts.eVisa}</div>
            <div className="text-[11px] text-slate-400">destinations</div>
          </button>

          <button 
            onClick={() => setActiveTab('eta')}
            className={`p-3 rounded-2xl border text-left transition ${activeTab === 'eta' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="text-xs text-blue-400 font-medium">ETA Authorization</div>
            <div className="text-2xl font-black text-white mt-1">{mobility.counts.eta}</div>
            <div className="text-[11px] text-slate-400">destinations</div>
          </button>

          <button 
            onClick={() => setActiveTab('visaRequired')}
            className={`p-3 rounded-2xl border text-left transition ${activeTab === 'visaRequired' ? 'bg-amber-500/20 border-amber-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="text-xs text-amber-400 font-medium">Visa Required</div>
            <div className="text-2xl font-black text-white mt-1">{mobility.counts.visaRequired}</div>
            <div className="text-[11px] text-slate-400">destinations</div>
          </button>

          <button 
            onClick={() => setActiveTab('all')}
            className={`p-3 rounded-2xl border text-left transition ${activeTab === 'all' ? 'bg-purple-500/20 border-purple-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="text-xs text-purple-400 font-medium">Total UN States</div>
            <div className="text-2xl font-black text-white mt-1">193</div>
            <div className="text-[11px] text-slate-400">complete database</div>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['all', 'visaFree', 'visaOnArrival', 'eVisa', 'eta', 'visaRequired'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab === 'visaFree' ? 'Visa Free' :
               tab === 'visaOnArrival' ? 'Visa on Arrival' :
               tab === 'eVisa' ? 'eVisa' :
               tab === 'eta' ? 'ETA' :
               tab === 'visaRequired' ? 'Visa Required' : 'All Countries'}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter country or continent..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full sm:w-64 bg-slate-950 text-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allCountries
          .filter(c => c.iso2 !== currentCountry.iso2)
          .filter(c => {
            if (activeTab === 'visaFree') return mobility.visaFree.includes(c.iso2);
            if (activeTab === 'visaOnArrival') return mobility.visaOnArrival.includes(c.iso2);
            if (activeTab === 'eVisa') return mobility.eVisa.includes(c.iso2);
            if (activeTab === 'eta') return mobility.eta.includes(c.iso2);
            if (activeTab === 'visaRequired') return mobility.visaRequired.includes(c.iso2);
            return true;
          })
          .filter(c => {
            if (!searchFilter) return true;
            return c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                   c.continent.toLowerCase().includes(searchFilter.toLowerCase());
          })
          .map(destCountry => {
            const isVisaFree = mobility.visaFree.includes(destCountry.iso2);
            const isVoa = mobility.visaOnArrival.includes(destCountry.iso2);
            const isEvisa = mobility.eVisa.includes(destCountry.iso2);
            const isEta = mobility.eta.includes(destCountry.iso2);

            const statusLabel = isVisaFree ? 'VISA FREE' : isVoa ? 'VISA ON ARRIVAL' : isEvisa ? 'eVISA' : isEta ? 'ETA REQUIRED' : 'VISA REQUIRED';
            const statusColor = isVisaFree ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                               isVoa ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' :
                               isEvisa ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                               isEta ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                               'text-amber-400 bg-amber-500/10 border-amber-500/20';

            return (
              <a
                key={destCountry.iso2}
                href={`/travel?nat=${currentCountry.iso2}&dest=${destCountry.iso2}`}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 group hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl group-hover:scale-110 transition">{destCountry.flag}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 group-hover:text-blue-400 transition text-sm">
                    {destCountry.name}
                  </h3>
                  <p className="text-xs text-slate-400">{destCountry.capital} • {destCountry.continent}</p>
                </div>

                <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>Currency: {destCountry.currency.code}</span>
                  <span className="text-blue-400 font-semibold group-hover:underline">Requirements ➔</span>
                </div>
              </a>
            );
          })}
      </div>
    </div>
  );
}
