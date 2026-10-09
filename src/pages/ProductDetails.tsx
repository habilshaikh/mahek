import { Check, Clock, Gift, Minus, Plus, Truck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductBadges, ProductGrid, ProductThumb } from '../components/product/ProductCard';
import ProductGallery from '../components/product/ProductGallery';
import { Breadcrumbs, DemoNotice, Meter, Reveal, SectionHeading, Stars, usePageMeta } from '../components/ui/primitives';
import WishlistButton from '../components/wishlist/WishlistButton';
import { formatPrice } from '../config/site';
import { familyInfo } from '../data/collections';
import { getProduct, products, relatedProducts } from '../data/products';
import type { Product } from '../data/types';
import { useShop } from '../store/ShopContext';
import NotFound from './NotFound';

const sampleReviews = (p: Product) => [
  { name: 'Sample Reviewer 1', rating: 5, title: 'Beautiful and long-lasting', text: `${p.name} has become my go-to. The ${p.notes.heart[0].toLowerCase()} heart is gorgeous.` },
  { name: 'Sample Reviewer 2', rating: 5, title: 'Elegant presentation', text: 'The bottle feels luxurious and the scent develops beautifully over the day.' },
  { name: 'Sample Reviewer 3', rating: 4, title: 'Lovely, a little goes far', text: `Warm and refined. I love how the ${p.notes.base[0].toLowerCase()} lingers in the evening.` },
];

