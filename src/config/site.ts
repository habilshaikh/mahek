// Central, editable business details. Everything here is PLACEHOLDER content —
// replace with the real Mahek Perfume details before launch.
export const site = {
  name: 'Mahek Perfume',
  since: 1982,
  tagline: 'A Legacy of Fragrance Since 1982',
  logoSrc: '/brand/mahek-logo.png',
  currency: 'INR',
  locale: 'en-IN',
  contact: {
    email: 'hello@your-domain.example',
    phone: '+00 0000 000 000',
    address: 'Boutique address — to be confirmed',
    hours: 'Opening hours — to be confirmed',
  },
  social: [
    { label: 'Instagram', href: '#social-instagram' },
    { label: 'Facebook', href: '#social-facebook' },
    { label: 'YouTube', href: '#social-youtube' },
  ],
  shipping: {
    freeThreshold: 5000,
    standard: 250,
    express: 450,
  },
};

const formatter = new Intl.NumberFormat(site.locale, {
  style: 'currency',
  currency: site.currency,
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => formatter.format(Math.round(value));
