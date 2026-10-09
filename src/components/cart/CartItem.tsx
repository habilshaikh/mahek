import { ProductThumb } from '../product/ProductCard';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../config/site';
import { useShop, type CartDetail } from '../../store/ShopContext';

export default function CartItem({ line, compact = false, onNavigate }: { line: CartDetail; compact?: boolean; onNavigate?: () => void }) {
  const { updateQty, removeFromCart } = useShop();
  const { product, size, qty } = line;
  return (
    <div className="flex gap-4 py-5">
      <Link
        to={`/product/${product.slug}`}
        onClick={onNavigate}
        className={`flex shrink-0 items-center justify-center border border-line/[0.07] bg-[radial-gradient(ellipse_at_center,#30271a,#1e1812)] ${compact ? 'h-24 w-20' : 'h-32 w-28'}`}
        aria-label={`View ${product.name}`}
      >
        <ProductThumb product={product} />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div>
            <Link to={`/product/${product.slug}`} onClick={onNavigate} className={`font-serif leading-tight hover:text-gold ${compact ? 'text-lg' : 'text-2xl'}`}>
              {product.name}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
              {size.label} · {product.families[0]}
            </p>
            {!compact && <p className="mt-1 text-xs text-muted">{formatPrice(size.price)} each</p>}
          </div>
          <p className="text-sm text-ivory">{formatPrice(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line/15" role="group" aria-label={`Quantity for ${product.name}`}>
            <button className="p-2 hover:text-gold" onClick={() => updateQty(line.key, qty - 1)} aria-label="Decrease quantity">
              <Minus size={13} />
            </button>
            <span className="w-7 text-center text-sm" aria-live="polite">
              {qty}
            </span>
            <button className="p-2 hover:text-gold disabled:opacity-30" disabled={qty >= 10} onClick={() => updateQty(line.key, qty + 1)} aria-label="Increase quantity">
              <Plus size={13} />
            </button>
          </div>
          <button onClick={() => removeFromCart(line.key)} className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted hover:text-red-300" aria-label={`Remove ${product.name}`}>
            <Trash2 size={13} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
