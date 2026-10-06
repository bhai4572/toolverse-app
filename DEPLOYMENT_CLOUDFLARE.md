# ToolVerse — Cloudflare Deployment Guide

## Cloudflare Pages (frontend) — Vite SPA

Project name: **toolverse-app** (custom domain `toolverse.baby`).

| Setting | Required value |
|---|---|
| Framework preset | None / Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 20 |

Do **not** use `npx @cloudflare/next-on-pages` or `.vercel/output/static` — this app builds with Vite.

### SEO prerender + SPA fallback

- `npm run build` runs sitemap → `vite build` → `scripts/prerender.mjs` (writes `dist/<route>/index.html`).
- `functions/_middleware.js` serves prerendered shells from ASSETS; falls back to `/index.html` on 404.
- Never add `/* /index.html 200` to `_redirects` (CF evaluates redirects before static files).

### Manual deploy

```bash
npm run deploy:pages
```

---

## Cloudflare Worker + D1 (URL Shortener)

### Step 1: Create D1 Database
```bash
npx wrangler d1 create toolverse-db
```

### Step 2: Create D1 Migration Table
```sql
CREATE TABLE IF NOT EXISTS short_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  clicks INTEGER DEFAULT 0
);
```

### Step 3: Create KV Namespace
```bash
npx wrangler kv:namespace create SHORT_KV
```

### Step 4: Deploy Worker
```bash
npx wrangler deploy workers/url-shortener-worker.ts --name toolverse-url-shortener
```
