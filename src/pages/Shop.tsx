import ProductBrowser from '../components/product/ProductBrowser';
import { PageHero, usePageMeta } from '../components/ui/primitives';
import { products } from '../data/products';
import { collections } from '../data/collections';
import { Link } from 'react-router-dom';

export default function Shop() {
  usePageMeta('Shop All Perfumes', 'Browse the complete Mahek Perfume collection — search, filter by fragrance family, size and price.');
  return (
    <>
      <PageHero eyebrow="The Boutique" title="Shop all perfumes" text="Every composition in the house — from fresh citrus to the rarest oud. Filter by family, size, price and availability." crumbs={[{ label: 'Shop' }]}>
        <div className="scrollbar-none mx-auto mt-10 flex max-w-3xl gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center">
          {collections.map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="chip shrink-0">
              {c.title}
            </Link>
          ))}
        </div>
      </PageHero>
      <section className="container-lux py-14">
        <ProductBrowser source={products} />
      </section>
    </>
  );
}
