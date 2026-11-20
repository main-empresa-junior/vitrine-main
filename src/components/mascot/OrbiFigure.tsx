import { useId } from 'react';

import { brandColors } from '@/lib/design-tokens';

const SUIT = '#F2F4FF';
const LIMB = '#E6EBFA';
const LEG = '#DCE3F5';
const VISOR_LIGHT = '#1D2766';
const VISOR_DARK = '#070A22';
const PANEL = '#0A0F33';

// Astronauta com capacete em hexágono, como o logo da Main.
export function OrbiFigure() {
  const id = useId();
  const rim = `${id}-rim`;
  const visor = `${id}-visor`;
  const fire = `${id}-fire`;

  return (
    <svg
      viewBox="0 0 104 132"
      focusable="false"
      aria-hidden="true"
      className="block h-auto w-full overflow-visible"
    >
      <defs>
        <linearGradient id={rim} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={brandColors.cyan} />
          <stop offset=".55" stopColor={brandColors.violet} />
          <stop offset="1" stopColor={brandColors.magenta} />
        </linearGradient>
        <radialGradient id={visor} cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor={VISOR_LIGHT} />
          <stop offset="1" stopColor={VISOR_DARK} />
        </radialGradient>
        <linearGradient id={fire} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset=".5" stopColor="#FFB347" />
          <stop offset="1" stopColor="#FF6B5B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse
        className="orbi-shadow"
        cx="52"
        cy="128"
        rx="24"
        ry="3.5"
        fill={brandColors.glow}
        fillOpacity="0.2"
      />
      <g className="orbi-jets">
        <path d="M37 118 Q42 136 47 118 Z" fill={`url(#${fire})`} />
        <path d="M57 118 Q62 136 67 118 Z" fill={`url(#${fire})`} />
      </g>
      <g className="orbi-leg-left">
        <rect x="36" y="98" width="12" height="22" rx="6" fill={LEG} />
      </g>
      <g className="orbi-leg-right">
        <rect x="56" y="98" width="12" height="22" rx="6" fill={LEG} />
      </g>
      <g className="orbi-arm-left">
        <rect x="18" y="66" width="12" height="28" rx="6" fill={LIMB} />
      </g>
      <g className="orbi-arm-right">
        <rect x="74" y="66" width="12" height="28" rx="6" fill={LIMB} />
      </g>
      <rect x="28" y="64" width="48" height="42" rx="18" fill={SUIT} />
      <rect x="42" y="76" width="20" height="12" rx="4" fill={PANEL} />
      <circle cx="47" cy="82" r="2" fill={brandColors.glow} />
      <circle cx="57" cy="82" r="2" fill="#E35BC6" />
      <polygon
        points="52,4 84,22 84,56 52,74 20,56 20,22"
        fill={SUIT}
        stroke={`url(#${rim})`}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <polygon points="52,14 75,27 75,51 52,64 29,51 29,27" fill={`url(#${visor})`} />
      <g className="orbi-eyes">
        <ellipse cx="43" cy="40" rx="4" ry="5.5" fill={brandColors.glow} />
        <ellipse cx="61" cy="40" rx="4" ry="5.5" fill={brandColors.glow} />
      </g>
      <path
        d="M45 52 Q52 57 59 52"
        stroke={brandColors.glow}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="52"
        y1="4"
        x2="52"
        y2="-6"
        stroke="#C9D2EE"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="52" cy="-8" r="3.5" fill={brandColors.magenta} />
    </svg>
  );
}
