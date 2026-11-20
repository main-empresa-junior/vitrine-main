import { cn } from '@/lib/utils/cn';

import { OrbiFigure } from './OrbiFigure';

import './orbi.css';

type OrbiScoutProps = {
  className?: string;
};

// O Orbi com a luneta, procurando o primeiro planeta da vitrine.
export function OrbiScout({ className }: OrbiScoutProps) {
  return (
    <div aria-hidden="true" className={cn('orbi scout', className)}>
      <OrbiFigure pose="spyglass" />
    </div>
  );
}
