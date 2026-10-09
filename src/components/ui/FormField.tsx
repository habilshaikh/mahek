import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface Base {
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
}

function Wrap({ id, label, error, hint, className = '', required, children }: Base & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted/80">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormField({ label, error, hint, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} className={className} required={rest.required}>
      <input
        id={id}
        {...rest}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`input-lux ${error ? 'border-red-400/60' : ''}`}
      />
    </Wrap>
  );
}

export function TextArea({ label, error, hint, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} className={className} required={rest.required}>
      <textarea
        id={id}
        rows={5}
        {...rest}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`input-lux resize-y ${error ? 'border-red-400/60' : ''}`}
      />
    </Wrap>
  );
}

export function SelectField({ label, error, hint, className, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} hint={hint} className={className} required={rest.required}>
      <select id={id} {...rest} aria-invalid={!!error} className={`input-lux bg-charcoal ${error ? 'border-red-400/60' : ''}`}>
        {children}
      </select>
    </Wrap>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
