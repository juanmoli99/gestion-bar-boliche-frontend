import {
  Search,
  X,
} from 'lucide-react';

import { Button } from '../../../../components/ui/Button';
import { TextInput } from '../../../../components/forms/TextInput';

import type {
  EstadoReserva,
  ListReservationsFilters,
  TipoReserva,
} from '../../types/reservations.types';

import styles from './ReservationFilters.module.css';

interface ReservationFiltersProps {
  filters: ListReservationsFilters;

  onChange(
    filters: ListReservationsFilters,
  ): void;

  onSearch(): void;

  onClear(): void;

  loading?: boolean;
}

const RESERVATION_TYPES: Array<{
  value: TipoReserva;
  label: string;
}> = [
  {
    value: 'MESA',
    label: 'Mesa',
  },
  {
    value: 'FIESTA',
    label: 'Fiesta',
  },
];

const RESERVATION_STATES: Array<{
  value: EstadoReserva;
  label: string;
}> = [
  {
    value: 'PENDIENTE',
    label: 'Pendiente',
  },
  {
    value: 'SENADA',
    label: 'Señada',
  },
  {
    value: 'CONFIRMADA',
    label: 'Confirmada',
  },
  {
    value: 'CANCELADA',
    label: 'Cancelada',
  },
  {
    value: 'FINALIZADA',
    label: 'Finalizada',
  },
  {
    value: 'ASISTIO',
    label: 'Asistió',
  },
  {
    value: 'NO_ASISTIO',
    label: 'No asistió',
  },
];

export function ReservationFilters({
  filters,
  onChange,
  onSearch,
  onClear,
  loading = false,
}: ReservationFiltersProps) {
  return (
    <section className={styles.filters}>
      <div className={styles.search}>
        <TextInput
          id="reservation-client"
          label="Buscar cliente"
          placeholder="Nombre del cliente"
          value={
            filters.nombreCliente ?? ''
          }
          onChange={(event) =>
            onChange({
              ...filters,
              nombreCliente:
                event.target.value,
            })
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearch();
            }
          }}
          disabled={loading}
        />

        <Button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className={styles.searchButton}
        >
          <Search
            size={18}
            aria-hidden="true"
          />

          Buscar
        </Button>
      </div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Fecha desde</span>

          <input
            type="date"
            value={
              filters.fechaDesde ?? ''
            }
            onChange={(event) =>
              onChange({
                ...filters,
                fechaDesde:
                  event.target.value ||
                  undefined,
              })
            }
            disabled={loading}
          />
        </label>

        <label className={styles.field}>
          <span>Fecha hasta</span>

          <input
            type="date"
            value={
              filters.fechaHasta ?? ''
            }
            onChange={(event) =>
              onChange({
                ...filters,
                fechaHasta:
                  event.target.value ||
                  undefined,
              })
            }
            disabled={loading}
          />
        </label>

        <label className={styles.field}>
          <span>Tipo</span>

          <select
            value={filters.tipo ?? ''}
            onChange={(event) =>
              onChange({
                ...filters,
                tipo:
                  (event.target.value ||
                    undefined) as
                    | TipoReserva
                    | undefined,
              })
            }
            disabled={loading}
          >
            <option value="">
              Todos
            </option>

            {RESERVATION_TYPES.map(
              (type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className={styles.field}>
          <span>Estado</span>

          <select
            value={
              filters.estado ?? ''
            }
            onChange={(event) =>
              onChange({
                ...filters,
                estado:
                  (event.target.value ||
                    undefined) as
                    | EstadoReserva
                    | undefined,
              })
            }
            disabled={loading}
          >
            <option value="">
              Todos
            </option>

            {RESERVATION_STATES.map(
              (state) => (
                <option
                  key={state.value}
                  value={state.value}
                >
                  {state.label}
                </option>
              ),
            )}
          </select>
        </label>

        <Button
          type="button"
          variant="secondary"
          onClick={onClear}
          disabled={loading}
          className={styles.clearButton}
        >
          <X
            size={18}
            aria-hidden="true"
          />

          Limpiar
        </Button>
      </div>
    </section>
  );
}