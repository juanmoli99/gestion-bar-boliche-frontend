import {
  useEffect,
  useState,
} from 'react';

import {
  CircleAlert,
  FlaskConical,
  Pencil,
  Plus,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  loadFormulas,
} from '../services/formulas.service';

import type {
  FormulaListItem,
} from '../types/formulas.types';

import styles from './FormulasPage.module.css';

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

  const [formulas, setFormulas] =
    useState<FormulaListItem[]>([]);

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
        const data =
          await loadFormulas();

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
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  function createFormula() {
    navigate('/formulas/nueva');
  }

  function editFormula(
    formulaId: string,
  ) {
    navigate(
      `/formulas/${formulaId}/editar`,
    );
  }

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
            Configurá el consumo estimado por
            persona para las reservas de fiesta.
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

          Nueva fórmula
        </Button>
      </header>

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
        formulas.length === 0 && (
          <div
            className={
              styles.emptyState
            }
          >
            <FlaskConical
              size={38}
              aria-hidden="true"
            />

            <div>
              <strong>
                No hay fórmulas creadas
              </strong>

              <p>
                Creá la primera fórmula para
                asignarla a las reservas de
                fiesta.
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
                <colgroup>
                  <col
                    className={
                      styles.nameColumn
                    }
                  />

                  <col
                    className={
                      styles.statusColumn
                    }
                  />

                  <col
                    className={
                      styles.versionColumn
                    }
                  />

                  <col
                    className={
                      styles.dateColumn
                    }
                  />

                  <col
                    className={
                      styles.actionsColumn
                    }
                  />
                </colgroup>

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
                              {
                                formula.nombre
                              }
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
                            aria-label={`Editar ${formula.nombre}`}
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
                        <dt>
                          Modificada
                        </dt>

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