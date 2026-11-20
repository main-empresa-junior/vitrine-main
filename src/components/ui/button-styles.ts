import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-gradient text-white hover:brightness-110',
  secondary: 'border-border text-foreground hover:border-focus',
  ghost: 'text-foreground hover:bg-surface-strong',
  danger: 'bg-danger-700 text-white hover:brightness-110',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-11 min-w-11 px-4 text-small',
  md: 'min-h-12 min-w-12 px-6 text-body',
  lg: 'min-h-14 min-w-14 px-8 text-lead',
};

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleOptions = {}): string {
  // A borda transparente aparece na cor do sistema no modo de alto contraste (forced-colors).
  return cn(
    'inline-flex items-center border-2 border-transparent justify-center gap-2 rounded-full font-bold transition duration-200 ease-out-soft disabled:cursor-not-allowed disabled:opacity-60',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}
