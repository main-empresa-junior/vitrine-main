import type { ReactNode } from 'react';
import Link from 'next/link';

import { DashboardHeaderItems } from '@/components/dashboard/DashboardHeaderItems';
import { SessionGuard } from '@/components/dashboard/SessionGuard';
import { UnsavedChangesProvider } from '@/components/dashboard/UnsavedChangesProvider';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { requireTeamMember } from '@/features/auth/session';

export default async function DashboardAppLayout({ children }: { children: ReactNode }) {
  const member = await requireTeamMember();

  return (
    <UnsavedChangesProvider>
      <div className="min-h-dvh">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3">
            <Link href="/dashboard" className="rounded-field">
              <Logo variant="onLight" className="h-10 dark:hidden" />
              <Logo variant="onDark" className="hidden h-10 dark:block" />
            </Link>
            <nav aria-label="Painel">
              <DashboardHeaderItems email={member.email} placement="bar" />
              <MobileMenu>
                <DashboardHeaderItems email={member.email} placement="menu" />
              </MobileMenu>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-5 py-8">{children}</div>
        <SessionGuard />
      </div>
    </UnsavedChangesProvider>
  );
}
