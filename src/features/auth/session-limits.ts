const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

// Tempos da sessão do painel (documentados no README).
export const SESSION_LIMITS = {
  // Sem clique, tecla, rolagem ou toque por este tempo, a sessão é encerrada.
  inactivityMs: 30 * MINUTE_MS,
  // Antes de encerrar por inatividade, o aviso aparece com esta antecedência.
  warningMs: 2 * MINUTE_MS,
  // Com ou sem atividade, a sessão acaba este tempo depois do login.
  maxSessionMs: 8 * HOUR_MS,
} as const;

export type SignOutReason = 'inactive' | 'expired' | 'elsewhere';

export const SIGN_OUT_REASONS: readonly SignOutReason[] = ['inactive', 'expired', 'elsewhere'];

export const SIGN_OUT_MESSAGES: Record<SignOutReason, string> = {
  inactive: 'Sua sessão expirou por inatividade. Entre novamente.',
  expired: 'Sua sessão chegou ao limite de 8 horas. Entre novamente.',
  elsewhere: 'Você saiu do painel em outra aba. Entre novamente.',
};

type AuthMethod = { method?: unknown; timestamp?: unknown };

// O claim amr do Supabase lista como a pessoa se autenticou, com o horário (em segundos) de cada
// método. O mais antigo, sem contar renovações de token, é o momento do login.
export function signedInAtMs(claims: { amr?: unknown }): number | null {
  if (!Array.isArray(claims.amr)) return null;
  const timestamps = claims.amr
    .filter(
      (entry: AuthMethod): entry is { method: string; timestamp: number } =>
        typeof entry?.method === 'string' &&
        entry.method !== 'token_refresh' &&
        typeof entry.timestamp === 'number',
    )
    .map((entry) => entry.timestamp * 1000);
  return timestamps.length > 0 ? Math.min(...timestamps) : null;
}

// Sem o horário do login não dá para garantir o limite: a sessão é tratada como vencida.
export function isSessionTooOld(claims: { amr?: unknown }, nowMs: number): boolean {
  const signedInAt = signedInAtMs(claims);
  return signedInAt === null || nowMs - signedInAt >= SESSION_LIMITS.maxSessionMs;
}

export type InactivityState =
  { kind: 'active' } | { kind: 'warning'; remainingMs: number } | { kind: 'expired' };

export function inactivityState(lastActivityMs: number, nowMs: number): InactivityState {
  const remainingMs = lastActivityMs + SESSION_LIMITS.inactivityMs - nowMs;
  if (remainingMs <= 0) return { kind: 'expired' };
  if (remainingMs <= SESSION_LIMITS.warningMs) return { kind: 'warning', remainingMs };
  return { kind: 'active' };
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
