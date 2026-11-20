// Prazo até quando a tela do Orbi deve continuar visível depois que o carregamento terminou.
let lingerUntil = 0;
const listeners = new Set<() => void>();

export const WAIT_BEFORE_ORBI_MS = 700;
export const MIN_ORBI_VISIBLE_MS = 400;

export function lingerOrbiUntil(timestamp: number): void {
  lingerUntil = timestamp;
  listeners.forEach((listener) => listener());
}

export function getLingerUntil(): number {
  return lingerUntil;
}

export function subscribeToLinger(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
