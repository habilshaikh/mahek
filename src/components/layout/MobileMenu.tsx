import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Heart, Package, Search, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useShop } from '../../store/ShopContext';
import Logo from '../ui/Logo';
import { useOverlay } from '../ui/Modal';
import ThemeToggle from '../ui/ThemeToggle';
import { collectionLinks, discoverLinks, mainNav } from './nav';

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [colOpen, setColOpen] = useState(false);
  const { wishlist, setSearchOpen } = useShop();
  useOverlay(open, onClose, ref);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col border-r border-gold/20 bg-obsidian"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line/10 px-5 py-4">
              <Logo size="sm" />
              <button onClick={onClose} aria-label="Close menu" className="p-2 hover:text-gold">
                <X size={22} strokeWidth={1.3} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
              <ul className="space-y-1">
                {mainNav.map((item) =>
                  item.mega ? (
                    <li key={item.label}>
                      <button
                        onClick={() => setColOpen((v) => !v)}
                        aria-expanded={colOpen}
                        className="flex w-full items-center justify-between py-3 font-serif text-3xl text-ivory"
                      >
                        {item.label}
                        <ChevronDown size={20} className={`text-gold transition-transform ${colOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {colOpen && (
                          <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-l border-gold/30 pl-4">
                            {collectionLinks.map((c) => (
                              <li key={c.to}>
                                <Link to={c.to} className="block py-2 text-sm uppercase tracking-[0.16em] text-ivory/75 hover:text-gold">
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => `block py-3 font-serif text-3xl ${isActive ? 'text-gold' : 'text-ivory'}`}>
                        {item.label}
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
              <ThemeToggle withLabel className="mt-6 flex w-full items-center justify-between border border-line/15 px-4 py-3 text-xs uppercase tracking-[0.2em] text-ivory/80 hover:border-gold hover:text-gold" />
              <div className="hairline my-6" />
              <ul className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.16em] text-muted">
                {discoverLinks.slice(1).map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/faq" className="hover:text-gold">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="grid grid-cols-4 border-t border-line/10 text-[0.6rem] uppercase tracking-[0.14em] text-ivory/80">
              <button
                onClick={() => {
                  onClose();
                  setSearchOpen(true);
                }}
                className="flex flex-col items-center gap-1.5 py-4 hover:text-gold"
              >
                <Search size={18} strokeWidth={1.3} /> Search
              </button>
              <Link to="/account" className="flex flex-col items-center gap-1.5 py-4 hover:text-gold">
                <User size={18} strokeWidth={1.3} /> Account
              </Link>
              <Link to="/wishlist" className="flex flex-col items-center gap-1.5 py-4 hover:text-gold">
                <Heart size={18} strokeWidth={1.3} /> Saved ({wishlist.length})
              </Link>
              <Link to="/track-order" className="flex flex-col items-center gap-1.5 py-4 hover:text-gold">
                <Package size={18} strokeWidth={1.3} /> Track
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
