import { Link } from 'react-router-dom';
import BottleArt from '../components/product/BottleArt';
import { usePageMeta } from '../components/ui/primitives';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="theme-dark grain relative flex min-h-[90svh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#382b17,#1a1510_65%)] pt-28">
      <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-serif text-[36vw] leading-none text-line/[0.03]" aria-hidden>
        404
      </p>
      <div className="container-lux relative grid items-center gap-10 md:grid-cols-2">
        <div className="flex h-80 justify-center md:h-[440px]">
          <BottleArt bottle={{ shape: 'flacon', cap: 'orb', liquid: '#c9a066', label: 'gold' }} name="Lost Scent" angle={-20} fill={0.15} glow className="h-full w-auto animate-float" />
        </div>
        <div className="text-center md:text-left">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-4 text-5xl leading-tight sm:text-6xl">This scent has drifted away</h1>
          <p className="mt-5 max-w-md text-muted md:mx-0 mx-auto">The page you are looking for may have moved or no longer exists. Let us guide you back.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link to="/" className="btn-gold">
              Back to home
            </Link>
            <Link to="/shop" className="btn-outline">
              Shop perfumes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
