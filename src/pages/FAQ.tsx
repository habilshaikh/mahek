import { useState } from 'react';
import { Link } from 'react-router-dom';
import Accordion from '../components/ui/Accordion';
import { DemoNotice, PageHero, usePageMeta } from '../components/ui/primitives';

const groups = [
  {
    id: 'selection',
    title: 'Choosing a fragrance',
    items: [
      { q: 'How do I find the right perfume for me?', a: <>Try our <Link className="text-gold underline" to="/fragrance-finder">Fragrance Finder</Link> quiz or explore families on the <Link className="text-gold underline" to="/scent-wheel">Scent Wheel</Link>. A discovery set is a lovely way to test several scents.</> },
      { q: 'What is the difference between men’s, women’s and unisex perfumes?', a: 'These are style guides rather than rules. Many people enjoy fragrances from every collection — wear what you love.' },
      { q: 'Can I buy a sample before a full bottle?', a: 'Our Heritage Discovery Set includes five 10 ml sprays. Sample availability shown here is illustrative.' },
    ],
  },
  {
    id: 'notes',
    title: 'Fragrance notes',
    items: [
      { q: 'What are top, heart and base notes?', a: 'Top notes form the first impression, heart notes the character, and base notes the lasting trail. Each product page shows its fragrance pyramid.' },
      { q: 'What is oud?', a: <>Oud (agarwood) is a rich, smoky resin treasured in perfumery. Read more in our <Link className="text-gold underline" to="/journal/understanding-oud">journal guide</Link>.</> },
      { q: 'How long will a perfume last on my skin?', a: 'Longevity depends on the composition, your skin and the climate. The longevity meters on product pages are illustrative.' },
    ],
  },
  {
    id: 'ordering',
    title: 'Ordering',
    items: [
      { q: 'How do I place an order?', a: 'Add products to your bag and proceed to checkout. On this demo site checkout is simulated — no order is placed and no payment is taken.' },
      { q: 'Do you offer gift wrapping?', a: 'Gift wrapping options shown at checkout are illustrative placeholders.' },
      { q: 'Can I use a promo code?', a: 'Yes — enter it in your bag. Sample demo codes: MAHEK10, HERITAGE82 and FREESHIP.' },
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery',
    items: [
      { q: 'How long does delivery take?', a: <>Illustrative placeholder: standard 3–5 business days, express 1–2 business days. See the <Link className="text-gold underline" to="/shipping-policy">Shipping Policy</Link>.</> },
      { q: 'How can I track my order?', a: <>Use the <Link className="text-gold underline" to="/track-order">Track Order</Link> page. It currently displays sample tracking data.</> },
    ],
  },
  {
    id: 'returns',
    title: 'Returns',
    items: [
      { q: 'Can I return a perfume?', a: <>Illustrative placeholder: unopened products may be returned within a set period. See the <Link className="text-gold underline" to="/returns-policy">Returns Policy</Link> — to be confirmed by the business.</> },
      { q: 'What if my order arrives damaged?', a: 'Illustrative placeholder: contact us with photos and your order number and we will arrange a replacement.' },
    ],
  },
  {
    id: 'care',
    title: 'Perfume care',
    items: [
      { q: 'How should I store my perfume?', a: 'Keep bottles in a cool, dark place away from direct sunlight, heat and humidity — avoid bathrooms and cars.' },
      { q: 'Does perfume expire?', a: 'Well-stored perfumes typically remain beautiful for several years. Changes in colour or a sharp top note can indicate ageing.' },
      { q: 'Where should I apply perfume?', a: 'Pulse points — wrists, neck and behind the ears. Avoid rubbing wrists together, which can dull the top notes.' },
    ],
  },
];

export default function FAQ() {
  usePageMeta('FAQ', 'Answers about choosing fragrances, notes, ordering, delivery, returns and perfume care.');
  const [active, setActive] = useState(groups[0].id);
  const group = groups.find((g) => g.id === active)!;
  return (
    <>
      <PageHero eyebrow="Help Centre" title="Frequently asked questions" crumbs={[{ label: 'FAQ' }]} />
      <section className="container-lux grid gap-12 py-16 lg:grid-cols-[260px_1fr]">
        <nav aria-label="FAQ topics" className="scrollbar-none flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              aria-current={active === g.id}
              className={`shrink-0 border-l-2 px-4 py-3 text-left text-sm uppercase tracking-[0.16em] transition ${active === g.id ? 'border-gold text-gold' : 'border-line/10 text-muted hover:text-ivory'}`}
            >
              {g.title}
            </button>
          ))}
        </nav>
        <div>
          <h2 className="mb-6 text-4xl">{group.title}</h2>
          <Accordion key={group.id} items={group.items} defaultOpen={0} />
          <DemoNotice className="mt-10">Policy-related answers are illustrative placeholders and must be reviewed and replaced with the business’s actual policies before launch.</DemoNotice>
          <p className="mt-8 text-muted">
            Still have a question?{' '}
            <Link to="/contact" className="text-gold hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
