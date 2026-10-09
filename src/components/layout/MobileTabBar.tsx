import { Heart, Home, ShoppingBag, Sparkles, Store } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useShop } from '../../store/ShopContext';

/** App-style bottom navigation for phones and small tablets. */
export default function MobileTabBar() {
  const { cartCount, wishlist, setCartOpen, cartOpen } = useShop();
  const item = 'relative flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-1.5 text-[0.58rem] uppercase tracking-[0.14em] transition';
  const tabs = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/shop', label: 'Shop', icon: Store },
    { to: '/fragrance-finder', label: 'Finder', icon: Sparkles },
    { to: '/wishlist', label: 'Saved', icon: Heart, count: wishlist.length },
  ];
  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gold/20 bg-charcoal/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-lg">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `${item} ${isActive ? 'text-gold' : 'text-ivory/70'}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />}
                <span className="relative">
                  <t.icon size={20} strokeWidth={isActive ? 1.8 : 1.4} />
                  {!!t.count && <Badge n={t.count} />}
                </span>
                {t.label}
              </>
            )}
          </NavLink>
        ))}
        <button onClick={() => setCartOpen(true)} className={`${item} ${cartOpen ? 'text-gold' : 'text-ivory/70'}`} aria-label={`Shopping bag, ${cartCount} items`}>
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={1.4} />
            {cartCount > 0 && <Badge n={cartCount} />}
          </span>
          Bag
        </button>
      </div>
    </nav>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.55rem] font-semibold tracking-normal text-ongold" aria-hidden>
      {n}
    </span>
  );
}
