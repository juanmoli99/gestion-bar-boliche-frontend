import { NavLink } from 'react-router-dom';

import { navigationItems } from './navigation.items';

import styles from './NavigationMenu.module.css';

export function NavigationMenu() {
  return (
    <nav
      className={styles.navigation}
      aria-label="Navegación principal"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              [
                styles.link,
                isActive ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            {Icon && (
              <Icon
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}

            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}