import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { collections } from '../../data/collections';
import { useShop } from '../../store/ShopContext';
import { collectionBanner } from '../../data/images';
import Logo from '../ui/Logo';
import MobileMenu from './MobileMenu';
import ThemeToggle from '../ui/ThemeToggle';
import { discoverLinks, mainNav } from './nav';

function CountBadge({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-semibold text-ongold"
          aria-hidden
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();
  const closeTimer = useRef<number>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  // over dark hero imagery the transparent header uses the dark palette
  const darkHeroRoute = pathname === '/' || pathname.startsWith('/collections/') || pathname === '/our-story' || pathname === '/newsletter' || pathname.startsWith('/journal/');
  const overHero = darkHeroRoute && !scrolled && !mega;

  const iconBtn = 'relative flex h-10 w-10 items-center justify-center text-ivory/85 transition hover:text-gold';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${overHero ? 'theme-dark ' : ''}${
          scrolled || mega ? 'border-b border-gold/15 bg-obsidian/90 backdrop-blur-xl' : 'border-b border-transparent bg-gradient-to-b from-obsidian/70 to-transparent'
        }`}
      >
        <div className="hidden bg-gold/[0.07] py-1.5 text-center text-[0.6rem] uppercase tracking-[0.3em] text-gold-light/80 sm:block">
          Complimentary shipping on orders over ₹5,000 · Illustrative demo store
        </div>
        <div className={`container-lux flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
          <button className={`${iconBtn} lg:hidden`} onClick={() => setMobile(true)} aria-label="Open menu" aria-expanded={mobile}>
            <Menu size={22} strokeWidth={1.3} />
          </button>

          <Link to="/" className="shrink-0" aria-label="Mahek Perfume home">
            <Logo size={scrolled ? 'sm' : 'md'} />
          </Link>

          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) =>
                item.mega ? (
                  <li key={item.label} onMouseEnter={openMega} onMouseLeave={closeMega} className="relative">
                    <button
                      className={`flex items-center gap-1 py-6 text-[0.7rem] uppercase tracking-[0.22em] transition hover:text-gold ${
                        pathname.startsWith('/collections') ? 'text-gold' : 'text-ivory/85'
                      }`}
                      aria-expanded={mega}
                      aria-haspopup="true"
                      onClick={() => setMega((m) => !m)}
                      onKeyDown={(e) => e.key === 'Escape' && setMega(false)}
                    >
                      {item.label}
                      <ChevronDown size={13} className={`transition-transform ${mega ? 'rotate-180' : ''}`} />
                    </button>
                  </li>
                ) : (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `relative py-6 text-[0.7rem] uppercase tracking-[0.22em] transition hover:text-gold ${isActive ? 'text-gold' : 'text-ivory/85'}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <ThemeToggle className={iconBtn} />
            <button className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search perfumes">
              <Search size={19} strokeWidth={1.3} />
            </button>
            <Link to="/account" className={`${iconBtn} hidden sm:flex`} aria-label="Account">
              <User size={19} strokeWidth={1.3} />
            </Link>
            <Link to="/wishlist" className={`${iconBtn} hidden sm:flex`} aria-label={`Wishlist, ${wishlist.length} items`}>
              <Heart size={19} strokeWidth={1.3} />
              <CountBadge n={wishlist.length} />
            </Link>
            <button className={iconBtn} onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cartCount} items`}>
              <ShoppingBag size={19} strokeWidth={1.3} />
              <CountBadge n={cartCount} />
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 top-full hidden border-b border-gold/15 bg-obsidian/95 backdrop-blur-xl lg:block"
            >
              <div className="container-lux grid grid-cols-[1fr_1fr_1.3fr] gap-10 py-10">
                <div>
                  <p className="eyebrow mb-5">Collections</p>
                  <ul className="space-y-3">
                    {collections.slice(0, 4).map((c) => (
                      <li key={c.slug}>
                        <Link to={`/collections/${c.slug}`} className="font-serif text-2xl text-ivory/90 transition hover:text-gold">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow mb-5">Curated</p>
                  <ul className="space-y-3">
                    {collections.slice(4).map((c) => (
                      <li key={c.slug}>
                        <Link to={`/collections/${c.slug}`} className="font-serif text-2xl text-ivory/90 transition hover:text-gold">
                          {c.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/shop" className="btn-ghost mt-3 text-gold">
                        Shop all perfumes →
                      </Link>
                    </li>
                  </ul>
                  <p className="eyebrow mb-4 mt-8">Discover</p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                    {discoverLinks.map((l) => (
                      <li key={l.to}>
                        <Link to={l.to} className="hover:text-gold">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/collections/oud" className="theme-dark group relative flex min-h-[260px] overflow-hidden border border-gold/20 p-8">
                  <img src={collectionBanner('oud')} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/50 to-transparent" />
                  <div className="relative z-10 max-w-[60%]">
                    <p className="eyebrow">The Treasury</p>
                    <p className="mt-3 font-serif text-3xl leading-tight">Oud &amp; Luxury Collection</p>
                    <p className="mt-3 text-sm text-ivory/70">Rare agarwood, saffron and ambergris.</p>
                    <span className="btn-ghost mt-6 text-gold">Explore →</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}
