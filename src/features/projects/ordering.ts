export type MoveDirection = 'up' | 'down';

export function moveItem<T>(items: readonly T[], index: number, direction: MoveDirection): T[] {
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) {
    return [...items];
  }
  const moved = [...items];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}
