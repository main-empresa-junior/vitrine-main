'use client';

import { type FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { collectFormIssues, type FormIssue } from '@/components/ui/form-issues';
import { FormIssueList } from '@/components/ui/FormIssueList';
import {
  submitProjectRequest,
  type SubmitRequestResult,
} from '@/features/project-requests/actions';
import {
  type ContactPreference,
  type ProjectRequest,
  type ProjectRequestInput,
  projectRequestSchema,
} from '@/features/project-requests/schema';

import { RequestConfirmation } from './RequestConfirmation';
import { RequestFields } from './RequestFields';
import { TurnstileWidget } from './TurnstileWidget';

// Plataforma e preferência começam sem escolha: a pessoa precisa marcar uma opção.
const DEFAULT_VALUES: Partial<ProjectRequestInput> = {
  clientName: '',
  description: '',
  email: '',
  phone: '',
  deadline: '',
  consent: false,
};

const SERVER_ERRORS: Record<Exclude<SubmitRequestResult['status'], 'sent'>, string> = {
  invalid: 'Alguma informação não pôde ser aceita. Confira os campos e envie de novo.',
  rate_limited:
    'Recebemos vários pedidos daqui em pouco tempo. Espere alguns minutos e envie de novo.',
  verification_failed: 'Não foi possível confirmar que você não é um robô. Tente de novo.',
  error: 'Não foi possível enviar agora. Seus dados continuam aqui; tente de novo em instantes.',
};

const TURNSTILE_FIELD = 'cf-turnstile-response';

export function RequestForm() {
  const [issues, setIssues] = useState<readonly FormIssue[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<ContactPreference | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef(0);
  const form = useForm<ProjectRequestInput, unknown, ProjectRequest>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: DEFAULT_VALUES,
    // O foco vai para o resumo de erros, não para o primeiro campo.
    shouldFocusError: false,
  });

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  function sendRequest(values: ProjectRequest) {
    setIssues([]);
    setServerError(null);
    const turnstileToken = formRef.current
      ? String(new FormData(formRef.current).get(TURNSTILE_FIELD) ?? '')
      : '';
    const signals = {
      website: honeypotRef.current?.value ?? '',
      startedAt: startedAtRef.current,
      turnstileToken,
    };
    startTransition(async () => {
      const result = await submitProjectRequest(values, signals);
      if (result.status === 'sent') setSentTo(result.contactPreference);
      else setServerError(SERVER_ERRORS[result.status]);
    });
  }

  // handleSubmit é montado na hora do envio, para os refs só serem lidos no evento.
  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    return form.handleSubmit(sendRequest, (errors) => {
      setServerError(null);
      setIssues(collectFormIssues(errors));
    })(event);
  }

  if (sentTo) return <RequestConfirmation contactPreference={sentTo} />;

  const summary: readonly FormIssue[] = serverError
    ? [{ fieldId: 'request-form', message: serverError }]
    : issues;

  return (
    <form
      ref={formRef}
      id="request-form"
      tabIndex={-1}
      onSubmit={handleFormSubmit}
      noValidate
      className="flex flex-col gap-6"
    >
      {summary.length > 0 && (
        <FormIssueList
          title={serverError ? 'Seu pedido ainda não foi enviado' : 'Confira antes de enviar'}
          issues={summary}
        />
      )}
      <RequestFields form={form} />
      {/* Armadilha para robôs: escondida de pessoas e de leitores de tela. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Não preencha este campo</label>
        <input ref={honeypotRef} id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <TurnstileWidget />
      <Button
        type="submit"
        size="lg"
        isLoading={isPending}
        loadingLabel="Enviando…"
        className="self-start"
      >
        Enviar pedido
      </Button>
    </form>
  );
}
