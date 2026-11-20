import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-gradient text-white',
  secondary: 'border border-border text-foreground hover:border-focus',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-body font-bold transition-colors duration-200 disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
