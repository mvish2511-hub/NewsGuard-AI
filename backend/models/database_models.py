import json
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship as orm_relationship
from datetime import datetime
from backend.database.connection import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=True)
    input_type = Column(String, default="text")
    content = Column(Text, nullable=False)
    reliability_score = Column(Integer, default=0)
    score_breakdown = Column(Text, default="{}")  # JSON string
    verdict_counts = Column(Text, default="{}")    # JSON string
    overall_verdict = Column(String, default="INSUFFICIENT_EVIDENCE")
    explainable_ai = Column(Text, default="{}")    # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    claims = orm_relationship("Claim", back_populates="report", cascade="all, delete-orphan")
    evidence = orm_relationship("Evidence", back_populates="report", cascade="all, delete-orphan")

    def get_score_breakdown(self):
        return json.loads(self.score_breakdown) if self.score_breakdown else {}

    def get_verdict_counts(self):
        return json.loads(self.verdict_counts) if self.verdict_counts else {}

    def get_explainable_ai(self):
        return json.loads(self.explainable_ai) if self.explainable_ai else {}


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(String, ForeignKey("reports.id"), nullable=False)
    claim_id = Column(String, nullable=False)
    claim_text = Column(Text, nullable=False)
    subject = Column(String, nullable=True)
    action = Column(String, nullable=True)
    object = Column(String, nullable=True)
    factuality = Column(String, default="FACTUAL")
    checkability = Column(String, default="VERIFIABLE")
    entities = Column(Text, default="[]")           # JSON string
    decomposition = Column(Text, default="{}")      # JSON string
    verdict = Column(String, default="INSUFFICIENT_EVIDENCE")
    confidence = Column(Float, default=0.0)
    explanation = Column(Text, nullable=True)
    evidence_ids = Column(Text, default="[]")       # JSON string (associated evidence ids)
    misinformation_pattern = Column(Text, nullable=True) # JSON string or null
    meaning_drift = Column(Text, nullable=True)          # JSON string or null
    timeline = Column(Text, nullable=True)              # JSON string or null

    report = orm_relationship("Report", back_populates="claims")

    def get_entities(self):
        return json.loads(self.entities) if self.entities else []

    def get_decomposition(self):
        return json.loads(self.decomposition) if self.decomposition else {}

    def get_evidence_ids(self):
        return json.loads(self.evidence_ids) if self.evidence_ids else []

    def get_misinformation_pattern(self):
        return json.loads(self.misinformation_pattern) if self.misinformation_pattern else None

    def get_meaning_drift(self):
        return json.loads(self.meaning_drift) if self.meaning_drift else None

    def get_timeline(self):
        return json.loads(self.timeline) if self.timeline else None


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(String, ForeignKey("reports.id"), nullable=False)
    claim_id = Column(String, nullable=True)  # Associated claim_id (e.g. claim_1)
    evidence_id = Column(String, nullable=False)
    source_title = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    source_type = Column(String, nullable=True)
    publication_date = Column(String, nullable=True)
    relevant_passage = Column(Text, nullable=False)
    relevance_score = Column(Float, default=0.0)
    credibility_indicator = Column(String, default="MEDIUM")
    relationship = Column(String, default="CONTEXTUALIZES")

    report = orm_relationship("Report", back_populates="evidence")
