import Script from 'next/script';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Preparado e desligado: só aparece quando NEXT_PUBLIC_TURNSTILE_SITE_KEY existir.
// O widget põe a resposta num campo cf-turnstile-response dentro do formulário.
export function TurnstileWidget() {
  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={SITE_KEY} data-language="pt-br" />
    </>
  );
}
