import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type BadgeTone = 'neutral' | 'success' | 'brand';

type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'border-border text-muted',
  success: 'border-success text-success',
  brand: 'border-focus text-foreground',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-small font-semibold',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