function addBusinessDays(days: number) {
  const d = new Date();
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function ProductDetails() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  usePageMeta(product?.name ?? 'Product not found', product ? `${product.name} — ${product.tagline}. ${product.families.join(', ')} fragrance by Mahek Perfume.` : undefined);
  const { addToCart } = useShop();
  const [ml, setMl] = useState(0);
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    if (product) {
      setMl(product.sizes[product.sizes.length > 1 ? 1 : 0].ml);
      setQty(1);
      setPin('');
      setPinMsg(null);
    }
  }, [product]);

  // show the sticky mobile purchase bar once the main buy buttons scroll out of view
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [product]);

  if (!product) return <NotFound />;
  const size = product.sizes.find((s) => s.ml === ml) ?? product.sizes[0];
  const related = relatedProducts(product, 4);
  const primaryFamily = familyInfo.find((f) => f.family === product.families[0]);
  const alsoLike = products
    .filter((p) => p.id !== product.id && !related.includes(p) && p.occasions.some((o) => product.occasions.includes(o)) && p.intensity !== product.intensity)
    .slice(0, 4);

  const checkPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin.trim())) {
      setPinMsg({ ok: false, text: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    const fast = Number(pin[0]) <= 4;
    setPinMsg({ ok: true, text: `Estimated delivery by ${addBusinessDays(fast ? 3 : 5)} (standard) or ${addBusinessDays(fast ? 1 : 2)} (express).` });
  };

  return (
    <>
      <section className="container-lux pb-16 pt-32 sm:pt-36">
        <Breadcrumbs crumbs={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} className="mb-8" />
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <ProductGallery product={product} />

          <div>
            <ProductBadges product={product} />
            <p className="eyebrow mt-5">
              {product.gender === 'unisex' ? 'Unisex' : product.gender === 'men' ? 'Pour Homme' : 'Pour Femme'} · {product.isSet ? 'Gift Set' : 'Eau de Parfum'}
            </p>
            <h1 className="mt-3 text-5xl leading-tight sm:text-6xl">{product.name}</h1>
            <p className="mt-2 font-serif text-xl italic text-ivory/70">{product.tagline}</p>
            <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-xs text-muted hover:text-gold">
              <Stars rating={product.rating} size={13} /> {product.rating.toFixed(1)} · {product.reviewCount} sample reviews
            </a>

            <p className="mt-8 flex flex-wrap items-baseline gap-3 text-3xl">
              {formatPrice(size.price)}
              {size.compareAt && (
                <>
                  <span className="text-lg text-muted line-through">{formatPrice(size.compareAt)}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-gold">Save {Math.round((1 - size.price / size.compareAt) * 100)}% · sample offer</span>
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted">Inclusive of taxes (illustrative)</p>

            <p className="mt-8 leading-8 text-ivory/75">{product.description}</p>

            {product.setContents && (
              <ul className="mt-6 space-y-2 border-l border-gold/40 pl-4 text-sm text-ivory/75">
                {product.setContents.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <Gift size={13} className="text-gold" /> {x}
                  </li>
                ))}
              </ul>
            )}

            <fieldset className="mt-8">
              <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                {product.isSet ? 'Format' : 'Volume'}: <span className="text-ivory">{size.label}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.ml}
                    onClick={() => setMl(s.ml)}
                    aria-pressed={s.ml === ml}
                    className={`min-w-[96px] border px-4 py-3 text-left transition ${s.ml === ml ? 'border-gold bg-gold/10' : 'border-line/15 hover:border-gold/50'}`}
                  >
                    <span className="block text-sm">{s.label}</span>
                    <span className="block text-xs text-muted">{formatPrice(s.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div ref={buyRef} className="mt-8 flex flex-wrap items-stretch gap-3">
              <div className="flex items-center border border-line/15" role="group" aria-label="Quantity">
                <button className="px-4 py-3 hover:text-gold" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center" aria-live="polite">
                  {qty}
                </span>
                <button className="px-4 py-3 hover:text-gold" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <button className="btn-gold min-w-[200px] flex-1" disabled={!product.inStock} onClick={() => addToCart(product, size.ml, qty)}>
                {product.inStock ? `Add to bag · ${formatPrice(size.price * qty)}` : 'Currently sold out'}
              </button>
              <WishlistButton product={product} withLabel />
            </div>
            {!product.inStock && <p className="mt-3 text-sm text-muted">This sample product is shown as out of stock to demonstrate the sold-out state.</p>}

            {/* delivery estimate */}
            <div className="card-lux mt-8 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm">
                  <Truck size={16} className="text-gold" /> Delivery estimate
                </p>
                <span className="demo-badge">Demo</span>
              </div>
              <form onSubmit={checkPin} className="flex gap-2" noValidate>
                <label className="sr-only" htmlFor="pin">
                  PIN code
                </label>
                <input id="pin" value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" maxLength={6} placeholder="Enter PIN code" className="input-lux py-2.5" />
                <button className="btn-outline px-5 py-2.5">Check</button>
              </form>
              {pinMsg && (
                <p className={`mt-3 text-xs ${pinMsg.ok ? 'text-ivory/80' : 'text-red-400'}`} role="status">
                  {pinMsg.text}
                </p>
              )}
              <p className="mt-3 text-xs text-muted">Illustrative estimate only — not connected to a courier service.</p>
            </div>

            <ul className="mt-6 grid gap-3 text-xs text-ivory/70 sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-gold" /> Complimentary gift wrap
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-gold" /> Ships in 1–2 days*
              </li>
              <li className="flex items-center gap-2">
                <Gift size={14} className="text-gold" /> Free sample with orders*
              </li>
            </ul>
            <p className="mt-2 text-[0.65rem] text-muted">*Illustrative placeholder benefits.</p>
          </div>
        </div>
      </section>

      {/* NOTES PYRAMID & PERFORMANCE */}
      <section className="border-y border-line/5 bg-charcoal py-20">
        <div className="container-lux grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="eyebrow">The Composition</p>
            <h2 className="mt-3 text-4xl">Fragrance pyramid</h2>
            <div className="mt-10 space-y-4">
              {(
                [
                  ['top', 'Top notes', 'The first impression', '70%'],
                  ['heart', 'Heart notes', 'The character', '85%'],
                  ['base', 'Base notes', 'The lasting trail', '100%'],
                ] as const
              ).map(([k, label, sub, w]) => (
                <div key={k} className="mx-auto border border-gold/25 bg-gradient-to-r from-gold/[0.04] via-gold/[0.1] to-gold/[0.04] p-5 text-center" style={{ width: w }}>
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-gold">
                    {label} · <span className="text-muted">{sub}</span>
                  </p>
                  <p className="mt-2 font-serif text-xl sm:text-2xl">{product.notes[k].join(' · ')}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="space-y-8">
            <div>
              <p className="eyebrow">Performance</p>
              <p className="mt-2 text-xs text-muted">Illustrative sample information — results vary with skin and climate.</p>
            </div>
            <Meter label="Longevity" value={product.longevity} />
            <Meter label="Projection" value={product.projection} />
            <dl className="grid grid-cols-2 gap-6 border-t border-line/10 pt-6 text-sm">
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Family</dt>
                <dd className="mt-1">{product.families.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Intensity</dt>
                <dd className="mt-1 capitalize">{product.intensity}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Best for</dt>
                <dd className="mt-1 capitalize">{product.occasions.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Seasons</dt>
                <dd className="mt-1 capitalize">{product.seasons.join(', ')}</dd>
              </div>
            </dl>
            {primaryFamily && (
              <Link to={`/scent-wheel?family=${primaryFamily.family}`} className="block border border-line/10 p-5 transition hover:border-gold/40">
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-muted">Explore the {primaryFamily.family} family</p>
                <p className="mt-1 text-sm text-ivory/75">{primaryFamily.description}</p>
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="container-lux scroll-mt-28 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-3 text-4xl">What patrons say</h2>
            <div className="mt-6 flex items-center gap-4">
              <span className="font-serif text-6xl text-gold">{product.rating.toFixed(1)}</span>
              <div>
                <Stars rating={product.rating} />
                <p className="mt-1 text-xs text-muted">{product.reviewCount} sample reviews</p>
              </div>
            </div>
            <DemoNotice className="mt-8">These are sample reviews written for demonstration and do not come from real customers.</DemoNotice>
          </div>
          <div className="divide-y divide-line/10 border-y border-line/10">
            {sampleReviews(product).map((r) => (
              <article key={r.name} className="py-6">
                <div className="flex items-center justify-between">
                  <Stars rating={r.rating} size={12} />
                  <span className="text-xs text-muted">{r.name}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ivory/70">{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-lux pb-10">
        <SectionHeading align="left" eyebrow="Related" title="You may also love" />
        <ProductGrid products={related} />
      </section>

      {alsoLike.length > 0 && (
        <section className="container-lux py-16">
          <SectionHeading align="left" eyebrow="Fragrance recommendations" title="For a different mood" text={`Perfumes that suit the same occasions as ${product.name}, with a different intensity.`} />
          <ProductGrid products={alsoLike} />
        </section>
      )}

      {/* sticky mobile purchase bar */}
      <div
        className={`fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom))] z-[55] border-t border-gold/25 bg-charcoal/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          showSticky ? 'translate-y-0' : 'pointer-events-none translate-y-[200%]'
        }`}
        aria-hidden={!showSticky}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="h-12 w-10 shrink-0 overflow-hidden">
            <ProductThumb product={product} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg leading-tight">{product.name}</p>
            <p className="text-xs text-muted">
              {size.label} · <span className="text-gold">{formatPrice(size.price)}</span>
            </p>
          </div>
          <button className="btn-gold shrink-0 px-5 py-3" disabled={!product.inStock} tabIndex={showSticky ? 0 : -1} onClick={() => addToCart(product, size.ml, qty)}>
            {product.inStock ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </div>
    </>
  );
}
