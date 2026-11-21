'use client';

import { Button } from '@/components/ui/Button';
import { signOut } from '@/features/auth/actions';

import { announceSignOut } from './session-sync';

type SignOutButtonProps = {
  className?: string;
};

// Sair numa aba desconecta as outras abas do painel na hora.
export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form action={signOut} onSubmit={announceSignOut}>
      <Button type="submit" variant="secondary" size="sm" className={className}>
        Sair
      </Button>
    </form>
  );
}
