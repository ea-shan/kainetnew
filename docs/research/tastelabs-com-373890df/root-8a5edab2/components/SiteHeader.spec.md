# SiteHeader Specification

## Overview
- **Target file:** `src/components/sites/tastelabs-com-373890df/root-8a5edab2/SiteHeader.tsx`
- **Interaction model:** hover scramble + scroll-driven theme invert + click mobile menu

## Computed Styles
- position: fixed; height: 70.16px; z-index: 100; padding: 16px 32px
- Dark: background #1e1e1e, text #f5f7f2, logo.svg
- Light: background #f5f7f2, text #1e1e1e, logo-black.svg
- Links: Azeret Semimono 13px / 22.4px / -0.1px
- CTA: border 1px, radius 7px, padding 6.88px 28px

## States
- Theme invert via IntersectionObserver on `[data-nav-theme]`
- Hover scramble on labels
- Mobile <900px: hamburger Open/Close menu

## Text
About, Product, Careers, Research, Join our team
