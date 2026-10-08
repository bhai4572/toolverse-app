'use client';

import React, { useMemo, useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import {
  tipSplit,
  US_STATE_SALES_TAX,
  salesTax,
  estimateUsPaycheck,
  estimateUkTakeHome,
  estimateCanadaPaycheque,
  estimateAustraliaPay,
} from '@/lib/calculators/westernFinance';

function Disclaimer({ region }: { region: string }) {
  return (
    <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800 rounded-lg px-3 py-2 leading-relaxed">
      Lite {region} estimator for planning only — <strong>not official tax advice</strong>. Bands, NI/FICA/CPP, and local rules change;
      confirm with IRS / HMRC / CRA / ATO or a licensed adviser before making decisions.
    </p>
  );
}

function TipUI() {
  const [bill, setBill] = useState(86.5);
  const [pct, setPct] = useState(18);
  const [people, setPeople] = useState(2);
  const r = tipSplit(bill, pct, people);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[15, 18, 20, 25].map((p) => (
          <button key={p} type="button" onClick={() => setPct(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${pct === p ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 dark:border-slate-700'}`}>
            {p}%
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="text-xs text-slate-500">Bill amount</label><input type="number" value={bill} onChange={(e) => setBill(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Tip %</label><input type="number" value={pct} onChange={(e) => setPct(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">Split between</label><input type="number" min={1} value={people} onChange={(e) => setPeople(+e.target.value || 1)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Tip</div><div className="font-bold text-brand-600">${r.tip.toFixed(2)}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Total</div><div className="font-bold text-brand-600">${r.total.toFixed(2)}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Per person</div><div className="font-bold">${r.perPerson.toFixed(2)}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Tip / person</div><div className="font-bold">${r.tipPerPerson.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function UsSalesTaxUI() {
  const [amount, setAmount] = useState(100);
  const [state, setState] = useState('CA');
  const [custom, setCustom] = useState('');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const tableRate = US_STATE_SALES_TAX.find((s) => s.code === state)?.rate ?? 0;
  const rate = custom !== '' ? parseFloat(custom) || 0 : tableRate;
  const r = salesTax(amount, rate, mode);
  return (
    <div className="space-y-4">
      <Disclaimer region="US sales tax" />
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-slate-500">Amount</label><input type="number" value={amount} onChange={(e) => setAmount(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div>
          <label className="text-xs text-slate-500">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'add' | 'remove')} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white">
            <option value="add">Add sales tax</option>
            <option value="remove">Remove sales tax</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">State (lite statewide rate)</label>
          <select value={state} onChange={(e) => { setState(e.target.value); setCustom(''); }} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white">
            {US_STATE_SALES_TAX.map((s) => (
              <option key={s.code} value={s.code}>{s.name} ({s.rate}%)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Override rate % (city/local)</label>
          <input type="number" placeholder={`Default ${tableRate}`} value={custom} onChange={(e) => setCustom(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
        </div>
      </div>
      <p className="text-xs text-slate-500">Using <strong>{rate}%</strong> — local districts often add more; verify before checkout.</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Base</div><div className="font-bold">${r.base.toFixed(2)}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Tax</div><div className="font-bold text-brand-600">${r.tax.toFixed(2)}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Total</div><div className="font-bold text-brand-600">${r.total.toFixed(2)}</div></div>
      </div>
    </div>
  );
}

function UsPayUI() {
  const [gross, setGross] = useState(75000);
  const [stateRate, setStateRate] = useState(5);
  const r = useMemo(() => estimateUsPaycheck(gross, stateRate), [gross, stateRate]);
  return (
    <div className="space-y-4">
      <Disclaimer region="US paycheck" />
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-slate-500">Gross annual salary (USD)</label><input type="number" value={gross} onChange={(e) => setGross(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div><label className="text-xs text-slate-500">State income tax % (approx)</label><input type="number" value={stateRate} onChange={(e) => setStateRate(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Federal</div><div className="font-bold">${r.federal.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Social Security</div><div className="font-bold">${r.socialSecurity.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Medicare</div><div className="font-bold">${r.medicare.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">State (est.)</div><div className="font-bold">${r.state.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / year</div><div className="font-bold text-brand-600">${r.netAnnual.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / month</div><div className="font-bold text-brand-600">${r.netMonthly.toLocaleString()}</div></div>
      </div>
    </div>
  );
}

function UkPayUI() {
  const [gross, setGross] = useState(45000);
  const r = useMemo(() => estimateUkTakeHome(gross), [gross]);
  return (
    <div className="space-y-4">
      <Disclaimer region="UK take-home" />
      <div><label className="text-xs text-slate-500">Gross annual salary (£)</label><input type="number" value={gross} onChange={(e) => setGross(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white max-w-sm" /></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Personal allowance</div><div className="font-bold">£{r.personalAllowance.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Income tax</div><div className="font-bold">£{r.incomeTax.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">NI (employee)</div><div className="font-bold">£{r.nationalInsurance.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg sm:col-span-2"><div className="text-[10px] text-slate-500">Net / year</div><div className="font-bold text-brand-600">£{r.netAnnual.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / month</div><div className="font-bold text-brand-600">£{r.netMonthly.toLocaleString()}</div></div>
      </div>
      <p className="text-[11px] text-slate-500">England/NI/Wales-style bands; Scotland uses different rates. Student loan plans not included.</p>
    </div>
  );
}

function CaPayUI() {
  const [gross, setGross] = useState(70000);
  const [prov, setProv] = useState(5.05);
  const r = useMemo(() => estimateCanadaPaycheque(gross, prov), [gross, prov]);
  return (
    <div className="space-y-4">
      <Disclaimer region="Canada paycheque" />
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-slate-500">Gross annual (CAD)</label><input type="number" value={gross} onChange={(e) => setGross(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" /></div>
        <div>
          <label className="text-xs text-slate-500">Province rate shortcut</label>
          <select value={prov} onChange={(e) => setProv(+e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white">
            <option value={5.05}>Ontario-ish ~5.05%</option>
            <option value={5.06}>BC approx ~5.06%</option>
            <option value={10}>Alberta flat-ish ~10%</option>
            <option value={14}>Quebec higher ~14%</option>
            <option value={0}>Federal + CPP/EI only</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Federal</div><div className="font-bold">${r.federal.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">CPP</div><div className="font-bold">${r.cpp.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">EI</div><div className="font-bold">${r.ei.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Provincial (est.)</div><div className="font-bold">${r.provincial.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / year</div><div className="font-bold text-brand-600">${r.netAnnual.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / month</div><div className="font-bold text-brand-600">${r.netMonthly.toLocaleString()}</div></div>
      </div>
    </div>
  );
}

function AuPayUI() {
  const [gross, setGross] = useState(90000);
  const r = useMemo(() => estimateAustraliaPay(gross), [gross]);
  return (
    <div className="space-y-4">
      <Disclaimer region="Australia PAYG" />
      <div><label className="text-xs text-slate-500">Gross annual salary (AUD)</label><input type="number" value={gross} onChange={(e) => setGross(+e.target.value || 0)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white max-w-sm" /></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Income tax</div><div className="font-bold">${r.incomeTax.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Medicare 2%</div><div className="font-bold">${r.medicare.toLocaleString()}</div></div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Total tax</div><div className="font-bold">${r.totalTax.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / year</div><div className="font-bold text-brand-600">${r.netAnnual.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / fortnight</div><div className="font-bold text-brand-600">${r.netFortnightly.toLocaleString()}</div></div>
        <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-lg"><div className="text-[10px] text-slate-500">Net / month</div><div className="font-bold text-brand-600">${r.netMonthly.toLocaleString()}</div></div>
      </div>
      <p className="text-[11px] text-slate-500">HECS-HELP / HELP repayments not included. Resident rates only.</p>
    </div>
  );
}

export function WesternFinanceTools({ tool }: { tool: ToolDefinition }) {
  switch (tool.slug) {
    case 'tip-calculator':
      return <TipUI />;
    case 'us-sales-tax-calculator':
      return <UsSalesTaxUI />;
    case 'us-paycheck-calculator':
      return <UsPayUI />;
    case 'uk-take-home-pay-calculator':
      return <UkPayUI />;
    case 'canada-paycheque-calculator':
      return <CaPayUI />;
    case 'australia-pay-calculator':
      return <AuPayUI />;
    default:
      return <TipUI />;
  }
}
