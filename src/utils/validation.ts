export const QUOTE_MAX_LENGTH = 90;
export const ALIAS_MAX_LENGTH = 28;

export function validateAlias(alias: string): string | null {
  const trimmed = alias.trim();
  if (trimmed.length === 0) return 'Every file needs an alias.';
  if (trimmed.length > ALIAS_MAX_LENGTH) {
    return `Keep it under ${ALIAS_MAX_LENGTH} characters.`;
  }
  return null;
}

export function validateQuote(quote: string): string | null {
  if (quote.length > QUOTE_MAX_LENGTH) {
    return `Keep it under ${QUOTE_MAX_LENGTH} characters.`;
  }
  return null;
}
