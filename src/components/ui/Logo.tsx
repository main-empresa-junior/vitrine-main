import Image from 'next/image';

import { cn } from '@/lib/utils/cn';

const LOGOS = {
  onLight: { src: '/brand/logo-on-light.png', width: 1600, height: 761 },
  onDark: { src: '/brand/logo-on-dark.png', width: 1600, height: 761 },
  coursesOnLight: { src: '/brand/logo-courses-on-light.png', width: 1024, height: 1024 },
  coursesOnDark: { src: '/brand/logo-courses-on-dark.png', width: 1024, height: 1024 },
} as const;

export type LogoVariant = keyof typeof LOGOS;

type LogoProps = {
  variant: LogoVariant;
  className?: string;
  priority?: boolean;
};

export function Logo({ variant, className, priority }: LogoProps) {
  const { src, width, height } = LOGOS[variant];
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt="Main, empresa júnior"
      priority={priority}
      className={cn('h-11 w-auto', className)}
    />
  );
}
