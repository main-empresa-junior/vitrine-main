import { Icon } from '@/components/ui/Icon';

import { GuardedLink } from './GuardedLink';

type PageHeadingProps = {
  title: string;
};

export function PageHeading({ title }: PageHeadingProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <GuardedLink href="/dashboard" variant="secondary" size="sm">
        <Icon name="arrowLeft" />
        Voltar ao painel
      </GuardedLink>
      <h1 className="font-display text-title">{title}</h1>
    </div>
  );
}
