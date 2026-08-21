# KamiCo landing page

Static marketing site for the KamiCo game studio, built with SvelteKit 2, Svelte 5 and
`@sveltejs/adapter-static`. Every route is prerendered, so the build output in `build/` is plain HTML.

`design/` is the Claude Design export the page is built from — treat it as read-only reference. Its logo and
Play artwork are copied into `static/`; the site never hot-links `play-lh.googleusercontent.com`.

```sh
npm install
npm run dev        # dev server
npm run build      # prerender to build/
npm run preview    # serve build/ on http://localhost:4173
npm run check      # svelte-check
npm run verify     # drive the preview with Chrome and check the acceptance criteria
```

## Theming

Dark is the default. Tokens are CSS custom properties on `:root`, overridden by `:root[data-theme='light']`.
The toggle writes `localStorage['kamico-theme']`; an inline script in `src/app.html` applies the stored theme
before first paint so light mode never flashes dark.
