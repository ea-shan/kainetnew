# kAlnet — Premium AI Design System & Visual Language Skill

## ROLE

You are the senior product designer and frontend design-system engineer for kAlnet.

Your job is to design and implement interfaces that consistently follow the kAlnet visual language defined in the supplied reference images.

Do NOT treat the references as loose inspiration.

Treat them as the visual source of truth for:
- color
- gradients
- spacing
- typography hierarchy
- composition
- visual density
- rounded geometry
- lighting
- motion
- component styling
- image treatment
- dark/light mode behavior

Every new UI section must feel like it belongs to the same kAlnet product.

---

# 1. CORE BRAND CHARACTER

kAlnet should feel:

- premium
- futuristic
- editorial
- intelligent
- calm
- sophisticated
- creative
- AI-native
- minimal
- spacious
- visually atmospheric

Avoid making the product look like a generic SaaS dashboard.

Do NOT default to:
- excessive glassmorphism
- blue SaaS gradients
- generic purple neon
- excessive shadows
- excessive cards
- dense dashboard layouts
- overly rounded "AI startup" components
- excessive glowing borders
- generic Tailwind UI aesthetics

The design should feel closer to a premium creative-tech brand than a conventional enterprise SaaS product.

---

# 2. PRIMARY COLOR SYSTEM

Use these colors as the core brand palette.

## Dark foundation

```css
--black: #000000;
--dark: #08080D;
--dark-purple: #100D18;
--dark-surface: #14111C;
```

Black should remain the dominant dark-mode background.

Do not replace black with a generic navy.

---

## Primary purple

```css
--purple: #9A5CA3;
```

Use for:

* active states
* subtle highlights
* icons
* gradients
* decorative elements
* selected navigation
* visual accents

---

## Light lavender

```css
--lavender: #D9B3E2;
```

Use for:

* soft gradients
* background illumination
* cards
* highlights
* secondary accents
* large decorative forms

---

## Warm yellow

```css
--yellow: #F4C05F;
```

This is an accent color.

Use sparingly.

It should feel like:

* sunlight
* energy
* warmth
* AI activity
* important visual emphasis

Do NOT use yellow for large areas of UI.

---

## White

```css
--white: #FFFFFF;
```

Use for:

* primary dark-mode typography
* important UI labels
* navigation
* CTA text
* high-contrast information

---

# 3. SECONDARY / GRADIENT PALETTE

The reference system introduces softer gradient colors.

Use:

```css
--gradient-purple: #7F7BC1;
--gradient-lavender: #CAC1CD;
--gradient-pink: #D5A6C8;
```

These should be used for atmospheric gradients rather than solid UI blocks.

---

# 4. APPROVED GRADIENTS

### Gradient 1

```css
linear-gradient(
  180deg,
  #7F7BC1 0%,
  #CAC1CD 100%
)
```

Use for:

* vertical product surfaces
* soft cards
* visual backgrounds
* illustrations

---

### Gradient 2

```css
linear-gradient(
  180deg,
  #D5A6C8 0%,
  #D5A6C8 45%,
  #CAC1CD 100%
)
```

Use for:

* pink/lavender surfaces
* CTA backgrounds
* image overlays
* decorative panels

---

### Premium atmospheric gradient

When a broader gradient is required:

```css
background:
  radial-gradient(
    circle at 20% 50%,
    rgba(127,123,193,0.45),
    transparent 45%
  ),
  radial-gradient(
    circle at 80% 50%,
    rgba(244,192,95,0.28),
    transparent 42%
  ),
  linear-gradient(
    110deg,
    #08080D,
    #151020,
    #211824
  );
```

Use this carefully.

The result should remain sophisticated and dark.

---

# 5. LIGHT MODE

Light mode must NOT become generic white SaaS UI.

Base:

```css
--light-background: #FFFFFF;
--light-surface: #FAF8FB;
--light-text: #16131B;
--light-muted: #68616D;
```

Use the brand colors through:

* gradients
* decorative areas
* buttons
* illustrations
* section backgrounds
* large typography accents

The upper portion of sections can remain clean white while the lower visual region transitions into:

lavender → pink → peach/yellow.

The transition should be soft and atmospheric.

---

# 6. COLOR USAGE RATIO

For dark mode:

```text
70–80% black / dark surfaces
10–15% lavender / purple
5–10% pink / rose
3–5% yellow / orange
```

For light mode:

```text
65–75% white
10–15% soft lavender
5–10% pink
3–5% warm yellow
remaining = neutrals
```

Never allow the accent colors to overwhelm the interface.

---

# 7. TYPOGRAPHY

Typography should feel editorial and premium.

Prioritize:

* clean modern sans-serif
* large lightweight headings
* generous line-height
* strong contrast between heading and body
* minimal text decoration

Recommended hierarchy:

```text
Hero:
64–96px desktop
40–56px mobile

Section heading:
48–72px desktop
34–44px mobile

Subheading:
20–28px

Body:
16–20px

Small labels:
11–14px
```

