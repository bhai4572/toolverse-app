import React, { useState } from 'react';
import { 
  getAllCountries, 
  getCountryByCodeOrName 
} from '@/lib/travel/countryRegistry';
import { 
  getVisaRule 
} from '@/lib/travel/visaEngine';
import { 
  generateItinerary 
} from '@/lib/travel/destinationEngine';
import { 
  saveTravelPlanToStorage, 
  getSavedTravelPlans 
} from '@/lib/travel/storageEngine';
import { TravelPlan } from '@/lib/travel/types';

export default function TravelPlannerPage() {
  const [natIso, setNatIso] = useState<string>('PK');
  const [destIso, setDestIso] = useState<string>('TR');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [travelers, setTravelers] = useState<number>(1);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'comfortable' | 'luxury'>('comfortable');

  const allCountries = getAllCountries();
  const natCountry = getCountryByCodeOrName(natIso) || allCountries[0];
  const destCountry = getCountryByCodeOrName(destIso) || allCountries[1];
  const visaRule = getVisaRule(natCountry.iso2, destCountry.iso2, 'tourism');

  // Budget Tier Base Multipliers
  const dailyHotel = budgetTier === 'budget' ? 45 : budgetTier === 'comfortable' ? 95 : 220;
  const dailyFood = budgetTier === 'budget' ? 20 : budgetTier === 'comfortable' ? 45 : 90;
  const dailyTransport = budgetTier === 'budget' ? 10 : budgetTier === 'comfortable' ? 25 : 50;
  const dailyAttractions = budgetTier === 'budget' ? 15 : budgetTier === 'comfortable' ? 30 : 60;
  const flightEstimate = 650;
  const visaFeeTotal = visaRule.feeUsd * travelers;

  const totalHotels = dailyHotel * durationDays * Math.ceil(travelers / 2);
  const totalFood = dailyFood * durationDays * travelers;
  const totalTransport = dailyTransport * durationDays * travelers;
  const totalAttractions = dailyAttractions * durationDays * travelers;
  const totalFlights = flightEstimate * travelers;
  const emergencyCushion = Math.round((totalHotels + totalFood + totalTransport) * 0.1);

  const grandTotalUsd = totalHotels + totalFood + totalTransport + totalAttractions + totalFlights + visaFeeTotal + emergencyCushion;

  const itinerary = generateItinerary(destCountry.iso2, durationDays);

  const handleSavePlan = () => {
    const plan: TravelPlan = {
      id: `plan_${Date.now()}`,
      nationalityIso: natCountry.iso2,
      destinationIso: destCountry.iso2,
      travelersCount: travelers,
      durationDays: durationDays,
      budgetTier: budgetTier,
      estimatedCostUsd: grandTotalUsd,
      dailyItinerary: itinerary.map(day => ({
        day: day.day,
        title: day.title,
        activities: day.activities,
        estimatedCostUsd: day.estimatedCostUsd,
      })),
      createdAt: new Date().toISOString()
    };
    saveTravelPlanToStorage(plan);
    alert('✅ Travel Plan saved successfully to your browser storage!');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
            Complete Travel Intelligence Planner
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <span>🗺️</span> Trip Cost & Itinerary Generator
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Calculate accurate trip estimates including visa fees, flights, accommodation, food, local transit, and day-by-day sightseeing.
          </p>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Your Passport</label>
            <select
              value={natIso}
              onChange={(e) => setNatIso(e.target.value)}
              className="w-full bg-slate-950 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Destination</label>
            <select
              value={destIso}
              onChange={(e) => setDestIso(e.target.value)}
              className="w-full bg-slate-950 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Duration (Days)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-slate-950 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Travelers</label>
            <input
              type="number"
              min={1}
              max={10}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full bg-slate-950 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Budget Style</label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value as any)}
              className="w-full bg-slate-950 text-white font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs capitalize"
            >
              <option value="budget">Backpacker / Budget</option>
              <option value="comfortable">Comfortable Standard</option>
              <option value="luxury">Luxury / Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cost Breakdown & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Cost Items Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>💳</span> Estimated Trip Cost Breakdown
            </h2>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-3 flex justify-between text-slate-300">
                <span>Visa Fees ({visaRule.status}):</span>
                <span className="font-mono font-bold text-white">${visaFeeTotal} USD</span>
              </div>
              <div className="py-3 flex justify-between text-slate-300">
                <span>Estimated Flights ({travelers} traveler{travelers > 1 ? 's' : ''}):</span>
                <span className="font-mono font-bold text-white">${totalFlights} USD</span>
              </div>
              <div className="py-3 flex justify-between text-slate-300">
                <span>Hotel & Lodging ({durationDays} nights):</span>
                <span className="font-mono font-bold text-white">${totalHotels} USD</span>
              </div>
              <div className="py-3 flex justify-between text-slate-300">
                <span>Food & Dining:</span>
                <span className="font-mono font-bold text-white">${totalFood} USD</span>
              </div>
              <div className="py-3 flex justify-between text-slate-300">
                <span>Local Transport & Taxis:</span>
                <span className="font-mono font-bold text-white">${totalTransport} USD</span>
              </div>
              <div className="py-3 flex justify-between text-slate-300">
                <span>Attractions & Sightseeing:</span>
                <span className="font-mono font-bold text-white">${totalAttractions} USD</span>
              </div>
              <div className="py-3 flex justify-between text-slate-300">
                <span>Emergency Cushion (10%):</span>
                <span className="font-mono font-bold text-emerald-400">${emergencyCushion} USD</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Total Estimated Trip Budget</span>
                <span className="text-2xl font-black text-emerald-400">${grandTotalUsd.toLocaleString()} USD</span>
              </div>
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition"
              >
                💾 Save Trip Plan
              </button>
            </div>
          </div>

          {/* Generated Itinerary */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🗓️</span> Day-by-Day Travel Itinerary
            </h2>

            <div className="space-y-4">
              {itinerary.map(day => (
                <div key={day.day} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Day {day.day}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Est. ${day.estimatedCostUsd} USD
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{day.title}</h3>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {day.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Checklist Reminder */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>✈️</span> Essential Pre-Departure Checklist
            </h3>
            
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-emerald-500" />
                <span>Valid passport ({visaRule.passportValidityMonthsReq} mos remaining)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-emerald-500" />
                <span>Obtain {destCountry.name} {visaRule.status}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                <input type="checkbox" className="rounded border-slate-700 text-emerald-500" />
                <span>Confirmed return flight ticket</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                <input type="checkbox" className="rounded border-slate-700 text-emerald-500" />
                <span>Hotel reservation booking</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                <input type="checkbox" className="rounded border-slate-700 text-emerald-500" />
                <span>International Travel Insurance</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                <input type="checkbox" className="rounded border-slate-700 text-emerald-500" />
                <span>Currency / Credit Cards ({destCountry.currency.code})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
