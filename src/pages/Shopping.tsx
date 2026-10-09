import { Check, Heart, Lock, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import { ProductGrid, PriceTag, ProductThumb } from '../components/product/ProductCard';
import { FormField, isEmail, SelectField } from '../components/ui/FormField';
import { DemoNotice, PageHero, usePageMeta } from '../components/ui/primitives';
import { formatPrice, site } from '../config/site';
import { products } from '../data/products';
import { promoCodes, useShop } from '../store/ShopContext';

function EmptyState({ icon: Icon, title, text, cta = 'Explore the collection', to = '/shop' }: { icon: typeof Heart; title: string; text: string; cta?: string; to?: string }) {
  return (
    <div className="card-lux flex flex-col items-center px-6 py-20 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.04]">
        <Icon size={32} strokeWidth={1} className="text-gold" />
      </span>
      <h2 className="mt-8 text-4xl">{title}</h2>
      <p className="mt-3 max-w-sm text-muted">{text}</p>
      <Link to={to} className="btn-gold mt-10">
        {cta}
      </Link>
    </div>
  );
}

/* ---------------- Wishlist ---------------- */
export function Wishlist() {
  usePageMeta('Wishlist', 'Your saved Mahek perfumes.');
  const { wishlist, toggleWishlist, addToCart } = useShop();
  return (
    <>
      <PageHero eyebrow="Saved for later" title="Your wishlist" text="Saved in this browser only (localStorage) — no account required." crumbs={[{ label: 'Wishlist' }]} />
      <section className="container-lux py-16">
        {wishlist.length === 0 ? (
          <EmptyState icon={Heart} title="Nothing saved yet" text="Tap the heart on any perfume to keep it here for later." />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{wishlist.length} saved</p>
              <button
                className="btn-outline px-5 py-2.5"
                onClick={() => wishlist.filter((p) => p.inStock).forEach((p) => addToCart(p))}
              >
                Add all to bag
              </button>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              {wishlist.map((p) => (
                <li key={p.id} className="card-lux flex gap-5 p-4">
                  <Link to={`/product/${p.slug}`} className="flex h-36 w-28 shrink-0 items-center justify-center bg-[radial-gradient(ellipse_at_center,#30271a,#1e1812)]">
                    <ProductThumb product={p} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <p className="eyebrow">{p.families.slice(0, 2).join(' · ')}</p>
                    <Link to={`/product/${p.slug}`} className="mt-1 font-serif text-2xl hover:text-gold">
                      {p.name}
                    </Link>
                    <PriceTag product={p} className="mt-1" />
                    {!p.inStock && <p className="mt-1 text-xs text-muted">Currently sold out</p>}
                    <div className="mt-auto flex gap-2 pt-3">
                      <button className="btn-gold flex-1 px-3 py-2.5" disabled={!p.inStock} onClick={() => addToCart(p)}>
                        Add to bag
                      </button>
                      <button onClick={() => toggleWishlist(p)} className="flex w-11 items-center justify-center border border-line/15 hover:border-red-300 hover:text-red-300" aria-label={`Remove ${p.name}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

/* ---------------- Order summary (shared) ---------------- */
function Summary({ children }: { children?: React.ReactNode }) {
  const { subtotal, discount, shipping, total, promo, cart } = useShop();
  return (
    <div className="card-lux space-y-4 p-6">
      <h2 className="text-2xl">Order summary</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal ({cart.reduce((s, l) => s + l.qty, 0)} items)</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-gold">
            <dt>Promo {promo?.code}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Shipping (illustrative)</dt>
          <dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd>
        </div>
        <div className="hairline" />
        <div className="flex justify-between text-lg">
          <dt>Total</dt>
          <dd className="font-serif text-2xl text-gold">{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}

/* ---------------- Cart ---------------- */
export function Cart() {
  usePageMeta('Your Bag', 'Review your shopping bag.');
  const { cart, applyPromo, promo, removePromo, subtotal, shippingMethod, setShippingMethod } = useShop();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const suggestions = products.filter((p) => p.inStock && !cart.some((l) => l.productId === p.id)).slice(0, 4);

  return (
    <>
      <PageHero eyebrow="Shopping bag" title="Your bag" crumbs={[{ label: 'Bag' }]} />
      <section className="container-lux py-16">
        {cart.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your bag is empty" text="Discover a fragrance that tells your story." />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="divide-y divide-line/10 border-y border-line/10">
                {cart.map((l) => (
                  <CartItem key={l.key} line={l} />
                ))}
              </div>
              <Link to="/shop" className="btn-ghost mt-8">
                ← Continue shopping
              </Link>
            </div>
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <Summary>
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-[0.68rem] uppercase tracking-[0.2em] text-muted">Shipping estimate</legend>
                  {(['standard', 'express'] as const).map((m) => (
                    <label key={m} className={`flex cursor-pointer items-center justify-between border px-4 py-3 text-sm ${shippingMethod === m ? 'border-gold bg-gold/5' : 'border-line/10'}`}>
                      <span className="flex items-center gap-3">
                        <input type="radio" name="ship" checked={shippingMethod === m} onChange={() => setShippingMethod(m)} className="accent-[#D4AF37]" />
                        {m === 'standard' ? 'Standard · 3–5 days' : 'Express · 1–2 days'}
                      </span>
                      <span className="text-muted">
                        {m === 'express' ? formatPrice(site.shipping.express) : subtotal >= site.shipping.freeThreshold ? 'Free' : formatPrice(site.shipping.standard)}
                      </span>
                    </label>
                  ))}
                </fieldset>
                {promo ? (
                  <div className="flex items-center justify-between border border-gold/40 bg-gold/5 px-4 py-3 text-sm">
                    <span className="flex items-center gap-2">
                      <Tag size={14} className="text-gold" /> {promo.code} — {promo.label}
                    </span>
                    <button onClick={removePromo} aria-label="Remove promo code" className="hover:text-gold">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const r = applyPromo(code);
                      setMsg({ ok: r.ok, text: r.message });
                      if (r.ok) setCode('');
                    }}
                  >
                    <label htmlFor="promo" className="mb-2 block text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                      Promo code
                    </label>
                    <div className="flex">
                      <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} className="input-lux uppercase" placeholder="Enter code" />
                      <button className="btn-outline px-5">Apply</button>
                    </div>
                  </form>
                )}
                {msg && (
                  <p className={`text-xs ${msg.ok ? 'text-gold' : 'text-red-400'}`} role="status">
                    {msg.text}
                  </p>
                )}
                <p className="text-xs text-muted">
                  Sample codes:{' '}
                  {promoCodes.map((p, i) => (
                    <button key={p.code} type="button" onClick={() => setCode(p.code)} className="text-gold hover:underline">
                      {p.code}
                      {i < promoCodes.length - 1 ? ', ' : ''}
                    </button>
                  ))}
                </p>
                <Link to="/checkout" className="btn-gold w-full">
                  <Lock size={14} /> Proceed to checkout
                </Link>
              </Summary>
            </div>
          </div>
        )}
      </section>
      {suggestions.length > 0 && (
        <section className="container-lux py-10">
          <h2 className="mb-10 text-4xl">You might also like</h2>
          <ProductGrid products={suggestions} />
        </section>
      )}
    </>
  );
}

/* ---------------- Checkout ---------------- */
type Ship = { email: string; phone: string; first: string; last: string; address: string; city: string; state: string; pin: string };
const emptyShip: Ship = { email: '', phone: '', first: '', last: '', address: '', city: '', state: '', pin: '' };

export function Checkout() {
  usePageMeta('Checkout', 'Simulated checkout — no real payment is taken.');
  const { cart, total, shippingMethod, setShippingMethod, clearCart, subtotal } = useShop();
  const [f, setF] = useState<Ship>(emptyShip);
  const [errors, setErrors] = useState<Partial<Record<keyof Ship | 'pay', string>>>({});
  const [pay, setPay] = useState('');
  const [gift, setGift] = useState(false);
  const [confirmed, setConfirmed] = useState<{ id: string; total: number; email: string } | null>(null);
  const set = (k: keyof Ship) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  if (confirmed) {
    return (
      <section className="container-lux flex min-h-[80vh] items-center justify-center pt-32">
        <div className="card-lux max-w-xl p-10 text-center" role="status">
          <span className="demo-badge">Simulated order — nothing was purchased</span>
          <span className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold">
            <Check size={30} className="text-gold" />
          </span>
          <h1 className="mt-8 text-5xl">Thank you</h1>
          <p className="mt-4 text-muted">
            Demo reference <span className="text-gold">{confirmed.id}</span> for {formatPrice(confirmed.total)}.
          </p>
          <p className="mt-4 text-sm leading-6 text-ivory/70">
            This is a prototype checkout. No order was created, no payment was taken and no confirmation email will be sent to {confirmed.email}.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-gold">
              Continue shopping
            </Link>
            <Link to="/track-order" className="btn-outline">
              See tracking demo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="Checkout" crumbs={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
        <section className="container-lux py-16">
          <EmptyState icon={ShoppingBag} title="Your bag is empty" text="Add a fragrance to your bag before checking out." />
        </section>
      </>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!isEmail(f.email)) err.email = 'Enter a valid email.';
    if (!/^[+\d\s-]{8,}$/.test(f.phone)) err.phone = 'Enter a valid phone number.';
    if (!f.first.trim()) err.first = 'Required.';
    if (!f.last.trim()) err.last = 'Required.';
    if (f.address.trim().length < 5) err.address = 'Enter your street address.';
    if (!f.city.trim()) err.city = 'Required.';
    if (!f.state) err.state = 'Select a state / region.';
    if (!/^\d{6}$/.test(f.pin)) err.pin = 'Enter a 6-digit PIN code.';
    if (!pay) err.pay = 'Choose a sample payment method.';
    setErrors(err);
    if (Object.keys(err).length) {
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const id = `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmed({ id, total, email: f.email });
    clearCart();
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <PageHero eyebrow="Secure-looking, fully simulated" title="Checkout" crumbs={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
      <section className="container-lux py-14">
        <DemoNotice className="mb-10">
          This checkout is a static prototype. It never asks for card numbers, takes no payment and creates no order. Details you type stay in this page only.
        </DemoNotice>
        <form onSubmit={submit} noValidate className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-12">
            <fieldset>
              <legend className="mb-6 font-serif text-3xl">
                <span className="mr-3 text-gold">01</span>Contact
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Email" type="email" required value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                <FormField label="Phone" type="tel" required value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-6 font-serif text-3xl">
                <span className="mr-3 text-gold">02</span>Shipping address
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="First name" required value={f.first} onChange={set('first')} error={errors.first} autoComplete="given-name" />
                <FormField label="Last name" required value={f.last} onChange={set('last')} error={errors.last} autoComplete="family-name" />
                <FormField className="sm:col-span-2" label="Street address" required value={f.address} onChange={set('address')} error={errors.address} autoComplete="street-address" />
                <FormField label="City" required value={f.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
                <SelectField label="State / region" required value={f.state} onChange={set('state')} error={errors.state}>
                  <option value="">Select</option>
                  {['Region A', 'Region B', 'Region C', 'Other'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </SelectField>
                <FormField label="PIN code" required inputMode="numeric" maxLength={6} value={f.pin} onChange={set('pin')} error={errors.pin} autoComplete="postal-code" hint="Sample region list — replace with real regions." />
              </div>
              <label className="mt-5 flex items-center gap-3 text-sm text-ivory/80">
                <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="accent-[#D4AF37]" /> Add complimentary gift wrapping (illustrative)
              </label>
            </fieldset>

            <fieldset>
              <legend className="mb-6 font-serif text-3xl">
                <span className="mr-3 text-gold">03</span>Delivery method
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['standard', 'express'] as const).map((m) => (
                  <label key={m} className={`cursor-pointer border p-5 transition ${shippingMethod === m ? 'border-gold bg-gold/5' : 'border-line/10 hover:border-gold/40'}`}>
                    <input type="radio" name="delivery" className="sr-only" checked={shippingMethod === m} onChange={() => setShippingMethod(m)} />
                    <span className="block font-serif text-xl capitalize">{m}</span>
                    <span className="block text-xs text-muted">{m === 'standard' ? '3–5 business days (illustrative)' : '1–2 business days (illustrative)'}</span>
                    <span className="mt-2 block text-sm text-gold">
                      {m === 'express' ? formatPrice(site.shipping.express) : subtotal >= site.shipping.freeThreshold ? 'Complimentary' : formatPrice(site.shipping.standard)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-6 font-serif text-3xl">
                <span className="mr-3 text-gold">04</span>Payment <span className="demo-badge ml-2 align-middle">Sample only</span>
              </legend>
              <div className="grid gap-3" role="radiogroup" aria-invalid={!!errors.pay}>
                {[
                  { id: 'card', label: 'Card payment', note: 'Demo — no card details are requested or collected' },
                  { id: 'upi', label: 'UPI / wallet', note: 'Demo — no payment app is opened' },
                  { id: 'cod', label: 'Cash on delivery', note: 'Demo — illustrative option' },
                ].map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-4 border p-5 transition ${pay === m.id ? 'border-gold bg-gold/5' : 'border-line/10 hover:border-gold/40'}`}>
                    <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id)} className="accent-[#D4AF37]" />
                    <span>
                      <span className="block">{m.label}</span>
                      <span className="block text-xs text-muted">{m.note}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.pay && (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  {errors.pay}
                </p>
              )}
            </fieldset>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Summary>
              <ul className="max-h-64 divide-y divide-line/10 overflow-y-auto border-y border-line/10">
                {cart.map((l) => (
                  <li key={l.key} className="flex items-center gap-3 py-3">
                    <span className="relative flex h-16 w-12 shrink-0 items-center justify-center bg-black/40">
                      <ProductThumb product={l.product} />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.6rem] text-ongold">{l.qty}</span>
                    </span>
                    <span className="flex-1 text-sm">
                      {l.product.name}
                      <span className="block text-xs text-muted">{l.size.label}</span>
                    </span>
                    <span className="text-sm">{formatPrice(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <button type="submit" className="btn-gold w-full">
                Place demo order
              </button>
              <p className="text-center text-xs text-muted">No payment will be taken. <Link to="/cart" className="text-gold hover:underline">Edit bag</Link></p>
            </Summary>
          </div>
        </form>
      </section>
    </>
  );
}
