import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Quote, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CinematicIntro, { shouldPlayIntro } from '../components/3d/CinematicIntro';
import PerfumeScene from '../components/3d/PerfumeScene';
import CollectionCard from '../components/product/CollectionCard';
import ProductCard, { ProductGrid } from '../components/product/ProductCard';
import Logo from '../components/ui/Logo';
import NewsletterForm from '../components/ui/NewsletterForm';
import SmartImage from '../components/ui/SmartImage';
import { Reveal, SectionHeading, Stars, usePageMeta } from '../components/ui/primitives';
import { collections, familyInfo } from '../data/collections';
import { articles } from '../data/journal';
import { articlePhoto, campaign, familyPhoto, photo } from '../data/images';
import { getProduct, products } from '../data/products';

const testimonials = [
  { name: 'Sample Customer A', text: 'Royal Oud Noir lasts all evening and I receive compliments every time I wear it.', product: 'Royal Oud Noir', rating: 5 },
  { name: 'Sample Customer B', text: 'The Heritage Discovery Set was the perfect way to find my signature — beautifully packaged.', product: 'Heritage Discovery Set', rating: 5 },
  { name: 'Sample Customer C', text: 'Rose Mahal is romantic without being heavy. It has become my wedding-season favourite.', product: 'Rose Mahal', rating: 5 },
];

