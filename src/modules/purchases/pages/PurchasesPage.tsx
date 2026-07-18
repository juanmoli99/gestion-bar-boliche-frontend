import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CircleAlert,
  CircleX,
  PackageCheck,
  Search,
  ShoppingCart,
  Warehouse,
} from 'lucide-react';

import {
  Button,
} from '../../../components/ui/Button';

import {
  loadInventoryStocks,
} from '../../inventory/services/inventory.service';

import type {
  InventoryStock,
  TipoInventario,
} from '../../inventory/types/inventory.types';

import styles from './PurchasesPage.module.css';

type InventoryFilter =
  | 'TODOS'
  | TipoInventario;

const INVENTORY_LABELS: Record<
  TipoInventario,
  string
> = {
  BEBIDAS: 'Barra',
  COCINA: 'Cocina',
  LIMPIEZA: 'Limpieza',
  VARIOS: 'Varios',
};

function parseQuantity(
  value: string | null,
): number | null {
  if (value === null) {
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

function isCriticalStock(
  stock: InventoryStock,
): boolean {
  const current =
    parseQuantity(
      stock.cantidadActual,
    );

  const minimum =
    parseQuantity(
      stock.cantidadMinima,
    );

  if (
    current === null ||
    minimum === null
  ) {
    return false;
  }

  return current <= minimum;
}



export function PurchasesPage() {
  const [stocks, setStocks] =
    useState<InventoryStock[]>([]);

  const [search, setSearch] =
    useState('');

  const [
    inventoryFilter,
    setInventoryFilter,
  ] = useState<InventoryFilter>(
    'TODOS',
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(false);

      try {
        const data =
          await loadInventoryStocks();

        setStocks(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const criticalStocks =
    useMemo(
      () =>
        stocks.filter(
          isCriticalStock,
        ),
      [stocks],
    );

  const affectedZones =
    useMemo(
      () =>
        new Set(
          criticalStocks.map(
            (stock) =>
              stock.inventario,
          ),
        ).size,
      [criticalStocks],
    );

  const filteredStocks =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            'es-AR',
          );

      return criticalStocks.filter(
        (stock) => {
          const matchesInventory =
            inventoryFilter ===
              'TODOS' ||
            stock.inventario ===
              inventoryFilter;

          const matchesSearch =
            !normalizedSearch ||
            stock.itemNombre
              .toLocaleLowerCase(
                'es-AR',
              )
              .includes(
                normalizedSearch,
              ) ||
            stock.categoriaNombre
              .toLocaleLowerCase(
                'es-AR',
              )
              .includes(
                normalizedSearch,
              );

          return (
            matchesInventory &&
            matchesSearch
          );
        },
      );
    }, [
      criticalStocks,
      inventoryFilter,
      search,
    ]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Compras
          </h1>

          <p className={styles.description}>
            Ítems del inventario que alcanzaron o quedaron por debajo de su stock mínimo.
          </p>
        </div>
      </header>

      {!loading && !error && (
        <section
          className={styles.summary}
          aria-label="Resumen de reposición"
        >
          <article
            className={
              styles.summaryCard
            }
          >
            <ShoppingCart
              size={24}
              aria-hidden="true"
            />

            <div>
              <span>
                Ítems para reponer
              </span>

              <strong>
                {
                  criticalStocks.length
                }
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <Warehouse
              size={24}
              aria-hidden="true"
            />

            <div>
              <span>
                Zonas afectadas
              </span>

              <strong>
                {affectedZones}
              </strong>
            </div>
          </article>
        </section>
      )}

      {!loading && !error && (
        <section className={styles.filters}>
          <label className={styles.search}>
            <Search
              size={18}
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Buscar por ítem o categoría"
              aria-label="Buscar ítems para reponer"
            />
          </label>

          <label
            className={
              styles.inventoryFilter
            }
          >
            <span>Zona</span>

            <select
              value={inventoryFilter}
              onChange={(event) =>
                setInventoryFilter(
                  event.target
                    .value as
                    InventoryFilter,
                )
              }
            >
              <option value="TODOS">
                Todas
              </option>

              <option value="BEBIDAS">
                Barra
              </option>

              <option value="COCINA">
                Cocina
              </option>

              <option value="LIMPIEZA">
                Limpieza
              </option>

              <option value="VARIOS">
                Varios
              </option>
            </select>
          </label>
        </section>
      )}

      {loading && (
        <section className={styles.loading}>
          <span />
          <span />
          <span />
          <span />
        </section>
      )}

      {!loading && error && (
        <section
          className={
            styles.errorState
          }
        >
          <CircleX
            size={30}
            aria-hidden="true"
          />

          <div>
            <h2>
              No se pudo cargar el inventario
            </h2>

            <p>
              Verificá la conexión e intentá nuevamente.
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
        !error &&
        criticalStocks.length ===
          0 && (
          <section
            className={
              styles.emptyState
            }
          >
            <PackageCheck
              size={36}
              aria-hidden="true"
            />

            <div>
              <h2>
                No hay ítems para reponer
              </h2>

              <p>
                Todo el inventario se encuentra por encima de sus niveles mínimos.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        criticalStocks.length >
          0 &&
        filteredStocks.length ===
          0 && (
          <section
            className={
              styles.emptyState
            }
          >
            <Search
              size={32}
              aria-hidden="true"
            />

            <div>
              <h2>
                No hay resultados
              </h2>

              <p>
                Probá con otro nombre, categoría o zona.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        filteredStocks.length >
          0 && (
          <section
            className={
              styles.tableSection
            }
          >
            <header
              className={
                styles.tableHeader
              }
            >
              <div>
                <h2>
                  Lista de reposición
                </h2>

                <p>
                  {
                    filteredStocks.length
                  }{' '}
                  {filteredStocks.length ===
                  1
                    ? 'ítem'
                    : 'ítems'}
                </p>
              </div>

              <CircleAlert
                size={22}
                aria-hidden="true"
              />
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
                    <th>Ítem</th>
                    <th>Zona</th>
                    <th>Stock actual</th>
                    <th>Stock mínimo</th>                    
                  </tr>
                </thead>

                <tbody>
                  {filteredStocks.map(
                    (stock) => {
                      const current =
                        parseQuantity(
                          stock.cantidadActual,
                        ) ?? 0;

                      const minimum =
                        parseQuantity(
                          stock.cantidadMinima,
                        ) ?? 0;                      

                      return (
                        <tr
                          key={stock.id}
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
                            <span
                              className={
                                styles.inventoryBadge
                              }
                            >
                              {
                                INVENTORY_LABELS[
                                  stock.inventario
                                ]
                              }
                            </span>
                          </td>

                          <td>
                            <strong
                              className={
                                styles.currentStock
                              }
                            >
                              {formatQuantity(
                                current,
                              )}{' '}
                              <small>
                                {
                                  stock.abreviaturaUnidad
                                }
                              </small>
                            </strong>
                          </td>

                          <td>
                            <strong>
                              {formatQuantity(
                                minimum,
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
        )}
    </section>
  );
}