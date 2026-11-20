import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { MoveDirection } from '@/features/projects/ordering';

type ReorderButtonsProps = {
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
}: ReorderButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="px-0"
        disabled={!canMoveUp || disabled}
        onClick={() => onMove('up')}
        aria-label={`Mover ${itemLabel} para cima`}
      >
        <Icon name="arrowUp" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="px-0"
        disabled={!canMoveDown || disabled}
        onClick={() => onMove('down')}
        aria-label={`Mover ${itemLabel} para baixo`}
      >
        <Icon name="arrowDown" />
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
