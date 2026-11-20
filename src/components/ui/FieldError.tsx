type FieldErrorProps = {
  id: string;
  message?: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} className="text-small font-semibold text-danger">
      {message}
    </p>
  );
}
