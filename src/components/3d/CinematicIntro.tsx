import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Product } from '../../data/types';
import { productImage } from '../../data/images';
import Logo from '../ui/Logo';
import GoldParticles from './GoldParticles';

const KEY = 'mahek.introSeen';

/** Should the intro play? Once per browser session, never for reduced motion. */
export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !window.sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

export default function CinematicIntro({ product, onDone }: { product: Product; onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  const finish = () => {
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  useEffect(() => {
    const t = window.setTimeout(finish, 4200);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="theme-dark fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden bg-obsidian"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          role="dialog"
          aria-label="Mahek Perfume introduction"
        >
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1.4 }}>
            <GoldParticles count={50} />
          </motion.div>

          {/* emerging light */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_60%)]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 1.8, ease: 'easeOut' }}
          />

          {/* logo reveal */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)', filter: 'drop-shadow(0 0 0 rgba(212,175,55,0))' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)', filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.55))' }}
            transition={{ delay: 0.35, duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
          >
            <Logo size="xl" />
            <motion.span
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_30%,rgba(255,246,200,0.55)_50%,transparent_70%)] mix-blend-overlay"
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ delay: 1.5, duration: 1.1, ease: 'easeInOut' }}
              aria-hidden
            />
          </motion.div>

          {/* bottle emerging from darkness */}
          <motion.div
            className="relative z-10 mt-6 h-[34vh]"
            initial={{ opacity: 0, y: 50, filter: 'brightness(0)' }}
            animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
            transition={{ delay: 1.5, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={productImage(product.slug, 'cutout')} alt="" className="h-full w-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)]" decoding="async" />
          </motion.div>

          <motion.p
            className="relative z-10 mt-4 font-serif text-lg italic text-ivory/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
          >
            A Legacy of Fragrance Since 1982
          </motion.p>

          <button onClick={finish} className="btn-ghost absolute bottom-8 right-6 z-20 border border-line/15 px-4 py-2 sm:right-10" autoFocus>
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
