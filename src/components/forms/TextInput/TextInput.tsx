import {
  forwardRef,
  type InputHTMLAttributes,
} from 'react';

import styles from './TextInput.module.css';

interface TextInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput = forwardRef<
  HTMLInputElement,
  TextInputProps
>(function TextInput(
  {
    label,
    error,
    id,
    className = '',
    ...props
  },
  ref,
) {
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
          className={classNames}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : undefined
          }
        />
      </div>

      <div className={styles.messageArea}>
        {error && (
          <span
            id={`${inputId}-error`}
            className={styles.error}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
});