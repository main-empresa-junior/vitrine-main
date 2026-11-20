// Os mesmos itens do cabeçalho aparecem em linha (barra) ou empilhados (menu de celular).
export type HeaderPlacement = 'bar' | 'menu';

export const HEADER_LIST_CLASSES: Record<HeaderPlacement, string> = {
  bar: 'hidden items-center gap-1.5 nav:flex',
  menu: 'flex flex-col items-stretch gap-2',
};
