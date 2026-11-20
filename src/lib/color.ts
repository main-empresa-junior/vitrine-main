export type Rgb = readonly [number, number, number];

export const WHITE: Rgb = [255, 255, 255];
export const BLACK: Rgb = [0, 0, 0];

export function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(clamp(channel, 0, 255))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`.toUpperCase();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function mixRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

export function rampRgb(stops: readonly Rgb[], position: number): Rgb {
  const t = clamp(position, 0, 1);
  const segment = t * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(segment));
  return mixRgb(stops[index], stops[index + 1], segment - index);
}

// Luminância relativa WCAG, para escolher texto claro ou escuro sobre a cor do projeto.
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

export const DARK_TEXT = '#0A0F33';
export const LIGHT_TEXT = '#FFFFFF';

export function readableTextColor(background: string): string {
  return contrastRatio(background, DARK_TEXT) >= contrastRatio(background, LIGHT_TEXT)
    ? DARK_TEXT
    : LIGHT_TEXT;
}

const PAGE_BASE = '#05071C';
const PAGE_TEXT = '#EEF1FF';
const PAGE_MAX_TINT = 0.45;
const PAGE_MIN_CONTRAST = 7;
const PAGE_TINT_STEP = 0.05;

// Mistura a cor escura do projeto com o fundo do espaço, reduzindo a mistura até o texto ficar legível.
export function projectPageBackground(projectBackground: string): string {
  for (let tint = PAGE_MAX_TINT; tint > 0; tint -= PAGE_TINT_STEP) {
    const candidate = rgbToHex(mixRgb(hexToRgb(PAGE_BASE), hexToRgb(projectBackground), tint));
    if (contrastRatio(candidate, PAGE_TEXT) >= PAGE_MIN_CONTRAST) return candidate;
  }
  return PAGE_BASE;
}

export type Hsl = readonly [hue: number, saturation: number, lightness: number];

export function hslToHex([hue, saturation, lightness]: Hsl): string {
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;
  const h = ((hue % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;
  const sector = Math.floor(h / 60);
  const [r, g, b] = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x],
  ][sector];
  return rgbToHex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

export function hexToHsl(hex: string): Hsl {
  const [r, g, b] = hexToRgb(hex).map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return [0, 0, lightness * 100];
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue =
    max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return [(hue * 60 + 360) % 360, saturation * 100, lightness * 100];
}
