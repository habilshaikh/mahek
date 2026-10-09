/**
 * DEV-ONLY render studio used by `npm run render:images` to generate the
 * illustrative product renders, banners and campaign composites as WebP files.
 * It is excluded from production builds (see App.tsx).
 */
import { useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import BottleArt, { PackagingArt } from '../components/product/BottleArt';
import { getCollection } from '../data/collections';
import { collectionPhoto, familyPhoto, photo, type PhotoKey } from '../data/images';
import { getProduct } from '../data/products';
import type { BottleStyle } from '../data/types';

declare global {
  interface Window {
    __renderReady?: boolean;
  }
}

function useReady() {
  useEffect(() => {
    window.__renderReady = false;
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('#stage img'));
    Promise.all([document.fonts.ready, ...imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => (i.onload = i.onerror = r))))]).then(() =>
      requestAnimationFrame(() => requestAnimationFrame(() => (window.__renderReady = true))),
    );
  });
}

function Stage({ w, h, children, transparent = false }: { w: number; h: number; children: ReactNode; transparent?: boolean }) {
  return (
    <div id="stage" style={{ width: w, height: h, position: 'relative', overflow: 'hidden', background: transparent ? 'transparent' : '#1a1510' }}>
      {children}
    </div>
  );
}

/** Dark studio backdrop with spotlight, coloured glow and glossy floor */
function Studio({ tint, floor = 0.8 }: { tint: string; floor?: number }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 32%, #55432a 0%, #2f261b 45%, #1a1510 88%)' }} />
      <div style={{ position: 'absolute', left: '15%', right: '15%', top: '10%', height: '70%', borderRadius: '50%', background: tint, opacity: 0.3, filter: 'blur(120px)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: `${floor * 100}%`, bottom: 0, background: 'linear-gradient(180deg, #3a3024 0%, #262019 40%, #1a1510 100%)' }} />
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: `${floor * 100}%`, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />
      <div style={{ position: 'absolute', left: '-10%', right: '-10%', top: '-30%', height: '80%', background: 'conic-gradient(from 180deg at 50% 0%, transparent 165deg, rgba(249,224,118,0.10) 180deg, transparent 195deg)' }} />
    </>
  );
}

function PhotoBg({ k, dim = 0.5, blur = 0, position = 'center' }: { k: PhotoKey; dim?: number; blur?: number; position?: string }) {
  return (
    <img
      src={photo(k)}
      alt=""
      style={{ position: 'absolute', inset: blur ? -blur * 3 : 0, width: blur ? `calc(100% + ${blur * 6}px)` : '100%', height: blur ? `calc(100% + ${blur * 6}px)` : '100%', objectFit: 'cover', objectPosition: position, filter: `brightness(${dim}) saturate(0.95) blur(${blur}px)` }}
    />
  );
}

/** Bottle standing on the floor line, with a mirrored reflection */
function Standing({ bottle, name, angle, height, cx, floorY, reflection = true }: { bottle: BottleStyle; name: string; angle: number; height: number; cx: number; floorY: number; reflection?: boolean }) {
  const width = height * (200 / 340);
  // the bottle base sits at y=300 of the 340 viewBox
  const top = floorY - height * (300 / 340);
  return (
    <>
      <div style={{ position: 'absolute', left: cx - width / 2, top, width, height }}>
        <BottleArt bottle={bottle} name={name} angle={angle} hq className="h-full w-full" />
      </div>
      {reflection && (
        <div
          style={{
            position: 'absolute',
            left: cx - width / 2,
            top: floorY,
            width,
            height: height * 0.45,
            overflow: 'hidden',
            opacity: 0.22,
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 75%)',
            maskImage: 'linear-gradient(to bottom, black, transparent 75%)',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: -height * (40 / 340), width, height, transform: 'scaleY(-1)' }}>
            <BottleArt bottle={bottle} name={name} angle={angle} shadow={false} className="h-full w-full" />
          </div>
        </div>
      )}
    </>
  );
}

function Plinth({ cx, top, width }: { cx: number; top: number; width: number }) {
  return (
    <div style={{ position: 'absolute', left: cx - width / 2, top, width, height: 2000 }}>
      <div style={{ height: 22, background: 'linear-gradient(180deg,#2a2a2a,#121212)', borderTop: '1px solid rgba(249,224,118,0.6)', borderRadius: '50% / 100% 100% 0 0' }} />
      <div style={{ height: '100%', background: 'linear-gradient(90deg,#1e1812,#1b1b1b 45%,#211a13)', borderLeft: '1px solid rgba(212,175,55,0.15)', borderRight: '1px solid rgba(212,175,55,0.15)' }} />
    </div>
  );
}

function Grain() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.06,
        mixBlendMode: 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function ProductRender({ slug, view, angle }: { slug: string; view: string; angle?: number }) {
  const p = getProduct(slug);
  if (!p) return <p>Unknown product</p>;
  const W = 1200;
  const H = 1500;
  const floor = 1170;

  if (view === 'cutout' || view === 'turn') {
    return (
      <Stage w={700} h={1190} transparent>
        <BottleArt bottle={p.bottle} name={p.name} angle={angle ?? 16} hq className="h-full w-full" />
      </Stage>
    );
  }

  if (view === 'detail') {
    return (
      <Stage w={W} h={H}>
        <Studio tint={p.bottle.liquid} />
        <div style={{ position: 'absolute', left: W / 2 - 900, top: -380, width: 1800, height: 3060 }}>
          <BottleArt bottle={p.bottle} name={p.name} angle={12} hq shadow={false} className="h-full w-full" />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 35%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
        <Grain />
      </Stage>
    );
  }

  if (view === 'packaging') {
    return (
      <Stage w={W} h={H}>
        <Studio tint={p.bottle.liquid} floor={floor / H} />
        <div style={{ position: 'absolute', left: 150, top: floor - 820, width: 560, height: 866 }}>
          <PackagingArt name={p.name} bottle={p.bottle} className="h-full w-full" />
        </div>
        <Standing bottle={p.bottle} name={p.name} angle={-20} height={780} cx={820} floorY={floor} />
        <Grain />
      </Stage>
    );
  }

  if (view === 'lifestyle') {
    const fam = familyPhoto[p.families[0]];
    return (
      <Stage w={W} h={H}>
        <PhotoBg k={fam.key} dim={0.78} blur={3} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,21,16,0.25) 0%, rgba(26,21,16,0.15) 45%, rgba(26,21,16,0.92) 82%)' }} />
        <div style={{ position: 'absolute', left: '20%', right: '20%', top: '18%', height: '55%', borderRadius: '50%', background: '#D4AF37', opacity: 0.18, filter: 'blur(110px)' }} />
        <Plinth cx={W / 2} top={1110} width={620} />
        <Standing bottle={p.bottle} name={p.name} angle={18} height={900} cx={W / 2} floorY={1120} reflection={false} />
        <Grain />
      </Stage>
    );
  }

  const a = view === 'front' ? 0 : view === 'side' ? 90 : 24;
  return (
    <Stage w={W} h={H}>
      <Studio tint={p.bottle.liquid} floor={floor / H} />
      <Standing bottle={p.bottle} name={p.name} angle={a} height={1180} cx={W / 2} floorY={floor + 60} />
      <Grain />
    </Stage>
  );
}

