'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { after } from 'next/server';
import { createHash } from 'node:crypto';
import { z } from 'zod';

import { requireTeamMember } from '@/features/auth/session';
import { createPublicClient } from '@/lib/supabase/public';
import { createClient } from '@/lib/supabase/server';

import { buildProjectRequestEmail } from './email';
import { sendMail } from './mailer';
import {
  type ContactPreference,
  type ProjectRequest,
  type ProjectRequestInput,
  projectRequestSchema,
  REQUEST_STATUSES,
} from './schema';
import { looksAutomated, type SpamSignals } from './spam';
import { verifyTurnstile } from './turnstile';

const INVALID_INPUT = '22023';

export type SubmitRequestResult =
  | { status: 'sent'; contactPreference: ContactPreference }
  | { status: 'invalid' | 'rate_limited' | 'verification_failed' | 'error' };

type SubmitSignals = SpamSignals & { turnstileToken: string };

async function clientIp(): Promise<string | null> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || requestHeaders.get('x-real-ip');
}

// O IP só entra no banco como hash com sal, e só para o limite de envios.
function hashIp(ip: string | null): string {
  if (!ip) return '';
  const salt = process.env.PROJECT_REQUEST_IP_SALT ?? '';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

async function notifyTeam(request: ProjectRequest): Promise<void> {
  const to = process.env.PROJECT_REQUEST_EMAIL_TO;
  if (!to) {
    console.error('PROJECT_REQUEST_EMAIL_TO não definido: o pedido foi salvo, mas sem e-mail.');
    return;
  }
  try {
    await sendMail(buildProjectRequestEmail(request, to));
  } catch (error) {
    // O pedido já está no banco; a falha do e-mail só fica registrada.
    console.error('Falha ao enviar o e-mail de um pedido de projeto já salvo.', error);
  }
}

export async function submitProjectRequest(
  input: ProjectRequestInput,
  signals: SubmitSignals,
): Promise<SubmitRequestResult> {
  const parsed = projectRequestSchema.safeParse(input);
  if (!parsed.success) return { status: 'invalid' };
  const request = parsed.data;

  // Robôs recebem a mesma confirmação, sem saber que o pedido foi descartado.
  if (looksAutomated(signals, Date.now())) {
    return { status: 'sent', contactPreference: request.contactPreference };
  }

  const ip = await clientIp();
  if (!(await verifyTurnstile(signals.turnstileToken, ip))) {
    return { status: 'verification_failed' };
  }

  const { data, error } = await createPublicClient().rpc('submit_project_request', {
    p_client_name: request.clientName,
    p_description: request.description,
    p_platform: request.platform,
    p_email: request.email,
    p_phone: request.phone,
    p_contact_preference: request.contactPreference,
    p_deadline: request.deadline,
    p_consent: request.consent,
    p_ip_hash: hashIp(ip),
  });
  if (error) {
    if (error.code === INVALID_INPUT) return { status: 'invalid' };
    console.error('Não foi possível salvar um pedido de projeto.', error);
    return { status: 'error' };
  }
  if (data === 'rate_limited') return { status: 'rate_limited' };

  after(() => notifyTeam(request));
  revalidatePath('/dashboard/requests');
  return { status: 'sent', contactPreference: request.contactPreference };
}

const statusUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(REQUEST_STATUSES),
});

export async function updateRequestStatus(id: string, status: string): Promise<{ ok: boolean }> {
  await requireTeamMember();
  const parsed = statusUpdateSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false };
  const supabase = await createClient();
  const { error } = await supabase
    .from('project_requests')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);
  if (error) return { ok: false };
  revalidatePath('/dashboard/requests');
  return { ok: true };
}
