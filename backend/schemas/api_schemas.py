from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    content: str = Field(..., description="The content to analyze (news text, URL, or image OCR text)")
    input_type: str = Field("text", description="Type of input: text, url, image")
    title: Optional[str] = Field(None, description="Optional title of the article or source")

class ExtractClaimsRequest(BaseModel):
    text: str = Field(..., description="Text from which to extract claims")

# Subschemas for Claim components
class ClaimDecomposition(BaseModel):
    subject: Optional[str] = None
    action: Optional[str] = None
    amount: Optional[str] = None
    target: Optional[str] = None
    scope: Optional[str] = None
    context: Optional[str] = None

class MisinformationPatternSchema(BaseModel):
    type: str = Field(..., description="Type of misinformation (e.g. Exaggeration, Outdated Context)")
    severity: str = Field(..., description="Severity: HIGH, MEDIUM, LOW")
    explanation: str = Field(..., description="Detailed explanation of the pattern")
    affected_claim: str = Field(..., description="The text of the affected claim")

class MeaningDriftChange(BaseModel):
    original: str
    viral: str

class MeaningDriftSchema(BaseModel):
    original_text: str
    viral_text: str
    changes: List[MeaningDriftChange]
    severity: str
    reason: str

class TimelineItemSchema(BaseModel):
    year: str
    title: str
    description: str
    verdict_drift: Optional[str] = None

class ClaimResponse(BaseModel):
    claim_id: str
    claim_text: str
    subject: Optional[str] = None
    action: Optional[str] = None
    object: Optional[str] = None
    factuality: str = "FACTUAL"
    checkability: str = "VERIFIABLE"
    entities: List[str] = []
    decomposition: Optional[ClaimDecomposition] = None
    verdict: str = "INSUFFICIENT_EVIDENCE"
    confidence: float = 0.0
    explanation: Optional[str] = None
    evidence_ids: List[str] = []
    misinformation_pattern: Optional[MisinformationPatternSchema] = None
    meaning_drift: Optional[MeaningDriftSchema] = None
    timeline: Optional[List[TimelineItemSchema]] = None

class EvidenceResponse(BaseModel):
    evidence_id: str
    source_title: str
    source_url: Optional[str] = None
    source_type: Optional[str] = None
    publication_date: Optional[str] = None
    relevant_passage: str
    relevance_score: float = 0.0
    credibility_indicator: str = "MEDIUM"
    relationship: str = "CONTEXTUALIZES"

class ScoreBreakdownResponse(BaseModel):
    evidence_support: int
    source_quality: int
    context_completeness: int
    claim_consistency: int
    misinformation_risk: str

class ExplainableAIResponse(BaseModel):
    summary: str
    what_we_found: str
    what_supports: str
    what_contradicts: str
    what_is_missing: str
    why_misleading: str
    confidence_explanation: str

class SourceResponse(BaseModel):
    url: Optional[str] = None
    title: str
    credibility: str
    notes: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    title: Optional[str] = None
    input_type: str
    content: str
    reliability_score: int
    score_breakdown: ScoreBreakdownResponse
    verdict_counts: Dict[str, int]
    overall_verdict: str
    claims: List[ClaimResponse]
    evidence: List[EvidenceResponse]
    explainable_ai: ExplainableAIResponse
    sources: List[SourceResponse]

class HealthResponse(BaseModel):
    status: str
    demo_mode: bool
    api_key_configured: bool
