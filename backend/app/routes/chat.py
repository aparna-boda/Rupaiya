from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services import claude as claude_service
from app.config import settings

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. Please set ANTHROPIC_API_KEY.",
        )

    history = [{"role": m.role, "content": m.content} for m in request.history]
    reply = await claude_service.chat(request.message, history, request.userProfile)
    return ChatResponse(reply=reply)
