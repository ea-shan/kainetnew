# Output Plan — TwelveLabs homepage clone

## Target
- **Source URL:** https://www.twelvelabs.io/?ref=land-book.com
- **Normalized origin:** `https://www.twelvelabs.io`
- **Normalized pathname:** `/`
- **Query/fragment:** `?ref=land-book.com` is a tracking referrer only (not stateful). Clone the homepage at `/`. No query-driven UI.

## Keys
- **app-root:** `/Users/apple/Desktop/kainet_new` (`.`)
- **site-key:** `www-twelvelabs-io-a368af44` (SHA-256 of origin, first 8 hex)
- **page-key:** `root-8a5edab2` (SHA-256 of `/`, first 8 hex)

## Destinations
| Kind | Path |
| --- | --- |
| Route | `src/app/page.tsx` → `/` (first clone in empty folder) |
| Artifacts | `docs/research/www-twelvelabs-io-a368af44/root-8a5edab2/` |
| Screenshots | `docs/design-references/www-twelvelabs-io-a368af44/root-8a5edab2/` |
| Components | `src/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/` |
| Shared components | `src/components/sites/www-twelvelabs-io-a368af44/shared/` |
| Assets | `public/sites/www-twelvelabs-io-a368af44/root-8a5edab2/` |
| Shared assets | `public/sites/www-twelvelabs-io-a368af44/shared/` |
| Downloader | `scripts/download-assets-www-twelvelabs-io-a368af44-root-8a5edab2.mjs` |

## Existing work
- Folder was empty. Scaffolding Next.js + shadcn/ui + Tailwind v4 here.
- No prior routes, research folders, or asset namespaces to preserve.

## Shared foundation files that will change
- `src/app/layout.tsx` — fonts, metadata
- `src/app/globals.css` — design tokens
- `src/app/page.tsx` — homepage assembly
- `package.json` — created by scaffold

## Collision check
All planned paths are unique. No existing routes.
