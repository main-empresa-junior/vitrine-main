import type { ButtonVariant } from '@/components/ui/button-styles';
import { ButtonLink } from '@/components/ui/ButtonLink';

type FirstProjectLinkProps = {
  variant?: ButtonVariant;
};

export function FirstProjectLink({ variant = 'primary' }: FirstProjectLinkProps) {
  return (
    <ButtonLink href="/dashboard/new" variant={variant}>
      Cadastrar o primeiro projeto
    </ButtonLink>
  );
}
