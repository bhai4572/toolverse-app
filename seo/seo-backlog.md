# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07 (wave 5). White-hat only. Do not invent rankings or traffic claims.

## Coverage

| Metric | Value |
|---|---|
| Live tools enriched | **88 / 88** |
| Category pillars + cross-links | 13 |
| Job landings | 5 |
| Prerender | Live OK (`x-toolverse-shell`) |

## Done — wave 5

- Deploy harden: `wrangler.toml` → project `toolverse-app`, `engines` node 20, `deploy:pages`, GitHub Action `.github/workflows/deploy-pages.yml` (needs `CLOUDFLARE_API_TOKEN`)
- Docs: README + DEPLOYMENT already point to Vite `dist`
- AEO: homepage entity definition, workflow links, visible FAQ matching FAQ schema
- Internal links: category featured tools + related categories; tool page fills related to 3 via category siblings
- Breadcrumbs: semantic `<ol>` + aria; blog/jobs use shared Breadcrumb
- `llms.txt` refreshed for entity + hubs
- Skipped TinyWow-style comparison blog (spam risk) — optional careful draft later

## Deploy note

- Cloudflare **Git** builds for recent commits still show **Failure** in dashboard if Build/Output are wrong.
- Production was fixed via `wrangler pages deploy` / keep using Action or `npm run deploy:pages`.
- Dashboard must be: Build = `npm run build`, Output = `dist`, Node 20.

## Next priorities

1. Add `CLOUDFLARE_API_TOKEN` (+ optional account id) so GitHub Action auto-deploys on main.
2. Confirm CF dashboard build settings once; then Git deploys should stop failing.
3. Soft AEO: expand thin category sections still short (file-archive, creator) if traffic warrants.
4. Authority outreach offline (backlink playbooks).
5. Optional careful “privacy-first converters vs upload sites” guide (not brand-bashing spam).

## Do not do

- Fake AggregateRating / doorway pages / PBNs / unverifiable traffic claims
