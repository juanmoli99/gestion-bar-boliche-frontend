import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from 'react';

import {
  Eye,
  EyeOff,
} from 'lucide-react';

import styles from './PasswordInput.module.css';

interface PasswordInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  label: string;
  error?: string;
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(
  {
    label,
    error,
    id,
    className = '',
    ...props
  },
  ref,
) {
  const [visible, setVisible] =
    useState(false);

  const inputId =
    id ??
    `input-${label
      .toLowerCase()
      .replace(/\s+/g, '-')}`;

  const classNames = [
    styles.input,
    error ? styles.errorInput : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.field}>
      <label
        htmlFor={inputId}
        className={styles.label}
      >
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={
            visible
              ? 'text'
              : 'password'
          }
          className={classNames}
          aria-invalid={Boolean(error)}
        />

        <button
          type="button"
          className={styles.toggle}
          onClick={() =>
            setVisible(!visible)
          }
          aria-label={
            visible
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'
          }
        >
          {visible ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      <div className={styles.messageArea}>
        {error && (
          <span className={styles.error}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
});