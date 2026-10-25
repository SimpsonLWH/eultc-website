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

## Typography

Schibsted Grotesk is loaded through `next/font` and used across the clubhouse.
The landing page uses its 800 weight for display headings and 400/600 for body
and controls. This gives the public club story a clearer editorial voice than
the previous system-font fallback while keeping one family across the site.

## Glass chrome

`.material-nav` is the only glass surface and it is used by the floating header
and the fixed bottom tab bar only: translucent (`blur(20px) saturate(140%)`)
where `backdrop-filter` is supported, opaque at rest and for reduced
transparency, higher contrast and forced colours. A faint court-green wash
(`.shell-wash`) gives the glass something to sample; content surfaces stay
opaque.

The anonymous landing page is the exception. Its full-bleed header is opaque
cream, the page wash is removed, and the public sections use hard colour fields,
square photography and flat controls. These overrides are scoped to
`body:has(.club-landing)` so member routes keep the established application
chrome.

## Club photography

The landing page uses photographs published in EULTC's public ClubSpark gallery:

- `public/club/bucs-champions.jpg` - National Trophy champions, 2026.
- `public/club/court-action.jpg` - EULTC players on court.
- `public/club/net-post.jpg` - tennis ball on the net post.
- `public/club/meadows-courts.jpg` - the Meadows courts at sunset.

The gallery is linked beside the photo credit on the landing page. Replace the
files with newer club-owned photography when available, keeping the same
descriptive filenames so the page and credit stay aligned.

## Shape and corners

`rounded-control` (10px), `rounded-surface` (14px) and `rounded-float` (20px)
keep control, content and floating-chrome radii distinct. The `squircle`
utility adds `corner-shape: squircle`, so supporting browsers draw continuous
Apple-style corners; other browsers keep the plain border radius.
