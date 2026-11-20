'use client';

import { useSyncExternalStore } from 'react';

import { supportsWebGL } from '@/lib/webgl';

const noopSubscribe = () => () => {};

export function useSupportsWebGL(): boolean {
  return useSyncExternalStore(noopSubscribe, supportsWebGL, () => true);
}
