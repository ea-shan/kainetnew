# Design tokens

## Fonts
- **Milling Duplex 1mm** 400 — headings, body, nav, buttons (`--font-milling`)
- **Milling Triplex 1mm** 700 — banner emphasis, “Read more”
- **IBM Plex Mono** 400 — small technical labels (SPEED)
- **Geist** — unused on this page’s primary type; keep as system fallback

## Colors (computed)
- Paper: `rgb(244, 243, 243)` `#F4F3F3`
- Ink: `rgb(29, 28, 27)` `#1D1C1B`
- Ink muted: `rgba(29, 28, 27, 0.5)`
- Paper muted: `rgba(65, 64, 62, 0.6)` / `rgba(244, 243, 243, 0.6)`
- Accent: `rgb(88, 100, 237)` `#5864ED`
- Header glass: `rgba(29, 28, 27, 0.1)` + `blur(10px)`
- Dark fill: `#0C0C0C` (near-black hero/sections)

## Type (1440)
- H1: 56px / 62.72px / -1.12px / milling / paper
- H2: 48px / 54.72px / -0.96px / milling / paper
- H3: 20px / 28px / 0.1px / milling / paper
- Body: 16px / 24px / 0.16px / milling
- Banner: 14px / 23.24px / -0.28px
- Button label: 16px / 24px / 0.16px / milling / ink or paper
- Nav: 16px / 24px / 0.16px / milling / paper

## Buttons
- Primary L: bg paper, text ink, pad 18×24, h 60, radius 18, gap 8
- Secondary L: transparent + 1px paper border, pad 18×24, h 60, radius 18
- Secondary S: pad 18×16, h 44, radius 14
