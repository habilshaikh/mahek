import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Move3d } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HERO_TURN_FRAMES, heroTurnFrame, productImage } from '../../data/images';
import type { Product } from '../../data/types';
import BottleArt from '../product/BottleArt';
import GoldParticles from './GoldParticles';

const STEP = 360 / HERO_TURN_FRAMES;
const frameFor = (angle: number) => ((Math.round(angle / STEP) % HERO_TURN_FRAMES) + HERO_TURN_FRAMES) % HERO_TURN_FRAMES;

/**
 * 3D showroom: a genuine 36-frame turntable image sequence of the hero bottle
 * (drag / touch / arrow keys to rotate), layered cut-out satellites with mouse
 * parallax, CSS perspective tilt and a mirrored floor reflection.
 */
export default function PerfumeScene({ hero, satellites }: { hero: Product; satellites: Product[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const tiltX = useTransform(sy, [-1, 1], [6, -6]);
  const tiltY = useTransform(sx, [-1, 1], [-8, 8]);
  const farX = useTransform(sx, [-1, 1], [-16, 16]);
  const farY = useTransform(sy, [-1, 1], [-10, 10]);
  const nearX = useTransform(sx, [-1, 1], [34, -34]);
  const nearY = useTransform(sy, [-1, 1], [18, -18]);
  const lightX = useTransform(sx, [-1, 1], ['35%', '65%']);

  const [angle, setAngle] = useState(-20);
  const [framesReady, setFramesReady] = useState(false);
  const [framesFailed, setFramesFailed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; a: number } | null>(null);
  const idle = useRef(true);

  // preload the turntable sequence once the page is idle
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      let done = 0;
      for (let i = 0; i < HERO_TURN_FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (++done === HERO_TURN_FRAMES && !cancelled) setFramesReady(true);
        };
        img.onerror = () => !cancelled && setFramesFailed(true);
        img.src = heroTurnFrame(i);
      }
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start);
    else window.setTimeout(start, 300);
    return () => {
      cancelled = true;
    };
  }, []);

  // gentle idle sway once frames are ready
  useEffect(() => {
    if (reduce || !framesReady) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      if (idle.current) setAngle(Math.sin((t - t0) / 2600) * 30 - 10);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, framesReady]);

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r && e.pointerType === 'mouse') {
      mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
      my.set(((e.clientY - r.top) / r.height) * 2 - 1);
    }
    if (drag.current) setAngle(drag.current.a - (e.clientX - drag.current.x) * 0.7);
  };
  const onDown = (e: React.PointerEvent) => {
    idle.current = false;
    setDragging(true);
    drag.current = { x: e.clientX, a: angle };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
    window.setTimeout(() => (idle.current = true), 2500);
  };

  const frame = framesReady ? frameFor(angle) : frameFor(-20);
  const src = heroTurnFrame(frame);
  const alt = `${hero.name} — rotating product render`;

  return (
    <div
      ref={ref}
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="pointer-events-none absolute -top-[20%] h-[90%] w-[70%] -translate-x-1/2 opacity-70"
        style={{ left: lightX, background: 'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(249,224,118,0.16) 180deg, transparent 200deg)' }}
        aria-hidden
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_65%)]" aria-hidden />
      <GoldParticles count={70} />

      {/* far satellites */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: farX, y: farY }} aria-hidden>
        {satellites[0] && <img src={productImage(satellites[0].slug, 'cutout')} alt="" className="absolute left-[2%] top-[16%] h-[36%] w-auto opacity-45 blur-[1.5px]" />}
        {satellites[1] && <img src={productImage(satellites[1].slug, 'cutout')} alt="" className="absolute right-[0%] top-[6%] h-[30%] w-auto opacity-35 blur-[2px]" />}
      </motion.div>

      {/* hero bottle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className={`relative h-[86%] touch-pan-y select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d', aspectRatio: '700 / 1190' }}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          tabIndex={0}
          role="slider"
          aria-label={`Rotate ${hero.name}`}
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={frame * STEP}
          aria-valuetext={`${frame * STEP} degrees`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault();
              idle.current = false;
              setAngle((a) => a + (e.key === 'ArrowLeft' ? -STEP : STEP));
            }
          }}
        >
          <div className={`h-full ${reduce ? '' : 'animate-float'}`}>
            {framesFailed ? (
              <BottleArt bottle={hero.bottle} name={hero.name} angle={angle} hq glow className="h-full w-auto" title={alt} />
            ) : (
              <img src={src} alt={alt} width={700} height={1190} draggable={false} {...{ fetchpriority: 'high' }} className="h-full w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.85)]" />
            )}
            <div className="pointer-events-none absolute left-0 right-0 top-[88%] h-[40%] overflow-hidden opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden>
              {!framesFailed && (
                <img src={src} alt="" draggable={false} className="mx-auto block h-[250%] w-auto" style={{ transform: 'translateY(-11.8%) scaleY(-1)' }} />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* near satellite */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: nearX, y: nearY }} aria-hidden>
        {satellites[2] && <img src={productImage(satellites[2].slug, 'cutout')} alt="" className="absolute bottom-[4%] left-[4%] h-[32%] w-auto drop-shadow-2xl sm:left-[8%]" />}
      </motion.div>

      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-ivory/50">
        <Move3d size={13} className="text-gold" /> Drag to rotate 360°
      </div>
    </div>
  );
}
