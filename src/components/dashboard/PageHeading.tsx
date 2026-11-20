import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';

type PageHeadingProps = {
  title: string;
};

export function PageHeading({ title }: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center gap-1 self-start font-semibold text-muted hover:text-foreground"
      >
        <Icon name="arrowLeft" />
        Voltar para os projetos
      </Link>
      <h1 className="font-display text-title">{title}</h1>
    </div>
  );
}
