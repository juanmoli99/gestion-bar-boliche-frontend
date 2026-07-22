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
  CookingFormulaForm,
} from '../components/CookingFormulaForm/CookingFormulaForm';

import styles from './FormulaEditorPage.module.css';

export function EditCookingFormulaPage() {
  const navigate = useNavigate();

  const {
    id: formulaId,
  } = useParams<{
    id: string;
  }>();

  function goBack() {
    navigate(
      '/formulas?tipo=cocina',
    );
  }

  function handleSuccess() {
    navigate(
      '/formulas?tipo=cocina',
    );
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
            No se recibió el identificador de la fórmula de cocina.
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
            Editar fórmula de cocina
          </h1>

          <p className={styles.description}>
            Modificá el consumo por persona y las variedades de pizza incluidas.
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

      <CookingFormulaForm
        formulaId={formulaId}
        onCancel={goBack}
        onSuccess={handleSuccess}
      />
    </section>
  );
}
