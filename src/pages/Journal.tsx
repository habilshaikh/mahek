import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SmartImage from '../components/ui/SmartImage';
import { articlePhoto, campaign, photo, productImage } from '../data/images';
import { ProductGrid } from '../components/product/ProductCard';
import NewsletterForm from '../components/ui/NewsletterForm';
import { Breadcrumbs, PageHero, Reveal, usePageMeta } from '../components/ui/primitives';
import { articles, getArticle, type Article } from '../data/journal';
import { getProduct } from '../data/products';
import type { Product } from '../data/types';
import NotFound from './NotFound';

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const CATS = ['All', 'Guides', 'Fragrance Notes', 'Gifting', 'Perfume Care'] as const;

function ArticleCard({ a, large = false }: { a: Article; large?: boolean }) {
  return (
    <Link to={`/journal/${a.slug}`} className={`group block ${large ? 'md:grid md:grid-cols-2 md:items-center md:gap-10' : ''}`}>
      <div className={`relative overflow-hidden border border-line/[0.07] ${large ? 'aspect-[4/3] md:aspect-square' : 'aspect-[4/3]'}`}>
        <SmartImage src={photo(articlePhoto[a.slug].key)} alt={articlePhoto[a.slug].alt} eager={large} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className={large ? 'mt-6 md:mt-0' : ''}>
        <p className="eyebrow mt-5">
          {a.category} · <span className="text-muted">{a.readTime}</span>
        </p>
        <h3 className={`mt-2 leading-snug transition group-hover:text-gold ${large ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>{a.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{a.excerpt}</p>
        <p className="mt-3 text-xs text-muted/70">{fmt(a.date)}</p>
      </div>
    </Link>
  );
}

export function Journal() {
  usePageMeta('Fragrance Journal', 'Perfume guides, fragrance notes and gifting ideas from Mahek Perfume.');
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const list = cat === 'All' ? articles : articles.filter((a) => a.category === cat);
  const [lead, ...rest] = list;
  return (
    <>
      <PageHero eyebrow="The Journal" title="Stories in scent" text="Guides, notes and inspiration from the world of perfume." crumbs={[{ label: 'Journal' }]}>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`chip ${cat === c ? 'chip-active' : ''}`}>
              {c}
            </button>
          ))}
        </div>
      </PageHero>
      <section className="container-lux py-16">
        {lead && <ArticleCard a={lead} large />}
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.06}>
              <ArticleCard a={a} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function JournalArticle() {
  const { slug = '' } = useParams();
  const a = getArticle(slug);
  usePageMeta(a?.title ?? 'Article not found', a?.excerpt);
  if (!a) return <NotFound />;
  const related = a.relatedProducts.map((s) => getProduct(s)).filter(Boolean) as Product[];
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <article>
        <header className="theme-dark relative overflow-hidden bg-obsidian pt-32">
          <SmartImage src={photo(articlePhoto[a.slug].key)} alt="" eager className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />
          <div className="container-lux relative grid items-end gap-8 pb-14 md:grid-cols-[1.4fr_1fr]">
            <div>
              <Breadcrumbs crumbs={[{ label: 'Journal', to: '/journal' }, { label: a.category }]} className="mb-8" />
              <p className="eyebrow">
                {a.category} · {a.readTime}
              </p>
              <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl">{a.title}</h1>
              <p className="mt-5 max-w-xl font-serif text-xl italic text-ivory/75">{a.excerpt}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">{fmt(a.date)} · The Mahek Journal</p>
            </div>
            {related[0] && (
              <div className="hidden h-96 justify-center md:flex">
                <img src={productImage(related[0].slug, 'cutout')} alt={`${related[0].name} (illustrative render)`} className="h-full w-auto drop-shadow-2xl" />
              </div>
            )}
          </div>
        </header>
        <div className="container-lux py-16">
          <div className="prose-lux mx-auto max-w-2xl text-lg">
            {a.body.map((s, i) => (
              <section key={i}>
                {s.heading && <h2>{s.heading}</h2>}
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>
      <section className="container-lux py-10">
        <h2 className="mb-10 text-center text-4xl">Fragrances in this story</h2>
        <ProductGrid products={related} cols={3} />
      </section>
      <section className="container-lux py-16">
        <h2 className="mb-10 text-3xl">Continue reading</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {more.map((m) => (
            <ArticleCard key={m.slug} a={m} />
          ))}
        </div>
      </section>
    </>
  );
}

export function NewsletterPage() {
  usePageMeta('Newsletter', 'Join the Mahek Letter for new releases and fragrance guides.');
  const perks = ['First access to new releases', 'Private previews & events', 'Fragrance guides from our journal', 'Seasonal gifting inspiration'];
  return (
    <section className="theme-dark grain relative flex min-h-[90svh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_70%_50%,#3d2c14,#1a1510_65%)] pb-16 pt-32">
      <div className="container-lux grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">The Mahek Letter</p>
          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-7xl">
            Scented <span className="gold-text italic">correspondence</span>
          </h1>
          <p className="mt-6 max-w-md leading-8 text-ivory/70">An occasional letter from our house — written with the same care we give to every fragrance.</p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-ivory/80">
                <span className="text-gold">✦</span> {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 max-w-md">
            <NewsletterForm />
            <p className="mt-4 text-xs text-muted">Demo form: your email is validated in the browser only and is not saved or sent anywhere.</p>
          </div>
        </div>
        <div className="relative hidden aspect-[4/5] overflow-hidden border border-gold/15 lg:block">
          <SmartImage src={campaign.newsletter} width={1200} height={1500} eager alt="Rose Mahal and Amber Sultan before deep red roses (illustrative render)" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
