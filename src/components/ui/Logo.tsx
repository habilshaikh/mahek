import { useState } from 'react';
import { site } from '../../config/site';

/**
 * Renders the official logo from /brand/mahek-logo.png.
 * Until that file is supplied, a plain typographic wordmark is shown instead
 * (no substitute emblem is invented).
 */
export default function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const [failed, setFailed] = useState(false);
  const h = { sm: 'h-8', md: 'h-11', lg: 'h-20', xl: 'h-36 sm:h-44' }[size];

  if (!failed) {
    return (
      <img
        src={site.logoSrc}
        alt="Mahek Perfume — Since 1982"
        className={`${h} w-auto object-contain ${className}`}
        onError={() => setFailed(true)}
        decoding="async"
      />
    );
  }

  const text = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', xl: 'text-6xl sm:text-7xl' }[size];
  const sub = { sm: 'text-[0.45rem]', md: 'text-[0.5rem]', lg: 'text-[0.7rem]', xl: 'text-xs' }[size];
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} aria-label="Mahek Perfume — Since 1982" role="img">
      <span className={`gold-text font-serif font-medium tracking-[0.28em] ${text}`}>MAHEK</span>
      <span className={`mt-1 font-sans uppercase tracking-[0.42em] text-gold/80 ${sub}`}>Perfume · Since 1982</span>
    </span>
  );
}
