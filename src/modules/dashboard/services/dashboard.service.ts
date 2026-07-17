import {
  getDashboard,
} from '../api/dashboard.api';

import type {
  DashboardData,
  InventoryAlertGroup,
} from '../types/dashboard.types';

export async function loadDashboard(): Promise<DashboardData> {
  return getDashboard();
}

export async function getInventoryAlerts(): Promise<
  InventoryAlertGroup[]
> {
  const dashboard =
    await loadDashboard();

  return dashboard.inventoryAlerts;
}