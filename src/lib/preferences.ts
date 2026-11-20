export type MotionPreference = 'full' | 'reduced';
export type ThemePreference = 'light' | 'dark';

export const MOTION_STORAGE_KEY = 'motion';
export const THEME_STORAGE_KEY = 'theme';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Roda no <head> antes da pintura, para a página já nascer com o tema e o movimento certos.
export const PREFERENCES_SCRIPT = `(function(){var d=document.documentElement;try{var m=localStorage.getItem('${MOTION_STORAGE_KEY}');d.dataset.motion=m==='full'||m==='reduced'?m:matchMedia('${REDUCED_MOTION_QUERY}').matches?'reduced':'full';var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){d.dataset.motion='full'}})()`;

export function readStoredPreference(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storePreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Sem armazenamento (modo privado), a escolha vale só até recarregar.
  }
}

export function systemPrefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
