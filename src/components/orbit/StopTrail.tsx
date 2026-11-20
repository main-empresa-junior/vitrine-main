import type { KeyboardEvent } from 'react';

import { cn } from '@/lib/utils/cn';

const STEP_KEYS: Record<string, number> = {
  ArrowUp: -1,
  ArrowLeft: -1,
  ArrowDown: 1,
  ArrowRight: 1,
};

type StopTrailProps = {
  labels: readonly string[];
  activeStop: number | null;
  onSelect: (stop: number) => void;
};

export function StopTrail({ labels, activeStop, onSelect }: StopTrailProps) {
  // Setas, Home e End levam ao planeta vizinho, ao primeiro ou ao último, com o foco junto.
  function handleKeyDown(event: KeyboardEvent<HTMLOListElement>) {
    const buttons = [...event.currentTarget.querySelectorAll('button')];
    const current = buttons.findIndex((button) => button === document.activeElement);
    if (current < 0) return;
    const last = buttons.length - 1;
    const target =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? last
          : event.key in STEP_KEYS
            ? Math.min(last, Math.max(0, current + STEP_KEYS[event.key]))
            : null;
    if (target === null) return;
    event.preventDefault();
    buttons[target].focus();
    onSelect(target);
  }

  return (
    <ol
      onKeyDown={handleKeyDown}
      aria-label="Paradas desta órbita"
      className="absolute top-1/2 right-4 hidden max-h-4/5 -translate-y-1/2 flex-col gap-1 overflow-y-auto md:flex lg:right-10"
    >
      {labels.map((label, stop) => {
        const isCurrent = stop === activeStop;
        const isOverview = stop === 0;
        return (
          <li key={`${stop}-${label}`} className={cn(stop === 1 && 'mt-3')}>
            <button
              type="button"
              onClick={() => onSelect(stop)}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'group flex min-h-11 w-full items-center justify-end gap-3 px-1 text-small font-semibold',
                isCurrent ? 'text-foreground' : 'text-mist-500 hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'transition duration-200',
                  isCurrent
                    ? 'opacity-100'
                    : 'translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
                )}
              >
                {label}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'size-2.5 border-2 border-current transition duration-200',
                  isOverview ? 'rotate-45 rounded-xs' : 'rounded-full',
                  isCurrent && 'scale-125 bg-current',
                )}
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
