import credits from './photo-credits.json';
import type { Family } from './types';

/**
 * Image registry.
 *
 * Product imagery (/images/products/<slug>/…) consists of ILLUSTRATIVE RENDERS of
 * sample products, generated from the same bottle model used by the interactive
 * viewer (`npm run render:images`). Replace them with real product photography
 * by dropping files with the same names into each folder.
 *
 * Atmosphere photography (/images/photos/…) is openly licensed stock — see
 * photo-credits.json and the /image-credits page. It never depicts Mahek's own
 * products, boutiques or history.
 */

export type PhotoKey =
  | 'smoke-gold' | 'smoke-blue' | 'smoke-drift' | 'smoke-black'
  | 'candles-glow' | 'candles-close' | 'candles-row'
  | 'rose-crimson' | 'rose-red' | 'jasmine-white' | 'jasmine-bloom'
  | 'lavender-close' | 'lavender-field' | 'citrus-orange'
  | 'amber-resin' | 'amber-jewel' | 'wood-resin' | 'petal-dew'
  | 'spices-dark' | 'spices-bowls' | 'gift-black' | 'gift-gold';

export const photo = (key: PhotoKey) => `/images/photos/${key}.webp`;

export interface PhotoCredit {
  file: string;
  title: string;
  creator: string;
  creatorUrl?: string | null;
  license: string;
  licenseUrl?: string | null;
  sourceUrl?: string | null;
  width: number;
  height: number;
}
export const photoCredits = credits as PhotoCredit[];
export const photoSize = (key: PhotoKey) => {
  const c = photoCredits.find((x) => x.file === photo(key));
  return c ? { width: c.width, height: c.height } : { width: 1024, height: 683 };
};

export const familyPhoto: Record<Family, { key: PhotoKey; alt: string }> = {
  Woody: { key: 'wood-resin', alt: 'Close-up of resin on warm, textured wood' },
  Oud: { key: 'smoke-gold', alt: 'Golden and rose-coloured incense smoke on a black background' },
  Floral: { key: 'rose-crimson', alt: 'Close-up of velvety crimson rose petals' },
  Citrus: { key: 'citrus-orange', alt: 'Fresh orange segments on a dark plate' },
  Amber: { key: 'amber-resin', alt: 'Glowing golden amber resin' },
  Fresh: { key: 'lavender-close', alt: 'Lavender flowers in soft natural light' },
  Musk: { key: 'petal-dew', alt: 'A pale petal with dew drops on a dark background' },
  Oriental: { key: 'spices-dark', alt: 'Star anise, cardamom and cinnamon on rich fabric' },
};

export const collectionPhoto: Record<string, PhotoKey> = {
  men: 'smoke-drift',
  women: 'rose-crimson',
  unisex: 'lavender-close',
  oud: 'smoke-gold',
  bestsellers: 'candles-glow',
  'new-arrivals': 'jasmine-white',
  gifts: 'gift-black',
};

export const articlePhoto: Record<string, { key: PhotoKey; alt: string }> = {
  'how-to-choose-your-signature-scent': { key: 'candles-close', alt: 'Candlelight glowing in glass holders' },
  'understanding-oud': { key: 'smoke-blue', alt: 'Wisps of incense smoke against black' },
  'the-art-of-fragrance-gifting': { key: 'gift-black', alt: 'Black gift box tied with a gold satin ribbon' },
  'top-heart-base-notes-explained': { key: 'citrus-orange', alt: 'Orange segments — a classic top note' },
  'how-to-make-perfume-last-longer': { key: 'petal-dew', alt: 'Dew drops resting on a soft petal' },
  'fragrances-for-every-season': { key: 'lavender-field', alt: 'Lavender field at sunrise' },
};

export type ProductView = 'main' | 'front' | 'side' | 'detail' | 'packaging' | 'lifestyle';
export const PRODUCT_VIEWS: { id: ProductView; label: string }[] = [
  { id: 'main', label: 'Three-quarter' },
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Profile' },
  { id: 'detail', label: 'Cap & label detail' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'lifestyle', label: 'Campaign' },
];

const base = (slug: string) => `/images/products/${slug}`;
export const productImage = (slug: string, view: ProductView | 'card' | 'thumb' | 'cutout' = 'main') => `${base(slug)}/${view}.webp`;

/** srcset for the main product shot (card 600w, full 1200w) */
export const productSrcSet = (slug: string) => `${productImage(slug, 'card')} 600w, ${productImage(slug, 'main')} 1200w`;

export const HERO_TURN_FRAMES = 36;
export const heroTurnFrame = (i: number) => `/images/hero/turn-${String(i).padStart(2, '0')}.webp`;

export const campaign = {
  heroBg: '/images/hero/hero-bg.webp',
  heroBgMobile: '/images/hero/hero-bg-mobile.webp',
  oud: '/images/campaign/oud-campaign.webp',
  heritage: '/images/campaign/heritage.webp',
  finder: '/images/campaign/finder.webp',
  newsletter: '/images/campaign/newsletter.webp',
};
export const collectionBanner = (slug: string) => `/images/collections/${slug}.webp`;
