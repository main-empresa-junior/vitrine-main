import type { ReactNode } from 'react';

import { OrbiFigure, type OrbiPose } from '@/components/mascot/OrbiFigure';
import { cn } from '@/lib/utils/cn';

type ChatBubbleProps = {
  author: 'orbi' | 'visitor';
  orbiPose?: OrbiPose;
  children: ReactNode;
};

export function ChatBubble({ author, orbiPose = 'default', children }: ChatBubbleProps) {
  const isOrbi = author === 'orbi';
  return (
    <li className={cn('flex items-end gap-2', isOrbi ? 'justify-start' : 'justify-end')}>
      {isOrbi && (
        <span className="size-9 shrink-0 overflow-hidden rounded-full border border-border bg-space-950 p-0.5">
          <OrbiFigure pose={orbiPose} framing="head" />
        </span>
      )}
      <div
        className={cn(
          'flex min-w-0 flex-col gap-2 rounded-field px-4 py-3 text-small',
          isOrbi ? 'me-6 bg-surface-strong text-foreground' : 'ms-12 bg-brand-gradient text-white',
        )}
      >
        <span className="sr-only">{isOrbi ? 'Orbi: ' : 'Você: '}</span>
        {children}
      </div>
    </li>
  );
}
