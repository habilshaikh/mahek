import { collections } from '../../data/collections';

export const mainNav = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections/bestsellers', mega: true },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Fragrance Finder', to: '/fragrance-finder' },
  { label: 'Contact', to: '/contact' },
];

export const collectionLinks = collections.map((c) => ({ label: c.title, to: `/collections/${c.slug}`, eyebrow: c.eyebrow }));

export const discoverLinks = [
  { label: 'Fragrance Finder', to: '/fragrance-finder' },
  { label: 'Scent Wheel', to: '/scent-wheel' },
  { label: 'Fragrance Journal', to: '/journal' },
  { label: 'Our Story', to: '/our-story' },
];

export const serviceLinks = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'My Account', to: '/account' },
  { label: 'Shipping Policy', to: '/shipping-policy' },
  { label: 'Returns & Refunds', to: '/returns-policy' },
];

export const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Shipping', to: '/shipping-policy' },
  { label: 'Returns', to: '/returns-policy' },
  { label: 'Image Credits', to: '/image-credits' },
];
