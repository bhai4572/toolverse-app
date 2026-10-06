# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07 (wave 6). White-hat only. Do not invent rankings or traffic claims.

## Coverage

| Metric | Value |
|---|---|
| Live tools enriched | **88 / 88** |
| Category pillars + cross-links | 13 (creator + file-archive sections expanded) |
| Job landings | 5 |
| Guides | 8 (added privacy-first vs upload decision guide) |
| Prerender | Live OK (`x-toolverse-shell`) |

## Done — wave 6 (on-site)

- New guide: `/blog/privacy-first-converters-vs-upload-sites` — decision framework (not brand-bash); FAQ + tool links; linked from PDF/image pillars + privacy shortlist
- CWV: non-blocking Inter load (fewer weights 400/600/700); Monetag tags `async`
- Image alts tightened on compressor / passport / QR / URL-shortener previews
- E-E-A-T: About/Contact cross-links + editorial/security; footer Editorial Policy; About tool count aligned to 88+
- `llms.txt` + sitemap refreshed via build for new guide + hubs
- Thin categories: creator-social + file-archive sections expanded (file-archive still has 0 dedicated registry tools — surfaces adjacent hash/CSV/Base64)

## Done — wave 5 (prior)

- Deploy harden, AEO homepage, internal links, breadcrumbs, 88/88 tool SEO, prerender live

## Deploy note

- Cloudflare **Git** builds may still **Fail** if dashboard Build/Output wrong.
- Prefer `npm run deploy:pages` / GitHub Action with `CLOUDFLARE_API_TOKEN`.
- Dashboard must be: Build = `npm run build`, Output = `dist`, Node 20.

## Next priorities (mostly user / offline)

1. Add `CLOUDFLARE_API_TOKEN` (+ optional account id) so GitHub Action auto-deploys on main.
2. Confirm CF dashboard build settings once; then Git deploys should stop failing.
3. Digital PR / outreach offline (backlink playbooks) — user-owned.
4. GSC/Bing monitoring: impressions, CWV field data, query coverage — user dashboards.
5. Optional later: populate real ZIP/archive tools under `file-archive-utilities` if product wants that hub filled.
6. Optional later: self-host Inter / subset fonts if Lighthouse still flags third-party font CSS.

## Do not do

- Fake AggregateRating / doorway pages / PBNs / unverifiable traffic claims
- Spammy competitor comparison posts / buying links
