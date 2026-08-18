# Behaviors — tastelabs.com/

## Scroll
- Lenis (`html.lenis`, `autoRaf: true`) — smooth inertial scroll
- Nav stays fixed; background/logo/link color invert at section theme markers
- GSAP ScrollTrigger used on original for counters/scramble; clone uses IntersectionObserver for nav theme

## Click
- Nav links: in-page `#about` `#product` `#team` and `/clone-website` research target
- Join our team / job rows: `#team` or careers hash
- Product email forms: client-only success state
- Footer email copy button: clipboard + "Copied to clipboard!"
- Research cards: `#` placeholders (no real blog routes in this clone)

## Hover
- Nav links / buttons: text scramble (`01#/()[]_`, ~400ms)
- Job rows: arrow appears
- Research cards: slight lift

## Time
- Hero: `home_hero_loop_desktop.webm` (mobile variant under 768)
- Challenge carousel: continuous rotateY cylinder
- Team photos: CSS marquee, pointer-drag pauses/offsets

## Responsive
- 1440: 12-col grid, 40px page padding, 32px nav padding
- 768: 2-col product/research, marquee continues
- 390: stack, hamburger menu, mobile hero video
