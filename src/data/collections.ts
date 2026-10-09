import { products } from './products';
import type { BottleStyle, Family, Product } from './types';

export interface CollectionDef {
  slug: string;
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  /** Accent colour for the banner glow */
  accent: string;
  /** Secondary glow colour */
  accent2: string;
  heroBottles: BottleStyle[];
  /** Product slugs matching heroBottles (used for labels in rendered banners) */
  heroSlugs: string[];
  filter: (p: Product) => boolean;
  sort?: (a: Product, b: Product) => number;
  pattern: 'arches' | 'rays' | 'lattice' | 'waves' | 'stars' | 'ribbon' | 'petals';
}

const bottleOf = (slug: string) => products.find((p) => p.slug === slug)!.bottle;

export const collections: CollectionDef[] = [
  {
    slug: 'men',
    title: "Men's Collection",
    eyebrow: 'Pour Homme',
    headline: 'Confidence, distilled.',
    description:
      'Tailored woods, smoky leather, crisp citrus and deep oud — compositions crafted for the modern gentleman, from the boardroom to the late evening.',
    accent: '#6b3a1a',
    accent2: '#D4AF37',
    heroBottles: [bottleOf('desert-cedar'), bottleOf('black-oud-intense'), bottleOf('imperial-leather')],
    heroSlugs: ['desert-cedar', 'black-oud-intense', 'imperial-leather'],
    filter: (p) => p.gender === 'men',
    pattern: 'lattice',
  },
  {
    slug: 'women',
    title: "Women's Collection",
    eyebrow: 'Pour Femme',
    headline: 'Grace in every petal.',
    description:
      'Luminous florals, powdery musks and indulgent ambers — a wardrobe of scents for every mood, moment and memory.',
    accent: '#8a2c4c',
    accent2: '#F9E076',
    heroBottles: [bottleOf('peony-blush'), bottleOf('rose-mahal'), bottleOf('white-musk-silk')],
    heroSlugs: ['peony-blush', 'rose-mahal', 'white-musk-silk'],
    filter: (p) => p.gender === 'women',
    pattern: 'petals',
  },
  {
    slug: 'unisex',
    title: 'Unisex Collection',
    eyebrow: 'For Everyone',
    headline: 'Scent without borders.',
    description:
      'Fragrances that belong to whoever wears them. Balanced, characterful blends that move effortlessly between skin, season and style.',
    accent: '#3d4a52',
    accent2: '#D4AF37',
    heroBottles: [bottleOf('citrus-riviera'), bottleOf('sandalwood-heritage'), bottleOf('musk-al-layl')],
    heroSlugs: ['citrus-riviera', 'sandalwood-heritage', 'musk-al-layl'],
    filter: (p) => p.gender === 'unisex',
    pattern: 'waves',
  },
  {
    slug: 'oud',
    title: 'Oud & Luxury',
    eyebrow: 'The Treasury',
    headline: 'Liquid gold of the East.',
    description:
      'Our most precious compositions. Rare agarwood, saffron, ambergris and incense — rich, enduring perfumes for those who seek the extraordinary.',
    accent: '#5a2a0c',
    accent2: '#F9E076',
    heroBottles: [bottleOf('royal-oud-noir'), bottleOf('saffron-crown'), bottleOf('black-oud-intense')],
    heroSlugs: ['royal-oud-noir', 'saffron-crown', 'black-oud-intense'],
    filter: (p) => p.tags.includes('oud'),
    sort: (a, b) => Math.max(...b.sizes.map((s) => s.price)) - Math.max(...a.sizes.map((s) => s.price)),
    pattern: 'arches',
  },
  {
    slug: 'bestsellers',
    title: 'Bestsellers',
    eyebrow: 'Most Loved',
    headline: 'The signatures of our house.',
    description:
      'The fragrances our customers return to again and again. A curated selection of house favourites — the perfect place to begin.',
    accent: '#7a5a14',
    accent2: '#F9E076',
    heroBottles: [bottleOf('amber-sultan'), bottleOf('royal-oud-noir'), bottleOf('jasmine-nights')],
    heroSlugs: ['amber-sultan', 'royal-oud-noir', 'jasmine-nights'],
    filter: (p) => p.tags.includes('bestseller'),
    sort: (a, b) => b.reviewCount - a.reviewCount,
    pattern: 'stars',
  },
  {
    slug: 'new-arrivals',
    title: 'New Arrivals',
    eyebrow: 'Just Released',
    headline: 'The newest chapter.',
    description:
      'Fresh compositions from our perfumers — new interpretations of the materials and memories that have shaped our house since 1982.',
    accent: '#2f4a3a',
    accent2: '#D4AF37',
    heroBottles: [bottleOf('neroli-garden'), bottleOf('golden-incense'), bottleOf('green-vetiver')],
    heroSlugs: ['neroli-garden', 'golden-incense', 'green-vetiver'],
    filter: (p) => p.tags.includes('new'),
    sort: (a, b) => b.addedOrder - a.addedOrder,
    pattern: 'rays',
  },
  {
    slug: 'gifts',
    title: 'Luxury Gifts',
    eyebrow: 'The Art of Gifting',
    headline: 'Give a memory.',
    description:
      'Beautifully presented gift sets and discovery boxes, wrapped in black and gold — thoughtful gestures for celebrations, festivals and milestones.',
    accent: '#5c1a1a',
    accent2: '#F9E076',
    heroBottles: [bottleOf('her-signature-set'), bottleOf('oud-royale-gift-box'), bottleOf('his-signature-set')],
    heroSlugs: ['her-signature-set', 'oud-royale-gift-box', 'his-signature-set'],
    filter: (p) => p.tags.includes('gift'),
    pattern: 'ribbon',
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

export interface FamilyInfo {
  family: Family;
  description: string;
  notes: string[];
  color: string;
  mood: string;
}

export const familyInfo: FamilyInfo[] = [
  { family: 'Woody', color: '#8a6a3b', mood: 'Grounded · Warm · Elegant', description: 'Dry, warm and refined — woods bring structure and quiet sophistication.', notes: ['Sandalwood', 'Cedar', 'Vetiver', 'Guaiac Wood', 'Cypress'] },
  { family: 'Oud', color: '#4a230f', mood: 'Rich · Smoky · Regal', description: 'The legendary resin of agarwood — deep, complex and long-lasting.', notes: ['Agarwood', 'Cambodian Oud', 'Hindi Oud', 'Saffron', 'Incense'] },
  { family: 'Floral', color: '#c2416b', mood: 'Romantic · Radiant · Soft', description: 'Bouquets of petals, from dewy rose to heady white flowers.', notes: ['Taif Rose', 'Jasmine', 'Peony', 'Tuberose', 'Iris'] },
  { family: 'Citrus', color: '#e8c547', mood: 'Bright · Zesty · Uplifting', description: 'Sparkling peels and blossoms that energise and refresh.', notes: ['Bergamot', 'Lemon', 'Grapefruit', 'Neroli', 'Mandarin'] },
  { family: 'Amber', color: '#c07a2a', mood: 'Glowing · Sweet · Enveloping', description: 'Golden resins and balsams — cosy, sensual warmth.', notes: ['Labdanum', 'Benzoin', 'Vanilla', 'Tonka', 'Ambergris'] },
  { family: 'Fresh', color: '#4f8fb3', mood: 'Clean · Airy · Effortless', description: 'Marine breezes, green leaves and aromatic herbs.', notes: ['Sea Notes', 'Lavender', 'Mint', 'Green Tea', 'Fig Leaf'] },
  { family: 'Musk', color: '#d9cbb6', mood: 'Intimate · Soft · Skin-like', description: 'Velvety musks that feel like a second skin.', notes: ['White Musk', 'Ambrette', 'Cashmeran', 'Black Musk', 'Suede'] },
  { family: 'Oriental', color: '#7a2c3a', mood: 'Spiced · Opulent · Mysterious', description: 'Spices, resins and incense from ancient trade routes.', notes: ['Saffron', 'Cardamom', 'Frankincense', 'Myrrh', 'Clove'] },
];
