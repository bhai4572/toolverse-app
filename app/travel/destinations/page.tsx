import React, { useState } from 'react';
import { 
  getAllCountries, 
  getCountryByCodeOrName 
} from '@/lib/travel/countryRegistry';
import { 
  getAttractionsForCountry, 
  getHotelsForCountry 
} from '@/lib/travel/destinationEngine';

export default function DestinationsPage() {
  const [selectedCountryIso, setSelectedCountryIso] = useState<string>('TR');
  const [activeTab, setActiveTab] = useState<'attractions' | 'hotels'>('attractions');

  const allCountries = getAllCountries();
  const country = getCountryByCodeOrName(selectedCountryIso) || allCountries[0];
  const attractions = getAttractionsForCountry(country.iso2);
  const hotels = getHotelsForCountry(country.iso2);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
              Global Tourism & City Explorer
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <span>{country.flag}</span> Explore {country.name}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Capital: <span className="text-slate-200 font-semibold">{country.capital}</span> | Currency: <span className="text-slate-200 font-semibold">{country.currency.code} ({country.currency.symbol})</span> | Calling Code: <span className="text-slate-200 font-semibold">+{country.callingCode}</span>
            </p>
          </div>

          {/* Country Selector */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 min-w-[260px]">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Destination Country</label>
            <select
              value={selectedCountryIso}
              onChange={(e) => setSelectedCountryIso(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('attractions')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
              activeTab === 'attractions' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Must-See Attractions ({attractions.length})
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
              activeTab === 'hotels' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Hotels & Accommodation ({hotels.length})
          </button>
        </div>
      </div>

      {/* Attractions Content */}
      {activeTab === 'attractions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map(attr => (
            <div key={attr.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                    {attr.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">📍 {attr.city}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{attr.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{attr.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs">
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Ticket Price:</span>
                    <span className="font-semibold text-emerald-400">${attr.entryFeeUsd} USD</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Best Season:</span>
                    <span className="font-semibold">{attr.bestSeason}</span>
                  </div>
                </div>

                {attr.familyFriendly && (
                  <span className="inline-block text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-medium">
                    👨‍👩‍👧‍👦 Family Friendly
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hotels Content */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div key={hotel.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    ⭐ {hotel.rating} / 5.0
                  </span>
                  <span className="text-xs text-slate-400 font-medium">📍 {hotel.city}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.map((a, i) => (
                    <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price per night</span>
                  <span className="text-lg font-extrabold text-emerald-400">${hotel.pricePerNightUsd} USD</span>
                </div>

                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
                >
                  Book Hotel ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
