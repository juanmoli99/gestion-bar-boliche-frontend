import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  CalendarX,
  CircleAlert,
  Plus,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useRealtime,
} from '../../../app/realtime/useRealtime';

import {
  Button,
} from '../../../components/ui/Button';

import {
  ReservationCard,
} from '../components/ReservationCard/ReservationCard';

import {
  ReservationFilters,
} from '../components/ReservationFilters/ReservationFilters';

import {
  listReservations,
} from '../api/reservations.api';

import type {
  ListReservationsFilters,
  Reservation,
} from '../types/reservations.types';

import styles from './ReservationsPage.module.css';

const EMPTY_FILTERS: ListReservationsFilters = {};

function buildApiFilters(
  filters: ListReservationsFilters,
): ListReservationsFilters {
  return {
    ...filters,

    fechaDesde: filters.fechaDesde
      ? `${filters.fechaDesde}T00:00:00-03:00`
      : undefined,

    fechaHasta: filters.fechaHasta
      ? `${filters.fechaHasta}T23:59:59.999-03:00`
      : undefined,

    nombreCliente:
      filters.nombreCliente?.trim() ||
      undefined,
  };
}

function getStartOfToday(): Date {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
}

function shouldShowReservation(
  reservation: Reservation,
): boolean {
  const reservationDate = new Date(
    reservation.fechaHora,
  );

  if (
    Number.isNaN(
      reservationDate.getTime(),
    )
  ) {
    return false;
  }

  if (reservation.tipo === 'MESA') {
    return (
      reservationDate >=
      getStartOfToday()
    );
  }

  const twoDaysInMilliseconds =
    2 * 24 * 60 * 60 * 1000;

  const expirationDate = new Date(
    reservationDate.getTime() +
      twoDaysInMilliseconds,
  );

  return expirationDate >= new Date();
}

function filterVisibleReservations(
  reservations: Reservation[],
): Reservation[] {
  return reservations.filter(
    shouldShowReservation,
  );
}

export function ReservationsPage() {
  const navigate = useNavigate();

  const {
    subscribe,
  } = useRealtime();

  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>([]);

  const [
    draftFilters,
    setDraftFilters,
  ] = useState<ListReservationsFilters>(
    EMPTY_FILTERS,
  );

  const [
    appliedFilters,
    setAppliedFilters,
  ] = useState<ListReservationsFilters>(
    EMPTY_FILTERS,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const load = useCallback(
    async (
      filters: ListReservationsFilters,
      showLoading = true,
    ) => {
      if (showLoading) {
        setLoading(true);
      }

      setError(false);

      try {
        const data =
          await listReservations(
            buildApiFilters(filters),
          );

        setReservations(
          filterVisibleReservations(data),
        );
      } catch {
        setError(true);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void load(appliedFilters);
  }, [
    appliedFilters,
    load,
  ]);

  useEffect(() => {
    return subscribe(
      'reservations.updated',
      () => {
        void load(
          appliedFilters,
          false,
        );
      },
    );
  }, [
    subscribe,
    appliedFilters,
    load,
  ]);

  function handleSearch() {
    setAppliedFilters({
      ...draftFilters,
    });
  }

  function handleClear() {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Reservas
          </h1>

          <p className={styles.description}>
            Administración de reservas de
            mesas y fiestas.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate('/reservas/nueva')
          }
          className={styles.createButton}
        >
          <Plus
            size={19}
            aria-hidden="true"
          />

          Nueva reserva
        </Button>
      </header>

      <ReservationFilters
        filters={draftFilters}
        onChange={setDraftFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {loading && (
        <div
          className={styles.loading}
          aria-label="Cargando reservas"
        >
          <span />
          <span />
          <span />
        </div>
      )}

      {!loading && error && (
        <section className={styles.message}>
          <CircleAlert
            size={30}
            aria-hidden="true"
          />

          <div>
            <h2>
              No se pudieron cargar las reservas
            </h2>

            <p>
              Verificá la conexión y volvé a
              intentarlo.
            </p>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                void load(appliedFilters)
              }
              className={styles.retryButton}
            >
              Reintentar
            </Button>
          </div>
        </section>
      )}

      {!loading &&
        !error &&
        reservations.length === 0 && (
          <section className={styles.message}>
            <CalendarX
              size={32}
              aria-hidden="true"
            />

            <div>
              <h2>
                No se encontraron reservas
              </h2>

              <p>
                No hay resultados que coincidan
                con los filtros aplicados.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        reservations.length > 0 && (
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <span>
                {reservations.length === 1
                  ? '1 reserva encontrada'
                  : `${reservations.length} reservas encontradas`}
              </span>
            </div>

            <div className={styles.list}>
              {reservations.map(
                (reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ),
              )}
            </div>
          </div>
        )}
    </section>
  );
}