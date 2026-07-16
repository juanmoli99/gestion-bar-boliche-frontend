import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import { PasswordInput } from '../../../components/forms/PasswordInput';
import { TextInput } from '../../../components/forms/TextInput';
import { Button } from '../../../components/ui/Button';

import { useAuth } from '../hooks/useAuth';

import styles from './LoginForm.module.css';

interface LoginFormProps {
  visible: boolean;
}

export function LoginForm({
  visible,
}: LoginFormProps) {
  const {
    login,
    cargando,
  } = useAuth();

  const [usuario, setUsuario] =
    useState('');

  const [contrasena, setContrasena] =
    useState('');

  const [error, setError] =
    useState('');

  const usuarioInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const frame =
      requestAnimationFrame(() => {
        usuarioInputRef.current?.focus();
      });

    return () =>
      cancelAnimationFrame(frame);
  }, [visible]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (!usuario.trim()) {
      setError(
        'Ingresá el usuario.',
      );
      return;
    }

    if (!contrasena.trim()) {
      setError(
        'Ingresá la contraseña.',
      );
      return;
    }

    try {
      await login({
        usuario,
        contrasena,
      });
    } catch {
      setError(
        'Usuario o contraseña incorrectos.',
      );
    }
  }

  const classNames = [
    styles.form,
    visible
      ? styles.visible
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <form
      className={classNames}
      onSubmit={handleSubmit}
      noValidate
      aria-hidden={!visible}
    >
      <TextInput
        ref={usuarioInputRef}
        id="usuario"
        name="usuario"
        label="Usuario"
        value={usuario}
        onChange={(event) =>
          setUsuario(
            event.target.value,
          )
        }
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        disabled={
          !visible || cargando
        }
      />

      <PasswordInput
        id="contrasena"
        name="contrasena"
        label="Contraseña"
        value={contrasena}
        onChange={(event) =>
          setContrasena(
            event.target.value,
          )
        }
        autoComplete="current-password"
        disabled={
          !visible || cargando
        }
      />

      <Button
        type="submit"
        fullWidth
        isLoading={cargando}
        disabled={!visible}
      >
        Ingresar
      </Button>

      <div
        className={styles.messageArea}
        role="status"
        aria-live="polite"
      >
        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </form>
  );
}