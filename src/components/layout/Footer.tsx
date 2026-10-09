import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import NewsletterForm from '../ui/NewsletterForm';
import Logo from '../ui/Logo';
import { collectionLinks, legalLinks, serviceLinks } from './nav';

const socialIcons = { Instagram, Facebook, YouTube: Youtube } as const;

export default function Footer() {
  return (
    <footer className="theme-dark relative mt-24 border-t border-gold/15 bg-[linear-gradient(180deg,#211a13,#1a1510)]">
      <div className="hairline" />
      <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-6 max-w-xs font-serif text-xl italic text-ivory/80">{site.tagline}.</p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> {site.contact.address}
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" /> {site.contact.phone}
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" /> {site.contact.email}
            </li>
          </ul>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted/60">Placeholder contact details</p>
        </div>

        <nav aria-label="Shop">
          <p className="eyebrow mb-5">Shop</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li>
              <Link to="/shop" className="hover:text-gold">
                All Perfumes
              </Link>
            </li>
            {collectionLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/scent-wheel" className="hover:text-gold">
                Scent Wheel
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Customer service">
          <p className="eyebrow mb-5">Customer Care</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            {serviceLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/journal" className="hover:text-gold">
                Fragrance Journal
              </Link>
            </li>
            <li>
              <Link to="/our-story" className="hover:text-gold">
                Our Story
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-5">The Mahek Letter</p>
          <p className="mb-5 text-sm leading-6 text-muted">New releases, fragrance guides and private previews — straight to your inbox.</p>
          <NewsletterForm compact />
          <div className="mt-8 flex gap-3">
            {site.social.map((s) => {
              const Icon = socialIcons[s.label as keyof typeof socialIcons];
              return (
                <Link
                  key={s.label}
                  to="/contact"
                  title={`${s.label} — link to be added`}
                  aria-label={`${s.label} (placeholder — link to be added)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line/10 text-ivory/70 transition hover:border-gold hover:text-gold"
                >
                  {Icon && <Icon size={16} strokeWidth={1.4} />}
                </Link>
              );
            })}
          </div>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted/60">Social links: placeholders</p>
        </div>
      </div>
      <div className="border-t border-line/5">
        <div className="container-lux flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved. · Demo storefront — no real orders are processed.
          </p>
          <ul className="flex flex-wrap justify-center gap-5">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
