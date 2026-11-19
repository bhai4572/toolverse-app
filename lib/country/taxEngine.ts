export interface TaxRuleVersion {
  country: string;
  countryCode: string;
  taxType: string;
  effectiveYear: string;
  lastVerifiedDate: string;
  sourceUrl: string;
  disclaimer: string;
}

export const PAKISTAN_TAX_METADATA: TaxRuleVersion = {
  country: 'Pakistan',
  countryCode: 'PK',
  taxType: 'Salaried Income Tax',
  effectiveYear: 'FY 2024-2025 / 2025-2026',
  lastVerifiedDate: '2025-07-01',
  sourceUrl: 'https://fbr.gov.pk',
  disclaimer: 'Estimate only based on standard salaried tax slabs. Final tax obligations should be confirmed with a qualified tax consultant or official FBR portal.',
};

export interface PakistanTaxResult {
  monthlySalary: number;
  annualSalary: number;
  annualTax: number;
  monthlyTax: number;
  monthlyTakeHome: number;
  effectiveTaxRate: number;
  slabApplied: string;
}

export function calculatePakistanSalaryTax(grossMonthlySalary: number): PakistanTaxResult {
  const annualSalary = grossMonthlySalary * 12;
  let annualTax = 0;
  let slabApplied = '';

  // FBR salaried slabs, Tax Year 2027 (1 Jul 2026 – 30 Jun 2027), Finance Act 2026.
  // Source: FBR Withholding Tax Rates Card 2027, s.149 / Division I, Part I, First Schedule.
  const SLABS: { upTo: number; base: number; fixed: number; rate: number; label: string }[] = [
    { upTo: 600000, base: 0, fixed: 0, rate: 0, label: 'Up to PKR 600,000 (0% Tax)' },
    { upTo: 1200000, base: 600000, fixed: 0, rate: 0.01, label: 'PKR 600,001 to 1,200,000 (1% on excess above 600k)' },
    { upTo: 2200000, base: 1200000, fixed: 6000, rate: 0.11, label: 'PKR 1,200,001 to 2,200,000 (PKR 6,000 + 11% on excess above 1.2M)' },
    { upTo: 3200000, base: 2200000, fixed: 116000, rate: 0.2, label: 'PKR 2,200,001 to 3,200,000 (PKR 116,000 + 20% on excess above 2.2M)' },
    { upTo: 4100000, base: 3200000, fixed: 316000, rate: 0.25, label: 'PKR 3,200,001 to 4,100,000 (PKR 316,000 + 25% on excess above 3.2M)' },
    { upTo: 5600000, base: 4100000, fixed: 541000, rate: 0.29, label: 'PKR 4,100,001 to 5,600,000 (PKR 541,000 + 29% on excess above 4.1M)' },
    { upTo: 7000000, base: 5600000, fixed: 976000, rate: 0.32, label: 'PKR 5,600,001 to 7,000,000 (PKR 976,000 + 32% on excess above 5.6M)' },
    { upTo: Infinity, base: 7000000, fixed: 1424000, rate: 0.35, label: 'Exceeding PKR 7,000,000 (PKR 1,424,000 + 35% on excess above 7M)' },
  ];
  const slab = SLABS.find((sl) => annualSalary <= sl.upTo) ?? SLABS[SLABS.length - 1];
  annualTax = annualSalary <= 600000 ? 0 : slab.fixed + (annualSalary - slab.base) * slab.rate;
  slabApplied = slab.label;

  const monthlyTax = annualTax / 12;
  const monthlyTakeHome = grossMonthlySalary - monthlyTax;
  const effectiveTaxRate = grossMonthlySalary > 0 ? (monthlyTax / grossMonthlySalary) * 100 : 0;

  return {
    monthlySalary: grossMonthlySalary,
    annualSalary,
    annualTax: Math.round(annualTax),
    monthlyTax: Math.round(monthlyTax),
    monthlyTakeHome: Math.round(monthlyTakeHome),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    slabApplied,
  };
}

export interface ZakatCalculationInput {
  cashInHand: number;
  bankBalances: number;
  goldValue: number;
  silverValue: number;
  businessAssets: number;
  liabilities: number;
  nisabValue: number;
}

export interface ZakatResult {
  totalAssets: number;
  netWealth: number;
  isEligibleForZakat: boolean;
  zakatPayable: number;
}

export function calculateZakat(input: ZakatCalculationInput): ZakatResult {
  const {
    cashInHand = 0,
    bankBalances = 0,
    goldValue = 0,
    silverValue = 0,
    businessAssets = 0,
    liabilities = 0,
    nisabValue = 0,
  } = input;

  const totalAssets = cashInHand + bankBalances + goldValue + silverValue + businessAssets;
  const netWealth = totalAssets - liabilities;

  const isEligibleForZakat = netWealth >= nisabValue && netWealth > 0;
  const zakatPayable = isEligibleForZakat ? netWealth * 0.025 : 0;

  return {
    totalAssets: Math.round(totalAssets),
    netWealth: Math.round(netWealth),
    isEligibleForZakat,
    zakatPayable: Math.round(zakatPayable),
  };
}
