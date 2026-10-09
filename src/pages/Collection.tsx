import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import SmartImage from '../components/ui/SmartImage';
import { collectionBanner } from '../data/images';
import ProductBrowser from '../components/product/ProductBrowser';
import { Breadcrumbs, usePageMeta } from '../components/ui/primitives';
import { collections, getCollection } from '../data/collections';
import { products } from '../data/products';
import NotFound from './NotFound';

export default function Collection() {
  const { slug = '' } = useParams();
  const c = getCollection(slug);
  usePageMeta(c?.title ?? 'Collection not found', c?.description);
  if (!c) return <NotFound />;

  const source = products.filter(c.filter);
  const genderPage = ['men', 'women', 'unisex'].includes(c.slug);

  return (
    <>
      <section className="theme-dark relative overflow-hidden border-b border-gold/15 bg-obsidian">
        <div className="absolute inset-0">
          <SmartImage
            src={collectionBanner(c.slug)}
            width={2400}
            height={1000}
            eager
            alt={`${c.title} campaign banner with illustrative bottle renders`}
            className="h-full w-full object-cover object-[75%_50%] opacity-35 md:object-right md:opacity-100"
            fallback={<div className="h-full w-full" style={{ background: `radial-gradient(ellipse at 75% 60%, ${c.accent} 0%, #211a13 55%, #1a1510 100%)` }} />}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent md:via-obsidian/40" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="container-lux relative flex min-h-[560px] items-center pb-14 pt-36 md:min-h-[620px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-xl">
            <Breadcrumbs crumbs={[{ label: 'Collections', to: '/shop' }, { label: c.title }]} className="mb-8" />
            <p className="eyebrow">{c.eyebrow}</p>
            <h1 className="mt-4 text-5xl leading-[1.02] sm:text-7xl">{c.title}</h1>
            <p className="mt-4 font-serif text-2xl italic" style={{ color: c.accent2 }}>
              {c.headline}
            </p>
            <p className="mt-5 max-w-lg leading-7 text-ivory/75">{c.description}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-muted">{source.length} fragrances</p>
          </motion.div>
        </div>
      </section>

      <section className="container-lux py-14">
        <ProductBrowser key={c.slug} source={source} showGender={!genderPage} featuredSort={c.sort} />
      </section>

      <section className="container-lux">
        <p className="eyebrow mb-6 text-center">Explore other collections</p>
        <div className="flex flex-wrap justify-center gap-2">
          {collections
            .filter((x) => x.slug !== c.slug)
            .map((x) => (
              <Link key={x.slug} to={`/collections/${x.slug}`} className="chip">
                {x.title}
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
