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
  CookingFormulaForm,
} from '../components/CookingFormulaForm/CookingFormulaForm';

import styles from './FormulaEditorPage.module.css';

export function CreateCookingFormulaPage() {
  const navigate = useNavigate();

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

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Nueva fórmula de cocina
          </h1>

          <p className={styles.description}>
            Definí el consumo de pizzas por persona y las variedades incluidas.
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
        onCancel={goBack}
        onSuccess={handleSuccess}
      />
    </section>
  );
}
