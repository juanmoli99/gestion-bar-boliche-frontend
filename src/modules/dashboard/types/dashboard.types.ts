export type TipoInventario =
  | 'BEBIDAS'
  | 'COCINA'
  | 'LIMPIEZA'
  | 'VARIOS';

export type StockCriticality =
  | 'SIN_STOCK'
  | 'STOCK_BAJO';

export type EstadoReserva =
  | 'PENDIENTE'
  | 'SENADA'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'FINALIZADA'
  | 'ASISTIO'
  | 'NO_ASISTIO';

export interface CriticalStockItem {
  id: string;
  itemId: string;
  itemNombre: string;
  categoriaNombre: string;
  unidadMedida: string;
  abreviaturaUnidad: string;
  inventario: TipoInventario;
  cantidadActual: string;
  cantidadMinima: string;
  criticidad: StockCriticality;
  faltante: string;
}

export interface InventoryAlertGroup {
  inventario: TipoInventario;
  items: CriticalStockItem[];
}

export interface TodayReservation {
  id: string;
  estado: EstadoReserva;
  nombreCliente: string;
  telefonoCliente: string | null;
  fechaHora: string;
  cantidadPersonas: number;
}

export interface TodayEvent extends TodayReservation {
  nombreFormula: string | null;
}

export interface PendingPurchase {
  id: string;
  proveedorId: string;
  proveedor: string;
  inventario: TipoInventario;
  numeroComprobante: string | null;
  total: string;
  estado: 'BORRADOR';
  creadoEn: string;
}

export interface DashboardSummary {
  inventoryAlerts: number;
  todayReservations: number;
  todayEvents: number;
  pendingPurchases: number;
}

export interface DashboardData {
  generatedAt: string;
  summary: DashboardSummary;
  inventoryAlerts: InventoryAlertGroup[];
  todayReservations: TodayReservation[];
  todayEvents: TodayEvent[];
  pendingPurchases: PendingPurchase[];
}