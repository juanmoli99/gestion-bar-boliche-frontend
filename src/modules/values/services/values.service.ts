import {
  getValues,
  updateValues,
} from '../api/values.api';

import type {
  UpdateValuesRequest,
  ValuesData,
} from '../types/values.types';

export async function loadValues(): Promise<ValuesData> {
  return getValues();
}

export async function saveValues(
  request: UpdateValuesRequest,
): Promise<ValuesData> {
  return updateValues(request);
}