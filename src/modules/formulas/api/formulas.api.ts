import {
  api,
} from '../../../services/api';

import type {
  CookingFormula,
  CreateFormulaRequest,
  CreateFormulaResponse,
  FormulaDetail,
  FormulaListItem,
  SaveCookingFormulaRequest,
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

export async function getCookingFormulas(): Promise<
  CookingFormula[]
> {
  const response =
    await api.get<
      ApiResponse<CookingFormula[]>
    >('/cooking-formulas');

  return response.data.data;
}

export async function getCookingFormula(
  formulaId: string,
): Promise<CookingFormula> {
  const response =
    await api.get<
      ApiResponse<CookingFormula>
    >(
      `/cooking-formulas/${formulaId}`,
    );

  return response.data.data;
}

export async function createCookingFormula(
  request: SaveCookingFormulaRequest,
): Promise<CookingFormula> {
  const response =
    await api.post<
      ApiResponse<CookingFormula>
    >(
      '/cooking-formulas',
      request,
    );

  return response.data.data;
}

export async function updateCookingFormula(
  formulaId: string,
  request: SaveCookingFormulaRequest,
): Promise<CookingFormula> {
  const response =
    await api.patch<
      ApiResponse<CookingFormula>
    >(
      `/cooking-formulas/${formulaId}`,
      request,
    );

  return response.data.data;
}