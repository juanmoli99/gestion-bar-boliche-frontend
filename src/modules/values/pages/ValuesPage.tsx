import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  CircleCheckBig,
  CircleX,
  LockKeyhole,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

import { SalaryPositionsManager } from '../../salaries/components/SalaryPositionsManager/SalaryPositionsManager';

import {
  Button,
} from '../../../components/ui/Button/Button';

import {
  useAuth,
} from '../../auth/hooks/useAuth';

import {
  createFreeBarRate,
  deleteFreeBarRate,
  listFreeBarRates,
  updateFreeBarRate,
  type FreeBarRate,
} from '../../free-bar-rates/api/free-bar-rates.api';

import {
  loadValues,
  saveValues,
} from '../services/values.service';

import type {
  UpdateValuesRequest,
  ValuesData,
  ValuesFormState,
} from '../types/values.types';

import styles from './ValuesPage.module.css';

const initialForm: ValuesFormState = {
  pizzaLibreGeneral: '',
  pizzaLibreViernes: '',
  pizzaLibreSabado: '',
  menuSinTacc: '',
};

interface FreeBarRateFormState {
  nombre: string;
  valorPersona: string;
}

const initialFreeBarRateForm:
  FreeBarRateFormState = {
    nombre: '',
    valorPersona: '',
  };

function createFormFromValues(
  values: ValuesData,
): ValuesFormState {
  return {
    pizzaLibreGeneral:
      values.pizzaLibreGeneral,
    pizzaLibreViernes:
      values.pizzaLibreViernes,
    pizzaLibreSabado:
      values.pizzaLibreSabado,
    menuSinTacc:
      values.menuSinTacc,
  };
}

function parseValue(
  value: string,
): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsedValue =
    Number(
      value.replace(',', '.'),
    );

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 0
  ) {
    return null;
  }

  return parsedValue;
}

function createRequest(
  form: ValuesFormState,
): UpdateValuesRequest | null {
  const pizzaLibreGeneral =
    parseValue(
      form.pizzaLibreGeneral,
    );

  const pizzaLibreViernes =
    parseValue(
      form.pizzaLibreViernes,
    );

  const pizzaLibreSabado =
    parseValue(
      form.pizzaLibreSabado,
    );

  const menuSinTacc =
    parseValue(
      form.menuSinTacc,
    );

  if (
    pizzaLibreGeneral === null ||
    pizzaLibreViernes === null ||
    pizzaLibreSabado === null ||
    menuSinTacc === null
  ) {
    return null;
  }

  return {
    pizzaLibreGeneral,
    pizzaLibreViernes,
    pizzaLibreSabado,
    menuSinTacc,
  };
}

function formatCurrency(
  value: string,
): string {
  return new Intl.NumberFormat(
    'es-AR',
    {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    },
  ).format(
    Number(value),
  );
}

