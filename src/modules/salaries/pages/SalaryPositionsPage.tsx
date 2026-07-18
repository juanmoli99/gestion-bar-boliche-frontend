import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';

import {
  loadSalaryPositions,
} from '../services/salary-positions.service';

import type {
  SalaryPosition,
} from '../types/salary-position.types';

import styles from './SalaryPositionsPage.module.css';

type HoursByPosition = Record<string, string>;

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
});

export function SalaryPositionsPage() {
  const [positions, setPositions] = useState<SalaryPosition[]>([]);
  const [hoursByPosition, setHoursByPosition] =
    useState<HoursByPosition>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await loadSalaryPositions();

      setPositions(
        data.filter((position) => position.activo),
      );
    } catch {
      setError('No se pudieron cargar los puestos de trabajo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function handleHoursChange(
    event: ChangeEvent<HTMLInputElement>,
    positionId: string,
  ) {
    const value = event.target.value;

    setHoursByPosition((current) => ({
      ...current,
      [positionId]: value,
    }));
  }

  function getHours(positionId: string) {
    const parsedHours = Number(
      hoursByPosition[positionId] ?? '',
    );

    if (!Number.isFinite(parsedHours) || parsedHours < 0) {
      return 0;
    }

    return parsedHours;
  }

  function getPositionTotal(position: SalaryPosition) {
    return Number(position.valorHora) * getHours(position.id);
  }

  const totalGeneral = useMemo(
    () =>
      positions.reduce(
        (total, position) =>
          total + getPositionTotal(position),
        0,
      ),
    [positions, hoursByPosition],
  );

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Sueldos</h1>

          <p className={styles.description}>
            Ingresá las horas trabajadas para calcular el total a pagar por puesto.
          </p>
        </div>
      </header>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.state}>
          Cargando puestos de trabajo...
        </div>
      ) : positions.length === 0 ? (
        <div className={styles.state}>
          <strong>No hay puestos activos registrados.</strong>

          <span>
            Creá los puestos desde la sección Valores.
          </span>
        </div>
      ) : (
        <section className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Cálculo de sueldos</h2>

              <p>
                El total se actualiza automáticamente según las horas ingresadas.
              </p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Puesto</th>
                  <th>Valor por hora</th>
                  <th>Horas trabajadas</th>
                  <th>Total a pagar</th>
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
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={
                          hoursByPosition[position.id] ?? ''
                        }
                        onChange={(event) =>
                          handleHoursChange(
                            event,
                            position.id,
                          )
                        }
                        placeholder="0"
                        aria-label={`Horas trabajadas para ${position.nombre}`}
                      />
                    </td>

                    <td>
                      <strong>
                        {currencyFormatter.format(
                          getPositionTotal(position),
                        )}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={3}>
                    Total general
                  </td>

                  <td>
                    {currencyFormatter.format(totalGeneral)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}