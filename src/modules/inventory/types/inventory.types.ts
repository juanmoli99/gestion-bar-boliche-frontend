export type TipoInventario =
  | 'BEBIDAS'
  | 'COCINA'
  | 'LIMPIEZA'
  | 'VARIOS';

export type TipoItem =
  | 'PRODUCTO'
  | 'INSUMO';

export interface InventoryStock {
  id: string;
  itemId: string;

  itemNombre: string;
  categoriaNombre: string;

  unidadMedida: string;
  abreviaturaUnidad: string;

  inventario: TipoInventario;

  cantidadActual: string;
  cantidadMinima: string | null;

  creadoEn: string;
  actualizadoEn: string;
}

export interface InventoryCategory {
  id: string;
  nombre: string;
  descripcion: string | null;

  inventario: TipoInventario;

  activa: boolean;

  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateInventoryCategoryRequest {
  nombre: string;
  descripcion?: string;
  inventario: TipoInventario;
}

export interface CreateInventoryCategoryResponse {
  id: string;
  nombre: string;
  descripcion: string | null;

  inventario: TipoInventario;

  activa: boolean;

  creadoEn: string;
  actualizadoEn: string;
}

export interface InventoryUnit {
  id: string;
  nombre: string;
  abreviatura: string;

  permiteDecimal: boolean;
  activa: boolean;

  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateInventoryItemRequest {
  nombre: string;
  descripcion?: string;

  inventario: TipoInventario;
  tipo: TipoItem;

  categoriaId: string;
  unidadMedidaId: string;

  unidadesPorPack?: number;

  cantidadActual?: number;
  cantidadMinima?: number;
}

export interface CreatedInventoryItemStock {
  id: string;
  itemId: string;

  inventario: TipoInventario;

  cantidadActual: string;
  cantidadMinima: string | null;

  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateInventoryItemResponse {
  id: string;
  nombre: string;
  descripcion: string | null;

  tipo: TipoItem;

  categoriaId: string;
  unidadMedidaId: string;

  unidadesPorPack: number | null;

  activo: boolean;

  creadoEn: string;
  actualizadoEn: string;

  stock: CreatedInventoryItemStock;
}

export interface BulkInventoryCountItemRequest {
  stockId: string;
  cantidadContada: number;
}

export interface BulkInventoryCountRequest {
  items: BulkInventoryCountItemRequest[];
}

export interface BulkInventoryCountItemResponse {
  stockId: string;
  itemId: string;

  cantidadAnterior: number;
  cantidadContada: number;
  diferencia: number;
  cantidadActual: number;

  actualizado: boolean;
}

export interface BulkInventoryCountResponse {
  totalItems: number;
  itemsActualizados: number;
  movimientosCreados: number;

  items: BulkInventoryCountItemResponse[];
}