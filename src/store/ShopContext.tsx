import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getProduct } from '../data/products';
import type { Product, ProductSize } from '../data/types';
import { site } from '../config/site';

export interface CartLine {
  key: string;
  productId: string;
  ml: number;
  qty: number;
}

export interface CartDetail extends CartLine {
  product: Product;
  size: ProductSize;
  lineTotal: number;
}

export interface Toast {
  id: number;
  message: string;
  tone: 'success' | 'error' | 'info';
}

export interface PromoCode {
  code: string;
  label: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minSubtotal?: number;
}

// SAMPLE promo codes for the demo.
export const promoCodes: PromoCode[] = [
  { code: 'MAHEK10', label: '10% off your order', type: 'percent', value: 10 },
  { code: 'HERITAGE82', label: '₹820 off orders over ₹6,000', type: 'fixed', value: 820, minSubtotal: 6000 },
  { code: 'FREESHIP', label: 'Complimentary shipping', type: 'shipping', value: 0 },
];

const MAX_QTY = 10;

const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
  },
};

interface ShopState {
  cart: CartDetail[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promo: PromoCode | null;
  shippingMethod: 'standard' | 'express';
  setShippingMethod: (m: 'standard' | 'express') => void;
  addToCart: (product: Product, ml?: number, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  wishlist: Product[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  toasts: Toast[];
  notify: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => storage.get('mahek.cart', []));
  const [wishIds, setWishIds] = useState<string[]>(() => storage.get('mahek.wishlist', []));
  const [promoCode, setPromoCode] = useState<string | null>(() => storage.get('mahek.promo', null));
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const toastId = useRef(0);

  useEffect(() => storage.set('mahek.cart', lines), [lines]);
  useEffect(() => storage.set('mahek.wishlist', wishIds), [wishIds]);
  useEffect(() => storage.set('mahek.promo', promoCode), [promoCode]);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = ++toastId.current;
      setToasts((t) => [...t.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  // Resolve lines against the shared catalogue; silently drop unknown products.
  const cart = useMemo<CartDetail[]>(
    () =>
      lines.flatMap((l) => {
        const product = getProduct(l.productId);
        const size = product?.sizes.find((s) => s.ml === l.ml) ?? product?.sizes[0];
        if (!product || !size) return [];
        return [{ ...l, product, size, lineTotal: size.price * l.qty }];
      }),
    [lines],
  );

  const subtotal = cart.reduce((s, l) => s + l.lineTotal, 0);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const promo = promoCodes.find((p) => p.code === promoCode) ?? null;
  const promoValid = promo && (!promo.minSubtotal || subtotal >= promo.minSubtotal);
  const discount = promoValid
    ? promo.type === 'percent'
      ? Math.round((subtotal * promo.value) / 100)
      : promo.type === 'fixed'
        ? Math.min(promo.value, subtotal)
        : 0
    : 0;
  const freeShip = (promoValid && promo?.type === 'shipping') || subtotal - discount >= site.shipping.freeThreshold;
  const shipping =
    cart.length === 0 ? 0 : shippingMethod === 'express' ? site.shipping.express : freeShip ? 0 : site.shipping.standard;
  const total = Math.max(0, subtotal - discount + shipping);

  const addToCart = useCallback(
    (product: Product, ml?: number, qty = 1) => {
      if (!product.inStock) {
        notify(`${product.name} is currently out of stock`, 'error');
        return;
      }
      const size = product.sizes.find((s) => s.ml === ml) ?? product.sizes[0];
      const key = `${product.id}-${size.ml}`;
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
        return [...prev, { key, productId: product.id, ml: size.ml, qty: Math.min(MAX_QTY, qty) }];
      });
      notify(`${product.name} (${size.label}) added to your bag`);
    },
    [notify],
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const removeFromCart = useCallback(
    (key: string) => {
      setLines((prev) => prev.filter((l) => l.key !== key));
      notify('Item removed from your bag', 'info');
    },
    [notify],
  );

  const clearCart = useCallback(() => {
    setLines([]);
    setPromoCode(null);
  }, []);

  const applyPromo = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      const found = promoCodes.find((p) => p.code === code);
      if (!code) return { ok: false, message: 'Please enter a promo code.' };
      if (!found) return { ok: false, message: 'That code is not recognised. Try one of the sample codes below.' };
      if (found.minSubtotal && subtotal < found.minSubtotal)
        return { ok: false, message: `This code requires a subtotal of at least ₹${found.minSubtotal.toLocaleString('en-IN')}.` };
      setPromoCode(found.code);
      return { ok: true, message: `${found.code} applied — ${found.label}.` };
    },
    [subtotal],
  );

  const wishlist = useMemo(() => wishIds.map((id) => getProduct(id)).filter(Boolean) as Product[], [wishIds]);
  const isWishlisted = useCallback((id: string) => wishIds.includes(id), [wishIds]);
  const toggleWishlist = useCallback(
    (product: Product) => {
      const has = wishIds.includes(product.id);
      setWishIds((prev) => (has ? prev.filter((x) => x !== product.id) : [...prev, product.id]));
      notify(has ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`, has ? 'info' : 'success');
    },
    [notify, wishIds],
  );

  const value: ShopState = {
    cart,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    promo: promoValid ? promo : null,
    shippingMethod,
    setShippingMethod,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    applyPromo,
    removePromo: () => setPromoCode(null),
    wishlist,
    isWishlisted,
    toggleWishlist,
    toasts,
    notify,
    dismissToast,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    quickView,
    setQuickView,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
