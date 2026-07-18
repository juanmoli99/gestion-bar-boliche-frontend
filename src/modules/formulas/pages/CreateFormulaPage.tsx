import {
  ArrowLeft,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  FormulaForm,
} from '../components/FormulaForm/FormulaForm';

import styles from './FormulaEditorPage.module.css';

export function CreateFormulaPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate('/formulas');
  }

  function handleSuccess() {
    navigate('/formulas');
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Nueva fórmula
          </h1>

          <p className={styles.description}>
            Definí los ítems y el consumo estimado
            por persona.
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
        onCancel={goBack}
        onSuccess={handleSuccess}
      />
    </section>
  );
}