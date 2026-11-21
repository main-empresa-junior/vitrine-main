import { describe, expect, it } from 'vitest';

import { todayInBrazil } from './dates';
import { buildProjectRequestEmail, escapeHtml } from './email';
import { formatBrazilPhone, phoneDigits } from './phone';
import { type ProjectRequestInput, projectRequestSchema } from './schema';
import { looksAutomated, MIN_FILL_MS } from './spam';

const VALID: ProjectRequestInput = {
  clientName: 'Padaria Pão Quente',
  description: 'Um sistema de encomendas para clientes pedirem pães pelo celular.',
  platform: 'web',
  email: 'contato@padaria.com.br',
  phone: '',
  contactPreference: 'email',
  deadline: '',
  consent: true,
};

function issuesFor(input: ProjectRequestInput): Record<string, string> {
  const result = projectRequestSchema.safeParse(input);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path.join('.'), issue.message]),
  );
}

describe('projectRequestSchema', () => {
  it('accepts a complete request and keeps only phone digits', () => {
    const result = projectRequestSchema.parse({ ...VALID, phone: '(44) 99876-5432' });
    expect(result.phone).toBe('44998765432');
  });

  it('requires the phone only when the person prefers a call', () => {
    expect(issuesFor({ ...VALID, contactPreference: 'phone' })).toEqual({
      phone: 'Informe o telefone, já que você prefere contato por telefone.',
    });
    expect(issuesFor({ ...VALID, contactPreference: 'phone', phone: '4430112233' })).toEqual({});
  });

  it('rejects incomplete phones, short descriptions and invalid e-mails', () => {
    const issues = issuesFor({ ...VALID, phone: '4499', description: 'Curto.', email: 'ana@' });
    expect(Object.keys(issues).sort()).toEqual(['description', 'email', 'phone']);
  });

  it('accepts today and later as the deadline, never a past date', () => {
    const today = todayInBrazil();
    expect(issuesFor({ ...VALID, deadline: today })).toEqual({});
    expect(issuesFor({ ...VALID, deadline: '2020-01-01' })).toEqual({
      deadline: 'Escolha uma data a partir de hoje.',
    });
  });

  it('requires consent and a platform', () => {
    const issues = issuesFor({ ...VALID, consent: false, platform: undefined as never });
    expect(Object.keys(issues).sort()).toEqual(['consent', 'platform']);
  });
});

describe('phone mask', () => {
  it('formats landlines and mobiles while typing', () => {
    expect(formatBrazilPhone('44')).toBe('(44');
    expect(formatBrazilPhone('443011')).toBe('(44) 3011');
    expect(formatBrazilPhone('4430112233')).toBe('(44) 3011-2233');
    expect(formatBrazilPhone('44998765432')).toBe('(44) 99876-5432');
    expect(phoneDigits('(44) 99876-5432 ramal 2')).toBe('44998765432');
  });
});

describe('todayInBrazil', () => {
  it('uses the Brazilian date even when it is already tomorrow in UTC', () => {
    expect(todayInBrazil(new Date('2026-11-21T01:30:00Z'))).toBe('2026-11-20');
  });
});

describe('looksAutomated', () => {
  const now = 1_000_000;

  it('flags a filled honeypot or a form sent too fast', () => {
    expect(looksAutomated({ website: 'http://spam', startedAt: now - 60_000 }, now)).toBe(true);
    expect(looksAutomated({ website: '', startedAt: now - MIN_FILL_MS + 1 }, now)).toBe(true);
    expect(looksAutomated({ website: '', startedAt: 0 }, now)).toBe(true);
  });

  it('lets a person who took their time through', () => {
    expect(looksAutomated({ website: '', startedAt: now - MIN_FILL_MS }, now)).toBe(false);
  });
});

describe('buildProjectRequestEmail', () => {
  it('escapes everything typed in the form', () => {
    expect(escapeHtml('<a href="x">&\'')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
    const request = projectRequestSchema.parse({
      ...VALID,
      clientName: '<b>Loja</b>\nBcc: alguem@x.com',
      description: 'Quero um site <script>alert(1)</script> com <a href="https://x">link</a>.',
    });
    const email = buildProjectRequestEmail(request, 'mainej@uem.br');
    expect(email.html).not.toContain('<script>');
    expect(email.html).not.toContain('<a href');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.subject).toBe('Novo pedido de projeto: <b>Loja</b> Bcc: alguem@x.com');
    expect(email.replyTo).toBe('contato@padaria.com.br');
    expect(email.to).toBe('mainej@uem.br');
  });
});
