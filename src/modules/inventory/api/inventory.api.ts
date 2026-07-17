import {
  api,
} from '../../../services/api';

import type {
  BulkInventoryCountRequest,
  BulkInventoryCountResponse,
  CreateInventoryCategoryRequest,
  CreateInventoryCategoryResponse,
  CreateInventoryItemRequest,
  CreateInventoryItemResponse,
  InventoryCategory,
  InventoryStock,
  InventoryUnit,
} from '../types/inventory.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function getInventoryStocks(): Promise<
  InventoryStock[]
> {
  const response =
    await api.get<
      ApiResponse<InventoryStock[]>
    >('/inventory/stocks');

  return response.data.data;
}

export async function getInventoryCategories(): Promise<
  InventoryCategory[]
> {
  const response =
    await api.get<
      ApiResponse<InventoryCategory[]>
    >('/inventory/categories');

  return response.data.data;
}

export async function createInventoryCategory(
  request: CreateInventoryCategoryRequest,
): Promise<CreateInventoryCategoryResponse> {
  const response =
    await api.post<
      ApiResponse<CreateInventoryCategoryResponse>
    >(
      '/inventory/categories',
      request,
    );

  return response.data.data;
}

export async function getInventoryUnits(): Promise<
  InventoryUnit[]
> {
  const response =
    await api.get<
      ApiResponse<InventoryUnit[]>
    >('/inventory/units');

  return response.data.data;
}

export async function createInventoryItem(
  request: CreateInventoryItemRequest,
): Promise<CreateInventoryItemResponse> {
  const response =
    await api.post<
      ApiResponse<CreateInventoryItemResponse>
    >(
      '/inventory/items',
      request,
    );

  return response.data.data;
}

export async function deactivateInventoryItem(
  itemId: string,
): Promise<void> {
  await api.patch(
    `/inventory/items/${itemId}/deactivate`,
  );
}

export async function bulkInventoryCount(
  request: BulkInventoryCountRequest,
): Promise<BulkInventoryCountResponse> {
  const response =
    await api.patch<
      ApiResponse<BulkInventoryCountResponse>
    >(
      '/inventory/stocks/count',
      request,
    );

  return response.data.data;
}