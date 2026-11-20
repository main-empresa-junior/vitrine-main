const DOTS = [0, 1, 2] as const;

export function TypingDots() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {DOTS.map((dot) => (
        <span key={dot} className="orbi-chat-dot size-1.5 rounded-full bg-foreground" />
      ))}
    </span>
  );
}
