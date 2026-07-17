import {
  CalendarDays,
  Check,
  CircleAlert,
  LoaderCircle,
  MoreVertical,
  PartyPopper,
  Pencil,
  Users,
  X,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  cancelReservation,
  confirmReservation,
} from '../../api/reservations.api';

import type {
  Reservation,
} from '../../types/reservations.types';

import styles from './ReservationCard.module.css';

interface ReservationCardProps {
  reservation: Reservation;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(new Date(date));
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

function formatState(
  state: Reservation['estado'],
): string {
  const labels: Record<
    Reservation['estado'],
    string
  > = {
    PENDIENTE: 'Pendiente',
    SENADA: 'Señada',
    CONFIRMADA: 'Confirmada',
    CANCELADA: 'Cancelada',
    FINALIZADA: 'Finalizada',
    ASISTIO: 'Asistió',
    NO_ASISTIO: 'No asistió',
  };

  return labels[state];
}

function formatPartyModality(
  modality: Reservation['modalidadFiesta'],
): string {
  if (modality === 'BARRA_LIBRE') {
    return 'Barra libre';
  }

  if (modality === 'COCTELERIA') {
    return 'Coctelería a la carta';
  }

  return '';
}

export function ReservationCard({
  reservation,
}: ReservationCardProps) {
  const navigate = useNavigate();

  const menuRef =
    useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [confirming, setConfirming] =
    useState(false);

  const [cancelModalOpen, setCancelModalOpen] =
    useState(false);

  const [cancelReason, setCancelReason] =
    useState('');

  const [cancelling, setCancelling] =
    useState(false);

  const [error, setError] =
    useState('');

  const TypeIcon =
    reservation.tipo === 'FIESTA'
      ? PartyPopper
      : CalendarDays;

  const canConfirm =
    reservation.estado === 'PENDIENTE' ||
    reservation.estado === 'SENADA';

  const canCancel =
    reservation.estado === 'PENDIENTE' ||
    reservation.estado === 'SENADA' ||
    reservation.estado === 'CONFIRMADA';

  const description =
    reservation.observaciones?.trim() ?? '';

  const stateClassNames = [
    styles.status,
    styles[
      `status${reservation.estado}`
    ],
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
  if (!menuOpen) {
    return;
  }

  function handlePointerDown(
    event: PointerEvent,
  ) {
    if (
      menuRef.current &&
      !menuRef.current.contains(
        event.target as Node,
      )
    ) {
      setMenuOpen(false);
    }
  }

  function handleKeyDown(
    event: KeyboardEvent,
  ) {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  }

  document.addEventListener(
    'pointerdown',
    handlePointerDown,
  );

  window.addEventListener(
    'keydown',
    handleKeyDown,
  );

  return () => {
    document.removeEventListener(
      'pointerdown',
      handlePointerDown,
    );

    window.removeEventListener(
      'keydown',
      handleKeyDown,
    );
  };
 }, [menuOpen]);

  useEffect(() => {
    if (!cancelModalOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape' &&
        !cancelling
      ) {
        setCancelModalOpen(false);
      }
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

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
  }, [
    cancelModalOpen,
    cancelling,
  ]);

  async function handleConfirm() {
    setError('');
    setConfirming(true);

    try {
      await confirmReservation(
        reservation.id,
      );

      setMenuOpen(false);
    } catch {
      setError(
        'No se pudo confirmar la reserva.',
      );
    } finally {
      setConfirming(false);
    }
  }

