import Link from 'next/link';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { HEADER_LIST_CLASSES, type HeaderPlacement } from '@/components/ui/header-placement';
import { MotionToggle } from '@/components/ui/MotionToggle';
import { REQUEST_PROJECT_PATH } from '@/lib/site';
import { cn } from '@/lib/utils/cn';

type SiteHeaderItem =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'motion' }
  | { kind: 'team'; href: string; label: string };

const SITE_HEADER_ITEMS: readonly SiteHeaderItem[] = [
  { kind: 'link', href: '/#todos', label: 'Projetos' },
  { kind: 'link', href: '/#sobre', label: 'Sobre a Main' },
  { kind: 'link', href: '/#contato', label: 'Contato' },
  { kind: 'link', href: REQUEST_PROJECT_PATH, label: 'Solicitar projeto' },
  { kind: 'motion' },
  { kind: 'team', href: '/dashboard', label: 'Área da equipe' },
];

const LINK_CLASSES: Record<HeaderPlacement, string> = {
  bar: 'inline-flex min-h-11 items-center rounded-full px-3.5 font-semibold whitespace-nowrap hover:text-brand-glow',
  menu: 'flex min-h-12 items-center rounded-field px-3 text-lead font-semibold hover:bg-surface-strong',
};

type SiteHeaderItemsProps = {
  placement: HeaderPlacement;
};

export function SiteHeaderItems({ placement }: SiteHeaderItemsProps) {
  const isMenu = placement === 'menu';

  function renderItem(item: SiteHeaderItem) {
    switch (item.kind) {
      case 'link':
        return (
          <Link href={item.href} className={LINK_CLASSES[placement]}>
            {item.label}
          </Link>
        );
      case 'motion':
        return <MotionToggle className={cn(isMenu && 'w-full')} />;
      case 'team':
        return (
          <ButtonLink
            href={item.href}
            variant="ghost"
            size={isMenu ? 'md' : 'sm'}
            className={cn('bg-mist-100 text-space-800 hover:bg-white', isMenu && 'w-full')}
          >
            {item.label}
          </ButtonLink>
        );
    }
  }

  return (
    <ul className={HEADER_LIST_CLASSES[placement]}>
      {SITE_HEADER_ITEMS.map((item) => (
        <li key={item.kind === 'motion' ? item.kind : item.href} className="empty:hidden">
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
