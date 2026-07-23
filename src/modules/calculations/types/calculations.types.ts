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

export interface DinnerShoppingListItem {
  itemId: string;
  nombreItem: string;
  unidadMedida: string;
  abreviaturaUnidad: string;
  unidadesPorPack: number | null;
  cantidadNecesaria: number;
  stockDisponible: number;
  cantidadComprar: number;
  packsComprar: number | null;
}

export interface DinnerShoppingListDateItem {
  itemId: string;
  nombreItem: string;
  cantidadNecesaria: number;
}

export interface DinnerShoppingListDate {
  fecha: string;
  cantidadCenas: number;
  cantidadPersonas: number;
  items: DinnerShoppingListDateItem[];
}

export interface DinnerShoppingListResult {
  fechaDesde: string;
  fechaHasta: string;
  cantidadCenas: number;
  cantidadPersonas: number;
  itemsComprar: number;
  listaCompra: DinnerShoppingListItem[];
  desglosePorFecha: DinnerShoppingListDate[];
}

export interface CalculationFormState {
  fechaDesde: string;
  fechaHasta: string;
}