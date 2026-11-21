import 'server-only';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Desligado enquanto TURNSTILE_SECRET_KEY não existir; veja "Proteção contra spam" no README.
export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const response = await fetch(VERIFY_URL, { method: 'POST', body });
    const result: unknown = await response.json();
    return (
      typeof result === 'object' &&
      result !== null &&
      'success' in result &&
      result.success === true
    );
  } catch (error) {
    console.error('Turnstile indisponível ao verificar um pedido de projeto.', error);
    return false;
  }
}
