import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Lightweight canvas of drifting gold dust. Disabled for reduced motion. */
export default function GoldParticles({ count = 60, className = '' }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 640;
    const n = lowPower ? Math.round(count * 0.5) : count;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ps = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.12,
      t: Math.random() * Math.PI * 2,
    }));
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        p.t += 0.02;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        const a = 0.35 + Math.sin(p.t) * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(249, 224, 118, ${Math.max(0, a)})`;
        ctx.shadowColor = 'rgba(212,175,55,0.9)';
        ctx.shadowBlur = p.r * 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [count, reduce]);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
