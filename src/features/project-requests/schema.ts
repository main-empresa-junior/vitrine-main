import { z } from 'zod';

import { todayInBrazil } from './dates';
import { phoneDigits } from './phone';

export const REQUEST_LIMITS = {
  clientName: 100,
  descriptionMin: 30,
  descriptionMax: 3000,
} as const;

export const PLATFORMS = ['web', 'mobile', 'web_and_mobile'] as const;
export const CONTACT_PREFERENCES = ['email', 'phone'] as const;
export const REQUEST_STATUSES = ['new', 'contacted', 'closed'] as const;

export type Platform = (typeof PLATFORMS)[number];
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  web: 'Web',
  mobile: 'Mobile',
  web_and_mobile: 'Web e mobile',
};

export const CONTACT_PREFERENCE_LABELS: Record<ContactPreference, string> = {
  email: 'E-mail',
  phone: 'Telefone',
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'Novo',
  contacted: 'Em contato',
  closed: 'Encerrado',
};

const PHONE_LENGTHS = [10, 11];

export const projectRequestSchema = z
  .object({
    clientName: z
      .string()
      .trim()
      .min(1, 'Informe o nome do cliente ou da empresa.')
      .max(REQUEST_LIMITS.clientName, `Use até ${REQUEST_LIMITS.clientName} caracteres.`),
    description: z
      .string()
      .trim()
      .min(
        REQUEST_LIMITS.descriptionMin,
        `Conte um pouco mais: pelo menos ${REQUEST_LIMITS.descriptionMin} caracteres.`,
      )
      .max(REQUEST_LIMITS.descriptionMax, `Use até ${REQUEST_LIMITS.descriptionMax} caracteres.`),
    platform: z.enum(PLATFORMS, { error: 'Escolha onde o sistema deve funcionar.' }),
    email: z.email('Informe um e-mail válido, como nome@exemplo.com.').trim(),
    // O campo mostra a máscara; o que vale são só os dígitos.
    phone: z
      .string()
      .transform(phoneDigits)
      .refine(
        (digits) => digits === '' || PHONE_LENGTHS.includes(digits.length),
        'Informe o telefone com DDD, como (44) 99876-5432.',
      ),
    contactPreference: z.enum(CONTACT_PREFERENCES, {
      error: 'Escolha como prefere que a gente entre em contato.',
    }),
    deadline: z
      .string()
      .refine((date) => date === '' || /^\d{4}-\d{2}-\d{2}$/.test(date), 'Informe a data completa.')
      .refine(
        (date) => date === '' || date >= todayInBrazil(),
        'Escolha uma data a partir de hoje.',
      ),
    consent: z
      .boolean()
      .refine((accepted) => accepted, 'Para enviar, autorize o uso dos dados para este contato.'),
  })
  .superRefine((request, context) => {
    if (request.contactPreference === 'phone' && request.phone === '') {
      context.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Informe o telefone, já que você prefere contato por telefone.',
      });
    }
  });

// O que o formulário guarda (o telefone ainda com máscara) e o que sai validado.
export type ProjectRequestInput = z.input<typeof projectRequestSchema>;
export type ProjectRequest = z.output<typeof projectRequestSchema>;
