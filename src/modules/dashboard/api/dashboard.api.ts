import { api } from '../../../services/api';

import type {
  DashboardData,
} from '../types/dashboard.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function getDashboard(): Promise<DashboardData> {
  const response =
    await api.get<ApiResponse<DashboardData>>(
      '/dashboard',
    );

  return response.data.data;
}