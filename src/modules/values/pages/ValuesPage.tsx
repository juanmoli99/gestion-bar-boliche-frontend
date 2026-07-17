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
  Save,
} from 'lucide-react';

import {
  Button,
} from '../../../components/ui/Button/Button';

import {
  useAuth,
} from '../../auth/hooks/useAuth';

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
  fiestaBarraLibrePorPersona: '',
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
    fiestaBarraLibrePorPersona:
      values.fiestaBarraLibrePorPersona,
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

  const fiestaBarraLibrePorPersona =
    parseValue(
      form.fiestaBarraLibrePorPersona,
    );

  if (
    pizzaLibreGeneral === null ||
    pizzaLibreViernes === null ||
    pizzaLibreSabado === null ||
    menuSinTacc === null ||
    fiestaBarraLibrePorPersona === null
  ) {
    return null;
  }

  return {
    pizzaLibreGeneral,
    pizzaLibreViernes,
    pizzaLibreSabado,
    menuSinTacc,
    fiestaBarraLibrePorPersona,
  };
}

export function ValuesPage() {
  const {
    usuario,
  } = useAuth();

  const [form, setForm] =
    useState<ValuesFormState>(
      initialForm,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [loadError, setLoadError] =
    useState(false);

  const [formError, setFormError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const canEdit =
    usuario?.rol === 'ADMINISTRADOR';

  useEffect(() => {
    async function load() {
      setLoading(true);
      setLoadError(false);

      try {
        const values =
          await loadValues();

        setForm(
          createFormFromValues(values),
        );
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
                  Pizza libre general
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

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Fiestas</h2>

                <p>
                  Precio de barra libre aplicado por cada persona de la reserva.
                </p>
              </div>
            </div>

            <div className={styles.fieldsGrid}>
              <label className={styles.field}>
                <span>
                  Barra libre por persona
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
                    name="fiestaBarraLibrePorPersona"
                    value={
                      form.fiestaBarraLibrePorPersona
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
      )}
    </section>
  );
}