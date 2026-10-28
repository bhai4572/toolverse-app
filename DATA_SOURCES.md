# ToolVerse Platform — Data Sources & Provider Architecture

**Project:** ToolVerse — Advanced SEO and Marketing Intelligence Platform  
**Compliance Standard:** Strict Truthfulness Protocol (No fabricated metrics, no fake graphs, no synthetic domain ratings)  
**Last Updated:** 2026-10-28  

---

## 1. Overview of Data Provenance

ToolVerse strictly categorizes every data point into one of four distinct tiers:
1. **Tier 1: Directly Measured / Observed** (Crawler, DNS over HTTPS, Browser APIs, HTTP response headers).
2. **Tier 2: Authorized First-Party Integration** (User-connected Google Search Console, Google Analytics 4, Google Business Profile).
3. **Tier 3: User Import** (Uploaded CSV/JSON files from official tools and third-party exports).
4. **Tier 4: Third-Party Provider Estimate** (Optional licensed APIs like DataForSEO or SerpApi, with prominent estimation disclaimers).

---

## 2. Measured & Observed Sources (Tier 1)

### 2.1 Server-Side Crawler (`crawlerEngine.ts`)
* **Endpoint:** `POST /api/site-audit` (Cloudflare Pages Function & local Vite middleware).
* **Transport:** HTTPS / HTTP via native `fetch` guarded by `ssrfGuard.ts`.
* **Extracted Signals:**
  - HTTP response status and redirect chains (`301`, `302`, `307`, `308`, `404`, `500`).
  - Response time (ms), content type, and payload size.
  - `<title>` element presence, character length, and duplicates across pages.
  - `<meta name="description">` presence, length, and duplicates.
  - Heading structure (`<h1>`, `<h2>`) and structural warnings.
  - `<link rel="canonical">` target and self-referential consistency.
  - Robots directives (`<meta name="robots">`, `X-Robots-Tag` header, `/robots.txt` disallow rules).
  - Outgoing and incoming internal links with anchor text and `rel` attributes (`nofollow`, `ugc`, `sponsored`).
  - Image elements, distinguishing missing `alt` attributes from intentional decorative empty `alt=""`.
  - Content word count and thin content detection (< 100 words).
* **Restrictions:**
  - Strict host scoping (does not crawl external domains during a site audit).
  - Configurable page limits (default: 10, max: 200 on serverless edge).
  - Concurrency limited to 2 simultaneous requests per domain to avoid target denial-of-service.

### 2.2 DNS over HTTPS (`ssrfGuard.ts`)
* **Provider:** Cloudflare 1.1.1.1 DoH (`https://cloudflare-dns.com/dns-query`).
* **Purpose:** Pre-flight DNS resolution before making outbound HTTP connections.
* **Checks:**
  - Validates that returned IPv4/IPv6 addresses do not resolve to loopback (`127.0.0.0/8`), private RFC1918 networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local (`169.254.0.0/16`), or IPv6 equivalents (`::1`, `fc00::/7`, `fe80::/10`).
  - Re-evaluates destination IP on every redirect step to prevent DNS rebinding attacks.

---

## 3. Authorized First-Party Integrations (Tier 2)

### 3.1 Google Search Console (GSC) API
* **Endpoint:** `https://www.googleapis.com/webmasters/v3/`
* **OAuth Scopes:** `https://www.googleapis.com/auth/webmasters.readonly`
* **Data Ingested:**
  - Verified property list (`sites.list`).
  - Search Analytics query performance (`searchanalytics.query`): Clicks, Impressions, CTR, Position broken down by date, query, page, country, and device.
  - URL Inspection API (`urlInspection.index.inspect`): Verdict, coverageState, robotsTxtState, indexingState.
* **Credentials:** User-supplied OAuth Client ID + Secret, or Service Account JSON key.
* **Fallback:** When unconfigured, the platform provides direct file drop for GSC CSV performance exports.

### 3.2 Google Analytics 4 (GA4) Data API
* **Endpoint:** `https://analyticsdata.googleapis.com/v1beta/`
* **OAuth Scopes:** `https://www.googleapis.com/auth/analytics.readonly`
* **Data Ingested:**
  - Active users, sessions, pageviews, engagement rate, organic landing page conversions.
* **Fallback:** Manual CSV session import (`date, sessions, users, pageviews, source`).

---

## 4. User Import Formats (Tier 3)

| Import Type | Expected File Format | Required Headers / Fields |
| :--- | :--- | :--- |
| **GSC Search Performance** | Official GSC CSV | `Top queries.csv` (`Top queries, Clicks, Impressions, CTR, Position`), `Pages.csv` |
| **Universal Backlinks** | CSV | `Source URL, Target URL, Anchor Text, Type (Dofollow/Nofollow), First Seen` |
| **URL Redirect Map** | CSV | `Source Path / URL, Target Destination URL, Expected Code (301/302)` |
| **Keyword Seed List** | CSV / TXT | `Keyword, [Target URL], [Priority], [Category]` |
| **Server Access Log** | Apache/Nginx Combined Log | Standard combined log format (IP, timestamp, method, path, status, User-Agent) |

---

## 5. Third-Party Provider Interfaces (Tier 4)

For external metrics where direct site measurement is technically impossible (e.g., aggregate search volume across Google, third-party domain estimates):
* **Provider Adapters:** Standard TypeScript interfaces in `lib/seo/providers/` (`SerpProvider`, `KeywordVolumeProvider`).
* **Supported Configs:** DataForSEO, SerpApi, ValueSERP.
* **Transparent Quota & Cost Disclosures:** Every external call logs estimated provider cost and remaining query balance.
* **Zero Fake Numbers Rule:** If no provider credentials exist, the interface strictly renders **"Integration Required: Connect Data Provider or Import CSV"** rather than generating synthetic volume or difficulty curves.
