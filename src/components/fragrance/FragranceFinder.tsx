import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, RefreshCw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { familyInfo } from '../../data/collections';
import { formatPrice } from '../../config/site';
import { minPrice } from '../../data/products';
import { useShop } from '../../store/ShopContext';
import { BUDGETS, NOTE_OPTIONS, recommend, type Answers } from './finderLogic';
import { ProductStage } from '../product/ProductCard';
import { familyPhoto, photo } from '../../data/images';

type Opt = { value: string; label: string; hint?: string; color?: string; img?: string };
type Step = { key: keyof Answers; title: string; subtitle: string; options: Opt[]; multi?: boolean };

const STEPS: Step[] = [
  {
    key: 'family',
    title: 'Which fragrance family do you prefer?',
    subtitle: 'Choose the world of scent that feels most like you.',
    options: [
      ...familyInfo.map((f) => ({ value: f.family, label: f.family, hint: f.mood, color: f.color, img: photo(familyPhoto[f.family].key) })),
      { value: 'any', label: 'Surprise me', hint: 'Open to anything', color: '#D4AF37' },
    ],
  },
  {
    key: 'occasion',
    title: 'What is the occasion?',
    subtitle: 'Where will this fragrance accompany you?',
    options: [
      { value: 'everyday', label: 'Everyday', hint: 'A reliable daily companion' },
      { value: 'office', label: 'Office', hint: 'Polished and considerate' },
      { value: 'evening', label: 'Evening', hint: 'Dinners and nights out' },
      { value: 'special', label: 'Special occasion', hint: 'Weddings, festivals, celebrations' },
    ],
  },
  {
    key: 'intensity',
    title: 'What intensity do you like?',
    subtitle: 'How noticeable should your scent trail be?',
    options: [
      { value: 'light', label: 'Light', hint: 'An intimate skin scent' },
      { value: 'moderate', label: 'Moderate', hint: 'Noticed when close' },
      { value: 'intense', label: 'Intense', hint: 'A memorable trail' },
    ],
  },
  {
    key: 'season',
    title: 'Which season are you shopping for?',
    subtitle: 'Temperature changes how fragrance performs.',
    options: [
      { value: 'spring', label: 'Spring', hint: 'Fresh blooms' },
      { value: 'summer', label: 'Summer', hint: 'Light and bright' },
      { value: 'autumn', label: 'Autumn', hint: 'Warm woods and spice' },
      { value: 'winter', label: 'Winter', hint: 'Rich and enveloping' },
    ],
  },
  {
    key: 'budget',
    title: 'What is your budget?',
    subtitle: 'We will find options in your preferred range.',
    options: Object.entries(BUDGETS).map(([value, b]) => ({ value, label: b.label })),
  },
  {
    key: 'notes',
    title: 'Which fragrance notes do you love?',
    subtitle: 'Select up to three notes — or skip if you are unsure.',
    multi: true,
    options: NOTE_OPTIONS.map((n) => ({ value: n, label: n })),
  },
];

