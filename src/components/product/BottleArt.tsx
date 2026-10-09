import { useId, type CSSProperties } from 'react';
import type { BottleShape, BottleStyle } from '../../data/types';

/* ---------- colour helpers ---------- */
const clamp = (n: number, a = 0, b = 255) => Math.min(b, Math.max(a, n));
export function shade(hex: string, amt: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = (c: number) => Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt));
  return `#${[f(r), f(g), f(b)].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')}`;
}

/* ---------- geometry ---------- */
interface Geo {
  hw: number; // front half-width
  depth: number; // side depth ratio
  top: number;
  bottom: number;
  r: number;
  neck: number;
}

const GEO: Record<BottleShape, Geo> = {
  classic: { hw: 60, depth: 0.55, top: 132, bottom: 300, r: 14, neck: 15 },
  tall: { hw: 43, depth: 0.7, top: 104, bottom: 302, r: 10, neck: 13 },
  round: { hw: 74, depth: 0.85, top: 146, bottom: 302, r: 0, neck: 14 },
  faceted: { hw: 62, depth: 0.62, top: 130, bottom: 300, r: 0, neck: 15 },
  flacon: { hw: 64, depth: 0.5, top: 128, bottom: 300, r: 12, neck: 14 },
  square: { hw: 66, depth: 0.42, top: 150, bottom: 300, r: 6, neck: 16 },
};

const CX = 100;

function bodyPath(shape: BottleShape, hw: number, top: number, bottom: number, r: number) {
  const l = CX - hw;
  const rt = CX + hw;
  switch (shape) {
    case 'round': {
      const ry = (bottom - top) / 2;
      const cy = top + ry;
      return `M ${l} ${cy} A ${hw} ${ry} 0 1 0 ${rt} ${cy} A ${hw} ${ry} 0 1 0 ${l} ${cy} Z`;
    }
    case 'faceted': {
      const c = Math.min(20, hw * 0.34);
      return `M ${l + c} ${top} L ${rt - c} ${top} L ${rt} ${top + c} L ${rt} ${bottom - c} L ${rt - c} ${bottom} L ${l + c} ${bottom} L ${l} ${bottom - c} L ${l} ${top + c} Z`;
    }
    case 'flacon': {
      const n = 16;
      return `M ${l} ${bottom - r} L ${l} ${top + 56} C ${l} ${top + 14} ${CX - n - 6} ${top} ${CX - n} ${top} L ${CX + n} ${top} C ${CX + n + 6} ${top} ${rt} ${top + 14} ${rt} ${top + 56} L ${rt} ${bottom - r} Q ${rt} ${bottom} ${rt - r} ${bottom} L ${l + r} ${bottom} Q ${l} ${bottom} ${l} ${bottom - r} Z`;
    }
    default: {
      const rTop = shape === 'classic' ? Math.min(26, hw * 0.45) : r;
      return `M ${l + rTop} ${top} L ${rt - rTop} ${top} Q ${rt} ${top} ${rt} ${top + rTop} L ${rt} ${bottom - r} Q ${rt} ${bottom} ${rt - r} ${bottom} L ${l + r} ${bottom} Q ${l} ${bottom} ${l} ${bottom - r} L ${l} ${top + rTop} Q ${l} ${top} ${l + rTop} ${top} Z`;
    }
  }
}

const LABEL_THEMES = {
  dark: { bg: '#0b0b0b', fg: '#D4AF37', sub: '#A6A6A6', border: '#D4AF37' },
  ivory: { bg: '#F5F0E6', fg: '#111111', sub: '#5a5246', border: '#9C7F22' },
  gold: { bg: 'gold', fg: '#111111', sub: '#3a2f10', border: '#F9E076' },
};

export interface BottleArtProps {
  bottle: BottleStyle;
  name?: string;
  /** Rotation around the vertical axis in degrees */
  angle?: number;
  className?: string;
  shadow?: boolean;
  glow?: boolean;
  /** Fraction of the bottle filled with liquid */
  fill?: number;
  title?: string;
  style?: CSSProperties;
  /** High-quality mode used for rendered product imagery: soft bloom, rim light, glass base. */
  hq?: boolean;
}

