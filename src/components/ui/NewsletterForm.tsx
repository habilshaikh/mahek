import { Check } from 'lucide-react';
import { useState } from 'react';
import { isEmail } from './FormField';

/** Client-side only: validates and shows a demo confirmation. Nothing is sent or stored remotely. */
export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 border border-gold/30 bg-gold/[0.06] p-4 text-sm" role="status">
        <Check size={18} className="mt-0.5 shrink-0 text-gold" />
        <span className="text-ivory/80">
          Thank you. <span className="text-muted">(Demo only — {email} has not been sent to or saved on any server.)</span>
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className={`flex ${compact ? 'flex-col gap-2 sm:flex-row sm:gap-0' : 'flex-col gap-3 sm:flex-row sm:gap-0'}`}>
        <label className="sr-only" htmlFor={compact ? 'nl-footer' : 'nl-main'}>
          Email address
        </label>
        <input
          id={compact ? 'nl-footer' : 'nl-main'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`input-lux ${error ? 'border-red-400/60' : ''}`}
          aria-invalid={!!error}
        />
        <button type="submit" className={`btn-gold shrink-0 ${compact ? 'px-5' : ''}`}>
          Subscribe
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
