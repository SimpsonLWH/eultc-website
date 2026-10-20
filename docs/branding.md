# EULTC branding

## Palette

The `club-*` scale in `app/globals.css` is sampled from the EULTC crest ring:
deep club green, white and near-black silhouettes. `club-700 #1B3720` is the
primary, `club-600` hover, `club-800` pressed, `club-950`/`club-900` headings
and deep surfaces, `club-50`/`club-100` tints. Treat these as the source of
truth: an earlier shell repointed the same token names at a blue scale and the
club identity was lost until this was restored.

Semantic tokens (`canvas`, `surface`, `surface-muted`, `ink`, `muted`, `line`,
`control`) resolve through `:root` variables so pages stay themeable in one
place. Danger uses Tailwind's `red-100`/`red-800`; there is no separate brand
accent colour.

## Badge assets

| File | Use |
| --- | --- |
| `public/eultc-badge.png` | 447px circular master, transparent corners |
| `app/icon.png` | favicon (hairline light ring so it reads on dark browser chrome) |
| `app/apple-icon.png` | 180px apple-touch icon on white (iOS needs opaque) |

## Glass chrome

`.material-nav` is the only glass surface and it is used by the floating header
and the fixed bottom tab bar only: translucent (`blur(20px) saturate(140%)`)
where `backdrop-filter` is supported, opaque at rest and for reduced
transparency, higher contrast and forced colours. A faint court-green wash
(`.shell-wash`) gives the glass something to sample; content surfaces stay
opaque.

## Shape and corners

`rounded-control` (10px), `rounded-surface` (14px) and `rounded-float` (20px)
keep control, content and floating-chrome radii distinct. The `squircle`
utility adds `corner-shape: squircle`, so supporting browsers draw continuous
Apple-style corners; other browsers keep the plain border radius.
