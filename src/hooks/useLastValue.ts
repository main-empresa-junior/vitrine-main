'use client';

import { useState } from 'react';

// Guarda o último valor não nulo, para o conteúdo continuar na tela enquanto esmaece ao sair.
export function useLastValue<T>(value: T | null | undefined, keyOf: (item: T) => string): T | null {
  const [last, setLast] = useState<T | null>(value ?? null);
  if (value !== null && value !== undefined && (last === null || keyOf(value) !== keyOf(last))) {
    setLast(value);
  }
  return value ?? last;
}
