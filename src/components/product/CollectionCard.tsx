import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CollectionDef } from '../../data/collections';
import { collectionBanner } from '../../data/images';
import SmartImage from '../ui/SmartImage';
import BottleArt from './BottleArt';

export default function CollectionCard({ c, tall = false }: { c: CollectionDef; tall?: boolean }) {
  return (
    <Link
      to={`/collections/${c.slug}`}
      className={`theme-dark group relative flex overflow-hidden border border-line/[0.07] bg-charcoal transition-colors duration-500 hover:border-gold/40 ${tall ? 'min-h-[380px] md:min-h-[520px]' : 'min-h-[380px] md:min-h-[300px]'}`}
    >
      <SmartImage
        src={collectionBanner(c.slug)}
        width={2400}
        height={1000}
        alt={`${c.title} — campaign visual`}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 ${tall ? 'object-[78%_50%]' : 'object-[82%_50%]'}`}
        fallback={
          <div className="absolute inset-0 flex items-end justify-end pr-4" style={{ background: `radial-gradient(ellipse at 70% 60%, ${c.accent}cc 0%, #211a13 65%)` }}>
            <BottleArt bottle={c.heroBottles[1]} name={c.title} angle={14} className="h-[78%] w-auto" />
          </div>
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent" />
      <div className="relative z-10 mt-auto p-7">
        <p className="eyebrow">{c.eyebrow}</p>
        <h3 className="mt-2 text-3xl sm:text-4xl">{c.title}</h3>
        <p className="mt-2 max-w-[16rem] text-sm text-ivory/70">{c.headline}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-gold">
          Explore <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
