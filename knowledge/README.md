# Knowledge Base — Deprecated Location

> **As of PRD v3.0**, learning content is stored in **Supabase**, not JSON files at runtime.

## New locations

| What | Where |
|------|-------|
| Database schema | `supabase/migrations/001_initial_schema.sql`, `002_concept_groups.sql` |
| Default seed data | `supabase/seed/*.json` (159 concepts, 15 groups) |
| Concept generator | `supabase/seed/build_concepts.py` |
| Public API | `GET /api/knowledge` |
| Admin editor | Screen 8 at `/admin` |
| Spec | `rupaiya-prd.md` §9, `CLAUDE.md` §7–§9 |

## Migration note

The JSON files in this folder are **legacy**. The canonical seed data is now in `supabase/seed/`. Do not import either location at runtime from the frontend.

## Editing content (going forward)

Use the password-protected admin UI at `/admin` — rich text for explanations, form fields for numbers. Changes save directly to Supabase.
