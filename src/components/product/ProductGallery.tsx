import { useReducedMotion } from 'framer-motion';
import { Box, Move3d, Pause, Play, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PRODUCT_VIEWS, productImage, type ProductView } from '../../data/images';
import type { Product } from '../../data/types';
import SmartImage from '../ui/SmartImage';
import BottleArt from './BottleArt';

type ViewId = ProductView | '3d';
const VIEWS: { id: ViewId; label: string }[] = [...PRODUCT_VIEWS, { id: '3d', label: '360° model' }];

/**
 * Product gallery: six separately rendered views (not crops of one image),
 * zoom with pan, swipe / arrow-key navigation, plus an interactive 360° model
 * built from the same bottle geometry as the renders.
 */
export default function ProductGallery({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewId>('main');
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(!reduce);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const drag = useRef<{ x: number; a: number; moved: boolean } | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setView('main');
    setAngle(0);
    setZoom(false);
  }, [product.id]);

  const is3d = view === '3d';
  const label = VIEWS.find((v) => v.id === view)!.label;

  useEffect(() => {
    if (!is3d || !spinning || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      setAngle((a) => (a + (t - last) * 0.03) % 360);
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [is3d, spinning, reduce]);

  const step = (dir: number) => {
    const i = VIEWS.findIndex((v) => v.id === view);
    setView(VIEWS[(i + dir + VIEWS.length) % VIEWS.length].id);
    setZoom(false);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, a: angle, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (zoom && stage.current) {
      const r = stage.current.getBoundingClientRect();
      setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    }
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    if (is3d && !zoom) {
      setSpinning(false);
      setAngle((((drag.current.a + dx * 0.6) % 360) + 360) % 360);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || is3d || zoom) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    if (is3d) {
      setSpinning(false);
      setAngle((a) => (a + (e.key === 'ArrowLeft' ? -15 : 15) + 360) % 360);
    } else step(e.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row-reverse">
      <div className="relative min-w-0 flex-1">
        <div
          ref={stage}
          tabIndex={0}
          role="application"
          aria-roledescription="Product image viewer"
          aria-label={`${product.name} — ${label}. ${is3d ? 'Drag or use arrow keys to rotate.' : 'Swipe or use arrow keys to change view.'}`}
          onKeyDown={onKey}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onClick={() => !is3d && !drag.current?.moved && setZoom((z) => !z)}
          className={`relative aspect-[4/5] touch-pan-y select-none overflow-hidden border border-line/[0.08] bg-charcoal ${
            is3d && !zoom ? 'cursor-grab active:cursor-grabbing' : zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        >
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{ transform: `scale(${zoom ? 2.2 : 1})`, transformOrigin: `${origin.x}% ${origin.y}%` }}
          >
            {is3d ? (
              <div className="grain absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#3a2d1b_0%,#211a12_50%,#1a1510_100%)]">
                <div className="pointer-events-none absolute left-1/2 top-1/4 h-1/2 w-1/2 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: product.bottle.liquid }} />
                <BottleArt bottle={product.bottle} name={product.name} angle={angle} hq glow className="relative h-[86%] w-auto" title={`${product.name} — interactive 360° model`} />
              </div>
            ) : (
              <SmartImage
                key={view}
                src={productImage(product.slug, view)}
                width={1200}
                height={1500}
                eager={view === 'main'}
                alt={`${product.name} — ${label.toLowerCase()} (illustrative render)`}
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#3a2d1b,#1a1510)]">
                    <BottleArt bottle={product.bottle} name={product.name} angle={view === 'side' ? 90 : view === 'front' ? 0 : 24} className="h-[86%] w-auto" />
                  </div>
                }
              />
            )}
          </div>

          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-line/10 bg-black/60 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-[#F5F0E6]/80 backdrop-blur">
            {is3d ? (
              <>
                <Move3d size={13} className="text-gold" /> Drag to rotate · {Math.round(angle)}°
              </>
            ) : (
              <>
                {label} · <span className="text-muted">Illustrative render</span>
              </>
            )}
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {is3d && (
              <>
                <IconBtn label="Rotate left" onClick={() => { setSpinning(false); setAngle((a) => (a - 30 + 360) % 360); }}>
                  <RotateCcw size={15} />
                </IconBtn>
                <IconBtn label={spinning ? 'Pause rotation' : 'Auto rotate'} onClick={() => setSpinning((s) => !s)}>
                  {spinning ? <Pause size={15} /> : <Play size={15} />}
                </IconBtn>
                <IconBtn label="Rotate right" onClick={() => { setSpinning(false); setAngle((a) => (a + 30) % 360); }}>
                  <RotateCw size={15} />
                </IconBtn>
              </>
            )}
            <IconBtn label={zoom ? 'Zoom out' : 'Zoom in'} onClick={() => { setZoom((z) => !z); setSpinning(false); }}>
              {zoom ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
            </IconBtn>
          </div>
        </div>
      </div>

      <div className="scrollbar-none flex snap-x gap-3 overflow-x-auto lg:w-24 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Product views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => {
              setView(v.id);
              setZoom(false);
            }}
            className={`relative aspect-[4/5] w-20 shrink-0 snap-start overflow-hidden border bg-charcoal transition lg:w-full ${
              view === v.id ? 'border-gold' : 'border-line/10 hover:border-gold/50'
            }`}
            aria-label={v.label}
            title={v.label}
          >
            {v.id === '3d' ? (
              <span className="flex h-full flex-col items-center justify-center gap-1 bg-[radial-gradient(ellipse_at_center,#3a2d1b,#1e1812)] text-gold">
                <Box size={20} strokeWidth={1.2} />
                <span className="text-[0.55rem] uppercase tracking-[0.15em]">360°</span>
              </span>
            ) : (
              <SmartImage src={productImage(product.slug, v.id)} width={1200} height={1500} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line/15 bg-black/60 text-[#F5F0E6] backdrop-blur transition hover:border-gold hover:text-gold"
    >
      {children}
    </button>
  );
}
