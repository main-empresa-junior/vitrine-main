export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

// Máscara brasileira: (44) 3011-2233 para fixo e (44) 99876-5432 para celular.
export function formatBrazilPhone(value: string): string {
  const digits = phoneDigits(value);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  const splitAt = digits.length === 11 ? 5 : 4;
  if (rest.length <= splitAt) return `(${area}) ${rest}`;
  return `(${area}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}
