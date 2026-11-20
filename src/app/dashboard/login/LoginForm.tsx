'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { signIn } from '@/features/auth/actions';
import { type SignInInput, signInSchema } from '@/features/auth/schema';

type LoginFormProps = {
  next?: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signIn(values, next);
      if (result?.error) setServerError(result.error);
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <TextField
        id="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        id="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {serverError && (
        <p
          role="alert"
          className="rounded-field border-2 border-danger px-4 py-3 font-semibold text-danger"
        >
          {serverError}
        </p>
      )}
      <Button type="submit" isLoading={isPending} loadingLabel="Entrando…">
        Entrar
      </Button>
    </form>
  );
}
