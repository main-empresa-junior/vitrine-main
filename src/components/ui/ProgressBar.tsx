import { cn } from '@/lib/utils/cn';

type ProgressBarProps = {
  variant: 'top' | 'inline';
  // Entre 0 e 1; sem valor, a barra fica em modo indeterminado.
  value?: number;
  className?: string;
};

const TRACK_CLASSES = {
  top: 'fixed inset-x-0 top-0 z-50 h-1 bg-transparent',
  inline: 'h-2 w-full rounded-full bg-surface-strong',
} as const;

export function ProgressBar({ variant, value, className }: ProgressBarProps) {
  const isDeterminate = value !== undefined;
  const percent = Math.round(Math.min(1, Math.max(0, value ?? 0)) * 100);

  return (
    <div
      role="progressbar"
      aria-label="Carregando"
      aria-valuemin={isDeterminate ? 0 : undefined}
      aria-valuemax={isDeterminate ? 100 : undefined}
      aria-valuenow={isDeterminate ? percent : undefined}
      className={cn('overflow-hidden', TRACK_CLASSES[variant], className)}
    >
      {isDeterminate ? (
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-300 ease-out-soft"
          style={{ width: `${percent}%` }}
        />
      ) : (
        // Sem movimento contínuo no modo reduzido: a faixa fica parada no meio.
        <div className="h-full w-2/5 translate-x-3/4 rounded-full bg-brand-gradient motion-safe:animate-progress-slide" />
      )}
    </div>
  );
}
