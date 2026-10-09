import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

export interface AccordionItem {
  q: string;
  a: ReactNode;
}

export default function Accordion({ items, defaultOpen = -1 }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const base = useId();
  return (
    <div className="divide-y divide-line/10 border-y border-line/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-xl text-ivory transition hover:text-gold"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                {item.q}
                <Plus size={18} strokeWidth={1.3} className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-10 leading-7 text-ivory/70">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