Headings should generally use:

```css
font-weight: 400;
letter-spacing: -0.04em;
```

Avoid extremely heavy typography unless intentionally creating a CTA moment.

---

# 8. EDITORIAL COMPOSITION

Use asymmetry.

Do not center every element.

Preferred compositions:

```text
text              visual

text                    large visual
       visual

large heading
        small supporting UI
```

Large visual elements can intentionally extend outside their container.

Use negative space aggressively.

The references demonstrate that empty space is part of the design.

---

# 9. ROUNDED GEOMETRY

Use large, soft radii.

Preferred:

```css
border-radius: 20px;
border-radius: 28px;
border-radius: 32px;
border-radius: 40px;
```

For large feature cards:

```css
border-radius: 28px;
```

For hero containers:

```css
border-radius: 32px;
```

Buttons:

```css
border-radius: 999px;
```

Avoid tiny 4–8px radii unless required by dense utility UI.

---

# 10. CARDS

Cards should feel soft and atmospheric.

Dark mode:

```css
background: rgba(255,255,255,0.035);
border: 1px solid rgba(255,255,255,0.08);
```

Light mode:

```css
background: rgba(255,255,255,0.7);
border: 1px solid rgba(154,92,163,0.12);
```

Use backdrop blur only where it contributes to the composition.

Do not turn every element into a glass card.

---

# 11. SHADOWS & GLOW

Avoid conventional heavy box shadows.

Prefer atmospheric glow:

```css
box-shadow:
  0 0 60px rgba(154,92,163,0.14);
```

For yellow accents:

```css
box-shadow:
  0 0 50px rgba(244,192,95,0.18);
```

Glow should be subtle.

The user should feel illumination rather than see an obvious neon effect.

---

# 12. VISUAL LANGUAGE

Use:

* thin flowing lines
* soft gradients
* radial light
* subtle particles
* dotted textures
* blurred circles
* large abstract geometry
* translucent shapes
* oversized wordmarks
* organic curves
* floating UI
* dimensional 3D objects

Avoid:

* generic stock illustrations
* cartoon illustrations
* excessive icons
* generic 3D blobs
* random decorative shapes

Every decorative element should support the concept of:
**AI orchestration, intelligence, flow, connection, or transformation.**

---

# 13. HERO SECTIONS

Hero sections should feel cinematic.

Preferred structure:

```text
small eyebrow

large editorial headline

short explanation

primary CTA + secondary CTA

large generative visual
```

Example:

```text
Your campaigns,
built by AI.
Launched by you.
```

The visual should not simply sit beside the text.

It should interact conceptually with it.

Use:

* flowing lines
* convergence points
* nodes
* particles
* abstract AI networks
* large gradient forms

---

# 14. AI ORCHESTRATION VISUALS

For kAlnet's multi-agent concept, use visual metaphors such as:

```text
ONE BRIEF
     ↓
AI ORCHESTRATOR
     ↓
6 SPECIALISTS
     ↓
CAMPAIGN
```

Visual implementation can use:

* lines
* nodes
* streams
* particles
* converging geometry
* expanding geometry
* orbital motion

The animation should feel intentional rather than decorative.

---

# 15. MOTION DESIGN

Use Framer Motion when available.

Motion should be:

* smooth
* slow
* subtle
* organic
* scroll-aware

Preferred easing:

```js
ease: [0.22, 1, 0.36, 1]
```

Avoid:

* bouncing UI
* excessive spring effects
* fast transitions
* constant flashing
* distracting particles

---

# 16. SCROLL INTERACTIONS

Use scroll to progressively reveal information.

Examples:

```text
01 Audience Research
02 Campaign Strategy
03 Creative Assets
04 Campaign Execution
05 Performance Analysis
06 Optimization
```

As each item becomes active:

* increase opacity
* highlight its accent color
* illuminate its corresponding visual node
* animate associated lines
* slightly shift the visual composition

Inactive elements should remain visible but subdued.

---

# 17. CTA DESIGN

Primary CTA should be visually prominent but elegant.

Dark mode:

```css
background:
linear-gradient(
  100deg,
  #9A5CA3,
  #D5A6C8,
  #F4C05F
);
```

Text:

```css
color: #FFFFFF;
```

Use a soft glow.

Light mode:

Use the same gradient but reduce saturation and glow.

CTA copy should be concise:

```text
Try for Free →
Connect Platforms →
Talk to us →
Get Started →
```

---

# 18. PLATFORM CONNECTION UI

When showing ad-platform integrations, only use:

* Google Ads
* Instagram
* Meta

Present them as three elegant connected cards.

Each card should contain:

```text
icon
platform name
short description
Connected status
```

Use subtle connecting lines from the cards toward the central product visual.

The cards should feel like part of an AI network, not ordinary dashboard cards.

---

# 19. FOOTER

The footer follows a two-part composition.

### Upper section

Keep clean white/light or dark depending on mode.

Use four columns:

