import {
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import type {
  InventoryAlertGroup,
} from '../../types/dashboard.types';

import styles from './InventoryAlerts.module.css';

interface InventoryAlertsProps {
  groups: InventoryAlertGroup[];
}

const INVENTORY_LABELS: Record<string, string> = {
  BEBIDAS: 'Bebidas',
  COCINA: 'Cocina',
  LIMPIEZA: 'Limpieza',
  VARIOS: 'Varios',
};

const MAX_VISIBLE_ITEMS = 5;

export function InventoryAlerts({
  groups,
}: InventoryAlertsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      {groups.map((group) => {
        const visibleItems =
          group.items.slice(
            0,
            MAX_VISIBLE_ITEMS,
          );

        const remainingItems =
          Math.max(
            group.items.length -
              MAX_VISIBLE_ITEMS,
            0,
          );

        return (
          <section
            key={group.inventario}
            className={styles.card}
          >
            <header className={styles.header}>
              <div className={styles.headerIcon}>
                <AlertTriangle
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div className={styles.headerText}>
                <h2>
                  Inventario ·{' '}
                  {INVENTORY_LABELS[
                    group.inventario
                  ] ?? group.inventario}
                </h2>

                <p>
                  {group.items.length === 1
                    ? '1 producto requiere atención'
                    : `${group.items.length} productos requieren atención`}
                </p>
              </div>
            </header>

            <div className={styles.items}>
              {visibleItems.map((item) => (
                <article
                  key={item.id}
                  className={styles.item}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemName}>
                      {item.itemNombre}
                    </span>

                    <span className={styles.itemCategory}>
                      {item.categoriaNombre}
                    </span>
                  </div>

                  <div className={styles.itemStatus}>
                    <span
                      className={
                        item.criticidad ===
                        'SIN_STOCK'
                          ? styles.outBadge
                          : styles.lowBadge
                      }
                    >
                      {item.criticidad ===
                      'SIN_STOCK'
                        ? 'Sin stock'
                        : 'Stock bajo'}
                    </span>

                    <span className={styles.quantity}>
                      {item.cantidadActual}{' '}
                      {item.abreviaturaUnidad}
                      {' / '}
                      mínimo{' '}
                      {item.cantidadMinima}{' '}
                      {item.abreviaturaUnidad}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <footer className={styles.footer}>
              {remainingItems > 0 && (
                <span className={styles.remaining}>
                  {remainingItems === 1
                    ? '1 producto más'
                    : `${remainingItems} productos más`}
                </span>
              )}

              <Link
                to="/inventario"
                className={styles.link}
              >
                Ver inventario

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                />
              </Link>
            </footer>
          </section>
        );
      })}
    </>
  );
}