# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07 (wave 7 — **on-site SEO complete for now**). White-hat only. Do not invent rankings or traffic claims.

## Status

| Area | State |
|---|---|
| Tool page SEO | **88 / 88** done |
| Category pillars | **13 / 13** — sections + featured tools + related blogs |
| Job landings | **5 / 5** thickened + related links |
| Guides | **9** (UTM guide added wave 7) |
| Prerender / CF middleware | Live (`x-toolverse-shell`) |
| AEO homepage FAQ + entity | Done |
| Internal links / breadcrumbs | Done |
| `llms.txt` / sitemap / robots | Fresh (wave 7 AEO crawler allow) |
| E-E-A-T legal pages | Done |

**Verdict:** All high-impact **on-site** SEO/AEO/GEO items that can be shipped in code/content are complete. Remaining work is **user offline** (deploy secrets, outreach) or **monitoring**.

## Done — wave 7 (completion pass)

- Thickened every previously thin category (sections + related guides)
- New guide: `/blog/how-to-build-utm-campaign-urls` + SEO/creator/social pillar links
- Job landings: USA + data-entry related blog links
- Organization schema: `contactPoint` + contact URL
- `robots.txt`: keep training scrapers blocked; **allow** ChatGPT-User / OAI-SearchBot / PerplexityBot / Claude-Web for citations (AEO)
- `llms.txt`: all 13 hubs + job landings + 9 guides
- Sitemap regenerated on build

## Prior waves (summary)

- Prerender + CF Pages middleware; 88 tool SEO; category/job AEO; privacy guides; CWV font/ads; E-E-A-T; deploy harden (`wrangler` / GH Action template)

## Remaining — USER ONLY (not code)

1. **Cloudflare:** add `CLOUDFLARE_API_TOKEN` (+ optional account id) to GitHub Actions so `main` auto-deploys.
2. **CF dashboard:** Build = `npm run build`, Output = `dist`, Node **20** (Git builds fail if wrong).
3. **Digital PR / backlinks:** follow `seo/easy-backlinks-guide.md` + `seo/backlink-playbook.md` (AlternativeTo, directories, guest posts — offline).
4. **GSC / Bing / Yandex:** weekly check impressions, queries, CWV field data, coverage — no ranking claims without data.
5. **Optional product later:** real ZIP tools under `file-archive-utilities`; self-host Inter if Lighthouse still flags fonts.

## Weekly loop (user)

1. GSC: top queries + pages with impressions but low CTR → tweak titles only if data-backed.
2. 1–3 quality backlink actions from easy-backlinks guide (not spam).
3. Confirm latest `main` is live (Action or `npm run deploy:pages`).
4. Note any 404s / soft-404 tools in coverage.

## Do not do

- Fake AggregateRating / doorway pages / PBNs / buy links / unverifiable traffic claims
- Spammy competitor bash posts
- Re-enriching all 88 tools without evidence of gaps
