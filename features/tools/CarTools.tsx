'use client';

import React, { useMemo, useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { calculateCarLoan, calculateFuelTripCost, type FuelEconomyUnit } from '@/lib/calculators/cars';
import { FUEL_DEFAULTS } from '@/lib/cars/data';
import Link from 'next/link';

function Disclaimer() {
  return (
    <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800 rounded-lg px-3 py-2 leading-relaxed">
      Estimate only — not a loan offer or fuel guarantee. Lender fees, compound conventions, and pump prices vary. Cross-check with your dealer worksheet and{' '}
      <Link href="/cars" className="underline font-semibold">
        Cars hub
      </Link>
      .
    </p>
  );
}

function CarLoanUI() {
  const [price, setPrice] = useState(22000);
  const [down, setDown] = useState(3000);
  const [trade, setTrade] = useState(0);
  const [rate, setRate] = useState(7.5);
  const [months, setMonths] = useState(60);
  const [taxPct, setTaxPct] = useState(7);
  const [fees, setFees] = useState(400);

  const r = useMemo(
    () =>
      calculateCarLoan({
        price,
        downPayment: down,
        tradeIn: trade,
        annualRatePct: rate,
        termMonths: months,
        salesTaxPct: taxPct,
        fees,
      }),
    [price, down, trade, rate, months, taxPct, fees]
  );

  return (
    <div className="space-y-4">
      <Disclaimer />
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">Vehicle price</label>
          <input type="number" value={price} onChange={(e) => setPrice(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Down payment</label>
          <input type="number" value={down} onChange={(e) => setDown(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Trade-in credit</label>
          <input type="number" value={trade} onChange={(e) => setTrade(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Sales tax %</label>
          <input type="number" value={taxPct} onChange={(e) => setTaxPct(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Fees (doc, title, etc.)</label>
          <input type="number" value={fees} onChange={(e) => setFees(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">APR %</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-slate-500">Term (months)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {[36, 48, 60, 72, 84].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonths(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${months === m ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}
              >
                {m} mo
              </button>
            ))}
          </div>
          <input type="number" value={months} onChange={(e) => setMonths(+e.target.value || 1)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Monthly</div>
          <div className="text-lg font-bold text-brand-600">${r.monthlyEmi.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Financed</div>
          <div className="font-bold">${r.amountFinanced.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Total interest</div>
          <div className="font-bold">${r.totalInterest.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Est. tax</div>
          <div className="font-bold">${r.taxAmount.toFixed(2)}</div>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Want to kill the loan early? Try the{' '}
        <Link href="/tools/loan-payoff-calculator" className="text-brand-600 font-semibold hover:underline">
          Loan Payoff Calculator
        </Link>
        . Rough sales tax only — refine with the{' '}
        <Link href="/tools/us-sales-tax-calculator" className="text-brand-600 font-semibold hover:underline">
          US Sales Tax
        </Link>{' '}
        tool.
      </p>
    </div>
  );
}

function FuelTripUI() {
  const [unit, setUnit] = useState<FuelEconomyUnit>('mpg');
  const [distance, setDistance] = useState(320);
  const [economy, setEconomy] = useState(FUEL_DEFAULTS.typicalMpgCombined);
  const [price, setPrice] = useState(FUEL_DEFAULTS.usGasPerGallonUsd);

  const r = useMemo(
    () => calculateFuelTripCost({ distance, economy, unit, pricePerUnit: price }),
    [distance, economy, unit, price]
  );

  const switchUnit = (next: FuelEconomyUnit) => {
    if (next === unit) return;
    if (next === 'l100km') {
      setEconomy(FUEL_DEFAULTS.typicalLPer100km);
      setPrice(FUEL_DEFAULTS.ukPetrolPerLitreGbp);
      setDistance(Math.round(distance * 1.60934));
    } else {
      setEconomy(FUEL_DEFAULTS.typicalMpgCombined);
      setPrice(FUEL_DEFAULTS.usGasPerGallonUsd);
      setDistance(Math.round(distance / 1.60934));
    }
    setUnit(next);
  };

  return (
    <div className="space-y-4">
      <Disclaimer />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => switchUnit('mpg')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${unit === 'mpg' ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}
        >
          US (MPG + gallons)
        </button>
        <button
          type="button"
          onClick={() => switchUnit('l100km')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${unit === 'l100km' ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}
        >
          Metric (L/100km)
        </button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-500">Distance ({unit === 'mpg' ? 'miles' : 'km'})</label>
          <input type="number" value={distance} onChange={(e) => setDistance(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">{unit === 'mpg' ? 'MPG (combined)' : 'L / 100 km'}</label>
          <input type="number" step="0.1" value={economy} onChange={(e) => setEconomy(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">{unit === 'mpg' ? 'Price / gallon' : 'Price / litre'}</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Fuel needed</div>
          <div className="font-bold">
            {r.fuelNeeded} {r.fuelUnitLabel}
          </div>
        </div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Trip cost</div>
          <div className="text-lg font-bold text-brand-600">{r.tripCost.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500">Per {r.distanceLabel}</div>
          <div className="font-bold">{r.costPerDistance.toFixed(3)}</div>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        EPA labels live on{' '}
        <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-semibold hover:underline">
          fueleconomy.gov
        </a>
        . More ownership math on the{' '}
        <Link href="/cars" className="text-brand-600 font-semibold hover:underline">
          Cars data hub
        </Link>
        .
      </p>
    </div>
  );
}

export function CarTools({ tool }: { tool: ToolDefinition }) {
  switch (tool.slug) {
    case 'car-loan-calculator':
      return <CarLoanUI />;
    case 'fuel-trip-cost-calculator':
      return <FuelTripUI />;
    default:
      return <div className="text-sm text-slate-500">Unknown car tool.</div>;
  }
}
