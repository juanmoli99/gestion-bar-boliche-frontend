import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowLeft,
  CircleAlert,
  CircleX,
  LoaderCircle,
  PackageSearch,
  Save,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  loadInventoryStocks,
  saveBulkInventoryCount,
} from '../services/inventory.service';

import type {
  InventoryStock,
  TipoInventario,
} from '../types/inventory.types';

import styles from './InventoryCountPage.module.css';

interface StockCountValues {
  salon: string;
  deposito: string;
}

type StockCounts = Record<
  string,
  StockCountValues
>;

const INVENTORY_ORDER:
  TipoInventario[] = [
    'BEBIDAS',
    'COCINA',
    'LIMPIEZA',
    'VARIOS',
  ];

const INVENTORY_LABELS: Record<
  TipoInventario,
  string
> = {
  BEBIDAS: 'Barra',
  COCINA: 'Cocina',
  LIMPIEZA: 'Limpieza',
  VARIOS: 'Varios',
};

function parseCountValue(
  value: string,
): number | null {
  const normalizedValue =
    value.trim().replace(',', '.');

  if (
    !/^\d+(?:\.\d{0,3})?$/.test(
      normalizedValue,
    )
  ) {
    return null;
  }

  const parsedValue =
    Number(normalizedValue);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 0
  ) {
    return null;
  }

  return parsedValue;
}

