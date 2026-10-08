# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-08 (workspace lock policy + wave 10 tools). White-hat only. Do not invent rankings or traffic claims.

**Workspace lock policy:** SEO Dashboard modules that are not real user-data / fetch / paste analysis stay `status: 'locked'` in `seoNavConfig` (Coming soon panel). Unlock only when real integration is ready — never ship fake Semrush market graphs.

## Status

| Area | State |
|---|---|
| Tool page SEO | **113 / 113** done (+15 trending tools across 4 high-demand verticals) |
| Category pillars | **13 / 13** — updated |
| Job landings | **5 / 5** thickened + related links |
| Guides | **9 pillars + 106 generated tool how-tos** (113 tools covered; 7 map to pillars) |
| Monetization & Ads | Sticky sidebar ads + in-article ad units inserted across all tools |
| Blog hub | Category filters + pagination (12/page) |
| Internal links | Blog↔tool bidirectional; category auto-guides |
| Prerender / CF middleware | Live (`x-toolverse-shell`) |
| AEO homepage FAQ + entity | Done |
| `llms.txt` / sitemap / robots | Wave 10: 257 URLs in sitemap.xml; llms.txt includes 113+ tools |
| E-E-A-T legal pages | Done |

## Done — wave 10 (15 Trending Creator, Finance, AI & Developer Utilities)

- **15 High-Growth Tools Added**:
  1. `youtube-thumbnail-downloader` (Creator) — 1080p Full HD thumbnail grabber
  2. `paypal-stripe-fee-calculator` (Finance) — Domestic & cross-border merchant fee breakdown
  3. `freelancer-hourly-rate-calculator` (Finance) — Sustainable billable rate & overhead calculator
  4. `crypto-profit-calculator` (Finance) — Crypto ROI, net profit & exchange fee calculator
  5. `loan-payoff-calculator` (Finance) — Amortization extra-payment interest-saving calculator
  6. `chatgpt-prompt-generator` (AI Prompt) — Structured Persona-Task-Format prompt engineer
  7. `ai-sentence-humanizer` (AI Writing) — Passive voice & robotic cliché remover
  8. `midjourney-prompt-builder` (AI Prompt) — Midjourney v6 `--ar`, `--stylize` & lighting builder
  9. `glassmorphism-css-generator` (Developer) — Visual frosted glass backdrop blur & CSS generator
  10. `instagram-hashtag-generator` (Creator) — Niche viral tag generator with clean dot spacing
  11. `twitter-thread-splitter` (Creator) — Thread splitter at sentence boundaries with `1/n`
  12. `srt-subtitle-cleaner` (Creator) — Strip timecodes and markers from SRT to clean text
  13. `markdown-html-converter` (Developer) — Dual-pane live markdown-to-HTML parser
  14. `curl-to-code-converter` (Developer) — Convert cURL into Python (requests), JS (fetch), PHP
  15. `svg-to-png-converter` (Developer) — Client-side HTML5 Canvas vector-to-PNG rasterizer
- **Complete SEO Setup**:
  - Full `TOOL_PAGE_CONTENT` for all 15 tools (answerFirst, deep topical sections, rich FAQs)
  - 15 auto-generated `/blog/how-to-*` guides with bidirectional linking
  - Sitemap regenerated to 257 URLs (113 live tools + 115 blog guides)
- **Monetization**:
  - All tools wrapped in two-column layout with sticky sidebar `AdSlot` + in-article ad placements

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
