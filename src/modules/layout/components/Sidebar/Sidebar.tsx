import {
  X,
} from 'lucide-react';
import type {
  MouseEvent,
} from 'react';
import { NavigationMenu } from '../../navigation/NavigationMenu';

import styles from './Sidebar.module.css';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
  const classNames = [
    styles.sidebar,
    mobileOpen ? styles.mobileOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleNavigationClick(
    event: MouseEvent<HTMLDivElement>,
  ) {
    const target = event.target as HTMLElement;

    if (target.closest('a')) {
      onClose();
    }
  }

  return (
    <>
      <button
        type="button"
        className={[
          styles.overlay,
          mobileOpen
            ? styles.overlayVisible
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onClose}
        aria-label="Cerrar menú"
        tabIndex={mobileOpen ? 0 : -1}
      />

      <aside
        className={classNames}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.brand}>
          <span className={styles.logo}>
            PREVIA
          </span>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X
              size={22}
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          className={styles.navigation}
          onClick={handleNavigationClick}
        >
          <NavigationMenu />
        </div>
      </aside>
    </>
  );
}