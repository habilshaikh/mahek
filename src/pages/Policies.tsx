import { Link } from 'react-router-dom';
import { DemoNotice, PageHero, usePageMeta } from '../components/ui/primitives';
import { site } from '../config/site';

type Section = { h: string; p: string[]; list?: string[] };
interface Policy {
  title: string;
  intro: string;
  sections: Section[];
}

const policies: Record<'shipping' | 'returns' | 'privacy' | 'terms', Policy> = {
  shipping: {
    title: 'Shipping Policy',
    intro: 'How and when your fragrances are delivered.',
    sections: [
      { h: 'Processing times', p: ['Orders are typically prepared within [X] business days. Orders placed on weekends or public holidays are processed on the next business day.'] },
      {
        h: 'Delivery options',
        p: ['The following options and charges are placeholders:'],
        list: [`Standard delivery: [3–5] business days — ₹${site.shipping.standard}, complimentary over ₹${site.shipping.freeThreshold.toLocaleString('en-IN')}`, `Express delivery: [1–2] business days — ₹${site.shipping.express}`],
      },
      { h: 'Delivery areas', p: ['[List the regions and countries the business ships to, and any restrictions on shipping fragrances, which may be classed as flammable goods.]'] },
      { h: 'Tracking', p: ['Once dispatched, you will receive a tracking reference by [email/SMS].'] },
    ],
  },
  returns: {
    title: 'Returns & Refund Policy',
    intro: 'Our commitment if something is not quite right.',
    sections: [
      { h: 'Eligibility', p: ['[Placeholder] Unopened, unused products in original packaging may be returned within [X] days of delivery. For hygiene reasons opened fragrances may not be eligible unless faulty.'] },
      { h: 'Damaged or incorrect items', p: ['[Placeholder] Please contact us within [X] hours of delivery with photographs and your order reference.'] },
      { h: 'Refunds', p: ['[Placeholder] Approved refunds are issued to the original payment method within [X] business days.'] },
      { h: 'How to start a return', p: ['Contact our team via the contact page with your order reference.'] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'How personal information would be handled.',
    sections: [
      { h: 'About this demo', p: ['This prototype website does not collect, transmit or store personal data on any server. Cart, wishlist and address demo data are kept only in your browser’s localStorage and can be cleared at any time.'] },
      { h: 'Information we collect', p: ['[Placeholder] Describe the personal information collected (e.g. name, contact details, order history) and the legal basis for processing.'] },
      { h: 'How we use information', p: ['[Placeholder] Order fulfilment, customer service, and marketing with consent.'] },
      { h: 'Cookies & analytics', p: ['[Placeholder] Describe any cookies, analytics or marketing tools used.'] },
      { h: 'Your rights', p: ['[Placeholder] Explain access, correction and deletion rights under applicable law and how to contact us.'] },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'The terms governing use of this website.',
    sections: [
      { h: 'Demo status', p: ['This website is a static demonstration. Products, prices, reviews, orders and promotions shown are samples. No purchase contract is formed through this site.'] },
      { h: 'Products & pricing', p: ['[Placeholder] Prices, availability and descriptions are subject to change. Colours and packaging may vary.'] },
      { h: 'Orders', p: ['[Placeholder] Describe order acceptance, cancellation and payment terms.'] },
      { h: 'Intellectual property', p: [`All content, including the ${site.name} name and logo, belongs to its respective owner.`] },
      { h: 'Governing law', p: ['[Placeholder] State the governing law and jurisdiction.'] },
    ],
  },
};

const others: { key: keyof typeof policies; to: string }[] = [
  { key: 'shipping', to: '/shipping-policy' },
  { key: 'returns', to: '/returns-policy' },
  { key: 'privacy', to: '/privacy-policy' },
  { key: 'terms', to: '/terms' },
];

export default function PolicyPage({ type }: { type: keyof typeof policies }) {
  const p = policies[type];
  usePageMeta(p.title, `${p.title} — ${site.name}.`);
  return (
    <>
      <PageHero eyebrow="Legal & Support" title={p.title} text={p.intro} crumbs={[{ label: p.title }]} />
      <section className="container-lux grid gap-12 py-16 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Policies" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {others.map((o) => (
            <Link key={o.key} to={o.to} aria-current={o.key === type ? 'page' : undefined} className={`border-l-2 px-4 py-2 text-sm ${o.key === type ? 'border-gold text-gold' : 'border-line/10 text-muted hover:text-ivory'}`}>
              {policies[o.key].title}
            </Link>
          ))}
        </nav>
        <div className="max-w-3xl">
          <DemoNotice className="mb-10">Sample policy content. It must be reviewed and replaced with the business’s actual, legally reviewed policy before launch. Text in [brackets] needs completing.</DemoNotice>
          <div className="prose-lux">
            {p.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((t) => (
                  <p key={t}>{t}</p>
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
          <p className="mt-10 text-sm text-muted">Last updated: [date] · Questions? <Link to="/contact" className="text-gold hover:underline">Contact us</Link>.</p>
        </div>
      </section>
    </>
  );
}
