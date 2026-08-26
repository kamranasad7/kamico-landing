# Plan — SEO/social metadata, robots + sitemap, JSON-LD, image weight

## Root cause
1. Origin-dependent metadata sits in `src/app.html` behind `%sveltekit.assets%`, which adapter-static resolves to a
   *relative* `.` — hence `og:image="./media/si3-shot.png"`, while canonical/`og:url`/robots/sitemap never existed at all.
2. `static/media/*` are the untouched full-res Play Store originals (up to 1080x2400, 1.1 MB) rendered into 300–670 CSS-px
   boxes; nothing resizes or re-encodes them → 3.9 MB of images on first desktop load.

## Files
- **new** `src/lib/site.ts` — `SITE_URL = 'https://kamico-landing.vercel.app'` (no trailing slash), `abs()`, `SITEMAP_URL`,
  `socialCard` (absolute URL + alt + the pixel size the file in `static/media` actually is).
- **new** `src/lib/components/Seo.svelte` — `<svelte:head>` with canonical, `og:url`, absolute `og:image` + `:width/:height/:alt`,
  `twitter:image`, and the single `ld+json` block; rendered once from `+layout.svelte`. Its `@graph` = Organization (KamiCo,
  `SITE_URL`, logo, Play developer `sameAs`) + one `VideoGame` per title built from `games.ts`: name, Play Store `url`,
  `contentRating` ("Rated 7+/3+"), and `aggregateRating` **only for Space Impact 3** (4.4/200, the sole real figure in the
  design export — Salary Day is "New release" there, so an invented aggregate would be fake structured data).
- **new** `src/routes/{robots.txt,sitemap.xml}/+server.ts` — prerendered, bodies derived from `SITE_URL`; the default
  `prerender.entries` already crawls them, so both land in `build/` with no config change.
- **new** `scripts/optimize-media.mjs` (+ `npm run media`) — regenerates `static/media/` from the read-only `design/media/`
  originals via `sips` at the widths actually rendered (card/hero shots 1052 and 800 jpeg q72, studio thumbs 640, icons 128
  png). Derivatives are committed, so `npm run build` stays tool-free; 748 KB total vs the 900 KB budget.
- **edit** `src/app.html` (drop the relative `og:image`; keep title/description/favicon/theme script), `games.ts` (new `shot`
  extension + rating data), `Hero.svelte` (`fetchpriority="high"`, not lazy), `README.md`, and `scripts/verify.mjs`, which
  imports `SITE_URL` from `src/lib/site.ts` (Node 24 strips types) so the origin stays declared exactly once. `GameCard` and
  `Studio` need no edit — they read their paths from `games.ts` and are already `loading="lazy"`.

## Verification (`npm run verify` — `build/` + preview on localhost:4173, no public URL)
- **1/12** build exits 0, emits `build/index.html`; all pre-existing checks kept and passing. **2/3/13** canonical href and
  `og:url` read out of `build/index.html` — not the hydrated DOM, which re-inserts head tags a crawler would never see —
  and compared `=== SITE_URL` exactly.
- **4** `og:image` asserted with `startsWith('https://')` on the raw attribute, never `new URL(…, origin)`; its 200 check maps
  the `SITE_URL` prefix back to the preview origin (repairing the existing asset check).
- **5** `og:image:width/height/alt` present; width/height compared against the dimensions `sips` reads off the file the tag
  points at in `build/`, so the tags cannot drift from the artwork.
- **6/7** `/robots.txt` + `/sitemap.xml` → 200 and byte-identical to the copies in `build/`; robots has `User-agent: *`,
  `Allow: /`, no blanket `Disallow: /`, and `Sitemap: ${SITE_URL}/sitemap.xml`; sitemap parsed by in-page `DOMParser`,
  exactly one `<loc>` = `SITE_URL`.
- **8** exactly one `ld+json`; `JSON.parse`, then walk the graph for the Organization node and two `VideoGame` nodes each with
  a name, a play.google.com URL and a rating field.
- **9** sum of image-response `content-length` (fallback `response.buffer()`) at 1440x900 < 900 KB. **10/11** the browser
  classifies each image against the fold and the `<img>` tags of `build/index.html`, in the same document order, carry the
  verdict: the largest above-fold one has `fetchpriority="high"` and no `loading="lazy"`, every below-fold one is lazy.
  **14** `artifacts/run-11/repro.cjs` (puppeteer-core driver) exits 0 against the same preview.
