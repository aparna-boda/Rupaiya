from typing import Literal
from pydantic import BaseModel


class UserProfile(BaseModel):
    name: str = ""
    age: int
    monthlyIncome: int
    monthlyInvestment: int
    riskAppetite: Literal["safe", "low", "medium", "high"]
    emergencyFundStatus: Literal["none", "partial", "done"] = "none"
    existingInvestments: Literal["none", "epf-only", "mutual-funds", "mixed"] = "none"
    primaryGoal: Literal["retirement", "house", "child-education", "financial-freedom"] = "retirement"
    hasDependents: bool = False
    onboardingComplete: bool = True
