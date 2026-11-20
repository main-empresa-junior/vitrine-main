import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { MoveDirection } from '@/features/projects/ordering';

// Na vertical, "cima" e "baixo"; na horizontal (carrossel), "antes" e "depois" na mesma ordem.
const ORIENTATIONS = {
  vertical: {
    back: { icon: 'arrowUp', words: 'para cima' },
    forward: { icon: 'arrowDown', words: 'para baixo' },
  },
  horizontal: {
    back: { icon: 'arrowLeft', words: 'para antes' },
    forward: { icon: 'arrowRight', words: 'para depois' },
  },
} as const;

type ReorderButtonsProps = {
  orientation?: keyof typeof ORIENTATIONS;
  itemLabel: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled?: boolean;
  onMove: (direction: MoveDirection) => void;
  onRemove?: () => void;
};

export function ReorderButtons({
  itemLabel,
  canMoveUp,
  canMoveDown,
  disabled = false,
  onMove,
  onRemove,
  orientation = 'vertical',
}: ReorderButtonsProps) {
  const { back, forward } = ORIENTATIONS[orientation];
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="px-0"
        disabled={!canMoveUp || disabled}
        onClick={() => onMove('up')}
        aria-label={`Mover ${itemLabel} ${back.words}`}
      >
        <Icon name={back.icon} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="px-0"
        disabled={!canMoveDown || disabled}
        onClick={() => onMove('down')}
        aria-label={`Mover ${itemLabel} ${forward.words}`}
      >
        <Icon name={forward.icon} />
      </Button>
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-danger"
          disabled={disabled}
          onClick={onRemove}
          aria-label={`Remover ${itemLabel}`}
        >
          <Icon name="trash" />
        </Button>
      )}
    </div>
  );
}
