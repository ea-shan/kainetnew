# WorkflowsSection Specification

## Overview
- Interaction model: click-driven. Inactive titles `rgba(29,28,27,0.5)`, active ink.

## Computed
- Section background: linear-gradient 90deg mint `#DCF0D7` → yellow `#FAF5D2` → peach → pink `#FFE6F0`
- White card: rounded-t 80px
- H2 48px ink, subtitle 16px
- Search chip (Search & Discover): “Find all highlights within the Patriots game where player 87”
- Right column: `WorkflowVisual` — lazy video + sequential overlay animation per tab
- Interaction: click-driven tabs; overlays stagger 380ms after IntersectionObserver 0.2

## Per-state content
See `content.ts` workflowTabs (5 items, verbatim from live page).
