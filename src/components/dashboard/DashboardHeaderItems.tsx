import { HEADER_LIST_CLASSES, type HeaderPlacement } from '@/components/ui/header-placement';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils/cn';

import { GuardedLink } from './GuardedLink';
import { SignOutButton } from './SignOutButton';

type DashboardHeaderItem = 'email' | 'requests' | 'site' | 'theme' | 'signOut';

const DASHBOARD_HEADER_ITEMS: readonly DashboardHeaderItem[] = [
  'email',
  'requests',
  'site',
  'theme',
  'signOut',
];

type DashboardHeaderItemsProps = {
  email: string;
  placement: HeaderPlacement;
};

export function DashboardHeaderItems({ email, placement }: DashboardHeaderItemsProps) {
  const isMenu = placement === 'menu';
  const width = cn(isMenu && 'w-full');

  function renderItem(item: DashboardHeaderItem) {
    switch (item) {
      case 'email':
        return <p className="text-small break-all text-muted">{email}</p>;
      case 'requests':
        return (
          <GuardedLink href="/dashboard/requests" variant="secondary" size="sm" className={width}>
            Pedidos de projeto
          </GuardedLink>
        );
      case 'site':
        return (
          <GuardedLink href="/#sobre" variant="secondary" size="sm" className={width}>
            Voltar ao site
          </GuardedLink>
        );
      case 'theme':
        return (
          <span className="flex items-center justify-between gap-2">
            {isMenu && <span className="font-semibold">Tema</span>}
            <ThemeToggle />
          </span>
        );
      case 'signOut':
        return <SignOutButton className={width} />;
    }
  }

  return (
    <ul className={cn(HEADER_LIST_CLASSES[placement], !isMenu && 'gap-3')}>
      {DASHBOARD_HEADER_ITEMS.map((item) => (
        <li key={item}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
