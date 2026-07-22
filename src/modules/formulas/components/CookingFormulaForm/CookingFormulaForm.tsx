import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import {
  CircleAlert,
  PackageSearch,
  Save,
  Search,
} from 'lucide-react';

import {
  Button,
} from '../../../../components/ui/Button';

import {
  TextInput,
} from '../../../../components/forms/TextInput';

import {
  loadInventoryStocks,
} from '../../../inventory/services/inventory.service';

import type {
  InventoryStock,
} from '../../../inventory/types/inventory.types';

import {
  loadCookingFormula,
  saveCookingFormula,
  saveCookingFormulaChanges,
} from '../../services/formulas.service';

import type {
  CookingFormula,
  SaveCookingFormulaRequest,
} from '../../types/formulas.types';

import styles from '../FormulaForm/FormulaForm.module.css';

interface CookingFormulaFormProps {
  formulaId?: string;

  onCancel(): void;

  onSuccess(
    formulaId: string,
  ): void;
}

interface FormState {
  nombre: string;
  descripcion: string;
  cantidades: Record<string, string>;
}

const INITIAL_STATE: FormState = {
  nombre: '',
  descripcion: '',
  cantidades: {},
};

interface AvailableItem {
  itemId: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  abreviaturaUnidad: string;
  inventario: string;
}

function createStateFromFormula(
  formula: CookingFormula,
): FormState {
  const cantidades:
    Record<string, string> = {};

  for (const item of formula.items) {
    cantidades[item.itemId] =
      String(
        item.cantidadPorPersona,
      );
  }

  return {
    nombre: formula.nombre,

    descripcion:
      formula.descripcion ?? '',

    cantidades,
  };
}

function normalizeText(
  value: string,
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase();
}

function getInventoryLabel(
  inventory: string,
): string {
  const labels:
    Record<string, string> = {
      BEBIDAS: 'Barra',
      COCINA: 'Cocina',
      LIMPIEZA: 'Limpieza',
      VARIOS: 'Varios',
    };

  return labels[inventory] ??
    inventory;
}