function BannerRender({ slug }: { slug: string }) {
  const c = getCollection(slug);
  if (!c) return <p>Unknown collection</p>;
  const W = 2400;
  const H = 1000;
  const floor = 900;
  return (
    <Stage w={W} h={H}>
      <div style={{ position: 'absolute', left: '30%', top: 0, right: 0, bottom: 0 }}>
        <PhotoBg k={collectionPhoto[slug]} dim={0.82} blur={2} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #1a1510 0%, #1a1510 30%, rgba(26,21,16,0.55) 55%, rgba(26,21,16,0.2) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(26,21,16,0.95) 92%)' }} />
      <div style={{ position: 'absolute', left: '58%', top: '5%', width: 900, height: 800, borderRadius: '50%', background: c.accent2, opacity: 0.14, filter: 'blur(140px)' }} />
      {[0, 2, 1].map((i) => {
        const p = getProduct(c.heroSlugs[i])!;
        return (
          <Standing
            key={i}
            bottle={p.bottle}
            name={p.name}
            angle={[-30, 10, 32][i]}
            height={i === 1 ? 900 : 660}
            cx={[1470, 1800, 2130][i]}
            floorY={i === 1 ? floor + 30 : floor}
          />
        );
      })}
      <Grain />
    </Stage>
  );
}

