import { Spinner } from './Spinner';

export function LoadingState() {
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center gap-3 text-muted">
      <Spinner />
      Carregando…
    </div>
  );
}
