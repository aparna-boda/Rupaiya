from fastapi import APIRouter
from app.services.knowledge import get_published_snapshot

router = APIRouter()


@router.get("/knowledge")
async def get_knowledge():
    return await get_published_snapshot()


@router.get("/concepts")
async def get_concepts():
    snapshot = await get_published_snapshot()
    return snapshot["concepts"]


@router.get("/investments")
async def get_investments():
    snapshot = await get_published_snapshot()
    return snapshot["investments"]


@router.get("/faqs")
async def get_faqs():
    snapshot = await get_published_snapshot()
    return snapshot["faqs"]


@router.get("/meta")
async def get_meta():
    snapshot = await get_published_snapshot()
    return snapshot["meta"]
