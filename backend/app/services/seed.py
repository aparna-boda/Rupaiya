import json
from pathlib import Path

from app.config import settings
from app.services.knowledge import _wrap_plain_text

SEED_DIR = Path(__file__).parent.parent.parent.parent / "supabase" / "seed"
SEED_NAME = "initial_v2"


def _load(name: str):
    with open(SEED_DIR / name, encoding="utf-8") as f:
        return json.load(f)


async def run_seed(force: bool = False) -> dict:
    if not settings.supabase_configured:
        raise RuntimeError("Supabase is not configured")

    from app.services.supabase import get_supabase

    client = get_supabase()

    existing = client.table("seed_log").select("seed_name").eq("seed_name", SEED_NAME).execute().data
    if existing and not force:
        return {"seeded": False, "message": "Already seeded. Use force=true to re-seed."}

    if force:
        for table in [
            "faq_relations", "content_relations", "keywords",
            "investment_highlights", "faqs", "investments", "concepts",
            "concept_groups",
        ]:
            client.table(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        client.table("content_meta").delete().neq("key", "").execute()
        client.table("seed_log").delete().in_("seed_name", [SEED_NAME, "initial_v1"]).execute()

    meta = _load("meta.json")
    groups = _load("concept_groups.json")
    concepts = _load("concepts.json")
    investments = _load("investments.json")
    faqs = _load("faqs.json")

    client.table("content_meta").upsert([
        {"key": "basics_intro_title", "value": meta["basicsIntro"]["title"]},
        {"key": "basics_intro_description", "value": meta["basicsIntro"]["description"]},
        {"key": "grow_intro_title", "value": meta["growIntro"]["title"]},
        {"key": "grow_intro_description", "value": meta["growIntro"]["description"]},
        {"key": "knowledge_version", "value": "1"},
    ]).execute()

    for i, g in enumerate(groups):
        client.table("concept_groups").insert({
            "slug": g["slug"],
            "title": g["title"],
            "description": g["description"],
            "sort_order": g.get("sortOrder", i),
            "is_published": True,
        }).execute()

    concept_id_map: dict[str, str] = {}
    for i, c in enumerate(concepts):
        row = client.table("concepts").insert({
            "slug": c["id"],
            "title": c["title"],
            "tagline": c["tagline"],
            "explanation": _wrap_plain_text(c["explanation"]),
            "example_key": c["exampleKey"],
            "group_slug": c.get("groupSlug"),
            "sort_order": c.get("sortOrder", i),
            "is_published": True,
        }).execute().data[0]
        concept_id_map[c["id"]] = row["id"]
        for kw in c.get("keywords", []):
            client.table("keywords").insert({
                "entity_type": "concept",
                "entity_id": row["id"],
                "keyword": kw.lower(),
            }).execute()

    investment_id_map: dict[str, str] = {}
    for i, inv in enumerate(investments):
        row = client.table("investments").insert({
            "slug": inv["id"],
            "name": inv["name"],
            "tagline": inv["tagline"],
            "icon": inv["icon"],
            "risk_grade": inv["riskGrade"],
            "risk_label": inv["riskLabel"],
            "return_min": inv["returnMin"],
            "return_max": inv["returnMax"],
            "return_avg": inv["returnAvg"],
            "explanation": _wrap_plain_text(inv["explanation"]),
            "sort_order": i,
            "is_published": True,
        }).execute().data[0]
        investment_id_map[inv["id"]] = row["id"]
        for j, h in enumerate(inv.get("highlights", [])):
            client.table("investment_highlights").insert({
                "investment_id": row["id"],
                "label": h,
                "sort_order": j,
            }).execute()
        for kw in inv.get("keywords", []):
            client.table("keywords").insert({
                "entity_type": "investment",
                "entity_id": row["id"],
                "keyword": kw.lower(),
            }).execute()

    for c in concepts:
        cid = concept_id_map[c["id"]]
        for inv_slug in c.get("relatedInvestmentIds", []):
            if inv_slug in investment_id_map:
                client.table("content_relations").insert({
                    "concept_id": cid,
                    "investment_id": investment_id_map[inv_slug],
                }).execute()

    for i, f in enumerate(faqs):
        client.table("faqs").insert({
            "slug": f["id"],
            "question": f["question"],
            "category": f["category"],
            "sort_order": i,
            "is_published": True,
        }).execute()

    counts = {
        "groups": len(groups),
        "concepts": len(concepts),
        "investments": len(investments),
        "faqs": len(faqs),
    }

    client.table("seed_log").insert({
        "seed_name": SEED_NAME,
        "row_counts": counts,
    }).execute()

    return {"seeded": True, "counts": counts}


if __name__ == "__main__":
    import asyncio
    asyncio.run(run_seed(force="--force" in __import__("sys").argv))
