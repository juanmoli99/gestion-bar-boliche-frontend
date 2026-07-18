import {
  calculatePurchases,
} from '../api/calculations.api';

import type {
  CalculatePurchasesRequest,
  CalculationResult,
} from '../types/calculations.types';

export async function runPurchaseCalculation(
  request: CalculatePurchasesRequest,
): Promise<CalculationResult> {
  return calculatePurchases(request);
}