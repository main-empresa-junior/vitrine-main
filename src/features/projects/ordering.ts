export type MoveDirection = 'up' | 'down';

const anyGroup = () => true;

// Troca o item com o vizinho mais próximo do mesmo grupo (por exemplo, só entre publicados).
export function moveItem<T>(
  items: readonly T[],
  index: number,
  direction: MoveDirection,
  isSameGroup: (a: T, b: T) => boolean = anyGroup,
): T[] {
  const moved = [...items];
  if (index < 0 || index >= items.length) return moved;
  const step = direction === 'up' ? -1 : 1;
  let target = index + step;
  while (target >= 0 && target < items.length && !isSameGroup(items[index], items[target])) {
    target += step;
  }
  if (target < 0 || target >= items.length) return moved;
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}
