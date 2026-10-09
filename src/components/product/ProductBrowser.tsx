import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatPrice } from '../../config/site';
import { families as allFamilies, minPrice } from '../../data/products';
import type { Family, Gender, Product } from '../../data/types';
import { useOverlay } from '../ui/Modal';
import { ProductGrid } from './ProductCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'rating', label: 'Top rated' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'name', label: 'Name A–Z' },
];
const SIZE_FILTERS = [
  { id: '30', label: '30 ml' },
  { id: '50', label: '50 ml' },
  { id: '100', label: '100 ml' },
  { id: 'set', label: 'Gift sets' },
];
const GENDERS: { id: Gender; label: string }[] = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'unisex', label: 'Unisex' },
];

export default function ProductBrowser({
  source,
  showGender = true,
  defaultSort = 'featured',
  featuredSort,
}: {
  source: Product[];
  showGender?: boolean;
  defaultSort?: SortKey;
  featuredSort?: (a: Product, b: Product) => number;
}) {
  const [params, setParams] = useSearchParams();
  const bounds = useMemo(() => {
    const prices = source.map(minPrice);
    return { min: Math.floor(Math.min(...prices) / 100) * 100, max: Math.ceil(Math.max(...prices) / 100) * 100 };
  }, [source]);

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [fams, setFams] = useState<Family[]>(() => {
    const f = params.get('family');
    return f ? (f.split(',').filter((x) => allFamilies.includes(x as Family)) as Family[]) : [];
  });
  const [genders, setGenders] = useState<Gender[]>([]);
  const [sizeF, setSizeF] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [range, setRange] = useState<[number, number]>([bounds.min, bounds.max]);
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      return (localStorage.getItem('mahek.layout') as 'grid' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const drawerRef = useRef<HTMLDivElement>(null);
  useOverlay(drawer, () => setDrawer(false), drawerRef);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => setRange([bounds.min, bounds.max]), [bounds.min, bounds.max]);
  useEffect(() => {
    try {
      localStorage.setItem('mahek.layout', layout);
    } catch {
      /* ignore */
    }
  }, [layout]);

  // keep ?q= in sync so searches are shareable
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (query) next.set('q', query);
    else next.delete('q');
    if (fams.length) next.set('family', fams.join(','));
    else next.delete('family');
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, fams]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = source.filter((p) => {
      if (q) {
        const hay = [p.name, p.tagline, p.gender, ...p.families, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' ').toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      if (fams.length && !fams.some((f) => p.families.includes(f))) return false;
      if (genders.length && !genders.includes(p.gender)) return false;
      if (sizeF.length) {
        const ok = sizeF.some((s) => (s === 'set' ? p.isSet : !p.isSet && p.sizes.some((x) => String(x.ml) === s)));
        if (!ok) return false;
      }
      if (inStockOnly && !p.inStock) return false;
      const price = minPrice(p);
      return price >= range[0] && price <= range[1];
    });
    const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
      featured: featuredSort ?? ((a, b) => Number(b.tags.includes('bestseller')) - Number(a.tags.includes('bestseller')) || b.rating - a.rating),
      newest: (a, b) => b.addedOrder - a.addedOrder,
      rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      'price-asc': (a, b) => minPrice(a) - minPrice(b),
      'price-desc': (a, b) => minPrice(b) - minPrice(a),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(sorters[sort]);
  }, [source, query, fams, genders, sizeF, inStockOnly, range, sort, featuredSort]);

  const availableFamilies = allFamilies.filter((f) => source.some((p) => p.families.includes(f)));
  const activeCount = fams.length + genders.length + sizeF.length + (inStockOnly ? 1 : 0) + (range[0] !== bounds.min || range[1] !== bounds.max ? 1 : 0);
  const reset = () => {
    setFams([]);
    setGenders([]);
    setSizeF([]);
    setInStockOnly(false);
    setRange([bounds.min, bounds.max]);
    setQuery('');
  };
  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filters = (
    <div className="space-y-9">
      <FilterGroup title="Fragrance family">
        <div className="flex flex-wrap gap-2">
          {availableFamilies.map((f) => (
            <button key={f} onClick={() => toggle(fams, f, setFams)} aria-pressed={fams.includes(f)} className={`chip ${fams.includes(f) ? 'chip-active' : ''}`}>
              {f}
            </button>
          ))}
        </div>
      </FilterGroup>
      {showGender && (
        <FilterGroup title="Collection">
          {GENDERS.map((g) => (
            <Check key={g.id} label={g.label} checked={genders.includes(g.id)} onChange={() => toggle(genders, g.id, setGenders)} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Size">
        {SIZE_FILTERS.map((s) => (
          <Check key={s.id} label={s.label} checked={sizeF.includes(s.id)} onChange={() => toggle(sizeF, s.id, setSizeF)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {bounds.min === bounds.max ? (
          <p className="text-sm text-muted">{formatPrice(bounds.min)}</p>
        ) : (
          <PriceRange bounds={bounds} value={range} onChange={setRange} />
        )}
      </FilterGroup>
      <FilterGroup title="Availability">
        <Check label="In stock only" checked={inStockOnly} onChange={() => setInStockOnly((v) => !v)} />
      </FilterGroup>
      {activeCount > 0 && (
        <button onClick={reset} className="btn-ghost text-gold">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-28">{filters}</div>
      </aside>

      <div>
        <div className="mb-8 flex flex-col gap-4 border-b border-line/10 pb-6 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search perfumes</span>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, note or family…"
              className="input-lux pl-11"
              type="search"
            />
          </label>
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawer(true)} className="chip flex-1 justify-center py-3 lg:hidden">
              <SlidersHorizontal size={14} /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            <label className="flex-1 md:flex-none">
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input-lux bg-charcoal py-2.5 text-xs uppercase tracking-[0.14em]">
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden items-center border border-line/10 sm:flex" role="group" aria-label="Layout">
              <button onClick={() => setLayout('grid')} aria-pressed={layout === 'grid'} aria-label="Grid view" className={`p-2.5 ${layout === 'grid' ? 'bg-gold/15 text-gold' : 'text-muted hover:text-ivory'}`}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setLayout('list')} aria-pressed={layout === 'list'} aria-label="List view" className={`p-2.5 ${layout === 'list' ? 'bg-gold/15 text-gold' : 'text-muted hover:text-ivory'}`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <p className="mb-6 text-xs uppercase tracking-[0.2em] text-muted" aria-live="polite">
          {loading ? 'Loading fragrances…' : `${results.length} ${results.length === 1 ? 'fragrance' : 'fragrances'}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] animate-shimmer bg-[linear-gradient(90deg,rgb(var(--c-line)/0.04),rgb(var(--c-line)/0.1),rgb(var(--c-line)/0.04))] bg-[length:200%_100%]" />
                <div className="mt-4 h-3 w-1/3 bg-line/5" />
                <div className="mt-3 h-5 w-2/3 bg-line/5" />
              </div>
            ))}
          </div>
        ) : results.length ? (
          <ProductGrid products={results} layout={layout} cols={3} />
        ) : (
          <div className="card-lux flex flex-col items-center px-6 py-20 text-center">
            <p className="font-serif text-3xl">No fragrances match</p>
            <p className="mt-3 max-w-sm text-sm text-muted">Try removing a filter or searching for a different note — perhaps “rose”, “oud” or “citrus”.</p>
            <button onClick={reset} className="btn-outline mt-8">
              Reset filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="absolute bottom-0 left-0 top-0 flex w-[88%] max-w-sm flex-col border-r border-gold/20 bg-charcoal"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
            >
              <div className="flex items-center justify-between border-b border-line/10 p-5">
                <p className="font-serif text-2xl">Filters</p>
                <button onClick={() => setDrawer(false)} aria-label="Close filters" className="p-2 hover:text-gold">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{filters}</div>
              <div className="border-t border-line/10 p-5">
                <button className="btn-gold w-full" onClick={() => setDrawer(false)}>
                  Show {results.length} results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">{title}</legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-ivory/80 hover:text-ivory">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-4 w-4 items-center justify-center border border-line/25 transition peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:ring-1 peer-focus-visible:ring-gold">
        {checked && <span className="h-1.5 w-1.5 bg-obsidian" />}
      </span>
      {label}
    </label>
  );
}

function PriceRange({ bounds, value, onChange }: { bounds: { min: number; max: number }; value: [number, number]; onChange: (v: [number, number]) => void }) {
  const pct = (v: number) => ((v - bounds.min) / (bounds.max - bounds.min)) * 100;
  return (
    <div>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-line/15" />
        <div className="absolute top-1/2 h-0.5 bg-gold" style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }} />
        <input
          type="range"
          aria-label="Minimum price"
          min={bounds.min}
          max={bounds.max}
          step={100}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 100), value[1]])}
          className="range-gold absolute inset-x-0 top-1/2 w-full -translate-y-1/2 bg-transparent"
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={bounds.min}
          max={bounds.max}
          step={100}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 100)])}
          className="range-gold absolute inset-x-0 top-1/2 w-full -translate-y-1/2 bg-transparent"
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-ivory/70">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  );
}
