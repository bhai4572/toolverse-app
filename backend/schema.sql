-- ============================================================================
-- DELIVERABLE 1: B2B Email Finder Production Database Schema (PostgreSQL / Supabase)
-- Policy-Compliant, Zero-Hallucination Business Contact Discovery & Verification
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Companies Table (Cached Company Metadata & DNS Infrastructure)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(120),
  company_size VARCHAR(64),
  country VARCHAR(100),
  headquarters VARCHAR(255),
  phone VARCHAR(64),
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  email_domains_detected TEXT[] DEFAULT '{}',
  detected_pattern VARCHAR(64), -- e.g. '{first}.{last}@domain.com'
  pattern_confidence INTEGER DEFAULT 0,
  website_reachable BOOLEAN DEFAULT FALSE,
  has_mx_records BOOLEAN DEFAULT FALSE,
  mx_records TEXT[] DEFAULT '{}',
  has_spf BOOLEAN DEFAULT FALSE,
  has_dmarc BOOLEAN DEFAULT FALSE,
  is_accept_all BOOLEAN DEFAULT FALSE,
  robots_txt_respected BOOLEAN DEFAULT TRUE,
  crawled_pages TEXT[] DEFAULT '{}',
  last_crawled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(LOWER(company_name));

-- 2. Discovered Public & Provider-Verified Emails Table
-- ANTI-HALLUCINATION CONSTRAINT: Every row MUST have either a public source_url
-- or a verified provider_source ('hunter', 'zerobounce', 'emaillistverify').
CREATE TABLE IF NOT EXISTS discovered_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  role VARCHAR(150),
  department VARCHAR(100),
  discovery_method VARCHAR(32) NOT NULL CHECK (discovery_method IN ('public_crawl', 'hunter_api', 'zerobounce_api', 'emaillistverify_api', 'pattern_verified')),
  source_url TEXT NOT NULL,
  verification_status VARCHAR(20) NOT NULL CHECK (verification_status IN ('valid', 'accept_all', 'risky', 'unknown', 'not_found')),
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  low_confidence_warning BOOLEAN GENERATED ALWAYS AS (confidence_score < 70) STORED,
  verification_provider VARCHAR(50) NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain, email)
);

CREATE INDEX IF NOT EXISTS idx_discovered_emails_domain ON discovered_emails(domain);
CREATE INDEX IF NOT EXISTS idx_discovered_emails_status ON discovered_emails(verification_status);

-- 3. Email Verification Audit Log
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(320) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('valid', 'accept_all', 'risky', 'unknown', 'not_found')),
  confidence_score INTEGER NOT NULL DEFAULT 0,
  has_mx BOOLEAN NOT NULL DEFAULT FALSE,
  is_accept_all BOOLEAN NOT NULL DEFAULT FALSE,
  is_disposable BOOLEAN NOT NULL DEFAULT FALSE,
  is_role_account BOOLEAN NOT NULL DEFAULT FALSE,
  provider VARCHAR(50) NOT NULL, -- 'hunter_verifier', 'zerobounce', 'emaillistverify', 'dns_mx_probe'
  raw_reason TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

-- 4. User Credits & Monthly Quota Ledger
-- Free tier: 5 company searches and 10 email verifications per month.
-- Credit packs: 100 credits = $9, 500 credits = $29, 1,000 credits = $49.
-- Credits consumed ONLY for successful verified email results (0 for Not Found).
CREATE TABLE IF NOT EXISTS user_credits (
  user_id VARCHAR(128) PRIMARY KEY,
  plan_tier VARCHAR(32) NOT NULL DEFAULT 'free',
  free_searches_used INT NOT NULL DEFAULT 0,
  free_searches_limit INT NOT NULL DEFAULT 5,
  free_verifications_used INT NOT NULL DEFAULT 0,
  free_verifications_limit INT NOT NULL DEFAULT 10,
  paid_credits_balance INT NOT NULL DEFAULT 0,
  period_reset_at TIMESTAMPTZ NOT NULL DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Credit Pack Purchases & Consumption Transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(128) NOT NULL REFERENCES user_credits(user_id) ON DELETE CASCADE,
  transaction_type VARCHAR(32) NOT NULL CHECK (transaction_type IN ('pack_purchase_100', 'pack_purchase_500', 'pack_purchase_1000', 'search_charge', 'verification_charge', 'no_charge_not_found')),
  credits_delta INT NOT NULL,
  amount_usd NUMERIC(8,2) DEFAULT 0.00,
  reference_query VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Search & API Usage Audit Logs (Deliverable 9: Admin Dashboard)
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(128) NOT NULL DEFAULT 'anonymous',
  search_query VARCHAR(255) NOT NULL,
  resolved_domain VARCHAR(255),
  filters_json JSONB DEFAULT '{}'::jsonb,
  sources_used TEXT[] DEFAULT '{}',
  verified_emails_count INT NOT NULL DEFAULT 0,
  verification_status_summary VARCHAR(64) NOT NULL,
  credits_used INT NOT NULL DEFAULT 0,
  api_providers_called TEXT[] DEFAULT '{}',
  response_time_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at DESC);

