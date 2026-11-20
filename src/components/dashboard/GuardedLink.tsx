'use client';

import type { ComponentProps } from 'react';

import { ButtonLink } from '@/components/ui/ButtonLink';

import { useUnsavedChanges } from './UnsavedChangesProvider';

type GuardedLinkProps = Omit<ComponentProps<typeof ButtonLink>, 'href'> & {
  href: string;
};

// Link do painel que pede confirmação antes de sair de um formulário com mudanças não salvas.
export function GuardedLink({ href, onClick, ...props }: GuardedLinkProps) {
  const { confirmNavigation } = useUnsavedChanges();

  return (
    <ButtonLink
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!confirmNavigation(href)) event.preventDefault();
      }}
      {...props}
    />
  );
}
