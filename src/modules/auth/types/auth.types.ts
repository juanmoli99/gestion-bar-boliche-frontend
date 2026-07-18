export type RolUsuario =
  | 'ADMINISTRADOR'
  | 'OPERADOR'
  | 'BARRA'
  | 'COCINA'
  | 'MOZO'
  | 'LIMPIEZA';

export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface UsuarioAutenticado {
  id: string;
  usuario: string;
  nombreCompleto: string;
  rol: RolUsuario;
}

export interface LoginData {
  accessToken: string;
  usuario: UsuarioAutenticado;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}