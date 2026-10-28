# ToolVerse Platform — System Architecture

**Project:** ToolVerse — Advanced SEO and Marketing Intelligence Platform  
**Target Environment:** Cloudflare Pages (Edge) + Client SPA (Vite / React 19)  
**Last Updated:** 2026-10-28  

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           React 19 SPA (Vite)                               |  |
|  |                                                                             |  |
|  |  +--------------------------+  +-----------------------------------------+  |  |
|  |  |  App Shell & Navigation   |  |     SEO Workspace (19 Deep Modules)    |  |  |
|  |  |  - Project Switcher       |  |  - Module A: Command Center             |  |  |
|  |  |  - Breadcrumbs & Search   |  |  - Module B: Site Audit v1 (Live)       |  |  |
|  |  |  - Responsive Drawer      |  |  - Module C: Page Inspector / Linking   |  |  |
|  |  +--------------------------+  |  - Module E: GSC & GA4 Analytics        |  |  |
|  |                                |  - Module F: Keyword Workspace          |  |  |
|  |  +--------------------------+  |  - Module J: Backlink Intelligence      |  |  |
|  |  |  100+ Free Browser Tools  |  |  - Module R: Tasks, Diff & Reports      |  |  |
|  |  |  (Image, PDF, Hash, etc.) |  |  - Modules D,G,H,I,K,L,M,N,O,P,Q,S     |  |  |
|  |  +--------------------------+  +-----------------------------------------+  |  |
|  |                                                                             |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  |         Local Repository & Tenancy Engine (IndexedDB/Storage)         |  |  |
|  |  |  - Multi-Project State     - Tasks & Assignees    - Historical Diffs  |  |  |
|  |  |  - Verification Records    - Crawl Snapshots      - CSV Ingestion     |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
+----------------------------------------+------------------------------------------+
                                         | Secure API Calls
                                         v
+-----------------------------------------------------------------------------------+
|                        BACKEND & EDGE COMPUTE TIER                                |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |              Cloudflare Pages Functions (`/functions/api/`)                 |  |
|  |                    & Vite Dev Proxy (`vite.config.ts`)                      |  |
|  |                                                                             |  |
|  |  +------------------------+  +--------------------+  +-------------------+  |  |
|  |  |   POST /api/site-audit |  |  POST /api/verify  |  |  GSC / SERP Proxy |  |  |
|  |  +-----------+------------+  +--------------------+  +-------------------+  |  |
|  |              |                                                              |  |
|  |              v                                                              |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  |                         SSRF Guard Engine                             |  |  |
|  |  |  - IPv4 / IPv6 CIDR Blocklist  - Scheme & Port Policy (80/443 Only)   |  |  |
|  |  |  - Cloudflare 1.1.1.1 DoH Check - DNS Rebinding Defense on Redirects  |  |  |
|  |  +-----------------------------------+-----------------------------------+  |  |
|  |                                      |                                      |  |
|  |                                      v                                      |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  |                        Crawler & Analysis Core                        |  |  |
|  |  |  - Concurrency Limiter (Max 2 req/host) - Response Size Cap (5MB)     |  |  |
|  |  |  - Technical SEO Parser (Titles, Metas, H1, Canonical, Robots, Alt)  |  |  |
|  |  |  - Internal Link Graph Builder & Duplication Analyzer                |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
+----------------------------------------+------------------------------------------+
                                         | Outbound Safe Requests
                                         v
+-----------------------------------------------------------------------------------+
|                              EXTERNAL NETWORK TARGETS                             |
|                                                                                   |
|       [ Target Domain ]         [ Google APIs ]        [ Cloudflare DoH ]         |
|         (User Website)           (GSC / GA4)               (1.1.1.1)              |
+-----------------------------------------------------------------------------------+
```

---

## 2. Tenancy & Data Model

The platform is designed around a multi-project organization workspace:
* **Workspace:** The root container representing the user or organization.
* **Project:** Scoped to a specific domain (`example.com`), subdomain (`blog.example.com`), or path (`example.com/blog/`).
  - Holds target country, target language, and competitors.
  - Holds ownership verification tokens (`meta` tag or `DNS TXT` record).
* **Audit Run:** A timestamped snapshot of a crawl containing:
  - Page inventory (`UrlInventoryItem[]`).
  - Technical findings (`Finding[]`) with stable rule IDs and severity levels.
  - Internal link graph (`LinkRecord[]`).
* **Task:** Action item created manually or spawned directly from an audit finding.
  - Tracks status (`open`, `in-progress`, `resolved`), assignee, priority, and recheck URL.

---

## 3. Client / Edge Separation of Concerns

* **Edge Compute (`/functions/`):**
  - Executes network-bound crawling where browser CORS prevents client fetches.
  - Enforces SSRF defense, DNS resolution, and outbound rate limiting.
  - Streams parsed JSON results back to the client.
* **Client Application (`src/`, `components/`):**
  - Renders the interactive UI with zero latency.
  - Persists projects, audit histories, and keyword lists in local storage/IndexedDB.
  - Parses uploaded CSV files client-side without sending private data to unnecessary servers.
  - Generates printer-friendly reports and CSV exports directly in-browser.
