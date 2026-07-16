import { api } from '../../../services/api';

import type {
  ApiResponse,
  LoginData,
  LoginRequest,
} from '../types/auth.types';

export async function login(
  request: LoginRequest,
): Promise<LoginData> {
  const response =
    await api.post<ApiResponse<LoginData>>(
      '/auth/login',
      request,
    );

  return response.data.data;
}