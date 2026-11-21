const BRAZIL_TIME_ZONE = 'America/Sao_Paulo';

// Data de hoje no horário de Brasília, no formato do campo de data (AAAA-MM-DD).
export function todayInBrazil(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: BRAZIL_TIME_ZONE }).format(now);
}
