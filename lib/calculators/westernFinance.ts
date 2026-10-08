/** Lite estimators for Western markets. Not official tax advice — verify with a tax authority/accountant. */

export function tipSplit(bill: number, tipPercent: number, people: number) {
  const tip = Math.round(bill * (tipPercent / 100) * 100) / 100;
  const total = Math.round((bill + tip) * 100) / 100;
  const n = Math.max(1, Math.floor(people) || 1);
  return {
    tip,
    total,
    perPerson: Math.round((total / n) * 100) / 100,
    tipPerPerson: Math.round((tip / n) * 100) / 100,
  };
}

/** Approximate US state sales tax rates (%) — statewide averages / common rates; cities may differ. */
export const US_STATE_SALES_TAX: { code: string; name: string; rate: number }[] = [
  { code: 'AL', name: 'Alabama', rate: 4 },
  { code: 'AK', name: 'Alaska', rate: 0 },
  { code: 'AZ', name: 'Arizona', rate: 5.6 },
  { code: 'AR', name: 'Arkansas', rate: 6.5 },
  { code: 'CA', name: 'California', rate: 7.25 },
  { code: 'CO', name: 'Colorado', rate: 2.9 },
  { code: 'CT', name: 'Connecticut', rate: 6.35 },
  { code: 'DE', name: 'Delaware', rate: 0 },
  { code: 'FL', name: 'Florida', rate: 6 },
  { code: 'GA', name: 'Georgia', rate: 4 },
  { code: 'HI', name: 'Hawaii', rate: 4 },
  { code: 'ID', name: 'Idaho', rate: 6 },
  { code: 'IL', name: 'Illinois', rate: 6.25 },
  { code: 'IN', name: 'Indiana', rate: 7 },
  { code: 'IA', name: 'Iowa', rate: 6 },
  { code: 'KS', name: 'Kansas', rate: 6.5 },
  { code: 'KY', name: 'Kentucky', rate: 6 },
  { code: 'LA', name: 'Louisiana', rate: 4.45 },
  { code: 'ME', name: 'Maine', rate: 5.5 },
  { code: 'MD', name: 'Maryland', rate: 6 },
  { code: 'MA', name: 'Massachusetts', rate: 6.25 },
  { code: 'MI', name: 'Michigan', rate: 6 },
  { code: 'MN', name: 'Minnesota', rate: 6.875 },
  { code: 'MS', name: 'Mississippi', rate: 7 },
  { code: 'MO', name: 'Missouri', rate: 4.225 },
  { code: 'MT', name: 'Montana', rate: 0 },
  { code: 'NE', name: 'Nebraska', rate: 5.5 },
  { code: 'NV', name: 'Nevada', rate: 6.85 },
  { code: 'NH', name: 'New Hampshire', rate: 0 },
  { code: 'NJ', name: 'New Jersey', rate: 6.625 },
  { code: 'NM', name: 'New Mexico', rate: 5.125 },
  { code: 'NY', name: 'New York', rate: 4 },
  { code: 'NC', name: 'North Carolina', rate: 4.75 },
  { code: 'ND', name: 'North Dakota', rate: 5 },
  { code: 'OH', name: 'Ohio', rate: 5.75 },
  { code: 'OK', name: 'Oklahoma', rate: 4.5 },
  { code: 'OR', name: 'Oregon', rate: 0 },
  { code: 'PA', name: 'Pennsylvania', rate: 6 },
  { code: 'RI', name: 'Rhode Island', rate: 7 },
  { code: 'SC', name: 'South Carolina', rate: 6 },
  { code: 'SD', name: 'South Dakota', rate: 4.5 },
  { code: 'TN', name: 'Tennessee', rate: 7 },
  { code: 'TX', name: 'Texas', rate: 6.25 },
  { code: 'UT', name: 'Utah', rate: 4.85 },
  { code: 'VT', name: 'Vermont', rate: 6 },
  { code: 'VA', name: 'Virginia', rate: 5.3 },
  { code: 'WA', name: 'Washington', rate: 6.5 },
  { code: 'WV', name: 'West Virginia', rate: 6 },
  { code: 'WI', name: 'Wisconsin', rate: 5 },
  { code: 'WY', name: 'Wyoming', rate: 4 },
  { code: 'DC', name: 'Washington DC', rate: 6 },
];

