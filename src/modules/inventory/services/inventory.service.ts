import {
  bulkInventoryCount,
  createInventoryCategory,
  createInventoryItem,
  deactivateInventoryItem,
  getInventoryCategories,
  getInventoryStocks,
  getInventoryUnits,
} from '../api/inventory.api';

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

export async function loadInventoryStocks(): Promise<
  InventoryStock[]
> {
  return getInventoryStocks();
}

export async function loadInventoryCategories(): Promise<
  InventoryCategory[]
> {
  return getInventoryCategories();
}

export async function saveInventoryCategory(
  request: CreateInventoryCategoryRequest,
): Promise<CreateInventoryCategoryResponse> {
  return createInventoryCategory(
    request,
  );
}

export async function loadInventoryUnits(): Promise<
  InventoryUnit[]
> {
  return getInventoryUnits();
}

export async function saveInventoryItem(
  request: CreateInventoryItemRequest,
): Promise<CreateInventoryItemResponse> {
  return createInventoryItem(
    request,
  );
}

export async function removeInventoryItem(
  itemId: string,
): Promise<void> {
  return deactivateInventoryItem(
    itemId,
  );
}

export async function saveBulkInventoryCount(
  request: BulkInventoryCountRequest,
): Promise<BulkInventoryCountResponse> {
  return bulkInventoryCount(
    request,
  );
}