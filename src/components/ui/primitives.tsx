import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../config/site';

/** Sets the document title + meta description for each route. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : `${site.name} — Since ${site.since}`;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}

export function Reveal({ children, delay = 0, className = '', y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'center',
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  align?: 'center' | 'left';
  action?: ReactNode;
}) {
  const center = align === 'center';
  return (
    <Reveal className={`mb-8 flex flex-col gap-4 sm:mb-12 ${center ? 'items-center text-center' : 'items-start sm:flex-row sm:items-end sm:justify-between'}`}>
      <div className={center ? 'max-w-2xl' : 'max-w-xl'}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-4xl leading-tight text-ivory sm:text-5xl">{title}</h2>
        {text && <p className="mt-4 leading-7 text-muted">{text}</p>}
        {center && <div className="mx-auto mt-6 h-px w-16 bg-gold/60" />}
      </div>
      {action}
    </Reveal>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.2}
          className={i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-gold/40'}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function DemoNotice({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-3 border border-gold/30 bg-gold/[0.06] px-4 py-3 text-sm leading-6 text-ivory/80 ${className}`} role="note">
      <span className="demo-badge mt-0.5 shrink-0">Demo</span>
      <span>{children}</span>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  crumbs?: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden border-b border-line/5 pb-16 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_60%)]" />
      <div className="container-lux relative text-center">
        {crumbs && <Breadcrumbs crumbs={crumbs} className="mb-6 justify-center" />}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="mx-auto max-w-3xl text-5xl leading-[1.05] text-ivory sm:text-6xl">{title}</h1>
        {text && <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted">{text}</p>}
        {children}
      </div>
    </section>
  );
}

export function Breadcrumbs({ crumbs, className = '' }: { crumbs: { label: string; to?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted ${className}`}>
      <Link to="/" className="hover:text-gold">
        Home
      </Link>
      {crumbs.map((c) => (
        <span key={c.label} className="flex items-center gap-2">
          <span className="text-gold/50">/</span>
          {c.to ? (
            <Link to={c.to} className="hover:text-gold">
              {c.label}
            </Link>
          ) : (
            <span className="text-ivory/80" aria-current="page">
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Meter({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.18em] text-muted">
        <span>{label}</span>
        <span className="text-ivory/70">
          {value}/{max}
        </span>
      </div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={`h-1 flex-1 ${i < value ? 'bg-gradient-to-r from-gold to-gold-light' : 'bg-line/10'}`} />
        ))}
      </div>
    </div>
  );
}
