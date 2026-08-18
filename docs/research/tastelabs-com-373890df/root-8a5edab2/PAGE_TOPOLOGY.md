# Page Topology — tastelabs.com/

Fixed overlay: `.nav.w-nav` (70px, z-index 100). Scroll container: native + Lenis on `html.lenis`.

| # | Name | Selector | Top | Height | Theme | Interaction |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | SiteHeader | `.nav` | 0 (fixed) | 70 | inverts | hover scramble, mobile menu |
| 1 | HeroSection | `.main-content > .breakpoint-section` | 0 | 900 | dark | time-driven video loop |
| 2 | ChallengeSection | `.default-section.is-black` | 900 | 855 | dark | time-driven 3D carousel |
| 3 | MissionSection | `#about` | 1755 | 971 | light | static |
| 4 | ProductSection | `#product` | 2726 | 958 | dark | click (email form UI) |
| 5 | TeamSection | `#team` | 3684 | 1389 | light | drag/time marquee + click jobs |
| 6 | ResearchSection | 2nd `.breakpoint-section` | 5073 | 945 | dark | hover cards |
| 7 | SwipeFooter | 3rd `.breakpoint-section` + `footer` | 6018 | 1001 | light | drag tiles |

Nav invert markers: 1755 light, 2726 dark, 3684 light, 5073 dark, 6018 light.
