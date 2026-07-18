import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { Button } from '../../../../components/ui/Button/Button';
import {
  editSalaryPosition,
  loadSalaryPositions,
  removeSalaryPosition,
  saveSalaryPosition,
} from '../../services/salary-positions.service';
import type {
  CreateSalaryPositionRequest,
  SalaryPosition,
  UpdateSalaryPositionRequest,
} from '../../types/salary-position.types';

import styles from '../../pages/SalaryPositionsPage.module.css';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
});

export function SalaryPositionsManager() {
  const [positions, setPositions] = useState<SalaryPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [valorHora, setValorHora] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await loadSalaryPositions();
      setPositions(data);
    } catch {
      setError('No se pudieron cargar los puestos de trabajo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setNombre('');
    setValorHora('');
    setEditingId(null);
  }

  function handleEdit(position: SalaryPosition) {
    setEditingId(position.id);
    setNombre(position.nombre);
    setValorHora(String(position.valorHora));
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValorHora = Number(valorHora);

    if (!nombre.trim()) {
      setError('El nombre del puesto es obligatorio.');
      return;
    }

    if (!Number.isFinite(parsedValorHora) || parsedValorHora <= 0) {
      setError('El valor por hora debe ser mayor a cero.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        const request: UpdateSalaryPositionRequest = {
          nombre: nombre.trim(),
          valorHora: parsedValorHora,
        };

        const updatedPosition = await editSalaryPosition(
          editingId,
          request,
        );

        setPositions((current) =>
          current.map((position) =>
            position.id === updatedPosition.id
              ? updatedPosition
              : position,
          ),
        );
      } else {
        const request: CreateSalaryPositionRequest = {
          nombre: nombre.trim(),
          valorHora: parsedValorHora,
        };

        const createdPosition = await saveSalaryPosition(request);

        setPositions((current) => [...current, createdPosition]);
      }

      resetForm();
    } catch {
      setError(
        editingId
          ? 'No se pudo actualizar el puesto de trabajo.'
          : 'No se pudo crear el puesto de trabajo.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(position: SalaryPosition) {
    const confirmed = window.confirm(
      `¿Seguro que querés eliminar el puesto "${position.nombre}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(position.id);
      setError('');

      await removeSalaryPosition(position.id);

      setPositions((current) =>
        current.filter((item) => item.id !== position.id),
      );

      if (editingId === position.id) {
        resetForm();
      }
    } catch {
      setError('No se pudo eliminar el puesto de trabajo.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <div>
            <h2>
              {editingId ? 'Editar empleado existente' : 'Cargar empleado nuevo'}
            </h2>

            <p>
              {editingId
                ? 'Modificá los datos del puesto seleccionado.'
                : 'Ingresá el nombre y el valor por hora.'}
            </p>
          </div>
        </div>

        <div className={styles.fields}>
          <label className={styles.field} htmlFor="nombre">
            <span>Nombre</span>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder="Ejemplo: Bartender"
              disabled={saving}
              autoComplete="off"
            />
          </label>

          <label className={styles.field} htmlFor="valorHora">
            <span>Valor por hora</span>

            <div className={styles.moneyInput}>
              <span>$</span>

              <input
                id="valorHora"
                type="number"
                min="0"
                step="0.01"
                value={valorHora}
                onChange={(event) => setValorHora(event.target.value)}
                placeholder="0,00"
                disabled={saving}
              />
            </div>
          </label>
        </div>

        <div className={styles.formActions}>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Cancelar edición
            </Button>
          )}

          <Button
            type="submit"
            isLoading={saving}
            loadingText={
              editingId ? 'Actualizando...' : 'Guardando...'
            }
          >
            {editingId ? 'Guardar cambios' : 'Crear'}
          </Button>
        </div>
      </form>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <section className={styles.card}>
        
        <section className={styles.listSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Empleados registrados</h2>

            <p>
              {positions.length}{' '}
              {positions.length === 1
                ? 'puesto registrado'
                : 'puestos registrados'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.state}>
            Cargando puestos de trabajo...
          </div>
        ) : positions.length === 0 ? (
          <div className={styles.state}>
            <strong>No hay puestos registrados.</strong>
            <span>Creá el primer puesto desde el formulario.</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Valor por hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {positions.map((position) => (
                  <tr key={position.id}>
                    <td>
                      <strong>{position.nombre}</strong>
                    </td>

                    <td>
                      {currencyFormatter.format(
                        Number(position.valorHora),
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          position.activo
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        {position.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleEdit(position)}
                          disabled={
                            saving || deletingId === position.id
                          }
                        >
                          Editar
                        </Button>

                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => void handleDelete(position)}
                          isLoading={deletingId === position.id}
                          loadingText="Eliminando..."
                          disabled={saving}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </section>
      </section>
    </>
  );
}