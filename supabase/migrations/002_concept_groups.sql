-- Concept groups for Learning screen (15 curriculum groups)

CREATE TABLE concept_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE concepts ADD COLUMN IF NOT EXISTS group_slug TEXT;

CREATE INDEX IF NOT EXISTS idx_concepts_group_slug ON concepts(group_slug);

CREATE TRIGGER concept_groups_updated_at BEFORE UPDATE ON concept_groups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE concept_groups ENABLE ROW LEVEL SECURITY;
