import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children,
}: MainLayoutProps) {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [mobileMenuOpen]);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Header
          onOpenMenu={() =>
            setMobileMenuOpen(true)
          }
        />
      </header>

      <aside className={styles.desktopSidebar}>
        <Sidebar
          mobileOpen={false}
          onClose={() => undefined}
        />
      </aside>

      <div className={styles.mobileSidebar}>
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() =>
            setMobileMenuOpen(false)
          }
        />
      </div>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}