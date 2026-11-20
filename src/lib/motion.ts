import { cn } from './utils/cn';

// Durações e amortecimentos do site num só lugar; as curvas de CSS vêm dos tokens --ease-*.
export const MOTION = {
  // Tempo que a câmera leva para chegar perto do alvo (segundos, constante de amortecimento).
  cameraSmoothing: 0.45,
  // Recuo da câmera ao sair da seção da órbita, em múltiplos da visão geral.
  exitPullBack: 0.6,
  // Escurecimento máximo da cena ao sair da seção da órbita.
  exitDim: 0.35,
} as const;

// Tempos do chat com o Orbi, em milissegundos.
export const CHAT_TIMING = {
  typingMsPerChar: 8,
  typingMinMs: 400,
  typingMaxMs: 1000,
  pointingMs: 900,
  redirectMs: 800,
  reducedRedirectMs: 300,
} as const;

// Transições curtas de interface: esmaecimento com um deslocamento pequeno, que some no modo reduzido.
const FADE_BASE = 'transition duration-300 ease-out-soft motion-reduce:translate-y-0';
const FADE_HIDDEN_OFFSET = {
  up: 'translate-y-3',
  down: '-translate-y-3',
  none: '',
} as const;

export function fadeClasses(
  isShown: boolean,
  offset: keyof typeof FADE_HIDDEN_OFFSET = 'up',
): string {
  return cn(
    FADE_BASE,
    isShown
      ? 'translate-y-0 opacity-100'
      : cn('pointer-events-none opacity-0', FADE_HIDDEN_OFFSET[offset]),
  );
}

// Amortecimento exponencial independente da taxa de quadros: a mesma ideia do `damp` do maath.
export function damp(
  current: number,
  target: number,
  smoothing: number,
  deltaSeconds: number,
): number {
  if (smoothing <= 0) return target;
  return target + (current - target) * Math.exp(-deltaSeconds / smoothing);
}
