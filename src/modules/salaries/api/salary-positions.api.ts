import { api } from '../../../services/api';
import type {
  CreateSalaryPositionRequest,
  SalaryPosition,
  UpdateSalaryPositionRequest,
} from '../types/salary-position.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function getSalaryPositions(): Promise<SalaryPosition[]> {
  const response = await api.get<ApiResponse<SalaryPosition[]>>(
    '/salary-positions',
  );

  return response.data.data;
}

export async function createSalaryPosition(
  request: CreateSalaryPositionRequest,
): Promise<SalaryPosition> {
  const response = await api.post<ApiResponse<SalaryPosition>>(
    '/salary-positions',
    request,
  );

  return response.data.data;
}

export async function updateSalaryPosition(
  id: string,
  request: UpdateSalaryPositionRequest,
): Promise<SalaryPosition> {
  const response = await api.patch<ApiResponse<SalaryPosition>>(
    `/salary-positions/${id}`,
    request,
  );

  return response.data.data;
}

export async function deleteSalaryPosition(id: string): Promise<void> {
  await api.delete(`/salary-positions/${id}`);
}