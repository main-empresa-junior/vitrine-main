import type { Ref } from 'react';

type JourneyIntroProps = {
  ref?: Ref<HTMLDivElement>;
};

export function JourneyIntro({ ref }: JourneyIntroProps) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-28 left-5 max-w-xl pe-5 sm:left-12 lg:left-24"
    >
      <h1 className="font-display text-display">Projetos em órbita</h1>
      <p className="mt-5 max-w-prose text-lead text-muted">
        Cada planeta é um projeto que a Main colocou no ar. Role para viajar até cada um deles.
      </p>
      <p className="mt-7 inline-flex items-center gap-3 text-small text-muted">
        <svg
          aria-hidden="true"
          width="22"
          height="34"
          viewBox="0 0 22 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="1" y="1" width="20" height="32" rx="10" />
          <line x1="11" y1="8" x2="11" y2="14" strokeLinecap="round" />
        </svg>
        Role para começar a viagem
      </p>
    </div>
  );
}
