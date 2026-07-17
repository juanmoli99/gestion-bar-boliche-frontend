import { api } from '../../../services/api';

import type {
  UpdateValuesRequest,
  ValuesData,
} from '../types/values.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function getValues(): Promise<ValuesData> {
  const response =
    await api.get<ApiResponse<ValuesData>>(
      '/values',
    );

  return response.data.data;
}

export async function updateValues(
  request: UpdateValuesRequest,
): Promise<ValuesData> {
  const response =
    await api.patch<ApiResponse<ValuesData>>(
      '/values',
      request,
    );

  return response.data.data;
}