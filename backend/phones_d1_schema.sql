-- ============================================================================
-- ToolVerse Scalable Mobile Phones & Specifications Directory Schema
-- Compatible with Cloudflare D1 (SQLite) & PostgreSQL
-- Prevents duplicate models via UNIQUE(canonical_key) and UNIQUE(slug)
-- Supports 15,000+ phone models without bloating Cloudflare Pages static bundle
-- ============================================================================

CREATE TABLE IF NOT EXISTS phone_brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  founded_year INTEGER,
  website TEXT,
  brand_color TEXT DEFAULT '#2563EB',
  summary TEXT
);

CREATE TABLE IF NOT EXISTS phone_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS phone_models (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  canonical_key TEXT UNIQUE NOT NULL, -- brand_slug + ':' + normalized_model_slug
  brand_slug TEXT NOT NULL REFERENCES phone_brands(slug),
  brand_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  release_status TEXT NOT NULL CHECK (release_status IN ('Available', 'Upcoming', 'Discontinued')),
  release_year INTEGER NOT NULL,
  categories_json TEXT NOT NULL,      -- JSON array of PhoneCategorySlug
  is_5g INTEGER NOT NULL DEFAULT 0,
  price_usd REAL,
  price_pkr INTEGER,
  pta_status TEXT,
  variants_json TEXT NOT NULL,        -- JSON array of storage/RAM/price variants
  specs_json TEXT NOT NULL,           -- Full 13-group structured technical specs JSON
  original_summary TEXT NOT NULL,
  pros_json TEXT NOT NULL,
  cons_json TEXT NOT NULL,
  alternative_slugs_json TEXT NOT NULL,
  faqs_json TEXT NOT NULL,
  popularity_score INTEGER NOT NULL DEFAULT 100,
  last_updated TEXT NOT NULL,
  source_origin TEXT NOT NULL DEFAULT 'verified_catalog',
  is_archived INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  canonical_url TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_phone_models_brand ON phone_models(brand_slug);
CREATE INDEX IF NOT EXISTS idx_phone_models_year ON phone_models(release_year);
CREATE INDEX IF NOT EXISTS idx_phone_models_price_pkr ON phone_models(price_pkr);
CREATE INDEX IF NOT EXISTS idx_phone_models_price_usd ON phone_models(price_usd);

CREATE TABLE IF NOT EXISTS phone_import_batches (
  id TEXT PRIMARY KEY,
  imported_at TEXT NOT NULL,
  imported_by TEXT NOT NULL,
  source_format TEXT NOT NULL CHECK (source_format IN ('csv', 'json', 'manual')),
  added_count INTEGER NOT NULL DEFAULT 0,
  updated_count INTEGER NOT NULL DEFAULT 0,
  skipped_duplicates_count INTEGER NOT NULL DEFAULT 0
);

