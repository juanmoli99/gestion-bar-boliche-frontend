import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

import {
  useAuth,
} from '../../modules/auth/hooks/useAuth';

import {
  LoginPage,
} from '../../modules/auth/pages/LoginPage';

import {
  DashboardPage,
} from '../../modules/dashboard/pages/DashboardPage';

import {
  MainLayout,
} from '../../modules/layout/components/MainLayout/MainLayout';

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
  ValuesPage,
} from '../../modules/values/pages/ValuesPage';

import {
  ProtectedRoute,
} from './ProtectedRoute';

import {
  ROUTES,
} from './routes';

function AuthenticatedLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function PublicLoginRoute() {
  const {
    estaAutenticado,
    sesionInicializada,
  } = useAuth();

  if (!sesionInicializada) {
    return null;
  }

  if (estaAutenticado) {
    return (
      <Navigate
        to={ROUTES.home}
        replace
      />
    );
  }

  return <LoginPage />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.login}
        element={<PublicLoginRoute />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route
            path={ROUTES.home}
            element={<DashboardPage />}
          />

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

          <Route
            path="/compras"
            element={
              <PlaceholderPage
                title="Compras"
                description="Registro y seguimiento de compras a proveedores."
              />
            }
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
            path="/inventario"
            element={
              <PlaceholderPage
                title="Inventario"
                description="Control de ítems, stock y movimientos."
              />
            }
          />

          <Route
            path="/calculos"
            element={
              <PlaceholderPage
                title="Cálculos"
                description="Cálculos de consumo y listas de compra para fiestas."
              />
            }
          />

          <Route
            path="/valores"
            element={<ValuesPage />}
          />

          <Route
            path="/configuracion"
            element={
              <PlaceholderPage
                title="Configuración"
                description="Usuarios, permisos y parámetros generales."
              />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={ROUTES.home}
            replace
          />
        }
      />
    </Routes>
  );
}