import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Locks body scroll, traps focus, closes on Escape and restores focus. */
export function useOverlay(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const els = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose, ref]);
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = 'max-w-4xl',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, ref);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative max-h-[92vh] w-full overflow-y-auto border border-gold/25 bg-charcoal shadow-2xl shadow-black ${className}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={onClose} className="absolute right-3 top-3 z-10 p-2 text-ivory/70 transition hover:text-gold" aria-label="Close dialog">
              <X size={20} strokeWidth={1.4} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
