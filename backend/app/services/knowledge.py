import json
import re
from html import unescape
from pathlib import Path

from app.config import settings

SEED_DIR = Path(__file__).parent.parent.parent.parent / "supabase" / "seed"


def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html)
    return unescape(re.sub(r"\s+", " ", text)).strip()


def _wrap_plain_text(text: str) -> str:
    if text.strip().startswith("<"):
        return text
    return f"<p>{text}</p>"


def _load_seed_json(name: str):
    with open(SEED_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def _map_groups_from_seed(groups_raw: list) -> list[dict]:
    return [
        {
            "id": g["slug"],
            "slug": g["slug"],
            "title": g["title"],
            "description": g["description"],
            "sortOrder": g.get("sortOrder", i),
        }
        for i, g in enumerate(groups_raw)
    ]


def _concept_from_seed(c: dict) -> dict:
    return {
        "id": c["id"],
        "slug": c["id"],
        "title": c["title"],
        "tagline": c["tagline"],
        "explanation": _wrap_plain_text(c["explanation"]),
        "exampleKey": c["exampleKey"],
        "groupSlug": c.get("groupSlug"),
        "sortOrder": c.get("sortOrder", 0),
        "relatedInvestmentIds": c.get("relatedInvestmentIds", []),
        "keywords": c.get("keywords", []),
    }


def _enrich_with_seed_groups(snapshot: dict) -> dict:
    """Backfill groups, groupSlug, explanations, and concepts added to seed after DB was seeded."""
    concepts = list(snapshot.get("concepts", []))
    groups_raw = _load_seed_json("concept_groups.json")
    seed_concepts = _load_seed_json("concepts.json")
    seed_by_slug = {c["id"]: c for c in seed_concepts}

    # Seed JSON is source of truth for learning copy (e.g. layman explanations).
    for concept in concepts:
        slug = concept.get("slug") or concept.get("id")
        seed = seed_by_slug.get(slug)
        if seed and seed.get("explanation"):
            concept["explanation"] = _wrap_plain_text(seed["explanation"])

    needs_groups = not snapshot.get("groups")
    needs_slugs = any(not c.get("groupSlug") for c in concepts)
    existing_slugs = {c["slug"] for c in concepts}
    missing_from_seed = [c for c in seed_concepts if c["id"] not in existing_slugs]

    if not needs_groups and not needs_slugs and not missing_from_seed:
        return snapshot

    if needs_groups:
        snapshot["groups"] = _map_groups_from_seed(groups_raw)

    if needs_slugs:
        for concept in concepts:
            if concept.get("groupSlug"):
                continue
            seed = seed_by_slug.get(concept["slug"])
            if seed:
                concept["groupSlug"] = seed.get("groupSlug")

    if missing_from_seed:
        concepts.extend(_concept_from_seed(c) for c in missing_from_seed)
        concepts.sort(key=lambda x: x.get("sortOrder", 0))
        snapshot["concepts"] = concepts

    investments = list(snapshot.get("investments", []))
    investments_raw = _load_seed_json("investments.json")
    existing_inv_slugs = {inv.get("slug") or inv.get("id") for inv in investments}
    missing_investments = [inv for inv in investments_raw if inv["id"] not in existing_inv_slugs]

    seed_inv_by_slug = {inv["id"]: inv for inv in investments_raw}
    inv_updated = False

    for inv in investments:
        slug = inv.get("slug") or inv.get("id")
        seed = seed_inv_by_slug.get(slug)
        if not seed:
            continue
        if seed.get("explanation"):
            inv["explanation"] = _wrap_plain_text(seed["explanation"])
        for field in (
            "name", "tagline", "icon", "riskGrade", "riskLabel",
            "returnMin", "returnMax", "returnAvg", "highlights", "keywords",
        ):
            if field in seed and seed[field] is not None:
                inv[field] = seed[field]
        if seed.get("relatedConceptIds"):
            inv["relatedConceptIds"] = seed["relatedConceptIds"]
        inv_updated = True

    if missing_investments:
        for i, inv in enumerate(missing_investments):
            investments.append({
                "id": inv["id"],
                "slug": inv["id"],
                "name": inv["name"],
                "tagline": inv["tagline"],
                "icon": inv["icon"],
                "riskGrade": inv["riskGrade"],
                "riskLabel": inv["riskLabel"],
                "returnMin": inv["returnMin"],
                "returnMax": inv["returnMax"],
                "returnAvg": inv["returnAvg"],
                "explanation": _wrap_plain_text(inv.get("explanation", "")),
                "highlights": inv.get("highlights", []),
                "relatedConceptIds": inv.get("relatedConceptIds", []),
                "keywords": inv.get("keywords", []),
                "sortOrder": inv.get("sortOrder", len(investments) + i),
            })
        inv_updated = True

    if inv_updated:
        snapshot["investments"] = investments

    return snapshot


def _seed_snapshot() -> dict:
    """Fallback when Supabase is not configured — reads supabase/seed/*.json only."""
    meta_raw = _load_seed_json("meta.json")
    groups_raw = _load_seed_json("concept_groups.json")
    concepts_raw = _load_seed_json("concepts.json")
    investments_raw = _load_seed_json("investments.json")
    faqs_raw = _load_seed_json("faqs.json")

    concepts = []
    for i, c in enumerate(concepts_raw):
        concepts.append({
            "id": c["id"],
            "slug": c["id"],
            "title": c["title"],
            "tagline": c["tagline"],
            "explanation": _wrap_plain_text(c["explanation"]),
            "exampleKey": c["exampleKey"],
            "groupSlug": c.get("groupSlug"),
            "sortOrder": c.get("sortOrder", i),
            "relatedInvestmentIds": c.get("relatedInvestmentIds", []),
            "keywords": c.get("keywords", []),
        })

    investments = []
    for i, inv in enumerate(investments_raw):
        investments.append({
            "id": inv["id"],
            "slug": inv["id"],
            "name": inv["name"],
            "tagline": inv["tagline"],
            "icon": inv["icon"],
            "riskGrade": inv["riskGrade"],
            "riskLabel": inv["riskLabel"],
            "returnMin": inv["returnMin"],
            "returnMax": inv["returnMax"],
            "returnAvg": inv["returnAvg"],
            "explanation": _wrap_plain_text(inv["explanation"]),
            "highlights": inv.get("highlights", []),
            "relatedConceptIds": inv.get("relatedConceptIds", []),
            "keywords": inv.get("keywords", []),
            "sortOrder": i,
        })

    faqs = []
    for i, f in enumerate(faqs_raw):
        faqs.append({
            "id": f["id"],
            "slug": f["id"],
            "question": f["question"],
            "category": f["category"],
            "sortOrder": i,
        })

    return {
        "meta": {
            "basicsIntro": meta_raw["basicsIntro"],
            "growIntro": meta_raw["growIntro"],
            "version": meta_raw.get("version", "1"),
        },
        "groups": _map_groups_from_seed(groups_raw),
        "concepts": concepts,
        "investments": investments,
        "faqs": faqs,
    }


def _get_keywords(entity_type: str, entity_id: str, client) -> list[str]:
    rows = (
        client.table("keywords")
        .select("keyword")
        .eq("entity_type", entity_type)
        .eq("entity_id", entity_id)
        .execute()
        .data
        or []
    )
    return [r["keyword"] for r in rows]


def _set_keywords(entity_type: str, entity_id: str, keywords: list[str], client) -> None:
    client.table("keywords").delete().eq("entity_type", entity_type).eq("entity_id", entity_id).execute()
    if keywords:
        client.table("keywords").insert([
            {"entity_type": entity_type, "entity_id": entity_id, "keyword": k.lower().strip()}
            for k in keywords if k.strip()
        ]).execute()


async def _get_meta(client) -> dict:
    rows = client.table("content_meta").select("key, value").execute().data or []
    meta_map = {r["key"]: r["value"] for r in rows}
    return {
        "basicsIntro": {
            "title": meta_map.get("basics_intro_title", "Learning"),
            "description": meta_map.get("basics_intro_description", ""),
        },
        "growIntro": {
            "title": meta_map.get("grow_intro_title", "Grow Money"),
            "description": meta_map.get("grow_intro_description", ""),
        },
        "version": meta_map.get("knowledge_version", "1"),
    }


async def _increment_version(client) -> None:
    rows = client.table("content_meta").select("value").eq("key", "knowledge_version").execute().data
    current = int(rows[0]["value"]) if rows else 0
    client.table("content_meta").upsert({
        "key": "knowledge_version",
        "value": str(current + 1),
    }).execute()


async def get_published_snapshot() -> dict:
    if not settings.supabase_configured:
        return _seed_snapshot()

    from app.services.supabase import get_supabase

    client = get_supabase()
    meta = await _get_meta(client)

    concept_rows = (
        client.table("concepts")
        .select("*")
        .eq("is_published", True)
        .order("sort_order")
        .execute()
        .data
        or []
    )
    investment_rows = (
        client.table("investments")
        .select("*")
        .eq("is_published", True)
        .order("sort_order")
        .execute()
        .data
        or []
    )
    faq_rows = (
        client.table("faqs")
        .select("*")
        .eq("is_published", True)
        .order("sort_order")
        .execute()
        .data
        or []
    )
    group_rows = (
        client.table("concept_groups")
        .select("*")
        .eq("is_published", True)
        .order("sort_order")
        .execute()
        .data
        or []
    )

    relations = client.table("content_relations").select("concept_id, investment_id").execute().data or []

    concepts = []
    for row in concept_rows:
        related_slugs = []
        for rel in relations:
            if rel["concept_id"] == row["id"]:
                inv = next((i for i in investment_rows if i["id"] == rel["investment_id"]), None)
                if inv:
                    related_slugs.append(inv["slug"])
        concepts.append({
            "id": row["id"],
            "slug": row["slug"],
            "title": row["title"],
            "tagline": row["tagline"],
            "explanation": row["explanation"],
            "exampleKey": row["example_key"],
            "groupSlug": row.get("group_slug"),
            "sortOrder": row["sort_order"],
            "relatedInvestmentIds": related_slugs,
            "keywords": _get_keywords("concept", row["id"], client),
        })

    investments = []
    for row in investment_rows:
        highlights = (
            client.table("investment_highlights")
            .select("label")
            .eq("investment_id", row["id"])
            .order("sort_order")
            .execute()
            .data
            or []
        )
        related_slugs = []
        for rel in relations:
            if rel["investment_id"] == row["id"]:
                con = next((c for c in concept_rows if c["id"] == rel["concept_id"]), None)
                if con:
                    related_slugs.append(con["slug"])
        investments.append({
            "id": row["id"],
            "slug": row["slug"],
            "name": row["name"],
            "tagline": row["tagline"],
            "icon": row["icon"],
            "riskGrade": row["risk_grade"],
            "riskLabel": row["risk_label"],
            "returnMin": float(row["return_min"]),
            "returnMax": float(row["return_max"]),
            "returnAvg": float(row["return_avg"]),
            "explanation": row["explanation"],
            "highlights": [h["label"] for h in highlights],
            "relatedConceptIds": related_slugs,
            "keywords": _get_keywords("investment", row["id"], client),
            "sortOrder": row["sort_order"],
        })

    faqs = [
        {
            "id": row["id"],
            "slug": row["slug"],
            "question": row["question"],
            "category": row["category"],
            "sortOrder": row["sort_order"],
        }
        for row in faq_rows
    ]

    groups = [
        {
            "id": row["id"],
            "slug": row["slug"],
            "title": row["title"],
            "description": row["description"],
            "sortOrder": row["sort_order"],
        }
        for row in group_rows
    ]

    return _enrich_with_seed_groups(
        {"meta": meta, "groups": groups, "concepts": concepts, "investments": investments, "faqs": faqs}
    )


async def get_admin_snapshot() -> dict:
    if not settings.supabase_configured:
        return _seed_snapshot()

    from app.services.supabase import get_supabase

    client = get_supabase()
    meta = await _get_meta(client)

    concept_rows = client.table("concepts").select("*").order("sort_order").execute().data or []
    investment_rows = client.table("investments").select("*").order("sort_order").execute().data or []
    faq_rows = client.table("faqs").select("*").order("sort_order").execute().data or []
    group_rows = client.table("concept_groups").select("*").order("sort_order").execute().data or []
    relations = client.table("content_relations").select("concept_id, investment_id").execute().data or []

    concepts = []
    for row in concept_rows:
        related = []
        for rel in relations:
            if rel["concept_id"] == row["id"]:
                inv = next((i for i in investment_rows if i["id"] == rel["investment_id"]), None)
                if inv:
                    related.append(inv["slug"])
        concepts.append({
            "id": row["id"],
            "slug": row["slug"],
            "title": row["title"],
            "tagline": row["tagline"],
            "explanation": row["explanation"],
            "exampleKey": row["example_key"],
            "groupSlug": row.get("group_slug"),
            "sortOrder": row["sort_order"],
            "isPublished": row["is_published"],
            "relatedInvestmentIds": related,
            "keywords": _get_keywords("concept", row["id"], client),
        })

    investments = []
    for row in investment_rows:
        highlights = (
            client.table("investment_highlights")
            .select("label")
            .eq("investment_id", row["id"])
            .order("sort_order")
            .execute()
            .data
            or []
        )
        related = []
        for rel in relations:
            if rel["investment_id"] == row["id"]:
                con = next((c for c in concept_rows if c["id"] == rel["concept_id"]), None)
                if con:
                    related.append(con["slug"])
        investments.append({
            "id": row["id"],
            "slug": row["slug"],
            "name": row["name"],
            "tagline": row["tagline"],
            "icon": row["icon"],
            "riskGrade": row["risk_grade"],
            "riskLabel": row["risk_label"],
            "returnMin": float(row["return_min"]),
            "returnMax": float(row["return_max"]),
            "returnAvg": float(row["return_avg"]),
            "explanation": row["explanation"],
            "sortOrder": row["sort_order"],
            "isPublished": row["is_published"],
            "highlights": [h["label"] for h in highlights],
            "relatedConceptIds": related,
            "keywords": _get_keywords("investment", row["id"], client),
        })

    faqs = [
        {
            "id": row["id"],
            "slug": row["slug"],
            "question": row["question"],
            "category": row["category"],
            "sortOrder": row["sort_order"],
            "isPublished": row["is_published"],
        }
        for row in faq_rows
    ]

    groups = [
        {
            "id": row["id"],
            "slug": row["slug"],
            "title": row["title"],
            "description": row["description"],
            "sortOrder": row["sort_order"],
            "isPublished": row["is_published"],
        }
        for row in group_rows
    ]

    return _enrich_with_seed_groups(
        {"meta": meta, "groups": groups, "concepts": concepts, "investments": investments, "faqs": faqs}
    )


def build_knowledge_context(snapshot: dict | None = None) -> str:
    data = snapshot or _seed_snapshot()
    lines = [
        "## Rupaiya Knowledge Base",
        "Use this curated content when answering. Prefer it over generic advice.",
        "",
        "### Core Concepts",
    ]
    for c in data["concepts"]:
        plain = _strip_html(c["explanation"])
        lines.append(f"- **{c['title']}** ({c['slug']}): {plain}")

    lines.append("")
    lines.append("### Investment Options")
    for i in data["investments"]:
        returns = (
            f"{i['returnMin']}–{i['returnMax']}%"
            if i["returnAvg"] > 0
            else "highly variable"
        )
        plain = _strip_html(i["explanation"])
        lines.append(f"- **{i['name']}** ({i['slug']}, {i['riskLabel']}, {returns}): {plain}")

    return "\n".join(lines)


async def update_concept(concept_id: str, data: dict) -> dict:
    from app.services.supabase import get_supabase

    client = get_supabase()
    row: dict = {}
    field_map = {
        "slug": "slug", "title": "title", "tagline": "tagline",
        "explanation": "explanation", "exampleKey": "example_key",
        "groupSlug": "group_slug", "sortOrder": "sort_order",
        "isPublished": "is_published",
    }
    for api_key, db_key in field_map.items():
        if api_key in data and data[api_key] is not None:
            row[db_key] = data[api_key]

    if row:
        client.table("concepts").update(row).eq("id", concept_id).execute()

    if "keywords" in data and data["keywords"] is not None:
        _set_keywords("concept", concept_id, data["keywords"], client)

    if "relatedInvestmentIds" in data and data["relatedInvestmentIds"] is not None:
        client.table("content_relations").delete().eq("concept_id", concept_id).execute()
        inv_rows = client.table("investments").select("id, slug").execute().data or []
        slug_map = {r["slug"]: r["id"] for r in inv_rows}
        for slug in data["relatedInvestmentIds"]:
            if slug in slug_map:
                client.table("content_relations").insert({
                    "concept_id": concept_id,
                    "investment_id": slug_map[slug],
                }).execute()

    await _increment_version(client)
    snapshot = await get_admin_snapshot()
    version = snapshot["meta"]["version"]
    return {"ok": True, "version": version}


async def update_investment(investment_id: str, data: dict) -> dict:
    from app.services.supabase import get_supabase

    client = get_supabase()
    row: dict = {}
    field_map = {
        "slug": "slug", "name": "name", "tagline": "tagline", "icon": "icon",
        "riskGrade": "risk_grade", "riskLabel": "risk_label",
        "returnMin": "return_min", "returnMax": "return_max", "returnAvg": "return_avg",
        "explanation": "explanation", "sortOrder": "sort_order", "isPublished": "is_published",
    }
    for api_key, db_key in field_map.items():
        if api_key in data and data[api_key] is not None:
            row[db_key] = data[api_key]

    if row:
        client.table("investments").update(row).eq("id", investment_id).execute()

    if "highlights" in data and data["highlights"] is not None:
        client.table("investment_highlights").delete().eq("investment_id", investment_id).execute()
        if data["highlights"]:
            client.table("investment_highlights").insert([
                {"investment_id": investment_id, "label": h, "sort_order": idx}
                for idx, h in enumerate(data["highlights"])
            ]).execute()

    if "keywords" in data and data["keywords"] is not None:
        _set_keywords("investment", investment_id, data["keywords"], client)

    if "relatedConceptIds" in data and data["relatedConceptIds"] is not None:
        client.table("content_relations").delete().eq("investment_id", investment_id).execute()
        con_rows = client.table("concepts").select("id, slug").execute().data or []
        slug_map = {r["slug"]: r["id"] for r in con_rows}
        for slug in data["relatedConceptIds"]:
            if slug in slug_map:
                client.table("content_relations").insert({
                    "concept_id": slug_map[slug],
                    "investment_id": investment_id,
                }).execute()

    await _increment_version(client)
    snapshot = await get_admin_snapshot()
    return {"ok": True, "version": snapshot["meta"]["version"]}


async def update_faq(faq_id: str, data: dict) -> dict:
    from app.services.supabase import get_supabase

    client = get_supabase()
    row: dict = {}
    field_map = {
        "slug": "slug", "question": "question", "category": "category",
        "sortOrder": "sort_order", "isPublished": "is_published",
    }
    for api_key, db_key in field_map.items():
        if api_key in data and data[api_key] is not None:
            row[db_key] = data[api_key]

    if row:
        client.table("faqs").update(row).eq("id", faq_id).execute()

    await _increment_version(client)
    snapshot = await get_admin_snapshot()
    return {"ok": True, "version": snapshot["meta"]["version"]}


async def update_meta(data: dict) -> dict:
    from app.services.supabase import get_supabase

    client = get_supabase()
    mapping = {
        "basicsIntroTitle": "basics_intro_title",
        "basicsIntroDescription": "basics_intro_description",
        "growIntroTitle": "grow_intro_title",
        "growIntroDescription": "grow_intro_description",
    }
    for api_key, db_key in mapping.items():
        if api_key in data and data[api_key] is not None:
            client.table("content_meta").upsert({"key": db_key, "value": data[api_key]}).execute()

    await _increment_version(client)
    snapshot = await get_admin_snapshot()
    return {"ok": True, "version": snapshot["meta"]["version"]}


# Legacy sync wrapper used by old code paths
def get_knowledge_snapshot() -> dict:
    import asyncio
    return asyncio.get_event_loop().run_until_complete(get_published_snapshot())
