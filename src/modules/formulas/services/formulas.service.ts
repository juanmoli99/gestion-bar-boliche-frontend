import {
  createFormula,
  getFormula,
  getFormulas,
  updateFormula,
} from '../api/formulas.api';

import type {
  CreateFormulaRequest,
  CreateFormulaResponse,
  FormulaDetail,
  FormulaListItem,
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