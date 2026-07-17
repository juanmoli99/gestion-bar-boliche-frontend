import {
  ArrowRight,
  CalendarDays,
  PartyPopper,
  ShoppingCart,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import type {
  PendingPurchase,
  TodayEvent,
  TodayReservation,
} from '../../types/dashboard.types';

import styles from './DashboardAlerts.module.css';

interface DashboardAlertsProps {
  reservations: TodayReservation[];
  events: TodayEvent[];
  purchases: PendingPurchase[];
}

function formatTime(date: string): string {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  ).format(new Date(date));
}

function formatCurrency(value: string): string {
  return new Intl.NumberFormat(
    'es-AR',
    {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    },
  ).format(Number(value));
}

function formatState(state: string): string {
  return state
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/^./, (letter) =>
      letter.toUpperCase(),
    );
}

export function DashboardAlerts({
  reservations,
  events,
  purchases,
}: DashboardAlertsProps) {
  return (
    <>
      {reservations.length > 0 && (
        <section className={styles.card}>
          <header className={styles.header}>
            <div className={styles.reservationIcon}>
              <CalendarDays
                size={21}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2>Reservas de mesas para hoy</h2>

              <p>
                {reservations.length === 1
                  ? '1 reserva programada'
                  : `${reservations.length} reservas programadas`}
              </p>
            </div>
          </header>

          <div className={styles.items}>
            {reservations
              .slice(0, 5)
              .map((reservation) => (
                <article
                  key={reservation.id}
                  className={styles.item}
                >
                  <div className={styles.primary}>
                    <span className={styles.time}>
                      {formatTime(
                        reservation.fechaHora,
                      )}
                    </span>

                    <div className={styles.info}>
                      <strong>
                        {reservation.nombreCliente}
                      </strong>

                      <span>
                        {reservation.cantidadPersonas}{' '}
                        personas
                      </span>
                    </div>
                  </div>

                  <span className={styles.status}>
                    {formatState(
                      reservation.estado,
                    )}
                  </span>
                </article>
              ))}
          </div>

          <Link
            to="/reservas"
            className={styles.link}
          >
            Ver reservas

            <ArrowRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </section>
      )}

      {events.length > 0 && (
        <section className={styles.card}>
          <header className={styles.header}>
            <div className={styles.eventIcon}>
              <PartyPopper
                size={21}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2>Fiestas para hoy</h2>

              <p>
                {events.length === 1
                  ? '1 fiesta programada'
                  : `${events.length} fiestas programadas`}
              </p>
            </div>
          </header>

          <div className={styles.items}>
            {events
              .slice(0, 5)
              .map((event) => (
                <article
                  key={event.id}
                  className={styles.item}
                >
                  <div className={styles.primary}>
                    <span className={styles.time}>
                      {formatTime(event.fechaHora)}
                    </span>

                    <div className={styles.info}>
                      <strong>
                        {event.nombreCliente}
                      </strong>

                      <span>
                        {event.cantidadPersonas}{' '}
                        personas
                        {event.nombreFormula
                          ? ` · ${event.nombreFormula}`
                          : ''}
                      </span>
                    </div>
                  </div>

                  <span className={styles.status}>
                    {formatState(event.estado)}
                  </span>
                </article>
              ))}
          </div>

          <Link
            to="/reservas"
            className={styles.link}
          >
            Ver fiestas

            <ArrowRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </section>
      )}

      {purchases.length > 0 && (
        <section className={styles.card}>
          <header className={styles.header}>
            <div className={styles.purchaseIcon}>
              <ShoppingCart
                size={21}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2>Compras pendientes</h2>

              <p>
                {purchases.length === 1
                  ? '1 compra sin confirmar'
                  : `${purchases.length} compras sin confirmar`}
              </p>
            </div>
          </header>

          <div className={styles.items}>
            {purchases
              .slice(0, 5)
              .map((purchase) => (
                <article
                  key={purchase.id}
                  className={styles.item}
                >
                  <div className={styles.info}>
                    <strong>
                      {purchase.proveedor}
                    </strong>

                    <span>
                      {purchase.inventario}
                      {purchase.numeroComprobante
                        ? ` · ${purchase.numeroComprobante}`
                        : ''}
                    </span>
                  </div>

                  <div className={styles.purchaseAmount}>
                    <strong>
                      {formatCurrency(
                        purchase.total,
                      )}
                    </strong>

                    <span>Pendiente</span>
                  </div>
                </article>
              ))}
          </div>

          <Link
            to="/compras"
            className={styles.link}
          >
            Ver compras

            <ArrowRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </section>
      )}
    </>
  );
}