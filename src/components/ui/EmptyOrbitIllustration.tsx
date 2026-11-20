import { useId } from 'react';

import { brandColors } from '@/lib/design-tokens';
import { cn } from '@/lib/utils/cn';

const ORBIT_RADII = [34, 52, 70] as const;
const GHOST = { x: 104, y: 70, radius: 11 } as const;

type EmptyOrbitIllustrationProps = {
  className?: string;
};

// Sol, órbitas vazias e o planeta que falta; as cores vêm dos tokens do tema da área.
export function EmptyOrbitIllustration({ className }: EmptyOrbitIllustrationProps) {
  const sunGradient = useId();

  return (
    <svg
      viewBox="0 0 180 140"
      aria-hidden="true"
      focusable="false"
      className={cn('h-auto w-full', className)}
    >
      <defs>
        <linearGradient id={sunGradient} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={brandColors.cyan} />
          <stop offset=".55" stopColor={brandColors.violet} />
          <stop offset="1" stopColor={brandColors.magenta} />
        </linearGradient>
      </defs>
      {ORBIT_RADII.map((radius) => (
        <ellipse
          key={radius}
          cx="90"
          cy="70"
          rx={radius}
          ry={radius * 0.42}
          fill="none"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          className="stroke-border"
        />
      ))}
      <circle cx="90" cy="70" r="12" fill={`url(#${sunGradient})`} />
      <g className="origin-center motion-safe:animate-pulse">
        <circle
          cx={GHOST.x + 20}
          cy={GHOST.y - 18}
          r={GHOST.radius}
          fill="none"
          strokeDasharray="3 3"
          strokeWidth="2"
          className="stroke-focus"
        />
        <text
          x={GHOST.x + 20}
          y={GHOST.y - 13}
          textAnchor="middle"
          className="fill-foreground font-display text-small"
        >
          ?
        </text>
      </g>
    </svg>
  );
}
