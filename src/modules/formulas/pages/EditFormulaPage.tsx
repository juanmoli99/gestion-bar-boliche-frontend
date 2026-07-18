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
  FormulaForm,
} from '../components/FormulaForm/FormulaForm';

import styles from './FormulaEditorPage.module.css';

export function EditFormulaPage() {
  const navigate = useNavigate();

  const {
    id: formulaId,
  } = useParams<{
    id: string;
  }>();

  function goBack() {
    navigate('/formulas');
  }

  function handleSuccess() {
    navigate('/formulas');
  }

  if (!formulaId) {
    return (
      <section className={styles.page}>
        <div
          className={styles.error}
          role="alert"
        >
          <CircleAlert
            size={19}
            aria-hidden="true"
          />

          <span>
            No se recibió el identificador de la
            fórmula.
          </span>
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

          Volver a fórmulas
        </Button>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Editar fórmula
          </h1>

          <p className={styles.description}>
            Los cambios crearán una versión nueva.
            Las reservas anteriores conservarán la
            versión que tenían asignada.
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

      <FormulaForm
        formulaId={formulaId}
        onCancel={goBack}
        onSuccess={handleSuccess}
      />
    </section>
  );
}