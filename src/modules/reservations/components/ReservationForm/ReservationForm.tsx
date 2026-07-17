import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import {
  CircleAlert,
  Save,
} from 'lucide-react';

import {
  Button,
} from '../../../../components/ui/Button';

import {
  TextInput,
} from '../../../../components/forms/TextInput';

import {
  createReservation,
  listFormulas,
  updateReservation,
} from '../../api/reservations.api';

import {
  loadValues,
} from '../../../values/services/values.service';

import type {
  ValuesData,
} from '../../../values/types/values.types';

import type {
  ModalidadFiesta,
  ReservationDetail,
  ReservationFormula,
  TipoReserva,
} from '../../types/reservations.types';

import styles from './ReservationForm.module.css';

interface ReservationFormProps {
  reservationId?: string;
  initialReservation?: ReservationDetail;

  onCancel(): void;
  onSuccess(): void;
}

interface FormState {
  tipo: TipoReserva;
  nombreCliente: string;
  telefonoCliente: string;
  fecha: string;
  hora: string;
  cantidadPersonas: string;
  cantidadMenusSinTacc: string;
  tipoFiesta: string;
  modalidadFiesta: ModalidadFiesta | '';
  formulaId: string;
  montoSena: string;
  observaciones: string;
}

const INITIAL_STATE: FormState = {
  tipo: 'MESA',
  nombreCliente: '',
  telefonoCliente: '',
  fecha: '',
  hora: '',
  cantidadPersonas: '1',
  cantidadMenusSinTacc: '0',
  tipoFiesta: '',
  modalidadFiesta: '',
  formulaId: '',
  montoSena: '',
  observaciones: '',
};

function getArgentinaDateParts(
  value: string,
): {
  fecha: string;
  hora: string;
} {
  const parts =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone:
          'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      },
    ).formatToParts(
      new Date(value),
    );

  const getPart = (
    type: Intl.DateTimeFormatPartTypes,
  ) =>
    parts.find(
      (part) =>
        part.type === type,
    )?.value ?? '';

  return {
    fecha:
      `${getPart('year')}-` +
      `${getPart('month')}-` +
      `${getPart('day')}`,

    hora:
      `${getPart('hour')}:` +
      `${getPart('minute')}`,
  };
}

function createInitialState(
  reservation?: ReservationDetail,
): FormState {
  if (!reservation) {
    return INITIAL_STATE;
  }

  const {
    fecha,
    hora,
  } = getArgentinaDateParts(
    reservation.fechaHora,
  );

  return {
    tipo:
      reservation.tipo,

    nombreCliente:
      reservation.nombreCliente,

    telefonoCliente:
      reservation.telefonoCliente ??
      '',

    fecha,
    hora,

    cantidadPersonas:
      String(
        reservation.cantidadPersonas,
      ),

    cantidadMenusSinTacc:
      String(
        reservation
          .cantidadMenusSinTacc ??
          0,
      ),

    tipoFiesta:
      reservation.tipoFiesta ??
      '',

    modalidadFiesta:
      reservation.modalidadFiesta ??
      '',

    formulaId:
      reservation.formula?.id ??
      '',

    montoSena:
      reservation.montoSena ??
      '',

    observaciones:
      reservation.observaciones ??
      '',
  };
}

function parseOptionalMoney(
  value: string,
): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue =
    Number(
      value.replace(',', '.'),
    );

  return Number.isFinite(
    parsedValue,
  )
    ? parsedValue
    : undefined;
}

