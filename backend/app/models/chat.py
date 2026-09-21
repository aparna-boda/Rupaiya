from typing import Literal
from pydantic import BaseModel
from app.models.profile import UserProfile


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage]
    userProfile: UserProfile


class ChatResponse(BaseModel):
    reply: str
