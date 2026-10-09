import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { familyInfo, type FamilyInfo } from '../../data/collections';
import type { Family } from '../../data/types';

const SIZE = 420;
const C = SIZE / 2;
const R_OUT = 200;
const R_IN = 92;

function arc(i: number, n: number, rOut: number, rIn: number) {
  const gap = 0.012;
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + gap;
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - gap;
  const p = (r: number, a: number) => `${C + r * Math.cos(a)} ${C + r * Math.sin(a)}`;
  return `M ${p(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${p(rOut, a1)} L ${p(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${p(rIn, a0)} Z`;
}

export default function ScentWheel({ active, onSelect }: { active: Family | null; onSelect: (f: Family) => void }) {
  const [hover, setHover] = useState<FamilyInfo | null>(null);
  const n = familyInfo.length;
  const shown = hover ?? familyInfo.find((f) => f.family === active) ?? null;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <motion.svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full overflow-visible"
        initial={{ rotate: -40, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        role="group"
        aria-label="Fragrance families"
      >
        <defs>
          {familyInfo.map((f) => (
            <radialGradient key={f.family} id={`wheel-${f.family}`} cx="50%" cy="50%" r="60%">
              <stop offset="0.3" stopColor={f.color} stopOpacity="0.95" />
              <stop offset="1" stopColor={f.color} stopOpacity="0.45" />
            </radialGradient>
          ))}
        </defs>
        <circle cx={C} cy={C} r={R_OUT + 12} fill="none" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="0.8" />
        <circle cx={C} cy={C} r={R_OUT + 18} fill="none" stroke="#D4AF37" strokeOpacity="0.15" strokeWidth="0.5" strokeDasharray="2 6" />
        {familyInfo.map((f, i) => {
          const isActive = active === f.family;
          const mid = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
          const lr = (R_OUT + R_IN) / 2;
          return (
            <g
              key={f.family}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`${f.family}: ${f.mood}`}
              className="cursor-pointer outline-none"
              onClick={() => onSelect(f.family)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(f.family);
                }
              }}
              onMouseEnter={() => setHover(f)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(f)}
              onBlur={() => setHover(null)}
              style={{
                transform: isActive ? `translate(${Math.cos(mid) * 10}px, ${Math.sin(mid) * 10}px)` : undefined,
                transition: 'transform .4s cubic-bezier(.22,1,.36,1)',
              }}
            >
              <path
                d={arc(i, n, R_OUT, R_IN)}
                fill={`url(#wheel-${f.family})`}
                stroke={isActive ? '#F9E076' : '#1a1510'}
                strokeWidth={isActive ? 2 : 1}
                opacity={active && !isActive ? 0.45 : 1}
                className="transition-opacity duration-300 hover:opacity-100"
              />
              <text
                x={C + Math.cos(mid) * lr}
                y={C + Math.sin(mid) * lr}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={f.family === 'Musk' || f.family === 'Citrus' ? '#111' : '#F5F0E6'}
                fontFamily="Inter, sans-serif"
                fontSize="12"
                letterSpacing="2.4"
                className="pointer-events-none select-none uppercase"
              >
                {f.family.toUpperCase()}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R_IN - 8} fill="#1e1812" stroke="#D4AF37" strokeOpacity="0.5" />
      </motion.svg>

      <div className="theme-dark pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[34%] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={shown?.family ?? 'none'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {shown ? (
                <>
                  <p className="font-serif text-2xl leading-none text-gold sm:text-3xl">{shown.family}</p>
                  <p className="mt-2 text-[0.55rem] uppercase leading-4 tracking-[0.16em] text-muted">{shown.mood}</p>
                </>
              ) : (
                <>
                  <p className="font-serif text-xl leading-tight text-ivory sm:text-2xl">Choose a family</p>
                  <p className="mt-2 text-[0.55rem] uppercase tracking-[0.18em] text-muted">Tap a segment</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
