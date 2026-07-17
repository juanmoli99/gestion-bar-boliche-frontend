import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CircleAlert,
  CircleX,
  ClipboardList,
  LoaderCircle,
  Package,
  PackagePlus,
  Search,
  Trash2,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  useAuth,
} from '../../auth/hooks/useAuth';

import {
  loadInventoryStocks,
  removeInventoryItem,
} from '../services/inventory.service';

import type {
  InventoryStock,
  TipoInventario,
} from '../types/inventory.types';

import styles from './InventoryPage.module.css';

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
  value: string | null,
): string {
  const parsedValue =
    parseQuantity(value);

  if (parsedValue === null) {
    return '—';
  }

  return new Intl.NumberFormat(
    'es-AR',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    },
  ).format(parsedValue);
}

function formatUpdatedDate(
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
      hour12: false,
    },
  ).format(
    new Date(value),
  );
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

export function InventoryPage() {
  const navigate =
    useNavigate();

  const {
    usuario,
  } = useAuth();

  const isAdministrator =
    usuario?.rol ===
    'ADMINISTRADOR';

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

  const [
    deletingItemId,
    setDeletingItemId,
  ] = useState<string | null>(
    null,
  );

  const [
    deleteError,
    setDeleteError,
  ] = useState<string | null>(
    null,
  );

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(false);
      setDeleteError(null);

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

  const criticalCount =
    useMemo(
      () =>
        stocks.filter(
          isCriticalStock,
        ).length,
      [stocks],
    );

  const filteredStocks =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            'es-AR',
          );

      return stocks.filter(
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
      inventoryFilter,
      search,
      stocks,
    ]);

  async function handleDeactivateItem(
    stock: InventoryStock,
  ) {
    if (
      !isAdministrator ||
      deletingItemId !== null
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `¿Querés eliminar “${stock.itemNombre}” del inventario?\n\nEl ítem será desactivado y dejará de aparecer, pero se conservará su historial.`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingItemId(
      stock.itemId,
    );

    setDeleteError(null);

    try {
      await removeInventoryItem(
        stock.itemId,
      );

      setStocks(
        (currentStocks) =>
          currentStocks.filter(
            (currentStock) =>
              currentStock.itemId !==
              stock.itemId,
          ),
      );
    } catch {
      setDeleteError(
        `No se pudo eliminar “${stock.itemNombre}”. Intentá nuevamente.`,
      );
    } finally {
      setDeletingItemId(null);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Inventario
          </h1>

          <p className={styles.description}>
            Control de existencias y niveles mínimos de stock.
          </p>
        </div>

        <div className={styles.headerActions}>
        {isAdministrator && (
            <Button
            type="button"
            onClick={() =>
                navigate(
                '/inventario/nuevo',
                )
            }
            >
            <PackagePlus
                size={18}
                aria-hidden="true"
            />

            Agregar ítem
            </Button>
        )}

        <Button
            type="button"
            variant="secondary"
            onClick={() =>
            navigate(
                '/inventario/conteo',
            )
            }
        >
            <ClipboardList
            size={18}
            aria-hidden="true"
            />

            Realizar conteo
        </Button>
        </div>
      </header>

      {!loading && !error && (
        <section
          className={styles.summary}
          aria-label="Resumen de inventario"
        >
          <article className={styles.summaryCard}>
            <Package
              size={24}
              aria-hidden="true"
            />

            <div>
              <span>
                Ítems con stock
              </span>

              <strong>
                {stocks.length}
              </strong>
            </div>
          </article>

          <article
            className={[
              styles.summaryCard,
              criticalCount > 0
                ? styles.summaryCritical
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <CircleAlert
              size={24}
              aria-hidden="true"
            />

            <div>
              <span>
                Stock crítico
              </span>

              <strong>
                {criticalCount}
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
              aria-label="Buscar inventario"
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

      {deleteError && (
        <section
          className={
            styles.deleteError
          }
          role="alert"
        >
          <CircleAlert
            size={20}
            aria-hidden="true"
          />

          <p>
            {deleteError}
          </p>
        </section>
      )}

      {loading && (
        <section className={styles.loading}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </section>
      )}

      {!loading && error && (
        <section className={styles.errorState}>
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
        stocks.length === 0 && (
          <section className={styles.emptyState}>
            <Package
              size={34}
              aria-hidden="true"
            />

            <div>
              <h2>
                No hay existencias registradas
              </h2>

              <p>
                Todavía no se creó stock para ningún ítem.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        stocks.length > 0 &&
        filteredStocks.length === 0 && (
          <section className={styles.emptyState}>
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
        filteredStocks.length > 0 && (
          <section className={styles.stockGrid}>
            {filteredStocks.map(
              (stock) => {
                const critical =
                  isCriticalStock(
                    stock,
                  );

                const deleting =
                  deletingItemId ===
                  stock.itemId;

                return (
                  <article
                    key={stock.id}
                    className={[
                      styles.stockCard,
                      critical
                        ? styles.criticalCard
                        : '',
                      deleting
                        ? styles.deletingCard
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <header
                      className={
                        styles.stockHeader
                      }
                    >
                      <div>
                        <h2>
                          {stock.itemNombre}
                        </h2>

                        <p>
                          {
                            stock.categoriaNombre
                          }
                        </p>
                      </div>

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
                    </header>

                    <div
                      className={
                        styles.quantity
                      }
                    >
                      <span>
                        Stock actual
                      </span>

                      <strong>
                        {formatQuantity(
                          stock.cantidadActual,
                        )}{' '}
                        <small>
                          {
                            stock.abreviaturaUnidad
                          }
                        </small>
                      </strong>
                    </div>

                    <div
                      className={
                        styles.stockDetails
                      }
                    >
                      <div>
                        <span>
                          Stock mínimo
                        </span>

                        <strong>
                          {stock.cantidadMinima ===
                          null
                            ? 'Sin definir'
                            : `${formatQuantity(
                                stock.cantidadMinima,
                              )} ${
                                stock.abreviaturaUnidad
                              }`}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Estado
                        </span>

                        <strong
                          className={
                            critical
                              ? styles.criticalStatus
                              : styles.normalStatus
                          }
                        >
                          {critical
                            ? 'Stock crítico'
                            : 'Disponible'}
                        </strong>
                      </div>
                    </div>

                    <footer
                      className={
                        styles.stockFooter
                      }
                    >
                      <span>
                        Actualizado el{' '}
                        {formatUpdatedDate(
                          stock.actualizadoEn,
                        )}
                      </span>

                      {isAdministrator && (
                        <button
                          type="button"
                          className={
                            styles.deleteButton
                          }
                          onClick={() =>
                            void handleDeactivateItem(
                              stock,
                            )
                          }
                          disabled={
                            deletingItemId !==
                            null
                          }
                          aria-label={`Eliminar ${stock.itemNombre}`}
                        >
                          {deleting ? (
                            <LoaderCircle
                              size={16}
                              aria-hidden="true"
                            />
                          ) : (
                            <Trash2
                              size={16}
                              aria-hidden="true"
                            />
                          )}

                          {deleting
                            ? 'Eliminando...'
                            : 'Eliminar'}
                        </button>
                      )}
                    </footer>
                  </article>
                );
              },
            )}
          </section>
        )}
    </section>
  );
}