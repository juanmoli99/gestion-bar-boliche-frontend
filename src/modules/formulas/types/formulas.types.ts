export interface FormulaListItem {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  versionActiva: number;
  cantidadItems: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface FormulaItem {
  id: string;
  itemId: string;
  nombre: string;
  cantidadPorPersona: string;
}

export interface FormulaDetail {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  versionId: string;
  numeroVersion: number;
  items: FormulaItem[];
}

export interface FormulaFormItem {
  itemId: string;
  cantidadPorPersona: number;
}

export interface CreateFormulaRequest {
  nombre: string;
  descripcion?: string;
  items: FormulaFormItem[];
}

export interface FormulaSavedItem {
  id: string;
  itemId: string;
  nombreItem: string;
  unidadMedida: string;
  abreviaturaUnidad: string;
  cantidadPorPersona: number;
}

export interface CreateFormulaResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  versionId: string;
  numeroVersion: number;
  items: FormulaSavedItem[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface UpdateFormulaRequest {
  nombre: string;
  descripcion?: string;
  items: FormulaFormItem[];
}

export interface UpdateFormulaResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  versionId: string;
  numeroVersion: number;
  items: FormulaSavedItem[];
  actualizadoEn: string;
}