export default function Home() {
  usePageMeta('', 'Mahek Perfume — a legacy of fragrance since 1982. Explore oud, amber, floral and woody perfumes, gift sets and our Fragrance Finder.');
  const [intro, setIntro] = useState(shouldPlayIntro);
  const reduce = useReducedMotion();
  const hero = getProduct('royal-oud-noir')!;
  const sats = ['rose-mahal', 'citrus-riviera', 'amber-sultan'].map((s) => getProduct(s)!);
  const bestsellers = products.filter((p) => p.tags.includes('bestseller') && !p.isSet).slice(0, 4);
  const arrivals = [...products].filter((p) => p.tags.includes('new')).sort((a, b) => b.addedOrder - a.addedOrder);
  const heritageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heritageRef, offset: ['start end', 'end start'] });
  const yearY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  const heroDelay = intro ? 0.2 : 0;

  return (
    <>
      {intro && <CinematicIntro product={hero} onDone={() => setIntro(false)} />}

      {/* HERO */}
      <section className="theme-dark grain relative min-h-[100svh] overflow-hidden bg-obsidian">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#3d2c14_0%,#211a12_45%,#1a1510_75%)]" />
        <picture>
          <source media="(max-width: 767px)" srcSet={campaign.heroBgMobile} />
          <img src={campaign.heroBg} alt="" aria-hidden width={2400} height={1350} {...{ fetchpriority: 'high' }} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="container-lux relative grid min-h-[100svh] items-center gap-6 pb-12 pt-28 lg:grid-cols-[1fr_1.1fr] lg:pt-24">
          <motion.div
            className="relative z-10 order-2 text-center lg:order-1 lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={intro ? { opacity: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: heroDelay, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size="lg" className="mx-auto mb-8 hidden lg:mx-0 lg:block" />
            <p className="eyebrow">Maison de Parfum · Since 1982</p>
            <h1 className="mt-5 text-5xl leading-[0.98] sm:text-7xl xl:text-[5.6rem]">
              A Legacy of <span className="gold-text italic">Fragrance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md leading-7 text-ivory/70 lg:mx-0">
              Rare oud, glowing amber and luminous florals — perfumes composed to be remembered, crafted in the spirit of a house devoted to scent since 1982.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:justify-center lg:justify-start">
              <Link to="/shop" className="btn-gold px-4 sm:px-7">
                Shop now <ArrowRight size={14} />
              </Link>
              <Link to="/fragrance-finder" className="btn-outline px-4 sm:px-7">
                <Sparkles size={14} /> <span className="sm:hidden">Find scent</span><span className="hidden sm:inline">Discover your scent</span>
              </Link>
            </div>
            <Link to={`/product/${hero.slug}`} className="group mt-12 hidden items-center gap-4 border-l border-gold/40 pl-4 text-left lg:inline-flex">
              <span>
                <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-muted">Featured</span>
                <span className="block font-serif text-2xl transition group-hover:text-gold">{hero.name}</span>
                <span className="block text-xs text-muted">{hero.tagline}</span>
              </span>
              <ArrowRight size={16} className="text-gold transition group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            className="relative order-1 h-[52vh] min-h-[360px] lg:order-2 lg:h-[82vh]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={intro ? { opacity: 0 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: heroDelay, ease: [0.22, 1, 0.36, 1] }}
          >
            <PerfumeScene hero={hero} satellites={sats} />
          </motion.div>
        </div>
      </section>

      {/* FAMILY MARQUEE */}
      <div className="overflow-hidden border-y border-gold/15 bg-charcoal py-5" aria-hidden>
        <div className={`flex w-max gap-12 whitespace-nowrap ${reduce ? '' : 'animate-[marquee_40s_linear_infinite]'}`}>
          {[...familyInfo, ...familyInfo, ...familyInfo].map((f, i) => (
            <span key={i} className="flex items-center gap-12 font-serif text-2xl italic text-ivory/60">
              {f.family}
              <span className="text-xs not-italic text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section className="container-lux py-16 sm:py-32">
        <SectionHeading eyebrow="The Collections" title="Curated worlds of scent" text="From the treasured Oud Collection to luminous florals and gift-ready sets — explore the houses within our house." />
        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
          <Reveal className="w-[82%] shrink-0 snap-center md:row-span-2 md:w-auto">
            <CollectionCard c={collections.find((c) => c.slug === 'oud')!} tall />
          </Reveal>
          {['men', 'women', 'unisex', 'gifts'].map((slug, i) => (
            <Reveal key={slug} delay={i * 0.08} className="w-[82%] shrink-0 snap-center md:w-auto">
              <CollectionCard c={collections.find((c) => c.slug === slug)!} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-lux pb-16 sm:pb-32">
        <SectionHeading
          align="left"
          eyebrow="Most Loved"
          title="Bestsellers"
          text="The signatures our customers return to, season after season."
          action={
            <Link to="/collections/bestsellers" className="btn-ghost text-gold">
              View all bestsellers <ArrowRight size={14} />
            </Link>
          }
        />
        <ProductGrid products={bestsellers} />
      </section>

      {/* FULL-WIDTH CAMPAIGN */}
      <section className="theme-dark relative overflow-hidden border-y border-gold/10 bg-obsidian">
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[24/11]">
          <SmartImage
            src={campaign.oud}
            width={2400}
            height={1100}
            alt="The Oud Collection campaign — Black Oud Intense, Saffron Crown and Royal Oud Noir before golden incense smoke (illustrative render)"
            className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent lg:bg-gradient-to-l lg:from-obsidian lg:via-obsidian/40" />
          <div className="container-lux absolute inset-0 flex items-end pb-12 lg:items-center lg:justify-end lg:pb-0">
            <Reveal className="max-w-md">
              <p className="eyebrow">The Treasury · Campaign</p>
              <h2 className="mt-4 text-5xl leading-tight sm:text-6xl">
                Liquid gold <span className="gold-text italic">of the East</span>
              </h2>
              <p className="mt-6 leading-8 text-ivory/75">
                Saffron, rare agarwood and ambergris — our Oud &amp; Luxury compositions are made to linger long after you leave the room.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/product/saffron-crown" className="btn-gold">
                  Explore Saffron Crown
                </Link>
                <Link to="/collections/oud" className="btn-outline">
                  The Oud Collection
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 sm:py-32">
        <div className="container-lux">
          <SectionHeading
            align="left"
            eyebrow="Just Released"
            title="New arrivals"
            action={
              <Link to="/collections/new-arrivals" className="btn-ghost text-gold">
                Discover what&apos;s new <ArrowRight size={14} />
              </Link>
            }
          />
        </div>
        <div className="container-lux">
          <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {arrivals.map((p) => (
              <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENT FAMILIES */}
      <section className="container-lux pb-16 sm:pb-32">
        <SectionHeading eyebrow="The Language of Scent" title="Explore by fragrance family" text="Eight families, each with its own mood. Select one to discover its notes and perfumes." />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {familyInfo.map((f, i) => (
            <Reveal key={f.family} delay={(i % 4) * 0.06}>
              <Link to={`/scent-wheel?family=${f.family}`} className="theme-dark group relative block aspect-[4/5] overflow-hidden border border-line/[0.07]">
                <SmartImage
                  src={photo(familyPhoto[f.family].key)}
                  alt={familyPhoto[f.family].alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-obsidian/10" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <span className="mb-3 block h-0.5 w-8 transition-all duration-500 group-hover:w-14" style={{ background: f.color }} />
                  <p className="font-serif text-2xl sm:text-3xl">{f.family}</p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-ivory/60">{f.mood}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINDER PREVIEW */}
      <section className="container-lux">
        <Reveal className="theme-dark relative overflow-hidden border border-gold/25 bg-[linear-gradient(120deg,#251d14,#2f2416_50%,#211a13)] p-8 sm:p-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow">Smart Perfume Finder</p>
              <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Not sure where to begin?</h2>
              <p className="mt-5 max-w-lg leading-7 text-ivory/70">
                Answer six quick questions about the families, notes and moments you love. Our finder will match you with fragrances from the collection — instantly, right in your browser.
              </p>
              <ol className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 text-sm text-ivory/70 sm:grid-cols-3">
                {['Family', 'Occasion', 'Intensity', 'Season', 'Budget', 'Notes'].map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/50 text-[0.65rem] text-gold">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <Link to="/fragrance-finder" className="btn-gold mt-10">
                Start the quiz <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-gold/15">
              <SmartImage src={campaign.finder} width={1600} height={1200} alt="Four sample perfumes from different fragrance families (illustrative render)" className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* HERITAGE */}
      <section ref={heritageRef} className="relative overflow-hidden py-20 sm:py-40">
        <motion.p style={{ y: yearY }} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[28vw] leading-none text-line/[0.025]" aria-hidden>
          1982
        </motion.p>
        <div className="container-lux relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Our Heritage</p>
            <h2 className="mt-4 text-5xl leading-tight sm:text-6xl">
              A Legacy of Fragrance <span className="gold-text italic">Since 1982</span>
            </h2>
            <p className="mt-6 max-w-lg leading-8 text-ivory/70">
              For more than four decades, the name Mahek — meaning fragrance — has stood for a devotion to scent. Our perfumes honour the timeless traditions of perfumery while embracing the modern wearer.
            </p>
            <Link to="/our-story" className="btn-outline mt-10">
              Read our story
            </Link>
          </Reveal>
          <motion.div style={{ y: imgY }} className="relative aspect-[8/7] overflow-hidden border border-gold/15">
            <SmartImage src={campaign.heritage} width={1600} height={1400} alt="Rose Mahal, Sandalwood Heritage and Amber Sultan on a candlelit plinth (illustrative render)" className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-line/5 bg-charcoal py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Kind Words" title="From our patrons" />
          <p className="-mt-6 mb-12 text-center">
            <span className="demo-badge">Sample testimonials — demo content</span>
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1} className="card-lux flex flex-col p-8">
                <Quote size={28} strokeWidth={1} className="text-gold" />
                <p className="mt-5 flex-1 font-serif text-xl italic leading-relaxed text-ivory/85">“{t.text}”</p>
                <div className="mt-6 flex items-center justify-between border-t border-line/10 pt-5">
                  <div>
                    <p className="text-sm">{t.name}</p>
                    <p className="text-xs text-muted">on {t.product}</p>
                  </div>
                  <Stars rating={t.rating} size={12} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="container-lux py-16 sm:py-32">
        <SectionHeading
          align="left"
          eyebrow="The Journal"
          title="Stories in scent"
          action={
            <Link to="/journal" className="btn-ghost text-gold">
              All articles <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <Link to={`/journal/${a.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden border border-line/[0.07]">
                  <SmartImage src={photo(articlePhoto[a.slug].key)} alt={articlePhoto[a.slug].alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-5">{a.category}</p>
                <h3 className="mt-2 text-2xl leading-snug transition group-hover:text-gold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted">{a.readTime}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-lux">
        <Reveal className="relative overflow-hidden border border-line/[0.07] px-6 py-16 text-center sm:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_65%)]" />
          <div className="relative mx-auto max-w-xl">
            <p className="eyebrow">The Mahek Letter</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">Be the first to know</h2>
            <p className="mt-4 text-muted">New releases, private previews and fragrance guides, delivered with care.</p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
