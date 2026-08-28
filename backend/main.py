import json
import logging
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

# Import DB and Schemas
from backend.database.connection import engine, Base, get_db
from backend.models import database_models
from backend.schemas import api_schemas

# Import Services
from backend.database.demo_data import DEMO_SCENARIOS
from backend.services import (
    llm_service,
    claim_service,
    evidence_service,
    rag_service,
    verification_service,
    misinformation_service,
    meaning_drift_service,
    scoring_service
)
from backend.utils import document_processor

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("newsguard.main")

# Initialize database tables
logger.info("Initializing database tables...")
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="🛡️ NewsGuard AI API",
    description="Explainable AI-powered Claim Verification & Misinformation Detection",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=api_schemas.HealthResponse)
def health_check():
    api_configured = llm_service.is_api_configured()
    return {
        "status": "ok",
        "demo_mode": not api_configured,
        "api_key_configured": api_configured
    }


def format_report_db_to_schema(report_db: database_models.Report) -> Dict[str, Any]:
    """Converts a database Report model with relations into the Pydantic API response schema."""
    claims_list = []
    for c in report_db.claims:
        claims_list.append({
            "claim_id": c.claim_id,
            "claim_text": c.claim_text,
            "subject": c.subject,
            "action": c.action,
            "object": c.object,
            "factuality": c.factuality,
            "checkability": c.checkability,
            "entities": c.get_entities(),
            "decomposition": c.get_decomposition(),
            "verdict": c.verdict,
            "confidence": c.confidence,
            "explanation": c.explanation,
            "evidence_ids": c.get_evidence_ids(),
            "misinformation_pattern": c.get_misinformation_pattern(),
            "meaning_drift": c.get_meaning_drift(),
            "timeline": c.get_timeline()
        })

    evidence_list = []
    for e in report_db.evidence:
        evidence_list.append({
            "evidence_id": e.evidence_id,
            "source_title": e.source_title,
            "source_url": e.source_url,
            "source_type": e.source_type,
            "publication_date": e.publication_date,
            "relevant_passage": e.relevant_passage,
            "relevance_score": e.relevance_score,
            "credibility_indicator": e.credibility_indicator,
            "relationship": e.relationship
        })

    # Deduplicate unique sources for the source table
    sources_dict = {}
    for ev in evidence_list:
        url = ev["source_url"]
        if url and url not in sources_dict:
            # Map type to credibility guidelines
            cred = ev["credibility_indicator"]
            notes = "Official source" if cred == "HIGH" else "Secondary news publication"
            sources_dict[url] = {
                "url": url,
                "title": ev["source_title"],
                "credibility": cred,
                "notes": notes
            }
    sources_list = list(sources_dict.values())

    return {
        "id": report_db.id,
        "title": report_db.title,
        "input_type": report_db.input_type,
        "content": report_db.content,
        "reliability_score": report_db.reliability_score,
        "score_breakdown": report_db.get_score_breakdown(),
        "verdict_counts": report_db.get_verdict_counts(),
        "overall_verdict": report_db.overall_verdict,
        "claims": claims_list,
        "evidence": evidence_list,
        "explainable_ai": report_db.get_explainable_ai(),
        "sources": sources_list
    }


@app.get("/api/report/{report_id}", response_model=api_schemas.ReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    """Retrieves an analysis report by ID. Supports demo scenario IDs out of the box."""
    # Check if this is a pre-calculated demo scenario ID
    for scenario_key, data in DEMO_SCENARIOS.items():
        if data["id"] == report_id:
            logger.info(f"Serving pre-calculated demo scenario report: {scenario_key}")
            return data

    # Lookup in Database
    report_db = db.query(database_models.Report).filter(database_models.Report.id == report_id).first()
    if not report_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found."
        )
    return format_report_db_to_schema(report_db)


