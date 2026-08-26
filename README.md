# KamiCo landing page

Static marketing site for the KamiCo game studio, built with SvelteKit 2, Svelte 5 and
`@sveltejs/adapter-static`. Every route is prerendered, so the build output in `build/` is plain HTML.

`design/` is the Claude Design export the page is built from — treat it as read-only reference. Its logo is copied
into `static/` and its Play artwork resized into `static/media/`; the site never hot-links
`play-lh.googleusercontent.com`.

```sh
npm install
npm run dev        # dev server
npm run build      # prerender to build/
npm run preview    # serve build/ on http://localhost:4173
npm run check      # svelte-check
npm run media      # regenerate static/media from design/media (uses macOS sips)
npm run verify     # drive the preview with Chrome and check the acceptance criteria
```

`npm run preview` serves `build/` with `scripts/preview.mjs` rather than `vite preview`. SvelteKit's preview
server hands its static directory to `sirv` without `dev: true`, so the directory is indexed once at startup and
every later request is answered from that snapshot. The build's JS filenames are content-hashed, so rebuilding
while the server is up renames every entry and chunk and the running server then 404s all of them — the
prerendered HTML still renders, so the page looks correct while silently never hydrating. `scripts/preview.mjs`
resolves each request from disk instead, so a rebuild needs no restart, and it serves `build/` itself — the
artifact a static host deploys — rather than the intermediate `.svelte-kit/output`.

## Theming

Dark is the default. Tokens are CSS custom properties on `:root`, overridden by `:root[data-theme='light']`.
The toggle writes `localStorage['kamico-theme']`; an inline script in `src/app.html` applies the stored theme
before first paint so light mode never flashes dark.

## Metadata and media

`src/lib/site.ts` holds `SITE_URL`, the origin the canonical link, `og:url`, `og:image`, the `Sitemap:` line
in `/robots.txt` and the single `<loc>` in `/sitemap.xml` are all derived from — moving the site means editing
it there and nowhere else. `src/lib/components/Seo.svelte` renders those tags, along with the JSON-LD graph
describing the studio and both titles.

`static/media/` is generated from the read-only originals in `design/media/` by `npm run media`, at the sizes
the page renders them at rather than the full-resolution Play Store artwork. The derivatives are committed, so
`npm run build` needs no image tooling.