export function CookingFormulaForm({
  formulaId,
  onCancel,
  onSuccess,
}: CookingFormulaFormProps) {
  const editing =
    Boolean(formulaId);

  const [form, setForm] =
    useState<FormState>(
      INITIAL_STATE,
    );

  const [stocks, setStocks] =
    useState<InventoryStock[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const inventoryStocks =
          await loadInventoryStocks();

        if (!active) {
          return;
        }

        setStocks(
          inventoryStocks,
        );

        if (formulaId) {
          const formula =
            await loadCookingFormula(
              formulaId,
            );

          if (!active) {
            return;
          }

          setForm(
            createStateFromFormula(
              formula,
            ),
          );
        }
      } catch {
        if (active) {
          setError(
            editing
              ? 'No se pudo cargar la fórmula de cocina.'
              : 'No se pudieron cargar los ítems del inventario.',
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
  }, [
    editing,
    formulaId,
  ]);

  const availableItems =
  useMemo(() => {
    const itemsById =
      new Map<
        string,
        AvailableItem
      >();

    for (const stock of stocks) {
      if (stock.inventario !== 'COCINA') {
        continue;
      }

      if (
        itemsById.has(
          stock.itemId,
        )
      ) {
        continue;
      }

        itemsById.set(
          stock.itemId,
          {
            itemId:
              stock.itemId,

            nombre:
              stock.itemNombre,

            categoria:
              stock.categoriaNombre,

            unidadMedida:
              stock.unidadMedida,

            abreviaturaUnidad:
              stock.abreviaturaUnidad,

            inventario:
              stock.inventario,
          },
        );
      }

      return Array.from(
        itemsById.values(),
      ).sort(
        (first, second) =>
          first.nombre.localeCompare(
            second.nombre,
            'es',
          ),
      );
    }, [stocks]);

  const filteredItems =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(
          search.trim(),
        );

      if (!normalizedSearch) {
        return availableItems;
      }

      return availableItems.filter(
        (item) => {
          const searchableText =
            normalizeText(
              [
                item.nombre,
                item.categoria,
                item.unidadMedida,
                getInventoryLabel(
                  item.inventario,
                ),
              ].join(' '),
            );

          return searchableText.includes(
            normalizedSearch,
          );
        },
      );
    }, [
      availableItems,
      search,
    ]);

  const selectedItemsCount =
    Object.keys(
      form.cantidades,
    ).length;

  function updateField(
    field:
      | 'nombre'
      | 'descripcion',
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError('');
  }

  function toggleItem(
    itemId: string,
    selected: boolean,
  ) {
    setForm((current) => {
      const cantidades = {
        ...current.cantidades,
      };

      if (selected) {
        cantidades[itemId] =
          cantidades[itemId] ??
          '1';
      } else {
        delete cantidades[itemId];
      }

      return {
        ...current,
        cantidades,
      };
    });

    setError('');
  }

  function updateQuantity(
    itemId: string,
    value: string,
  ) {
    setForm((current) => ({
      ...current,

      cantidades: {
        ...current.cantidades,
        [itemId]: value,
      },
    }));

    setError('');
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    const nombre =
      form.nombre.trim();

    if (!nombre) {
      setError(
        'Ingresá el nombre de la fórmula.',
      );

      return;
    }

    const selectedEntries =
      Object.entries(
        form.cantidades,
      );

    if (
      selectedEntries.length === 0
    ) {
      setError(
        'Seleccioná al menos un ítem.',
      );

      return;
    }

    const items =
      selectedEntries.map(
        ([
          itemId,
          quantity,
        ]) => ({
          itemId,

          cantidadPorPersona:
            Number(
              quantity.replace(
                ',',
                '.',
              ),
            ),
        }),
      );

    const invalidQuantity =
      items.some(
        (item) =>
          !Number.isFinite(
            item.cantidadPorPersona,
          ) ||
          item.cantidadPorPersona <=
            0,
      );

    if (invalidQuantity) {
      setError(
        'Todas las cantidades por persona deben ser mayores a cero.',
      );

      return;
    }

    setSaving(true);

    try {
      const request:
        SaveCookingFormulaRequest = {
          nombre,

          descripcion:
            form.descripcion.trim() ||
            undefined,

          items,
        };

      if (
        editing &&
        formulaId
      ) {
        const savedFormula =
          await saveCookingFormulaChanges(
            formulaId,
            request,
          );

        onSuccess(
          savedFormula.id,
        );

        return;
      }

      const savedFormula =
        await saveCookingFormula(
          request,
        );

      onSuccess(
        savedFormula.id,
      );
    } catch {
      setError(
        editing
          ? 'No se pudo actualizar la fórmula de cocina. Revisá los datos ingresados.'
          : 'No se pudo crear la fórmula de cocina. Revisá los datos ingresados.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section
        className={
          styles.loadingState
        }
      >
        Cargando fórmula...
      </section>
    );
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
        <header
          className={
            styles.sectionHeader
          }
        >
          <div>
            <h2>
              Información general
            </h2>

            <p>
              Identificá la fórmula de cocina que se utilizará en las reservas.
            </p>
          </div>
        </header>

        <div
          className={
            styles.generalFields
          }
        >
          <TextInput
            label="Nombre"
            value={form.nombre}
            onChange={(event) =>
              updateField(
                'nombre',
                event.target.value,
              )
            }
            maxLength={150}
            disabled={saving}
          />

          <label
            className={styles.field}
          >
            <span>Descripción</span>

            <textarea
              value={
                form.descripcion
              }
              onChange={(event) =>
                updateField(
                  'descripcion',
                  event.target.value,
                )
              }
              rows={4}
              maxLength={500}
              disabled={saving}
              placeholder="Descripción opcional"
            />
          </label>
        </div>
      </section>

      <section
        className={styles.section}
      >
        <header
          className={
            styles.itemsHeader
          }
        >
          <div>
            <h2>
              Ítems incluidos
            </h2>

            <p>
              Seleccioná los insumos y definí el consumo estimado por persona.
            </p>
          </div>

          <span
            className={
              styles.selectedCounter
            }
          >
            {selectedItemsCount}{' '}
            {selectedItemsCount === 1
              ? 'ítem seleccionado'
              : 'ítems seleccionados'}
          </span>
        </header>

        <label
          className={styles.search}
        >
          <Search
            size={19}
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
            placeholder="Buscar por nombre, categoría o sector"
            disabled={saving}
          />
        </label>

        {availableItems.length ===
          0 && (
          <div
            className={
              styles.emptyState
            }
          >
            <PackageSearch
              size={34}
              aria-hidden="true"
            />

            <div>
              <strong>
                No hay ítems disponibles
              </strong>

              <p>
                Primero cargá los productos o insumos en el inventario.
              </p>
            </div>
          </div>
        )}

        {availableItems.length >
          0 &&
          filteredItems.length ===
            0 && (
            <div
              className={
                styles.emptyState
              }
            >
              <PackageSearch
                size={34}
                aria-hidden="true"
              />

              <div>
                <strong>
                  No se encontraron ítems
                </strong>

                <p>
                  Probá con otro término de búsqueda.
                </p>
              </div>
            </div>
          )}

        {filteredItems.length >
          0 && (
          <div
            className={
              styles.itemsList
            }
          >
            {filteredItems.map(
              (item) => {
                const selected =
                  Object.prototype
                    .hasOwnProperty
                    .call(
                      form.cantidades,
                      item.itemId,
                    );

                return (
                  <article
                    key={
                      item.itemId
                    }
                    className={
                      selected
                        ? styles.itemSelected
                        : styles.item
                    }
                  >
                    <label
                      className={
                        styles.itemSelector
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          selected
                        }
                        onChange={(
                          event,
                        ) =>
                          toggleItem(
                            item.itemId,

                            event
                              .target
                              .checked,
                          )
                        }
                        disabled={
                          saving
                        }
                      />

                      <div
                        className={
                          styles.itemInfo
                        }
                      >
                        <strong>
                          {item.nombre}
                        </strong>

                        <span>
                          {item.categoria}
                          {' · '}
                          {getInventoryLabel(
                            item.inventario,
                          )}
                          {' · '}
                          {
                            item.abreviaturaUnidad
                          }
                        </span>
                      </div>
                    </label>

                    {selected && (
                      <label
                        className={
                          styles.quantityField
                        }
                      >
                        <span>
                          Cantidad por persona
                        </span>

                        <div
                          className={
                            styles.quantityInput
                          }
                        >
                          <input
                            type="number"
                            min="0.0001"
                            step="0.0001"
                            inputMode="decimal"
                            value={
                              form
                                .cantidades[
                                item.itemId
                              ]
                            }
                            onChange={(
                              event,
                            ) =>
                              updateQuantity(
                                item.itemId,

                                event
                                  .target
                                  .value,
                              )
                            }
                            disabled={
                              saving
                            }
                          />

                          <span>
                            {
                              item.abreviaturaUnidad
                            }
                          </span>
                        </div>
                      </label>
                    )}
                  </article>
                );
              },
            )}
          </div>
        )}
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
              : 'Creando fórmula...'
          }
          disabled={
            availableItems.length ===
            0
          }
        >
          <Save
            size={18}
            aria-hidden="true"
          />

          {editing
            ? 'Guardar cambios'
            : 'Crear fórmula'}
        </Button>
      </footer>
    </form>
  );
}