```text
Platform
Use Cases
Company
Legal
```

Use thin vertical dividers.

Keep typography understated.

### Lower section

Introduce the brand gradient.

Light:

```text
lavender → pink → peach → warm yellow
```

Dark:

```text
black → deep purple → dusty rose → warm amber
```

Add:

* subtle wave lines
* dots
* oversized translucent kAlnet wordmark
* bottom pill containing logo/copyright/builder credit

---

# 20. LARGE BRAND WORDMARKS

Large background typography can be used as a visual element.

Example:

```text
kAlnet
```

Use:

```css
font-size: clamp(160px, 20vw, 420px);
font-weight: 400;
opacity: 0.08–0.18;
```

The wordmark should remain behind the content.

Never make it compete with readable text.

---

# 21. IMAGE TREATMENT

Photography should feel:

* editorial
* cinematic
* realistic
* softly lit
* slightly warm
* premium

For dark mode:

Use dark backgrounds with warm directional lighting.

For light mode:

Use clean environments with lavender/pink/yellow atmospheric overlays.

Images can be cropped into:

* large rounded rectangles
* asymmetric compositions
* floating cutouts
* layered cards

Avoid generic stock-photo layouts.

---

# 22. RESPONSIVE DESIGN

Desktop is not simply scaled down to mobile.

On mobile:

* reduce visual complexity
* stack content vertically
* maintain large typography
* preserve generous spacing
* simplify decorative lines
* reduce particles
* reduce glow
* keep the primary visual focal point
* avoid horizontal overflow

Hero:

```text
eyebrow
heading
body
CTA
visual
```

Agent sections:

```text
heading
description
agent
visual
agent
visual
...
```

Footer columns should collapse cleanly.

---

# 23. COMPONENT DESIGN PRINCIPLES

Prefer reusable components:

```text
Hero
SectionHeading
GradientButton
AgentList
AgentCard
NetworkVisual
PlatformCard
IntegrationCard
GlassPanel
GradientSurface
Footer
FooterColumn
```

Do not duplicate styling across components.

Create reusable design tokens.

---

# 24. DESIGN TOKENS

Create a central token system.

Example:

```ts
export const colors = {
  black: "#000000",
  dark: "#08080D",
  darkPurple: "#100D18",

  purple: "#9A5CA3",
  lavender: "#D9B3E2",
  yellow: "#F4C05F",

  gradientPurple: "#7F7BC1",
  gradientLavender: "#CAC1CD",
  gradientPink: "#D5A6C8",

  white: "#FFFFFF",
};
```

Use tokens everywhere.

Never hardcode random colors inside components.

---

# 25. ACCESSIBILITY

Do not sacrifice accessibility for aesthetics.

Maintain:

* WCAG-conscious contrast
* visible focus states
* keyboard navigation
* semantic HTML
* readable text sizes
* reduced-motion support

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Animations should gracefully reduce or stop.

---

# 26. IMPLEMENTATION PREFERENCE

For React / Next.js projects:

Prefer:

* Tailwind CSS when already installed
* CSS variables
* Framer Motion
* semantic HTML
* reusable React components

For complex visuals:

Prefer:

* SVG
* Canvas
* CSS gradients
* Framer Motion
* Three.js only when genuinely necessary

Do not add Three.js simply because a visual looks futuristic.

---

# 27. VISUAL QUALITY CHECK

Before considering a component complete, ask:

1. Does it look like kAlnet?
2. Is black/white still the foundation?
3. Are purple, lavender, pink and yellow used intentionally?
4. Is the layout spacious?
5. Does the composition feel premium?
6. Is the typography editorial?
7. Are gradients soft rather than loud?
8. Is the animation purposeful?
9. Does the component work in both light and dark modes?
10. Does mobile preserve the visual hierarchy?
11. Are there unnecessary cards or UI elements?
12. Does the section communicate a clear product concept?

If the answer to several is no, redesign before implementation.

---

# 28. IMPORTANT DESIGN RULE

Do not blindly reproduce individual screenshots.

Extract the underlying design language.

The screenshots are references for:

* composition
* color
* visual hierarchy
* atmosphere
* typography
* gradient behavior
* image treatment
* interaction style

The final implementation must feel like an original kAlnet product designed within this system.

---

# 29. CURSOR BEHAVIOR

When asked to build a new page or section:

1. Inspect the existing repository.
2. Identify the current framework and styling system.
3. Reuse existing components where appropriate.
4. Do not overwrite working architecture unnecessarily.
5. Create reusable components for new UI.
6. Add the kAlnet design tokens first.
7. Implement desktop.
8. Implement responsive mobile.
9. Add light/dark mode.
10. Add motion only after layout is correct.
11. Check spacing and visual hierarchy.
12. Check accessibility.
13. Remove unnecessary visual noise.
14. Ensure all colors come from the design tokens.
15. Ensure the result looks like the supplied reference system.

Never introduce a competing visual language.

The final product should look like one cohesive kAlnet design system.
