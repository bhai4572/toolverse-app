# ToolVerse — Production Utility Tools Platform

**ToolVerse** is a world-class, fast, clean, privacy-first online tools platform designed for files, images, PDFs, calculators, students, creators, developers, and businesses worldwide.

> **Privacy-First Guarantee:** Most browser tools process your files directly inside your client browser session using WebAssembly, Web Crypto API, and Web Canvas. Your files are **never** uploaded to cloud servers for client processing tools.

---

## 🚀 Key Features

- **94+ Production-Ready Live & Server Tools:** Image compressors, PDF mergers, format converters, algebra equation solvers, JWT decoders, IPv4 subnet calculators, ATS resume checkers, electricity bill estimators, solar system calculators, Daraz seller fee calculators, and writing & academic integrity tools.
- **Strict Academic Integrity Policy:** Zero AI-detector bypass, zero Turnitin evasion, zero fake plagiarism scores. Mandatory consent and ethical disclaimers on all rephrasing and similarity tools.
- **Zero Mock UI / Zero Fake Data:** Every tool marked "Live" performs real processing end-to-end.
- **Cloudflare Integration:** Full support for Cloudflare Pages, Cloudflare Workers backend, and D1/KV storage for URL shortener.
- **Automatic Instant Search:** Client-side search index supporting synonyms, KB target presets, and aliases.
- **Responsive & Dark Mode:** Clean utility-site UI built with Next.js App Router, TypeScript, and Tailwind CSS.
- **Automated Test Suite:** Vitest unit test suite covering math formulas, text algorithms, tax rules, readability metrics, and URL validation.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript Strict Mode)
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** Lucide React (`lucide-react`)
- **PDF Engines:** `pdf-lib`, `jsPDF`
- **Image Engines:** `browser-image-compression`, `heic2any`, Web Canvas
- **Utilities:** `qrcode`, `papaparse`, `decimal.js`, `date-fns`, `diff`
- **Backend / DB:** Cloudflare Worker, D1 / KV database, Next.js API Routes
- **Testing:** Vitest

---

## 💻 Local Setup Instructions

### Prerequisites
- **Node.js:** v18+ or v20+ (v22 tested)
- **Package Manager:** npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/toolverse.git
cd toolverse
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

Run the Vitest unit test suite:
```bash
npm test
```

---

## 📦 Production Build & Deployment

ToolVerse ships as a **Vite + React SPA** with build-time SEO prerender into `dist/`.

```bash
npm run build
# runs: sitemap → vite build → scripts/prerender.mjs
```

### Cloudflare Pages (project: toolverse-app)

Required dashboard settings (wrong Next.js output breaks deploys):

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repo root) |
| Node version | `20` (or `.node-version`) |

- SPA fallback: `functions/_middleware.js` (do **not** use `/* /index.html 200` in `_redirects` — CF applies redirects before assets).
- Direct deploy: `npm run deploy:pages`

---

## 📜 License

MIT License. Designed & Developed for ToolVerse.
