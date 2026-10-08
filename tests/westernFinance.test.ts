import { describe, it, expect } from 'vitest';
import {
  tipSplit,
  salesTax,
  estimateUsPaycheck,
  estimateUkTakeHome,
  estimateCanadaPaycheque,
  estimateAustraliaPay,
} from '../lib/calculators/westernFinance';
import { calculateVatGst } from '../lib/calculators/engine';

describe('western finance lite estimators', () => {
  it('splits tip and bill', () => {
    const r = tipSplit(100, 20, 2);
    expect(r.tip).toBe(20);
    expect(r.total).toBe(120);
    expect(r.perPerson).toBe(60);
  });

  it('adds and removes sales tax', () => {
    const add = salesTax(100, 10, 'add');
    expect(add.tax).toBe(10);
    expect(add.total).toBe(110);
    const rem = salesTax(110, 10, 'remove');
    expect(rem.base).toBe(100);
  });

  it('estimates US/UK/CA/AU net pay as positive and below gross', () => {
    const us = estimateUsPaycheck(80000, 5);
    expect(us.netAnnual).toBeGreaterThan(0);
    expect(us.netAnnual).toBeLessThan(80000);
    const uk = estimateUkTakeHome(45000);
    expect(uk.netAnnual).toBeLessThan(45000);
    const ca = estimateCanadaPaycheque(70000, 5);
    expect(ca.netAnnual).toBeLessThan(70000);
    const au = estimateAustraliaPay(90000);
    expect(au.netAnnual).toBeLessThan(90000);
  });

  it('vat engine still works for presets', () => {
    const r = calculateVatGst(100, 20, 'add');
    expect(r.taxAmount).toBe(20);
    expect(r.totalAmount).toBe(120);
  });
});
