import Link from 'next/link';

import type { ButtonVariant } from '@/components/ui/button-styles';
import { buttonClasses } from '@/components/ui/button-styles';

type FirstProjectLinkProps = {
  variant?: ButtonVariant;
};

export function FirstProjectLink({ variant = 'primary' }: FirstProjectLinkProps) {
  return (
    <Link href="/dashboard/new" className={buttonClasses({ variant })}>
      Cadastrar o primeiro projeto
    </Link>
  );
}
