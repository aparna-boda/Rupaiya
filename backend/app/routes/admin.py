from fastapi import APIRouter, Depends, HTTPException
from app.config import settings
from app.models.knowledge import (
    AdminLoginRequest,
    AdminLoginResponse,
    ConceptUpdate,
    FAQUpdate,
    InvestmentUpdate,
    MetaUpdate,
    SeedRequest,
)
from app.services.auth import create_admin_token, require_admin
from app.services.knowledge import (
    get_admin_snapshot,
    update_concept,
    update_faq,
    update_investment,
    update_meta,
)
from app.services.seed import run_seed

router = APIRouter()


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(body: AdminLoginRequest):
    if not settings.admin_password:
        raise HTTPException(status_code=503, detail="Admin password not configured")
    if body.password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Invalid password")
    token, expires_at = create_admin_token()
    return AdminLoginResponse(token=token, expiresAt=expires_at)


@router.get("/knowledge")
async def admin_get_knowledge(_: None = Depends(require_admin)):
    return await get_admin_snapshot()


@router.put("/concepts/{concept_id}")
async def admin_update_concept(concept_id: str, body: ConceptUpdate, _: None = Depends(require_admin)):
    if not settings.supabase_configured:
        raise HTTPException(status_code=503, detail="Supabase required for admin writes")
    return await update_concept(concept_id, body.model_dump(exclude_none=True))


@router.put("/investments/{investment_id}")
async def admin_update_investment(investment_id: str, body: InvestmentUpdate, _: None = Depends(require_admin)):
    if not settings.supabase_configured:
        raise HTTPException(status_code=503, detail="Supabase required for admin writes")
    return await update_investment(investment_id, body.model_dump(exclude_none=True))


@router.put("/faqs/{faq_id}")
async def admin_update_faq(faq_id: str, body: FAQUpdate, _: None = Depends(require_admin)):
    if not settings.supabase_configured:
        raise HTTPException(status_code=503, detail="Supabase required for admin writes")
    return await update_faq(faq_id, body.model_dump(exclude_none=True))


@router.put("/meta")
async def admin_update_meta(body: MetaUpdate, _: None = Depends(require_admin)):
    if not settings.supabase_configured:
        raise HTTPException(status_code=503, detail="Supabase required for admin writes")
    return await update_meta(body.model_dump(exclude_none=True))


@router.post("/seed")
async def admin_seed(body: SeedRequest, _: None = Depends(require_admin)):
    if not settings.supabase_configured:
        raise HTTPException(status_code=503, detail="Supabase required for seeding")
    return await run_seed(force=body.force)
