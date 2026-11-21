'use client';

import { useEffect, useRef } from 'react';

import { OrbiSpeaking } from '@/components/mascot/OrbiSpeaking';
import { ButtonLink } from '@/components/ui/ButtonLink';
import type { ContactPreference } from '@/features/project-requests/schema';

const CONTACT_CHANNEL: Record<ContactPreference, string> = {
  email: 'seu e-mail',
  phone: 'seu telefone',
};

type RequestConfirmationProps = {
  contactPreference: ContactPreference;
};

export function RequestConfirmation({ contactPreference }: RequestConfirmationProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Ao trocar o formulário pela confirmação, o foco vem junto e o leitor de tela lê a mensagem.
  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      aria-labelledby="request-sent-title"
      className="flex flex-col items-center gap-8 py-10 text-center focus:outline-none"
    >
      <h2 id="request-sent-title" className="sr-only">
        Pedido enviado
      </h2>
      <OrbiSpeaking>
        <p>
          Recebemos seu pedido! Vamos entrar em contato em breve pelo{' '}
          {CONTACT_CHANNEL[contactPreference]}.
        </p>
      </OrbiSpeaking>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Voltar ao início</ButtonLink>
        <ButtonLink href="/#todos" variant="secondary">
          Ver nossos projetos
        </ButtonLink>
      </div>
    </div>
  );
}
