// Ninguém preenche e revisa o formulário em menos de 3 segundos; robôs, sim.
export const MIN_FILL_MS = 3000;

export type SpamSignals = {
  // Campo escondido de pessoas: quem o preenche é robô.
  website: string;
  // Quando o formulário apareceu na tela, em milissegundos desde 1970.
  startedAt: number;
};

export function looksAutomated({ website, startedAt }: SpamSignals, now: number): boolean {
  if (website.trim() !== '') return true;
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  return now - startedAt < MIN_FILL_MS;
}
