# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07 (wave 3). White-hat only. Do not invent rankings or traffic claims.

## Primary keyword map (high-intent)

| Primary intent | Canonical URL | Notes |
|---|---|---|
| compress image 50kb / 20kb | `/tools/compress-image-target-size` | ≠ Image Compressor |
| jpg/png/webp convert | format converter tools | one primary KW each |
| adsense / youtube earnings | estimator tools | educational estimates only |
| readability / passive / citations | writing cluster | no plagiarism claims |
| remote / USA / PK govt jobs | `/jobs/*` | discovery only; apply on source |
| merge/split/rotate pdf | PDF tools | |

## Done — wave 3 (this commit)

### P0 prod prerender fix
- **Root cause:** Cloudflare Pages applies `_redirects` **before** static files. `/* → /index.html 200` overwrote all prerendered `dist/tools/*/index.html` (prod curl still showed homepage title/canonical).
- **Fix:** Removed SPA catch-all from `public/_redirects`. Added `functions/_middleware.ts` to serve `index.html` only on **404** (non-asset paths). Added `public/_routes.json` to skip the worker for `/assets/*` and static SEO files.
- Build-time prerender (`scripts/prerender.mjs`) unchanged — still required.

### P1 content
- `TOOL_PAGE_CONTENT` expanded again (format converters, AdSense/YT, writing cluster, base64, lorem, unit converter, json-to-csv, etc.).
- Jobs landings: richer intro/FAQ/sections + internal links via `lib/seo/jobPageContent.ts`.

## Next actions

1. **Verify prod after deploy:** curl `/tools/pdf-rotate` — expect tool title + canonical (not homepage). If still wrong, check CF Pages Functions enabled for the project.
2. **More enrichments:** remaining writing checklists, `global-job-finder`, `thesis-statement-checker`, equation/matrix tools as useful.
3. **Authority:** execute backlink playbooks offline.
4. **Measurement:** GSC CTR on prerendered URLs after indexing.

## Authority playbooks

- `seo/backlink-playbook.md` / `seo/easy-backlinks-guide.md` — outreach pending

## Do not do

- Fake AggregateRating / doorway pages / PBNs / ranking claims without data
