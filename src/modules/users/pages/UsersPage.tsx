import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CircleAlert,
  CircleX,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Button,
} from '../../../components/ui/Button';

import {
  useAuth,
} from '../../auth/hooks/useAuth';

import {
  loadUsers,
} from '../services/users.service';

import type {
  User,
  UserRole,
} from '../types/user.types';

import styles from './UsersPage.module.css';

type RoleFilter =
  | 'TODOS'
  | UserRole;

type StatusFilter =
  | 'TODOS'
  | 'ACTIVOS'
  | 'INACTIVOS';

const ROLE_LABELS: Record<
  UserRole,
  string
> = {
  ADMINISTRADOR:
    'Administrador',

  OPERADOR:
    'Operador',

  BARRA:
    'Barra',

  COCINA:
    'Cocina',

  LIMPIEZA:
    'Limpieza',
};

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(
    new Date(value),
  );
}

export function UsersPage() {
  const navigate =
    useNavigate();

  const {
    usuario,
  } = useAuth();

  const isAdministrator =
    usuario?.rol ===
    'ADMINISTRADOR';

  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState('');

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<RoleFilter>(
    'TODOS',
  );

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    'TODOS',
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const load = useCallback(
    async () => {
      if (!isAdministrator) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const data =
          await loadUsers();

        setUsers(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [isAdministrator],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const activeUsersCount =
    useMemo(
      () =>
        users.filter(
          (currentUser) =>
            currentUser.activo,
        ).length,
      [users],
    );

  const administratorCount =
    useMemo(
      () =>
        users.filter(
          (currentUser) =>
            currentUser.rol ===
            'ADMINISTRADOR' &&
            currentUser.activo,
        ).length,
      [users],
    );

  const filteredUsers =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            'es-AR',
          );

      return users.filter(
        (currentUser) => {
          const matchesSearch =
            !normalizedSearch ||
            currentUser
              .nombreCompleto
              .toLocaleLowerCase(
                'es-AR',
              )
              .includes(
                normalizedSearch,
              ) ||
            currentUser
              .usuario
              .toLocaleLowerCase(
                'es-AR',
              )
              .includes(
                normalizedSearch,
              ) ||
            currentUser.email
              ?.toLocaleLowerCase(
                'es-AR',
              )
              .includes(
                normalizedSearch,
              );

          const matchesRole =
            roleFilter ===
              'TODOS' ||
            currentUser.rol ===
              roleFilter;

          const matchesStatus =
            statusFilter ===
              'TODOS' ||
            (
              statusFilter ===
                'ACTIVOS' &&
              currentUser.activo
            ) ||
            (
              statusFilter ===
                'INACTIVOS' &&
              !currentUser.activo
            );

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        },
      );
    }, [
      roleFilter,
      search,
      statusFilter,
      users,
    ]);

  if (!isAdministrator) {
    return (
      <section
        className={
          styles.restrictedState
        }
      >
        <ShieldCheck
          size={36}
          aria-hidden="true"
        />

        <div>
          <h1>
            Acceso restringido
          </h1>

          <p>
            Solo un administrador puede gestionar los usuarios del sistema.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Configuración
          </h1>

          <p
            className={
              styles.description
            }
          >
            Administración de usuarios y roles del sistema.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              '/configuracion/usuarios/nuevo',
            )
          }
        >
          <UserPlus
            size={18}
            aria-hidden="true"
          />

          Crear usuario
        </Button>
      </header>

      {!loading && !error && (
        <section
          className={styles.summary}
          aria-label="Resumen de usuarios"
        >
          <article
            className={
              styles.summaryCard
            }
          >
            <Users
              size={24}
              aria-hidden="true"
            />

            <div>
              <span>
                Usuarios activos
              </span>

              <strong>
                {activeUsersCount}
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <ShieldCheck
              size={24}
              aria-hidden="true"
            />

            <div>
              <span>
                Administradores
              </span>

              <strong>
                {
                  administratorCount
                }
              </strong>
            </div>
          </article>
        </section>
      )}

      {!loading && !error && (
        <section
          className={styles.filters}
        >
          <label
            className={styles.search}
          >
            <Search
              size={18}
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Buscar por nombre, usuario o correo"
              aria-label="Buscar usuarios"
            />
          </label>

          <label
            className={
              styles.filter
            }
          >
            <span>Rol</span>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target
                    .value as
                    RoleFilter,
                )
              }
            >
              <option value="TODOS">
                Todos
              </option>

              <option value="ADMINISTRADOR">
                Administrador
              </option>

              <option value="OPERADOR">
                Operador
              </option>

              <option value="BARRA">
                Barra
              </option>

              <option value="COCINA">
                Cocina
              </option>

              <option value="LIMPIEZA">
                Limpieza
              </option>
            </select>
          </label>

          <label
            className={
              styles.filter
            }
          >
            <span>Estado</span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as
                    StatusFilter,
                )
              }
            >
              <option value="TODOS">
                Todos
              </option>

              <option value="ACTIVOS">
                Activos
              </option>

              <option value="INACTIVOS">
                Inactivos
              </option>
            </select>
          </label>
        </section>
      )}

      {loading && (
        <section
          className={styles.loading}
        >
          <span />
          <span />
          <span />
          <span />
        </section>
      )}

      {!loading && error && (
        <section
          className={
            styles.errorState
          }
        >
          <CircleX
            size={30}
            aria-hidden="true"
          />

          <div>
            <h2>
              No se pudieron cargar los usuarios
            </h2>

            <p>
              Verificá la conexión e intentá nuevamente.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              void load()
            }
          >
            Reintentar
          </Button>
        </section>
      )}

      {!loading &&
        !error &&
        users.length === 0 && (
          <section
            className={
              styles.emptyState
            }
          >
            <Users
              size={34}
              aria-hidden="true"
            />

            <div>
              <h2>
                No hay usuarios registrados
              </h2>

              <p>
                Creá el primer usuario desde el botón superior.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        users.length > 0 &&
        filteredUsers.length ===
          0 && (
          <section
            className={
              styles.emptyState
            }
          >
            <Search
              size={32}
              aria-hidden="true"
            />

            <div>
              <h2>
                No hay resultados
              </h2>

              <p>
                Probá con otros filtros o términos de búsqueda.
              </p>
            </div>
          </section>
        )}

      {!loading &&
        !error &&
        filteredUsers.length >
          0 && (
          <section
            className={
              styles.usersGrid
            }
          >
            {filteredUsers.map(
              (currentUser) => (
                <article
                  key={
                    currentUser.id
                  }
                  className={[
                    styles.userCard,

                    !currentUser.activo
                      ? styles.inactiveCard
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <header
                    className={
                      styles.userHeader
                    }
                  >
                    <div>
                      <h2>
                        {
                          currentUser.nombreCompleto
                        }
                      </h2>

                      <p>
                        @
                        {
                          currentUser.usuario
                        }
                      </p>
                    </div>

                    <span
                      className={[
                        styles.statusBadge,

                        currentUser.activo
                          ? styles.activeBadge
                          : styles.inactiveBadge,
                      ].join(' ')}
                    >
                      {currentUser.activo
                        ? 'Activo'
                        : 'Inactivo'}
                    </span>
                  </header>

                  <div
                    className={
                      styles.userDetails
                    }
                  >
                    <div>
                      <span>
                        Rol
                      </span>

                      <strong>
                        {
                          ROLE_LABELS[
                            currentUser.rol
                          ]
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Correo
                      </span>

                      <strong>
                        {currentUser.email ??
                          'Sin correo'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Creado
                      </span>

                      <strong>
                        {formatDate(
                          currentUser.creadoEn,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>
        )}

      {!loading &&
        !error &&
        users.some(
          (currentUser) =>
            !currentUser.activo,
        ) && (
          <section
            className={
              styles.notice
            }
          >
            <CircleAlert
              size={20}
              aria-hidden="true"
            />

            <p>
              Los usuarios inactivos se conservan para mantener el historial del sistema.
            </p>
          </section>
        )}
    </section>
  );
}