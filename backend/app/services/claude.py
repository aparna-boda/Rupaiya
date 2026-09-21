import json
import anthropic
from app.config import settings
from app.models.profile import UserProfile
from app.services.knowledge import build_knowledge_context, get_published_snapshot

SYSTEM_PROMPT = """
You are a friendly, plain-spoken personal finance guide for Indian markets.

User profile:
- Name: {name}
- Age: {age}
- Monthly income: ₹{monthly_income:,}
- Monthly investment capacity: ₹{monthly_investment:,}
- Risk appetite: {risk_appetite}
- Emergency fund status: {emergency_fund_status}
- Existing investments: {existing_investments}
- Primary goal: {primary_goal}
- Financial dependents: {has_dependents}

Rules:
- Address the user by their first name when natural (not every sentence)
- Speak like a knowledgeable friend, not a textbook or a bank
- Always use Indian context: INR, NSE/BSE, SEBI, SBI, Nifty, real Indian examples
- Use real numbers tied to this user's profile in every response
- Never use jargon without immediately explaining it in one plain sentence
- Keep responses under 200 words unless the user explicitly asks for more
- Never say "great question", "certainly", or start with sycophantic openers
- Be honest about risks and downsides — no sales pitch
- Goal: help them understand how a rupee earns another rupee
"""

PLAN_PROMPT = """
Create a personalised step-by-step investment plan for this Indian user.

User profile:
- Name: {name}
- Age: {age}
- Monthly income: ₹{monthly_income:,}
- Monthly investment capacity: ₹{monthly_investment:,}
- Risk appetite: {risk_appetite}
- Emergency fund status: {emergency_fund_status}
- Existing investments: {existing_investments}
- Primary goal: {primary_goal}
- Financial dependents: {has_dependents}

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{{
  "allocationNote": "One sentence on how amounts sum to monthly capacity; for safe users explain why not 100% equity",
  "steps": [
    {{
      "order": 1,
      "phase": "protect",
      "title": "Step title",
      "action": "What to do",
      "amount": 3000,
      "instrument": "Specific instrument name",
      "conceptSlug": "term-insurance",
      "why": "Plain language reason in 1-2 sentences"
    }}
  ]
}}

Rules:
- Exactly 4 phases in order: protect → save → invest → tax (one step each minimum, max 6 steps total)
- phase must be one of: protect, save, invest, tax
- protect: term insurance, health cover if dependents
- save: emergency fund, liquid fund, FD
- invest: SIP, PPF, NPS, debt/equity based on risk appetite
- tax: 80C, 80CCD, ELSS, PPF allocation
- conceptSlug must match a real concept from the knowledge base (e.g. emergency-fund, sip, ppf, term-insurance, nps)
- Amounts on invest/tax steps must sum to approximately the monthly investment capacity (protect/save can be ₹0 if building fund separately)
- For safe/low risk: allocationNote MUST explain why not 100% equity
- Use real Indian instruments (HDFC Liquid Fund, Nifty 50 index fund, SBI FD, etc.)
- Be practical for someone starting from zero
- Not SEBI-registered advice — keep it educational
"""


def _profile_fields(profile: UserProfile) -> dict:
    return {
        "name": profile.name or "User",
        "age": profile.age,
        "monthly_income": profile.monthlyIncome,
        "monthly_investment": profile.monthlyInvestment,
        "risk_appetite": profile.riskAppetite,
        "emergency_fund_status": profile.emergencyFundStatus,
        "existing_investments": profile.existingInvestments,
        "primary_goal": profile.primaryGoal,
        "has_dependents": "yes" if profile.hasDependents else "no",
    }


async def _build_system_prompt(profile: UserProfile) -> str:
    snapshot = await get_published_snapshot()
    base = SYSTEM_PROMPT.format(**_profile_fields(profile))
    return f"{base}\n\n{build_knowledge_context(snapshot)}"


def _get_client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=settings.anthropic_api_key)


async def chat(
    message: str,
    history: list[dict],
    profile: UserProfile,
) -> str:
    client = _get_client()
    system = await _build_system_prompt(profile)

    messages = [{"role": m["role"], "content": m["content"]} for m in history]
    if not messages or messages[-1]["role"] != "user":
        messages.append({"role": "user", "content": message})
    elif messages[-1]["content"] != message:
        messages.append({"role": "user", "content": message})

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system,
        messages=messages,
    )

    return response.content[0].text


async def generate_plan(profile: UserProfile) -> list[dict]:
    client = _get_client()
    prompt = PLAN_PROMPT.format(**_profile_fields(profile))

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0]

    data = json.loads(text)
    return {
        "steps": data["steps"],
        "allocationNote": data.get("allocationNote", ""),
    }
