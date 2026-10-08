'use client';

import React, { useMemo, useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import {
  calculateDiscount,
  calculateProfitMargin,
  calculateCompoundInterest,
  calculateEmi,
  calculateExactAge,
  calculateGpa,
  calculateVatGst,
  CourseGrade,
} from '@/lib/calculators/engine';
import { VAT_GST_PRESETS, CA_PROVINCE_GST } from '@/lib/calculators/westernFinance';
import { PercentageCalculatorTool } from './PercentageCalculatorTool';

function Disclaimer() {
  return (
    <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800 rounded-lg px-3 py-2">
      Estimate only — not official tax advice. Confirm rates with your tax authority or accountant before filing or invoicing.
    </p>
  );
}

function VatGstUI() {
  const [amount, setAmount] = useState(100);
  const [presetId, setPresetId] = useState('uk-20');
  const [customRate, setCustomRate] = useState(20);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [caId, setCaId] = useState('');

  const rate = useMemo(() => {
    if (caId) {
      const p = CA_PROVINCE_GST.find((x) => x.id === caId);
      if (p) return p.rate;
    }
    const preset = VAT_GST_PRESETS.find((p) => p.id === presetId);
    if (!preset || preset.rate < 0) return customRate;
    return preset.rate;
  }, [presetId, customRate, caId]);

  const result = calculateVatGst(amount, rate, mode);

  return (
    <div className="space-y-4">
      <Disclaimer />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'add' | 'remove')} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white">
            <option value="add">Add tax (net → gross)</option>
            <option value="remove">Remove tax (gross → net)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Country / region preset</label>
          <select
            value={presetId}
            onChange={(e) => { setPresetId(e.target.value); setCaId(''); }}
            className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white"
          >
            {VAT_GST_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Canada province (optional)</label>
          <select
            value={caId}
            onChange={(e) => setCaId(e.target.value)}
            className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white"
          >
            <option value="">— use preset above —</option>
            {CA_PROVINCE_GST.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        {presetId === 'custom' && !caId && (
          <div>
            <label className="text-xs text-slate-500">Custom rate %</label>
            <input type="number" value={customRate} onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">Using rate: <strong>{rate}%</strong></p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500 uppercase">Net / base</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{result.originalAmount.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500 uppercase">Tax</div>
          <div className="text-lg font-bold text-brand-600">{result.taxAmount.toFixed(2)}</div>
        </div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-500 uppercase">Gross / total</div>
          <div className="text-lg font-bold text-brand-600">{result.totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function DiscountUI() {
  const [price, setPrice] = useState(100);
  const [disc, setDisc] = useState(20);
  const [tax, setTax] = useState(0);
  const r = calculateDiscount(price, disc, tax);
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div><label className="text-xs text-slate-500">Price</label><input type="number" value={price} onChange={(e) => setPrice(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      <div><label className="text-xs text-slate-500">Discount %</label><input type="number" value={disc} onChange={(e) => setDisc(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      <div><label className="text-xs text-slate-500">Tax % (optional)</label><input type="number" value={tax} onChange={(e) => setTax(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      <div className="sm:col-span-3 grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">You save</div><div className="font-bold text-emerald-600">{r.savings.toFixed(2)}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Discount amt</div><div className="font-bold">{r.discountAmount.toFixed(2)}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Final price</div><div className="font-bold text-brand-600">{r.finalPrice.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function ProfitUI() {
  const [cost, setCost] = useState(40);
  const [price, setPrice] = useState(100);
  const r = calculateProfitMargin(cost, price);
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div><label className="text-xs text-slate-500">Cost</label><input type="number" value={cost} onChange={(e) => setCost(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      <div><label className="text-xs text-slate-500">Selling price</label><input type="number" value={price} onChange={(e) => setPrice(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      <div className="sm:col-span-2 grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Gross profit</div><div className="font-bold">{r.grossProfit.toFixed(2)}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Margin %</div><div className="font-bold text-brand-600">{r.marginPercentage}%</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Markup %</div><div className="font-bold">{r.markupPercentage}%</div></div>
      </div>
    </div>
  );
}

function CompoundUI() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(0);
  const r = calculateCompoundInterest(principal, rate, years, monthly);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-3">
        <div><label className="text-xs text-slate-500">Principal</label><input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Annual rate %</label><input type="number" value={rate} onChange={(e) => setRate(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Years</label><input type="number" value={years} onChange={(e) => setYears(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Monthly deposit</label><input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Interest earned</div><div className="font-bold text-emerald-600">{r.totalInterest.toFixed(2)}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Final balance</div><div className="font-bold text-brand-600">{r.finalBalance.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function EmiUI() {
  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(8.5);
  const [months, setMonths] = useState(60);
  const r = calculateEmi(amount, rate, months);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="text-xs text-slate-500">Loan amount</label><input type="number" value={amount} onChange={(e) => setAmount(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Annual interest %</label><input type="number" value={rate} onChange={(e) => setRate(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Tenure (months)</label><input type="number" value={months} onChange={(e) => setMonths(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Monthly EMI</div><div className="font-bold text-brand-600">{r.monthlyEmi.toFixed(2)}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Total interest</div><div className="font-bold">{r.totalInterest.toFixed(2)}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Total payment</div><div className="font-bold">{r.totalPayment.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function AgeUI() {
  const [birth, setBirth] = useState('2000-01-01');
  const r = calculateExactAge(birth);
  return (
    <div className="space-y-4">
      <div><label className="text-xs text-slate-500">Date of birth</label><input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Years</div><div className="font-bold text-brand-600">{r.years}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Months</div><div className="font-bold">{r.months}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Days</div><div className="font-bold">{r.days}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Next birthday</div><div className="font-bold">{r.nextBirthdayDays}d</div></div>
      </div>
    </div>
  );
}

function GpaUI() {
  const [rows, setRows] = useState<CourseGrade[]>([
    { courseName: 'Course A', credits: 3, gradePoint: 4 },
    { courseName: 'Course B', credits: 3, gradePoint: 3.5 },
  ]);
  const r = calculateGpa(rows);
  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <input value={row.courseName} onChange={(e) => { const n = [...rows]; n[i] = { ...row, courseName: e.target.value }; setRows(n); }} className="p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" placeholder="Course" />
          <input type="number" value={row.credits} onChange={(e) => { const n = [...rows]; n[i] = { ...row, credits: +e.target.value || 0 }; setRows(n); }} className="p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" placeholder="Credits" />
          <input type="number" step="0.1" value={row.gradePoint} onChange={(e) => { const n = [...rows]; n[i] = { ...row, gradePoint: +e.target.value || 0 }; setRows(n); }} className="p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" placeholder="Grade points" />
        </div>
      ))}
      <button type="button" className="btn-secondary text-xs" onClick={() => setRows([...rows, { courseName: '', credits: 3, gradePoint: 3 }])}>Add course</button>
      <div className="p-4 bg-brand-50 dark:bg-slate-800 rounded-lg text-center">
        <div className="text-xs text-slate-500">GPA ({r.totalCredits} credits)</div>
        <div className="text-2xl font-bold text-brand-600">{r.gpa.toFixed(2)}</div>
      </div>
    </div>
  );
}

export function CalculatorTools({ tool }: { tool: ToolDefinition }) {
  switch (tool.slug) {
    case 'vat-gst-calculator':
      return <VatGstUI />;
    case 'discount-calculator':
      return <DiscountUI />;
    case 'profit-margin-calculator':
      return <ProfitUI />;
    case 'compound-interest-calculator':
      return <CompoundUI />;
    case 'emi-calculator':
      return <EmiUI />;
    case 'age-calculator':
      return <AgeUI />;
    case 'gpa-calculator':
      return <GpaUI />;
    case 'percentage-calculator':
    default:
      return <PercentageCalculatorTool />;
  }
}
