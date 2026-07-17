export interface ValuesData {
  id: number;

  pizzaLibreGeneral: string;
  pizzaLibreViernes: string;
  pizzaLibreSabado: string;

  menuSinTacc: string;

  fiestaBarraLibrePorPersona: string;

  creadoEn: string;
  actualizadoEn: string;
}

export interface UpdateValuesRequest {
  pizzaLibreGeneral: number;
  pizzaLibreViernes: number;
  pizzaLibreSabado: number;

  menuSinTacc: number;

  fiestaBarraLibrePorPersona: number;
}

export interface ValuesFormState {
  pizzaLibreGeneral: string;
  pizzaLibreViernes: string;
  pizzaLibreSabado: string;

  menuSinTacc: string;

  fiestaBarraLibrePorPersona: string;
}