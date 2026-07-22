import { api } from '../../../services/api';

import type {
  CookingFormula,
  CancelReservationRequest,
  CancelReservationResponse,
  ConfirmReservationResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  ListReservationsFilters,
  Reservation,
  ReservationDetail,
  ReservationFormula,
  UpdateReservationRequest,
  UpdateReservationResponse,
} from '../types/reservations.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function listReservations(
  filters: ListReservationsFilters = {},
): Promise<Reservation[]> {
  const response =
    await api.get<ApiResponse<Reservation[]>>(
      '/reservations',
      {
        params: {
          fechaDesde:
            filters.fechaDesde || undefined,
          fechaHasta:
            filters.fechaHasta || undefined,
          tipo:
            filters.tipo || undefined,
          estado:
            filters.estado || undefined,
          nombreCliente:
            filters.nombreCliente?.trim() ||
            undefined,
        },
      },
    );

  return response.data.data;
}

export async function createReservation(
  request: CreateReservationRequest,
): Promise<CreateReservationResponse> {
  const response =
    await api.post<
      ApiResponse<CreateReservationResponse>
    >(
      '/reservations',
      request,
    );

  return response.data.data;
}

export async function listFormulas(): Promise<
  ReservationFormula[]
> {
  const response =
    await api.get<
      ApiResponse<ReservationFormula[]>
    >('/formulas');

  return response.data.data.filter(
    (formula) => formula.activa,
  );
}

export async function listCookingFormulas(): Promise<
  CookingFormula[]
> {
  const response =
    await api.get<
      ApiResponse<CookingFormula[]>
    >('/cooking-formulas');

  return response.data.data.filter(
    (formula) => formula.activa,
  );
}

export async function getReservation(
  id: string,
): Promise<ReservationDetail> {
  const response =
    await api.get<
      ApiResponse<ReservationDetail>
    >(`/reservations/${id}`);

  return response.data.data;
}

export async function updateReservation(
  id: string,
  request: UpdateReservationRequest,
): Promise<UpdateReservationResponse> {
  const response =
    await api.patch<
      ApiResponse<UpdateReservationResponse>
    >(
      `/reservations/${id}`,
      request,
    );

  return response.data.data;
}

export async function confirmReservation(
  id: string,
): Promise<ConfirmReservationResponse> {
  const response =
    await api.patch<
      ApiResponse<ConfirmReservationResponse>
    >(
      `/reservations/${id}/confirm`,
    );

  return response.data.data;
}

export async function cancelReservation(
  id: string,
  request: CancelReservationRequest,
): Promise<CancelReservationResponse> {
  const response =
    await api.patch<
      ApiResponse<CancelReservationResponse>
    >(
      `/reservations/${id}/cancel`,
      request,
    );

  return response.data.data;
}