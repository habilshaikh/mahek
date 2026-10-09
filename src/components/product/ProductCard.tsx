import { Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../config/site';
import { minPrice } from '../../data/products';
import type { Product } from '../../data/types';
import { useShop } from '../../store/ShopContext';
import { Stars } from '../ui/primitives';
import WishlistButton from '../wishlist/WishlistButton';
import BottleArt from './BottleArt';
import SmartImage from '../ui/SmartImage';
import { productImage, productSrcSet } from '../../data/images';

export function ProductBadges({ product }: { product: Product }) {
  const sale = product.sizes.some((s) => s.compareAt);
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.tags.includes('new') && <span className="bg-ivory px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-obsidian">New</span>}
      {product.tags.includes('bestseller') && <span className="bg-gold px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-ongold">Bestseller</span>}
      {sale && <span className="border border-gold px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-gold">Offer</span>}
      {!product.inStock && <span className="bg-line/10 px-2 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-muted">Sold out</span>}
    </div>
  );
}

export function PriceTag({ product, className = '' }: { product: Product; className?: string }) {
  const sale = product.sizes.find((s) => s.compareAt);
  const multi = product.sizes.length > 1;
  return (
    <p className={`text-sm text-ivory ${className}`}>
      {multi && <span className="text-muted">From </span>}
      {formatPrice(minPrice(product))}
      {sale && !multi && <span className="ml-2 text-muted line-through">{formatPrice(sale.compareAt!)}</span>}
    </p>
  );
}

export function ProductStage({ product, className = '', eager = false, hoverSwap = true }: { product: Product; className?: string; eager?: boolean; hoverSwap?: boolean }) {
  const fallback = (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#33291b_0%,#211a13_55%,#1a1510_100%)]">
      <BottleArt bottle={product.bottle} name={product.name} className="h-full w-auto py-6" title={`${product.name} bottle`} />
    </div>
  );
  return (
    <div className={`relative overflow-hidden bg-charcoal ${className}`}>
      <SmartImage
        src={productImage(product.slug, 'main')}
        srcSet={productSrcSet(product.slug)}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        width={1200}
        height={1500}
        eager={eager}
        alt={`${product.name} — illustrative product render`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        fallback={fallback}
      />
      {hoverSwap && (
        <SmartImage
          src={productImage(product.slug, 'lifestyle')}
          width={1200}
          height={1500}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover !opacity-0 transition-opacity duration-700 group-hover:!opacity-100"
        />
      )}
    </div>
  );
}

/** Small square-ish thumbnail used in bag, search, wishlist and order lists */
export function ProductThumb({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <SmartImage
      src={productImage(product.slug, 'thumb')}
      width={240}
      height={300}
      alt={`${product.name} thumbnail`}
      className={`h-full w-full object-cover ${className}`}
      fallback={<BottleArt bottle={product.bottle} name={product.name} shadow={false} className="mx-auto h-full w-auto py-1" />}
    />
  );
}

export default function ProductCard({ product, layout = 'grid' }: { product: Product; layout?: 'grid' | 'list' }) {
  const { addToCart, setQuickView } = useShop();
  const href = `/product/${product.slug}`;

  if (layout === 'list') {
    return (
      <article className="group card-lux flex flex-col gap-6 p-4 sm:flex-row sm:items-center sm:p-5">
        <Link to={href} className="block shrink-0 sm:w-48" aria-label={`View ${product.name}`}>
          <ProductStage product={product} className="aspect-square" />
        </Link>
        <div className="flex-1">
          <ProductBadges product={product} />
          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.22em] text-gold">{product.families.slice(0, 2).join(' · ')}</p>
          <h3 className="mt-1 text-2xl">
            <Link to={href} className="hover:text-gold">
              {product.name}
            </Link>
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{product.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted">
            <Stars rating={product.rating} size={12} /> {product.rating.toFixed(1)} · {product.reviewCount} sample reviews
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 sm:w-44 sm:flex-col sm:items-end">
          <PriceTag product={product} className="text-lg" />
          <div className="flex gap-2">
            <WishlistButton product={product} />
            <button onClick={() => setQuickView(product)} className="h-10 w-10 rounded-full border border-line/10 text-ivory transition hover:border-gold hover:text-gold" aria-label={`Quick view ${product.name}`}>
              <Eye size={16} strokeWidth={1.4} className="mx-auto" />
            </button>
          </div>
          <button onClick={() => addToCart(product)} disabled={!product.inStock} className="btn-gold w-full px-4 py-3">
            {product.inStock ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <Link to={href} className="block" aria-label={`View ${product.name}`}>
          <ProductStage product={product} className="aspect-[4/5] border border-line/[0.06] transition-colors duration-500 group-hover:border-gold/30" />
        </Link>
        <div className="pointer-events-none absolute left-2.5 top-2.5 max-w-[70%] sm:left-3 sm:top-3">
          <ProductBadges product={product} />
        </div>
        <WishlistButton product={product} className="absolute right-2.5 top-2.5 !h-9 !w-9 sm:right-3 sm:top-3 sm:!h-10 sm:!w-10" />
        <div className="absolute bottom-2.5 right-2.5 flex justify-end gap-2 opacity-100 transition-all duration-500 sm:inset-x-3 sm:bottom-3 sm:right-auto sm:translate-y-3 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button onClick={() => setQuickView(product)} className="hidden flex-1 items-center justify-center gap-2 border border-line/15 bg-black/70 py-2.5 sm:flex text-[0.62rem] uppercase tracking-[0.2em] text-[#F5F0E6] backdrop-blur transition hover:border-gold hover:text-gold">
            <Eye size={14} strokeWidth={1.4} /> Quick view
          </button>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ongold shadow-lg shadow-black/40 transition hover:bg-gold-light sm:h-10 sm:w-11 sm:rounded-none disabled:cursor-not-allowed disabled:bg-line/20 disabled:text-muted"
            aria-label={product.inStock ? `Add ${product.name} to bag` : `${product.name} is sold out`}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold/90">{product.families.slice(0, 2).join(' · ')}</p>
        <h3 className="mt-1.5 text-xl leading-snug">
          <Link to={href} className="transition hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <PriceTag product={product} />
          <span className="flex items-center gap-1 text-xs text-muted">
            <Stars rating={product.rating} size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, layout = 'grid', cols = 4 }: { products: Product[]; layout?: 'grid' | 'list'; cols?: 3 | 4 }) {
  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} layout="list" />
        ))}
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 ${cols === 4 ? 'lg:grid-cols-4' : ''}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
