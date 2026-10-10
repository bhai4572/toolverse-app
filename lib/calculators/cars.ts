import { calculateEmi, type EmiResult } from './engine';

export interface CarLoanInput {
  price: number;
  downPayment: number;
  tradeIn: number;
  annualRatePct: number;
  termMonths: number;
  salesTaxPct?: number;
  fees?: number;
}

export interface CarLoanResult extends EmiResult {
  amountFinanced: number;
  taxableAmount: number;
  taxAmount: number;
  cashDueAtSigning: number;
}

/** Car loan payment from price, down, trade-in, optional tax/fees. */
export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const price = Math.max(0, input.price);
  const down = Math.max(0, input.downPayment);
  const trade = Math.max(0, input.tradeIn);
  const fees = Math.max(0, input.fees ?? 0);
  const taxPct = Math.max(0, input.salesTaxPct ?? 0);
  const taxableAmount = Math.max(0, price - trade);
  const taxAmount = Math.round(taxableAmount * (taxPct / 100) * 100) / 100;
  const amountFinanced = Math.max(0, price + taxAmount + fees - down - trade);
  const term = Math.max(1, Math.round(input.termMonths));
  const emi = calculateEmi(amountFinanced, Math.max(0, input.annualRatePct), term);
  return {
    ...emi,
    amountFinanced: Math.round(amountFinanced * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    taxAmount,
    cashDueAtSigning: Math.round((down + taxAmount + fees) * 100) / 100,
  };
}

export type FuelEconomyUnit = 'mpg' | 'l100km';

export interface FuelTripInput {
  distance: number;
  economy: number;
  unit: FuelEconomyUnit;
  pricePerUnit: number;
  /** For mpg: price is per gallon. For l100km: price is per litre. */
}

export interface FuelTripResult {
  fuelNeeded: number;
  fuelUnitLabel: string;
  tripCost: number;
  costPerDistance: number;
  distanceLabel: string;
}

export function calculateFuelTripCost(input: FuelTripInput): FuelTripResult {
  const distance = Math.max(0, input.distance);
  const economy = Math.max(0.01, input.economy);
  const price = Math.max(0, input.pricePerUnit);

  if (input.unit === 'mpg') {
    const gallons = distance / economy;
    const tripCost = gallons * price;
    return {
      fuelNeeded: Math.round(gallons * 100) / 100,
      fuelUnitLabel: 'gallons',
      tripCost: Math.round(tripCost * 100) / 100,
      costPerDistance: distance > 0 ? Math.round((tripCost / distance) * 1000) / 1000 : 0,
      distanceLabel: 'mile',
    };
  }

  const litres = (economy / 100) * distance;
  const tripCost = litres * price;
  return {
    fuelNeeded: Math.round(litres * 100) / 100,
    fuelUnitLabel: 'litres',
    tripCost: Math.round(tripCost * 100) / 100,
    costPerDistance: distance > 0 ? Math.round((tripCost / distance) * 1000) / 1000 : 0,
    distanceLabel: 'km',
  };
}

/** Rough annual energy cost comparison for planning tables. */
export function annualFuelCostMpg(milesPerYear: number, mpg: number, pricePerGallon: number): number {
  if (mpg <= 0) return 0;
  return Math.round(((milesPerYear / mpg) * pricePerGallon) * 100) / 100;
}

export function annualEvEnergyCost(
  milesPerYear: number,
  kwhPer100Miles: number,
  pricePerKwh: number
): number {
  const kwh = (kwhPer100Miles / 100) * milesPerYear;
  return Math.round(kwh * pricePerKwh * 100) / 100;
}
