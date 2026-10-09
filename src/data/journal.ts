import type { BottleStyle } from './types';

export interface Article {
  slug: string;
  title: string;
  category: 'Guides' | 'Fragrance Notes' | 'Gifting' | 'Perfume Care';
  excerpt: string;
  readTime: string;
  date: string;
  bottle: BottleStyle;
  accent: string;
  body: { heading?: string; paragraphs: string[]; list?: string[] }[];
  relatedProducts: string[];
}

export const articles: Article[] = [
  {
    slug: 'how-to-choose-your-signature-scent',
    title: 'How to Choose Your Signature Scent',
    category: 'Guides',
    excerpt: 'A signature scent should feel like you on your best day. Here is how to find it, step by step.',
    readTime: '6 min read',
    date: '2026-09-18',
    bottle: { shape: 'classic', cap: 'gold', liquid: '#c9a066', label: 'gold' },
    accent: '#7a5a14',
    relatedProducts: ['sandalwood-heritage', 'rose-mahal', 'amber-sultan'],
    body: [
      { paragraphs: ['A signature scent is less about following trends and more about recognising yourself. The right perfume should feel natural on your skin and become part of how people remember you.'] },
      {
        heading: 'Start with what you already love',
        paragraphs: ['Think about the smells that make you pause — fresh-cut citrus, a rose garden, warm spices, the inside of a wooden chest. These memories point towards your preferred fragrance families.'],
      },
      {
        heading: 'Test on skin, not paper',
        paragraphs: ['Blotter strips show the opening, but perfume is designed to evolve with body warmth. Apply to your wrist, wait at least an hour and notice how the heart and base notes unfold.'],
        list: ['Test no more than three fragrances at a time', 'Smell coffee beans or your own skin between tests', 'Revisit your favourite after a few hours'],
      },
      {
        heading: 'Consider your lifestyle',
        paragraphs: ['Lighter citrus and musks suit offices and warm days, while oud and amber compositions shine in the evening and cooler months. Many people keep one daytime and one evening signature.'],
      },
      { paragraphs: ['Not sure where to begin? Our Fragrance Finder will match your preferences with perfumes from the collection in under a minute.'] },
    ],
  },
  {
    slug: 'understanding-oud',
    title: 'Understanding Oud: The Liquid Gold of Perfumery',
    category: 'Fragrance Notes',
    excerpt: 'Smoky, rich and endlessly complex — discover why oud remains one of perfumery’s most treasured materials.',
    readTime: '8 min read',
    date: '2026-09-02',
    bottle: { shape: 'faceted', cap: 'black', liquid: '#3a1d0e', label: 'gold' },
    accent: '#5a2a0c',
    relatedProducts: ['royal-oud-noir', 'saffron-crown', 'black-oud-intense'],
    body: [
      { paragraphs: ['Oud, also known as agarwood, is a fragrant resin formed within certain trees. Its scent is deep and layered — woody, smoky, slightly sweet and sometimes leathery.'] },
      {
        heading: 'A material with many faces',
        paragraphs: ['Different regions and distillation methods produce oud oils with distinct personalities. Some are bright and fruity, others dark and animalic. Perfumers often pair oud with rose, saffron or amber to bring out particular facets.'],
      },
      {
        heading: 'How to wear oud',
        paragraphs: ['Oud is powerful, so a little goes a long way. Begin with one or two sprays on pulse points and allow it to develop over several hours.'],
        list: ['Pair rose-oud blends with evening occasions', 'Try lighter oud compositions for daytime', 'Layer with a soft musk to round the edges'],
      },
    ],
  },
  {
    slug: 'the-art-of-fragrance-gifting',
    title: 'The Art of Fragrance Gifting',
    category: 'Gifting',
    excerpt: 'Choosing perfume for someone else can feel daunting. These simple principles make it a joy.',
    readTime: '5 min read',
    date: '2026-08-21',
    bottle: { shape: 'flacon', cap: 'orb', liquid: '#c2416b', label: 'ivory' },
    accent: '#5c1a1a',
    relatedProducts: ['heritage-discovery-set', 'her-signature-set', 'his-signature-set'],
    body: [
      { paragraphs: ['A fragrance gift says you have paid attention. The secret is to observe what the person already enjoys rather than guessing at something entirely new.'] },
      {
        heading: 'Read the clues',
        paragraphs: ['Notice the candles, flowers and foods they love. Someone who adores fresh flowers may enjoy a floral; a coffee lover might appreciate a warm amber or gourmand.'],
      },
      {
        heading: 'When in doubt, discover',
        paragraphs: ['A discovery set lets the recipient explore several fragrances and find their own favourite — a thoughtful choice when you are unsure.'],
      },
      { heading: 'Presentation matters', paragraphs: ['Add a handwritten note sharing why you chose the scent. It turns a beautiful bottle into a lasting memory.'] },
    ],
  },
  {
    slug: 'top-heart-base-notes-explained',
    title: 'Top, Heart and Base Notes Explained',
    category: 'Fragrance Notes',
    excerpt: 'Every perfume tells a story in three acts. Learn to read the fragrance pyramid.',
    readTime: '4 min read',
    date: '2026-08-05',
    bottle: { shape: 'tall', cap: 'crystal', liquid: '#e8c547', label: 'dark' },
    accent: '#6b5a14',
    relatedProducts: ['citrus-riviera', 'jasmine-nights', 'amber-sultan'],
    body: [
      { paragraphs: ['Perfumes are built from materials that evaporate at different rates. This creates a journey known as the fragrance pyramid.'] },
      { heading: 'Top notes', paragraphs: ['The first impression — usually bright citrus, herbs or light fruits. They sparkle for the first 10 to 30 minutes.'] },
      { heading: 'Heart notes', paragraphs: ['The character of the perfume, often florals and spices, emerging as the top notes fade and lasting several hours.'] },
      { heading: 'Base notes', paragraphs: ['The foundation — woods, musks, resins and oud. These rich materials linger longest and leave the memorable trail.'] },
    ],
  },
  {
    slug: 'how-to-make-perfume-last-longer',
    title: 'How to Make Your Perfume Last Longer',
    category: 'Perfume Care',
    excerpt: 'Simple, effective habits to help your fragrance stay beautiful from morning to night.',
    readTime: '4 min read',
    date: '2026-07-22',
    bottle: { shape: 'round', cap: 'gold', liquid: '#f1e6d2', label: 'gold' },
    accent: '#4a4030',
    relatedProducts: ['white-musk-silk', 'musk-al-layl', 'velvet-iris'],
    body: [
      { paragraphs: ['Longevity depends on the composition, your skin and how you apply it. A few habits can make a noticeable difference.'] },
      {
        heading: 'Application tips',
        paragraphs: ['Apply to moisturised skin, as fragrance holds better on hydrated skin than dry skin.'],
        list: ['Spray on pulse points: wrists, neck and behind the ears', 'Avoid rubbing wrists together', 'Lightly mist clothing or hair from a distance'],
      },
      {
        heading: 'Store it well',
        paragraphs: ['Heat, light and humidity break down perfume. Keep bottles in a cool, dark place — never in the bathroom or a hot car.'],
      },
    ],
  },
  {
    slug: 'fragrances-for-every-season',
    title: 'A Fragrance for Every Season',
    category: 'Guides',
    excerpt: 'From bright summer citrus to cosy winter amber — build a wardrobe that changes with the weather.',
    readTime: '5 min read',
    date: '2026-07-08',
    bottle: { shape: 'square', cap: 'tower', liquid: '#7c9a4a', label: 'ivory' },
    accent: '#2f4a3a',
    relatedProducts: ['neroli-garden', 'green-vetiver', 'golden-incense'],
    body: [
      { paragraphs: ['Temperature changes how fragrance behaves. Warm air amplifies scent, while cold air subdues it — so your perfume wardrobe can shift through the year.'] },
      { heading: 'Spring & summer', paragraphs: ['Reach for citrus, fresh and light floral compositions that feel airy in the heat.'] },
      { heading: 'Autumn & winter', paragraphs: ['Rich oud, amber, woods and oriental blends wrap you in warmth and project beautifully in cool air.'] },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
