import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

import {
  fetchEventSource,
} from '@microsoft/fetch-event-source';

import { useAuth } from '../../modules/auth/hooks/useAuth';

import type {
  RealtimeEvent,
  RealtimeEventHandler,
  RealtimeEventType,
} from './realtime.types';

interface RealtimeContextValue {
  subscribe(
    eventType: RealtimeEventType,
    handler: RealtimeEventHandler,
  ): () => void;
}

export const RealtimeContext =
  createContext<RealtimeContextValue | null>(
    null,
  );

interface RealtimeProviderProps {
  children: ReactNode;
}

function getRealtimeUrl(): string {
  const baseUrl =
    import.meta.env.VITE_API_URL ?? '/api';

  return `${baseUrl.replace(/\/$/, '')}/dashboard/events`;
}

export function RealtimeProvider({
  children,
}: RealtimeProviderProps) {
  const {
    token,
    estaAutenticado,
    sesionInicializada,
  } = useAuth();

  const listenersRef = useRef(
    new Map<
      RealtimeEventType,
      Set<RealtimeEventHandler>
    >(),
  );

  const subscribe = useCallback(
    (
      eventType: RealtimeEventType,
      handler: RealtimeEventHandler,
    ) => {
      const listeners =
        listenersRef.current.get(eventType) ??
        new Set<RealtimeEventHandler>();

      listeners.add(handler);

      listenersRef.current.set(
        eventType,
        listeners,
      );

      return () => {
        const currentListeners =
          listenersRef.current.get(eventType);

        currentListeners?.delete(handler);

        if (currentListeners?.size === 0) {
          listenersRef.current.delete(
            eventType,
          );
        }
      };
    },
    [],
  );

  useEffect(() => {
    if (
      !sesionInicializada ||
      !estaAutenticado ||
      !token
    ) {
      return;
    }

    const controller =
      new AbortController();

    void fetchEventSource(
      getRealtimeUrl(),
      {
        method: 'GET',

        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${token}`,
        },

        signal: controller.signal,

        openWhenHidden: true,

        async onopen(response) {
          if (!response.ok) {
            throw new Error(
              `No se pudo abrir la conexión SSE: ${response.status}`,
            );
          }
        },

        onmessage(message) {
          if (
            message.event === 'heartbeat' ||
            !message.data
          ) {
            return;
          }

          try {
            const event =
              JSON.parse(
                message.data,
              ) as RealtimeEvent;

            const listeners =
              listenersRef.current.get(
                event.type,
              );

            listeners?.forEach(
              (handler) => {
                handler(event);
              },
            );
          } catch {
            // Ignora eventos con un formato inválido.
          }
        },

        onerror(error) {
          if (controller.signal.aborted) {
            return;
          }

          console.error(
            'Conexión en tiempo real interrumpida:',
            error,
          );

          /*
           * fetch-event-source vuelve a intentar
           * la conexión después de este intervalo.
           */
          return 3000;
        },
      },
    );

    return () => {
      controller.abort();
    };
  }, [
    token,
    estaAutenticado,
    sesionInicializada,
  ]);

  const value = useMemo(
    () => ({
      subscribe,
    }),
    [subscribe],
  );

  return (
    <RealtimeContext.Provider
      value={value}
    >
      {children}
    </RealtimeContext.Provider>
  );
}