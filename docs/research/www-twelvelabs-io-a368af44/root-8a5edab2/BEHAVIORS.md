# Behaviors — TwelveLabs homepage

## Scroll sweep
- No Lenis / Locomotive. Native scroll.
- Header stays over content with `backdrop-filter: blur(10px)` and `background: rgba(29, 28, 27, 0.1)`.
- Hero thumbnail arc is a video (`TL_01_alpha.webm`), not scroll-parallax.
- Get-started and workflows did **not** change active item while scrolling through the section (1400→1700). INTERACTION MODEL: **click**, not scroll.
- No scroll-snap.

## Click sweep
- Banner → Series B announcement (external).
- Nav items Platform / Pricing / Solutions / Resources / Company open dropdowns (hover + click).
- Build, Playground, Talk to Sales are direct links.
- Get-started list items switch the expanded “active-part” + right visual.
- Workflow list items switch description + right visual.
- Solutions cards are links (“Learn more”).
- Testimonials are a carousel (auto + possibly drag).
- Footer links are standard anchors.

## Hover sweep
- Primary button: no fill change; slight opacity/brightness.
- Secondary button: border stays 1px paper; text stays paper/ink.
- Nav labels: no underline; dropdown appears.
- Cards: slight lift / border brighten.

## Responsive
- **1440:** full nav, 2-col hero, 2-col feature sections, 3 KPI cards, 3 solution cards, 2 model cards.
- **768:** nav collapses to hamburger (observed hamburger at 977px). Stacks feature columns. KPI grid 1–2 cols.
- **390:** single column, hamburger, Jockey card below hero copy, footer stacks.
- **Breakpoint:** nav collapse ~1100px. Section stacks ~768px.

## Time-driven
- Hero webm loops, muted, autoplay.
- CTA `horse-cta-video.mp4` loops.
- Trusted-by logos animate horizontally.
- Testimonials rotate.
