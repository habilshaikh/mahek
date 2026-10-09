# Mahek Perfume — Static Storefront (Demo)

Luxury multi-page perfume storefront. **Frontend only**: no backend, database, payments or authentication.

## Run
```
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview
```

## Before launch — replace placeholders
| What | Where |
|---|---|
| Official logo | add `public/brand/mahek-logo.png` (until then a typographic wordmark is shown) |
| Contact details, social links, currency, shipping fees | `src/config/site.ts` |
| Products, prices, notes | `src/data/products.ts` (single shared dataset) |
| Collections, scent families | `src/data/collections.ts` |
| Journal articles | `src/data/journal.ts` |
| Brand story copy | `src/pages/OurStory.tsx` |
| Policies (shipping, returns, privacy, terms) | `src/pages/Policies.tsx` — text in [brackets] must be completed and legally reviewed |
| Sample promo codes | `src/store/ShopContext.tsx` (MAHEK10, HERITAGE82, FREESHIP) |

## Images
| Folder | What it is |
|---|---|
| `public/images/products/<slug>/` | **Illustrative renders** of each sample product: `main`, `front`, `side`, `detail`, `packaging`, `lifestyle`, plus `card`/`thumb` sizes and a transparent `cutout`. Replace with real product photography by keeping the same file names. |
| `public/images/hero/` | Hero background + a genuine 36-frame turntable sequence used by the drag-to-rotate showroom |
| `public/images/collections/`, `campaign/` | Collection banners and campaign composites |
| `public/images/photos/` | Openly licensed stock photography (CC0 / Public Domain / CC BY), credited at `/image-credits` and in `src/data/photo-credits.json` |

Regenerate the renders after changing products: run `npm run dev`, then `npm run render:images`
(options: `--only=products|banners|campaign|hero`, `--slug=<product>`). Uses a local Chrome/Edge (set `BROWSER_PATH` if needed).
The render studio route exists only in development and is not included in production builds.

Reviews, testimonials, order history, tracking and checkout are explicitly labelled demo content.

## Deploying
It is a single-page app with client-side routes. `public/_redirects` (Netlify) and `vercel.json` (Vercel)
rewrite all paths to `index.html`; other hosts need an equivalent SPA fallback.
