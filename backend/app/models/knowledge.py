from typing import Literal
from pydantic import BaseModel, Field


class ConceptGroupResponse(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    sortOrder: int = Field(alias="sort_order")
    isPublished: bool | None = Field(default=None, alias="is_published")

    model_config = {"populate_by_name": True}


class ConceptBase(BaseModel):
    slug: str
    title: str
    tagline: str
    explanation: str
    exampleKey: str = Field(alias="example_key")
    groupSlug: str | None = Field(default=None, alias="group_slug")
    sortOrder: int = Field(default=0, alias="sort_order")
    isPublished: bool = Field(default=True, alias="is_published")
    keywords: list[str] = []
    relatedInvestmentIds: list[str] = []

    model_config = {"populate_by_name": True}


class ConceptCreate(ConceptBase):
    pass


class ConceptUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    tagline: str | None = None
    explanation: str | None = None
    exampleKey: str | None = None
    groupSlug: str | None = None
    sortOrder: int | None = None
    isPublished: bool | None = None
    keywords: list[str] | None = None
    relatedInvestmentIds: list[str] | None = None


class ConceptResponse(ConceptBase):
    id: str


class InvestmentBase(BaseModel):
    slug: str
    name: str
    tagline: str
    icon: str
    riskGrade: int = Field(alias="risk_grade")
    riskLabel: str = Field(alias="risk_label")
    returnMin: float = Field(alias="return_min")
    returnMax: float = Field(alias="return_max")
    returnAvg: float = Field(alias="return_avg")
    explanation: str
    sortOrder: int = Field(default=0, alias="sort_order")
    isPublished: bool = Field(default=True, alias="is_published")
    highlights: list[str] = []
    keywords: list[str] = []
    relatedConceptIds: list[str] = []

    model_config = {"populate_by_name": True}


class InvestmentUpdate(BaseModel):
    slug: str | None = None
    name: str | None = None
    tagline: str | None = None
    icon: str | None = None
    riskGrade: int | None = None
    riskLabel: str | None = None
    returnMin: float | None = None
    returnMax: float | None = None
    returnAvg: float | None = None
    explanation: str | None = None
    sortOrder: int | None = None
    isPublished: bool | None = None
    highlights: list[str] | None = None
    keywords: list[str] | None = None
    relatedConceptIds: list[str] | None = None


class InvestmentResponse(InvestmentBase):
    id: str


class FAQBase(BaseModel):
    slug: str
    question: str
    category: Literal["getting-started", "instruments", "concepts", "practical"]
    sortOrder: int = Field(default=0, alias="sort_order")
    isPublished: bool = Field(default=True, alias="is_published")

    model_config = {"populate_by_name": True}


class FAQUpdate(BaseModel):
    slug: str | None = None
    question: str | None = None
    category: str | None = None
    sortOrder: int | None = None
    isPublished: bool | None = None
    relatedConceptIds: list[str] | None = None
    relatedInvestmentIds: list[str] | None = None


class FAQResponse(FAQBase):
    id: str


class MetaUpdate(BaseModel):
    basicsIntroTitle: str | None = None
    basicsIntroDescription: str | None = None
    growIntroTitle: str | None = None
    growIntroDescription: str | None = None


class AdminLoginRequest(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    expiresAt: str


class SeedRequest(BaseModel):
    force: bool = False


class TermResponse(BaseModel):
    id: str
    slug: str
    title: str
    shortDefinition: str
    whyItMatters: str
    example: str = ""
    category: str
    track: Literal["core", "investor", "trader"] = "investor"
    relatedConceptSlugs: list[str] = []
    aliases: list[str] = []
    keywords: list[str] = []
    sortOrder: int = 0


class KnowledgeSnapshot(BaseModel):
    meta: dict
    groups: list[ConceptGroupResponse] = []
    concepts: list[ConceptResponse]
    investments: list[InvestmentResponse]
    faqs: list[FAQResponse]
    terms: list[TermResponse] = []
