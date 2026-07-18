import {
  api,
} from '../../../services/api';

import type {
  CreateFormulaRequest,
  CreateFormulaResponse,
  FormulaDetail,
  FormulaListItem,
  UpdateFormulaRequest,
  UpdateFormulaResponse,
} from '../types/formulas.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  timestamp: string;
}

export async function getFormulas(): Promise<
  FormulaListItem[]
> {
  const response =
    await api.get<
      ApiResponse<FormulaListItem[]>
    >('/formulas');

  return response.data.data;
}

export async function getFormula(
  formulaId: string,
): Promise<FormulaDetail> {
  const response =
    await api.get<
      ApiResponse<FormulaDetail>
    >(
      `/formulas/${formulaId}`,
    );

  return response.data.data;
}

export async function createFormula(
  request: CreateFormulaRequest,
): Promise<CreateFormulaResponse> {
  const response =
    await api.post<
      ApiResponse<CreateFormulaResponse>
    >(
      '/formulas',
      request,
    );

  return response.data.data;
}

export async function updateFormula(
  formulaId: string,
  request: UpdateFormulaRequest,
): Promise<UpdateFormulaResponse> {
  const response =
    await api.patch<
      ApiResponse<UpdateFormulaResponse>
    >(
      `/formulas/${formulaId}`,
      request,
    );

  return response.data.data;
}