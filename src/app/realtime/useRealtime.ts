import {
  useContext,
} from 'react';

import {
  RealtimeContext,
} from './RealtimeContext';

export function useRealtime() {
  const context =
    useContext(RealtimeContext);

  if (!context) {
    throw new Error(
      'useRealtime debe utilizarse dentro de RealtimeProvider.',
    );
  }

  return context;
}