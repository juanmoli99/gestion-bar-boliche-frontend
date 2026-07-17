import {
  ArrowLeft,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import { Button } from '../../../components/ui/Button';

import {
  ReservationForm,
} from '../components/ReservationForm/ReservationForm';

import styles from './CreateReservationPage.module.css';

export function CreateReservationPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate('/reservas');
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Nueva reserva
          </h1>

          <p className={styles.description}>
            Registrá una reserva de mesa o fiesta.
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

      <ReservationForm
        onCancel={goBack}
        onSuccess={goBack}
      />
    </section>
  );
}