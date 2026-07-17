import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  FormEvent,
} from 'react';

import {
  ArrowLeft,
  CircleAlert,
  LoaderCircle,
  PackagePlus,
  Plus,
  Save,
  X,
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
  loadInventoryCategories,
  loadInventoryUnits,
  saveInventoryCategory,
  saveInventoryItem,
} from '../services/inventory.service';

import type {
  InventoryCategory,
  InventoryUnit,
  TipoInventario,
  TipoItem,
} from '../types/inventory.types';

import styles from './CreateInventoryItemPage.module.css';

interface FormValues {
  nombre: string;
  descripcion: string;

  inventario: TipoInventario;
  tipo: TipoItem;

  categoriaId: string;
  unidadMedidaId: string;

  unidadesPorPack: string;

  cantidadActual: string;
  cantidadMinima: string;
}

const INITIAL_FORM: FormValues = {
  nombre: '',
  descripcion: '',

  inventario: 'BEBIDAS',
  tipo: 'INSUMO',

  categoriaId: '',
  unidadMedidaId: '',

  unidadesPorPack: '',

  cantidadActual: '0',
  cantidadMinima: '0',
};

const INVENTORY_OPTIONS: {
  value: TipoInventario;
  label: string;
}[] = [
  {
    value: 'BEBIDAS',
    label: 'Barra',
  },
  {
    value: 'COCINA',
    label: 'Cocina',
  },
  {
    value: 'LIMPIEZA',
    label: 'Limpieza',
  },
  {
    value: 'VARIOS',
    label: 'Varios',
  },
];

const ITEM_TYPE_OPTIONS: {
  value: TipoItem;
  label: string;
}[] = [
  {
    value: 'INSUMO',
    label: 'Insumo',
  },
  {
    value: 'PRODUCTO',
    label: 'Producto',
  },
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

function parseQuantity(
  value: string,
): number | null {
  const normalized =
    value
      .trim()
      .replace(',', '.');

  if (
    normalized === '' ||
    !/^\d+(?:\.\d{1,3})?$/.test(
      normalized,
    )
  ) {
    return null;
  }

  const parsed =
    Number(normalized);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return null;
  }

  return parsed;
}

function parsePackQuantity(
  value: string,
): number | undefined | null {
  const normalized =
    value.trim();

  if (normalized === '') {
    return undefined;
  }

  if (
    !/^\d+$/.test(
      normalized,
    )
  ) {
    return null;
  }

  const parsed =
    Number(normalized);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    return null;
  }

  return parsed;
}

