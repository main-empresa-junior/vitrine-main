// Abas do painel compartilham a última atividade (localStorage) e avisam umas às outras ao sair.
const ACTIVITY_KEY = 'dashboard-last-activity';
const CHANNEL_NAME = 'dashboard-session';
const SIGNED_OUT = 'signed-out';
// Menos escritas no localStorage: um registro por segundo basta para a contagem.
const WRITE_INTERVAL_MS = 1000;

let lastWrite = 0;

export function shareActivity(at: number): void {
  if (at - lastWrite < WRITE_INTERVAL_MS) return;
  lastWrite = at;
  try {
    localStorage.setItem(ACTIVITY_KEY, String(at));
  } catch {
    // Sem armazenamento, a contagem vale só para esta aba.
  }
}

export function readSharedActivity(): number {
  try {
    const stored = Number(localStorage.getItem(ACTIVITY_KEY));
    return Math.max(lastWrite, Number.isFinite(stored) ? stored : 0);
  } catch {
    return lastWrite;
  }
}

function openChannel(): BroadcastChannel | null {
  return typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);
}

export function announceSignOut(): void {
  const channel = openChannel();
  channel?.postMessage(SIGNED_OUT);
  channel?.close();
}

export function onSignOutElsewhere(listener: () => void): () => void {
  const channel = openChannel();
  if (!channel) return () => {};
  channel.onmessage = (event: MessageEvent) => {
    if (event.data === SIGNED_OUT) listener();
  };
  return () => channel.close();
}
