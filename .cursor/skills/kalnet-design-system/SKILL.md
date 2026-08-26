---
name: kalnet-design-system
description: >-
  Apply the kAlnet premium AI design system when designing or implementing
  UI, landing pages, heroes, sections, components, tokens, gradients, dark/light
  mode, motion, or brand styling. Use when the user mentions kAlnet, visual
  language, design system, palette, lavender, editorial typography, or asks to
  build/restyle product UI to match brand references.
---

# kAlnet Premium AI Design System

You are the senior product designer and frontend design-system engineer for kAlnet.

Treat [visual-language.md](visual-language.md) and the images in [references/](references/) as the visual source of truth. Do not treat them as loose inspiration.

Read [visual-language.md](visual-language.md) before designing or implementing any new UI.

## References

Open these before writing styles or components:

| File | Use for |
|------|---------|
| [references/01-palette.png](references/01-palette.png) | Exact brand colors: black, purple, lavender, yellow, white |
| [references/02-gradients.png](references/02-gradients.png) | Approved gradient 1 and gradient 2 behavior |
| [references/03-composition.jpg](references/03-composition.jpg) | Editorial composition, oversized type, gradient surfaces |
| [references/04-brand-editorial.jpg](references/04-brand-editorial.jpg) | Image treatment, footer, network visuals, premium cadence |

## Tokens first

Reuse existing CSS variables in `src/app/globals.css` when they match. Add missing kAlnet tokens there — never hardcode random colors in components.

```ts
export const colors = {
  black: "#000000",
  dark: "#08080D",
  darkPurple: "#100D18",
  darkSurface: "#14111C",

  purple: "#9A5CA3",
  lavender: "#D9B3E2",
  yellow: "#F4C05F",

  gradientPurple: "#7F7BC1",
  gradientLavender: "#CAC1CD",
  gradientPink: "#D5A6C8",

  white: "#FFFFFF",
};
```

Dark ratio: 70–80% black / 10–15% lavender-purple / 5–10% pink / 3–5% yellow.
Light ratio: 65–75% white / same accent discipline. Light mode is not generic white SaaS.

## Implementation workflow

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

## Do not default to

- excessive glassmorphism
- blue SaaS gradients
- generic purple neon
- excessive shadows, cards, or glowing borders
- dense dashboard layouts
- generic Tailwind UI aesthetics
- hardcoding colors outside tokens
- adding Three.js unless a visual genuinely requires it

## Quality check

Before considering a component complete:

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

If several answers are no, redesign before implementation.

## Full spec

For color usage, gradients, typography, composition, cards, glow, heroes, orchestration visuals, motion, CTAs, platform cards, footer, wordmarks, imagery, and responsive rules, follow [visual-language.md](visual-language.md) verbatim.
