import {
  useState,
  type FormEvent,
} from 'react';

import {
  ArrowLeft,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  Save,
  UserPlus,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  saveUser,
} from '../services/users.service';

import type {
  UserRole,
} from '../types/user.types';

import styles from './CreateUserPage.module.css';

interface FormValues {
  nombreCompleto: string;
  usuario: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
  rol: UserRole;
}

const INITIAL_FORM: FormValues = {
  nombreCompleto: '',
  usuario: '',
  email: '',
  contrasena: '',
  confirmarContrasena: '',
  rol: 'OPERADOR',
};

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
  description: string;
}[] = [
  {
    value: 'ADMINISTRADOR',
    label: 'Administrador',
    description:
      'Acceso completo a la configuración y administración del sistema.',
  },
  {
    value: 'OPERADOR',
    label: 'Operador',
    description:
      'Acceso operativo general sin permisos administrativos.',
  },
  {
    value: 'BARRA',
    label: 'Barra',
    description:
      'Acceso a las funciones correspondientes a barra y bebidas.',
  },
  {
    value: 'COCINA',
    label: ' Cocina',
    description:
      'Acceso a las funciones correspondientes a cocina.',
  },
  {
    value: 'LIMPIEZA',
    label: 'Limpieza',
    description:
      'Acceso a las funciones correspondientes a limpieza.',
  },
];

export function CreateUserPage() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState<FormValues>(
      INITIAL_FORM,
    );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    formError,
    setFormError,
  ] = useState<string | null>(
    null,
  );

  const selectedRole =
    ROLE_OPTIONS.find(
      (role) =>
        role.value === form.rol,
    );

  function updateField<
    Field extends keyof FormValues,
  >(
    field: Field,
    value: FormValues[Field],
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    setFormError(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nombreCompleto =
      form.nombreCompleto.trim();

    const usuario =
      form.usuario
        .trim()
        .toLowerCase();

    const email =
      form.email
        .trim()
        .toLowerCase();

    if (
      nombreCompleto.length < 3
    ) {
      setFormError(
        'El nombre completo debe tener al menos 3 caracteres.',
      );

      return;
    }

    if (
      usuario.length < 3
    ) {
      setFormError(
        'El nombre de usuario debe tener al menos 3 caracteres.',
      );

      return;
    }

    if (
      usuario.includes(' ')
    ) {
      setFormError(
        'El nombre de usuario no puede contener espacios.',
      );

      return;
    }

    if (
      form.contrasena.length < 8
    ) {
      setFormError(
        'La contraseña debe tener al menos 8 caracteres.',
      );

      return;
    }

    if (
      form.contrasena !==
      form.confirmarContrasena
    ) {
      setFormError(
        'Las contraseñas no coinciden.',
      );

      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      await saveUser({
        nombreCompleto,
        usuario,

        email:
          email ||
          undefined,

        contrasena:
          form.contrasena,

        rol:
          form.rol,
      });

        navigate('/configuracion')    
    } catch {
      setFormError(
        'No se pudo crear el usuario. Verificá que el nombre de usuario y el correo no estén registrados.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate('/configuracion')
          }
          disabled={saving}
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          Volver
        </Button>

        <div>
          <h1 className={styles.title}>
            Crear usuario
          </h1>

          <p className={styles.description}>
            Registrá un usuario y asignale su rol dentro del sistema.
          </p>
        </div>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <section className={styles.card}>
          <header className={styles.cardHeader}>
            <UserPlus
              size={22}
              aria-hidden="true"
            />

            <div>
              <h2>
                Datos del usuario
              </h2>

              <p>
                Información personal y credenciales de acceso.
              </p>
            </div>
          </header>

          <div className={styles.fieldsGrid}>
            <label className={styles.field}>
              <span>
                Nombre completo
              </span>

              <input
                type="text"
                value={
                  form.nombreCompleto
                }
                onChange={(event) =>
                  updateField(
                    'nombreCompleto',
                    event.target.value,
                  )
                }
                minLength={3}
                maxLength={100}
                placeholder="Ejemplo: Juan Pérez"
                autoFocus
                disabled={saving}
                required
              />
            </label>

            <label className={styles.field}>
              <span>
                Nombre de usuario
              </span>

              <input
                type="text"
                value={form.usuario}
                onChange={(event) =>
                  updateField(
                    'usuario',
                    event.target.value,
                  )
                }
                minLength={3}
                maxLength={50}
                placeholder="Ejemplo: juan.perez"
                autoComplete="username"
                disabled={saving}
                required
              />
            </label>

            <label className={styles.field}>
              <span>
                Correo electrónico
              </span>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value,
                  )
                }
                placeholder="Opcional"
                autoComplete="email"
                disabled={saving}
              />
            </label>

            <label className={styles.field}>
              <span>
                Rol
              </span>

              <select
                value={form.rol}
                onChange={(event) =>
                  updateField(
                    'rol',
                    event.target
                      .value as UserRole,
                  )
                }
                disabled={saving}
              >
                {ROLE_OPTIONS.map(
                  (role) => (
                    <option
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
                    </option>
                  ),
                )}
              </select>

              <small className={styles.fieldHelp}>
                {
                  selectedRole
                    ?.description
                }
              </small>
            </label>

            <label className={styles.field}>
              <span>
                Contraseña
              </span>

              <div className={styles.passwordField}>
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    form.contrasena
                  }
                  onChange={(event) =>
                    updateField(
                      'contrasena',
                      event.target.value,
                    )
                  }
                  minLength={8}
                  maxLength={100}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  disabled={saving}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  disabled={saving}
                  aria-label={
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </label>

            <label className={styles.field}>
              <span>
                Confirmar contraseña
              </span>

              <div className={styles.passwordField}>
                <input
                  type={
                    showPasswordConfirmation
                      ? 'text'
                      : 'password'
                  }
                  value={
                    form.confirmarContrasena
                  }
                  onChange={(event) =>
                    updateField(
                      'confirmarContrasena',
                      event.target.value,
                    )
                  }
                  minLength={8}
                  maxLength={100}
                  autoComplete="new-password"
                  placeholder="Repetí la contraseña"
                  disabled={saving}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordConfirmation(
                      (current) =>
                        !current,
                    )
                  }
                  disabled={saving}
                  aria-label={
                    showPasswordConfirmation
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {showPasswordConfirmation ? (
                    <EyeOff
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </label>
          </div>
        </section>

        {formError && (
          <section
            className={styles.formError}
            role="alert"
          >
            <CircleAlert
              size={20}
              aria-hidden="true"
            />

            <p>
              {formError}
            </p>
          </section>
        )}

        <footer className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate('/configuracion')
            }
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle
                size={18}
                aria-hidden="true"
              />
            ) : (
              <Save
                size={18}
                aria-hidden="true"
              />
            )}

            {saving
              ? 'Creando...'
              : 'Crear usuario'}
          </Button>
        </footer>
      </form>
    </section>
  );
}