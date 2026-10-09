import { Heart } from 'lucide-react';
import type { Product } from '../../data/types';
import { useShop } from '../../store/ShopContext';

export default function WishlistButton({ product, className = '', withLabel = false }: { product: Product; className?: string; withLabel?: boolean }) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(product.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`inline-flex items-center justify-center gap-2 transition ${withLabel ? 'btn-outline' : 'h-10 w-10 rounded-full border border-white/20 bg-black/45 backdrop-blur hover:border-gold'} ${className}`}
    >
      <Heart size={withLabel ? 15 : 16} strokeWidth={1.4} className={active ? 'fill-[#D4AF37] text-[#D4AF37]' : withLabel ? 'text-ivory' : 'text-[#F5F0E6]'} />
      {withLabel && (active ? 'Saved' : 'Wishlist')}
    </button>
  );
}
