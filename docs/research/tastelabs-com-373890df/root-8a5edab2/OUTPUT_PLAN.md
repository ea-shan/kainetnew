# Output Plan — Taste Labs clone

## Target

| Field | Value |
| --- | --- |
| Source URL | https://tastelabs.com/ |
| Normalized origin | `https://tastelabs.com` |
| Normalized pathname | `/` |
| App root | `/Users/apple/Desktop/kainet_new` (existing combined multi-site app) |
| Site key | `tastelabs-com-373890df` |
| Page key | `root-8a5edab2` |
| Destination route | `/clone-website` → `src/app/clone-website/page.tsx` |

User instruction: keep this clone at `/clone-website` in the current project. Do not replace `/`.

## Isolation

| Kind | Path |
| --- | --- |
| Artifact root | `docs/research/tastelabs-com-373890df/root-8a5edab2/` |
| Screenshot root | `docs/design-references/tastelabs-com-373890df/root-8a5edab2/` |
| Component root | `src/components/sites/tastelabs-com-373890df/root-8a5edab2/` |
| Shared components | `src/components/sites/tastelabs-com-373890df/shared/` |
| Asset root | `public/sites/tastelabs-com-373890df/root-8a5edab2/` |
| Shared assets | `public/sites/tastelabs-com-373890df/shared/` |
| Downloader | `scripts/download-assets-tastelabs-com-373890df-root-8a5edab2.mjs` |

## Existing routes preserved

- `/` — Twelve Labs clone (`src/app/page.tsx`, `www-twelvelabs-io-a368af44`)
- No existing `/clone-website` route

## Shared foundation changes

- `src/app/layout.tsx` — add Taste Labs fonts as CSS variables only; do not change global metadata/icons
- `src/app/globals.css` — add `.taste-site` scoped tokens/keyframes; do not replace Twelve Labs tokens
- Route-specific metadata from `src/app/clone-website/page.tsx` or `src/app/clone-website/layout.tsx`

## Collision check

- Site key differs from `www-twelvelabs-io-a368af44`
- Page key `root-8a5edab2` is reused only under a different site key (pathname `/` hashes the same)
- All planned paths are unique
