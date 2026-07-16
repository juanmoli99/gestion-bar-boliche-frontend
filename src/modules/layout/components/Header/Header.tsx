import {
  LogOut,
  Menu,
} from 'lucide-react';

import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../../auth/hooks/useAuth';

import styles from './Header.module.css';

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({
  onOpenMenu,
}: HeaderProps) {
  const {
    usuario,
    logout,
  } = useAuth();

  return (
    <div className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onOpenMenu}
        aria-label="Abrir menú"
      >
        <Menu
          size={24}
          aria-hidden="true"
        />
      </button>

      <div className={styles.actions}>
        <div className={styles.identity}>
          <span className={styles.name}>
            {usuario?.nombreCompleto}
          </span>

          <span className={styles.role}>
            {usuario?.rol}
          </span>
        </div>

        <Button
          variant="secondary"
          onClick={logout}
          className={styles.logoutButton}
          aria-label="Cerrar sesión"
        >
          <LogOut
            size={18}
            aria-hidden="true"
          />

          <span className={styles.logoutText}>
            Cerrar sesión
          </span>
        </Button>
      </div>
    </div>
  );
}