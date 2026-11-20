import { Button } from '@/components/ui/Button';
import { HEADER_LIST_CLASSES, type HeaderPlacement } from '@/components/ui/header-placement';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { signOut } from '@/features/auth/actions';
import { cn } from '@/lib/utils/cn';

import { GuardedLink } from './GuardedLink';

type DashboardHeaderItem = 'email' | 'site' | 'theme' | 'signOut';

const DASHBOARD_HEADER_ITEMS: readonly DashboardHeaderItem[] = [
  'email',
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
        return (
          <form action={signOut}>
            <Button type="submit" variant="secondary" size="sm" className={width}>
              Sair
            </Button>
          </form>
        );
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
