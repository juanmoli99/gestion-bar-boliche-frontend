import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  CircleAlert,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  getReservation,
} from '../api/reservations.api';

import {
  ReservationForm,
} from '../components/ReservationForm/ReservationForm';

import type {
  ReservationDetail,
} from '../types/reservations.types';

import styles from './EditReservationPage.module.css';

export function EditReservationPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [
    reservation,
    setReservation,
  ] = useState<ReservationDetail | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  function goBack() {
    navigate('/reservas');
  }

  useEffect(() => {
    if (!id) {
      setError(
        'No se indicó la reserva que se quiere editar.',
      );

      setLoading(false);

      return;
    }

    let active = true;

    async function load() {
      try {
        const data =
          await getReservation(id!);

        if (active) {
          setReservation(data);
        }
      } catch {
        if (active) {
          setError(
            'No se pudo cargar la reserva.',
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
  }, [id]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Editar reserva
          </h1>

          <p className={styles.description}>
            Modificá los datos de la reserva.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={goBack}
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          Volver
        </Button>
      </header>

      {loading && (
        <section className={styles.loading}>
          Cargando reserva...
        </section>
      )}

      {!loading && error && (
        <section className={styles.error}>
          <CircleAlert
            size={24}
            aria-hidden="true"
          />

          <div>
            <h2>
              No se pudo abrir la reserva
            </h2>

            <p>{error}</p>
          </div>
        </section>
      )}

      {!loading &&
        !error &&
        reservation &&
        id && (
          <ReservationForm
            reservationId={id}
            initialReservation={reservation}
            onCancel={goBack}
            onSuccess={goBack}
          />
        )}
    </section>
  );
}