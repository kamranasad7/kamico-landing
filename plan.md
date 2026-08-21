# Plan — KamiCo landing page

Greenfield: the repo holds only `design/` (Claude Design export, logo-2 brand, Play artwork). `design/`
stays an untouched reference; its assets are **copied** into `static/`.

## Files to create
- `package.json` + **`package-lock.json` (committed — `npm ci` fails without it)**, `svelte.config.js`,
  `vite.config.js`, `tsconfig.json`, `README.md`
- `src/app.html` — title/description/OG/favicon + inline pre-paint theme script
- `src/app.css` — reset + `:root` (dark) / `[data-theme="light"]` tokens from the README table
- `src/lib/theme.svelte.ts` (runes), `src/lib/games.ts` (data lifted from the export's `renderVals()`),
  `src/lib/components/{Header,ThemeToggle,Hero,Games,GameCard,Numbers,Studio,Contact,Footer}.svelte`
- `src/routes/+layout.ts` (`export const prerender = true`), `+layout.svelte`, `+page.svelte`
- `static/logo/*` ← `design/logo/logo-2/`, `static/media/*` ← `design/media/`, `static/favicon.svg`
- `scripts/verify.mjs` — puppeteer-core driving the installed Chrome

## Approach
1. Hand-scaffold SvelteKit 2.70 / Svelte 5.56 / TS on `@sveltejs/adapter-static` (no fallback), so `/` prerenders to real HTML.
2. Port the export section by section — copy, type scale, spacing, colours verbatim — but translate its
   **inline styles into scoped CSS classes**: media queries cannot override inline styles, which AC8 needs.
   Design data quirks (Salary Day's `installs: "Board game"`) are preserved; the design is source of truth.
3. Theme: tokens as CSS vars; the toggle flips `documentElement.dataset.theme` and writes `kamico-theme`.
   The `app.html` inline script applies that key before first paint. Prerendered HTML ships dark, the default.
4. Assets: rewrite every `play-lh.googleusercontent.com` URL to a local `/media/...` path, rendered as
   `<img loading="lazy" decoding="async">` with `object-fit: cover` to keep the design's hard portrait crop.
5. Responsive: `clamp()` fluid type (80px h1 → ~40px), padding 40px → 20px, every grid to one column at
   ≤768px, hero blur orb sized in `%` and clipped, `overflow-x: clip` on the shell.

## Verification (`scripts/verify.mjs` unless noted)
- 1/2 `rm -rf node_modules && npm ci && npm run build` exits 0; `npm run check` reports 0 errors.
- 3/9 Preview `/`: 200, zero console errors/pageerrors, zero failed responses, zero `play-lh` requests.
- 4 Parse `build/index.html`: ids `top|games|numbers|studio|contact`; nav hrefs `["#games","#studio","#numbers","#contact"]`.
- 5 Two cards, each with title + blurb + installs + exactly 3 chips, plus the two expected Play hrefs.
- 6 Toggle flips `data-theme` and writes `localStorage['kamico-theme']`; reload with `light` seeded, sample `<html>` background at first paint — light, never `#0b0b0d`.
- 7/8 At 1440×900 and 390×844 `scrollWidth <= innerWidth`; at 768px every `display:grid` node computes to a
  single `grid-template-columns` track.
- 10/11 Non-empty `<title>`, `meta[name=description]`, `og:title|description|image`; every referenced asset
  (favicon, og:image, media) fetches 200 from preview; `git status design/` clean.
- 12 `build/index.html` exists and contains the hero `<h1>` copy, not an empty SSR shell.
