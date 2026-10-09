import { ProductThumb } from '../product/ProductCard';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../config/site';
import { minPrice, products } from '../../data/products';
import { useShop } from '../../store/ShopContext';
import { useOverlay } from '../ui/Modal';

const SUGGESTIONS = ['Oud', 'Rose', 'Amber', 'Citrus', 'Musk', 'Gift set'];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const close = () => setSearchOpen(false);
  useOverlay(searchOpen, close, ref);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        [p.name, p.tagline, ...p.families, ...p.notes.top, ...p.notes.heart, ...p.notes.base, p.isSet ? 'gift set' : ''].join(' ').toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    close();
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl" onClick={close} aria-hidden />
          <div ref={ref} role="dialog" aria-modal="true" aria-label="Search" className="container-lux relative max-h-full overflow-y-auto pb-16 pt-20 sm:pt-28">
            <button onClick={close} className="absolute right-4 top-6 p-2 text-ivory/70 hover:text-gold sm:right-10" aria-label="Close search">
              <X size={24} strokeWidth={1.2} />
            </button>
            <form onSubmit={submit} className="mx-auto max-w-3xl">
              <label htmlFor="site-search" className="eyebrow">
                Search the collection
              </label>
              <div className="mt-4 flex items-center gap-4 border-b border-gold/40 pb-3">
                <Search size={24} strokeWidth={1.2} className="text-gold" />
                <input
                  id="site-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Oud, rose, amber…"
                  className="w-full bg-transparent font-serif text-3xl text-ivory placeholder:text-muted/40 focus:outline-none sm:text-5xl"
                  autoComplete="off"
                />
                <button type="submit" className="text-gold" aria-label="See all results">
                  <ArrowRight size={24} strokeWidth={1.2} />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button type="button" key={s} onClick={() => setQ(s)} className="chip">
                    {s}
                  </button>
                ))}
              </div>
            </form>

            <div className="mx-auto mt-10 max-w-3xl" aria-live="polite">
              {q.trim() && results.length === 0 && <p className="text-muted">No perfumes found for “{q}”. Try another note or family.</p>}
              <ul className="grid gap-3 sm:grid-cols-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} onClick={close} className="card-lux flex items-center gap-4 p-3 transition hover:border-gold/40">
                      <span className="flex h-20 w-16 shrink-0 items-center justify-center bg-black/40">
                        <ProductThumb product={p} />
                      </span>
                      <span>
                        <span className="block font-serif text-xl">{p.name}</span>
                        <span className="block text-xs text-muted">{p.families.join(' · ')}</span>
                        <span className="mt-1 block text-sm text-gold">{formatPrice(minPrice(p))}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {results.length > 0 && (
                <button onClick={submit} className="btn-outline mt-8">
                  View all results
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
