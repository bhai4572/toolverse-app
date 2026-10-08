import React, { useState } from 'react';
import { 
  getAllCountries, 
  getCountryByCodeOrName 
} from '@/lib/travel/countryRegistry';
import { 
  getJobOpportunities, 
  getCostOfLiving 
} from '@/lib/travel/jobTravelEngine';

export default function JobsTravelPage() {
  const [destIso, setDestIso] = useState<string>('DE');
  const [userSalary, setUserSalary] = useState<number>(4500);

  const allCountries = getAllCountries();
  const country = getCountryByCodeOrName(destIso) || allCountries[0];
  const jobs = getJobOpportunities(country.iso2);
  const costInfo = getCostOfLiving(country.iso2);

  const estimatedTax = Math.round(userSalary * 0.25);
  const netIncome = userSalary - estimatedTax;
  const rentCost = costInfo.rentApartment1BedCenterUsd;
  const livingCost = costInfo.groceriesMonthlyUsd + costInfo.transitMonthlyUsd + costInfo.utilitiesMonthlyUsd;
  const totalExpenses = rentCost + livingCost;
  const netSavings = netIncome - totalExpenses;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
              Work Travel & Job Sponsorship Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <span>💼</span> Work & Jobs in {country.name}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Explore eligible work visa pathways, verified employer visa sponsorship opportunities, and calculate real monthly net income vs living costs.
            </p>
          </div>

          {/* Country Selector */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 min-w-[260px]">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Work Country</label>
            <select
              value={destIso}
              onChange={(e) => setDestIso(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 font-bold px-3 py-2 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {allCountries.map(c => (
                <option key={c.iso2} value={c.iso2}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Salary vs Rent Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧮</span> Monthly Salary vs Cost of Living Calculator
          </h2>
          <p className="text-xs text-slate-400">Estimate net earnings after taxes, monthly rent, and essential living expenses in {costInfo.cityName}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Gross Monthly Salary (USD)</label>
              <input
                type="number"
                value={userSalary}
                onChange={(e) => setUserSalary(Number(e.target.value))}
                className="w-full bg-slate-950 text-white font-bold text-lg px-4 py-2.5 rounded-xl border border-slate-700 focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Gross Monthly Income:</span>
                <span className="text-white font-bold">${userSalary} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (≈25%):</span>
                <span className="text-rose-400 font-mono">-${estimatedTax} USD</span>
              </div>
              <div className="flex justify-between text-slate-300 font-bold pt-1 border-t border-slate-800">
                <span>Net Monthly Take-Home:</span>
                <span className="text-emerald-400 font-mono">${netIncome} USD</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-200">City Expenses breakdown ({costInfo.cityName})</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>1-Bed Apartment Rent (City Center):</span>
                <span className="text-amber-400 font-mono">${rentCost} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly Groceries:</span>
                <span className="text-amber-400 font-mono">${costInfo.groceriesMonthlyUsd} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Public Transit Pass:</span>
                <span className="text-amber-400 font-mono">${costInfo.transitMonthlyUsd} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Utilities & Internet:</span>
                <span className="text-amber-400 font-mono">${costInfo.utilitiesMonthlyUsd} USD</span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Total Expenses:</span>
                  <span className="text-rose-400 font-mono">${totalExpenses} USD</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800">
                  <span className="text-white">Estimated Monthly Savings:</span>
                  <span className={netSavings >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-500 font-mono'}>
                    ${netSavings} USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Job Listings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>💼</span> Verified Job Opportunities with Visa Sponsorship ({jobs.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                    {job.employmentType}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{job.title}</h3>
                  <p className="text-xs text-slate-400">{job.employer} • {job.city}</p>
                </div>
                {job.visaSponsorshipConfirmed && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-bold">
                    ✓ Visa Sponsorship
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Salary Range:</span>
                  <span className="text-emerald-400 font-bold">${job.salaryMinUsd.toLocaleString()} - ${job.salaryMaxUsd.toLocaleString()} USD / yr</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Posted Date:</span>
                  <span className="text-slate-300">{job.postedDate}</span>
                </div>
              </div>

              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-cyan-600/20"
              >
                Apply for Position ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
