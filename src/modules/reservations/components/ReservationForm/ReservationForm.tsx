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

import type {
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
  formulaId: string;
  precioTotal: string;
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
  formulaId: '',
  precioTotal: '',
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
    ).formatToParts(new Date(value));

  const getPart = (
    type: Intl.DateTimeFormatPartTypes,
  ) =>
    parts.find(
      (part) => part.type === type,
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
    tipo: reservation.tipo,

    nombreCliente:
      reservation.nombreCliente,

    telefonoCliente:
      reservation.telefonoCliente ?? '',

    fecha,
    hora,

    cantidadPersonas:
      String(
        reservation.cantidadPersonas,
      ),

    cantidadMenusSinTacc:
      String(
        reservation
          .cantidadMenusSinTacc ?? 0,
      ),

    tipoFiesta:
      reservation.tipoFiesta ?? '',

    formulaId:
      reservation.formula?.id ?? '',

    precioTotal:
      reservation.precioTotal ?? '',

    montoSena:
      reservation.montoSena ?? '',

    observaciones:
      reservation.observaciones ?? '',
  };
}

function parseOptionalMoney(
  value: string,
): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsedValue =
    Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : undefined;
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

  const [
    loadingFormulas,
    setLoadingFormulas,
  ] = useState(false);

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
    if (form.tipo !== 'FIESTA') {
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

  const precioTotal =
    parseOptionalMoney(
      form.precioTotal,
    ) ?? 0;

  const montoSena =
    parseOptionalMoney(
      form.montoSena,
    ) ?? 0;

  const saldoPendiente =
    useMemo(
      () =>
        Math.max(
          precioTotal -
            montoSena,
          0,
        ),
      [
        precioTotal,
        montoSena,
      ],
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
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!form.nombreCliente.trim()) {
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

    const cantidadPersonas =
      Number(
        form.cantidadPersonas,
      );

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

    const cantidadMenusSinTacc =
      Number(
        form.cantidadMenusSinTacc ||
          0,
      );

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
      form.tipo === 'FIESTA' &&
      !form.formulaId
    ) {
      setError(
        'Seleccioná una fórmula para la fiesta.',
      );

      return;
    }

    if (
      montoSena >
      precioTotal
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

      formulaId:
        form.tipo === 'FIESTA'
          ? form.formulaId
          : undefined,

      observaciones:
        form.observaciones.trim() ||
        undefined,

      precioTotal:
        parseOptionalMoney(
          form.precioTotal,
        ),

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
      <section className={styles.section}>
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

      <section className={styles.section}>
        <div
          className={
            styles.sectionHeader
          }
        >
          <h2>
            Información general
          </h2>
        </div>

        <div className={styles.grid}>
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

          <div className={styles.grid}>
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
              className={
                styles.field
              }
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
                      key={
                        formula.id
                      }
                      value={
                        formula.id
                      }
                    >
                      {
                        formula.nombre
                      }
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>
      )}

      <section className={styles.section}>
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
          <TextInput
            type="number"
            min={0}
            step="0.01"
            label="Precio total"
            value={
              form.precioTotal
            }
            onChange={(event) =>
              update(
                'precioTotal',
                event.target.value,
              )
            }
            disabled={saving}
          />

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
            disabled={saving}
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
              {formatCurrency(
                saldoPendiente,
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
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