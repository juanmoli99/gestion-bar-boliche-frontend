import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { useAuth } from '../../modules/auth/hooks/useAuth';

import { MainLayout } from '../../modules/layout/components/MainLayout/MainLayout';

import { PlaceholderPage } from '../../modules/shared/pages/PlaceholderPage';

import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';

function AuthenticatedLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function DashboardPage() {
  const { usuario } = useAuth();

  return (
    <PlaceholderPage
      title={`Bienvenido, ${usuario?.nombreCompleto ?? ''}`}
      description="Este será el dashboard principal de PREVIA."
    />
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
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/mesas"
            element={
              <PlaceholderPage
                title="Mesas"
                description="Gestión del salón, apertura de mesas y seguimiento del servicio."
              />
            }
          />

          <Route
            path="/reservas"
            element={
              <PlaceholderPage
                title="Reservas"
                description="Administración de reservas de mesas y fiestas."
              />
            }
          />

          <Route
            path="/caja"
            element={
              <PlaceholderPage
                title="Caja"
                description="Apertura, movimientos, cobros y cierre de caja."
              />
            }
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
            path="/inventario"
            element={
              <PlaceholderPage
                title="Inventario"
                description="Control de ítems, stock y movimientos de inventario."
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
            path="/reportes"
            element={
              <PlaceholderPage
                title="Reportes"
                description="Indicadores y consultas del funcionamiento del negocio."
              />
            }
          />

          <Route
            path="/configuracion"
            element={
              <PlaceholderPage
                title="Configuración"
                description="Usuarios, permisos y parámetros generales del sistema."
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