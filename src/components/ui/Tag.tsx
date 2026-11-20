import type { ReactNode } from 'react';

import { Icon } from './Icon';

type TagProps = {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
};

export function Tag({ children, onRemove, removeLabel }: TagProps) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-surface-strong py-1 ps-3 pe-3 text-small font-semibold text-foreground has-[button]:pe-0">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-my-2 inline-flex size-11 items-center justify-center rounded-full hover:text-danger"
        >
          <Icon name="close" className="size-4" />
        </button>
      )}
    </span>
  );
}
