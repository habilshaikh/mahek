import { Check, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormField, isEmail, SelectField, TextArea } from '../components/ui/FormField';
import NewsletterForm from '../components/ui/NewsletterForm';
import { DemoNotice, PageHero, usePageMeta } from '../components/ui/primitives';
import { site } from '../config/site';

type F = { name: string; email: string; subject: string; message: string };

export default function Contact() {
  usePageMeta('Contact Us', 'Get in touch with Mahek Perfume.');
  const [f, setF] = useState<F>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<F>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<F> = {};
    if (f.name.trim().length < 2) err.name = 'Please enter your name.';
    if (!isEmail(f.email)) err.email = 'Please enter a valid email address.';
    if (!f.subject) err.subject = 'Please choose a subject.';
    if (f.message.trim().length < 10) err.message = 'Please write at least 10 characters.';
    setErrors(err);
    if (!Object.keys(err).length) setSent(true);
  };

  const details = [
    { icon: MapPin, label: 'Boutique', value: site.contact.address },
    { icon: Phone, label: 'Telephone', value: site.contact.phone },
    { icon: Mail, label: 'Email', value: site.contact.email },
    { icon: Clock, label: 'Hours', value: site.contact.hours },
  ];

  return (
    <>
      <PageHero eyebrow="Client Care" title="We would love to hear from you" text="Questions about a fragrance, an order or a gift? Send us a note and our team will be glad to help." crumbs={[{ label: 'Contact' }]} />
      <section className="container-lux grid gap-14 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-lux p-6 sm:p-10">
          {sent ? (
            <div className="py-12 text-center" role="status">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold">
                <Check className="text-gold" />
              </span>
              <h2 className="mt-6 text-4xl">Thank you, {f.name.split(' ')[0]}</h2>
              <p className="mx-auto mt-4 max-w-md text-muted">Your message passed validation. This is a demo: nothing has been sent or stored, and no email will be delivered.</p>
              <button
                onClick={() => {
                  setSent(false);
                  setF({ name: '', email: '', subject: '', message: '' });
                }}
                className="btn-outline mt-8"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-6">
              <h2 className="text-3xl">Send a message</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Name" required value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <FormField label="Email" type="email" required value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              </div>
              <SelectField label="Subject" required value={f.subject} onChange={set('subject')} error={errors.subject}>
                <option value="">Select a subject</option>
                <option>Fragrance advice</option>
                <option>An existing order</option>
                <option>Gifting &amp; corporate orders</option>
                <option>Press &amp; partnerships</option>
                <option>Something else</option>
              </SelectField>
              <TextArea label="Message" required value={f.message} onChange={set('message')} error={errors.message} />
              <DemoNotice>This form validates in your browser only. Submissions are not sent to any server.</DemoNotice>
              <button className="btn-gold w-full sm:w-auto">Send message</button>
            </form>
          )}
        </div>
        <aside>
          <h2 className="text-3xl">Visit &amp; connect</h2>
          <ul className="mt-8 space-y-6">
            {details.map((d) => (
              <li key={d.label} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30">
                  <d.icon size={17} className="text-gold" />
                </span>
                <span>
                  <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-muted">{d.label}</span>
                  <span className="mt-1 block text-ivory/85">{d.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted">All contact details shown are editable placeholders (see src/config/site.ts).</p>
          <div className="hairline my-10" />
          <p className="eyebrow mb-4">Quick answers</p>
          <p className="text-sm text-muted">
            Many questions are answered in our <Link to="/faq" className="text-gold hover:underline">FAQ</Link>, or you can <Link to="/track-order" className="text-gold hover:underline">track an order</Link>.
          </p>
          <div className="mt-10">
            <p className="eyebrow mb-4">Newsletter</p>
            <NewsletterForm compact />
          </div>
        </aside>
      </section>
    </>
  );
}
