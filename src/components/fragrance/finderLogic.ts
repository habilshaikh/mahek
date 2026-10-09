import { products } from '../../data/products';
import type { Family, Intensity, Occasion, Product, Season } from '../../data/types';

export interface Answers {
  family?: Family | 'any';
  occasion?: Occasion;
  intensity?: Intensity;
  season?: Season;
  budget?: 'under3' | '3to5' | '5to8' | 'over8';
  notes: string[];
}

export const BUDGETS: Record<NonNullable<Answers['budget']>, { label: string; min: number; max: number }> = {
  under3: { label: 'Under ₹3,000', min: 0, max: 3000 },
  '3to5': { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
  '5to8': { label: '₹5,000 – ₹8,000', min: 5000, max: 8000 },
  over8: { label: '₹8,000 and above', min: 8000, max: Infinity },
};

export const NOTE_OPTIONS = ['Rose', 'Oud', 'Vanilla', 'Bergamot', 'Sandalwood', 'Jasmine', 'Musk', 'Saffron', 'Leather', 'Sea Notes', 'Iris', 'Incense', 'Amber', 'Cedar'];

const INTENSITY_ORDER: Intensity[] = ['light', 'moderate', 'intense'];

export interface Recommendation {
  product: Product;
  match: number;
  reasons: string[];
}

/** Transparent, rule-based scoring against the shared sample catalogue. */
export function recommend(a: Answers, count = 3): Recommendation[] {
  const scored = products.map((p) => {
    let score = 0;
    let max = 0;
    const reasons: string[] = [];

    if (a.family && a.family !== 'any') {
      max += 6;
      if (p.families[0] === a.family) {
        score += 6;
        reasons.push(`${a.family} signature`);
      } else if (p.families.includes(a.family)) {
        score += 4;
        reasons.push(`${a.family} accents`);
      }
    }
    if (a.occasion) {
      max += 3;
      if (p.occasions.includes(a.occasion)) {
        score += 3;
        reasons.push(`Suits ${a.occasion === 'special' ? 'special occasions' : a.occasion === 'everyday' ? 'everyday wear' : `the ${a.occasion}`}`);
      }
    }
    if (a.intensity) {
      max += 3;
      const d = Math.abs(INTENSITY_ORDER.indexOf(p.intensity) - INTENSITY_ORDER.indexOf(a.intensity));
      if (d === 0) {
        score += 3;
        reasons.push(`${p.intensity[0].toUpperCase()}${p.intensity.slice(1)} intensity`);
      } else if (d === 1) score += 1;
    }
    if (a.season) {
      max += 2;
      if (p.seasons.includes(a.season)) {
        score += 2;
        reasons.push(`Made for ${a.season}`);
      }
    }
    if (a.budget) {
      max += 3;
      const b = BUDGETS[a.budget];
      if (p.sizes.some((s) => s.price >= b.min && s.price <= b.max)) {
        score += 3;
        reasons.push('Within budget');
      } else score -= 3;
    }
    if (a.notes.length) {
      max += a.notes.length * 2.5;
      const all = [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ').toLowerCase();
      const famText = p.families.join(' ').toLowerCase();
      const hits = a.notes.filter((n) => all.includes(n.toLowerCase()) || famText.includes(n.toLowerCase()) || (n === 'Rose' && all.includes('rose')));
      score += hits.length * 2.5;
      if (hits.length) reasons.push(`Features ${hits.slice(0, 2).join(' & ')}`);
    }
    if (!p.inStock) score -= 1.5;
    score += p.rating * 0.1;
    max += 0.5;
    return { product: p, match: max ? Math.max(0, Math.min(99, Math.round((score / max) * 100))) : 80, reasons, score };
  });

  return scored
    .sort((x, y) => y.score - x.score || y.product.rating - x.product.rating)
    .slice(0, count)
    .map(({ product, match, reasons }) => ({ product, match, reasons }));
}
