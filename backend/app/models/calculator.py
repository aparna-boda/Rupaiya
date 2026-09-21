from pydantic import BaseModel


class CalculatorRequest(BaseModel):
    monthly: float
    ratePercent: float
    years: int


class YearlyBreakdown(BaseModel):
    year: int
    value: int
    invested: int


class CalculatorResponse(BaseModel):
    totalValue: int
    totalInvested: int
    totalGain: int
    multiplier: float
    yearlyBreakdown: list[YearlyBreakdown]