  async function handleCancel() {
    const reason =
      cancelReason.trim();

    setError('');

    if (!reason) {
      setError(
        'Ingresá el motivo de la cancelación.',
      );

      return;
    }

    setCancelling(true);

    try {
      await cancelReservation(
        reservation.id,
        {
          motivoCancelacion: reason,
        },
      );

      setCancelReason('');
      setCancelModalOpen(false);
      setMenuOpen(false);
    } catch {
      setError(
        'No se pudo cancelar la reserva.',
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <article className={styles.card}>
        <div className={styles.date}>
          <span className={styles.day}>
            {formatDate(
              reservation.fechaHora,
            )}
          </span>

          <span className={styles.time}>
            {formatTime(
              reservation.fechaHora,
            )}
          </span>
        </div>

        <div className={styles.main}>
          <strong className={styles.client}>
            {reservation.nombreCliente}
          </strong>

          <div className={styles.details}>
            <span>
              <TypeIcon
                size={16}
                aria-hidden="true"
              />

              {reservation.tipo === 'FIESTA'
                ? 'Fiesta'
                : 'Mesa'}
            </span>

            <span>
              <Users
                size={16}
                aria-hidden="true"
              />

              {reservation.cantidadPersonas}{' '}
              personas
            </span>
          </div>

          {reservation.tipo === 'FIESTA' &&
          reservation.modalidadFiesta && (
              <span className={styles.modality}>
              {formatPartyModality(
                  reservation.modalidadFiesta,
              )}
              </span>
          )}
          {error && (
            <span
              className={styles.error}
              role="alert"
            >
              {error}
            </span>
          )}
        </div>

        <div className={styles.actions}>
            {description && (
            <span
                className={styles.description}
                title={description}
            >
                {description}
            </span>
            )}
          <span className={stateClassNames}>
            {formatState(
              reservation.estado,
            )}
          </span>

          <div
            ref={menuRef}
            className={styles.menuWrapper}
          >
            <button
            type="button"
            className={styles.menuButton}
            onClick={() =>
                setMenuOpen((current) => !current)
            }
            aria-label={`Abrir acciones de ${reservation.nombreCliente}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            >
            <MoreVertical
                size={20}
                aria-hidden="true"
            />
            </button>

            {menuOpen && (
              <div
                className={styles.menu}
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    setMenuOpen(false);

                    navigate(
                      `/reservas/${reservation.id}/editar`,
                    );
                  }}
                >
                  <Pencil
                    size={17}
                    aria-hidden="true"
                  />

                  Editar
                </button>

                {canConfirm && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() =>
                      void handleConfirm()
                    }
                    disabled={confirming}
                  >
                    {confirming ? (
                      <LoaderCircle
                        size={17}
                        className={styles.spinner}
                        aria-hidden="true"
                      />
                    ) : (
                      <Check
                        size={17}
                        aria-hidden="true"
                      />
                    )}

                    {confirming
                      ? 'Confirmando...'
                      : 'Confirmar'}
                  </button>
                )}

                {canCancel && (
                  <button
                    type="button"
                    role="menuitem"
                    className={
                      styles.dangerMenuItem
                    }
                    onClick={() => {
                      setError('');
                      setMenuOpen(false);
                      setCancelModalOpen(true);
                    }}
                  >
                    <X
                      size={17}
                      aria-hidden="true"
                    />

                    Cancelar reserva
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {cancelModalOpen && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !cancelling
            ) {
              setCancelModalOpen(false);
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={
              `cancel-title-${reservation.id}`
            }
          >
            <header className={styles.modalHeader}>
              <div>
                <h2
                  id={
                    `cancel-title-${reservation.id}`
                  }
                >
                  Cancelar reserva
                </h2>

                <p>
                  {reservation.nombreCliente}
                </p>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={() =>
                  setCancelModalOpen(false)
                }
                disabled={cancelling}
                aria-label="Cerrar"
              >
                <X
                  size={20}
                  aria-hidden="true"
                />
              </button>
            </header>

            <label className={styles.modalField}>
              <span>
                Motivo de la cancelación
              </span>

              <textarea
                rows={5}
                maxLength={500}
                value={cancelReason}
                onChange={(event) =>
                  setCancelReason(
                    event.target.value,
                  )
                }
                disabled={cancelling}
                autoFocus
              />
            </label>

            {error && (
              <div
                className={styles.modalError}
                role="alert"
              >
                <CircleAlert
                  size={18}
                  aria-hidden="true"
                />

                <span>{error}</span>
              </div>
            )}

            <footer className={styles.modalActions}>
              <button
                type="button"
                className={
                  styles.secondaryAction
                }
                onClick={() =>
                  setCancelModalOpen(false)
                }
                disabled={cancelling}
              >
                Volver
              </button>

              <button
                type="button"
                className={
                  styles.dangerAction
                }
                onClick={() =>
                  void handleCancel()
                }
                disabled={cancelling}
              >
                {cancelling && (
                  <LoaderCircle
                    size={17}
                    className={styles.spinner}
                    aria-hidden="true"
                  />
                )}

                {cancelling
                  ? 'Cancelando...'
                  : 'Confirmar cancelación'}
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}