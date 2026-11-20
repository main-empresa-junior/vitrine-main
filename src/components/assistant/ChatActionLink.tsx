import type { MouseEvent } from 'react';

import { ButtonLink } from '@/components/ui/ButtonLink';
import type { FaqAction } from '@/features/assistant/faq';

export type FollowAction = (event: MouseEvent<HTMLAnchorElement>, action: FaqAction) => void;

type ChatActionLinkProps = {
  action: FaqAction;
  isDisabled: boolean;
  onFollow: FollowAction;
};

export function ChatActionLink({ action, isDisabled, onFollow }: ChatActionLinkProps) {
  return (
    <ButtonLink
      href={action.href}
      size="sm"
      variant="secondary"
      aria-disabled={isDisabled || undefined}
      onClick={(event) => onFollow(event, action)}
      className="self-start aria-disabled:opacity-60"
    >
      {action.label}
    </ButtonLink>
  );
}
