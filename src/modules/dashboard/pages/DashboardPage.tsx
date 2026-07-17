import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  CircleCheckBig,
  CircleX,
} from 'lucide-react';

import {
  useRealtime,
} from '../../../app/realtime/useRealtime';

import {
  DashboardAlerts,
} from '../components/DashboardAlerts/DashboardAlerts';

import {
  InventoryAlerts,
} from '../components/InventoryAlerts/InventoryAlerts';

import {
  loadDashboard,
} from '../services/dashboard.service';

import type {
  DashboardData,
} from '../types/dashboard.types';

import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const {
    subscribe,
  } = useRealtime();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const load = useCallback(
    async (
      showInitialLoading = false,
    ) => {
      if (showInitialLoading) {
        setLoading(true);
      }

      setError(false);

      try {
        const data =
          await loadDashboard();

        setDashboard(data);
      } catch {
        setError(true);
      } finally {
        if (showInitialLoading) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void load(true);
  }, [load]);

  useEffect(() => {
    return subscribe(
      'reservations.updated',
      () => {
        void load(false);
      },
    );
  }, [
    subscribe,
    load,
  ]);

  const totalAlerts =
    dashboard
      ? dashboard.summary.inventoryAlerts +
        dashboard.summary.todayReservations +
        dashboard.summary.todayEvents +
        dashboard.summary.pendingPurchases
      : 0;

  const everythingIsFine =
    dashboard !== null &&
    totalAlerts === 0;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Dashboard
          </h1>

          <p className={styles.description}>
            {totalAlerts > 0
              ? `${totalAlerts} ${
                  totalAlerts === 1
                    ? 'situación requiere'
                    : 'situaciones requieren'
                } atención.`
              : 'Situaciones que requieren atención.'}
          </p>
        </div>
      </header>

      {loading && !dashboard && (
        <div className={styles.loading}>
          <span />
          <span />
          <span />
        </div>
      )}

      {error && !dashboard && (
        <section className={styles.error}>
          <CircleX
            size={28}
            aria-hidden="true"
          />

          <div>
            <h2>
              No se pudo cargar el dashboard
            </h2>

            <p>
              Verificá la conexión y recargá la página.
            </p>
          </div>
        </section>
      )}

      {!error && everythingIsFine && (
        <section className={styles.allGood}>
          <CircleCheckBig
            size={38}
            aria-hidden="true"
          />

          <div>
            <h2>Todo en orden</h2>

            <p>
              No hay alertas, reservas ni compras pendientes que requieran atención.
            </p>
          </div>
        </section>
      )}

      {dashboard && totalAlerts > 0 && (
        <div className={styles.content}>
          <InventoryAlerts
            groups={
              dashboard.inventoryAlerts
            }
          />

          <DashboardAlerts
            reservations={
              dashboard.todayReservations
            }
            events={
              dashboard.todayEvents
            }
            purchases={
              dashboard.pendingPurchases
            }
          />
        </div>
      )}
    </section>
  );
}