function calculateTotal(
  values:
    | StockCountValues
    | undefined,
): number | null {
  if (!values) {
    return null;
  }

  const salon =
    parseCountValue(
      values.salon,
    );

  const deposito =
    parseCountValue(
      values.deposito,
    );

  if (
    salon === null ||
    deposito === null
  ) {
    return null;
  }

  return Number(
    (
      salon +
      deposito
    ).toFixed(3),
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

export function InventoryCountPage() {
  const navigate =
    useNavigate();

  const [stocks, setStocks] =
    useState<InventoryStock[]>([]);

  const [
    stockCounts,
    setStockCounts,
  ] = useState<StockCounts>({});

  const [loading, setLoading] =
    useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null,
  );

  const load = useCallback(
    async () => {
      setLoading(true);
      setLoadError(false);
      setSaveError(null);

      try {
        const data =
          await loadInventoryStocks();

        const initialCounts =
          Object.fromEntries(
            data.map(
              (stock) => [
                stock.id,
                {
                  salon: '0',
                  deposito: '0',
                },
              ],
            ),
          ) as StockCounts;

        setStocks(data);
        setStockCounts(
          initialCounts,
        );
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const groupedStocks =
    useMemo(
      () =>
        INVENTORY_ORDER.map(
          (inventory) => ({
            inventory,
            label:
              INVENTORY_LABELS[
                inventory
              ],
            stocks:
              stocks.filter(
                (stock) =>
                  stock.inventario ===
                  inventory,
              ),
          }),
        ).filter(
          (group) =>
            group.stocks.length > 0,
        ),
      [stocks],
    );

  const invalidStockIds =
    useMemo(() => {
      const invalidIds =
        new Set<string>();

      for (const stock of stocks) {
        const values =
          stockCounts[stock.id];

        if (
          calculateTotal(
            values,
          ) === null
        ) {
          invalidIds.add(
            stock.id,
          );
        }
      }

      return invalidIds;
    }, [
      stockCounts,
      stocks,
    ]);

  function updateCount(
    stockId: string,
    field:
      | 'salon'
      | 'deposito',
    value: string,
  ) {
    setStockCounts(
      (currentCounts) => ({
        ...currentCounts,

        [stockId]: {
          salon:
            currentCounts[
              stockId
            ]?.salon ?? '0',

          deposito:
            currentCounts[
              stockId
            ]?.deposito ?? '0',

          [field]: value,
        },
      }),
    );

    setSaveError(null);
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      stocks.length === 0
    ) {
      return;
    }

    if (
      invalidStockIds.size > 0
    ) {
      setSaveError(
        'Revisá los valores marcados. Todos los campos deben contener un número igual o mayor que cero, con hasta tres decimales.',
      );

      return;
    }

    const items =
      stocks.map(
        (stock) => ({
          stockId:
            stock.id,

          cantidadContada:
            calculateTotal(
              stockCounts[
                stock.id
              ],
            ) ?? 0,
        }),
      );

    setSaving(true);
    setSaveError(null);

    try {
      await saveBulkInventoryCount({
        items,
      });

      navigate(
        '/inventario',
      );
    } catch {
      setSaveError(
        'No se pudo guardar el conteo. No se aplicó ningún cambio al inventario.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate(
                '/inventario',
              )
            }
            disabled={saving}
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
            />

            Volver
          </Button>

          <div>
            <h1 className={styles.title}>
              Conteo de inventario
            </h1>

            <p
              className={
                styles.description
              }
            >
              Registrá las existencias
              encontradas en el salón y
              en el depósito.
            </p>
          </div>
        </div>
      </header>

      {!loading &&
        !loadError &&
        stocks.length > 0 && (
          <section
            className={styles.notice}
          >
            <CircleAlert
              size={22}
              aria-hidden="true"
            />

            <p>
              Todos los campos comienzan
              en cero. El stock que se
              guardará será la suma del
              salón y el depósito.
            </p>
          </section>
        )}

      {loading && (
        <section
          className={styles.loading}
        >
          <LoaderCircle
            size={32}
            aria-hidden="true"
          />

          <p>
            Cargando inventario...
          </p>
        </section>
      )}

      {!loading &&
        loadError && (
          <section
            className={
              styles.errorState
            }
          >
            <CircleX
              size={32}
              aria-hidden="true"
            />

            <div>
              <h2>
                No se pudo cargar el
                inventario
              </h2>

              <p>
                Verificá la conexión e
                intentá nuevamente.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                void load()
              }
            >
              Reintentar
            </Button>
          </section>
        )}

      {!loading &&
        !loadError &&
        stocks.length === 0 && (
          <section
            className={
              styles.emptyState
            }
          >
            <PackageSearch
              size={36}
              aria-hidden="true"
            />

            <div>
              <h2>
                No hay ítems para contar
              </h2>

              <p>
                Todavía no existen
                registros de stock.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !loadError &&
        stocks.length > 0 && (
          <form
            className={styles.form}
            onSubmit={
              handleSubmit
            }
          >
            {groupedStocks.map(
              (group) => (
                <section
                  key={
                    group.inventory
                  }
                  className={
                    styles.inventorySection
                  }
                >
                  <header
                    className={
                      styles.sectionHeader
                    }
                  >
                    <div>
                      <h2>
                        {group.label}
                      </h2>

                      <p>
                        {
                          group.stocks
                            .length
                        }{' '}
                        {group.stocks
                          .length === 1
                          ? 'ítem'
                          : 'ítems'}
                      </p>
                    </div>
                  </header>

                  <div
                    className={
                      styles.tableWrapper
                    }
                  >
                    <table
                      className={
                        styles.table
                      }
                    >
                      <thead>
                        <tr>
                          <th>
                            Ítem
                          </th>

                          <th>
                            Unidad
                          </th>

                          <th>
                            Salón
                          </th>

                          <th>
                            Depósito
                          </th>

                          <th>
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {group.stocks.map(
                          (stock) => {
                            const values =
                              stockCounts[
                                stock.id
                              ];

                            const total =
                              calculateTotal(
                                values,
                              );

                            const invalid =
                              invalidStockIds.has(
                                stock.id,
                              );

                            return (
                              <tr
                                key={
                                  stock.id
                                }
                                className={
                                  invalid
                                    ? styles.invalidRow
                                    : undefined
                                }
                              >
                                <td>
                                  <div
                                    className={
                                      styles.itemInformation
                                    }
                                  >
                                    <strong>
                                      {
                                        stock.itemNombre
                                      }
                                    </strong>

                                    <span>
                                      {
                                        stock.categoriaNombre
                                      }
                                    </span>
                                  </div>
                                </td>

                                <td>
                                  {
                                    stock.abreviaturaUnidad
                                  }
                                </td>

                                <td>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    value={
                                      values?.salon ??
                                      '0'
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      updateCount(
                                        stock.id,
                                        'salon',
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    onFocus={(
                                      event,
                                    ) =>
                                      event.currentTarget.select()
                                    }
                                    disabled={
                                      saving
                                    }
                                    aria-label={`Cantidad de ${stock.itemNombre} en salón`}
                                    className={
                                      invalid
                                        ? styles.invalidInput
                                        : undefined
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    value={
                                      values?.deposito ??
                                      '0'
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      updateCount(
                                        stock.id,
                                        'deposito',
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    onFocus={(
                                      event,
                                    ) =>
                                      event.currentTarget.select()
                                    }
                                    disabled={
                                      saving
                                    }
                                    aria-label={`Cantidad de ${stock.itemNombre} en depósito`}
                                    className={
                                      invalid
                                        ? styles.invalidInput
                                        : undefined
                                    }
                                  />
                                </td>

                                <td>
                                  <strong
                                    className={
                                      styles.total
                                    }
                                  >
                                    {total ===
                                    null
                                      ? '—'
                                      : formatQuantity(
                                          total,
                                        )}{' '}
                                    <small>
                                      {
                                        stock.abreviaturaUnidad
                                      }
                                    </small>
                                  </strong>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              ),
            )}

            {saveError && (
              <section
                className={
                  styles.saveError
                }
                role="alert"
              >
                <CircleAlert
                  size={21}
                  aria-hidden="true"
                />

                <p>
                  {saveError}
                </p>
              </section>
            )}

            <footer
              className={styles.actions}
            >
              <div>
                <strong>
                  {stocks.length}
                </strong>{' '}
                {stocks.length === 1
                  ? 'ítem será procesado'
                  : 'ítems serán procesados'}
              </div>

              <Button
                type="submit"
                disabled={
                  saving ||
                  invalidStockIds.size >
                    0
                }
              >
                {saving ? (
                  <LoaderCircle
                    size={18}
                    aria-hidden="true"
                  />
                ) : (
                  <Save
                    size={18}
                    aria-hidden="true"
                  />
                )}

                {saving
                  ? 'Guardando...'
                  : 'Guardar conteo'}
              </Button>
            </footer>
          </form>
        )}
    </section>
  );
}