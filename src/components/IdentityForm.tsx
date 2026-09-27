import { FormEvent, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './Button';
import { clsx } from '../utils/clsx';
import { validateAlias, validateQuote, QUOTE_MAX_LENGTH, ALIAS_MAX_LENGTH } from '../utils/validation';
import type { IdentityDistrict, IdentityRole } from '../types/identity';
import type { IdentityFormValues } from '../hooks/useIdentity';

const ROLES: IdentityRole[] = ['Driver', 'Fixer', 'Hacker', 'Street Artist', 'Freelancer', 'Unknown'];
const DISTRICTS: IdentityDistrict[] = [
  'Neon Beach',
  'Downtown',
  'Harbor',
  'Palm Heights',
  'Old Quarter',
];

interface IdentityFormProps {
  initialValues: IdentityFormValues;
  onSubmit: (values: IdentityFormValues) => void;
  submitLabel?: string;
}

export function IdentityForm({ initialValues, onSubmit, submitLabel = 'Generate identity file' }: IdentityFormProps) {
  const [alias, setAlias] = useState(initialValues.alias);
  const [role, setRole] = useState<IdentityRole>(initialValues.role);
  const [district, setDistrict] = useState<IdentityDistrict>(initialValues.district);
  const [wantedLevel, setWantedLevel] = useState(initialValues.wantedLevel);
  const [quote, setQuote] = useState(initialValues.quote);
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const aliasIssue = validateAlias(alias);
    const quoteIssue = validateQuote(quote);
    setAliasError(aliasIssue);
    setQuoteError(quoteIssue);
    if (aliasIssue || quoteIssue) return;
    onSubmit({ alias: alias.trim(), role, district, wantedLevel, quote: quote.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="alias" className="mb-1.5 block font-display text-sm tracking-wide text-paper">
          Alias
        </label>
        <input
          id="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          maxLength={ALIAS_MAX_LENGTH}
          placeholder="Night Runner"
          className="w-full rounded-lg border border-white/15 bg-surface2 px-4 py-2.5 text-paper placeholder:text-muted/60 focus:border-accent"
          aria-invalid={Boolean(aliasError)}
          aria-describedby={aliasError ? 'alias-error' : undefined}
        />
        {aliasError && (
          <p id="alias-error" role="alert" className="mt-1 text-sm text-primary">
            {aliasError}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className="mb-1.5 block font-display text-sm tracking-wide text-paper">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as IdentityRole)}
            className="w-full rounded-lg border border-white/15 bg-surface2 px-4 py-2.5 text-paper focus:border-accent"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="mb-1.5 block font-display text-sm tracking-wide text-paper">
            District
          </label>
          <select
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value as IdentityDistrict)}
            className="w-full rounded-lg border border-white/15 bg-surface2 px-4 py-2.5 text-paper focus:border-accent"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span id="wanted-label" className="mb-1.5 block font-display text-sm tracking-wide text-paper">
          Wanted level
        </span>
        <div role="radiogroup" aria-labelledby="wanted-label" className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={wantedLevel === level}
              onClick={() => setWantedLevel(level)}
              className="rounded p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label={`${level} star${level > 1 ? 's' : ''}`}
            >
              <Star
                className={clsx(
                  'h-7 w-7 transition-colors',
                  level <= wantedLevel ? 'fill-primary text-primary' : 'text-white/20',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="quote" className="mb-1.5 block font-display text-sm tracking-wide text-paper">
          Signature quote
        </label>
        <input
          id="quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          maxLength={QUOTE_MAX_LENGTH}
          placeholder="Everybody has a price."
          className="w-full rounded-lg border border-white/15 bg-surface2 px-4 py-2.5 text-paper placeholder:text-muted/60 focus:border-accent"
          aria-invalid={Boolean(quoteError)}
          aria-describedby="quote-count"
        />
        <p id="quote-count" className="mt-1 text-xs text-muted">
          {quote.length}/{QUOTE_MAX_LENGTH}
        </p>
        {quoteError && (
          <p role="alert" className="mt-1 text-sm text-primary">
            {quoteError}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
