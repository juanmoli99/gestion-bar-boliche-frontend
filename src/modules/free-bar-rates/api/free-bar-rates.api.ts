import { api } from '../../../services/api';

export interface FreeBarRate {
  id: string;
  nombre: string;
  valorPersona: string;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
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