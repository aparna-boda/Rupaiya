-- Rupaiya Knowledge Base Schema v1

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Concepts (Basics screen)
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  explanation TEXT NOT NULL,
  example_key TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Investments (Grow Money screen)
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📊',
  risk_grade SMALLINT NOT NULL CHECK (risk_grade BETWEEN 0 AND 4),
  risk_label TEXT NOT NULL,
  return_min NUMERIC(6,2) NOT NULL,
  return_max NUMERIC(6,2) NOT NULL,
  return_avg NUMERIC(6,2) NOT NULL,
  explanation TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE investment_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Polymorphic keywords for search + AI
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('concept', 'investment')),
  entity_id UUID NOT NULL,
  keyword TEXT NOT NULL
);

CREATE INDEX idx_keywords_entity ON keywords(entity_type, entity_id);

-- Concept ↔ Investment relations
CREATE TABLE content_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  UNIQUE (concept_id, investment_id)
);

-- FAQs (Ask Anything chips)
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('getting-started', 'instruments', 'concepts', 'practical')),
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE faq_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faq_id UUID NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('concept', 'investment')),
  entity_id UUID NOT NULL
);

-- Screen intros + cache version
CREATE TABLE content_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One-time seed tracking
CREATE TABLE seed_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed_name TEXT UNIQUE NOT NULL,
  seeded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  row_counts JSONB NOT NULL DEFAULT '{}'
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER concepts_updated_at BEFORE UPDATE ON concepts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER content_meta_updated_at BEFORE UPDATE ON content_meta
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: deny all direct anon access (FastAPI uses service role)
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE seed_log ENABLE ROW LEVEL SECURITY;
