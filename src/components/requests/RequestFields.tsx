'use client';

import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';
import Link from 'next/link';

import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup, type RadioOption } from '@/components/ui/RadioGroup';
import { TextArea } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { todayInBrazil } from '@/features/project-requests/dates';
import { formatBrazilPhone } from '@/features/project-requests/phone';
import {
  CONTACT_PREFERENCE_LABELS,
  CONTACT_PREFERENCES,
  type ContactPreference,
  type Platform,
  PLATFORM_LABELS,
  type ProjectRequest,
  type ProjectRequestInput,
  REQUEST_LIMITS,
} from '@/features/project-requests/schema';
import { useHasMounted } from '@/hooks/useHasMounted';

import { PRIVACY_SECTION_ID } from './privacy';

const PLATFORM_OPTIONS: readonly RadioOption<Platform>[] = [
  {
    value: 'web',
    label: PLATFORM_LABELS.web,
    description: 'Abre no navegador, no computador e no celular.',
  },
  {
    value: 'mobile',
    label: PLATFORM_LABELS.mobile,
    description: 'Aplicativo instalado no celular, Android ou iPhone.',
  },
  {
    value: 'web_and_mobile',
    label: PLATFORM_LABELS.web_and_mobile,
    description: 'Um sistema no navegador e um aplicativo para celular.',
  },
];

const CONTACT_OPTIONS: readonly RadioOption<ContactPreference>[] = CONTACT_PREFERENCES.map(
  (value) => ({ value, label: CONTACT_PREFERENCE_LABELS[value] }),
);

type RequestFieldsProps = {
  form: UseFormReturn<ProjectRequestInput, unknown, ProjectRequest>;
};

export function RequestFields({ form }: RequestFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const description = useWatch({ control, name: 'description' }) ?? '';
  const contactPreference = useWatch({ control, name: 'contactPreference' });
  // A página é pré-renderizada: a data mínima só é calculada no navegador, no dia de hoje.
  const hasMounted = useHasMounted();

  return (
    <>
      <TextField
        id="clientName"
        label="Nome do cliente ou da empresa"
        requirement="always"
        autoComplete="organization"
        maxLength={REQUEST_LIMITS.clientName}
        error={errors.clientName?.message}
        {...register('clientName')}
      />
      <TextArea
        id="description"
        label="Descreva o sistema que você precisa"
        requirement="always"
        rows={7}
        maxLength={REQUEST_LIMITS.descriptionMax}
        count={{ value: description.length, max: REQUEST_LIMITS.descriptionMax }}
        hint="Conte qual problema ele resolve, quem vai usar e as principais funcionalidades."
        error={errors.description?.message}
        {...register('description')}
      />
      <RadioGroup
        id="platform"
        legend="Onde o sistema deve funcionar"
        requirement="always"
        options={PLATFORM_OPTIONS}
        error={errors.platform?.message}
        inputProps={register('platform')}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="email"
          label="E-mail para contato"
          requirement="always"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField
              id="phone"
              label="Telefone para contato"
              requirement={contactPreference === 'phone' ? 'always' : undefined}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(44) 99876-5432"
              error={errors.phone?.message}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(formatBrazilPhone(event.target.value))}
            />
          )}
        />
      </div>
      <RadioGroup
        id="contactPreference"
        legend="Como você prefere que a gente entre em contato?"
        requirement="always"
        options={CONTACT_OPTIONS}
        error={errors.contactPreference?.message}
        inputProps={register('contactPreference')}
      />
      <TextField
        id="deadline"
        label="Tem um prazo para receber o projeto?"
        type="date"
        min={hasMounted ? todayInBrazil() : undefined}
        hint="É só uma referência para a nossa conversa, não um compromisso."
        error={errors.deadline?.message}
        {...register('deadline')}
      />
      <Checkbox
        id="consent"
        error={errors.consent?.message}
        label={
          <>
            Autorizo a Main a usar estes dados para entrar em contato sobre este pedido.{' '}
            <Link
              href={`#${PRIVACY_SECTION_ID}`}
              className="font-normal underline underline-offset-4"
            >
              Como usamos seus dados
            </Link>
          </>
        }
        {...register('consent')}
      />
    </>
  );
}
