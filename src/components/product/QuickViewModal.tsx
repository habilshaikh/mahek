import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../config/site';
import { useShop } from '../../store/ShopContext';
import Modal from '../ui/Modal';
import { Stars } from '../ui/primitives';
import WishlistButton from '../wishlist/WishlistButton';
import { ProductBadges, ProductStage } from './ProductCard';

export default function QuickViewModal() {
  const { quickView: p, setQuickView, addToCart } = useShop();
  const [ml, setMl] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (p) {
      setMl(p.sizes[p.sizes.length > 1 ? 1 : 0].ml);
      setQty(1);
    }
  }, [p]);

  const close = () => setQuickView(null);
  const size = p?.sizes.find((s) => s.ml === ml) ?? p?.sizes[0];

  return (
    <Modal open={!!p} onClose={close} title={p ? `Quick view: ${p.name}` : 'Quick view'}>
      {p && size && (
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-full">
            <ProductStage product={p} className="absolute inset-0" eager hoverSwap={false} />
          </div>
          <div className="p-6 sm:p-10">
            <ProductBadges product={p} />
            <p className="eyebrow mt-4">{p.families.join(' · ')}</p>
            <h2 className="mt-2 text-4xl">{p.name}</h2>
            <p className="mt-1 italic text-muted">{p.tagline}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <Stars rating={p.rating} size={12} /> {p.rating.toFixed(1)} · {p.reviewCount} sample reviews
            </div>
            <p className="mt-5 text-sm leading-7 text-ivory/75">{p.description}</p>

            <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-line/10 py-4 text-xs">
              {(['top', 'heart', 'base'] as const).map((k) => (
                <div key={k}>
                  <dt className="uppercase tracking-[0.2em] text-gold">{k}</dt>
                  <dd className="mt-1 leading-5 text-ivory/70">{p.notes[k].join(', ')}</dd>
                </div>
              ))}
            </dl>

            <fieldset className="mt-6">
              <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted">Size</legend>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button key={s.ml} onClick={() => setMl(s.ml)} aria-pressed={s.ml === ml} className={`chip ${s.ml === ml ? 'chip-active' : ''}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 text-2xl">
              {formatPrice(size.price)}
              {size.compareAt && <span className="ml-3 text-base text-muted line-through">{formatPrice(size.compareAt)}</span>}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-line/15">
                <button className="p-3 hover:text-gold" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm" aria-live="polite">
                  {qty}
                </span>
                <button className="p-3 hover:text-gold" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <button
                className="btn-gold flex-1"
                disabled={!p.inStock}
                onClick={() => {
                  addToCart(p, size.ml, qty);
                  close();
                }}
              >
                {p.inStock ? 'Add to bag' : 'Sold out'}
              </button>
              <WishlistButton product={p} />
            </div>
            <Link to={`/product/${p.slug}`} onClick={close} className="btn-ghost mt-6">
              View full details →
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
