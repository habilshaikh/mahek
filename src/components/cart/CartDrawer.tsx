import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, site } from '../../config/site';
import { useShop } from '../../store/ShopContext';
import { useOverlay } from '../ui/Modal';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, subtotal, cartCount } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setCartOpen(false);
  useOverlay(cartOpen, close, ref);
  const remaining = site.shipping.freeThreshold - subtotal;

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div className="fixed inset-0 z-[85]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} aria-hidden />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-gold/20 bg-charcoal"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line/10 px-6 py-5">
              <p className="font-serif text-2xl">
                Your Bag <span className="text-base text-muted">({cartCount})</span>
              </p>
              <button onClick={close} aria-label="Close bag" className="p-2 hover:text-gold">
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30">
                  <ShoppingBag size={28} strokeWidth={1} className="text-gold" />
                </span>
                <p className="mt-6 font-serif text-3xl">Your bag is empty</p>
                <p className="mt-2 text-sm text-muted">Discover a fragrance that tells your story.</p>
                <Link to="/shop" onClick={close} className="btn-gold mt-8">
                  Explore the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="px-6 pt-4">
                  <p className="text-xs text-muted">
                    {remaining > 0 ? (
                      <>
                        Add <span className="text-gold">{formatPrice(remaining)}</span> more for complimentary shipping
                      </>
                    ) : (
                      <span className="text-gold">You qualify for complimentary standard shipping</span>
                    )}
                  </p>
                  <div className="mt-2 h-0.5 bg-line/10">
                    <div className="h-full bg-gradient-to-r from-gold to-gold-light transition-all" style={{ width: `${Math.min(100, (subtotal / site.shipping.freeThreshold) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex-1 divide-y divide-line/10 overflow-y-auto px-6">
                  {cart.map((l) => (
                    <CartItem key={l.key} line={l} compact onNavigate={close} />
                  ))}
                </div>
                <div className="space-y-3 border-t border-line/10 p-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted">Shipping and promo codes are calculated in your bag.</p>
                  <Link to="/checkout" onClick={close} className="btn-gold w-full">
                    Proceed to checkout
                  </Link>
                  <Link to="/cart" onClick={close} className="btn-outline w-full">
                    View bag
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
