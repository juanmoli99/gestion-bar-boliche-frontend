import { api } from '../../../services/api';

import type {
  CalculatePurchasesRequest,
  CalculationResult,
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