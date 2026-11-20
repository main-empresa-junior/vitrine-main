import { ProgressBar } from '@/components/ui/ProgressBar';

import { OrbiFigure } from './OrbiFigure';

import './orbi.css';

export function WaitingOrbi() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center">
        <p className="relative z-10 -mb-2 rounded-field border-2 border-border bg-surface px-5 py-3 font-display text-lead text-foreground shadow-card">
          Espere um pouquinho…
        </p>
        <div aria-hidden="true" className="orbi hold-sign w-28">
          <OrbiFigure pose="sign" />
        </div>
      </div>
      <ProgressBar variant="inline" className="w-56" />
    </div>
  );
}
