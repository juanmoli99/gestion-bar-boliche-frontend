import { api } from '../../../services/api';

export interface FreeBarRate {
  id: string;
  nombre: string;
  valorPersona: string;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateFreeBarRateRequest {
  nombre: string;
  valorPersona: number;
}

export interface UpdateFreeBarRateRequest {
  nombre?: string;
  valorPersona?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function listFreeBarRates(): Promise<
  FreeBarRate[]
> {
  const response =
    await api.get<
      ApiResponse<FreeBarRate[]>
    >('/free-bar-rates');

  return response.data.data.filter(
    (rate) => rate.activa,
  );
}

export async function createFreeBarRate(
  request: CreateFreeBarRateRequest,
): Promise<FreeBarRate> {
  const response =
    await api.post<
      ApiResponse<FreeBarRate>
    >(
      '/free-bar-rates',
      request,
    );

  return response.data.data;
}

export async function updateFreeBarRate(
  id: string,
  request: UpdateFreeBarRateRequest,
): Promise<FreeBarRate> {
  const response =
    await api.patch<
      ApiResponse<FreeBarRate>
    >(
      `/free-bar-rates/${id}`,
      request,
    );

  return response.data.data;
}

export async function deleteFreeBarRate(
  id: string,
): Promise<void> {
  await api.delete(
    `/free-bar-rates/${id}`,
  );
}