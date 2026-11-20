import { EmptyOrbitIllustration } from '@/components/ui/EmptyOrbitIllustration';

import { FirstProjectLink } from './FirstProjectLink';

export function EmptyProjectList() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
      <EmptyOrbitIllustration className="max-w-60" />
      <p className="font-display text-heading">Nenhum projeto cadastrado ainda</p>
      <FirstProjectLink />
    </div>
  );
}