function HeroBgRender({ mobile }: { mobile: boolean }) {
  const W = mobile ? 1080 : 2400;
  const H = mobile ? 1500 : 1350;
  return (
    <Stage w={W} h={H}>
      <PhotoBg k="candles-row" dim={0.55} blur={6} position="60% 50%" />
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.75 }}>
        <PhotoBg k="smoke-gold" dim={0.85} position={mobile ? '50% 30%' : '50% 40%'} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: mobile ? 'linear-gradient(180deg, rgba(26,21,16,0.2) 0%, rgba(26,21,16,0.55) 55%, #1a1510 100%)' : 'linear-gradient(90deg, #1a1510 0%, rgba(26,21,16,0.85) 30%, rgba(26,21,16,0.25) 60%, rgba(26,21,16,0.45) 100%)' }} />
      <div style={{ position: 'absolute', left: mobile ? '10%' : '55%', top: '8%', width: mobile ? '80%' : '40%', height: '70%', borderRadius: '50%', background: '#D4AF37', opacity: 0.16, filter: 'blur(140px)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '18%', background: 'linear-gradient(180deg, transparent, #1a1510)' }} />
      <Grain />
    </Stage>
  );
}

function CampaignRender({ id }: { id: string }) {
  if (id === 'oud') {
    const ps = ['black-oud-intense', 'saffron-crown', 'royal-oud-noir'].map((s) => getProduct(s)!);
    return (
      <Stage w={2400} h={1100}>
        <PhotoBg k="smoke-gold" dim={0.95} position="50% 35%" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(26,21,16,0.2) 0%, rgba(26,21,16,0.35) 45%, #1a1510 80%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 65%, #1a1510 96%)' }} />
        <Standing bottle={ps[0].bottle} name={ps[0].name} angle={-30} height={600} cx={430} floorY={980} />
        <Standing bottle={ps[2].bottle} name={ps[2].name} angle={30} height={600} cx={1110} floorY={980} />
        <Standing bottle={ps[1].bottle} name={ps[1].name} angle={8} height={860} cx={770} floorY={1000} />
        <Grain />
      </Stage>
    );
  }
  if (id === 'heritage') {
    const ps = ['rose-mahal', 'sandalwood-heritage', 'amber-sultan'].map((s) => getProduct(s)!);
    return (
      <Stage w={1600} h={1400}>
        <PhotoBg k="candles-glow" dim={0.62} blur={5} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 20%, rgba(26,21,16,0.85) 85%)' }} />
        <Plinth cx={800} top={1150} width={1180} />
        <Standing bottle={ps[0].bottle} name={ps[0].name} angle={-30} height={640} cx={430} floorY={1160} reflection={false} />
        <Standing bottle={ps[2].bottle} name={ps[2].name} angle={30} height={640} cx={1170} floorY={1160} reflection={false} />
        <Standing bottle={ps[1].bottle} name={ps[1].name} angle={0} height={900} cx={800} floorY={1170} reflection={false} />
        <Grain />
      </Stage>
    );
  }
  if (id === 'finder') {
    const ps = ['citrus-riviera', 'rose-mahal', 'royal-oud-noir', 'white-musk-silk'].map((s) => getProduct(s)!);
    return (
      <Stage w={1600} h={1200}>
        <PhotoBg k="spices-bowls" dim={0.5} blur={4} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(26,21,16,0.2), rgba(26,21,16,0.9) 80%)' }} />
        {ps.map((p, i) => (
          <Standing key={p.id} bottle={p.bottle} name={p.name} angle={[-35, -12, 12, 35][i]} height={[560, 700, 700, 560][i]} cx={[300, 640, 960, 1300][i]} floorY={1040} />
        ))}
        <Grain />
      </Stage>
    );
  }
  if (id === 'newsletter') {
    const ps = ['rose-mahal', 'amber-sultan'].map((s) => getProduct(s)!);
    return (
      <Stage w={1200} h={1500}>
        <PhotoBg k="rose-red" dim={0.65} blur={3} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,21,16,0.3) 0%, rgba(26,21,16,0.2) 50%, #1a1510 88%)' }} />
        <Plinth cx={600} top={1180} width={900} />
        <Standing bottle={ps[0].bottle} name={ps[0].name} angle={-26} height={680} cx={420} floorY={1190} reflection={false} />
        <Standing bottle={ps[1].bottle} name={ps[1].name} angle={14} height={880} cx={760} floorY={1195} reflection={false} />
        <Grain />
      </Stage>
    );
  }
  return <p>Unknown campaign</p>;
}

export default function RenderStage() {
  const [q] = useSearchParams();
  useReady();
  useEffect(() => {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    document.body.classList.remove('bg-obsidian');
  }, []);
  const kind = q.get('kind');
  const content =
    kind === 'product' ? (
      <ProductRender slug={q.get('slug') ?? ''} view={q.get('view') ?? 'main'} angle={q.has('angle') ? Number(q.get('angle')) : undefined} />
    ) : kind === 'banner' ? (
      <BannerRender slug={q.get('slug') ?? ''} />
    ) : kind === 'hero' ? (
      <HeroBgRender mobile={q.get('variant') === 'mobile'} />
    ) : kind === 'campaign' ? (
      <CampaignRender id={q.get('id') ?? ''} />
    ) : (
      <p className="p-10">Specify ?kind=product|banner|hero|campaign</p>
    );
  return <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'transparent' }}>{content}</div>;
}
