import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../../modules/auth/hooks/useAuth';
import { ROUTES } from './routes';

export function ProtectedRoute() {
  const {
    estaAutenticado,
    sesionInicializada,
  } = useAuth();

  const location = useLocation();

  if (!sesionInicializada) {
    return null;
  }

  if (!estaAutenticado) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}