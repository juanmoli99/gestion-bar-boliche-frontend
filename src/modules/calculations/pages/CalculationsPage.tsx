import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  Calculator,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  CircleX,
  PackageSearch,
  PartyPopper,
  Users,
} from 'lucide-react';

import {
  Button,
} from '../../../components/ui/Button';

import {
  runPurchaseCalculation,
} from '../services/calculations.service';

import type {
  CalculationFormState,
  CalculationResult,
} from '../types/calculations.types';

import styles from './CalculationsPage.module.css';

function formatInputDate(
  date: Date,
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, '0');

  const day =
    String(
      date.getDate(),
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createInitialForm():
CalculationFormState {
  const today = new Date();

  const nextWeek =
    new Date(today);

  nextWeek.setDate(
    today.getDate() + 7,
  );

  return {
    fechaDesde:
      formatInputDate(today),
    fechaHasta:
      formatInputDate(nextWeek),
  };
}

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(
    new Date(
      `${value.slice(0, 10)}T12:00:00`,
    ),
  );
}

function formatDateTime(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  );
}

function formatQuantity(
  value: number,
): string {
  return new Intl.NumberFormat(
    'es-AR',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    },
  ).format(value);
}

export function CalculationsPage() {
  const [form, setForm] =
    useState<CalculationFormState>(
      createInitialForm,
    );

  const [result, setResult] =
    useState<CalculationResult | null>(
      null,
    );

  const [calculating, setCalculating] =
    useState(false);

  const [error, setError] =
    useState('');

  const totalCalculatedItems =
    useMemo(
      () =>
        result?.totalesPorItem
          .length ?? 0,
      [result],
    );

  function handleChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (
      !form.fechaDesde ||
      !form.fechaHasta
    ) {
      setError(
        'Ingresá ambas fechas.',
      );

      return;
    }

    if (
      form.fechaDesde >
      form.fechaHasta
    ) {
      setError(
        'La fecha desde no puede ser posterior a la fecha hasta.',
      );

      return;
    }

    setCalculating(true);

    try {
      const calculation =
        await runPurchaseCalculation({
          fechaDesde:
            form.fechaDesde,
          fechaHasta:
            form.fechaHasta,
        });

      setResult(calculation);
    } catch {
      setError(
        'No se pudo realizar el cálculo. Verificá que existan fiestas confirmadas con una fórmula configurada.',
      );
    } finally {
      setCalculating(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Cálculos
          </h1>

          <p className={styles.description}>
            Calculá los productos necesarios para las fiestas confirmadas dentro de un período.
          </p>
        </div>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formTitle}>
          <CalendarDays
            size={23}
            aria-hidden="true"
          />

          <div>
            <h2>
              Período del cálculo
            </h2>

            <p>
              Se incluirán solamente las reservas de tipo fiesta que estén confirmadas.
            </p>
          </div>
        </div>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span>Desde</span>

            <input
              type="date"
              name="fechaDesde"
              value={form.fechaDesde}
              onChange={handleChange}
              disabled={calculating}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Hasta</span>

            <input
              type="date"
              name="fechaHasta"
              value={form.fechaHasta}
              onChange={handleChange}
              disabled={calculating}
              required
            />
          </label>

          <Button
            type="submit"
            isLoading={calculating}
            loadingText="Calculando..."
          >
            <Calculator
              size={19}
              aria-hidden="true"
            />

            Calcular
          </Button>
        </div>

        {error && (
          <div
            className={styles.errorMessage}
            role="alert"
          >
            <CircleX
              size={19}
              aria-hidden="true"
            />

            <span>{error}</span>
          </div>
        )}
      </form>

      {!result && (
        <section
          className={styles.initialState}
        >
          <PackageSearch
            size={38}
            aria-hidden="true"
          />

          <div>
            <h2>
              Seleccioná un período
            </h2>

            <p>
              El sistema utilizará las fórmulas asignadas a cada fiesta para calcular las cantidades necesarias.
            </p>
          </div>
        </section>
      )}

      {result && (
        <>
          <section
            className={styles.summary}
            aria-label="Resumen del cálculo"
          >
            <article
              className={styles.summaryCard}
            >
              <PartyPopper
                size={24}
                aria-hidden="true"
              />

              <div>
                <span>Fiestas</span>

                <strong>
                  {result.cantidadFiestas}
                </strong>
              </div>
            </article>

            <article
              className={styles.summaryCard}
            >
              <Users
                size={24}
                aria-hidden="true"
              />

              <div>
                <span>Personas</span>

                <strong>
                  {
                    result
                      .cantidadPersonasTotal
                  }
                </strong>
              </div>
            </article>

            <article
              className={styles.summaryCard}
            >
              <PackageSearch
                size={24}
                aria-hidden="true"
              />

              <div>
                <span>
                  Productos calculados
                </span>

                <strong>
                  {totalCalculatedItems}
                </strong>
              </div>
            </article>
          </section>

          <section
            className={styles.period}
          >
            <CalendarDays
              size={19}
              aria-hidden="true"
            />

            <span>
              Período:
              {' '}
              <strong>
                {formatDate(
                  result.fechaDesde,
                )}
              </strong>
              {' — '}
              <strong>
                {formatDate(
                  result.fechaHasta,
                )}
              </strong>
            </span>
          </section>

          {result.cantidadFiestas ===
            0 && (
            <section
              className={styles.emptyState}
            >
              <CircleAlert
                size={36}
                aria-hidden="true"
              />

              <div>
                <h2>
                  No hay fiestas confirmadas
                </h2>

                <p>
                  No se encontraron fiestas confirmadas dentro del período seleccionado.
                </p>
              </div>
            </section>
          )}

          {result.totalesPorItem.length >
            0 && (
            <section
              className={
                styles.resultsSection
              }
            >
              <header
                className={
                  styles.sectionHeader
                }
              >
                <div>
                  <h2>
                    Totales por producto
                  </h2>

                  <p>
                    Cantidad total necesaria para todo el período.
                  </p>
                </div>
              </header>

              <div
                className={
                  styles.tableWrapper
                }
              >
                <table
                  className={styles.table}
                >
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>
                        Cantidad necesaria
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.totalesPorItem.map(
                      (item) => (
                        <tr key={item.itemId}>
                          <td>
                            <strong>
                              {
                                item.nombreItem
                              }
                            </strong>
                          </td>

                          <td>
                            <strong
                              className={
                                styles.quantity
                              }
                            >
                              {formatQuantity(
                                item
                                  .cantidadNecesaria,
                              )}
                            </strong>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {result.desglosePorFecha
            .length > 0 && (
            <section
              className={
                styles.breakdownSection
              }
            >
              <header
                className={
                  styles.sectionHeading
                }
              >
                <h2>
                  Desglose por fecha
                </h2>

                <p>
                  Cantidades agrupadas por día.
                </p>
              </header>

              <div
                className={
                  styles.detailsList
                }
              >
                {result.desglosePorFecha.map(
                  (date) => (
                    <details
                      key={date.fecha}
                      className={
                        styles.detailsCard
                      }
                    >
                      <summary>
                        <div
                          className={
                            styles.detailsSummary
                          }
                        >
                          <CalendarDays
                            size={20}
                            aria-hidden="true"
                          />

                          <div>
                            <strong>
                              {formatDate(
                                date.fecha,
                              )}
                            </strong>

                            <span>
                              {
                                date.cantidadFiestas
                              }{' '}
                              {date.cantidadFiestas ===
                              1
                                ? 'fiesta'
                                : 'fiestas'}
                              {' · '}
                              {
                                date.cantidadPersonas
                              }{' '}
                              personas
                            </span>
                          </div>
                        </div>

                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                        />
                      </summary>

                      <div
                        className={
                          styles.detailsContent
                        }
                      >
                        {date.items.map(
                          (item) => (
                            <div
                              key={
                                item.itemId
                              }
                              className={
                                styles.itemRow
                              }
                            >
                              <span>
                                {
                                  item.nombreItem
                                }
                              </span>

                              <strong>
                                {formatQuantity(
                                  item
                                    .cantidadNecesaria,
                                )}
                              </strong>
                            </div>
                          ),
                        )}
                      </div>
                    </details>
                  ),
                )}
              </div>
            </section>
          )}

          {result.reservas.length > 0 && (
            <section
              className={
                styles.breakdownSection
              }
            >
              <header
                className={
                  styles.sectionHeading
                }
              >
                <h2>
                  Fiestas incluidas
                </h2>

                <p>
                  Detalle de las reservas utilizadas para el cálculo.
                </p>
              </header>

              <div
                className={
                  styles.detailsList
                }
              >
                {result.reservas.map(
                  (reservation) => (
                    <details
                      key={
                        reservation.reservaId
                      }
                      className={
                        styles.detailsCard
                      }
                    >
                      <summary>
                        <div
                          className={
                            styles.detailsSummary
                          }
                        >
                          <PartyPopper
                            size={20}
                            aria-hidden="true"
                          />

                          <div>
                            <strong>
                              {
                                reservation
                                  .nombreCliente
                              }
                            </strong>

                            <span>
                              {formatDateTime(
                                reservation
                                  .fechaHora,
                              )}
                              {' · '}
                              {
                                reservation
                                  .cantidadPersonas
                              }{' '}
                              personas
                            </span>
                          </div>
                        </div>

                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                        />
                      </summary>

                      <div
                        className={
                          styles.reservationContent
                        }
                      >
                        <div
                          className={
                            styles.formula
                          }
                        >
                          <span>Fórmula</span>

                          <strong>
                            {
                              reservation.formula
                            }
                          </strong>

                          <small>
                            Versión{' '}
                            {
                              reservation
                                .numeroVersion
                            }
                          </small>
                        </div>

                        <div>
                          {reservation.items.map(
                            (item) => (
                              <div
                                key={
                                  item.itemId
                                }
                                className={
                                  styles.itemRow
                                }
                              >
                                <span>
                                  {
                                    item.nombreItem
                                  }
                                </span>

                                <strong>
                                  {formatQuantity(
                                    item
                                      .cantidadNecesaria,
                                  )}
                                </strong>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </details>
                  ),
                )}
              </div>
            </section>
          )}
        </>
      )}
    </section>
  );
}