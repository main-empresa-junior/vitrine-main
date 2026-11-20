const CONTACT_SUBJECT = 'Dúvida sobre os projetos da Main';

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';

export function contactMailto(subject = CONTACT_SUBJECT, body?: string): string {
  const query = `subject=${encodeURIComponent(subject)}`;
  const bodyQuery = body ? `&body=${encodeURIComponent(body)}` : '';
  return `mailto:${CONTACT_EMAIL}?${query}${bodyQuery}`;
}
