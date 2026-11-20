import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import {
  CONTACT_EMAIL_BODY,
  CONTACT_EMAIL_LABEL,
  CONTACT_EMAIL_NOTICE,
  CONTACT_EMAIL_SUBJECT,
} from '@/features/assistant/faq';
import { CONTACT_EMAIL, contactMailto } from '@/lib/contact';

import { ChatActionLink, type FollowAction } from './ChatActionLink';

const EMAIL_ACTION = {
  label: CONTACT_EMAIL_LABEL,
  href: contactMailto(CONTACT_EMAIL_SUBJECT, CONTACT_EMAIL_BODY),
  notice: CONTACT_EMAIL_NOTICE,
} as const;

type ContactCardProps = {
  isDisabled: boolean;
  onFollow: FollowAction;
};

export function ContactCard({ isDisabled, onFollow }: ContactCardProps) {
  const showToast = useToast();

  async function copyEmail() {
    if (isDisabled) return;
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      showToast('E-mail copiado', 'success');
    } catch {
      showToast('Não foi possível copiar. O e-mail é ' + CONTACT_EMAIL, 'error');
    }
  }

  return (
    <>
      <p className="font-semibold break-all">{CONTACT_EMAIL}</p>
      <div className="flex flex-wrap gap-2">
        <ChatActionLink action={EMAIL_ACTION} isDisabled={isDisabled} onFollow={onFollow} />
        <Button
          size="sm"
          variant="ghost"
          aria-disabled={isDisabled || undefined}
          onClick={copyEmail}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
        >
          Copiar e-mail
        </Button>
      </div>
    </>
  );
}
