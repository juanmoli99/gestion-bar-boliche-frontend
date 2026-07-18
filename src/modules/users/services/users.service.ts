import {
  createUser,
  getUsers,
} from '../api/users.api';

import type {
  CreateUserRequest,
  CreateUserResponse,
  User,
} from '../types/user.types';

export async function loadUsers(): Promise<User[]> {
  return getUsers();
}

export async function saveUser(
  request: CreateUserRequest,
): Promise<CreateUserResponse> {
  return createUser(request);
}