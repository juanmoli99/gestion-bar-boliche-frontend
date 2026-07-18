export interface CalculatePurchasesRequest {
  fechaDesde: string;
  fechaHasta: string;
}

export interface CalculationItem {
  itemId: string;
  nombreItem: string;
  cantidadNecesaria: number;
}

export interface CalculationReservation {
  reservaId: string;
  nombreCliente: string;
  fechaHora: string;
  cantidadPersonas: number;
  formula: string;
  numeroVersion: number;
  items: CalculationItem[];
}

export interface CalculationDate {
  fecha: string;
  cantidadPersonas: number;
  cantidadFiestas: number;
  items: CalculationItem[];
}

export interface CalculationResult {
  fechaDesde: string;
  fechaHasta: string;
  cantidadPersonasTotal: number;
  cantidadFiestas: number;
  reservas: CalculationReservation[];
  desglosePorFecha: CalculationDate[];
  totalesPorItem: CalculationItem[];
}

export interface CalculationFormState {
  fechaDesde: string;
  fechaHasta: string;
}