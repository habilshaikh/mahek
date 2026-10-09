export type Family = 'Woody' | 'Oud' | 'Floral' | 'Citrus' | 'Amber' | 'Fresh' | 'Musk' | 'Oriental';
export type Gender = 'men' | 'women' | 'unisex';
export type Intensity = 'light' | 'moderate' | 'intense';
export type Occasion = 'everyday' | 'office' | 'evening' | 'special';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type CollectionTag = 'oud' | 'bestseller' | 'new' | 'gift';

export type BottleShape = 'classic' | 'tall' | 'round' | 'faceted' | 'flacon' | 'square';
export type CapStyle = 'gold' | 'black' | 'orb' | 'crystal' | 'tower';

export interface BottleStyle {
  shape: BottleShape;
  cap: CapStyle;
  /** Liquid colour (hex) */
  liquid: string;
  /** Tint applied to glass edges */
  glass?: string;
  /** Label colour scheme */
  label?: 'dark' | 'ivory' | 'gold';
}

export interface ProductSize {
  label: string;
  ml: number;
  price: number;
  compareAt?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  gender: Gender;
  families: Family[];
  tags: CollectionTag[];
  notes: { top: string[]; heart: string[]; base: string[] };
  description: string;
  sizes: ProductSize[];
  intensity: Intensity;
  occasions: Occasion[];
  seasons: Season[];
  inStock: boolean;
  /** Illustrative sample values (1–5) */
  longevity: number;
  projection: number;
  rating: number;
  reviewCount: number;
  bottle: BottleStyle;
  isSet?: boolean;
  setContents?: string[];
  addedOrder: number;
}
