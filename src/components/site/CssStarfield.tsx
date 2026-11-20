import { cn } from '@/lib/utils/cn';

type CssStarfieldProps = {
  className?: string;
};

export function CssStarfield({ className }: CssStarfieldProps) {
  return <div aria-hidden="true" className={cn('fixed inset-0 bg-starfield', className)} />;
}
