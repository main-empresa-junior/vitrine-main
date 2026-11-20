import { cn } from '@/lib/utils/cn';

import { Icon } from './Icon';

export type ToastTone = 'success' | 'error' | 'info';

type ToastProps = {
  message: string;
  tone: ToastTone;
  isLeaving: boolean;
  onDismiss: () => void;
};

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'border-success',
  error: 'border-danger',
  info: 'border-focus',
};

export function Toast({ message, tone, isLeaving, onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        'flex animate-appear items-center gap-2 rounded-field border-2 bg-background py-1 ps-4 pe-1 font-semibold text-foreground shadow-card transition-opacity duration-200',
        TONE_CLASSES[tone],
        isLeaving && 'opacity-0',
      )}
    >
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar aviso"
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-strong"
      >
        <Icon name="close" className="size-4" />
      </button>
    </div>
  );
}
