import {
  createCookingFormula,
  createFormula,
  getCookingFormula,
  getCookingFormulas,
  getFormula,
  getFormulas,
  updateCookingFormula,
  updateFormula,
} from '../api/formulas.api';

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

export async function loadFormulas(): Promise<
  FormulaListItem[]
> {
  return getFormulas();
}

export async function loadFormula(
  formulaId: string,
): Promise<FormulaDetail> {
  return getFormula(formulaId);
}

export async function saveFormula(
  request: CreateFormulaRequest,
): Promise<CreateFormulaResponse> {
  return createFormula(request);
}

export async function saveFormulaChanges(
  formulaId: string,
  request: UpdateFormulaRequest,
): Promise<UpdateFormulaResponse> {
  return updateFormula(
    formulaId,
    request,
  );
}

export async function loadCookingFormulas(): Promise<
  CookingFormula[]
> {
  return getCookingFormulas();
}

export async function loadCookingFormula(
  formulaId: string,
): Promise<CookingFormula> {
  return getCookingFormula(
    formulaId,
  );
}

export async function saveCookingFormula(
  request: SaveCookingFormulaRequest,
): Promise<CookingFormula> {
  return createCookingFormula(
    request,
  );
}

export async function saveCookingFormulaChanges(
  formulaId: string,
  request: SaveCookingFormulaRequest,
): Promise<CookingFormula> {
  return updateCookingFormula(
    formulaId,
    request,
  );
}