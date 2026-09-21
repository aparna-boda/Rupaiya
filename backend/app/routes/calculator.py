from fastapi import APIRouter
from app.models.calculator import CalculatorRequest, CalculatorResponse
from app.services.calculator import calculate_sip

router = APIRouter()


@router.post("/calculate/sip", response_model=CalculatorResponse)
async def sip_calculator(request: CalculatorRequest):
    result = calculate_sip(request.monthly, request.ratePercent, request.years)
    return result
