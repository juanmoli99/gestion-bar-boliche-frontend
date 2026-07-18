import {
  api,
} from '../../../services/api';

import type {
  CreateUserRequest,
  CreateUserResponse,
  User,
} from '../types/user.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function getUsers(): Promise<
  User[]
> {
  const response =
    await api.get<
      ApiResponse<User[]>
    >('/users');

  return response.data.data;
}

export async function createUser(
  request: CreateUserRequest,
): Promise<CreateUserResponse> {
  const response =
    await api.post<
      ApiResponse<CreateUserResponse>
    >(
      '/users',
      request,
    );

  return response.data.data;
}