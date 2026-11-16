# kAInet landing page refactor plan

This is an implementation plan only. No app code changes ship with this document.

Live comparison target: [https://kainetnew.vercel.app/](https://kainetnew.vercel.app/). Captures of the current live sections are attached to the pull request that introduced this file.

---

## 1. Overview

The live kAInet homepage is a Next.js landing page whose **copy is mostly kAInet** and whose **motion system is still Twelve Labs**. The page was cloned from `www.twelvelabs.io` (`src/components/sites/www-twelvelabs-io-a368af44/`) and then rewritten in place. That history is visible on the live site: the hero is a WebGL funnel, Audience Research still captions “patented end-to-end video processing”, the “How it works” section is a 650vh video-intelligence cube of stock photos, Use Cases cards show basketball / LiveClip footage, and “Built in the open” is a makeup-and-glasses object-detection deck.

kAInet itself is **AI multi-agent marketing workflow automation for Google Ads and Meta**. A human writes one plain-language brief. Six specialist agents research, structure, write, build, analyse, and queue optimisations. Campaigns are written into the customer’s own ad accounts and **left paused**. Nothing spends until a human approves. That is the product. The landing page should show that loop, not video search.

This plan maps every homepage section to its files, then specifies — for each requested change — current state, target state, implementation steps, proposed copy, assets, performance / accessibility notes, and acceptance criteria.

**What should not change in this refactor:** the Use Cases carousel content (section 6) and the footer (section 9). Shared CSS and leftover Twelve Labs assets that those sections still consume are called out so later work does not break them.

**North star for the refactor:** cut scroll-jacked height, replace leftover video-AI visuals with product UI, keep kAInet tokens, and make motion cheaper than the current Three.js + Framer sticky stack.

---

## 2. Product context (what the page must sell)

kAInet is not a chat wrapper and not an autopilot bidder.

| Fact | Where the codebase already says it |
| --- | --- |
| Six specialists, one brief | `getStartedTabs` in `content.ts` |
| Platforms: Google Ads and Meta | nav, HITL card, hero body, CTA |
| Campaigns are built **paused** | `HeroSection`, `ExecutionScene`, HITL `Status: PAUSED` |
| Human approval is the gate | `AgentExperienceSection` Approval / Workflow Complete |
| Work happens in the customer’s own accounts | “Connect your accounts. Keep — everything else.” |
| Change log is the audit trail | `WorkflowsSection` closer, `SecuritySection` |
| Audience: performance agencies and in-house teams running $1M+ | `CtaSection` |

The six specialists, as the product/code defines them (`content.ts` `getStartedTabs`, mirrored in nav and footer):

1. **Audience Research Agent** — search demand, competitor bids, audience segments, *before* the brief is locked.
2. **Campaign Strategy Agent** — ad groups, match types, budget split, mapped from the research.
3. **Creative Assets Agent** — headlines, descriptions, and creative per ad group.
4. **Campaign Execution Agent** — the campaign written into Google / Meta, left paused.
5. **Performance Analysis Agent** — what is working and what is burning budget, daily.
6. **Optimization Agent** — tests, budget shifts, and fixes, queued for approval.

A fifth HITL phase, **Final Synthesis**, exists only in the approval mock (`HITL_PHASES` in `AgentExperienceSection.tsx`). It is a workflow rollup, not a seventh specialist. Do not add it to the six-tab section. Do include it in the condensed workflow demo as the “done” state.

The landing must stay honest that kAInet is early (no invented logos or fake ROAS). Proof is inspectability: paused builds, a readable change log, and a human on the launch button.

---

## 3. Current architecture and stack

| Layer | What ships today |
| --- | --- |
| App | Next.js 16.3.1 App Router, React 19, TypeScript |
| Homepage | `src/app/page.tsx` composes header + 8 sections + footer |
| Site clone root | `src/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/` |
| Shared chrome | `../shared/SiteButton.tsx`, `../shared/icons.tsx` |
| Tokens / CSS | `src/app/globals.css` (~3,480 lines). kAInet tokens live on `:root` (`--kai-*`). Twelve Labs aliases (`--color-tl-*`) still sit in `@theme`. |
| Motion | Three.js r185 (raw WebGL in hero + three specialist scenes), `@react-three/fiber` + `@react-three/drei` (Creative + Performance scenes), Framer Motion 13 (workflow pin, “How it works” cube, security deck) |
| UI extras | `lucide-react`, Base UI, CVA, unused `videostil` |
| Fonts | Geist + Geist Mono + IBM Plex Mono via `next/font`; Milling Duplex / Triplex via `@font-face` |
| Assets | `/public/sites/www-twelvelabs-io-a368af44/` — ~41 MB video, ~7.4 MB images, still named for the clone |
| Design system | `.cursor/skills/kalnet-design-system/` — do not introduce a competing visual language |

`src/app/page.tsx` render order (this is the live page):

1. `SiteHeader`
2. Dark band (`data-nav-dark`): `HeroSection` + `GetStartedSection`
3. `WorkflowsSection` — “two bad ways”
4. `AgentExperienceSection` — multi-agent workflow (420vh sticky)
5. `VideoIntelligenceModels` — “From brief to a campaign” (650vh sticky)
6. `TrustedBySection` — **empty** (`py-16` spacer, marquee commented out)
7. `SolutionsSection` — Use Cases (keep)
8. `SecuritySection` — “Built in the open”
9. `CtaSection`
10. `SiteFooter` (keep)

The TasteLabs clone under `src/components/sites/tastelabs-com-373890df/` is unused by the homepage.

---

## 4. Section-to-file map

Paths are relative to the repo root. Line ranges are the current `main` snapshot.

| # | Live section | Component | Styles | Animation / libs | Assets |
| --- | --- | --- | --- | --- | --- |
| 0 | Sticky nav | `SiteHeader.tsx` 73–166 | `.tl-header*` in `globals.css` | CSS hover mega-menu; `useLightBar` scroll inversion | `kainet.webp` via `LogoMark` |
| 1 | Hero | `HeroSection.tsx` 23–86; `HeroMosaic.tsx` 1–559 | `.tl-hero-band` 203–207, `.tl-hero-veil` 209–232, `.tl-hero-mosaic` 234–237, `.tl-hero-grad` 893+, `.tl-hero-ctas` 670–692 | Three.js custom shaders: 720 particle streams × 52 segs, 12 wave lines, 2400 flares **allocated but `flares.visible = false`**. `prefers-reduced-motion` freezes `uTime` at 0 but still boots WebGL. | None (procedural). Ground `#08080d` + CSS glow. |
| 2 | One brief. Six specialists. | `GetStartedSection.tsx` 15–134; `GetStartedBackground.tsx` 1–7; `content.ts` `getStartedTabs` 42–85 | `.tl-get-started` 239–244, `.tl-gs-*` 246–320, `.tl-pipe*` 504–586 | Tab state. Per-tab scenes below. | Fallback stills unused when a scene is mapped. |
| 2a | Audience Research | `OrchestrationScene.tsx` 1–307 | `.tl-pipe` | Raw Three.js cylinder “pipe”; leftover SPEED / SCALE / PROPRIETARY copy 266–281 | None |
| 2b | Campaign Strategy | `StrategyScene.tsx` 1–318 | `.tl-pipe.tl-strat` | Raw Three.js dashed plates + hex nodes | None |
| 2c | Creative Assets | `CreativeScene.tsx` 1–446 | `.tl-pipe.tl-gen` + inline `.tl-clip*` | R3F instanced cubes + Twelve Labs mosaic MP4s / stills popping as “clips” | `ai-orchestration.jpg`, `HOxj8HlO2OZ5zG747yPiJuucbXI.webp`, `cta-hub-operator.jpg`, `girl_cta.webp`, `clip-00/03/07.mp4`, `make-up.mp4` |
| 2d | Campaign Execution | `ExecutionScene.tsx` 1–291 | inline `EXEC_CSS` | CSS/React beats (compose → scan → paused → queue) over leftover videos | `clip-00.mp4`, `make-up.mp4`, `clip-07.mp4` |
| 2e | Performance Analysis | `SearchScene.tsx` 1–476 | `.tl-pipe.tl-search` + HUD CSS | R3F grid + HUD that still looks like a **video scrubber** | None (procedural) |
| 2f | Optimization | `OptimizationScene.tsx` 1–195 | `.tl-pipe.tl-opt` | Raw Three.js capsules through a torus gate | None |
| 3 | Two bad ways | `WorkflowsSection.tsx` 25–84; `comparePanels` in `content.ts` 87–108 | `.tl-wf-*` 322–462 | CSS check / cross SVG; no JS motion | None |
| 4 | Multi-agent workflow | `AgentExperienceSection.tsx` 1–835 | `.tl-agent` 1585–2900. **Height `420vh` desktop, `320vh` mobile.** Sticky pin `100dvh`. | Framer `useScroll` / `useTransform` scroll-jacked beats; typed prompt; HITL pane machine | `ai-orchestration.jpg`, `cta-hub-operator.jpg`, `workflow-a.png`, `kainet-mark.png` |
| 5 | From brief to a campaign | `VideoIntelligenceModels.tsx` 1–445 | `.tl-vim` 2902–3166. **Height `650vh`.** | Framer 3D CSS cube → cross → semantic clusters of **unrelated** `vim/00–15.jpg` | 16 JPGs under `images/vim/` |
| 6 | Use Cases (keep) | `SolutionsSection.tsx` 1–146; `solutions` in `content.ts` 116–141 | `.tl-solutions-track` | Infinite-loop carousel, CSS transform | `workflow-a/b/c.png` (Twelve Labs stills) |
| 6b | Empty trusted-by gap | `TrustedBySection.tsx` 1–17 | `py-16` on an empty `<section>` | Dead marquee commented out | `partnerLogos` unused |
| 7 | Built in the open | `SecuritySection.tsx` 1–29; `SecurityVideoDeck.tsx` 1–178 | `.tl-secure-*` | Framer `LayoutGroup` rotating **makeup / glasses / The Ordinary** videos + fake “GLASSES - 95%” detections | `make-up.mp4`, `glasses.mp4`, `the-ordinary.mp4` |
| 8 | CTA | `CtaSection.tsx` 1–55 | `.tl-cta-*` 1465–1583 | Looping `cta_bg.mp4` (2.6 MB) + animated `.tl-cta-glow` opacity **0.9**, `mix-blend-mode: screen`, 8s, `background-size: 300%` | `videos/cta_bg.mp4`, `images/cta-still.png`; unused `cta_bg_old.mp4` 4.6 MB |
| 9 | Footer (keep) | `SiteFooter.tsx` 1–39; `FooterBrandMark.tsx`; `CookiePreferences.tsx` | `.tl-foot-*` | CSS wash; cookie modal | none required |

Copy source of truth for most headlines / bodies: the TSX files themselves, not `content.ts`. `content.ts` owns nav, six-tab bodies, compare panels, use-case cards, and a large block of **dead** Twelve Labs KPIs / models / testimonials.

---

## 5. Live site vs source

Checked against [https://kainetnew.vercel.app/](https://kainetnew.vercel.app/) on 16 Nov 2026. The deployment matches this repo’s `main`. Notable live/source agreements that the refactor must fix:

- Hero funnel is the Three.js field in `HeroMosaic.tsx`.
- “One brief. Six specialists.” still opens with the kitchen-renovation lede, and the Audience Research visual still shows **SCALE 10k+ hrs/day** and **PROPRIETARY patented video processing**.
- “Connect your accounts” is a long sticky pin: hero copy → chat with the three example prompts and supporting-detail chips → Approval / Workflow Complete / Campaign Brief.
- “From brief to a campaign” is a white sticky scene whose media cube is generic photography, not kAInet UI.
- Use Cases cards still composite Twelve Labs product shots (LiveClip / basketball).
- “Built in the open” still cycles beauty-product detection videos.
- Header **Try for Free** still points at `https://auth.twelvelabs.io/u/login`; **Log in** at `https://www.twelvelabs.io/contact` (`SiteHeader.tsx` 124–135). Out of scope for the visual refactor unless bundled as a one-line href fix; call it out in dead code.

---

## 6. Section plans

Each subsection follows the same shape: current state → target → steps → copy → assets → perf / a11y → acceptance.

### 6.1 Hero header — replace the background animation

#### Current state

- **Files:** `HeroSection.tsx` 23–86 (copy, CTAs, trust row); `HeroMosaic.tsx` 1–559 (WebGL); CSS `.tl-hero-band` 203–237, `.tl-hero-veil` 209–232.
- **Copy (keep):** eyebrow “Multi-agent AI for performance marketing”; H1 “Your campaigns, built by AI. Launched by *you.*”; two-option body; “Every campaign is *built paused.*”; CTAs “Try for Free” / “Talk to us first”; trust “14 days free · No credit card · We set you up within 1–2 business days”.
- **Animation:** custom Three.js orthographic scene. `makeParticles` 720 streams × 52 segments (~37k line vertices), `makeWave` 12 × 80, `makeFlares` 2400 points that are constructed, uniform-updated, and never shown (`flares.visible = false` at `HeroMosaic.tsx` 463). `preserveDrawingBuffer: true` (line 435) keeps the GPU buffer around for no benefit. Mouse uniforms exist but are never fed. Reduced motion still mounts the renderer and runs `setAnimationLoop`.
- **LCP:** the LCP element is the H1, but the hero also boots WebGL + Three.js on first paint, competing with font and LCP. No poster / CSS-only first frame independent of JS.

#### Target state

Keep the copy and left-column layout. Replace the funnel with a **product-literate, lightweight field** that reads as “one brief, six specialists, paused campaign” and does not require Three.js.

#### Three concrete options

**Option A — Six-agent constellation (recommended)**

Canvas 2D (or SVG + CSS) on top of the existing `GROUND` / `GROUND_GLOW` CSS already in `HeroMosaic.tsx` 6–12.

- First paint: CSS background only. That is the LCP-safe layer; it needs no JS.
- After idle / `requestAnimationFrame`: one `<canvas>` (~60 particles max, 6 labelled nodes, 6 polylines converging on a centre “paused” lock).
- Nodes labelled Research, Strategy, Creative, Execution, Analysis, Optimisation. Centre lock uses `--kai-yellow` sparingly.
- Drift is slow (`ease: [0.22, 1, 0.36, 1]` per the kAInet motion spec). No additive bloom, no 2,400-point flare field.
- `prefers-reduced-motion: reduce` → CSS background + static SVG of the six nodes, canvas never created.
- Offscreen (`IntersectionObserver`) → `cancelAnimationFrame`.

This matches the design-system “orchestration visual” (one brief → six specialists → campaign) and deletes Three.js from the hero path.

**Option B — CSS-only gradient field + SVG network**

No canvas. Six absolutely positioned chips, CSS `offset-path` or `@media (prefers-reduced-motion: no-preference)` `translate` loops, SVG arcs. Cheapest, best LCP, least “premium”. Use if Option A still shows up in a performance budget.

**Option C — Keep the funnel metaphor, rewrite as one Canvas 2D stroke field**

Same left-stream / right-wave composition as today, 80–120 strokes, no WebGL. Looks familiar, still does not explain the product, still costs a continuous rAF. Only choose this if brand insists on the current silhouette.

**Recommendation: Option A.** It is the only option that both drops Three.js *and* sells the six-agent loop. Option B is the fallback if Lighthouse LCP regresses. Do not keep the current Three.js funnel.

#### Implementation steps

1. Extract `GROUND` / `GROUND_GLOW` and the left-column veil into a CSS-only `HeroBackdrop` so the first paint does not wait on `HeroMosaic`.
2. New `HeroConstellation.tsx` (`"use client"`): canvas boot gated on `matchMedia('(prefers-reduced-motion: reduce)')` **and** `IntersectionObserver`.
3. Delete `HeroMosaic.tsx` particle / wave / flare GLSL (or leave the file as a thin re-export during the PR, then delete).
4. Confirm Three.js is no longer imported from the hero. Do **not** remove `three` from `package.json` until specialist scenes are also off WebGL (section 6.2).
5. Keep `HeroSection.tsx` copy unchanged.

#### Copy changes

None in the hero. H1, body, paused line, CTAs, and trust row stay.

#### Assets needed

- Optional static SVG `public/.../hero-constellation.svg` (1440×900, inline-friendly) as the reduced-motion / no-JS frame.
- No MP4. No poster photograph. The CSS glow *is* the poster.

#### Performance and accessibility

- Hero JS budget after this change: no Three.js on the landing’s critical path. Canvas work ≤ one 2D context, DPR capped at 1.5, pause when not visible.
- Do not set `preserveDrawingBuffer`.
- `aria-hidden` on the decorative canvas; H1 remains the accessible name of the page.
- Colour contrast of body text on the veil already meets white-on-`#08080d`; keep the left-side gradient veil on desktop.
- Reduced motion: static SVG, no rAF.

#### Acceptance criteria

- [ ] Live hero copy unchanged.
- [ ] No `WebGLRenderer` constructed on the hero when `prefers-reduced-motion: reduce`.
- [ ] LCP element is still the H1 (or the CSS backdrop), not a canvas.
- [ ] On a mid-tier laptop, hero rAF callback stays well under 8 ms; no Three.js in the hero chunk.
- [ ] Six specialist nodes are labelled; a paused-campaign lock is the centre of gravity.
- [ ] Desktop and mobile keep the current type hierarchy; mobile may hide node labels and keep the CSS glow only.

---

### 6.2 “One brief. Six specialists.” — shorter copy, product animations

#### Current state

- **Files:** `GetStartedSection.tsx` 15–134; `content.ts` 42–85; six scene files listed in the map; CSS `.tl-gs-*`, `.tl-pipe*`.
- **Copy:** H2 “One brief. *Six specialists.*”
  - Lede (too long, kitchen metaphor): `GetStartedSection.tsx` 34–40.
  - Second paragraph (keep the idea, tighten): 42–47.
  - Per-tab bodies from `getStartedTabs` (already short — keep).
  - Closer 99–102: “That’s what multi-agent AI built for marketers actually means…”
- **Animation:** each tab mounts a different WebGL or hybrid scene. Audience Research is the worst mismatch: a 3D pipe labelled with **video-indexing** stats that still appear on production.

#### The six specialists (canonical)

Use these ids, titles, and one-line bodies. Bodies already live in `content.ts`; do not invent a seventh agent.

| id | Title | Body (keep) |
| --- | --- | --- |
| `audience-research` | 1. Audience Research Agent | Search demand, competitor bids, and audience segments, read before you brief. |
| `campaign-strategy` | 2. Campaign Strategy Agent | Ad groups, match types, and budget split, mapped from the research. |
| `creative-assets` | 3. Creative Assets Agent | Headlines, descriptions, and creative for every ad group you're running. |
| `campaign-execution` | 4. Campaign Execution Agent | Your whole campaign, built in your own ad account and left paused. |
| `performance-analysis` | 5. Performance Analysis Agent | What's working and what's burning budget. Every day. |
| `optimization` | 6. Optimization Agent | Tests, budget shifts, and fixes, queued for your approval. |

#### Target state

- Cut the kitchen lede to **two short paragraphs, ≤ 45 words combined**.
- Replace each tab’s visual with a **DOM/CSS storyboard of that agent’s actual job**. No Three.js, no mosaic MP4s, no “SPEED ~60x real-time ratio”.
- Keep the left-rail accordion. Auto-advance tabs every 6s when in view; pause on hover / focus / reduced motion.
- Right panel stays ~790:715, radius 40px, `--kai-dark` stage.

#### Proposed copy

**Eyebrow (keep):** `</> AI campaign orchestration`

**H2 (keep):** One brief. *Six specialists.*

**Lede (replace the kitchen paragraph + the current second paragraph):**

> One brief in plain language. Six specialists, each doing one job — research, structure, creative, build, analysis, optimisation.
>
> The campaign is written into your own Google and Meta accounts, **paused**, until you have seen it and said yes.

**Closer (replace):**

> Six specialists on one brief. Not one model doing an impression of six.

**Tab bodies:** keep the six lines in the table above. Drop the per-tab “Learn more” buttons (`href: "#"` is a no-op today).

#### Animation storyboards (one 5–6s loop per tab)

All six share a chrome: dark stage, kAInet tokens, a top label with the agent name, three caption chips (replace the leftover SPEED/SCALE/PROPRIETARY slots). Reduced motion: jump to the last beat and hold.

**1. Audience Research Agent** (`OrchestrationScene.tsx` → rewrite as DOM)

| t | Beat | What is on screen |
| --- | --- | --- |
| 0.0 | Brief lands | Chip: `DTC coffee · US · busy parents`. A search field types `coffee subscription parents`. |
| 1.0 | Demand | Sparkline of search volume; badge `High intent · 18 keywords`. |
| 2.2 | Competitors | Table rows: brand / competitor / generic, with bid ranges `$1.40–$4.10`. |
| 3.4 | Audiences | Pills: `In-market: Parents`, `Affinity: Coffee`, `Custom intent: DTC`. |
| 4.6 | Hold | Caption chips: `DEMAND` / `BIDS` / `SEGMENTS`. Loop. |

Replace current leftover chips (`SPEED ~60x…`, `SCALE 10k+ hrs/day`, `PROPRIETARY patented video…`) with:

- `DEMAND` — Search volume and intent, scored before anyone writes a keyword.
- `BIDS` — Competitor ranges, not a guess.
- `SEGMENTS` — Who is worth reaching, named before the brief locks.

**2. Campaign Strategy Agent** (`StrategyScene.tsx` → rewrite)

| t | Beat | What is on screen |
| --- | --- | --- |
| 0.0 | Research collapses | The three research chips shrink into a node `Brief`. |
| 1.0 | Tree | Ad groups branch: `Brand`, `Competitors`, `Generic`, `Remarketing`. |
| 2.2 | Budget | Donut 40 / 25 / 20 / 15 with `$5K/mo`. |
| 3.4 | Match types | Each group tags `Exact` / `Phrase` / `Broad-limited`. |
| 4.6 | Hold | Chips: `CHANNEL MIX` / `BUDGET` / `BIDS` (the existing StrategyScene captions at 278–293 are already on-product — **keep those three strings**). |

**3. Creative Assets Agent** (`CreativeScene.tsx` → rewrite)

| t | Beat | What is on screen |
| --- | --- | --- |
| 0.0 | Desk | RSA card for `Brand` ad group. |
| 1.0 | Headlines | Five headlines type in (use the HITL set, rewritten to coffee — see copy below). |
| 2.4 | Descriptions | Two RSA descriptions fade in. |
| 3.6 | Asset | Square image + sitelink row `Shop · Subscribe · Wholesale`. |
| 4.8 | Hold | Chips: keep CreativeScene 400–420 (`CREATIVE DIRECTOR`, `AD COPYWRITER`, `KAICREATIVE`, `4 COPY SPECIALISTS`) — those *are* product language. |

Do **not** pop Twelve Labs mosaic clips with timestamps `0:28 – 0:42`.

**4. Campaign Execution Agent** (`ExecutionScene.tsx` — keep the beat machine, replace the video)

The compose → review structure at `ExecutionScene.tsx` 8–54 and 212–247 is the closest thing on the page to the real product. Keep it.

| t | Beat | Change |
| --- | --- | --- |
| 0.0 | Compose | Supporting-detail wells arm: URL, Budget, Geography, Sitelinks, Negative Keywords, Image (already implemented). |
| 2.6 | Review | **Delete** the makeup / mosaic `<video>`. Show a Google Ads campaign card, `Status: PAUSED`, spend `$0`. |
| 3.8 | Dual-write | Meta card slides in, also `PAUSED`. |
| 5.0 | Hold | Existing chips `COMPLIANCE REVIEW` / `CAMPAIGN SETUP` / `LAUNCH QUEUE` (250–265) stay. |

**5. Performance Analysis Agent** (`SearchScene.tsx` → rewrite)

Delete the video-scrubber HUD (`0:18–0:42`, play knob). Keep the ROAS / CPA / CTR / FREQ pills — they are the right metrics — and stage them as a daily scorecard.

| t | Beat | What is on screen |
| --- | --- | --- |
| 0.0 | Clock | `Day 3 · Google Search · Brand`. |
| 1.2 | Scorecard | ROAS `3.1x`, CPA `$42`, CTR `6.4%`, Freq `2.1`. |
| 2.6 | Callout | “Burning: Display remarketing, CPA +18%.” |
| 4.0 | Risk | Chip `RISK · Moderate`. Hold. |

Keep captions at 435–450 (`LIVE ANALYSIS`, `10 DIMENSIONS`, `RISK CLASSIFICATION`) with `10 DIMENSIONS` rewritten to `FOUR READS` unless the product truly exposes ten.

**6. Optimization Agent** (`OptimizationScene.tsx` → rewrite)

| t | Beat | What is on screen |
| --- | --- | --- |
| 0.0 | Queue | Three test cards: match-type, RSA headline, geo bid adj. |
| 1.4 | Result | First card flips `Winner · Exact brand −12% CPA`. |
| 2.8 | Proposal | “Move 15% of Generic → Brand.” |
| 4.2 | Gate | Buttons `Apply` / `Reject` / `Skip on Drift`. None auto-fire. Hold. |

Keep captions at 150–170 (`TEST QUEUE`, `BUDGET SHIFTS`, `CAMPAIGN FIXES`, `APPROVAL`).

#### Implementation steps

1. Replace the two lede `<p>`s in `GetStartedSection.tsx` 34–47 and the closer 99–102.
2. Remove `tab.href` / “Learn more” from `getStartedTabs`.
3. Rewrite each scene as a DOM component sharing a small `AgentStage` chrome (dark panel, title, three chips). Do not add a scene framework.
4. Delete Three.js boots in Orchestration / Strategy / Optimization and the R3F boots in Creative / Search.
5. Keep `ExecutionScene`’s compose wells; swap `<video>` for paused account cards.
6. Autoplay tabs from `GetStartedSection` with `useReducedMotion` and hover/focus pause.
7. Once no landing scene imports `three` / `@react-three/fiber` / `@react-three/drei`, drop those dependencies (hero Option A must already be done).

#### Assets needed

| Asset | Size / format | Used in |
| --- | --- | --- |
| Coffee-brand square (PMax example) | 1200×1200 WebP, <120 KB | Creative + Execution |
| Eco-footwear square | 1200×1200 WebP, <120 KB | Creative (optional second RSA) |
| Google Ads / Meta wordmarks (already implied by `SecurityVideoDeck` SVGs) | inline SVG | Execution dual-write |

Generate the squares from the existing HITL marketing images **only if** they are kAInet-owned. Prefer a captured asset from the real Creative Agent output. Do not reuse `make-up.mp4` or mosaic sports clips.

#### Performance and accessibility

- One scene mounted at a time (already true). New scenes must be CSS/DOM, so tab switches do not create a WebGL context.
- Tabs are already `<button>`s; add `aria-selected` / `role="tab"` (Use Cases already does this; this section does not).
- Caption chips are visible text, not canvas.
- Reduced motion: no auto-advance, last beat shown.
- Delete mosaic MP4s from this section’s graph so they are no longer downloaded on tab 3/4.

#### Acceptance criteria

- [ ] Kitchen renovation copy is gone. Combined lede ≤ 45 words.
- [ ] All six specialists match the table; leftover video SPEED/SCALE/PROPRIETARY text is gone from production.
- [ ] Each tab’s loop is recognisably that agent’s job (research table, ad-group tree, RSA card, paused Google/Meta, scorecard, approval queue).
- [ ] No Three.js / R3F in this section.
- [ ] Keyboard: tabs are selectable; autoplay pauses on focus.
- [ ] Reduced motion shows the completed beat with no loop.

---

### 6.3 “There are two bad ways to do AI marketing.” — new copy and layout

#### Current state

- **Files:** `WorkflowsSection.tsx` 25–84; `comparePanels` `content.ts` 87–108; CSS `.tl-wf-*` 322–462.
- **Layout:** 2×2 grid of equally weighted cards. Both good and bad cards get `tl-wf-card-good` (line 51), so the visual difference is only the check vs cross SVG. Headline says *two* bad ways; the grid shows **two bad and two good**, which is four arguments and a long read.
- **Copy:** four 40–70 word bodies. Closer about the change log (76–79) is strong; keep a shorter version.

#### Target state

Make the structure match the headline: **two failures, then kAInet**. Desktop: three columns. Mobile: three stacked cards, kAInet last and visually heavier. No 2×2.

```
[ Autopilot AI ] [ Template AI ] [ kAInet — the one we ship ]
```

kAInet’s card uses Gradient 2 (`#D5A6C8` → `#CAC1CD`) and the check mark. The two bad cards stay on white / 8% purple hairline, cross mark, no pink wash.

#### Proposed copy

**H2:** Two ways AI marketing goes wrong. *We do neither.*

**Lede:** Autopilot spends while you sleep. Templates skip the work. kAInet does the work, then stops.

**Card 1 — The bad kind (autopilot)**

- Kicker: The bad kind
- Heading: Autopilot that moves money overnight
- Body: It pauses a winning campaign at 2am or shifts budget into an audience you would never pick. You find out in the morning — or on the invoice.

**Card 2 — The bad kind (templates)**

- Kicker: The bad kind
- Heading: A template with your product name dropped in
- Body: Same three headlines everyone else got. Fast because it is not thinking. Your competitor filled in the same form.

**Card 3 — kAInet**

- Kicker: What we ship
- Heading: The work, then a hard stop
- Body: Six specialists research, structure, write, and build inside your own Google and Meta accounts. Every campaign is left paused. You review, edit, and launch. Nothing spends until you say so.

**Closer (shorten, keep the log):**

> Your account. Your approval. Your change log — *what changed, and who changed it.*

#### Implementation steps

1. Replace `comparePanels` with a 3-item array `{ kind: 'bad' | 'bad' | 'good' }` (or a dedicated `contrastPanels`).
2. Change the grid in `WorkflowsSection.tsx` 41–74 from `grid-cols-2` to `grid-cols-1 md:grid-cols-3`. Drop the centre divider `span` (42–45).
3. Apply `tl-wf-card-good` **only** to `kind === 'good'`. Add a quieter `.tl-wf-card-bad` (white, hairline, no pink wash).
4. Swap H2 / lede / closer strings.
5. Do not add illustration. The check / cross marks are enough.

#### Copy changes

All copy in this section is new, as listed above. No leftover Twelve Labs strings here.

#### Assets needed

None. Do not add icons beyond the existing SVG marks.

#### Performance and accessibility

- No animation required. If a reveal is added, it is a 200ms opacity on scroll, gated on reduced motion.
- Three headings in source order match visual order (kAInet last).
- Cross / check stay `aria-hidden`; kickers are the accessible differentiator (“The bad kind” / “What we ship”).

#### Acceptance criteria

- [ ] Headline, three cards, one closer. No 2×2.
- [ ] Bad cards are visually quieter than the kAInet card.
- [ ] Combined body copy is shorter than today (four long panels → three short).
- [ ] Change-log closer still present, one line.
- [ ] Mobile stacks Autopilot → Template → kAInet with no horizontal scroll.

---

### 6.4 Multi-Agent Workflow Automation — cut the scroll

#### Current state

- **Files:** `AgentExperienceSection.tsx` 1–835 (ChatCard, HitlCard, WorkspaceBackground, typed prompt, HITL panes); CSS `.tl-agent` 1585–2900.
- **Height:** `height: 420vh` desktop (1587), `320vh` mobile (2834–2836). Sticky pin `100dvh`. That is **~3,800 px of scroll-jacking** on a 900px viewport, plus another 650vh in the next section.
- **Copy / UI already on the live site (keep the *content*, restage it):**
  - Eyebrow: Multi-Agent Workflow Automation
  - H2: Connect your accounts. Keep — *everything else.*
  - Renewal-call lede: “You've had the renewal call where you realise leaving means rebuilding everything from scratch. That can't happen here.”
  - Example prompts (`CHIPS` 18–22): Performance Max / DTC coffee / $5K; B2B SaaS Search / $12K; Demand Gen / eco footwear.
  - Supporting details: URL, Budget, Geography, Sitelinks, Negative Keywords, Image.
  - Reply: “Two ads are in your accounts, paused…”
  - HITL: Approval, Workflow Complete!, + Create AI Workflow, Campaign Brief, phases 1–5, Final Synthesis, View Campaign Approval.
  - Ownership block: “kAInet connects to your own Google and Meta accounts…” + Nothing to migrate / export / hold over you. CTA “Integrate your ad accounts now!”
- **Ghost workspace** (`STRUCTURE`, `BRIEF`, `CLIPS` 648–668) still talks about `campaign_kitchen_v3.mp4`, “Fitters on site”, “Handheld / No studio lighting”. That is leftover video-brief language and should die with the pin.

#### Target state

Collapse the three Framer beats (hero → chat → HITL) into **one compact, auto-playing demo** that is **not sticky**.

**Recommended layout (desktop ~900×720, mobile stacked ~100vh):**

```
[ Copy column, 36% ]     [ Demo column, 64% ]
Connect your accounts…    Tabs: Brief | Build | Approve
Renewal-call lede         Autoplay 0→1→2, 5s each
3 ownership bullets       Pause on hover / focus
CTA                       Reduced motion: tablist, no play
```

**Height budget**

| Viewport | Current | Target |
| --- | --- | --- |
| Desktop | 420vh section, 100dvh sticky pin (~3,800px scroll) | **one block, 720–800px** (~80–88vh at 900px). Hard ceiling **900px**. |
| Tablet | same sticky | **auto height, ≤ 1,100px** |
| Mobile | 320vh sticky | **auto height, ≤ 1,200px**, demo under copy, tabs not a pin |
| Reduced motion | `is-static` already unpacks the pin | keep auto height; show the Approve tab by default |

Do not keep a sticky pin “just a bit shorter”. The bug is the pin, not only the 420vh.

**Alternative (if the owner wants to keep theatre):** a 180vh pin with two beats only (chat → approve). Still worse than tabs. Do not ship 300vh+.

#### Implementation steps

1. Delete `useScroll` / `useTransform` / `useMotionValueEvent` from this section. Framer stays only if a 200ms tab fade needs it — CSS is enough.
2. CSS: `.tl-agent { height: auto; }`, `.tl-agent-pin { position: relative; height: auto; }`. Remove the 420vh / 320vh media query.
3. Build a `WorkflowDemo` with three panels:
   - **Brief** — existing `ChatCard` UI (chips, prompt, details) without scroll-linked typing. CSS typing optional, 1.2s, skipped on reduced motion.
   - **Build** — the three rail ads (`ADS` 37–53) + “Analyzing with kAInet…” steps, rewritten off the kitchen ghost.
   - **Approve** — existing `HitlCard` report pane (Workflow Complete + Campaign Brief). Nested Campaign / Creative / Groups / Assets stay clickable, not scroll-driven (`paneAt` 373–380 goes away).
4. Autoplay via `setInterval` 5s, `IntersectionObserver` to start, hover/focus/`prefers-reduced-motion` to stop.
5. Delete `WorkspaceBackground` (kitchen / mp4 / 00:00 scrubber) or replace its two account rows (`Google Ads · Manchester`, `Meta Ads · Business Suite`) as a quiet footer under the demo: `Google Ads · connected` / `Meta Ads · connected`.
6. Move the ownership lede + three bullets + CTA into the left column so they are visible **without scrolling the demo**.

#### Copy changes

**Keep** H2, renewal-call lede, three example prompts, supporting-detail labels, ownership paragraph, three bullets, CTA.

**Rewrite the Build-step ghost (currently kitchen / video):**

- Step list: `Reading your Google and Meta accounts` → `Drafting keywords and audiences` → `Writing campaigns, paused`.
- File row: `PMax · DTC coffee · US · $5K/mo` / `2 campaigns · paused` (not `campaign_kitchen_v3.mp4`).
- Strip `Opening (0–3s)` / `Fitters on site` / `Handheld` entirely.

**HITL phases (keep, but name the missing specialists in the report):**

Today: Audience Research, Campaign Strategy, Creative Assets, Campaign Execution, Final Synthesis.

Add Performance Analysis and Optimization as *queued* (not completed) on a first-run brief, **or** keep Final Synthesis as the rollup and do not pretend analysis has already run on a brand-new campaign. Recommended: keep the five HITL phases as-is for a *launch* workflow; analysis/optimisation appear on a second tab labelled “After launch” only if it fits the 800px ceiling. Do not grow the card.

#### Assets needed

- Reuse `ADS[]` stills only if they are replaced with the coffee / SaaS / footwear squares from 6.2. Current `ai-orchestration.jpg` / `cta-hub-operator.jpg` / `workflow-a.png` are leftover clone photography.
- `kainet-mark.png` stays for the Assets pane.

#### Performance and accessibility

- Removing 420vh of sticky transforms is the single largest main-thread win on the page after deleting hero WebGL.
- No scroll-linked `setState` on every pixel (`useTyped` + `useMotionValueEvent` currently fire for the whole pin).
- Tabs: `role="tablist"`, `aria-selected`, arrow keys.
- HITL nested buttons already exist; they must remain reachable without a 4-viewport scroll.
- Reduced motion: Approve tab visible, no typing, no interval.

#### Acceptance criteria

- [ ] Section height ≤ 900px desktop, no `position: sticky` pin, no `420vh`.
- [ ] All of: example prompts, supporting-detail chips, Workflow Complete, Campaign Brief, + Create AI Workflow, ownership bullets, CTA — still present and reachable without a scripted scroll.
- [ ] Kitchen / mp4 / 0–3s structure copy is gone.
- [ ] Autoplay pauses on hover, focus, offscreen, and reduced motion.
- [ ] Lighthouse “Avoid enormous network payloads” no longer charges this section for being 4 viewports of JS-driven opacity.

---

### 6.5 “From brief to a campaign that's ready to launch” — real product images

#### Current state

- **Files:** `VideoIntelligenceModels.tsx` 1–445 (still named for Twelve Labs); CSS `.tl-vim` 2902–3166, **`height: 650vh`**.
- **Copy (keep the words, restage):**
  - How it works — From brief to a campaign that's ready to launch. “Brief to something worth reviewing: about 12 minutes…”
  - Step 1 Brief it. / Step 2 Review it. / Step 3 Approve it. / Step 4 Improve it.
- **Visual:** ~90–150 CSS 3D tiles of `images/vim/00.jpg`–`15.jpg` (dogs, surfers, chefs, crowds) with labels like “A DOG SPRINTS ACROSS SAND”. This is the old Marengo/Pegasus demo. It does not show a campaign. Reduced motion hides almost all of it (`opacity: 0` on labels, cube rest pose).

#### Target state

Kill the 650vh pin and the media cube. Replace with a **4-step product strip**: each step has its headline (already written) and a real UI screenshot.

Desktop layout (~1,100px tall, not sticky):

```
Header (centred, existing copy)

[ Brief it  ] [ Review it ] [ Approve it ] [ Improve it ]
[ shot 1    ] [ shot 2    ] [ shot 3     ] [ shot 4     ]
```

Mobile: vertical snap, one step per screen-ish (~640px each), still no pin. Total section target **≤ 1,200px desktop / ≤ 2,200px mobile**.

Optional cheap motion: a 12s CSS crossfade through the four shots in one large frame, with the four steps as a progress rail. Prefer the 4-up grid — it is honest and does not scroll-jack.

#### Exact images required

Capture from **staging kAInet** if it exists; otherwise from the HITL mock already in `AgentExperienceSection` (it is the most accurate product chrome in the repo) composited at 2x.

| ID | Step | Shot | Frame | Format | Where it goes |
| --- | --- | --- | --- | --- | --- |
| `how-01-brief` | 1. Brief it | Chat composer with the Performance Max / coffee prompt typed, supporting-detail chips visible, send armed | **1600×1000** crop of the chat card on light `#f1f1ef`, 2x source **3200×2000** if available | WebP, q80, <180 KB | Step 1 figure |
| `how-02-review` | 2. Review it | Campaign Execution Approval: Overview tab, Campaign Type SEARCH (or PMax), Status **PAUSED**, name readable | **1600×1000** | WebP <180 KB | Step 2 |
| `how-03-approve` | 3. Approve it | Workflow Complete + Campaign Brief phases, `+ Create AI Workflow` **not** the primary; **Approve** / **Modify** visible. Status still paused | **1600×1000** | WebP <180 KB | Step 3 |
| `how-04-improve` | 4. Improve it | Performance scorecard + Optimization queue with Apply / Reject / Skip (can be the new Analysis + Optimization scenes from 6.2 composited) | **1600×1000** | WebP <180 KB | Step 4 |

Optional extras, same spec, used as hover / mobile carousel:

- `how-02b-creative.webp` — RSA headlines + descriptions (HITL Creative pane).
- `how-02c-assets.webp` — square logo + marketing images (HITL Assets pane).
- `how-01b-accounts.webp` — Google Ads + Meta “Connected” rows.

**Display size in layout:** 800×500 CSS pixels (2x assets). Radius 24px. 8px inner shadow using `--kai-purple` at 8% opacity. No glassmorphism.

**How to generate**

1. Best: log into staging, run the coffee PMax brief, screenshot Chrome at 1600×1000 device metrics, crop chrome, export WebP.
2. Fallback: stand up the HITL card and ChatCard in isolation (they already render the right UI), `page.screenshot` at 2x, crop.
3. Do not generate Midjourney “dashboard” fakes. Do not reuse `vim/*.jpg`.

File location: `public/sites/www-twelvelabs-io-a368af44/root-8a5edab2/images/how-it-works/` (keep the clone path for this pass; a later cleanup can move to `/images/kainet/`).

#### Implementation steps

1. New `HowItWorksSection.tsx` (~150 lines) replacing `VideoIntelligenceModels` in `page.tsx`.
2. Port the five `NarrativeBlock` copy strings verbatim.
3. Delete `.tl-vim` 650vh CSS after the new section has its own class (`.kai-how`).
4. Stop importing `images/vim/*.jpg` so they can be deleted in the dead-code pass.
5. `next/image` with width 800 height 500, `sizes` for 4-up vs stacked.

#### Copy changes

None of the visible sentences. Optional eyebrow already “How it works”. Do not add fake “12 min average across 140 accounts” metrics.

#### Assets needed

The four WebPs above, plus `alt` text:

- `how-01-brief`: “kAInet chat composer with a Performance Max brief for a DTC coffee brand.”
- `how-02-review`: “Campaign approval overview showing a paused Google Ads campaign.”
- `how-03-approve`: “Workflow complete screen with campaign brief phases and approve action.”
- `how-04-improve`: “Performance scorecard and optimisation queue waiting for approval.”

#### Performance and accessibility

- Deleting 650vh of 3D CSS (90–150 images in a perspective world) is the other large jank win.
- Four WebPs < 180 KB beats sixteen JPGs decoded as 3D faces.
- Each `<img>` has real `alt`. Steps are an `<ol>`.
- Reduced motion: static 4-up, no crossfade.

#### Acceptance criteria

- [ ] No `.tl-vim` pin, no `650vh`, no dog/surfer/chef cluster labels.
- [ ] Four product shots, each matching the step copy next to it.
- [ ] Section ≤ 1,200px desktop.
- [ ] Images are WebP, explicitly dimensioned, no layout shift.
- [ ] “Improve it.” still names Performance Analysis Agent and Optimization Agent.

---

### 6.6 Use Cases — stay as is

No copy, layout, or carousel behaviour change.

**Shared dependencies this refactor must not break:**

| Dependency | Risk |
| --- | --- |
| `solutions` in `content.ts` 116–141 | Do not rename fields while editing compare panels / tabs in the same file. |
| `SolutionsSection.tsx` carousel (`GAP`, cloned slides, `--sol-tx`) | Untouched. |
| `.tl-solutions-track` and `.tl-page` | Keep while rewriting `.tl-wf-*` / `.tl-agent` / `.tl-vim`. |
| `workflow-a.png` / `workflow-b.png` / `workflow-c.png` | Still the card backgrounds. **Do not delete** in the dead-asset pass until Use Cases is separately restaged. |
| `SiteButton` / `ArrowUpRightIcon` | Shared with hero, six-specialists, CTA. |
| Header Use Cases mega-menu (`content.ts` 29–37) | Same three destinations. Links currently 404 (`/use-cases/agencies` etc. have no route) — out of scope, noted only. |

**Known debt, not in this refactor:** card photography is still Twelve Labs (basketball / LiveClip). Call it out so a later pass can swap in agency / in-house / enterprise shots without touching carousel logic.

#### Acceptance criteria

- [ ] After the other sections ship, Use Cases still loops, tabs still select, copy unchanged.

---

### 6.7 “Built in the open” — new concept

#### Current state

- **Files:** `SecuritySection.tsx` 3–28 (copy); `SecurityVideoDeck.tsx` 1–178 (visual); CSS `.tl-secure-*`.
- **Copy:** honest “we are early” — keep the intent, not the length.
- **Visual:** Framer deck of `make-up.mp4` / `glasses.mp4` / `the-ordinary.mp4` with overlay `GLASSES - 95%`. Google / Meta marks and a lock are the only on-product parts. The videos are a leftover Twelve Labs *object detection* demo and contradict “built in the open”.

#### Target state — recommended concept: **the change log is the proof**

kAInet cannot show a wall of logos. What it *can* show, because it writes into the customer’s own accounts, is a **readable activity log**. That is more on-brand than another video collage and more useful than another abstract lock.

Desktop: two columns (log on the left, copy on the right) — same grid as today, new left child.

```
[ Change log mock ]     Built in the open
  14:22  Audience Research completed
  14:24  Campaign written · Google Ads · PAUSED
  14:24  Campaign written · Meta · PAUSED
  14:31  You approved launch
  lock + “Every line is in your account”
```

Do not use detection bounding boxes. Do not use beauty videos.

**Rejected alternatives**

- “Open source” — kAInet is not claiming that.
- “Architecture diagram of six agents” — duplicates section 6.2.
- “Fake testimonial wall with blurred marks” — the current copy correctly refuses this.

#### Proposed copy

**H2:** Built in the open

**Body:**

> **kAInet is early.** Our first accounts started this summer. We will not borrow someone else’s results or dress a demo number up as a customer’s.
>
> What you can check, on day one, is the work itself. Every write to Google or Meta lands in your account, paused, timestamped, and attributable. The change log is not a slide. It is the product.
>
> When we publish numbers, they will be real, and we will tell you how we counted them.

**Log mock rows (visible UI copy):**

| Time | Actor | Event |
| --- | --- | --- |
| 14:22:08 | Audience Research Agent | Demand, bids, and segments written to the brief |
| 14:24:41 | Campaign Execution Agent | Google Ads campaign created · **Paused** |
| 14:24:44 | Campaign Execution Agent | Meta campaign created · **Paused** |
| 14:31:02 | You | Launch approved |

Caption under the log: “Every action kAInet takes in your account, timestamped and attributable.” (reuse `SecurityVideoDeck` NOTES `log`). Secondary caption: “Google and Meta campaigns, built and left paused, with a human on every launch.” (rewrite of NOTES `today`, dropping “optimized end to end” unless that is strictly true on day one).

#### Implementation steps

1. New `ChangeLogDeck.tsx` (~80 lines, CSS list, no Framer `LayoutGroup`).
2. Swap it in for `SecurityVideoDeck` in `SecuritySection.tsx`.
3. Replace the three body paragraphs.
4. Keep the Google / Meta SVG marks from `SecurityVideoDeck.tsx` 167+ if they are original; otherwise inline simple marks.
5. Delete the security video rotation (`STEP_MS = 5500`, `CLIPS`). `make-up.mp4` / `glasses.mp4` / `the-ordinary.mp4` become unused unless Creative/Execution still reference them — after 6.2 they should not.

#### Assets needed

None, if the log is DOM. Optional: a 1600×1000 WebP of a real Google Ads change-history panel (`how-log.webp`) behind the DOM rows at 8% opacity. Only use a real screenshot, never a generated “security dashboard”.

#### Performance and accessibility

- Three autoplaying videos → zero videos. Largest win in this section.
- Log is an `<ol>`; times in `<time datetime>`.
- Reduced motion: no row stagger, all four rows visible.

#### Acceptance criteria

- [ ] No makeup / glasses / Ordinary videos, no “GLASSES - 95%”.
- [ ] Copy still admits kAInet is early and refuses fake numbers.
- [ ] Visual is a change log with paused Google / Meta writes and a human approval.
- [ ] Section still two-column on desktop, stacked on mobile.

---

### 6.8 CTA — keep content, quiet the background

#### Current state

- **Files:** `CtaSection.tsx` 1–55; CSS `.tl-cta-*` 1465–1583.
- **Copy (keep all of it):**
  - Kicker: Your campaigns, built by AI. Launched by you.
  - H2: For performance agencies and the in-house teams running *$1M+ in Google and Meta spend*
  - Lede: Bring your next campaign. See what six agents and one approval get you. It's built paused, so there's nothing to undo.
  - CTAs: Request Early Access / Talk to us first
  - Note: 14 days free. No credit card. We set you up within 1–2 business days — your 14 days start when you get in, not when you ask.
- **Motion:** `cta_bg.mp4` 2.6 MB looping under the plate; `.tl-cta-glow` at **opacity 0.9**, `mix-blend-mode: screen`, 8s linear, `background-size: 300%`; veil already darkens the film. Reduced motion stops **only** the glow animation (1578–1583); the video still autoplays.

#### Target state

Same copy, same plate, same buttons. Background becomes a **supporting wash**, not a second show.

#### Specific parameter changes

Apply in `globals.css` and `CtaSection.tsx`. Do not restyle the type.

| Parameter | Current | Target |
| --- | --- | --- |
| `.tl-cta-glow` `opacity` | `0.9` | **`0.28`** |
| `.tl-cta-glow` `mix-blend-mode` | `screen` | **`soft-light`** (fallback `overlay`) |
| `.tl-cta-glow` animation | `8s linear infinite` | **`18s linear infinite`** |
| `.tl-cta-glow` `background-size` | `300% 100%` | **`180% 100%`** |
| `.tl-cta-glow` mask ellipse | `72% 60%` transparent hole `54%` | Keep hole; raise opaque rim so the glow sits at the **edge** of the plate, not over the type |
| `.tl-cta-veil` centre stop | `rgba(8,8,13,0.72)` | **`0.84`** |
| `.tl-cta-veil` mid stop | `0.48` | **`0.62`** |
| `.tl-cta-video` opacity (new) | implicit 1 | **`0.45`** |
| Video `preload` | `metadata` | keep |
| Video playback | always `autoPlay` | **play only when in view**; **pause (or `display:none` + poster)** on `prefers-reduced-motion` |
| Mobile `<768px` | same MP4 | **poster only** (`cta-still.png`); do not download the 2.6 MB file |
| `cta_bg_old.mp4` 4.6 MB | sitting in `/public` | **delete** (unused import) |

Optional later: replace the people/doves loop with a 4s CSS gradient using `--kai-cta-grad` and drop the MP4 entirely. Not required if the opacity/veil changes hold.

#### Implementation steps

1. Patch the CSS numbers in the table.
2. Wrap the `<video>` in a small client island: `IntersectionObserver` + `matchMedia('(prefers-reduced-motion: reduce)')` + `matchMedia('(max-width: 767px)')`.
3. Poster is already `cta-still.png` — make it the mobile/reduced-motion background (`background-image` on `.tl-cta-plate`).
4. Delete `videos/cta_bg_old.mp4`.

#### Copy changes

None.

#### Assets needed

None new. Keep `cta_bg.mp4` and `cta-still.png` for this pass.

#### Performance and accessibility

- Mobile no longer pays 2.6 MB for a decorative loop.
- Reduced motion: static poster, no glow animation (already), no `play()`.
- Contrast: raising the veil to 0.84 is required once glow drops, so the H2 stays ≥ 4.5:1 on the film.
- `aria-hidden` already on the video.

#### Acceptance criteria

- [ ] All CTA copy unchanged.
- [ ] Glow is visibly quieter; type is more readable, not less.
- [ ] Reduced motion and mobile show the poster, not a playing video.
- [ ] `cta_bg_old.mp4` gone.
- [ ] Desktop video pauses when the CTA is offscreen.

---

### 6.9 Footer — stay as is

No copy, column, wordmark, or legal changes.

**Do not break:** `footerColumns` in `content.ts`, `FooterBrandMark`, `CookiePreferences`, `.tl-foot-wash` / `.tl-foot-hero` / `.tl-foot-legal`.

A later href pass should replace `#` legal links and the Twelve Labs header URLs; that is not this refactor.

---

## 7. Shared components and dead code

### Shared (touch carefully)

| Unit | Used by | Notes |
| --- | --- | --- |
| `SiteButton` / `LogoMark` | Header, hero, six-specialists, workflow CTA, footer-adjacent CTAs | Keep API. |
| `icons.tsx` | Header mega-menu, HITL, trust row | `PegasusIcon` / `HorseIcon` only serve dead `ModelsSection`. |
| `--kai-*` tokens | Entire page | Do not introduce a second palette. |
| `.tl-hero-grad` / `.tl-preview-text` | Almost every eyebrow and accent span | Keep. |
| `.tl-page` | Every section | Keep. |
| `ASSET` / `SHARED` constants | All media URLs | Keep the clone path for this pass. |

### Dead or leftover — delete in a dedicated cleanup PR (or the last phase)

| Item | Why it is dead |
| --- | --- |
| `KpisSection.tsx`, `kpis` in `content.ts` | Twelve Labs video KPIs; not mounted |
| `ModelsSection.tsx`, `models` in `content.ts` | Marengo / Pegasus; not mounted |
| `TestimonialsSection.tsx`, `testimonials` in `content.ts` | NFL / MLSE / TwelveLabs quotes; not mounted |
| `WorkflowVisual.tsx` | Patriots / compliance scenes; not imported |
| `TrustedBySection.tsx` **is mounted** but empty | Remove from `page.tsx` to kill the blank `py-16` gap above Use Cases (this *is* in scope as a one-line page.tsx deletion; the section stays unused) |
| `partnerLogos` | Only referenced by the commented marquee |
| `HeroMosaic` flare field | 2400 points allocated, `visible = false` |
| `cta_bg_old.mp4` | Unused |
| TasteLabs tree `src/components/sites/tastelabs-com-373890df/` + `public/sites/tastelabs-com-373890df/` | Not on the homepage |
| `src/app/clone-website/` | Clone sandbox, not the marketing page |
| Header hrefs to `auth.twelvelabs.io` / `www.twelvelabs.io/contact` | Wrong product; one-line fix, separate from visuals |
| `videostil` dependency | Not imported by landing components |
| `@react-three/drei`, `@react-three/fiber`, `three` | Removable after 6.1 and 6.2 |

`ponytail:` deleting the TasteLabs / clone-website trees is a large diff with no user-facing landing change. Do it last, in its own PR, so this refactor’s review stays about the homepage.

---

## 8. Animation and performance budget

The current page runs **three** continuous GPU/main-thread systems at once: hero WebGL, six-tab WebGL (on interaction), and ~1,070vh of Framer sticky sections.

### Budget for the refactored homepage

| Rule | Number |
| --- | --- |
| WebGL contexts on the homepage | **0** |
| Sticky scroll-jacked sections | **0** |
| Decorative MP4 on mobile | **0** |
| Decorative MP4 on desktop | CTA only, in-view, opacity 0.45, paused offscreen |
| Canvas 2D instances | ≤ 1 (hero), paused offscreen and on reduced motion |
| Hero particles | ≤ 60 |
| Section enter motion | opacity + 12px translate, 400ms, `cubic-bezier(0.22, 1, 0.36, 1)` |
| Autoplay intervals | six-specialists tabs 6s; workflow demo 5s; both pause on hover/focus/reduced-motion |
| LCP | H1 or CSS hero backdrop; no font-display:block surprise (already `swap` on Milling) |
| JS from `three` / R3F / drei on first load | **0** after phases 1–2 |
| Homepage image payload (new shots) | ≤ ~800 KB WebP total (4 how-it-works + 2 creative squares) |
| Removed video payload | mosaic clips + makeup/glasses/ordinary + `cta_bg_old` once unused |

### Reduced motion (global)

One policy, applied everywhere:

1. No WebGL, no canvas rAF, no MP4, no autoplay tabs.
2. Sticky pins already have `is-static` — after this plan they should not exist.
3. End-state of every storyboard is the default render.

---

## 9. Phased implementation order

Estimates are **invasiveness**, not calendar time. An autonomous agent can sequence them as separate PRs.

| Phase | What | Subsystems | Invasiveness | Depends on |
| --- | --- | --- | --- | --- |
| **0** | Remove `TrustedBySection` from `page.tsx`; delete `cta_bg_old.mp4`. One-line / one-file. | `page.tsx`, public video | Trivial | — |
| **1** | Hero Option A + CTA parameter table | `HeroMosaic.tsx`, `CtaSection.tsx`, `.tl-cta-*` | Isolated. Highest LCP leverage. | — |
| **2** | Six specialists copy cut + DOM storyboards; drop Three/R3F from those scenes | `GetStartedSection.tsx`, six scene files, `content.ts` tabs | Medium. Six visuals, one accordion. | Hero no longer needs `three` if Option A shipped |
| **3** | Two-bad-ways 3-column restyle | `WorkflowsSection.tsx`, `comparePanels` | Isolated CSS + copy | — |
| **4** | Workflow demo: kill 420vh pin, tab Brief/Build/Approve | `AgentExperienceSection.tsx`, `.tl-agent*` | High. This file is 835 lines of scroll math. | — |
| **5** | How-it-works product shots; kill 650vh vim cube | new section, `page.tsx`, `.tl-vim*` | High structurally, low visually once shots exist | **Asset gate:** the four WebPs |
| **6** | Built in the open → change log | `SecuritySection.tsx`, replace `SecurityVideoDeck` | Isolated | Phase 2 should have released the beauty MP4s |
| **7** | Dead code / dep drop (`three`, R3F, drei, unused sections, mosaic MP4s not used by Use Cases) | package.json, several files | Large diff, no visual change | Phases 1, 2, 5, 6 |
| **8** | QA pass (section 11) | — | — | 1–6 |

Phases 1, 3, and 6 can proceed in parallel. Phase 5 is blocked on screenshots. Phase 4 is the riskiest UX change (people may miss the theatre); ship behind a preview URL and watch bounce on that scroll depth.

**Suggested PR split:** 0+1+3+8-smoke, then 2, then 4, then 5, then 6, then 7. Use Cases and footer never appear in those diffs except shared CSS collisions.

---

## 10. Risks

| Risk | Why it is real | Mitigation |
| --- | --- | --- |
| Scroll-jack removal feels “less premium” | The 420vh + 650vh pins are the loudest motion on the page | Tab autoplay and product screenshots have to be *sharp*, not generic. Preview side-by-side with production. |
| Product screenshots do not exist yet | This repo has no app, only a HITL mock | Phase 5 fallback: screenshot the HITL/ChatCard at 2x. Do not generate fake dashboards. |
| Use Cases still shows basketball | Shared `workflow-*.png` | Leave them. A later Use Cases pass replaces images only. |
| Three.js used in six files | Deleting the dep too early breaks leftover scenes | Drop `three` only in phase 7 after grep is clean. |
| Header still links to Twelve Labs | Users hitting Try for Free leave kAInet | Out of visual scope; fix hrefs in the first engineering PR anyway (one line, no design). |
| Token drift | New scenes may hardcode `#08080d` (already common) | Use `--kai-*` only. |
| `content.ts` is a shared bag | Editing `comparePanels` beside `solutions` | Touch only the arrays named in each phase. |
| Reduced-motion users already skip the pins | `is-static` unpacks 420vh into a tall stack | After the refactor, static height must still fit the ceilings in 6.4 / 6.5. |
| LCP regression from canvas | Option A canvas painted too early | CSS glow first; canvas after idle. |

---

## 11. QA checklist

### Responsive

- [ ] 375, 768, 1024, 1440, 1920. No horizontal overflow (hero canvas and how-it-works 4-up are the likely offenders).
- [ ] Hero: type remains left-aligned; constellation may hide labels below 768.
- [ ] Six specialists: accordion full width, visual under it on mobile, not beside.
- [ ] Two-bad-ways: 3-up → 1-up, kAInet card last.
- [ ] Workflow demo: ≤ 1,200px tall on mobile, tabs usable with a thumb, no sticky pin.
- [ ] How-it-works: 4-up → 1-up, images do not crop the paused status chip.
- [ ] Use Cases carousel unchanged at 768 and 1440.
- [ ] CTA plate radius / padding unchanged; poster not video on <768.
- [ ] Footer columns collapse as today.

### Reduced motion

- [ ] `prefers-reduced-motion: reduce` (OS and DevTools): no hero canvas, no tab autoplay, no workflow interval, no CTA video, no glow animation, no Framer layout rotation.
- [ ] End-states visible: six-specialists last beat, workflow Approve tab, how-it-works all four shots.

### Lighthouse (desktop + mobile, production preview)

- [ ] LCP < 2.5s on mid-tier 4G (H1 or CSS backdrop).
- [ ] No “WebGL” / Three.js in unused-JS after phase 7.
- [ ] CLS < 0.1 (explicit image widths on how-it-works).
- [ ] Main-thread work: no scroll listeners driving `setState` per frame.
- [ ] Mobile does not download `cta_bg.mp4` or mosaic clips.

### Cross-browser

- [ ] Chrome, Safari 17+, Firefox, Edge. Canvas 2D hero; no WebGL requirement.
- [ ] Safari: sticky already going away — verify `100dvh` leftovers are gone (`.tl-agent-pin`, `.tl-vim-pin`).
- [ ] iOS: CTA poster, not inline video autoplay quirks.
- [ ] `mix-blend-mode: soft-light` on CTA glow: if Safari looks muddy, fall back to `overlay` then opacity 0.22.

### Product / content

- [ ] No “Twelve Labs”, Marengo, Pegasus, Patriots, kitchen renovation, “GLASSES - 95%”, “patented video processing”, or `campaign_kitchen_v3.mp4` on the homepage.
- [ ] Six specialists listed as in `getStartedTabs`.
- [ ] Paused / approval / own-account story still told in hero, specialists, contrast, workflow, how-it-works, and CTA.
- [ ] Use Cases and footer byte-identical in behaviour.

### Regression around shared code

- [ ] Header mega-menus still open. Light/dark inversion still tracks `data-nav-dark` (hero band) vs light sections.
- [ ] `SiteButton` orbit / primary still render on hero and CTA.
- [ ] Use Cases tablist still clones slides without a jump.

---

## 12. Out of scope

- Building the actual agent runtime, Google Ads write path, or auth.
- New Use Cases photography (flagged only).
- Footer / legal / cookie redesign.
- Renaming the clone directories (`www-twelvelabs-io-a368af44`).
- TasteLabs tree removal (phase 7, separate PR).
- Invented customer logos or ROAS claims.

---

## 13. Source index (quick grep)

```
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
src/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/{HeroSection,HeroMosaic,GetStartedSection,GetStartedBackground,OrchestrationScene,StrategyScene,CreativeScene,ExecutionScene,SearchScene,OptimizationScene,WorkflowsSection,AgentExperienceSection,VideoIntelligenceModels,TrustedBySection,SolutionsSection,SecuritySection,SecurityVideoDeck,CtaSection,SiteHeader,SiteFooter,content}.tsx
src/components/sites/www-twelvelabs-io-a368af44/shared/{SiteButton,icons}.tsx
```

Live: https://kainetnew.vercel.app/
