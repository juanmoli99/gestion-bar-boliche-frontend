export interface SalaryPosition {
  id: string;
  nombre: string;
  valorHora: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateSalaryPositionRequest {
  nombre: string;
  valorHora: number;
}

export interface UpdateSalaryPositionRequest {
  nombre?: string;
  valorHora?: number;
}