export function ValuesPage() {
  const {
    usuario,
  } = useAuth();

  const [form, setForm] =
    useState<ValuesFormState>(
      initialForm,
    );

  const [
    freeBarRates,
    setFreeBarRates,
  ] = useState<FreeBarRate[]>([]);

  const [
    freeBarRateForm,
    setFreeBarRateForm,
  ] = useState<FreeBarRateFormState>(
    initialFreeBarRateForm,
  );

  const [
    editingFreeBarRateId,
    setEditingFreeBarRateId,
  ] = useState<string | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    savingFreeBarRate,
    setSavingFreeBarRate,
  ] = useState(false);

  const [
    deletingFreeBarRateId,
    setDeletingFreeBarRateId,
  ] = useState<string | null>(
    null,
  );

  const [loadError, setLoadError] =
    useState(false);

  const [formError, setFormError] =
    useState('');

  const [
    freeBarRateError,
    setFreeBarRateError,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const canEdit =
    usuario?.rol === 'ADMINISTRADOR';

  useEffect(() => {
    async function load() {
      setLoading(true);
      setLoadError(false);

      try {
        const [
          values,
          rates,
        ] = await Promise.all([
          loadValues(),
          listFreeBarRates(),
        ]);

        setForm(
          createFormFromValues(values),
        );

        setFreeBarRates(rates);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setFormError('');
    setSuccessMessage('');
  }

  function handleFreeBarRateChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
    } = event.target;

    setFreeBarRateForm(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      }),
    );

    setFreeBarRateError('');
    setSuccessMessage('');
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canEdit || saving) {
      return;
    }

    const request =
      createRequest(form);

    if (!request) {
      setFormError(
        'Completá todos los valores con números iguales o mayores a cero.',
      );

      return;
    }

    setSaving(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const updatedValues =
        await saveValues(request);

      setForm(
        createFormFromValues(
          updatedValues,
        ),
      );

      setSuccessMessage(
        'Los valores se guardaron correctamente.',
      );
    } catch {
      setFormError(
        'No se pudieron guardar los valores. Intentá nuevamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleFreeBarRateSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !canEdit ||
      savingFreeBarRate
    ) {
      return;
    }

    const nombre =
      freeBarRateForm.nombre.trim();

    const valorPersona =
      parseValue(
        freeBarRateForm.valorPersona,
      );

    if (
      !nombre ||
      valorPersona === null
    ) {
      setFreeBarRateError(
        'Ingresá un nombre y un precio válido.',
      );

      return;
    }

    setSavingFreeBarRate(true);
    setFreeBarRateError('');
    setSuccessMessage('');

    try {
      if (editingFreeBarRateId) {
        const updatedRate =
          await updateFreeBarRate(
            editingFreeBarRateId,
            {
              nombre,
              valorPersona,
            },
          );

        setFreeBarRates(
          (currentRates) =>
            currentRates.map(
              (rate) =>
                rate.id ===
                updatedRate.id
                  ? updatedRate
                  : rate,
            ),
        );

        setSuccessMessage(
          'La tarifa se actualizó correctamente.',
        );
      } else {
        const createdRate =
          await createFreeBarRate({
            nombre,
            valorPersona,
          });

        setFreeBarRates(
          (currentRates) => [
            ...currentRates,
            createdRate,
          ],
        );

        setSuccessMessage(
          'La tarifa se creó correctamente.',
        );
      }

      setFreeBarRateForm(
        initialFreeBarRateForm,
      );

      setEditingFreeBarRateId(
        null,
      );
    } catch {
      setFreeBarRateError(
        editingFreeBarRateId
          ? 'No se pudo actualizar la tarifa.'
          : 'No se pudo crear la tarifa.',
      );
    } finally {
      setSavingFreeBarRate(false);
    }
  }

  function startEditingFreeBarRate(
    rate: FreeBarRate,
  ) {
    setEditingFreeBarRateId(
      rate.id,
    );

    setFreeBarRateForm({
      nombre: rate.nombre,
      valorPersona:
        rate.valorPersona,
    });

    setFreeBarRateError('');
    setSuccessMessage('');
  }

  function cancelEditingFreeBarRate() {
    setEditingFreeBarRateId(
      null,
    );

    setFreeBarRateForm(
      initialFreeBarRateForm,
    );

    setFreeBarRateError('');
  }

  async function handleDeleteFreeBarRate(
    rate: FreeBarRate,
  ) {
    if (
      !canEdit ||
      deletingFreeBarRateId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `¿Desactivar la tarifa "${rate.nombre}"?`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingFreeBarRateId(
      rate.id,
    );

    setFreeBarRateError('');
    setSuccessMessage('');

    try {
      await deleteFreeBarRate(
        rate.id,
      );

      setFreeBarRates(
        (currentRates) =>
          currentRates.filter(
            (currentRate) =>
              currentRate.id !==
              rate.id,
          ),
      );

      if (
        editingFreeBarRateId ===
        rate.id
      ) {
        cancelEditingFreeBarRate();
      }

      setSuccessMessage(
        'La tarifa se desactivó correctamente.',
      );
    } catch {
      setFreeBarRateError(
        'No se pudo desactivar la tarifa.',
      );
    } finally {
      setDeletingFreeBarRateId(
        null,
      );
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Valores
          </h1>

          <p className={styles.description}>
            Configuración de precios utilizados para calcular las reservas.
          </p>
        </div>
      </header>

      {loading && (
        <section className={styles.loading}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </section>
      )}

      {!loading && loadError && (
        <section className={styles.errorState}>
          <CircleX
            size={28}
            aria-hidden="true"
          />

          <div>
            <h2>
              No se pudieron cargar los valores
            </h2>

            <p>
              Verificá la conexión y recargá la página.
            </p>
          </div>
        </section>
      )}

      {!loading && !loadError && (
        <>
          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            {!canEdit && (
              <section className={styles.readOnlyNotice}>
                <LockKeyhole
                  size={20}
                  aria-hidden="true"
                />

                <p>
                  Solo un administrador puede modificar estos valores.
                </p>
              </section>
            )}

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Pizza libre</h2>

                  <p>
                    El precio general se utiliza los lunes, martes, miércoles, jueves y domingos.
                  </p>
                </div>
              </div>

              <div className={styles.fieldsGrid}>
                <label className={styles.field}>
                  <span>
                    Pizza libre Miercoles-Jueves-Domingo
                  </span>

                  <div className={styles.inputWrapper}>
                    <span
                      className={styles.currency}
                      aria-hidden="true"
                    >
                      $
                    </span>

                    <input
                      type="number"
                      name="pizzaLibreGeneral"
                      value={
                        form.pizzaLibreGeneral
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      disabled={
                        !canEdit || saving
                      }
                      required
                    />
                  </div>
                </label>

                <label className={styles.field}>
                  <span>
                    Pizza libre viernes
                  </span>

                  <div className={styles.inputWrapper}>
                    <span
                      className={styles.currency}
                      aria-hidden="true"
                    >
                      $
                    </span>

                    <input
                      type="number"
                      name="pizzaLibreViernes"
                      value={
                        form.pizzaLibreViernes
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      disabled={
                        !canEdit || saving
                      }
                      required
                    />
                  </div>
                </label>

                <label className={styles.field}>
                  <span>
                    Pizza libre sábado
                  </span>

                  <div className={styles.inputWrapper}>
                    <span
                      className={styles.currency}
                      aria-hidden="true"
                    >
                      $
                    </span>

                    <input
                      type="number"
                      name="pizzaLibreSabado"
                      value={
                        form.pizzaLibreSabado
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      disabled={
                        !canEdit || saving
                      }
                      required
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Menú sin TACC</h2>

                  <p>
                    Precio individual para cada persona con menú sin TACC.
                  </p>
                </div>
              </div>

              <div className={styles.fieldsGrid}>
                <label className={styles.field}>
                  <span>
                    Menú sin TACC
                  </span>

                  <div className={styles.inputWrapper}>
                    <span
                      className={styles.currency}
                      aria-hidden="true"
                    >
                      $
                    </span>

                    <input
                      type="number"
                      name="menuSinTacc"
                      value={
                        form.menuSinTacc
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      disabled={
                        !canEdit || saving
                      }
                      required
                    />
                  </div>
                </label>
              </div>
            </section>

            {formError && (
              <div
                className={styles.formMessage}
                data-variant="error"
                role="alert"
              >
                <CircleX
                  size={19}
                  aria-hidden="true"
                />

                <span>{formError}</span>
              </div>
            )}

            {canEdit && (
              <div className={styles.actions}>
                <Button
                  type="submit"
                  isLoading={saving}
                  loadingText="Guardando..."
                >
                  <Save
                    size={19}
                    aria-hidden="true"
                  />

                  Guardar cambios
                </Button>
              </div>
            )}
          </form>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>
                  Tarifas de barra libre
                </h2>

                <p>
                  Creá distintos precios por persona para seleccionarlos al registrar una fiesta.
                </p>
              </div>
            </div>

            {canEdit && (
              <form
                className={styles.form}
                onSubmit={
                  handleFreeBarRateSubmit
                }
              >
                <div className={styles.fieldsGrid}>
                  <label className={styles.field}>
                    <span>
                      Nombre de la tarifa
                    </span>

                    <input
                      type="text"
                      name="nombre"
                      value={
                        freeBarRateForm.nombre
                      }
                      onChange={
                        handleFreeBarRateChange
                      }
                      maxLength={100}
                      placeholder="Ej.: Barra libre clásica"
                      disabled={
                        savingFreeBarRate
                      }
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>
                      Precio por persona
                    </span>

                    <div className={styles.inputWrapper}>
                      <span
                        className={styles.currency}
                        aria-hidden="true"
                      >
                        $
                      </span>

                      <input
                        type="number"
                        name="valorPersona"
                        value={
                          freeBarRateForm
                            .valorPersona
                        }
                        onChange={
                          handleFreeBarRateChange
                        }
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        disabled={
                          savingFreeBarRate
                        }
                        required
                      />
                    </div>
                  </label>
                </div>

                <div className={styles.actions}>
                  {editingFreeBarRateId && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={
                        cancelEditingFreeBarRate
                      }
                      disabled={
                        savingFreeBarRate
                      }
                    >
                      <X
                        size={19}
                        aria-hidden="true"
                      />

                      Cancelar edición
                    </Button>
                  )}

                  <Button
                    type="submit"
                    isLoading={
                      savingFreeBarRate
                    }
                    loadingText="Guardando..."
                  >
                    {editingFreeBarRateId ? (
                      <Save
                        size={19}
                        aria-hidden="true"
                      />
                    ) : (
                      <Plus
                        size={19}
                        aria-hidden="true"
                      />
                    )}

                    {editingFreeBarRateId
                      ? 'Guardar tarifa'
                      : 'Agregar tarifa'}
                  </Button>
                </div>
              </form>
            )}

            {freeBarRates.length === 0 ? (
              <p>
                No hay tarifas activas de barra libre.
              </p>
            ) : (
              <div>
                {freeBarRates.map(
                  (rate) => (
                    <div
                      key={rate.id}
                      className={
                        styles.fieldsGrid
                      }
                    >
                      <div>
                        <strong>
                          {rate.nombre}
                        </strong>

                        <p>
                          {formatCurrency(
                            rate.valorPersona,
                          )}{' '}
                          por persona
                        </p>
                      </div>

                      {canEdit && (
                        <div className={styles.actions}>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              startEditingFreeBarRate(
                                rate,
                              )
                            }
                            disabled={
                              savingFreeBarRate ||
                              Boolean(
                                deletingFreeBarRateId,
                              )
                            }
                          >
                            <Pencil
                              size={18}
                              aria-hidden="true"
                            />

                            Editar
                          </Button>

                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              void handleDeleteFreeBarRate(
                                rate,
                              )
                            }
                            disabled={
                              savingFreeBarRate ||
                              Boolean(
                                deletingFreeBarRateId,
                              )
                            }
                          >
                            <Trash2
                              size={18}
                              aria-hidden="true"
                            />

                            {deletingFreeBarRateId ===
                            rate.id
                              ? 'Desactivando...'
                              : 'Desactivar'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}

            {freeBarRateError && (
              <div
                className={styles.formMessage}
                data-variant="error"
                role="alert"
              >
                <CircleX
                  size={19}
                  aria-hidden="true"
                />

                <span>
                  {freeBarRateError}
                </span>
              </div>
            )}
          </section>

          {successMessage && (
            <div
              className={styles.formMessage}
              data-variant="success"
              role="status"
            >
              <CircleCheckBig
                size={19}
                aria-hidden="true"
              />

              <span>
                {successMessage}
              </span>
            </div>
          )}
        </>
      )}

      <SalaryPositionsManager />
    </section>
  );
}