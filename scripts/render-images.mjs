/**
 * Generates the illustrative product renders, collection banners and campaign
 * composites as WebP files in public/images.
 *
 * Usage:  npm run dev   (in another terminal)
 *         npm run render:images [-- --only=products|banners|campaign|hero]
 * Set BROWSER_PATH to a Chrome/Edge executable if it is not auto-detected.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.RENDER_BASE ?? 'http://localhost:5173';
const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const skipCutouts = process.argv.includes('--skip-cutouts'); // transparent cut-outs don't depend on the backdrop
const onlySlug = process.argv.find((a) => a.startsWith('--slug='))?.slice(7);

const browserPath =
  process.env.BROWSER_PATH ??
  [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!browserPath) throw new Error('No Chrome/Edge found — set BROWSER_PATH');

const slugsIn = (file) => [...readFileSync(join(root, file), 'utf8').matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const fromSlug = process.argv.find((a) => a.startsWith('--from='))?.slice(7); // resume an interrupted run
const allProducts = slugsIn('src/data/products.ts');
const products = allProducts.filter((s, i) => (!onlySlug || s === onlySlug) && (!fromSlug || i >= allProducts.indexOf(fromSlug)));
const collections = slugsIn('src/data/collections.ts');

const out = (p) => {
  const f = join(root, 'public/images', p);
  mkdirSync(dirname(f), { recursive: true });
  return f;
};

const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--disk-cache-size=1', '--media-cache-size=1'] });
const page = await browser.newPage();
await page.setViewport({ width: 2600, height: 1600 });

async function shoot(query, file, { transparent = false, quality = 82 } = {}) {
  await page.goto(`${BASE}/__render?${query}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.__renderReady === true', { timeout: 30000 });
  const el = await page.$('#stage');
  await el.screenshot({ path: out(file), type: 'webp', quality, omitBackground: transparent });
}

/** Downscale an already rendered file into a smaller variant */
async function resize(src, file, w, h) {
  const p2 = await browser.newPage();
  await p2.setViewport({ width: w, height: h });
  await p2.setContent(`<body style="margin:0;background:#1a1510"><img id="i" src="${BASE}/images/${src}?v=${Date.now()}" style="display:block;width:${w}px;height:${h}px;object-fit:cover"></body>`);
  await p2.waitForFunction('document.getElementById("i").complete');
  await p2.screenshot({ path: out(file), type: 'webp', quality: 80, clip: { x: 0, y: 0, width: w, height: h } });
  await p2.close();
}

let n = 0;
const log = (s) => console.log(`${String(++n).padStart(3)}  ${s}`);

if (!only || only === 'products') {
  for (const slug of products) {
    for (const view of ['main', 'front', 'side', 'detail', 'packaging', 'lifestyle']) {
      await shoot(`kind=product&slug=${slug}&view=${view}`, `products/${slug}/${view}.webp`);
    }
    if (!skipCutouts) await shoot(`kind=product&slug=${slug}&view=cutout`, `products/${slug}/cutout.webp`, { transparent: true, quality: 85 });
    await resize(`products/${slug}/main.webp`, `products/${slug}/card.webp`, 600, 750);
    await resize(`products/${slug}/main.webp`, `products/${slug}/thumb.webp`, 240, 300);
    log(`product ${slug}`);
  }
}

if (!only || only === 'banners') {
  for (const slug of collections) {
    await shoot(`kind=banner&slug=${slug}`, `collections/${slug}.webp`, { quality: 80 });
    log(`banner ${slug}`);
  }
}

if (!only || only === 'campaign') {
  for (const id of ['oud', 'heritage', 'finder', 'newsletter']) {
    await shoot(`kind=campaign&id=${id}`, `campaign/${id === 'oud' ? 'oud-campaign' : id}.webp`, { quality: 80 });
    log(`campaign ${id}`);
  }
}

if (!only || only === 'hero') {
  await shoot('kind=hero&variant=desktop', 'hero/hero-bg.webp', { quality: 78 });
  await shoot('kind=hero&variant=mobile', 'hero/hero-bg-mobile.webp', { quality: 78 });
  // genuine 36-frame turntable sequence of the hero bottle (10° steps)
  for (let i = 0; i < (skipCutouts ? 0 : 36); i++) {
    await shoot(`kind=product&slug=royal-oud-noir&view=turn&angle=${i * 10}`, `hero/turn-${String(i).padStart(2, '0')}.webp`, { transparent: true, quality: 80 });
  }
  log('hero background + 36-frame turntable');
}

await browser.close();
console.log('done');
