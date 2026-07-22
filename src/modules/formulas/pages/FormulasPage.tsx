import {
  useEffect,
  useState,
} from 'react';

import {
  CircleAlert,
  FlaskConical,
  Pencil,
  Pizza,
  Plus,
} from 'lucide-react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  loadCookingFormulas,
  loadFormulas,
} from '../services/formulas.service';

import type {
  CookingFormula,
  FormulaListItem,
} from '../types/formulas.types';

import styles from './FormulasPage.module.css';

type FormulaTab =
  | 'bebidas'
  | 'cocina';

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  ).format(
    new Date(value),
  );
}

export function FormulasPage() {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const currentTab:
    FormulaTab =
      searchParams.get('tipo') ===
      'cocina'
        ? 'cocina'
        : 'bebidas';

  const [formulas, setFormulas] =
    useState<FormulaListItem[]>([]);

  const [
    cookingFormulas,
    setCookingFormulas,
  ] = useState<CookingFormula[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        if (
          currentTab === 'bebidas'
        ) {
          const data =
            await loadFormulas();

          if (active) {
            setFormulas(data);
          }

          return;
        }

        const data =
          await loadCookingFormulas();

        if (active) {
          setCookingFormulas(data);
        }
      } catch {
        if (active) {
          setError(
            currentTab === 'bebidas'
              ? 'No se pudieron cargar las fórmulas de bebidas.'
              : 'No se pudieron cargar las fórmulas de cocina.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [currentTab]);

  function changeTab(
    tab: FormulaTab,
  ) {
    setSearchParams(
      tab === 'cocina'
        ? {
            tipo: 'cocina',
          }
        : {},
    );
  }

  function createFormula() {
    navigate(
      currentTab === 'bebidas'
        ? '/formulas/nueva'
        : '/formulas/cocina/nueva',
    );
  }

  function editFormula(
    formulaId: string,
  ) {
    navigate(
      currentTab === 'bebidas'
        ? `/formulas/${formulaId}/editar`
        : `/formulas/cocina/${formulaId}/editar`,
    );
  }

  const empty =
    currentTab === 'bebidas'
      ? formulas.length === 0
      : cookingFormulas.length ===
        0;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Fórmulas
          </h1>

          <p
            className={
              styles.description
            }
          >
            Configurá por separado las fórmulas de bebidas y las fórmulas de cocina.
          </p>
        </div>

        <Button
          type="button"
          onClick={createFormula}
        >
          <Plus
            size={18}
            aria-hidden="true"
          />

          {currentTab === 'bebidas'
            ? 'Nueva fórmula de bebidas'
            : 'Nueva fórmula de cocina'}
        </Button>
      </header>

      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Tipos de fórmula"
      >
        <button
          type="button"
          role="tab"
          aria-selected={
            currentTab === 'bebidas'
          }
          className={
            currentTab === 'bebidas'
              ? styles.activeTab
              : styles.tab
          }
          onClick={() =>
            changeTab('bebidas')
          }
        >
          <FlaskConical
            size={18}
            aria-hidden="true"
          />

          Bebidas
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            currentTab === 'cocina'
          }
          className={
            currentTab === 'cocina'
              ? styles.activeTab
              : styles.tab
          }
          onClick={() =>
            changeTab('cocina')
          }
        >
          <Pizza
            size={18}
            aria-hidden="true"
          />

          Cocina
        </button>
      </div>

      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          <CircleAlert
            size={19}
            aria-hidden="true"
          />

          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div
          className={
            styles.loadingState
          }
        >
          Cargando fórmulas...
        </div>
      )}

      {!loading &&
        !error &&
        empty && (
          <div
            className={
              styles.emptyState
            }
          >
            {currentTab ===
            'bebidas' ? (
              <FlaskConical
                size={38}
                aria-hidden="true"
              />
            ) : (
              <Pizza
                size={38}
                aria-hidden="true"
              />
            )}

            <div>
              <strong>
                No hay fórmulas creadas
              </strong>

              <p>
                {currentTab ===
                'bebidas'
                  ? 'Creá la primera fórmula de bebidas para asignarla a las reservas de fiesta.'
                  : 'Creá la primera fórmula de cocina para asignarla a las reservas de mesa.'}
              </p>
            </div>

            <Button
              type="button"
              onClick={createFormula}
            >
              <Plus
                size={18}
                aria-hidden="true"
              />

              Crear fórmula
            </Button>
          </div>
        )}

      {!loading &&
        !error &&
        currentTab === 'bebidas' &&
        formulas.length > 0 && (
          <>
            <div
              className={
                styles.desktopTable
              }
            >
              <table
                className={styles.table}
              >
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Versión</th>
                    <th>
                      Última modificación
                    </th>
                    <th>
                      <span
                        className={
                          styles.srOnly
                        }
                      >
                        Acciones
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {formulas.map(
                    (formula) => (
                      <tr
                        key={formula.id}
                      >
                        <td>
                          <div
                            className={
                              styles.formulaInfo
                            }
                          >
                            <strong>
                              {formula.nombre}
                            </strong>

                            {formula.descripcion && (
                              <span>
                                {
                                  formula.descripcion
                                }
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              formula.activa
                                ? styles.activeBadge
                                : styles.inactiveBadge
                            }
                          >
                            {formula.activa
                              ? 'Activa'
                              : 'Inactiva'}
                          </span>
                        </td>

                        <td>
                          Versión{' '}
                          {
                            formula.versionActiva
                          }
                        </td>

                        <td>
                          {formatDate(
                            formula.actualizadoEn,
                          )}
                        </td>

                        <td
                          className={
                            styles.actionCell
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.editButton
                            }
                            onClick={() =>
                              editFormula(
                                formula.id,
                              )
                            }
                          >
                            <Pencil
                              size={18}
                              aria-hidden="true"
                            />

                            <span>
                              Editar
                            </span>
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <div
              className={
                styles.mobileList
              }
            >
              {formulas.map(
                (formula) => (
                  <article
                    key={formula.id}
                    className={
                      styles.card
                    }
                  >
                    <header
                      className={
                        styles.cardHeader
                      }
                    >
                      <div>
                        <h2>
                          {formula.nombre}
                        </h2>

                        {formula.descripcion && (
                          <p>
                            {
                              formula.descripcion
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className={
                          formula.activa
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        {formula.activa
                          ? 'Activa'
                          : 'Inactiva'}
                      </span>
                    </header>

                    <dl
                      className={
                        styles.cardDetails
                      }
                    >
                      <div>
                        <dt>Versión</dt>

                        <dd>
                          {
                            formula.versionActiva
                          }
                        </dd>
                      </div>

                      <div>
                        <dt>Modificada</dt>

                        <dd>
                          {formatDate(
                            formula.actualizadoEn,
                          )}
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      className={
                        styles.editButton
                      }
                      onClick={() =>
                        editFormula(
                          formula.id,
                        )
                      }
                    >
                      <Pencil
                        size={18}
                        aria-hidden="true"
                      />

                      <span>Editar</span>
                    </button>
                  </article>
                ),
              )}
            </div>
          </>
        )}

      {!loading &&
        !error &&
        currentTab === 'cocina' &&
        cookingFormulas.length >
          0 && (
          <>
            <div
              className={
                styles.desktopTable
              }
            >
              <table
                className={styles.table}
              >
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Ítems incluidos</th>
                    <th>
                      Última modificación
                    </th>
                    <th>
                      <span
                        className={
                          styles.srOnly
                        }
                      >
                        Acciones
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cookingFormulas.map(
                    (formula) => (
                      <tr
                        key={formula.id}
                      >
                        <td>
                          <div
                            className={
                              styles.formulaInfo
                            }
                          >
                            <strong>
                              {formula.nombre}
                            </strong>

                            {formula.descripcion && (
                              <span>
                                {
                                  formula.descripcion
                                }
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              formula.activa
                                ? styles.activeBadge
                                : styles.inactiveBadge
                            }
                          >
                            {formula.activa
                              ? 'Activa'
                              : 'Inactiva'}
                          </span>
                        </td>

                        <td>
                          {formula.items.length}{' '}
                          {formula.items.length ===
                          1
                            ? 'ítem'
                            : 'ítems'}
                        </td>

                        <td>
                          {formatDate(
                            formula.actualizadoEn,
                          )}
                        </td>

                        <td
                          className={
                            styles.actionCell
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.editButton
                            }
                            onClick={() =>
                              editFormula(
                                formula.id,
                              )
                            }
                          >
                            <Pencil
                              size={18}
                              aria-hidden="true"
                            />

                            <span>
                              Editar
                            </span>
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <div
              className={
                styles.mobileList
              }
            >
              {cookingFormulas.map(
                (formula) => (
                  <article
                    key={formula.id}
                    className={
                      styles.card
                    }
                  >
                    <header
                      className={
                        styles.cardHeader
                      }
                    >
                      <div>
                        <h2>
                          {formula.nombre}
                        </h2>

                        {formula.descripcion && (
                          <p>
                            {
                              formula.descripcion
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className={
                          formula.activa
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        {formula.activa
                          ? 'Activa'
                          : 'Inactiva'}
                      </span>
                    </header>

                    <dl
                      className={
                        styles.cardDetails
                      }
                    >
                      <div>
                        <dt>
                          Ítems incluidos
                        </dt>

                        <dd>
                          {
                            formula.items.length
                          }{' '}
                          {formula.items
                            .length === 1
                            ? 'ítem'
                            : 'ítems'}
                        </dd>
                      </div>

                      <div>
                        <dt>Modificada</dt>

                        <dd>
                          {formatDate(
                            formula.actualizadoEn,
                          )}
                        </dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      className={
                        styles.editButton
                      }
                      onClick={() =>
                        editFormula(
                          formula.id,
                        )
                      }
                    >
                      <Pencil
                        size={18}
                        aria-hidden="true"
                      />

                      <span>Editar</span>
                    </button>
                  </article>
                ),
              )}
            </div>
          </>
        )}
    </section>
  );
}