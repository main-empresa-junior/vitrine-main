import type { MailMessage } from './mailer';
import { formatBrazilPhone } from './phone';
import { CONTACT_PREFERENCE_LABELS, PLATFORM_LABELS, type ProjectRequest } from './schema';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function requestFields(request: ProjectRequest): [label: string, value: string][] {
  return [
    ['Cliente', request.clientName],
    ['Onde deve funcionar', PLATFORM_LABELS[request.platform]],
    ['E-mail', request.email],
    ['Telefone', request.phone ? formatBrazilPhone(request.phone) : 'Não informado'],
    ['Prefere contato por', CONTACT_PREFERENCE_LABELS[request.contactPreference]],
    ['Prazo desejado', request.deadline ? formatDate(request.deadline) : 'Sem prazo'],
  ];
}

// Todo texto do formulário passa por escapeHtml: nada do que a pessoa digita vira HTML ou link.
export function buildProjectRequestEmail(request: ProjectRequest, to: string): MailMessage {
  const fields = requestFields(request);
  const text = [
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Descrição:',
    request.description,
  ].join('\n');
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  const html = [
    '<h1 style="font-size:20px">Novo pedido de projeto</h1>',
    `<table>${rows}</table>`,
    '<h2 style="font-size:16px">Descrição</h2>',
    `<p style="white-space:pre-wrap">${escapeHtml(request.description)}</p>`,
    '<p style="color:#555">Responda este e-mail para falar direto com o cliente.</p>',
  ].join('');
  return {
    to,
    replyTo: request.email,
    subject: `Novo pedido de projeto: ${request.clientName.replace(/[\r\n]+/g, ' ')}`,
    text,
    html,
  };
}
