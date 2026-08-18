# HeroSection Specification

## Overview
- **Target file:** `src/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/HeroSection.tsx`
- **Mosaic:** `src/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/HeroMosaic.tsx`
- **Screenshot:** user capture + live https://www.twelvelabs.io/?ref=land-book.com
- **Interaction model:** time-driven VideoTextures + mouse camera lerp + slow row drift (`THREE.Timer`). Live canvas is a right-weighted wall of rounded video planes. Clone uses `PlaneGeometry` + rounded-rect shader (correct UVs — no ShapeGeometry smear), left blur/dark, right sharp.

## DOM Structure
- `section` dark `#0C0C0C`, pulled under sticky header (`-mt-[131px]`)
- `HeroMosaic` absolute full-bleed 3D field
- Left copy column (640px): H1, body, two `SiteButton`s
- Jockey glass card: `jockey-ui.png`, RESEARCH PREVIEW, caption
- Lime 4-point star on the right edge

## Computed Styles (live, 977px viewport + prior 1440 extract)

### H1
- color `rgb(244, 243, 243)`
- 1440: fontSize 56px, lineHeight 62.72px, letterSpacing -1.12px, width 640px
- ~1000px: fontSize 44px, lineHeight 51.04px, letterSpacing -0.88px

### Subtitle
- 16px / 24px / 0.16px, paper, width 640px

### Primary / secondary CTAs
- height 60px, radius 18px
- primary bg `rgb(244, 243, 243)`
- secondary transparent + 1px paper inset ring
- ArrowUpRight after label

### Jockey card (live)
- width 360px, height ~293px
- radius 20px
- background `rgba(65, 64, 62, 0.6)`
- backdrop-filter `blur(4px)`
- caption: Meet Jockey, the first video intelligence AI agent

### Mosaic canvas (live)
- `canvas` absolute, full hero (Three.js video planes)
- Clone: 5×7 CSS 3D tiles from `videos/mosaic/clip-00..15.mp4`, left DOF blur, 3 sharp foreground tiles, left readability wash

## States & Behaviors
### Mouse parallax
- **Trigger:** `mousemove` on window
- **State A:** `translate3d(0,0,-140px) rotateX(8deg) rotateY(-28deg)`
- **State B:** extra ±36/22px translate and ±9/6deg rotate, lerp 0.07
- **Reduced motion:** no listener; static transform

### Hover
- CTAs: opacity 1 → 0.8, 150–200ms
- Jockey card: cursor-pointer

## Assets
- `public/sites/www-twelvelabs-io-a368af44/root-8a5edab2/videos/mosaic/clip-00.mp4`–`clip-15.mp4`
- `images/jockey-ui.png`
- `images/jockey-wordmark.svg` (drawn inside jockey-ui.png; not duplicated)

## Text Content
See the unseen. Know the unknowable.
Your video contains every insight, every event, every decision that mattered. Extracting it has been impossible. Until now.
Try on Playground / Talk to Sales
RESEARCH PREVIEW
Meet Jockey, the first video intelligence AI agent

## Responsive Behavior
- **Desktop (1440px):** copy top-left, mosaic 3D field, Jockey absolute bottom-right, star + sharp tiles visible
- **Tablet (768px):** H1 40→56 at 768; mosaic still 3D; Jockey in flow
- **Mobile (390px):** copy stacks, Jockey centered in flow, foreground tiles/star hidden
- **Breakpoint:** overlay card at ~1100px
