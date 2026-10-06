# ToolVerse SEO / AEO / GEO Backlog

Last updated: 2026-10-07. White-hat only. Do not invent rankings or traffic claims.

## Primary keyword map (high-intent)

| Primary intent | Canonical URL | Notes |
|---|---|---|
| compress image 50kb / 20kb | `/tools/compress-image-target-size` | Do not target same KW on Image Compressor |
| image compressor (quality) | `/tools/image-compressor` | Quality slider intent |
| merge pdf online | `/tools/pdf-merge` | Blog supports, not cannibalizes |
| split / rotate / reorder pdf | `/tools/pdf-split`, `/tools/pdf-rotate`, `/tools/pdf-reorder-pages` | |
| jpg to pdf / images to pdf | `/tools/jpg-to-pdf`, `/tools/images-to-pdf` | Split: single vs bulk |
| heic to jpg | `/tools/heic-to-jpg` | Blog: convert-heic-to-jpg-windows-iphone |
| resize / social image / crop | `/tools/image-resizer`, `/tools/social-media-image-resizer`, `/tools/image-cropper` | |
| webp convert | `/tools/jpg-to-webp`, `/tools/webp-to-jpg` | |
| qr / barcode | `/tools/qr-code-generator`, `/tools/barcode-generator` | |
| pakistan salary tax | `/tools/pakistan-salary-tax-estimator` | Estimate disclaimer |
| zakat / emi / compound / discount / vat | matching calculators | |
| word vs character counter | `/tools/word-counter` vs `/tools/character-counter` | Split intents |
| utm / meta / url shortener | SEO tool cluster | |
| password / uuid / hash | security cluster | |

Categories own **hub** intents (e.g. “pdf tools online” → `/category/pdf-document-tools`).

## Done — 2026-10-07 wave

### P0 SPA prerender (implemented)
- Build step: `vite build && node scripts/prerender.mjs`
- Writes `dist/<route>/index.html` for all live tools, categories, blog, legal, jobs (+ updates root)
- Injects correct `<title>`, description, canonical, OG/Twitter, JSON-LD, and crawler H1/intro
- Cloudflare Pages: real files win over `/* /index.html 200` SPA fallback (no `!` force)
- **Caveat:** This is meta + static HTML shell prerender (not full React SSR). Tool UIs still hydrate client-side. Unknown paths still fall back to SPA shell.

### P1 tool content
- `TOOL_PAGE_CONTENT` expanded again (~39 tools total) with answer-first, H2, FAQs, seoTitle/Description
- Related links: url-shortener → meta-tag-generator

### P2
- Blog featured images: width/height + decoding; header logo `aria-label`
- No extra blog this wave (HEIC/compress/merge/tax already cover top intents)

## Next actions (priority)

1. **P1 — More `toolPageContent`:** `jpg-to-png`, `png-to-jpg`, `adsense-revenue-calculator`, `youtube-earnings-estimator`, `text-diff-checker`, `readability-score`, writing-tool cluster as needed.
2. **P1 — Verify prod:** After deploy, `curl` a tool URL and confirm title/canonical in raw HTML (not homepage).
3. **P2 — Jobs landing:** Stronger unique copy per `/jobs/*` slug.
4. **P2 — Authority:** Execute backlink playbooks offline — no PBNs.
5. **P2 — Measurement:** GSC impressions/CTR on enriched + prerendered URLs.

## Authority playbooks status

- `seo/backlink-playbook.md` — written; execution is offline/outreach
- `seo/easy-backlinks-guide.md` — written; execution is offline/outreach

## Do not do

- Fake AggregateRating / review schema
- Doorway pages or spun thin tool clones
- Bought links / PBNs
- Claiming #1 rankings without GSC/analytics proof
