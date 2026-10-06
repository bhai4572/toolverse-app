# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07 (wave 4). White-hat only. Do not invent rankings or traffic claims.

## Coverage

| Metric | Value |
|---|---|
| Live tools | 88 |
| `TOOL_PAGE_CONTENT` enriched | **88 / 88** (100% of live) |
| Disabled / admin tools | not enriched (out of catalog scope) |
| Category pillars | 13 |
| Job landings | 5 thickened |
| Prerender shells | ~124 routes at build |

## Deploy / prerender status

- **Prod curl (pre-fix):** `/tools/pdf-rotate` still homepage title/canonical — CF Pages production stuck on older deploy.
- **Root cause of stale prod:** Cloudflare Pages deployments for commits `26a0c782` … `fd438c2` show **Failure**. Live site never received prerender/`_redirects` fix.
- Likely misconfig: dashboard still aimed at Next.js output (see old README). Correct: build `npm run build`, output `dist`.
- Middleware is now plain `functions/_middleware.js` (explicit ASSETS fetch for `/path/index.html`).
- Direct publish: `npm run deploy:pages` → project `toolverse-app`.

## Next priorities

1. Confirm CF dashboard build command + output dir = Vite `dist`; re-curl tool URLs for `x-toolverse-shell` / correct title.
2. AEO polish: answer-first on thin leftover surfaces; FAQ only where visible.
3. Internal links: blog ↔ tools spot-checks; orphan scan.
4. Authority outreach offline (`seo/backlink-playbook.md`, `seo/easy-backlinks-guide.md`).
5. Measurement in GSC after successful deploy (no fake ranking claims).

## Do not do

- Fake AggregateRating / doorway pages / PBNs / ranking claims without data
