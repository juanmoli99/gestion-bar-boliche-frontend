export type UserRole =
  | 'ADMINISTRADOR'
  | 'OPERADOR'
  | 'BARRA'
  | 'COCINA'
  | 'LIMPIEZA';

export interface User {
  id: string;

  nombreCompleto: string;
  usuario: string;
  email: string | null;

  rol: UserRole;
  activo: boolean;

  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateUserRequest {
  nombreCompleto: string;
  usuario: string;
  email?: string;
  contrasena: string;
  rol: UserRole;
}

export interface CreateUserResponse {
  id: string;

  nombreCompleto: string;
  usuario: string;
  email: string | null;

  rol: UserRole;
  activo: boolean;

  creadoEn: string;
}