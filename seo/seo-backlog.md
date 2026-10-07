# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07 (wave 9 — **Semrush & Ahrefs Free Alternative Suite + Monetization Sidebar**). White-hat only. Do not invent rankings or traffic claims.

## Status

| Area | State |
|---|---|
| Tool page SEO | **98 / 98** done (+10 professional SEO tools) |
| Category pillars | **13 / 13** — updated SEO suite pillar |
| Job landings | **5 / 5** thickened + related links |
| Guides | **9 pillars + 91 generated tool how-tos** (98 tools covered; 7 map to pillars) |
| Monetization & Ads | Sticky sidebar ads + in-article ad units inserted after primary sections |
| Blog hub | Category filters + pagination (12/page) |
| Internal links | Blog↔tool bidirectional; category auto-guides |
| Prerender / CF middleware | Live (`x-toolverse-shell`) |
| AEO homepage FAQ + entity | Done |
| `llms.txt` / sitemap / robots | Wave 9: 227 URLs in sitemap.xml; llms.txt includes full SEO suite |
| E-E-A-T legal pages | Done |

## Done — wave 9 (Semrush & Ahrefs Alternative SEO Suite + Monetization Layout)

- **10 New Professional SEO Tools**:
  1. `seo-audit-analyzer` — On-Page Site Audit & Health Checker (0-100 score + 1-click fixes)
  2. `keyword-research-tool` — Keyword Magic & Search Intent Explorer (KD%, volume, CPC, CSV export)
  3. `backlink-checker-analyzer` — Domain Rating (DR/DA), Anchor Text & Toxic Link Analyzer
  4. `serp-simulator` — Live Google Desktop & Mobile SERP Preview (580px title & 960px snippet meter)
  5. `keyword-density-checker` — Keyword Density & TF-IDF Content Analyzer with stuffing warnings
  6. `robots-txt-generator` — Robots.txt Builder with AI crawler toggles & 1-click download
  7. `xml-sitemap-validator` — Standards-compliant XML Sitemap Generator & Validator
  8. `schema-markup-generator` — Google Rich Snippets Schema JSON-LD Generator
  9. `redirect-chain-checker` — HTTP Status & Redirect Chain Visualizer (301/302 hops)
  10. `canonical-hreflang-generator` — International SEO & Canonical Tag Builder
- **Monetization & Ad Architecture**:
  - Two-column responsive desktop layout (`lg:grid-cols-12`)
  - Sticky right sidebar featuring `AdSlot format="sidebar"` with Monetag direct offers & AdSense
  - Quick-navigation widget for "Free SEO & Growth Suite"
  - In-content `AdSlot format="in-article"` inserted after initial tool action and content breaks
- **Automated Guides & Sitemap**:
  - All 10 tools auto-generate unique how-to guides (`/blog/how-to-*`)
  - Sitemap regenerated with 227 total verified URLs (98 live tools + 100 blog guides + categories + hubs)

- Generator: `lib/blog/toolGuides.ts` builds unique how-to posts from registry + `TOOL_PAGE_CONTENT`
- Pillar overrides for 7 tools already covered by deep guides (no duplicate cannibalization)
- Tool pages: “Read the full guide” CTA → matching blog
- Blog posts: primary CTA → `/tools/{id}` + related tools/category
- Category pages: curated pillars + auto tool guides
- Blog listing: pagination + expanded categories
- Sitemap + prerender pick up all guide routes; `llms.txt` summarizes (no URL dump)

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
3. **CF AI Crawl Control / managed robots:** Cloudflare currently **prepends** managed rules that `Disallow` ChatGPT-User, Claude-User, Perplexity-User, etc. Our `public/robots.txt` allows answer fetchers, but CF managed block wins for many bots — turn off or relax those agent blocks in the CF dashboard if you want AEO citations.
4. **Digital PR / backlinks:** follow `seo/easy-backlinks-guide.md` + `seo/backlink-playbook.md` (AlternativeTo, directories, guest posts — offline).
5. **GSC / Bing / Yandex:** weekly check impressions, queries, CWV field data, coverage — no ranking claims without data.
6. **Optional product later:** real ZIP tools under `file-archive-utilities`; self-host Inter if Lighthouse still flags fonts.
7. **Optional editorial later:** deepen highest-traffic tool guides into hand-written pillars when GSC shows demand (keep generator for the long tail).

## Weekly loop (user)

1. GSC: top queries + pages with impressions but low CTR → tweak titles only if data-backed.
2. 1–3 quality backlink actions from easy-backlinks guide (not spam).
3. Confirm latest `main` is live (Action or `npm run deploy:pages`).
4. Note any 404s / soft-404 tools in coverage.

## Do not do

- Fake AggregateRating / doorway pages / PBNs / buy links / unverifiable traffic claims
- Spammy competitor bash posts
- Near-duplicate AI fluff or keyword stuffing across tool guides
- Re-enriching all 88 tools without evidence of gaps
