'use client';

import { useHtmlAttribute } from '@/hooks/useHtmlAttribute';
import { storePreference, THEME_STORAGE_KEY } from '@/lib/preferences';

import { Button } from './Button';
import { Icon } from './Icon';

export function ThemeToggle() {
  const isDark = useHtmlAttribute('data-theme', null) === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  function toggle() {
    document.documentElement.dataset.theme = nextTheme;
    storePreference(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
      className="px-0"
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </Button>
  );
}
