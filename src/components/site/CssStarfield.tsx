import { cn } from '@/lib/utils/cn';

type CssStarfieldProps = {
  className?: string;
};

export function CssStarfield({ className }: CssStarfieldProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-1 bg-starfield', className)}
    />
  );
}
