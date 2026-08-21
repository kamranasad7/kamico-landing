# Design reference

Source of truth for the KamiCo landing page. Everything here was exported from
the Claude Design project **KamiCo Gaming Site**
(`352cc313-d98f-4769-b79d-ea19d421ba18`) — the site build must match it.

## Files

- `KamiCo Site.dc.html` — the design export. It is a Claude Design component,
  not runnable HTML: `{{ }}` bindings, `<sc-if>`, `<sc-for>` and the
  `<script type="text/x-dc">` block are the design tool's templating. Read it as
  a spec (layout, spacing, type scale, colours, copy), not as code to port
  verbatim.
- `logo/logo-1/`, `logo/logo-2/` — brand wordmarks and app icons, light and
  dark. **logo-2 is the live set** (lime `#c7f43a` accent). logo-1 (purple
  `#8b5cc9`) is kept so the brand can be switched by swapping the token values
  and the wordmark path.
- `media/` — Google Play artwork, downloaded from the CDN so the built site
  serves its own assets. Ship these from `static/`; do not hot-link
  `play-lh.googleusercontent.com`.

## Media map

Design URL suffix → local file:

- `qM4358BF15Eepgo…=w240-h240` → `media/si3-icon.png` (240×240)
- `dWfqRhYm2phSgqgJ…=w1052-h592` → `media/si3-shot.png` (1052×592) — also the hero screenshot
- `fLgJLd0cPUupTlUz…=w240-h240` → `media/salaryday-icon.png` (240×240)
- `yCwy51G2HI1hJHQy…=s0` → `media/salaryday-shot.jpg` (1080×2229, portrait)
- `j_3sZKFp4NkYNc6W…=w1052-h592` → `media/studio-1.jpg` (1052×592)
- `vXtFpr2CwRRpvdBc…=s0` → `media/studio-2.jpg` (1080×2229, portrait)
- `6jR0OBTkdeJIHasE…=w1052-h592` → `media/studio-3.jpg` (1052×592)
- `AvxEjBXBJ6jHJEM0…=s0` → `media/studio-4.jpg` (1080×2400, portrait)

The portrait shots sit in 16:9 frames with `object-fit: cover` in the design —
they crop hard on purpose. Keep that behaviour.

## Theme tokens

Both themes are defined in the export's `renderVals()`. Dark is the default;
the toggle persists to `localStorage["kamico-theme"]`.

| token | dark | light |
| --- | --- | --- |
| `--bg` | `#0b0b0d` | `#f6f5f2` |
| `--text` | `#f4f3f1` | `#1d1a22` |
| `--muted` | `#a5a1ab` | `#514d57` |
| `--muted2` | `#8f8b93` | `#6b6772` |
| `--faint` | `#78747d` | `#7a7680` |
| `--faint2` | `#55525a` | `#8d8993` |
| `--chip` | `#b9b5bd` | `#514d57` |
| `--line` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.10)` |
| `--line2` | `rgba(255,255,255,0.14)` | `rgba(0,0,0,0.18)` |
| `--line3` | `rgba(255,255,255,0.24)` | `rgba(0,0,0,0.34)` |
| `--panel` | `#121215` | `#ffffff` |
| `--panel2` | `#101013` | `#efedea` |
| `--header-bg` | `rgba(11,11,13,0.82)` | `rgba(246,245,242,0.85)` |
| `--shadow` | `0 40px 90px rgba(0,0,0,0.6)` | `0 40px 90px rgba(0,0,0,0.16)` |
| `--accent` | `#c7f43a` | `#c7f43a` |
| `--accent-ink` | `#c7f43a` | `#6f9410` |
| `--accent-soft` | `rgba(199,244,58,0.20)` | `rgba(199,244,58,0.55)` |

`--accent` stays lime in both themes because it is always paired with `#0b0b0d`
text. `--accent-ink` is the readable-on-background variant and darkens in light
mode — use it for text and hairlines, never `--accent`.
