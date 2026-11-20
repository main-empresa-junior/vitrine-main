import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

type OrbitSwitcherProps = {
  orbitIndex: number;
  orbitSizes: readonly number[];
  isTraveling: boolean;
  isAtLastStop: boolean;
  onTravel: (orbitIndex: number) => void;
};

export function projectCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
}

export function OrbitSwitcher({
  orbitIndex,
  orbitSizes,
  isTraveling,
  isAtLastStop,
  onTravel,
}: OrbitSwitcherProps) {
  const total = orbitSizes.length;
  if (total < 2) return null;
  const hasPrevious = orbitIndex > 0;
  const hasNext = orbitIndex < total - 1;

  return (
    <nav
      aria-label="Trocar de órbita"
      className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-space-950/70 p-1.5 whitespace-nowrap backdrop-blur-md"
    >
      {hasPrevious && (
        <Button
          variant="secondary"
          size="sm"
          className="px-0"
          disabled={isTraveling}
          onClick={() => onTravel(orbitIndex - 1)}
          aria-label={`Voltar para a órbita ${orbitIndex}`}
        >
          <Icon name="arrowLeft" />
        </Button>
      )}
      <span className="px-1.5 text-small font-semibold text-muted">
        Órbita {orbitIndex + 1} de {total}
      </span>
      {hasNext && (
        <Button
          size="sm"
          disabled={isTraveling}
          onClick={() => onTravel(orbitIndex + 1)}
          aria-label={`Viajar para a órbita ${orbitIndex + 2}, com ${projectCountLabel(orbitSizes[orbitIndex + 1])}`}
          className={cn(
            isAtLastStop &&
              'motion-safe:animate-beckon motion-reduce:outline-2 motion-reduce:outline-offset-3 motion-reduce:outline-focus',
          )}
        >
          <span className="hidden sm:inline">Viajar para a órbita {orbitIndex + 2}</span>
          <Icon name="arrowRight" />
        </Button>
      )}
    </nav>
  );
}
