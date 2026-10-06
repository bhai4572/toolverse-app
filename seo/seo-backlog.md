# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-06. White-hat only. Do not invent rankings or traffic claims.

## Primary keyword map (high-intent)

| Primary intent | Canonical URL | Notes |
|---|---|---|
| compress image 50kb / 20kb | `/tools/compress-image-target-size` | Do not target same KW on Image Compressor |
| image compressor (quality) | `/tools/image-compressor` | Quality slider intent |
| merge pdf online | `/tools/pdf-merge` | Blog supports, not cannibalizes |
| split pdf | `/tools/pdf-split` | |
| jpg to pdf / images to pdf | `/tools/jpg-to-pdf`, `/tools/images-to-pdf` | Split: single vs bulk |
| heic to jpg | `/tools/heic-to-jpg` | Blog: convert-heic-to-jpg-windows-iphone |
| qr code generator | `/tools/qr-code-generator` | |
| barcode generator / ean / code 128 | `/tools/barcode-generator` | |
| pakistan salary tax / fbr calculator | `/tools/pakistan-salary-tax-estimator` | Estimate disclaimer |
| zakat calculator | `/tools/zakat-calculator` | |
| emi calculator | `/tools/emi-calculator` | |
| word counter | `/tools/word-counter` | Character limits → character-counter |
| meta tag generator | `/tools/meta-tag-generator` | |
| utm builder | `/tools/utm-builder` | |
| password generator | `/tools/password-generator` | |
| passport photo maker | `/tools/passport-photo-maker` | Size then KB-compress |
| invoice generator | `/tools/invoice-generator` | |

Categories own **hub** intents (e.g. “pdf tools online” → `/category/pdf-document-tools`).

## Done this batch

- Wired `TOOL_PAGE_CONTENT` into live tool UI (was schema-only)
- Expanded unique H2/FAQ/answer-first for 20 tools
- Category pillar intros + blog links
- Unique title/description overrides for enriched tools
- FAQ schema aligned with visible FAQs
- Fixed 7 broken related-tool IDs
- Reduced word-counter vs character-counter keyword overlap
- About page entity clarity; Organization schema email/description
- New HEIC→JPG guide linking tools
- robots.txt Host + sitemap; sitemap regen via prebuild

## Next actions (priority)

1. **P0 — SPA HTML shell:** Deep links still ship homepage `<title>`/`canonical` in raw HTML until JS runs. Evaluate lightweight prerender for top 20 URLs (or Cloudflare Workers HTML rewriter) for Bing/non-JS fetches.
2. **P1 — More `toolPageContent`:** Next wave: `pdf-rotate`, `image-resizer`, `social-media-image-resizer`, `discount-calculator`, `compound-interest-calculator`, `url-shortener`, `hash-generator`, `gpa-calculator`.
3. **P1 — Image alts:** Audit key template icons/hero images for missing alts.
4. **P2 — Jobs landing:** Stronger unique copy per `/jobs/*` slug (thin risk).
5. **P2 — Authority:** Execute `seo/easy-backlinks-guide.md` + `seo/backlink-playbook.md` (directories, niche edits, partner pages) — no PBNs.
6. **P2 — Measurement:** In GSC, monitor enriched URLs for impressions/CTR after crawl; fix queries that cannibalize across tool pairs.

## Authority playbooks status

- `seo/backlink-playbook.md` — written; execution is offline/outreach
- `seo/easy-backlinks-guide.md` — written; execution is offline/outreach

## Do not do

- Fake AggregateRating / review schema
- Doorway pages or spun thin tool clones
- Bought links / PBNs
- Claiming #1 rankings without GSC/analytics proof