export function CreateInventoryItemPage() {
  const navigate =
    useNavigate();

  const {
    usuario,
  } = useAuth();

  const isAdministrator =
    usuario?.rol ===
    'ADMINISTRADOR';

  const [form, setForm] =
    useState<FormValues>(
      INITIAL_FORM,
    );

  const [
    categories,
    setCategories,
  ] = useState<
    InventoryCategory[]
  >([]);

  const [units, setUnits] =
    useState<InventoryUnit[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState<string | null>(
    null,
  );

  const [
    showCategoryCreator,
    setShowCategoryCreator,
  ] = useState(false);

  const [
    categoryName,
    setCategoryName,
  ] = useState('');

  const [
    categoryDescription,
    setCategoryDescription,
  ] = useState('');

  const [
    savingCategory,
    setSavingCategory,
  ] = useState(false);

  const [
    categoryError,
    setCategoryError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      setLoading(true);
      setLoadError(false);

      try {
        const [
          loadedCategories,
          loadedUnits,
        ] = await Promise.all([
          loadInventoryCategories(),
          loadInventoryUnits(),
        ]);

        if (!active) {
          return;
        }

        setCategories(
          loadedCategories.filter(
            (category) =>
              category.activa,
          ),
        );

        setUnits(
          loadedUnits.filter(
            (unit) =>
              unit.activa,
          ),
        );
      } catch {
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOptions();

    return () => {
      active = false;
    };
  }, []);

  const filteredCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.inventario ===
            form.inventario,
        ),
      [
        categories,
        form.inventario,
      ],
    );

  const selectedUnit =
    useMemo(
      () =>
        units.find(
          (unit) =>
            unit.id ===
            form.unidadMedidaId,
        ) ?? null,
      [
        form.unidadMedidaId,
        units,
      ],
    );

  useEffect(() => {
    const selectedCategoryIsValid =
      filteredCategories.some(
        (category) =>
          category.id ===
          form.categoriaId,
      );

    if (
      selectedCategoryIsValid
    ) {
      return;
    }

    setForm(
      (current) => ({
        ...current,

        categoriaId:
          filteredCategories[0]
            ?.id ?? '',
      }),
    );
  }, [
    filteredCategories,
    form.categoriaId,
  ]);

  useEffect(() => {
    if (
      form.unidadMedidaId ||
      units.length === 0
    ) {
      return;
    }

    setForm(
      (current) => ({
        ...current,

        unidadMedidaId:
          units[0].id,
      }),
    );
  }, [
    form.unidadMedidaId,
    units,
  ]);

  function updateField<
    Field extends keyof FormValues,
  >(
    field: Field,
    value: FormValues[Field],
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    if (
      field ===
      'inventario'
    ) {
      setShowCategoryCreator(
        false,
      );

      setCategoryName('');
      setCategoryDescription('');
      setCategoryError(null);
    }

    setFormError(null);
  }

  function openCategoryCreator() {
    setCategoryName('');
    setCategoryDescription('');
    setCategoryError(null);

    setShowCategoryCreator(
      true,
    );
  }

  function closeCategoryCreator() {
    if (savingCategory) {
      return;
    }

    setShowCategoryCreator(
      false,
    );

    setCategoryName('');
    setCategoryDescription('');
    setCategoryError(null);
  }

  async function handleCreateCategory() {
    if (
      !isAdministrator ||
      savingCategory
    ) {
      return;
    }

    const nombre =
      categoryName.trim();

    if (!nombre) {
      setCategoryError(
        'Ingresá el nombre de la categoría.',
      );

      return;
    }

    setSavingCategory(true);
    setCategoryError(null);

    try {
      const createdCategory =
        await saveInventoryCategory({
          nombre,

          descripcion:
            categoryDescription
              .trim() ||
            undefined,

          inventario:
            form.inventario,
        });

      setCategories(
        (currentCategories) => [
          ...currentCategories.filter(
            (category) =>
              category.id !==
              createdCategory.id,
          ),

          createdCategory,
        ],
      );

      setForm(
        (current) => ({
          ...current,

          categoriaId:
            createdCategory.id,
        }),
      );

      setShowCategoryCreator(
        false,
      );

      setCategoryName('');
      setCategoryDescription('');
    } catch {
      setCategoryError(
        'No se pudo agregar la categoría. Verificá que no exista otra categoría activa con el mismo nombre en esta zona.',
      );
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nombre =
      form.nombre.trim();

    if (!nombre) {
      setFormError(
        'Ingresá el nombre del ítem.',
      );

      return;
    }

    if (!form.categoriaId) {
      setFormError(
        'Seleccioná una categoría válida para la zona.',
      );

      return;
    }

    if (!form.unidadMedidaId) {
      setFormError(
        'Seleccioná una unidad de medida.',
      );

      return;
    }

    const cantidadActual =
      parseQuantity(
        form.cantidadActual,
      );

    const cantidadMinima =
      parseQuantity(
        form.cantidadMinima,
      );

    if (
      cantidadActual === null ||
      cantidadMinima === null
    ) {
      setFormError(
        'Las cantidades deben ser números iguales o mayores que cero, con hasta tres decimales.',
      );

      return;
    }

    if (
      selectedUnit &&
      !selectedUnit.permiteDecimal &&
      (
        !Number.isInteger(
          cantidadActual,
        ) ||
        !Number.isInteger(
          cantidadMinima,
        )
      )
    ) {
      setFormError(
        `La unidad “${selectedUnit.nombre}” no admite cantidades decimales.`,
      );

      return;
    }

    const unidadesPorPack =
      parsePackQuantity(
        form.unidadesPorPack,
      );

    if (
      unidadesPorPack === null
    ) {
      setFormError(
        'Las unidades por pack deben ser un número entero mayor que cero.',
      );

      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      await saveInventoryItem({
        nombre,

        descripcion:
          form.descripcion.trim() ||
          undefined,

        inventario:
          form.inventario,

        tipo:
          form.tipo,

        categoriaId:
          form.categoriaId,

        unidadMedidaId:
          form.unidadMedidaId,

        unidadesPorPack,

        cantidadActual,
        cantidadMinima,
      });

      navigate(
        '/inventario',
      );
    } catch {
      setFormError(
        'No se pudo agregar el ítem. Verificá que no exista otro ítem activo con el mismo nombre y tipo.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section
        className={
          styles.centerState
        }
      >
        <LoaderCircle
          size={32}
          aria-hidden="true"
        />

        <p>
          Cargando opciones del inventario...
        </p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section
        className={
          styles.centerState
        }
      >
        <CircleAlert
          size={32}
          aria-hidden="true"
        />

        <div>
          <h1>
            No se pudo preparar el formulario
          </h1>

          <p>
            Verificá la conexión y volvé a intentarlo.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            window.location.reload()
          }
        >
          Reintentar
        </Button>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate(
              '/inventario',
            )
          }
          disabled={
            saving ||
            savingCategory
          }
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          Volver
        </Button>

        <div>
          <h1 className={styles.title}>
            Agregar ítem
          </h1>

          <p className={styles.description}>
            Creá un nuevo ítem y su registro de stock.
          </p>
        </div>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <section className={styles.card}>
          <header
            className={
              styles.cardHeader
            }
          >
            <PackagePlus
              size={22}
              aria-hidden="true"
            />

            <div>
              <h2>
                Información general
              </h2>

              <p>
                Datos principales y ubicación del ítem.
              </p>
            </div>
          </header>

          <div
            className={
              styles.fieldsGrid
            }
          >
            <label
              className={
                styles.field
              }
            >
              <span>
                Nombre
              </span>

              <input
                type="text"
                value={
                  form.nombre
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'nombre',
                    event.target
                      .value,
                  )
                }
                maxLength={100}
                placeholder="Ejemplo: Coca-Cola 2,25 L"
                autoFocus
                disabled={
                  saving ||
                  savingCategory
                }
                required
              />
            </label>

            <label
              className={
                styles.field
              }
            >
              <span>
                Tipo de ítem
              </span>

              <select
                value={
                  form.tipo
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'tipo',
                    event.target
                      .value as
                      TipoItem,
                  )
                }
                disabled={
                  saving ||
                  savingCategory
                }
              >
                {ITEM_TYPE_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  ),
                )}
              </select>
            </label>

            <label
              className={
                styles.field
              }
            >
              <span>
                Zona
              </span>

              <select
                value={
                  form.inventario
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'inventario',
                    event.target
                      .value as
                      TipoInventario,
                  )
                }
                disabled={
                  saving ||
                  savingCategory
                }
              >
                {INVENTORY_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  ),
                )}
              </select>
            </label>

            <div
              className={
                styles.categoryField
              }
            >
              <div
                className={
                  styles.categoryLabel
                }
              >
                <span>
                  Categoría
                </span>

                {isAdministrator &&
                  !showCategoryCreator && (
                  <button
                    type="button"
                    className={
                      styles.addCategoryButton
                    }
                    onClick={
                      openCategoryCreator
                    }
                    disabled={
                      saving ||
                      savingCategory
                    }
                  >
                    <Plus
                      size={15}
                      aria-hidden="true"
                    />

                    Agregar categoría
                  </button>
                )}
              </div>

              <select
                value={
                  form.categoriaId
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'categoriaId',
                    event.target
                      .value,
                  )
                }
                disabled={
                  saving ||
                  savingCategory ||
                  filteredCategories
                    .length === 0
                }
                required
              >
                {filteredCategories
                  .length === 0 && (
                  <option value="">
                    No hay categorías disponibles
                  </option>
                )}

                {filteredCategories.map(
                  (category) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.nombre
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            {isAdministrator &&
              showCategoryCreator && (
              <section
                className={
                  styles.categoryCreator
                }
              >
                <header
                  className={
                    styles.categoryCreatorHeader
                  }
                >
                  <div>
                    <h3>
                      Nueva categoría
                    </h3>

                    <p>
                      Se agregará a la zona{' '}
                      <strong>
                        {
                          INVENTORY_LABELS[
                            form.inventario
                          ]
                        }
                      </strong>
                      .
                    </p>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.closeCategoryButton
                    }
                    onClick={
                      closeCategoryCreator
                    }
                    disabled={
                      savingCategory
                    }
                    aria-label="Cerrar formulario de categoría"
                  >
                    <X
                      size={18}
                      aria-hidden="true"
                    />
                  </button>
                </header>

                <div
                  className={
                    styles.categoryCreatorFields
                  }
                >
                  <label
                    className={
                      styles.field
                    }
                  >
                    <span>
                      Nombre
                    </span>

                    <input
                      type="text"
                      value={
                        categoryName
                      }
                      onChange={(
                        event,
                      ) => {
                        setCategoryName(
                          event.target
                            .value,
                        );

                        setCategoryError(
                          null,
                        );
                      }}
                      maxLength={100}
                      placeholder="Ejemplo: Gaseosas"
                      disabled={
                        savingCategory
                      }
                    />
                  </label>

                  <label
                    className={
                      styles.field
                    }
                  >
                    <span>
                      Descripción
                    </span>

                    <input
                      type="text"
                      value={
                        categoryDescription
                      }
                      onChange={(
                        event,
                      ) => {
                        setCategoryDescription(
                          event.target
                            .value,
                        );

                        setCategoryError(
                          null,
                        );
                      }}
                      maxLength={500}
                      placeholder="Opcional"
                      disabled={
                        savingCategory
                      }
                    />
                  </label>
                </div>

                {categoryError && (
                  <div
                    className={
                      styles.categoryError
                    }
                    role="alert"
                  >
                    <CircleAlert
                      size={18}
                      aria-hidden="true"
                    />

                    <p>
                      {categoryError}
                    </p>
                  </div>
                )}

                <footer
                  className={
                    styles.categoryCreatorActions
                  }
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={
                      closeCategoryCreator
                    }
                    disabled={
                      savingCategory
                    }
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    onClick={() =>
                      void handleCreateCategory()
                    }
                    disabled={
                      savingCategory ||
                      !categoryName.trim()
                    }
                  >
                    {savingCategory ? (
                      <LoaderCircle
                        size={18}
                        aria-hidden="true"
                      />
                    ) : (
                      <Plus
                        size={18}
                        aria-hidden="true"
                      />
                    )}

                    {savingCategory
                      ? 'Agregando...'
                      : 'Agregar categoría'}
                  </Button>
                </footer>
              </section>
            )}

            <label
              className={
                styles.field
              }
            >
              <span>
                Unidad de medida
              </span>

              <select
                value={
                  form.unidadMedidaId
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'unidadMedidaId',
                    event.target
                      .value,
                  )
                }
                disabled={
                  saving ||
                  savingCategory ||
                  units.length === 0
                }
                required
              >
                {units.length ===
                  0 && (
                  <option value="">
                    No hay unidades disponibles
                  </option>
                )}

                {units.map(
                  (unit) => (
                    <option
                      key={
                        unit.id
                      }
                      value={
                        unit.id
                      }
                    >
                      {unit.nombre}{' '}
                      ({unit.abreviatura})
                    </option>
                  ),
                )}
              </select>
            </label>

            <label
              className={
                styles.field
              }
            >
              <span>
                Unidades por pack
              </span>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  form.unidadesPorPack
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'unidadesPorPack',
                    event.target
                      .value,
                  )
                }
                placeholder="Opcional"
                disabled={
                  saving ||
                  savingCategory
                }
              />
            </label>

            <label
              className={[
                styles.field,
                styles.fullWidth,
              ].join(' ')}
            >
              <span>
                Descripción
              </span>

              <textarea
                value={
                  form.descripcion
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'descripcion',
                    event.target
                      .value,
                  )
                }
                maxLength={500}
                rows={3}
                placeholder="Descripción opcional"
                disabled={
                  saving ||
                  savingCategory
                }
              />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <header
            className={
              styles.cardHeader
            }
          >
            <PackagePlus
              size={22}
              aria-hidden="true"
            />

            <div>
              <h2>
                Stock inicial
              </h2>

              <p>
                Valores con los que se incorporará al inventario.
              </p>
            </div>
          </header>

          <div
            className={
              styles.stockGrid
            }
          >
            <label
              className={
                styles.field
              }
            >
              <span>
                Cantidad actual
              </span>

              <div
                className={
                  styles.quantityField
                }
              >
                <input
                  type="number"
                  min="0"
                  step={
                    selectedUnit
                      ?.permiteDecimal
                      ? '0.001'
                      : '1'
                  }
                  value={
                    form.cantidadActual
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'cantidadActual',
                      event.target
                        .value,
                    )
                  }
                  disabled={
                    saving ||
                    savingCategory
                  }
                  required
                />

                <span>
                  {selectedUnit
                    ?.abreviatura ??
                    '—'}
                </span>
              </div>
            </label>

            <label
              className={
                styles.field
              }
            >
              <span>
                Stock mínimo
              </span>

              <div
                className={
                  styles.quantityField
                }
              >
                <input
                  type="number"
                  min="0"
                  step={
                    selectedUnit
                      ?.permiteDecimal
                      ? '0.001'
                      : '1'
                  }
                  value={
                    form.cantidadMinima
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'cantidadMinima',
                      event.target
                        .value,
                    )
                  }
                  disabled={
                    saving ||
                    savingCategory
                  }
                  required
                />

                <span>
                  {selectedUnit
                    ?.abreviatura ??
                    '—'}
                </span>
              </div>
            </label>
          </div>
        </section>

        {formError && (
          <section
            className={
              styles.formError
            }
            role="alert"
          >
            <CircleAlert
              size={20}
              aria-hidden="true"
            />

            <p>
              {formError}
            </p>
          </section>
        )}

        <footer className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate(
                '/inventario',
              )
            }
            disabled={
              saving ||
              savingCategory
            }
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={
              saving ||
              savingCategory ||
              !form.categoriaId ||
              !form.unidadMedidaId
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
              : 'Agregar ítem'}
          </Button>
        </footer>
      </form>
    </section>
  );
}