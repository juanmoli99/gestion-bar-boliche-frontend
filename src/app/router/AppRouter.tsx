import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

import {
  useAuth,
} from '../../modules/auth/hooks/useAuth';
import { SalaryPositionsPage } from '../../modules/salaries/pages/SalaryPositionsPage';
import {
  LoginPage,
} from '../../modules/auth/pages/LoginPage';

import type {
  RolUsuario,
} from '../../modules/auth/types/auth.types';

import {
  CalculationsPage,
} from '../../modules/calculations/pages/CalculationsPage';

import {
  DashboardPage,
} from '../../modules/dashboard/pages/DashboardPage';

import {
  CreateFormulaPage,
} from '../../modules/formulas/pages/CreateFormulaPage';

import {
  EditFormulaPage,
} from '../../modules/formulas/pages/EditFormulaPage';

import {
  FormulasPage,
} from '../../modules/formulas/pages/FormulasPage';

import {
  CreateInventoryItemPage,
} from '../../modules/inventory/pages/CreateInventoryItemPage';

import {
  InventoryCountPage,
} from '../../modules/inventory/pages/InventoryCountPage';

import {
  InventoryPage,
} from '../../modules/inventory/pages/InventoryPage';

import {
  MainLayout,
} from '../../modules/layout/components/MainLayout/MainLayout';

import {
  PurchasesPage,
} from '../../modules/purchases/pages/PurchasesPage';

import {
  CreateReservationPage,
} from '../../modules/reservations/pages/CreateReservationPage';

import {
  EditReservationPage,
} from '../../modules/reservations/pages/EditReservationPage';

import {
  ReservationsPage,
} from '../../modules/reservations/pages/ReservationsPage';

import {
  PlaceholderPage,
} from '../../modules/shared/pages/PlaceholderPage';

import {
  CreateUserPage,
} from '../../modules/users/pages/CreateUserPage';

import {
  UsersPage,
} from '../../modules/users/pages/UsersPage';

import {
  ValuesPage,
} from '../../modules/values/pages/ValuesPage';

import {
  ProtectedRoute,
} from './ProtectedRoute';

import {
  ROUTES,
} from './routes';

const ROLE_HOME: Record<
  RolUsuario,
  string
> = {
  ADMINISTRADOR: '/',
  OPERADOR: '/reservas',
  BARRA: '/inventario',
  COCINA: '/inventario',
  MOZO: '/reservas',
  LIMPIEZA: '/inventario',
};

interface RoleRouteProps {
  roles: RolUsuario[];
}

function getHomeByRole(
  rol: RolUsuario,
): string {
  return ROLE_HOME[rol];
}

function AuthenticatedLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function PublicLoginRoute() {
  const {
    usuario,
    estaAutenticado,
    sesionInicializada,
  } = useAuth();

  if (!sesionInicializada) {
    return null;
  }

  if (
    estaAutenticado &&
    usuario
  ) {
    return (
      <Navigate
        to={getHomeByRole(
          usuario.rol,
        )}
        replace
      />
    );
  }

  return <LoginPage />;
}

function RoleRoute({
  roles,
}: RoleRouteProps) {
  const {
    usuario,
    sesionInicializada,
  } = useAuth();

  if (!sesionInicializada) {
    return null;
  }

  if (!usuario) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
      />
    );
  }

  if (
    !roles.includes(
      usuario.rol,
    )
  ) {
    return (
      <Navigate
        to={getHomeByRole(
          usuario.rol,
        )}
        replace
      />
    );
  }

  return <Outlet />;
}

export function AppRouter() {
  return (
  <Routes>
    <Route
      path="/"
      element={<PublicLoginRoute />}
    />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route
            element={
              <RoleRoute
                roles={[
                  'ADMINISTRADOR',
                ]}
              />
            }
          >
            <Route
              path="/inicio"
              element={<DashboardPage />}
            />

            <Route
              path="/compras"
              element={<PurchasesPage />}
            />

            <Route
              path="/proveedores"
              element={
                <PlaceholderPage
                  title="Proveedores"
                  description="Administración de proveedores."
                />
              }
            />

            <Route
              path="/inventario/nuevo"
              element={
                <CreateInventoryItemPage />
              }
            />

            <Route
              path="/formulas"
              element={<FormulasPage />}
            />

            <Route
              path="/formulas/nueva"
              element={<CreateFormulaPage />}
            />

            <Route
              path="/formulas/:id/editar"
              element={<EditFormulaPage />}
            />

            <Route
              path="/calculos"
              element={<CalculationsPage />}
            />

            <Route
              path="/valores"
              element={<ValuesPage />}
            />

            <Route
              path="/configuracion"
              element={<UsersPage />}
            />

            <Route
              path="/configuracion/usuarios/nuevo"
              element={<CreateUserPage />}
            />
          </Route>

          <Route
            element={
              <RoleRoute
                roles={[
                  'ADMINISTRADOR',
                  'OPERADOR',
                  'MOZO',
                ]}
              />
            }
          >
            <Route
              path="/reservas"
              element={<ReservationsPage />}
            />

            <Route
              path="/reservas/nueva"
              element={<CreateReservationPage />}
            />

            <Route
              path="/reservas/:id/editar"
              element={<EditReservationPage />}
            />
          </Route>

          <Route
            element={
              <RoleRoute
                roles={[
                  'ADMINISTRADOR',
                  'OPERADOR',
                  'BARRA',
                  'COCINA',
                  'MOZO',
                  'LIMPIEZA',
                ]}
              />
            }
          >
            <Route
              path="/inventario"
              element={<InventoryPage />}
            />

            <Route
              path="/inventario/conteo"
              element={<InventoryCountPage />}
            />
          </Route>

          <Route
            element={
              <RoleRoute
                roles={[
                  'ADMINISTRADOR',
                  'OPERADOR',
                ]}
              />
            }
          >
            <Route
              path="/sueldos"
              element={<SalaryPositionsPage />}
            />
                </Route>
              </Route>
            </Route>

      <Route
        path="*"
        element={<RoleRedirect />}
      />
    </Routes>
  );
}

function RoleRedirect() {
  const {
    usuario,
    estaAutenticado,
    sesionInicializada,
  } = useAuth();

  if (!sesionInicializada) {
    return null;
  }

  if (
    !estaAutenticado ||
    !usuario
  ) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
      />
    );
  }

  return (
    <Navigate
      to={getHomeByRole(
        usuario.rol,
      )}
      replace
    />
  );
}