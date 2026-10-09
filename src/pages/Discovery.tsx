import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FragranceFinder from '../components/fragrance/FragranceFinder';
import ScentWheel from '../components/fragrance/ScentWheel';
import { ProductGrid } from '../components/product/ProductCard';
import { PageHero, usePageMeta } from '../components/ui/primitives';
import { familyInfo } from '../data/collections';
import { families, products } from '../data/products';
import type { Family } from '../data/types';
import SmartImage from '../components/ui/SmartImage';
import { familyPhoto, photo } from '../data/images';

export function FragranceFinderPage() {
  usePageMeta('Fragrance Finder', 'Answer six quick questions and discover the Mahek perfume that suits you.');
  return (
    <>
      <PageHero
        eyebrow="Smart Perfume Finder"
        title={
          <>
            Discover your <span className="gold-text italic">signature</span>
          </>
        }
        text="Six questions. A handful of seconds. Perfumes from our collection matched to your taste — calculated privately in your browser."
        crumbs={[{ label: 'Fragrance Finder' }]}
      />
      <section className="container-lux py-16">
        <FragranceFinder />
      </section>
    </>
  );
}

export function ScentWheelPage() {
  usePageMeta('Scent Wheel', 'Explore fragrance families — woody, oud, floral, citrus, amber, fresh, musk and oriental — and find matching perfumes.');
  const [params, setParams] = useSearchParams();
  const initial = params.get('family');
  const [active, setActive] = useState<Family | null>(families.includes(initial as Family) ? (initial as Family) : null);
  const info = familyInfo.find((f) => f.family === active);
  const matches = active ? products.filter((p) => p.families.includes(active)).sort((a, b) => Number(b.families[0] === active) - Number(a.families[0] === active)) : [];

  const select = (f: Family) => {
    const next = active === f ? null : f;
    setActive(next);
    setParams(next ? { family: next } : {}, { replace: true });
  };

  return (
    <>
      <PageHero eyebrow="Discover by family" title="The Scent Wheel" text="Every perfume belongs to a family. Select a segment to reveal its character, signature notes and matching fragrances." crumbs={[{ label: 'Scent Wheel' }]} />
      <section className="container-lux grid items-center gap-14 py-16 lg:grid-cols-2">
        <ScentWheel active={active} onSelect={select} />
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {info ? (
              <motion.div key={info.family} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-line/10">
                  <SmartImage src={photo(familyPhoto[info.family].key)} alt={familyPhoto[info.family].alt} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[0.6rem] uppercase tracking-[0.22em] text-ivory/70">{info.family} · ingredient mood</span>
                </div>
                <span className="inline-block h-1 w-16" style={{ background: info.color }} />
                <h2 className="mt-5 text-5xl">{info.family}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-gold">{info.mood}</p>
                <p className="mt-6 max-w-md leading-8 text-ivory/75">{info.description}</p>
                <p className="eyebrow mb-3 mt-8">Signature notes</p>
                <ul className="flex flex-wrap gap-2">
                  {info.notes.map((n) => (
                    <li key={n} className="border border-line/10 px-3 py-1.5 text-sm text-ivory/80">
                      {n}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link to={`/shop?family=${info.family}`} className="btn-gold">
                    Shop {info.family}
                  </Link>
                  <button onClick={() => select(info.family)} className="btn-outline">
                    Clear selection
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-4xl">Eight families, endless stories</h2>
                <p className="mt-5 max-w-md leading-8 text-ivory/70">Select a family on the wheel to see its notes and the perfumes that express it best.</p>
                <div className="mt-8 grid max-w-md grid-cols-2 gap-2">
                  {familyInfo.map((f) => (
                    <button key={f.family} onClick={() => select(f.family)} className="group flex items-center gap-3 border border-line/10 p-2 pr-4 text-left text-sm transition hover:border-gold">
                      <img src={photo(familyPhoto[f.family].key)} alt="" loading="lazy" decoding="async" className="h-11 w-11 shrink-0 object-cover" />
                      {f.family}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {active && (
        <section className="container-lux pb-10">
          <h2 className="mb-10 text-center text-4xl">
            {matches.length} {active} {matches.length === 1 ? 'fragrance' : 'fragrances'}
          </h2>
          <ProductGrid products={matches} />
        </section>
      )}
    </>
  );
}
