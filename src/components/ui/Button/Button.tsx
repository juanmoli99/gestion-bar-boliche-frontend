import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import styles from './Button.module.css';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  loadingText = 'Cargando...',
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span
            className={styles.spinner}
            aria-hidden="true"
          />

          <span className={styles.content}>
            {loadingText}
          </span>
        </>
      ) : (
        <span className={styles.content}>
          {children}
        </span>
      )}
    </button>
  );
}