export function salesTax(amount: number, ratePercent: number, mode: 'add' | 'remove') {
  const r = ratePercent / 100;
  if (mode === 'add') {
    const tax = Math.round(amount * r * 100) / 100;
    return { base: amount, tax, total: Math.round((amount + tax) * 100) / 100 };
  }
  const base = Math.round((amount / (1 + r)) * 100) / 100;
  return { base, tax: Math.round((amount - base) * 100) / 100, total: amount };
}

function progressiveTax(income: number, brackets: { upTo: number; rate: number }[]): number {
  let remaining = income;
  let prev = 0;
  let tax = 0;
  for (const b of brackets) {
    const slice = Math.min(remaining, b.upTo - prev);
    if (slice <= 0) break;
    tax += slice * b.rate;
    remaining -= slice;
    prev = b.upTo;
    if (remaining <= 0) break;
  }
  return Math.round(tax * 100) / 100;
}

/** US federal income tax lite (2025 single filing-style bands) + FICA employee share. Optional state %. */
export function estimateUsPaycheck(grossAnnual: number, stateRatePercent = 0) {
  const brackets = [
    { upTo: 11925, rate: 0.1 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ];
  const standardDeduction = 15000;
  const taxable = Math.max(0, grossAnnual - standardDeduction);
  const federal = progressiveTax(taxable, brackets);
  const ssWageBase = 176100;
  const socialSecurity = Math.round(Math.min(grossAnnual, ssWageBase) * 0.062 * 100) / 100;
  const medicare = Math.round(grossAnnual * 0.0145 * 100) / 100;
  const state = Math.round(grossAnnual * (stateRatePercent / 100) * 100) / 100;
  const totalTax = Math.round((federal + socialSecurity + medicare + state) * 100) / 100;
  const netAnnual = Math.round((grossAnnual - totalTax) * 100) / 100;
  return {
    federal,
    socialSecurity,
    medicare,
    state,
    totalTax,
    netAnnual,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
    netBiweekly: Math.round((netAnnual / 26) * 100) / 100,
  };
}

/** UK income tax + employee NI Class 1 lite (England/NI/Wales-style bands). Scotland differs. */
export function estimateUkTakeHome(grossAnnual: number) {
  const personalAllowance = grossAnnual > 125140 ? 0 : Math.max(0, 12570 - Math.max(0, (grossAnnual - 100000) / 2));
  const taxable = Math.max(0, grossAnnual - personalAllowance);
  const basic = Math.min(taxable, 37700);
  const higher = Math.min(Math.max(0, taxable - 37700), 125140 - 12570 - 37700);
  const additional = Math.max(0, taxable - (37700 + higher));
  const incomeTax =
    Math.round((basic * 0.2 + higher * 0.4 + additional * 0.45) * 100) / 100;
  // NI: 8% between PT and UEL, 2% above (2025/26-style lite)
  const pt = 12570;
  const uel = 50270;
  const niBand = Math.max(0, Math.min(grossAnnual, uel) - pt);
  const niUpper = Math.max(0, grossAnnual - uel);
  const ni = Math.round((niBand * 0.08 + niUpper * 0.02) * 100) / 100;
  const totalDeduct = Math.round((incomeTax + ni) * 100) / 100;
  const netAnnual = Math.round((grossAnnual - totalDeduct) * 100) / 100;
  return {
    personalAllowance,
    incomeTax,
    nationalInsurance: ni,
    totalDeduct,
    netAnnual,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
  };
}

/** Canada federal tax lite + CPP/EI employee; optional province rate %. */
export function estimateCanadaPaycheque(grossAnnual: number, provinceRatePercent = 5.05) {
  const brackets = [
    { upTo: 57375, rate: 0.15 },
    { upTo: 114750, rate: 0.205 },
    { upTo: 177882, rate: 0.26 },
    { upTo: 253414, rate: 0.29 },
    { upTo: Infinity, rate: 0.33 },
  ];
  const federal = progressiveTax(grossAnnual, brackets);
  const cppMax = 68500;
  const cpp = Math.round(Math.min(Math.max(0, grossAnnual - 3500), cppMax - 3500) * 0.0595 * 100) / 100;
  const eiMax = 65700;
  const ei = Math.round(Math.min(grossAnnual, eiMax) * 0.0166 * 100) / 100;
  const provincial = Math.round(grossAnnual * (provinceRatePercent / 100) * 100) / 100;
  const totalTax = Math.round((federal + cpp + ei + provincial) * 100) / 100;
  const netAnnual = Math.round((grossAnnual - totalTax) * 100) / 100;
  return {
    federal,
    cpp,
    ei,
    provincial,
    totalTax,
    netAnnual,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
  };
}

/** Australia resident PAYG lite + Medicare levy 2%. */
export function estimateAustraliaPay(grossAnnual: number) {
  const brackets = [
    { upTo: 18200, rate: 0 },
    { upTo: 45000, rate: 0.16 },
    { upTo: 135000, rate: 0.3 },
    { upTo: 190000, rate: 0.37 },
    { upTo: Infinity, rate: 0.45 },
  ];
  const incomeTax = progressiveTax(grossAnnual, brackets);
  const medicare = Math.round(grossAnnual * 0.02 * 100) / 100;
  const totalTax = Math.round((incomeTax + medicare) * 100) / 100;
  const netAnnual = Math.round((grossAnnual - totalTax) * 100) / 100;
  return {
    incomeTax,
    medicare,
    totalTax,
    netAnnual,
    netFortnightly: Math.round((netAnnual / 26) * 100) / 100,
    netMonthly: Math.round((netAnnual / 12) * 100) / 100,
  };
}

export const VAT_GST_PRESETS: { id: string; label: string; rate: number }[] = [
  { id: 'uk-20', label: 'UK VAT 20%', rate: 20 },
  { id: 'uk-5', label: 'UK reduced 5%', rate: 5 },
  { id: 'uk-0', label: 'UK zero-rated 0%', rate: 0 },
  { id: 'au-10', label: 'Australia GST 10%', rate: 10 },
  { id: 'ca-gst5', label: 'Canada GST 5%', rate: 5 },
  { id: 'ca-hst13', label: 'Canada HST 13% (ON)', rate: 13 },
  { id: 'ca-hst15', label: 'Canada HST 15% (NS/NL/PE)', rate: 15 },
  { id: 'de-19', label: 'Germany VAT 19%', rate: 19 },
  { id: 'fr-20', label: 'France TVA 20%', rate: 20 },
  { id: 'nl-21', label: 'Netherlands BTW 21%', rate: 21 },
  { id: 'es-21', label: 'Spain IVA 21%', rate: 21 },
  { id: 'it-22', label: 'Italy IVA 22%', rate: 22 },
  { id: 'ie-23', label: 'Ireland VAT 23%', rate: 23 },
  { id: 'se-25', label: 'Sweden moms 25%', rate: 25 },
  { id: 'ae-5', label: 'UAE VAT 5%', rate: 5 },
  { id: 'in-18', label: 'India GST 18%', rate: 18 },
  { id: 'pk-18', label: 'Pakistan GST 18%', rate: 18 },
  { id: 'custom', label: 'Custom rate', rate: -1 },
];

export const CA_PROVINCE_GST: { id: string; label: string; rate: number }[] = [
  { id: 'ab', label: 'Alberta (GST 5%)', rate: 5 },
  { id: 'bc', label: 'BC (GST+PST ~12%)', rate: 12 },
  { id: 'on', label: 'Ontario HST 13%', rate: 13 },
  { id: 'qc', label: 'Quebec GST+QST ~14.975%', rate: 14.975 },
  { id: 'ns', label: 'Nova Scotia HST 15%', rate: 15 },
  { id: 'mb', label: 'Manitoba GST+PST ~12%', rate: 12 },
];
