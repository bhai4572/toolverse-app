# Production Deployment Guide — Policy-Compliant B2B Email Finder

## 1. Architecture Overview
The B2B Email Finder is a zero-hallucination, policy-compliant business contact discovery and verification system:
- **Database Schema**: `backend/schema.sql` (PostgreSQL / Supabase + local JSON/D1 persistence fallback in `data/b2b_email_intelligence_db.json`).
- **Core Intelligence & Anti-Hallucination Engine**: `lib/b2b/emailIntelligenceEngine.ts`.
- **12-Path Public Website Crawler, DNS/MX Verifier & Provider Waterfall**: `lib/b2b/serverCrawlerAndDb.ts`.
- **API Endpoints**: `/api/email-finder` (`vite.config.ts` for Node/SSR and `functions/api/email-finder.js` for Cloudflare Pages Edge).
- **Frontend UI & Admin Dashboard**: `features/tools/EmailFinderTool.tsx`.

## 2. Database Setup (PostgreSQL via Supabase)
1. Create a new Supabase project and open the **SQL Editor**.
2. Paste and execute [`backend/schema.sql`](../backend/schema.sql) to provision:
   - `companies` (company metadata, DNS/MX/SPF/DMARC diagnostics, detected email pattern)
   - `discovered_emails` (verified & publicly sourced emails with strict `source_url` constraints)
   - `email_verifications` (verification audit trail)
   - `user_credits` (`5` free monthly company searches, `10` free monthly verifications, plus paid credit balances)
   - `credit_transactions` (`100 credits = $9`, `500 credits = $29`, `1,000 credits = $49`)
   - `search_logs` (query, timestamp, sources, verification status, credits charged)

## 3. Environment Variables
Set the following environment variables in your `.env.local` or Cloudflare Pages Dashboard (**Settings → Environment Variables**):

```env
# Primary & Fallback Verification Providers (Optional — Crawler + DNS MX works out of the box)
HUNTER_API_KEY=your_hunter_io_api_key
ZEROBOUNCE_API_KEY=your_zerobounce_api_key
EMAILLISTVERIFY_API_KEY=your_emaillistverify_api_key

# Supabase PostgreSQL Connection (Optional — defaults to persistent JSON/Edge cache if omitted)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Upstash Redis / QStash Background Queue (Optional)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
QSTASH_TOKEN=your_qstash_token
```

## 4. Build, Test & Deploy Commands
```bash
# 1. Run unit & anti-hallucination verification tests
npm test

# 2. Generate sitemaps (all 193 countries + all tools), build Vite bundle, and prerender SEO HTML shells
npm run build

# 3. Deploy to Cloudflare Pages
npx wrangler pages deploy dist
```

