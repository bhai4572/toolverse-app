# ToolVerse Product Blueprint

**Site:** https://toolverse.baby  
**Stack (live):** Vite + React SPA on Cloudflare Pages (`src/App.tsx` routes; `app/` pages are components)  
**Updated:** 2026-10-08  
**Honesty rule:** Full Semrush/Ahrefs parity = many months of real crawl/index data. No fake global traffic or competitor market share.  
**Current product:** Free-only Semrush-style SEO Workspace at `/workspace` (alias `/seo-dashboard`) — nested left nav, real URL audits, local rank tracking, GA4/GSC paste imports, HTML/PDF reports.

---

## 0. Audit snapshot (what exists today)

| Area | Reality |
|------|---------|
| **Tools registry** | `lib/tools/registry.ts` — 12+ categories, 100+ tools (PDF, image, text, calc, SEO, jobs, regional, writing…) |
| **SEO tools (live)** | Registry: meta tags, UTM, URL shortener, on-page audit, keyword research (modeled), backlink analyzer (modeled), SERP preview, density, robots.txt, sitemap validator, schema, canonical/hreflang. Plus `/seo-tools` generator page. Offline SEO scripts under `seo/` (crawl/audit/keywords — ops, not user product). |
| **Travel / countries** | `/travel` hub: visa engine (`STUDY`/`WORK` purposes), country seed (~30 real + padded UN list), embassies, destinations, jobs travel, planner. **Not** yet productized as Study Abroad / Immigration. |
| **Study / uni data** | No dedicated university/college dataset. Visa STUDY purpose + education calculators only. |
| **Jobs** | Job engine + `/jobs/*` + `global-job-finder` tool. |
| **Blog / how-to** | Blog posts + how-to knowledge base. |
| **Business / startups / guest posts** | Large secondary products (directory, QR, bidding, marketplace). |
| **Admin** | LocalStorage RBAC (`lib/admin/authEngine.ts`) — businesses, verification, spam, policies. **No** pageview analytics backend, **no** end-user accounts/block list yet. |
| **Auth (end users)** | Guest tools; optional business/admin sessions only. |
| **Monetization** | AdSense + Monetag + affiliate AdSlot. **No** paid subscription / pricing page yet. |
| **Nav / IA** | Header dumps many products on one row → feels scattered. Homepage mixes Business QR + Jobs + all categories. |

---

## 1. Free vs Paid (MVP-realistic)

### Positioning (Oct 2026)
- **Pro is paused** — entire SEO Dashboard + utilities are free.  
- **Free = Semrush-style workspace shell + working analyzers + ads on classic tools.**  
- Charts = user-run audits, localStorage rank logs, pasted GA4/GSC data, or clearly labeled modeled keyword ideation.  
- **Pro later** = multi-page crawl, real backlink index, fewer ads — not gated in UI now.

### Free (always)

| Feature | Notes |
|---------|--------|
| Core utilities (PDF, image, QR, text, calculators, etc.) | Unlimited basic use; ads OK |
| Meta / SERP preview, robots.txt, slug, schema generators | Client-side |
| Sitemap validator (lite), keyword density | Client-side |
| Keyword idea lite | Capped results / day (e.g. 3 seeds) |
| On-page audit lite | Paste HTML / single page fields — not full-site crawl |
| Study / Immigration / Travel hubs (read-only data) | Ads OK |
| Blog / how-to | Free |
| Soft limits | Rate-limit abuse; no account required for Free |

### Paid — ToolVerse Pro (target)

| Feature | Notes |
|---------|--------|
| Full site audit | Multi-page crawl, issues queue, history (needs worker/queue) |
| Keyword research depth | Larger lists, exports, saved sets |
| Rank tracking | Daily rank checks for N keywords × N domains |
| Backlink checker (real data) | Third-party API or own crawl — **not** the current modeled demo alone |
| Competitor gap | Keyword / content gaps vs 1–3 domains |
| White-label PDF reports | Agency-ready |
| Higher limits / no or fewer ads | Core monetization lever |
| Saved projects + API + team seats | Phase after payment works |

### Suggested pricing (starting point — validate later)

| Plan | Price (USD/mo) | Includes |
|------|----------------|----------|
| **Free** | $0 | Utilities + SEO lite + ads |
| **Pro** | $19–29 | Audit depth, keyword depth, rank track (e.g. 50 KW / 1 domain), fewer ads, exports |
| **Agency** (later) | $79–99 | Multi-domain, white-label, seats, API |

Payment: Stripe Checkout later — out of scope for foundation week.

---

## 2. Information Architecture

```
Home
├── Tools          → /tools  (category-first hub)
├── SEO Dashboard  → /workspace  (Semrush-style shell; alias /seo-dashboard)
├── SEO Suite      → /seo    (classic tool catalog landing)
├── Study Abroad   → /study
├── Immigration    → /immigration
├── Travel         → /travel (More)
├── Jobs           → /jobs/... 
├── Blog           → /blog
├── Pricing        → /pricing (Free live · Pro paused)
└── More           → Business, Startups, Guest Posts, Products, How-To, Admin
```

**Nav principle:** ≤6 primary items on desktop. Everything else under **More**. No one-screen dump.

### SEO Workspace data honesty

