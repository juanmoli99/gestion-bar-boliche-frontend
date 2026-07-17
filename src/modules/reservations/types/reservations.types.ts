export type TipoReserva =
  | 'MESA'
  | 'FIESTA';

export type EstadoReserva =
  | 'PENDIENTE'
  | 'SENADA'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'FINALIZADA'
  | 'ASISTIO'
  | 'NO_ASISTIO';

export interface Reservation {
  id: string;
  tipo: TipoReserva;
  estado: EstadoReserva;
  nombreCliente: string;
  telefonoCliente: string | null;
  fechaHora: string;
  cantidadPersonas: number;
  nombreFormula: string | null;
}

export interface ListReservationsFilters {
  fechaDesde?: string;
  fechaHasta?: string;
  tipo?: TipoReserva;
  estado?: EstadoReserva;
  nombreCliente?: string;
}

export interface ReservationFormula {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  versionActiva: number;
  cantidadItems: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateReservationRequest {
  tipo: TipoReserva;
  nombreCliente: string;
  telefonoCliente?: string;
  fechaHora: string;
  cantidadPersonas: number;
  cantidadMenusSinTacc?: number;
  tipoFiesta?: string;
  formulaId?: string;
  observaciones?: string;
  precioTotal?: number;
  montoSena?: number;
}

export interface CreateReservationResponse {
  id: string;
  tipo: TipoReserva;
  estado: EstadoReserva;
  nombreCliente: string;
  telefonoCliente: string | null;
  fechaHora: string;
  cantidadPersonas: number;
  cantidadMenusSinTacc: number | null;
  tipoFiesta: string | null;
  formulaId: string | null;
  formulaVersionId: string | null;
  observaciones: string | null;
  precioTotal: string | null;
  montoSena: string | null;
  saldoPendiente: string | null;
  creadoEn: string;
}

export interface ReservationDetail {
  id: string;
  tipo: TipoReserva;
  estado: EstadoReserva;
  nombreCliente: string;
  telefonoCliente: string | null;
  fechaHora: string;
  cantidadPersonas: number;
  cantidadMenusSinTacc: number | null;
  tipoFiesta: string | null;
  observaciones: string | null;
  motivoCancelacion: string | null;
  precioTotal: string | null;
  montoSena: string | null;
  saldoPendiente: string | null;
  medioPagoSena: string | null;
  fechaSena: string | null;
  medioPagoFinal: string | null;
  fechaPagoFinal: string | null;

  formula: {
    id: string;
    nombre: string;
    versionId: string;
    numeroVersion: number;
  } | null;

  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UpdateReservationRequest {
  nombreCliente?: string;
  telefonoCliente?: string;
  fechaHora?: string;
  cantidadPersonas?: number;
  cantidadMenusSinTacc?: number;
  tipoFiesta?: string;
  formulaId?: string;
  observaciones?: string;
  precioTotal?: number;
  montoSena?: number;
}

export interface UpdateReservationResponse {
  id: string;
  tipo: TipoReserva;
  estado: EstadoReserva;
  nombreCliente: string;
  telefonoCliente: string | null;
  fechaHora: string;
  cantidadPersonas: number;
  cantidadMenusSinTacc: number | null;
  tipoFiesta: string | null;
  formulaId: string | null;
  formulaVersionId: string | null;
  observaciones: string | null;
  precioTotal: string | null;
  montoSena: string | null;
  saldoPendiente: string | null;
  actualizadoEn: string;
}

export interface ConfirmReservationResponse {
  id: string;
  estado: EstadoReserva;
  actualizadoEn: string;
}

export interface CancelReservationRequest {
  motivoCancelacion: string;
}

export interface CancelReservationResponse {
  id: string;
  estado: EstadoReserva;
  motivoCancelacion: string | null;
  actualizadoEn: string;
}