import type { ReactNode } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { signOut } from '@/features/auth/actions';
import { requireTeamMember } from '@/features/auth/session';

export default async function DashboardAppLayout({ children }: { children: ReactNode }) {
  const member = await requireTeamMember();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3">
          <Link href="/dashboard" className="rounded-field">
            <Logo variant="onLight" className="h-10 dark:hidden" />
            <Logo variant="onDark" className="hidden h-10 dark:block" />
          </Link>
          <div className="flex items-center gap-3">
            <p className="hidden text-small text-muted sm:block">{member.email}</p>
            <ThemeToggle />
            <form action={signOut}>
              <Button type="submit" variant="secondary" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8">{children}</div>
    </div>
  );
}