@app.post("/api/analyze", response_model=api_schemas.ReportResponse)
def analyze_content(request: api_schemas.AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Main orchestration endpoint.
    Runs the entire pipeline:
    Claims -> Evidence -> RAG -> Misinformation -> Meaning Drift -> Score -> E-AI.
    Automatically detects and serves precompiled Demo Scenarios if matching.
    """
    content = request.content.strip()
    input_type = request.input_type

    # Max length guard
    if len(content) > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content length exceeds maximum limit of 10,000 characters."
        )

    # 1. Match against predefined Demo Scenarios for instantaneous high-quality presentation
    for scenario_key, data in DEMO_SCENARIOS.items():
        # Match content keywords
        demo_content = data["content"].lower()
        if content.lower()[:50] in demo_content or demo_content[:50] in content.lower():
            logger.info(f"Demo scenario match! Returning pre-computed '{scenario_key}' report.")
            # Save a copy in database under a new unique ID so it behaves like a new report
            new_id = f"report_{uuid.uuid4().hex[:10]}"
            
            # Create report object
            report_db = database_models.Report(
                id=new_id,
                title=data["title"],
                input_type=data["input_type"],
                content=content,
                reliability_score=data["reliability_score"],
                score_breakdown=json.dumps(data["score_breakdown"]),
                verdict_counts=json.dumps(data["verdict_counts"]),
                overall_verdict=data["overall_verdict"],
                explainable_ai=json.dumps(data["explainable_ai"]),
                created_at=datetime.utcnow()
            )
            db.add(report_db)
            db.commit()

            # Create claim database objects
            for c in data["claims"]:
                claim_db = database_models.Claim(
                    report_id=new_id,
                    claim_id=c["claim_id"],
                    claim_text=c["claim_text"],
                    subject=c.get("subject"),
                    action=c.get("action"),
                    object=c.get("object"),
                    factuality=c.get("factuality", "FACTUAL"),
                    checkability=c.get("checkability", "VERIFIABLE"),
                    entities=json.dumps(c.get("entities", [])),
                    decomposition=json.dumps(c.get("decomposition", {})),
                    verdict=c.get("verdict", "INSUFFICIENT_EVIDENCE"),
                    confidence=c.get("confidence", 0.0),
                    explanation=c.get("explanation"),
                    evidence_ids=json.dumps(c.get("evidence_ids", [])),
                    misinformation_pattern=json.dumps(c.get("misinformation_pattern")),
                    meaning_drift=json.dumps(c.get("meaning_drift")),
                    timeline=json.dumps(c.get("timeline"))
                )
                db.add(claim_db)

            # Create evidence database objects
            for e in data["evidence"]:
                ev_db = database_models.Evidence(
                    report_id=new_id,
                    claim_id=e.get("claim_id"),
                    evidence_id=e["evidence_id"],
                    source_title=e["source_title"],
                    source_url=e.get("source_url"),
                    source_type=e.get("source_type"),
                    publication_date=e.get("publication_date"),
                    relevant_passage=e["relevant_passage"],
                    relevance_score=e.get("relevance_score", 0.0),
                    credibility_indicator=e.get("credibility_indicator", "MEDIUM"),
                    relationship=e.get("relationship", "CONTEXTUALIZES")
                )
                db.add(ev_db)

            db.commit()
            db.refresh(report_db)
            return format_report_db_to_schema(report_db)

    # 2. Real Pipeline Execution (or Fallback Demo Mode for custom input if API keys are missing)
    logger.info(f"Executing real-time analysis pipeline for input type '{input_type}'...")
    
    # Preprocessing: URL extraction or Image OCR simulation if needed
    analysis_title = request.title or "Factual Claims Investigation"
    
    # 2A. Extract Claims
    claims_raw = claim_service.extract_and_classify_claims(content)
    
    if not claims_raw:
        # Create empty report
        report_id = f"report_{uuid.uuid4().hex[:10]}"
        report_db = database_models.Report(
            id=report_id,
            title=analysis_title,
            input_type=input_type,
            content=content,
            reliability_score=100,
            score_breakdown=json.dumps({
                "evidence_support": 100,
                "source_quality": 100,
                "context_completeness": 100,
                "claim_consistency": 100,
                "misinformation_risk": "LOW"
            }),
            verdict_counts=json.dumps({"supported": 0, "partially_supported": 0, "contradicted": 0, "insufficient_evidence": 0}),
            overall_verdict="INSUFFICIENT_EVIDENCE",
            explainable_ai=json.dumps({
                "summary": "No factual claims were identified in the provided text.",
                "what_we_found": "The text contains subjective statements or opinions.",
                "what_supports": "None",
                "what_contradicts": "None",
                "what_is_missing": "Verifiable claims.",
                "why_misleading": "N/A",
                "confidence_explanation": "Highly certain that no verifiable facts were present."
            }),
            created_at=datetime.utcnow()
        )
        db.add(report_db)
        db.commit()
        db.refresh(report_db)
        return format_report_db_to_schema(report_db)

    # 2B. Evidence Retrieval
    evidence_raw = evidence_service.get_evidence_for_claims(claims_raw)
    
    # 2C. Claim Verification (RAG)
    claims_verified = verification_service.verify_extracted_claims(claims_raw, evidence_raw)
    
    # 2D. Misinformation Detection
    claims_with_patterns = misinformation_service.detect_misinformation_patterns(claims_verified)
    
    # 2E. Meaning Drift Detection
    claims_with_drift = meaning_drift_service.analyze_meaning_drift(claims_with_patterns, evidence_raw)
    
    # 2F. Calculate Reliability Score
    score_data = scoring_service.calculate_reliability_score(claims_with_drift, evidence_raw)
    
    # Calculate verdict counts
    counts = {"supported": 0, "partially_supported": 0, "contradicted": 0, "insufficient_evidence": 0}
    for c in claims_with_drift:
        v = c.get("verdict", "INSUFFICIENT_EVIDENCE").lower()
        if v in counts:
            counts[v] += 1
            
    # Calculate overall verdict
    overall_verdict = "MOSTLY_SUPPORTED"
    if counts["contradicted"] >= 2 or score_data["reliability_score"] < 50:
        overall_verdict = "POTENTIALLY_MISLEADING"
    elif counts["contradicted"] == 1 or counts["partially_supported"] >= 1:
        overall_verdict = "MIXED"
    elif counts["insufficient_evidence"] == len(claims_with_drift):
        overall_verdict = "INSUFFICIENT_EVIDENCE"

    # 2G. Explainable AI Summary
    explainable_ai_data = llm_service.generate_explainable_ai(overall_verdict, claims_with_drift, evidence_raw)

    # 3. Save everything to Database
    report_id = f"report_{uuid.uuid4().hex[:10]}"
    report_db = database_models.Report(
        id=report_id,
        title=analysis_title,
        input_type=input_type,
        content=content,
        reliability_score=score_data["reliability_score"],
        score_breakdown=json.dumps(score_data["score_breakdown"]),
        verdict_counts=json.dumps(counts),
        overall_verdict=overall_verdict,
        explainable_ai=json.dumps(explainable_ai_data),
        created_at=datetime.utcnow()
    )
    db.add(report_db)
    db.commit()

    # Save Claims
    for c in claims_with_drift:
        claim_db = database_models.Claim(
            report_id=report_id,
            claim_id=c["claim_id"],
            claim_text=c["claim_text"],
            subject=c.get("subject"),
            action=c.get("action"),
            object=c.get("object"),
            factuality=c.get("factuality", "FACTUAL"),
            checkability=c.get("checkability", "VERIFIABLE"),
            entities=json.dumps(c.get("entities", [])),
            decomposition=json.dumps(c.get("decomposition", {})),
            verdict=c.get("verdict", "INSUFFICIENT_EVIDENCE"),
            confidence=c.get("confidence", 0.0),
            explanation=c.get("explanation"),
            evidence_ids=json.dumps(c.get("evidence_ids", [])),
            misinformation_pattern=json.dumps(c.get("misinformation_pattern")),
            meaning_drift=json.dumps(c.get("meaning_drift")),
            timeline=json.dumps(c.get("timeline"))
        )
        db.add(claim_db)

    # Save Evidence
    for e in evidence_raw:
        ev_db = database_models.Evidence(
            report_id=report_id,
            claim_id=e.get("claim_id"),
            evidence_id=e["evidence_id"],
            source_title=e["source_title"],
            source_url=e.get("source_url"),
            source_type=e.get("source_type"),
            publication_date=e.get("publication_date"),
            relevant_passage=e["relevant_passage"],
            relevance_score=e.get("relevance_score", 0.0),
            credibility_indicator=e.get("credibility_indicator", "MEDIUM"),
            relationship=e.get("relationship", "CONTEXTUALIZES")
        )
        db.add(ev_db)

    db.commit()
    db.refresh(report_db)
    
    return format_report_db_to_schema(report_db)


@app.post("/api/extract-claims")
def api_extract_claims(request: api_schemas.ExtractClaimsRequest):
    return {"claims": claim_service.extract_and_classify_claims(request.text)}


@app.post("/api/retrieve-evidence")
def api_retrieve_evidence(claims: List[Dict[str, Any]]):
    return {"evidence": evidence_service.get_evidence_for_claims(claims)}


@app.post("/api/verify-claim")
def api_verify_claim(claim: Dict[str, Any], evidence: List[Dict[str, Any]]):
    return rag_service.execute_rag_verification(claim, evidence)


@app.post("/api/analyze-misinformation")
def api_analyze_misinformation(claim: Dict[str, Any], verdict: str, explanation: str):
    return misinformation_service.get_fallback_misinformation_pattern(claim)


@app.post("/api/meaning-drift")
def api_meaning_drift(claim: Dict[str, Any], evidence: List[Dict[str, Any]]):
    return meaning_drift_service.get_fallback_meaning_drift(claim, evidence)
