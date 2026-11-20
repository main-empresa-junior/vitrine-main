const CONTACT_SUBJECT = 'Dúvida sobre os projetos da Main';

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';

export function contactMailto(subject = CONTACT_SUBJECT): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