export default function FragranceFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ notes: [] });
  const [done, setDone] = useState(false);
  const { addToCart } = useShop();

  const current = STEPS[step];
  const value = answers[current.key];
  const answered = current.multi ? true : !!value;
  const results = useMemo(() => (done ? recommend(answers, 3) : []), [done, answers]);

  const choose = (v: string) => {
    if (current.multi) {
      setAnswers((a) => {
        const has = a.notes.includes(v);
        if (!has && a.notes.length >= 3) return a;
        return { ...a, notes: has ? a.notes.filter((n) => n !== v) : [...a.notes, v] };
      });
      return;
    }
    setAnswers((a) => ({ ...a, [current.key]: v }));
    window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 280);
  };

  const next = () => (step === STEPS.length - 1 ? setDone(true) : setStep(step + 1));
  const restart = () => {
    setAnswers({ notes: [] });
    setStep(0);
    setDone(false);
  };
  const labelFor = (s: Step) => {
    const v = answers[s.key];
    if (Array.isArray(v)) return v.length ? v.join(', ') : 'No preference';
    return s.options.find((o) => o.value === v)?.label ?? '—';
  };

  if (done) {
    return (
      <div>
        <div className="mb-10 text-center">
          <span className="demo-badge">
            <Sparkles size={12} /> Your matches
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl">Fragrances chosen for you</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">Matched in your browser using simple rules against our sample catalogue — no data leaves your device.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {results.map((r, i) => (
            <motion.article
              key={r.product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`card-lux relative flex flex-col p-6 ${i === 0 ? 'border-gold/40' : ''}`}
            >
              {i === 0 && <span className="absolute -top-3 left-6 bg-gold px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ongold">Best match</span>}
              <Link to={`/product/${r.product.slug}`} className="group relative block" aria-label={`View ${r.product.name}`}>
                <ProductStage product={r.product} className="aspect-[4/5]" />
              </Link>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="eyebrow">{r.product.families.slice(0, 2).join(' · ')}</p>
                <p className="font-serif text-2xl text-gold">{r.match}%</p>
              </div>
              <h3 className="mt-1 text-2xl">{r.product.name}</h3>
              <p className="mt-2 text-xs leading-5 text-muted">
                {[...r.product.notes.top, ...r.product.notes.heart].slice(0, 4).join(' · ')}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {r.reasons.slice(0, 4).map((x) => (
                  <li key={x} className="flex items-center gap-1 border border-line/10 px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-ivory/70">
                    <Check size={10} className="text-gold" /> {x}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm">
                <span className="text-muted">From </span>
                {formatPrice(minPrice(r.product))}
              </p>
              <div className="mt-5 flex gap-2 pt-1">
                <Link to={`/product/${r.product.slug}`} className="btn-outline flex-1 px-3">
                  View product
                </Link>
                <button className="btn-gold px-4" disabled={!r.product.inStock} onClick={() => addToCart(r.product)} aria-label={`Add ${r.product.name} to bag`}>
                  {r.product.inStock ? 'Add' : 'Sold out'}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 card-lux p-6">
          <p className="eyebrow mb-4">Your answers — click any to change</p>
          <div className="flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                className="chip normal-case tracking-normal"
                onClick={() => {
                  setDone(false);
                  setStep(i);
                }}
              >
                <span className="text-muted">{i + 1}.</span> {labelFor(s)}
              </button>
            ))}
          </div>
          <button onClick={restart} className="btn-ghost mt-6 text-gold">
            <RefreshCw size={14} /> Start again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* progress */}
      <div className="mb-10">
        <div className="mb-3 flex justify-between text-[0.65rem] uppercase tracking-[0.24em] text-muted">
          <span>
            Question {step + 1} of {STEPS.length}
          </span>
          <span>{Math.round((step / STEPS.length) * 100)}% complete</span>
        </div>
        <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Quiz progress">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => {
                if (i <= step || answers[STEPS[i - 1].key]) setStep(i);
              }}
              className={`h-1 flex-1 transition-colors ${i < step ? 'bg-gold' : i === step ? 'bg-gold-light' : 'bg-line/10'}`}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
          <h2 className="text-center text-3xl sm:text-5xl">{current.title}</h2>
          <p className="mt-3 text-center text-muted">{current.subtitle}</p>

          <div
            className={`mt-10 grid gap-3 ${current.options.length > 6 ? 'grid-cols-2 sm:grid-cols-3' : current.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
            role={current.multi ? 'group' : 'radiogroup'}
            aria-label={current.title}
          >
            {current.options.map((o) => {
              const selected = Array.isArray(value) ? value.includes(o.value) : value === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => choose(o.value)}
                  role={current.multi ? 'checkbox' : 'radio'}
                  aria-checked={selected}
                  className={`group relative flex items-center gap-4 border p-4 text-left transition sm:p-5 ${
                    selected ? 'border-gold bg-gold/10' : 'border-line/10 bg-line/[0.02] hover:border-gold/50'
                  }`}
                >
                  {o.img ? (
                    <img src={o.img} alt="" loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-full border border-line/20 object-cover" />
                  ) : (
                    o.color && <span className="h-8 w-8 shrink-0 rounded-full border border-line/20" style={{ background: `radial-gradient(circle at 30% 30%, #fff6, ${o.color})` }} />
                  )}
                  <span className="flex-1">
                    <span className="block font-serif text-xl">{o.label}</span>
                    {o.hint && <span className="mt-0.5 block text-xs text-muted">{o.hint}</span>}
                  </span>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-gold bg-gold text-ongold' : 'border-line/20'}`}>
                    {selected && <Check size={12} />}
                  </span>
                </button>
              );
            })}
          </div>
          {current.multi && <p className="mt-4 text-center text-xs text-muted">{answers.notes.length}/3 selected</p>}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-ghost disabled:opacity-30">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={next} disabled={!answered} className="btn-gold">
          {step === STEPS.length - 1 ? 'Reveal my matches' : 'Next'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
