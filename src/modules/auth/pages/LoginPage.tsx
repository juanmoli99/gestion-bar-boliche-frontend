import {
  useCallback,
  useState,
} from 'react';

import { Logo } from '../../../components/common/Logo';
import { Container } from '../../../components/ui/Container';

import { LoginForm } from '../components/LoginForm';

import styles from './LoginPage.module.css';

export function LoginPage() {
  const [showForm, setShowForm] =
    useState(false);

  const handleLogoAnimationFinished =
    useCallback(() => {
      setShowForm(true);
    }, []);

  return (
    <Container
      centered
      size="xs"
    >
      <div className={styles.wrapper}>
        <Logo
          size="lg"
          onAnimationFinished={
            handleLogoAnimationFinished
          }
        />

        <LoginForm visible={showForm} />

        <span className={styles.version}>
          Versión 1.0.0
        </span>
      </div>
    </Container>
  );
}