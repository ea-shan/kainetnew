# SiteHeader Specification

## Overview
- **Target file:** `src/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SiteHeader.tsx`
- **Screenshot:** `docs/design-references/www-twelvelabs-io-a368af44/root-8a5edab2/desktop-1440-hero.png`
- **Interaction model:** hover-driven dropdowns; click hamburger <1100px

## Computed Styles
### Bar
- position: sticky / overlays page
- background: rgba(29, 28, 27, 0.1) + backdrop-filter blur(10px)
- height: 131.23px including banner

### Banner
- height: 39.23px, maxWidth: 1600px, width: 1345px, radius: 10px, padding: 8px
- text: 14px / 23.24px / -0.28px, color rgb(29,28,27)
- emphasis: Milling Triplex 700

### Nav labels
- 16px / 24px / 0.16px, Milling Duplex, color rgb(244,243,243)

### Header CTAs (always visible, ml-auto, shrink-0)
- Globe + chevron language trigger (from 640px)
- Playground: solid paper pill, height 36px, radius 999, ink text `#1D1C1B`, no arrow
- Talk to Sales: outline pill, height 36px, radius 999, paper text `#F4F3F3`, 1px inset ring, no arrow
- Full nav from 1280px so CTAs do not clip at mid widths
- `.tl-site a` inherit is overridden via `.tl-header-cta-*` + inline color

## Text Content
🎉 TwelveLabs Raises $100M Series B to build the future of video superintelligence. Read more
Platform, Pricing, Solutions, Build, Resources, Company, Playground, Talk to Sales

## Responsive
- Desktop 1440: full nav
- 977 and below: hamburger (breakpoint ~1100)
