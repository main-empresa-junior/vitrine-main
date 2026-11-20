import { forwardRef, type InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, error, className = '', ...props },
  ref,
) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 rounded-field border border-border bg-surface px-4 text-body text-foreground ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-small text-danger-300 dark:text-danger-300">
          {error}
        </p>
      )}
    </div>
  );
});
