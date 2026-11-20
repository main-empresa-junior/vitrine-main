'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
