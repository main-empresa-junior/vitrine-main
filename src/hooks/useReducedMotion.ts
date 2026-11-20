'use client';

import { useHtmlAttribute } from './useHtmlAttribute';

export function useReducedMotion(): boolean {
  return useHtmlAttribute('data-motion', 'reduced') === 'reduced';
}
