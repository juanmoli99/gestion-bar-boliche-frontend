export type RealtimeEventType =
  | 'dashboard.updated'
  | 'inventory.updated'
  | 'reservations.updated'
  | 'purchases.updated';

export interface RealtimeEvent {
  type: RealtimeEventType;
  occurredAt: string;
}

export type RealtimeEventHandler = (
  event: RealtimeEvent,
) => void;