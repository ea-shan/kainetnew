# Visual QA — /clone-website vs tastelabs.com

## Matches
- Hero uses the original desktop/mobile WebM loops
- Challenge 3D screenshot cylinder + verbatim headline
- Mission cream page, right-column copy
- Product two-card email UI + success/error copy
- Team portraits + job groups verbatim
- Research three cards + Explore
- Nav invert dark↔light across sections
- Matter + Azeret Semimono loaded from extracted files

## Remaining gaps
- Footer swipe is a count UI, not the original canvas tile deck
- Lenis replaced with `scroll-behavior: smooth` (no RAF inertia)
- Hero HTML overlay sits above the video; original also uses GSAP page-load layers
- Job rows do not open Ashby (in-page `#team`)
- Product forms are client-only
