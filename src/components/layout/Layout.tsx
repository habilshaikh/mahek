import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Info, X } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useShop } from '../../store/ShopContext';
import CartDrawer from '../cart/CartDrawer';
import QuickViewModal from '../product/QuickViewModal';
import Footer from './Footer';
import Header from './Header';
import MobileTabBar from './MobileTabBar';
import SearchOverlay from './SearchOverlay';

function Toasts() {
  const { toasts, dismissToast } = useShop();
  return (
    <div className="pointer-events-none fixed bottom-[84px] left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0 lg:bottom-4" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-auto flex items-center gap-3 border border-gold/30 bg-charcoal/95 px-4 py-3 text-sm shadow-xl shadow-black/60 backdrop-blur"
            role="status"
          >
            {t.tone === 'success' ? <Check size={16} className="text-gold" /> : t.tone === 'error' ? <AlertCircle size={16} className="text-red-400" /> : <Info size={16} className="text-muted" />}
            <span className="flex-1 text-ivory/90">{t.message}</span>
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-muted hover:text-ivory">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col pb-[calc(60px+env(safe-area-inset-bottom))] lg:pb-0">
      <a href="#main" className="sr-only z-[200] bg-gold px-4 py-2 text-ongold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header />
      <motion.main id="main" key={pathname} className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Suspense
          fallback={
            <div className="flex min-h-[80vh] items-center justify-center" role="status" aria-label="Loading">
              <span className="h-10 w-10 animate-spin rounded-full border border-gold/20 border-t-gold" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <SearchOverlay />
      <MobileTabBar />
      <Toasts />
    </div>
  );
}