| Module | Real / working | Not claimed |
|--------|----------------|-------------|
| Site Audit / On-Page | Fetch HTML (CORS proxy) + `performOnPageAudit` | Multi-page crawl index |
| Site Performance | HTML weight / script estimates | CrUX / PSI API field data |
| Keyword Magic | **Locked** (modeled volume looked like fake Semrush DB) | Live search volume DB |
| Position Tracking | User-entered positions → local charts | Live SERP scrape |
| Backlinks | Outbound link extract + GSC paste | Global backlink index |
| Traffic Analytics | GA4/CSV paste → “Your data” charts | Semrush clickstream |
| Reports | HTML/PDF of last local audit | White-label agency SaaS |

**Lock policy:** Nav items use `status: 'live' | 'locked'` in `lib/seo/workspace/seoNavConfig.ts`. Live = real fetch / paste / user-entered data. Locked modules stay in the sidebar (lock icon) and open a Coming soon panel — no runnable fake market graphs. Unlock when real APIs or verified imports ship. Classic `/tools` catalog is unaffected.

---

## 3. SEO Software module roadmap

Map **existing** registry tools into product groups; stub Pro-only with honest badges.

### Groups

| Group | Free (wire now) | Pro (stub → build) |
|-------|-----------------|--------------------|
| **On-page & technical** | meta-tag, serp-simulator, robots, sitemap validator, schema, canonical-hreflang, seo-audit-analyzer (lite) | Full-site crawl audit, CWV lab, log analysis |
| **Keywords & content** | keyword-research (lite), keyword-density | Depth research, content briefs, cannibalization |
| **Links & authority** | backlink-checker (modeled — label honestly) | Real backlink index, toxic score, outreach tracker |
| **Tracking & competitors** | — | Rank tracker, competitor gap, share of voice |
| **Reports & ops** | Copy/export from single tools | White-label PDF, scheduled emails, projects |

### Phases

| Phase | Deliverable | ETA feel |
|-------|-------------|----------|
| **P0** | SEO Suite shell + categorized free tools + Pro badges | This foundation |
| **P1** | Real multi-page audit engine (Worker + queue) | Weeks |
| **P2** | Keyword depth + rank tracking MVP | Months |
| **P3** | Backlinks/competitor (API or crawl) | Months |
| **P4** | Reports, seats, API | After revenue |

Ops scripts in `seo/` stay internal until productized.

---

## 4. Data domains restructuring

| Domain | Current | Target routes | Content source |
|--------|---------|---------------|----------------|
| **Countries** | Travel country registry | `/travel`, country cards; later `/countries/[iso]` | `lib/travel/countryRegistry.ts` |
| **Immigration** | Visa engine WORK + embassies | `/immigration` hub → visa checker, embassies, jobs travel | `visaEngine`, `embassyRegistry` |
| **Study Abroad** | Visa STUDY purpose only | `/study` hub → study visa paths, popular destinations, GPA/tools links | Visa STUDY + calculators; **uni DB = future dataset** |
| **Jobs** | Already structured | Keep `/jobs/*` | `jobEngine` |

**Do not invent fake university rankings.** Until a real dataset exists, Study hub = visa/destination paths + related tools + honest “dataset coming”.

---

## 5. Admin panel enhancement checklist

| Need | Now (feasible) | Later (needs backend) |
|------|----------------|------------------------|
| Inventory stats | Tools count, categories, businesses, SEO tools, blog/jobs counts | — |
| Feature flags Free/Pro | Static config object + UI read | Remote config |
| Users list / block | N/A (no end-user auth) | Auth provider + blocklist |
| Pageviews / top tools / referrers | Link Clarity / CF Analytics (external) | First-party events + D1 |
| Link inventory | Count internal route map / short links local | Crawl graph from `seo/` |
| SEO health of ToolVerse | Run `npm run seo:*` reports | Dashboard ingest of `seo/reports` |
| Marketing metrics | Manual notes / Clarity | AdSense API + UTM dashboard |

**This foundation:** add an **Overview** strip with real inventory counts + Free/Pro feature flag list + note that traffic lives in Clarity until first-party analytics ships.

---

## 6. High-ROI ideas (beyond the ask)

1. **Workflow packs** — “Job application pack” (compress photo → passport photo → PDF merge) as guided multi-step pages. High conversion, low engineering vs new SEO crawlers.  
2. **Honest Semrush alternative content** — Own “free vs paid SEO” comparison pages + ToolVerse Pro CTAs (blog already leans this way).  
3. **Saved projects (local-first)** — IndexedDB project folders for audits/keywords before accounts; upgrade path to Pro cloud sync.  
4. **Pakistan/India regional SEO + jobs wedge** — Own the PK/IN utility niche harder than generic global tools.  
5. **Pro = remove Monetag/vignette first** — Cheapest perceived value bump; AdSense can stay lighter.

---

## 7. Foundation implementation (this sprint)

1. Clean primary nav + More menu  
2. Homepage: brand hero + four clear paths (Tools / SEO / Study / Immigration)  
3. `/tools` hub, `/seo` suite landing, `/pricing`, `/study`, `/immigration`  
4. Admin overview stats + feature flags  
5. Blueprint doc (this file)  
6. Deploy when build passes  

**Out of scope now:** Fake crawl UI, fake traffic charts, payment checkout, university DB, full Semrush clone.
