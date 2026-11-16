import { PaymentMethod } from './types';
import { PAYMENT_METHODS_PART1 } from './methodsCatalogPart1';
import { PAYMENT_METHODS_PART2 } from './methodsCatalogPart2';

export const PAYMENT_METHODS: PaymentMethod[] = [
  ...PAYMENT_METHODS_PART1,
  ...PAYMENT_METHODS_PART2,
];

