from typing import Literal
from pydantic import BaseModel
from app.models.profile import UserProfile


class PlanStep(BaseModel):
    order: int
    phase: Literal["protect", "save", "invest", "tax"]
    title: str
    action: str
    amount: int
    instrument: str
    conceptSlug: str
    why: str


class PlanRequest(BaseModel):
    userProfile: UserProfile


class PlanResponse(BaseModel):
    steps: list[PlanStep]
    allocationNote: str = ""