function parseStoredValue(
  value: string | null | undefined,
): number | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsedValue =
    Number(value);

  return Number.isFinite(
    parsedValue,
  )
    ? parsedValue
    : null;
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat(
    'es-AR',
    {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function getWeekday(
  fecha: string,
): number | null {
  const [
    year,
    month,
    day,
  ] = fecha
    .split('-')
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  ).getUTCDay();
}

function getCurrentPizzaValue(
  fecha: string,
  values: ValuesData,
): number {
  const weekday =
    getWeekday(fecha);

  if (weekday === 5) {
    return Number(
      values.pizzaLibreViernes,
    );
  }

  if (weekday === 6) {
    return Number(
      values.pizzaLibreSabado,
    );
  }

  return Number(
    values.pizzaLibreGeneral,
  );
}

export function ReservationForm({
  reservationId,
  initialReservation,
  onCancel,
  onSuccess,
}: ReservationFormProps) {
  const editing =
    Boolean(
      reservationId &&
      initialReservation,
    );

  const [form, setForm] =
    useState<FormState>(() =>
      createInitialState(
        initialReservation,
      ),
    );

  const [formulas, setFormulas] =
    useState<ReservationFormula[]>([]);

  const [values, setValues] =
    useState<ValuesData | null>(
      null,
    );

  const [
    loadingFormulas,
    setLoadingFormulas,
  ] = useState(false);

  const [
    loadingValues,
    setLoadingValues,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    setForm(
      createInitialState(
        initialReservation,
      ),
    );
  }, [initialReservation]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoadingValues(true);

      try {
        const data =
          await loadValues();

        if (active) {
          setValues(data);
        }
      } catch {
        if (active) {
          setError(
            'No se pudieron cargar los valores configurados.',
          );
        }
      } finally {
        if (active) {
          setLoadingValues(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      form.tipo !== 'FIESTA'
    ) {
      return;
    }

    let active = true;

    async function load() {
      setLoadingFormulas(true);

      try {
        const data =
          await listFormulas();

        if (active) {
          setFormulas(data);
        }
      } catch {
        if (active) {
          setError(
            'No se pudieron cargar las fórmulas.',
          );
        }
      } finally {
        if (active) {
          setLoadingFormulas(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [form.tipo]);

  const cantidadPersonas =
    Number(
      form.cantidadPersonas,
    );

  const cantidadMenusSinTacc =
    Number(
      form.cantidadMenusSinTacc ||
        0,
    );

  const pricing =
    useMemo(() => {
      const personasValidas =
        Number.isInteger(
          cantidadPersonas,
        ) &&
        cantidadPersonas > 0;

      const menusValidos =
        Number.isInteger(
          cantidadMenusSinTacc,
        ) &&
        cantidadMenusSinTacc >= 0 &&
        cantidadMenusSinTacc <=
          cantidadPersonas;

      if (!personasValidas) {
        return {
          ready: false,
          total: 0,
        };
      }

      if (
        form.tipo === 'MESA'
      ) {
        if (!menusValidos) {
          return {
            ready: false,
            total: 0,
          };
        }

        if (editing) {
          const pizzaValue =
            parseStoredValue(
              initialReservation
                ?.valorPizzaLibreAplicado,
            );

          const glutenFreeValue =
            parseStoredValue(
              initialReservation
                ?.valorMenuSinTaccAplicado,
            );

          if (
            pizzaValue === null ||
            glutenFreeValue === null
          ) {
            return {
              ready: false,
              total: 0,
            };
          }

          const commonPeople =
            cantidadPersonas -
            cantidadMenusSinTacc;

          return {
            ready: true,

            total:
              commonPeople *
                pizzaValue +
              cantidadMenusSinTacc *
                glutenFreeValue,
          };
        }

        if (
          !values ||
          !form.fecha
        ) {
          return {
            ready: false,
            total: 0,
          };
        }

        const pizzaValue =
          getCurrentPizzaValue(
            form.fecha,
            values,
          );

        const glutenFreeValue =
          Number(
            values.menuSinTacc,
          );

        const commonPeople =
          cantidadPersonas -
          cantidadMenusSinTacc;

        return {
          ready: true,

          total:
            commonPeople *
              pizzaValue +
            cantidadMenusSinTacc *
              glutenFreeValue,
        };
      }

      if (
        form.modalidadFiesta ===
        'COCTELERIA'
      ) {
        return {
          ready: true,
          total: 0,
        };
      }

      if (
        form.modalidadFiesta !==
        'BARRA_LIBRE'
      ) {
        return {
          ready: false,
          total: 0,
        };
      }

      const reservaYaEraBarraLibre =
        editing &&
        initialReservation
          ?.modalidadFiesta ===
          'BARRA_LIBRE';

      if (
        reservaYaEraBarraLibre
      ) {
        const storedOpenBarValue =
          parseStoredValue(
            initialReservation
              ?.valorBarraLibreAplicado,
          );

        if (
          storedOpenBarValue === null
        ) {
          return {
            ready: false,
            total: 0,
          };
        }

        return {
          ready: true,

          total:
            cantidadPersonas *
            storedOpenBarValue,
        };
      }

      if (!values) {
        return {
          ready: false,
          total: 0,
        };
      }

      const currentOpenBarValue =
        Number(
          values
            .fiestaBarraLibrePorPersona,
        );

      return {
        ready: true,

        total:
          cantidadPersonas *
          currentOpenBarValue,
      };
    }, [
      cantidadMenusSinTacc,
      cantidadPersonas,
      editing,
      form.fecha,
      form.modalidadFiesta,
      form.tipo,
      initialReservation,
      values,
    ]);

  const montoSena =
    parseOptionalMoney(
      form.montoSena,
    ) ?? 0;

  const saldoPendiente =
    form.tipo === 'FIESTA' &&
    form.modalidadFiesta ===
      'COCTELERIA'
      ? 0
      : Math.max(
          pricing.total -
            montoSena,
          0,
        );

  function update<
    K extends keyof FormState,
  >(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError('');
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (
      !form.nombreCliente.trim()
    ) {
      setError(
        'Ingresá el nombre del cliente.',
      );

      return;
    }

    if (
      !form.fecha ||
      !form.hora
    ) {
      setError(
        'Ingresá la fecha y la hora.',
      );

      return;
    }

    if (
      !Number.isInteger(
        cantidadPersonas,
      ) ||
      cantidadPersonas < 1
    ) {
      setError(
        'La cantidad de personas debe ser mayor a cero.',
      );

      return;
    }

    if (
      form.tipo === 'MESA' &&
      (
        !Number.isInteger(
          cantidadMenusSinTacc,
        ) ||
        cantidadMenusSinTacc < 0
      )
    ) {
      setError(
        'La cantidad de menús sin TACC no es válida.',
      );

      return;
    }

    if (
      form.tipo === 'MESA' &&
      cantidadMenusSinTacc >
        cantidadPersonas
    ) {
      setError(
        'La cantidad de menús sin TACC no puede ser mayor a la cantidad total de personas.',
      );

      return;
    }

    if (
      form.tipo === 'FIESTA' &&
      !form.modalidadFiesta
    ) {
      setError(
        'Seleccioná la modalidad de la fiesta.',
      );

      return;
    }

    if (
      form.tipo === 'FIESTA' &&
      !form.formulaId
    ) {
      setError(
        'Seleccioná una fórmula para la fiesta.',
      );

      return;
    }

    if (!pricing.ready) {
      setError(
        'No se pudo calcular el precio con los valores disponibles.',
      );

      return;
    }

    const esCocteleria =
      form.tipo === 'FIESTA' &&
      form.modalidadFiesta ===
        'COCTELERIA';

    if (
      !esCocteleria &&
      montoSena >
        pricing.total
    ) {
      setError(
        'La seña no puede ser mayor al precio total.',
      );

      return;
    }

    const fechaHora =
      `${form.fecha}` +
      `T${form.hora}:00-03:00`;

    const commonRequest = {
      nombreCliente:
        form.nombreCliente.trim(),

      telefonoCliente:
        form.telefonoCliente.trim() ||
        undefined,

      fechaHora,

      cantidadPersonas,

      cantidadMenusSinTacc:
        form.tipo === 'MESA'
          ? cantidadMenusSinTacc
          : undefined,

      tipoFiesta:
        form.tipo === 'FIESTA'
          ? form.tipoFiesta.trim() ||
            undefined
          : undefined,

      modalidadFiesta:
        form.tipo === 'FIESTA' &&
        form.modalidadFiesta
          ? form.modalidadFiesta
          : undefined,

      formulaId:
        form.tipo === 'FIESTA'
          ? form.formulaId
          : undefined,

      observaciones:
        form.observaciones.trim() ||
        undefined,

      montoSena:
        parseOptionalMoney(
          form.montoSena,
        ),
    };

    setSaving(true);

    try {
      if (
        editing &&
        reservationId
      ) {
        await updateReservation(
          reservationId,
          commonRequest,
        );
      } else {
        await createReservation({
          tipo: form.tipo,
          ...commonRequest,
        });
      }

      onSuccess();
    } catch {
      setError(
        editing
          ? 'No se pudo actualizar la reserva. Revisá los datos ingresados.'
          : 'No se pudo crear la reserva. Revisá los datos ingresados.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <section
        className={styles.section}
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <h2>Tipo de reserva</h2>
        </div>

        <div
          className={
            styles.typeOptions
          }
        >
          <label
            className={
              form.tipo === 'MESA'
                ? styles.typeSelected
                : styles.typeOption
            }
          >
            <input
              type="radio"
              name="tipo"
              value="MESA"
              checked={
                form.tipo === 'MESA'
              }
              onChange={() =>
                update(
                  'tipo',
                  'MESA',
                )
              }
              disabled={
                saving ||
                editing
              }
            />

            Mesa
          </label>

          <label
            className={
              form.tipo === 'FIESTA'
                ? styles.typeSelected
                : styles.typeOption
            }
          >
            <input
              type="radio"
              name="tipo"
              value="FIESTA"
              checked={
                form.tipo ===
                'FIESTA'
              }
              onChange={() =>
                update(
                  'tipo',
                  'FIESTA',
                )
              }
              disabled={
                saving ||
                editing
              }
            />

            Fiesta
          </label>
        </div>
      </section>

      <section
        className={styles.section}
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <h2>
            Información general
          </h2>
        </div>

        <div
          className={styles.grid}
        >
          <TextInput
            label="Nombre del cliente"
            value={
              form.nombreCliente
            }
            onChange={(event) =>
              update(
                'nombreCliente',
                event.target.value,
              )
            }
            disabled={saving}
          />

          <TextInput
            label="Teléfono"
            value={
              form.telefonoCliente
            }
            onChange={(event) =>
              update(
                'telefonoCliente',
                event.target.value,
              )
            }
            disabled={saving}
          />

          <label
            className={styles.field}
          >
            <span>Fecha</span>

            <input
              type="date"
              value={form.fecha}
              onChange={(event) =>
                update(
                  'fecha',
                  event.target.value,
                )
              }
              disabled={saving}
            />
          </label>

          <label
            className={styles.field}
          >
            <span>Hora</span>

            <input
              type="time"
              value={form.hora}
              onChange={(event) =>
                update(
                  'hora',
                  event.target.value,
                )
              }
              disabled={saving}
            />
          </label>

          <TextInput
            type="number"
            min={1}
            step={1}
            label="Cantidad de personas"
            value={
              form.cantidadPersonas
            }
            onChange={(event) =>
              update(
                'cantidadPersonas',
                event.target.value,
              )
            }
            disabled={saving}
          />

          {form.tipo === 'MESA' && (
            <TextInput
              type="number"
              min={0}
              step={1}
              label="Menús sin TACC"
              value={
                form
                  .cantidadMenusSinTacc
              }
              onChange={(event) =>
                update(
                  'cantidadMenusSinTacc',
                  event.target.value,
                )
              }
              disabled={saving}
            />
          )}
        </div>
      </section>

      {form.tipo === 'FIESTA' && (
        <section
          className={styles.section}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <h2>
              Información de la fiesta
            </h2>
          </div>

          <div
            className={styles.grid}
          >
            <TextInput
              label="Tipo de fiesta"
              placeholder="Ej.: Cumpleaños"
              value={
                form.tipoFiesta
              }
              onChange={(event) =>
                update(
                  'tipoFiesta',
                  event.target.value,
                )
              }
              disabled={saving}
            />

            <label
              className={styles.field}
            >
              <span>
                Modalidad
              </span>

              <select
                value={
                  form.modalidadFiesta
                }
                onChange={(event) =>
                  update(
                    'modalidadFiesta',
                    event.target
                      .value as
                      | ModalidadFiesta
                      | '',
                  )
                }
                disabled={saving}
              >
                <option value="">
                  Seleccionar modalidad
                </option>

                <option value="BARRA_LIBRE">
                  Barra libre
                </option>

                <option value="COCTELERIA">
                  Coctelería a la carta
                </option>
              </select>
            </label>

            <label
              className={styles.field}
            >
              <span>Fórmula</span>

              <select
                value={
                  form.formulaId
                }
                onChange={(event) =>
                  update(
                    'formulaId',
                    event.target.value,
                  )
                }
                disabled={
                  saving ||
                  loadingFormulas
                }
              >
                <option value="">
                  {loadingFormulas
                    ? 'Cargando...'
                    : 'Seleccionar fórmula'}
                </option>

                {formulas.map(
                  (formula) => (
                    <option
                      key={formula.id}
                      value={formula.id}
                    >
                      {formula.nombre}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>
      )}

      <section
        className={styles.section}
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <h2>
            Información económica
          </h2>
        </div>

        <div
          className={
            styles.moneyGrid
          }
        >
          <div
            className={
              styles.balance
            }
          >
            <span>
              Precio calculado
            </span>

            <strong>
              {loadingValues
                ? 'Calculando...'
                : formatCurrency(
                    pricing.total,
                  )}
            </strong>
          </div>

          <TextInput
            type="number"
            min={0}
            step="0.01"
            label="Seña"
            value={
              form.montoSena
            }
            onChange={(event) =>
              update(
                'montoSena',
                event.target.value,
              )
            }
            disabled={
              saving ||
              loadingValues
            }
          />

          <div
            className={
              styles.balance
            }
          >
            <span>
              Saldo pendiente
            </span>

            <strong>
              {loadingValues
                ? 'Calculando...'
                : formatCurrency(
                    saldoPendiente,
                  )}
            </strong>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
      >
        <label
          className={styles.field}
        >
          <span>Observaciones</span>

          <textarea
            rows={5}
            value={
              form.observaciones
            }
            onChange={(event) =>
              update(
                'observaciones',
                event.target.value,
              )
            }
            maxLength={500}
            disabled={saving}
          />
        </label>
      </section>

      <div
        className={styles.message}
        role="alert"
      >
        {error && (
          <>
            <CircleAlert
              size={18}
              aria-hidden="true"
            />

            <span>{error}</span>
          </>
        )}
      </div>

      <footer
        className={styles.actions}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          isLoading={saving}
          loadingText={
            editing
              ? 'Guardando cambios...'
              : 'Guardando...'
          }
          disabled={
            loadingValues
          }
        >
          <Save
            size={18}
            aria-hidden="true"
          />

          {editing
            ? 'Guardar cambios'
            : 'Guardar reserva'}
        </Button>
      </footer>
    </form>
  );
}