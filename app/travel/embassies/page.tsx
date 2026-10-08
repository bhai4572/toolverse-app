import React, { useState } from 'react';
import { 
  getAllCountries, 
  getCountryByCodeOrName 
} from '@/lib/travel/countryRegistry';
import { 
  getEmbassiesForRoute, 
  searchEmbassiesByCity 
} from '@/lib/travel/embassyRegistry';

export default function EmbassyDirectoryPage() {
  const [hostCountryCode, setHostCountryCode] = useState<string>('PK');
  const [sendingCountryCode, setSendingCountryCode] = useState<string>('DE');
  const [cityFilter, setCityFilter] = useState<string>('');

  const allCountries = getAllCountries();
  const hostCountry = getCountryByCodeOrName(hostCountryCode) || allCountries[0];
  const sendingCountry = getCountryByCodeOrName(sendingCountryCode) || allCountries[1];

  const routeEmbassies = getEmbassiesForRoute(hostCountry.iso2, sendingCountry.iso2);
  const cityEmbassies = cityFilter ? searchEmbassiesByCity(cityFilter) : [];

  const displayEmbassies = cityFilter ? cityEmbassies : routeEmbassies;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
            Global Diplomatic & Consular Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <span>🏛️</span> Official Embassy & Consulate Finder
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Locate official foreign embassies, consulates-general, and authorized visa application centers (VFS Global / TLScontact) worldwide.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Host Country (Where you live)</label>
            <select
              value={hostCountryCode}
              onChange={(e) => {
                setHostCountryCode(e.target.value);
                setCityFilter('');
              }}
              className="w-full bg-slate-900 text-slate-100 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Foreign Mission (Country applying to)</label>
            <select
              value={sendingCountryCode}
              onChange={(e) => {
                setSendingCountryCode(e.target.value);
                setCityFilter('');
              }}
              className="w-full bg-slate-900 text-slate-100 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Or Search by City</label>
            <input
              type="text"
              placeholder="e.g. Islamabad, Karachi, London..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 font-medium px-3.5 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Directory Results List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📍</span> Diplomatic Missions ({displayEmbassies.length})
          </h2>
          <span className="text-xs text-slate-400">
            {cityFilter ? `Showing results in city: "${cityFilter}"` : `${sendingCountry.name} Representation in ${hostCountry.name}`}
          </span>
        </div>

        {displayEmbassies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayEmbassies.map(embassy => (
              <div 
                key={embassy.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 uppercase tracking-wider">
                      {embassy.type}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">
                      {embassy.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      City: <span className="text-slate-200 font-medium">{embassy.city}</span> | Country: <span className="text-slate-200 font-medium">{embassy.hostCountryIso}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 font-semibold min-w-[60px]">Address:</span>
                    <span className="text-slate-200">{embassy.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold min-w-[60px]">Phone:</span>
                    <a href={`tel:${embassy.phone}`} className="text-blue-400 hover:underline">{embassy.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold min-w-[60px]">Email:</span>
                    <a href={`mailto:${embassy.email}`} className="text-blue-400 hover:underline">{embassy.email}</a>
                  </div>
                  {embassy.jurisdiction && (
                    <div className="flex items-start gap-2 pt-1 border-t border-slate-800/60">
                      <span className="text-slate-500 font-semibold min-w-[60px]">Jurisdiction:</span>
                      <span className="text-slate-400">{embassy.jurisdiction}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <a
                    href={embassy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
                  >
                    Official Portal ↗
                  </a>

                  {embassy.appointmentUrl && (
                    <a
                      href={embassy.appointmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md shadow-blue-500/20"
                    >
                      Book Appointment ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <div className="text-4xl">🏛️</div>
            <h3 className="text-lg font-bold text-white">No Consular Office Listed</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Applications for {sendingCountry.name} from {hostCountry.name} are either processed through an online eVisa portal or handled by a regional embassy in a neighboring country.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
