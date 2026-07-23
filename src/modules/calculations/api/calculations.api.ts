import { api } from '../../../services/api';

import type {
  CalculatePurchasesRequest,
  CalculationResult,
  DinnerShoppingListResult,
} from '../types/calculations.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function calculatePurchases(
  request: CalculatePurchasesRequest,
): Promise<CalculationResult> {
  const response =
    await api.post<
      ApiResponse<CalculationResult>
    >(
      '/purchase-calculation',
      request,
    );

  return response.data.data;
}

export async function calculateDinnerShoppingList(
  request: CalculatePurchasesRequest,
): Promise<DinnerShoppingListResult> {
  const response =
    await api.post<
      ApiResponse<DinnerShoppingListResult>
    >(
      '/purchase-calculation/dinner-shopping-list',
      request,
    );

  return response.data.data;
}