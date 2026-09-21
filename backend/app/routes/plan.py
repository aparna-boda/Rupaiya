from fastapi import APIRouter, HTTPException
from app.models.plan import PlanRequest, PlanResponse, PlanStep
from app.services import claude as claude_service
from app.config import settings

router = APIRouter()


@router.post("/plan", response_model=PlanResponse)
async def plan_endpoint(request: PlanRequest):
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. Please set ANTHROPIC_API_KEY.",
        )

    result = await claude_service.generate_plan(request.userProfile)
    steps = [PlanStep(**step) for step in result["steps"]]
    return PlanResponse(steps=steps, allocationNote=result.get("allocationNote", ""))
