import { CONTACT_EMAIL, contactMailto } from '@/lib/contact';

export function SiteFooter() {
  return (
    <footer
      id="contato"
      aria-labelledby="contact-title"
      className="border-t border-border bg-surface px-5 py-16 backdrop-blur-md sm:px-12 lg:px-24"
    >
      <h2 id="contact-title" className="font-display text-heading">
        Contato
      </h2>
      <p className="mt-3 max-w-prose text-muted">[Texto de contato da Main.]</p>
      {CONTACT_EMAIL && (
        <a
          href={contactMailto()}
          className="mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-brand-glow"
        >
          {CONTACT_EMAIL}
        </a>
      )}
      <p className="mt-10 text-small text-muted">
        Main, empresa júnior de Ciência da Computação e Engenharia de Software da UEM.
      </p>
    </footer>
  );
}
