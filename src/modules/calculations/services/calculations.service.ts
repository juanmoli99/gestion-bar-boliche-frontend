import {
  calculateDinnerShoppingList,
  calculatePurchases,
} from '../api/calculations.api';

import type {
  CalculatePurchasesRequest,
  CalculationResult,
  DinnerShoppingListResult,
} from '../types/calculations.types';

export async function runPurchaseCalculation(
  request: CalculatePurchasesRequest,
): Promise<CalculationResult> {
  return calculatePurchases(request);
}

export async function runDinnerShoppingListCalculation(
  request: CalculatePurchasesRequest,
): Promise<DinnerShoppingListResult> {
  return calculateDinnerShoppingList(request);
}