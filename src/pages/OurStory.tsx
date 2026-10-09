import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SmartImage from '../components/ui/SmartImage';
import { campaign, photo, type PhotoKey } from '../data/images';
import Logo from '../components/ui/Logo';
import { Reveal, usePageMeta } from '../components/ui/primitives';
import { getProduct } from '../data/products';

const pillars = [
  { n: '01', title: 'Devotion to scent', text: 'Mahek means fragrance. It is not only our name — it is the craft we have devoted ourselves to since 1982.' },
  { n: '02', title: 'Precious materials', text: 'Oud, saffron, rose, sandalwood and amber: the materials at the heart of our compositions are chosen for depth and character.' },
  { n: '03', title: 'Timeless and modern', text: 'We honour the traditions of perfumery while composing for the way people live and wear fragrance today.' },
];

const mosaic: { key: PhotoKey; label: string; alt: string; span: string }[] = [
  { key: 'rose-crimson', label: 'Rose', alt: 'Crimson rose petals', span: 'col-span-2 row-span-2' },
  { key: 'jasmine-bloom', label: 'Jasmine', alt: 'White jasmine blossoms', span: '' },
  { key: 'amber-jewel', label: 'Amber', alt: 'Glowing amber resin', span: '' },
  { key: 'spices-bowls', label: 'Spice', alt: 'Bowls of cardamom and spices on black', span: '' },
  { key: 'smoke-blue', label: 'Incense', alt: 'Incense smoke on black', span: '' },
];

export default function OurStory() {
  usePageMeta('Our Story', 'Mahek Perfume — a legacy of fragrance since 1982.');
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);
  const op = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heritage = getProduct('sandalwood-heritage')!;

  return (
    <>
      <section ref={ref} className="theme-dark grain relative flex min-h-[92svh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,#3d2c14,#1a1510_70%)] pt-28">
        <SmartImage src={photo('candles-row')} alt="" eager className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#1a1510_80%)]" />
        <motion.p style={{ y }} className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-serif text-[30vw] leading-none text-line/[0.03]" aria-hidden>
          1982
        </motion.p>
        <motion.div style={{ opacity: op }} className="container-lux relative text-center">
          <Logo size="lg" className="mx-auto" />
          <p className="eyebrow mt-10">Our Story</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl leading-[1.05] sm:text-7xl">
            A Legacy of Fragrance <span className="gold-text italic">Since 1982</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl font-serif text-xl italic text-ivory/70">Some memories are seen. The most enduring ones are felt — and remembered through scent.</p>
        </motion.div>
      </section>

      <section className="container-lux grid items-center gap-16 py-24 lg:grid-cols-2">
        <Reveal>
          <figure>
            <div className="relative aspect-[8/7] overflow-hidden border border-gold/15">
              <SmartImage src={campaign.heritage} width={1600} height={1400} alt={`${heritage.name} flanked by Rose Mahal and Amber Sultan (illustrative render)`} className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-3 text-xs text-muted">Illustrative render of sample products.</figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">The House of Mahek</p>
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Fragrance is our name, and our calling</h2>
          <div className="prose-lux mt-8">
            <p>
              <span className="float-left mr-3 mt-1 font-serif text-7xl leading-[0.8] text-gold">M</span>ahek — a word meaning fragrance — has been our name since 1982. Across more than four decades it has come to stand for one simple promise: perfume made with care, to be worn with pride.
            </p>
            <p>Our compositions draw on the materials that have defined fine perfumery for centuries — precious oud, saffron, rose and sandalwood — balanced with the fresh, modern accords loved by today’s wearers.</p>
            <p className="text-sm text-muted">Editorial note: this page is placeholder copy based only on the supplied brand identity. Replace with the house’s verified history before launch.</p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line/5 bg-charcoal py-24">
        <div className="container-lux grid gap-10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1} className="border-t border-gold/40 pt-8">
              <p className="font-serif text-5xl text-gold/60">{p.n}</p>
              <h3 className="mt-4 text-3xl">{p.title}</h3>
              <p className="mt-4 leading-7 text-ivory/70">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-lux py-24">
        <Reveal className="mb-10 max-w-xl">
          <p className="eyebrow">The Palette</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Materials we love</h2>
          <p className="mt-4 text-muted">Rose, jasmine, amber, spice and smoke — the moods that run through our compositions.</p>
        </Reveal>
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4">
          {mosaic.map((m, i) => (
            <Reveal key={m.key} delay={i * 0.05} className={`relative overflow-hidden border border-line/[0.07] ${m.span}`}>
              <SmartImage src={photo(m.key)} alt={m.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105" />
              <span className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[#F5F0E6]/80 backdrop-blur">{m.label}</span>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Illustrative, openly licensed photography — not archival images of the house. See <Link to="/image-credits" className="text-gold hover:underline">image credits</Link>.</p>
      </section>

      <section className="container-lux py-28 text-center">
        <Reveal>
          <p className="mx-auto max-w-3xl font-serif text-3xl italic leading-relaxed text-ivory/85 sm:text-4xl">“A fragrance is a signature written in the air — invisible, unforgettable and entirely your own.”</p>
          <p className="eyebrow mt-8">The House of Mahek</p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-gold">
              Explore the collection
            </Link>
            <Link to="/fragrance-finder" className="btn-outline">
              Find your scent
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
