import { ProductThumb } from '../components/product/ProductCard';
import { Check, MapPin, Package, Pencil, Plus, Search, Trash2, Truck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FormField, isEmail } from '../components/ui/FormField';
import { DemoNotice, PageHero, usePageMeta } from '../components/ui/primitives';
import { formatPrice } from '../config/site';
import { getProduct } from '../data/products';

function AccountNav() {
  const items = [
    { to: '/account', label: 'Sign in', icon: User },
    { to: '/account/orders', label: 'Orders', icon: Package },
    { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  ];
  return (
    <nav aria-label="Account" className="mb-10 flex flex-wrap justify-center gap-2">
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end className={({ isActive }) => `chip ${isActive ? 'chip-active' : ''}`}>
          <i.icon size={13} /> {i.label}
        </NavLink>
      ))}
    </nav>
  );
}

/* ---------------- Login / register ---------------- */
export function Account() {
  usePageMeta('Account', 'Sign in or create an account (demo).');
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (tab === 'register' && f.name.trim().length < 2) err.name = 'Please enter your name.';
    if (!isEmail(f.email)) err.email = 'Enter a valid email address.';
    if (f.password.length < 8) err.password = 'Use at least 8 characters.';
    setErrors(err);
    setOk(!Object.keys(err).length);
  };

  return (
    <>
      <PageHero eyebrow="My Mahek" title="Your account" crumbs={[{ label: 'Account' }]} />
      <section className="container-lux py-14">
        <AccountNav />
        <div className="mx-auto max-w-lg">
          <DemoNotice className="mb-8">Demo mode: there is no real authentication. Nothing you enter here is saved to a server or kept after you leave the page.</DemoNotice>
          <div className="card-lux p-6 sm:p-10">
            <div className="mb-8 grid grid-cols-2 border border-line/10" role="tablist">
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => {
                    setTab(t);
                    setOk(false);
                    setErrors({});
                  }}
                  className={`py-3 text-[0.7rem] uppercase tracking-[0.22em] ${tab === t ? 'bg-gold text-ongold' : 'text-muted hover:text-ivory'}`}
                >
                  {t === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>
            {ok ? (
              <div className="py-6 text-center" role="status">
                <Check className="mx-auto text-gold" />
                <p className="mt-4 font-serif text-2xl">Form validated</p>
                <p className="mt-2 text-sm text-muted">In the live site this would {tab === 'login' ? 'sign you in' : 'create your account'}. In this demo no account exists and no data was stored.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/account/orders" className="btn-gold">
                    View sample orders
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                {tab === 'register' && <FormField label="Full name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={errors.name} autoComplete="name" />}
                <FormField label="Email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={errors.email} autoComplete="email" />
                <FormField
                  label="Password"
                  type="password"
                  required
                  value={f.password}
                  onChange={(e) => setF({ ...f, password: e.target.value })}
                  error={errors.password}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button className="btn-gold w-full">{tab === 'login' ? 'Sign in' : 'Create account'}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Orders ---------------- */
const sampleOrders = [
  { id: 'DEMO-104582', date: '12 Sep 2026', status: 'Delivered', items: [{ slug: 'royal-oud-noir', size: '100 ml', qty: 1 }, { slug: 'white-musk-silk', size: '50 ml', qty: 1 }] },
  { id: 'DEMO-103977', date: '28 Aug 2026', status: 'In transit', items: [{ slug: 'heritage-discovery-set', size: '5 × 10 ml', qty: 2 }] },
  { id: 'DEMO-101230', date: '03 Jun 2026', status: 'Delivered', items: [{ slug: 'rose-mahal', size: '50 ml', qty: 1 }] },
];

export function Orders() {
  usePageMeta('Order History', 'Sample order history (demo).');
  return (
    <>
      <PageHero eyebrow="My Mahek" title="Order history" crumbs={[{ label: 'Account', to: '/account' }, { label: 'Orders' }]} />
      <section className="container-lux py-14">
        <AccountNav />
        <div className="mx-auto max-w-4xl">
          <DemoNotice className="mb-8">Sample order history for demonstration — these orders are not real.</DemoNotice>
          <div className="space-y-5">
            {sampleOrders.map((o) => {
              const total = o.items.reduce((s, i) => {
                const p = getProduct(i.slug);
                const sz = p?.sizes.find((x) => x.label === i.size) ?? p?.sizes[0];
                return s + (sz?.price ?? 0) * i.qty;
              }, 0);
              return (
                <article key={o.id} className="card-lux p-6">
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/10 pb-4">
                    <div>
                      <p className="font-serif text-2xl">{o.id}</p>
                      <p className="text-xs text-muted">Placed {o.date}</p>
                    </div>
                    <span className={`px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] ${o.status === 'Delivered' ? 'bg-line/10 text-ivory' : 'bg-gold/15 text-gold'}`}>{o.status}</span>
                  </header>
                  <ul className="divide-y divide-line/5">
                    {o.items.map((i) => {
                      const p = getProduct(i.slug);
                      if (!p) return null;
                      return (
                        <li key={i.slug} className="flex items-center gap-4 py-4">
                          <span className="flex h-16 w-12 items-center justify-center bg-black/40">
                            <ProductThumb product={p} />
                          </span>
                          <Link to={`/product/${p.slug}`} className="flex-1 hover:text-gold">
                            {p.name}
                            <span className="block text-xs text-muted">
                              {i.size} × {i.qty}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-4">
                    <p className="text-sm">
                      Total <span className="ml-2 text-gold">{formatPrice(total)}</span>
                    </p>
                    <Link to={`/track-order?id=${o.id}`} className="btn-ghost text-gold">
                      <Truck size={14} /> Track
                    </Link>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Addresses ---------------- */
interface Address {
  id: string;
  label: string;
  name: string;
  line: string;
  city: string;
  pin: string;
}
const seed: Address[] = [{ id: 'a1', label: 'Home', name: 'Sample Name', line: '00 Sample Street', city: 'Sample City', pin: '000000' }];
const load = (): Address[] => {
  try {
    const r = localStorage.getItem('mahek.addresses');
    return r ? JSON.parse(r) : seed;
  } catch {
    return seed;
  }
};

export function Addresses() {
  usePageMeta('Addresses', 'Manage demo addresses.');
  const [list, setList] = useState<Address[]>(load);
  const [editing, setEditing] = useState<Address | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      localStorage.setItem('mahek.addresses', JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }, [list]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const err: Record<string, string> = {};
    (['label', 'name', 'line', 'city'] as const).forEach((k) => {
      if (!editing[k].trim()) err[k] = 'Required.';
    });
    if (!/^\d{6}$/.test(editing.pin)) err.pin = 'Enter a 6-digit PIN code.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setList((l) => (l.some((a) => a.id === editing.id) ? l.map((a) => (a.id === editing.id ? editing : a)) : [...l, editing]));
    setEditing(null);
  };
  const upd = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => editing && setEditing({ ...editing, [k]: e.target.value });

  return (
    <>
      <PageHero eyebrow="My Mahek" title="Saved addresses" crumbs={[{ label: 'Account', to: '/account' }, { label: 'Addresses' }]} />
      <section className="container-lux py-14">
        <AccountNav />
        <div className="mx-auto max-w-4xl">
          <DemoNotice className="mb-8">Demo address book — stored only in this browser’s localStorage, never on a server.</DemoNotice>
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((a) => (
              <div key={a.id} className="card-lux p-6">
                <p className="eyebrow">{a.label}</p>
                <p className="mt-3">{a.name}</p>
                <p className="text-sm text-muted">{a.line}</p>
                <p className="text-sm text-muted">
                  {a.city} {a.pin}
                </p>
                <div className="mt-5 flex gap-4">
                  <button onClick={() => setEditing(a)} className="btn-ghost">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => setList((l) => l.filter((x) => x.id !== a.id))} className="btn-ghost hover:text-red-300">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setErrors({});
                setEditing({ id: `a${Date.now()}`, label: '', name: '', line: '', city: '', pin: '' });
              }}
              className="flex min-h-[180px] flex-col items-center justify-center gap-3 border border-dashed border-gold/40 text-gold transition hover:bg-gold/5"
            >
              <Plus /> Add address
            </button>
          </div>

          {editing && (
            <form onSubmit={save} noValidate className="card-lux mt-8 grid gap-5 p-6 sm:grid-cols-2">
              <h2 className="text-2xl sm:col-span-2">{list.some((a) => a.id === editing.id) ? 'Edit address' : 'New address'}</h2>
              <FormField label="Label (e.g. Home)" value={editing.label} onChange={upd('label')} error={errors.label} />
              <FormField label="Full name" value={editing.name} onChange={upd('name')} error={errors.name} />
              <FormField className="sm:col-span-2" label="Street address" value={editing.line} onChange={upd('line')} error={errors.line} />
              <FormField label="City" value={editing.city} onChange={upd('city')} error={errors.city} />
              <FormField label="PIN code" inputMode="numeric" maxLength={6} value={editing.pin} onChange={upd('pin')} error={errors.pin} />
              <div className="flex gap-3 sm:col-span-2">
                <button className="btn-gold">Save address</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

/* ---------------- Track order ---------------- */
const STAGES = ['Order confirmed', 'Prepared & packed', 'Shipped', 'Out for delivery', 'Delivered'];

export function TrackOrder() {
  usePageMeta('Track Order', 'Track your order (sample data).');
  const initial = new URLSearchParams(window.location.search).get('id') ?? '';
  const [id, setId] = useState(initial);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string; stage: number } | null>(null);

  const lookup = (value: string) => {
    const v = value.trim().toUpperCase();
    if (!/^DEMO-\d{6}$/.test(v)) {
      setError('Enter a sample reference in the format DEMO-123456.');
      setResult(null);
      return;
    }
    setError('');
    const known = sampleOrders.find((o) => o.id === v);
    setResult({ id: v, stage: known ? (known.status === 'Delivered' ? 4 : 2) : Number(v.slice(-1)) % 5 });
  };

  useEffect(() => {
    if (initial) lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHero eyebrow="Client Care" title="Track your order" text="Enter your order reference to follow its journey." crumbs={[{ label: 'Track Order' }]} />
      <section className="container-lux py-14">
        <div className="mx-auto max-w-2xl">
          <DemoNotice className="mb-8">Order tracking shows sample data only — it is not connected to any courier. Try DEMO-103977.</DemoNotice>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookup(id);
            }}
            className="flex gap-2"
            noValidate
          >
            <label htmlFor="trk" className="sr-only">
              Order reference
            </label>
            <input id="trk" value={id} onChange={(e) => setId(e.target.value)} placeholder="DEMO-123456" className="input-lux uppercase" aria-invalid={!!error} />
            <button className="btn-gold px-6">
              <Search size={14} /> Track
            </button>
          </form>
          {error && (
            <p className="mt-2 text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          {result && (
            <div className="card-lux mt-10 p-6 sm:p-8" role="status">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-serif text-3xl">{result.id}</p>
                <span className="demo-badge">Sample tracking</span>
              </div>
              <p className="mt-1 text-sm text-muted">Carrier: Sample Courier · Tracking ref: SC{result.id.slice(-6)}</p>
              <ol className="mt-8 space-y-0">
                {STAGES.map((s, i) => {
                  const done = i <= result.stage;
                  return (
                    <li key={s} className="relative flex gap-5 pb-8 last:pb-0">
                      {i < STAGES.length - 1 && <span className={`absolute left-[11px] top-6 h-full w-px ${i < result.stage ? 'bg-gold' : 'bg-line/10'}`} />}
                      <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${done ? 'border-gold bg-gold text-ongold' : 'border-line/20 bg-obsidian'}`}>
                        {done && <Check size={12} />}
                      </span>
                      <span>
                        <span className={`block ${done ? 'text-ivory' : 'text-muted'}`}>{s}</span>
                        <span className="block text-xs text-muted">{done ? (i === result.stage ? 'Current status · sample timestamp' : 'Completed · sample timestamp') : 'Pending'}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
