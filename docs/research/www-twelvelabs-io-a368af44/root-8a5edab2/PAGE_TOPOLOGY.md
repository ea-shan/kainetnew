# Page topology — TwelveLabs homepage

Source: https://www.twelvelabs.io/?ref=land-book.com  
Viewport measured: 1440×900. Document height ≈ 10076px. Framer site. No Lenis.

## Layout
- Single vertical scroll. No scroll-snap.
- Sticky header overlays all sections (`backdrop-filter: blur(10px)`).
- Dark sections sit on near-black fills; page `body` is `rgb(244, 243, 243)`.
- Content max width ≈ 1345px, page width 1425px at 1440.

## Sections (top → bottom)

| # | Name | Framer | Top | Height | Interaction |
| --- | --- | --- | --- | --- | --- |
| 0 | Header + banner | Desktop \| Dark | 0 (sticky) | 131 | hover dropdowns, click links |
| 1 | Hero | hero | 0 | 900 | time-driven video/thumbnails; static copy |
| 2 | Get started | get-started | 900 | 1040 | click accordion (Infrastructure / API+SDK / MCP / Integrations) |
| 3 | Workflows | workflows | 1940 | 1081 | click accordion (5 workflow items) |
| 4 | KPIs | kps | 3021 | 797 | static |
| 5 | Trusted by | Desktop | 3818 | 276 | time-driven logo marquee |
| 6 | Solutions | solutions | 4094 | 1051 | hover/static industry cards |
| 7 | Security | security | 5146 | 805 | static |
| 8 | Models | models | 5951 | 1316 | static cards |
| 9 | Testimonials | testimonials | 7267 | 755 | time-driven carousel |
| 10 | CTA | Desktop + video | 8022 | 823 | static + looping video |
| 11 | Footer | FOOTER | 8845 | 1231 | hover links |

## Overlays
- Cookie Preferences button (out of scope to replicate OneTrust).
- Language combobox (English / Korean / Japanese) in header.

## Query
`?ref=land-book.com` is tracking only. Route is `/`.