export default function BottleArt({
  bottle,
  name = 'Mahek',
  angle = 0,
  className = '',
  shadow = true,
  glow = false,
  fill = 0.78,
  title,
  style,
  hq = false,
}: BottleArtProps) {
  const uid = useId().replace(/:/g, '');
  const g = GEO[bottle.shape];
  const rad = (angle * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const b = g.hw * g.depth;
  const hwEff = g.hw * Math.abs(c) + b * Math.abs(s);
  const isBoxy = bottle.shape !== 'round';

  const liquid = bottle.liquid;
  const label = LABEL_THEMES[bottle.label ?? 'dark'];
  const body = bodyPath(bottle.shape, hwEff, g.top, g.bottom, g.r);
  const inner = bodyPath(bottle.shape, Math.max(hwEff - 6, 4), g.top + 7, g.bottom - 6, Math.max(g.r - 4, 0));
  const liquidTop = g.bottom - (g.bottom - g.top) * fill;

  // front & back label faces
  const labelW = Math.min(g.hw * 1.3, 84);
  const labelH = bottle.shape === 'square' ? 70 : 78;
  const labelY = bottle.shape === 'round' ? 196 : g.top + (g.bottom - g.top) * 0.36;
  const frontCx = CX + (isBoxy ? b * s : g.hw * 0.6 * s);
  const frontScale = Math.max(0, c);
  const backCx = CX - (isBoxy ? b * s : g.hw * 0.6 * s);
  const backScale = Math.max(0, -c);

  // interior facet edge for boxy bottles
  const edgeX = s >= 0 ? CX + b * s - g.hw * Math.abs(c) : CX + b * s + g.hw * Math.abs(c);
  const showEdge = isBoxy && Math.abs(s) > 0.06 && Math.abs(c) > 0.06;
  const sideIsLeft = s * c > 0;

  const words = name.toUpperCase().split(' ');
  const mid = Math.ceil(words.length / 2);
  const nameLines = words.length > 2 ? [words.slice(0, mid).join(' '), words.slice(mid).join(' ')] : [words.join(' ')];

  const capTop = g.top - 14 - capHeight(bottle.cap);

  return (
    <svg
      viewBox="0 0 200 340"
      className={className}
      role="img"
      aria-label={title ?? `${name} perfume bottle`}
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        <linearGradient id={`liq${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(liquid, 0.25)} />
          <stop offset="0.5" stopColor={liquid} />
          <stop offset="1" stopColor={shade(liquid, -0.45)} />
        </linearGradient>
        <linearGradient id={`liqH${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`glass${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.12" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="0.88" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`gold${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e5514" />
          <stop offset="0.22" stopColor="#D4AF37" />
          <stop offset="0.42" stopColor="#F9E076" />
          <stop offset="0.55" stopColor="#D4AF37" />
          <stop offset="0.85" stopColor="#8a6b1a" />
          <stop offset="1" stopColor="#4a3a0c" />
        </linearGradient>
        <linearGradient id={`goldV${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9E076" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#8a6b1a" />
        </linearGradient>
        <linearGradient id={`black${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.3" stopColor="#2a2a2a" />
          <stop offset="0.42" stopColor="#555" />
          <stop offset="0.55" stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <radialGradient id={`orb${uid}`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#FFF6C8" />
          <stop offset="0.3" stopColor="#F9E076" />
          <stop offset="0.65" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#5a4410" />
        </radialGradient>
        <linearGradient id={`crys${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`shadow${uid}`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`caustic${uid}`}>
          <stop offset="0" stopColor={liquid} stopOpacity="0.55" />
          <stop offset="1" stopColor={liquid} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`halo${uid}`}>
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#D4AF37" stopOpacity="0.06" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <filter id={`bloom${uid}`} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id={`bloomWide${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id={`liqGlow${uid}`} cx="0.45" cy="0.55" r="0.6">
          <stop offset="0" stopColor={shade(liquid, 0.55)} stopOpacity="0.55" />
          <stop offset="1" stopColor={shade(liquid, 0.55)} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`rim${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9E076" stopOpacity="0" />
          <stop offset="0.35" stopColor="#F9E076" stopOpacity="0.9" />
          <stop offset="0.8" stopColor="#D4AF37" stopOpacity="0.7" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`inner${uid}`}>
          <path d={inner} />
        </clipPath>
        <clipPath id={`body${uid}`}>
          <path d={body} />
        </clipPath>
      </defs>

      {glow && <ellipse cx={CX} cy={200} rx={150} ry={170} fill={`url(#halo${uid})`} />}

      {shadow && (
        <>
          <ellipse cx={CX} cy={g.bottom + 6} rx={hwEff * 1.35} ry={12} fill={`url(#shadow${uid})`} />
          <ellipse cx={CX + 14} cy={g.bottom + 10} rx={hwEff * 1.1} ry={9} fill={`url(#caustic${uid})`} />
        </>
      )}

      {/* glass body */}
      <path d={body} fill={shade(liquid, -0.7)} fillOpacity="0.35" />

      {/* liquid */}
      <g clipPath={`url(#inner${uid})`}>
        <rect x={0} y={liquidTop} width={200} height={g.bottom - liquidTop + 4} fill={`url(#liq${uid})`} />
        <rect x={CX - hwEff} y={liquidTop} width={hwEff * 2} height={g.bottom - liquidTop + 4} fill={`url(#liqH${uid})`} />
        <ellipse cx={CX} cy={liquidTop} rx={hwEff} ry={3} fill={shade(liquid, 0.45)} opacity="0.6" />
        {hq && (
          <>
            <rect x={CX - hwEff} y={liquidTop} width={hwEff * 2} height={g.bottom - liquidTop} fill={`url(#liqGlow${uid})`} />
            <line x1={CX - hwEff} x2={CX + hwEff} y1={liquidTop + 0.5} y2={liquidTop + 0.5} stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" />
          </>
        )}
        {/* back label seen through liquid */}
        {backScale > 0.05 && (
          <g transform={`translate(${backCx} 0) scale(${backScale} 1)`} opacity={0.22 * backScale}>
            <rect x={-labelW / 2} y={labelY} width={labelW} height={labelH} fill={label.bg === 'gold' ? `url(#goldV${uid})` : label.bg} />
          </g>
        )}
      </g>

      {/* side face shading for boxy bottles */}
      {showEdge && (
        <g clipPath={`url(#body${uid})`}>
          <rect
            x={sideIsLeft ? CX - hwEff : edgeX}
            y={0}
            width={sideIsLeft ? edgeX - (CX - hwEff) : CX + hwEff - edgeX}
            height={340}
            fill="#000"
            opacity={0.28}
          />
          <line x1={edgeX} x2={edgeX} y1={g.top} y2={g.bottom} stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
        </g>
      )}

      {/* glass sheen + rim */}
      <path d={body} fill={`url(#glass${uid})`} />
      <path d={body} fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.2" />
      <path d={inner} fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

      {/* specular highlights */}
      <g clipPath={`url(#body${uid})`}>
        <rect x={CX - hwEff + hwEff * 0.16} y={g.top + 10} width={Math.max(2, hwEff * 0.08)} height={(g.bottom - g.top) * 0.82} fill="#fff" opacity="0.5" rx="2" />
        <rect x={CX - hwEff + hwEff * 0.3} y={g.top + 16} width={Math.max(1, hwEff * 0.03)} height={(g.bottom - g.top) * 0.7} fill="#fff" opacity="0.25" />
        <rect x={CX + hwEff * 0.78} y={g.top + 20} width={Math.max(1.5, hwEff * 0.05)} height={(g.bottom - g.top) * 0.6} fill="#fff" opacity="0.18" rx="2" />
        <rect
          x={frontCx - labelW * 0.42 * frontScale}
          y={g.top}
          width={6 * frontScale + 0.5}
          height={g.bottom - g.top}
          fill="#fff"
          opacity={0.12 * frontScale}
        />
      </g>

      {hq && (
        <g clipPath={`url(#body${uid})`}>
          {/* thick glass base */}
          <rect x={CX - hwEff} y={g.bottom - 13} width={hwEff * 2} height={13} fill="#ffffff" opacity="0.07" />
          <line x1={CX - hwEff} x2={CX + hwEff} y1={g.bottom - 13} y2={g.bottom - 13} stroke="#fff" strokeOpacity="0.35" strokeWidth="0.7" />
          {/* bloomed specular streaks */}
          <g filter={`url(#bloom${uid})`}>
            <rect x={CX - hwEff + hwEff * 0.14} y={g.top + 8} width={Math.max(3, hwEff * 0.12)} height={(g.bottom - g.top) * 0.85} fill="#fff" opacity="0.35" />
            <rect x={CX + hwEff * 0.74} y={g.top + 18} width={Math.max(2, hwEff * 0.08)} height={(g.bottom - g.top) * 0.62} fill="#fff8e0" opacity="0.22" />
          </g>
          {/* warm rim light from the right */}
          <rect x={CX + hwEff - 4} y={g.top} width={6} height={g.bottom - g.top} fill={`url(#rim${uid})`} opacity="0.55" filter={`url(#bloom${uid})`} />
        </g>
      )}

      {/* front label */}
      {frontScale > 0.04 && (
        <g transform={`translate(${frontCx} 0) scale(${frontScale} 1)`}>
          <rect
            x={-labelW / 2}
            y={labelY}
            width={labelW}
            height={labelH}
            fill={label.bg === 'gold' ? `url(#goldV${uid})` : label.bg}
            stroke={label.border}
            strokeWidth="0.8"
          />
          <rect x={-labelW / 2 + 3} y={labelY + 3} width={labelW - 6} height={labelH - 6} fill="none" stroke={label.border} strokeOpacity="0.55" strokeWidth="0.5" />
          <text x={0} y={labelY + 17} textAnchor="middle" fill={label.fg} fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="12" letterSpacing="3.2" fontWeight="600">
            MAHEK
          </text>
          <line x1={-12} x2={12} y1={labelY + 23} y2={labelY + 23} stroke={label.fg} strokeWidth="0.5" opacity="0.7" />
          {nameLines.map((ln, i) => (
            <text
              key={i}
              x={0}
              y={labelY + 37 + i * 10}
              textAnchor="middle"
              fill={label.fg}
              fontFamily="Inter, sans-serif"
              fontSize={ln.length > 14 ? 5.4 : 6.4}
              letterSpacing="1.4"
            >
              {ln}
            </text>
          ))}
          <text x={0} y={labelY + labelH - 9} textAnchor="middle" fill={label.sub} fontFamily="Inter, sans-serif" fontSize="3.8" letterSpacing="0.9">
            EAU DE PARFUM · 1982
          </text>
        </g>
      )}

      {/* neck collar */}
      <rect x={CX - g.neck} y={g.top - 14} width={g.neck * 2} height={15} fill={`url(#gold${uid})`} />
      <rect x={CX - g.neck - 2} y={g.top - 3} width={g.neck * 2 + 4} height={4} fill={`url(#gold${uid})`} />

      {/* cap */}
      <Cap style={bottle.cap} top={capTop} bottomY={g.top - 14} uid={uid} c={c} s={s} />
      {hq && (
        <g filter={`url(#bloomWide${uid})`} opacity="0.55">
          <ellipse cx={CX - 8} cy={capTop + 10} rx={6} ry={3} fill="#FFF6C8" />
        </g>
      )}
    </svg>
  );
}

function capHeight(cap: BottleStyle['cap']) {
  return { gold: 44, black: 44, orb: 52, crystal: 46, tower: 70 }[cap];
}

function Cap({ style, top, bottomY, uid, c, s }: { style: BottleStyle['cap']; top: number; bottomY: number; uid: string; c: number; s: number }) {
  const h = bottomY - top;
  switch (style) {
    case 'orb':
      return (
        <g>
          <rect x={CX - 8} y={bottomY - 10} width={16} height={10} fill={`url(#gold${uid})`} />
          <circle cx={CX} cy={top + 24} r={26} fill={`url(#orb${uid})`} />
          <ellipse cx={CX - 9} cy={top + 13} rx={7} ry={4} fill="#fff" opacity="0.55" />
        </g>
      );
    case 'crystal': {
      const a = 24;
      const w = a * Math.abs(c) + a * Math.abs(s);
      const edge = CX + a * s - (s >= 0 ? a * Math.abs(c) : -a * Math.abs(c));
      return (
        <g>
          <path d={`M ${CX - w} ${bottomY} L ${CX - w * 0.82} ${top} L ${CX + w * 0.82} ${top} L ${CX + w} ${bottomY} Z`} fill={`url(#crys${uid})`} stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" />
          <line x1={edge * 0.9 + CX * 0.1} y1={top} x2={edge} y2={bottomY} stroke="#fff" strokeOpacity="0.45" />
          <path d={`M ${CX - w * 0.6} ${top + 6} L ${CX - w * 0.3} ${bottomY - 6}`} stroke="#fff" strokeOpacity="0.6" strokeWidth="2" />
        </g>
      );
    }
    case 'tower':
      return (
        <g>
          <rect x={CX - 15} y={top} width={30} height={h} fill={`url(#gold${uid})`} rx="2" />
          {[0.22, 0.44, 0.66].map((f) => (
            <rect key={f} x={CX - 15} y={top + h * f} width={30} height={1.4} fill="#4a3a0c" opacity="0.6" />
          ))}
          <ellipse cx={CX} cy={top} rx={15} ry={3} fill="#F9E076" />
        </g>
      );
    case 'black':
      return (
        <g>
          <rect x={CX - 24} y={top} width={48} height={h} fill={`url(#black${uid})`} rx="3" />
          <rect x={CX - 24} y={bottomY - 9} width={48} height={5} fill={`url(#gold${uid})`} />
          <ellipse cx={CX} cy={top + 1} rx={23} ry={3} fill="#333" />
        </g>
      );
    default:
      return (
        <g>
          <rect x={CX - 23} y={top} width={46} height={h} fill={`url(#gold${uid})`} rx="3" />
          <ellipse cx={CX} cy={top + 1} rx={22} ry={3.2} fill="#F9E076" />
          <rect x={CX - 23} y={bottomY - 7} width={46} height={1.2} fill="#4a3a0c" opacity="0.6" />
        </g>
      );
  }
}

/** Gift box / packaging alternate view */
export function PackagingArt({ name, bottle, className = '' }: { name: string; bottle: BottleStyle; className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 220 340" className={className} role="img" aria-label={`${name} presentation box`}>
      <defs>
        <linearGradient id={`bx${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c1c1c" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6b1a" />
          <stop offset="0.5" stopColor="#F9E076" />
          <stop offset="1" stopColor="#8a6b1a" />
        </linearGradient>
        <radialGradient id={`bs${uid}`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.8" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="312" rx="96" ry="12" fill={`url(#bs${uid})`} />
      <path d="M 158 46 L 190 30 L 190 280 L 158 304 Z" fill="#0b0b0b" stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="0.8" />
      <path d="M 40 46 L 72 30 L 190 30 L 158 46 Z" fill="#161616" stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="0.8" />
      <rect x="40" y="46" width="118" height="258" fill={`url(#bx${uid})`} stroke="#D4AF37" strokeOpacity="0.7" strokeWidth="1" />
      <rect x="48" y="54" width="102" height="242" fill="none" stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="0.6" />
      <rect x="40" y="250" width="118" height="6" fill={bottle.liquid} opacity="0.85" />
      <circle cx="99" cy="118" r="26" fill="none" stroke={`url(#bg${uid})`} strokeWidth="1.2" />
      <text x="99" y="128" textAnchor="middle" fill="#D4AF37" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="30">
        M
      </text>
      <text x="99" y="176" textAnchor="middle" fill="#F5F0E6" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="15" letterSpacing="4">
        MAHEK
      </text>
      <text x="99" y="196" textAnchor="middle" fill="#D4AF37" fontFamily="Inter, sans-serif" fontSize={name.length > 16 ? 4.8 : 6} letterSpacing="1.8">
        {name.toUpperCase()}
      </text>
      <text x="99" y="284" textAnchor="middle" fill="#A6A6A6" fontFamily="Inter, sans-serif" fontSize="5" letterSpacing="2">
        SINCE 1982
      </text>
    </svg>
  );
}
