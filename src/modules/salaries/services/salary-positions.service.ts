import {
  createSalaryPosition,
  deleteSalaryPosition,
  getSalaryPositions,
  updateSalaryPosition,
} from '../api/salary-positions.api';

import type {
  CreateSalaryPositionRequest,
  SalaryPosition,
  UpdateSalaryPositionRequest,
} from '../types/salary-position.types';

export async function loadSalaryPositions(): Promise<SalaryPosition[]> {
  return getSalaryPositions();
}

export async function saveSalaryPosition(
  request: CreateSalaryPositionRequest,
): Promise<SalaryPosition> {
  return createSalaryPosition(request);
}

export async function editSalaryPosition(
  id: string,
  request: UpdateSalaryPositionRequest,
): Promise<SalaryPosition> {
  return updateSalaryPosition(id, request);
}

export async function removeSalaryPosition(id: string): Promise<void> {
  return deleteSalaryPosition(id);
}