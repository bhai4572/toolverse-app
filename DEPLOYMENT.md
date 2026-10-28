# ToolVerse Platform — Deployment & Operational Guide

**Project:** ToolVerse — Advanced SEO and Marketing Intelligence Platform  
**Target Infrastructure:** Cloudflare Pages (Static Assets + Edge Functions)  
**Last Updated:** 2026-10-28  

---

## 1. Hosting Architecture & Prerequisites

The platform is designed for zero-maintenance edge deployment on **Cloudflare Pages**:
* **Frontend:** Built into optimized static HTML, CSS, and JS in `dist/`.
* **API & Crawling Layer:** Cloudflare Pages Functions located in `functions/api/` (invoked as standard edge worker handlers).
* **Node.js Compatibility:** Version `>= 20.0.0`.
* **Package Manager:** `npm` (with `package-lock.json`).

---

## 2. Local Development Workflow

Run the complete local development environment without needing external cloud emulators:

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev
# The dev server boots at http://localhost:5173 with Vite middleware 
# proxying /api/site-audit requests seamlessly.

# 3. Run automated test suite
npm test

# 4. Create production build bundle
npm run build
```

---

## 3. Cloudflare Pages Deployment Configuration

When connecting the GitHub repository to Cloudflare Pages:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | None / Vite |
| **Build Command** | `npm run build` |
| **Build Output Directory** | `dist` |
| **Root Directory** | `/` (Repository root) |
| **Node Version** | `20` (configured in `.node-version`) |

The functions in `functions/api/` are automatically detected, bundled, and deployed as Cloudflare Edge Workers alongside the static bundle in `dist/`.

---

## 4. Environment Variables Configuration

Copy `.env.example` to configure optional external services (all core features work out of the box with zero required environment variables):

```env
# Optional: Google Search Console OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: External SERP & Keyword Intelligence
DATAFORSEO_LOGIN=""
DATAFORSEO_PASSWORD=""

# Deployment Mode
NODE_ENV="production"
```

> **Security Rule:** Never commit `.env` or production API secrets to version control.

---

## 5. Backup & Disaster Recovery

Because ToolVerse operates on a privacy-first, local-first repository model:
1. **Workspace Data Export:** Users can export their entire workspace (projects, audits, ranking history, keyword lists, and tasks) as a portable JSON snapshot directly from the settings menu.
2. **Workspace Restore:** Restoring workspace state is instant by uploading the JSON snapshot in any modern browser.
3. **Stateless Edge Functions:** The crawler and API functions are 100% stateless; if an edge node fails, traffic automatically fails over to the next closest Cloudflare point of presence.
