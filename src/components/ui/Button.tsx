import type { ButtonHTMLAttributes, Ref } from 'react';

import { buttonClasses, type ButtonSize, type ButtonVariant } from './button-styles';
import { Spinner } from './Spinner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({
  variant,
  size,
  isLoading = false,
  loadingLabel,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <Spinner />}
      {isLoading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
