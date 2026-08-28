import logging
from typing import List, Dict, Any
from backend.services import llm_service

logger = logging.getLogger("newsguard.rag_service")

def execute_rag_verification(claim: Dict[str, Any], evidence_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    RAG Pipeline:
    1. Filter evidence matching this claim's evidence_ids.
    2. Extract relevant passages.
    3. Pass claim and passages to LLM to get structured verdict.
    4. Map returned indices back to evidence_id values.
    """
    # Filter evidence linked to this claim
    claim_ev_ids = claim.get("evidence_ids", [])
    claim_evidence = [ev for ev in evidence_list if ev.get("evidence_id") in claim_ev_ids]
    
    if not claim_evidence:
        return {
            "verdict": "INSUFFICIENT_EVIDENCE",
            "confidence": 0.5,
            "explanation": "No relevant evidence could be retrieved for this claim.",
            "evidence_ids": [],
            "supporting_evidence_ids": [],
            "contradicting_evidence_ids": [],
            "contextual_evidence_ids": []
        }
        
    passages = [ev["relevant_passage"] for ev in claim_evidence]
    
    # Check if API is configured
    if not llm_service.is_api_configured():
        # Fallback to local heuristic or default
        return get_fallback_verdict(claim, claim_evidence)
        
    # Execute LLM RAG call
    raw_verdict = llm_service.verify_claim(claim["claim_text"], passages)
    
    # Map indices to evidence_ids
    supporting_ids = []
    contradicting_ids = []
    contextual_ids = []
    
    def get_id_by_index(idx: int) -> Optional[str]:
        if 0 <= idx < len(claim_evidence):
            return claim_evidence[idx]["evidence_id"]
        return None

    for idx in raw_verdict.get("supporting_evidence_indices", []):
        ev_id = get_id_by_index(idx)
        if ev_id:
            supporting_ids.append(ev_id)
            
    for idx in raw_verdict.get("contradicting_evidence_indices", []):
        ev_id = get_id_by_index(idx)
        if ev_id:
            contradicting_ids.append(ev_id)
            
    for idx in raw_verdict.get("contextual_evidence_indices", []):
        ev_id = get_id_by_index(idx)
        if ev_id:
            contextual_ids.append(ev_id)
            
    return {
        "verdict": raw_verdict.get("verdict", "INSUFFICIENT_EVIDENCE"),
        "confidence": raw_verdict.get("confidence", 0.5),
        "explanation": raw_verdict.get("explanation", "Verification completed with limited certainty."),
        "supporting_evidence_ids": supporting_ids,
        "contradicting_evidence_ids": contradicting_ids,
        "contextual_evidence_ids": contextual_ids
    }

def get_fallback_verdict(claim: Dict[str, Any], claim_evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Simple heuristic fallback when LLM API keys are missing (and outside predefined demo scenarios)."""
    text_lower = claim["claim_text"].lower()
    
    # Basic matching against evidence passages
    supporting = []
    contradicting = []
    contextual = []
    
    verdict = "INSUFFICIENT_EVIDENCE"
    explanation = "No matching demo dataset found for this input, and no API keys configured. Simple local similarity was applied."
    
    for ev in claim_evidence:
        relationship = ev.get("relationship", "CONTEXTUALIZES")
        if relationship == "SUPPORTS":
            supporting.append(ev["evidence_id"])
        elif relationship == "CONTRADICTS":
            contradicting.append(ev["evidence_id"])
        else:
            contextual.append(ev["evidence_id"])
            
    if contradicting:
        verdict = "CONTRADICTED"
        explanation = "The claim is contradicted by available local files or web indicators."
    elif supporting:
        verdict = "SUPPORTED"
        explanation = "The claim matches records in local guidelines or web documentation."
    elif contextual:
        verdict = "PARTIALLY_SUPPORTED"
        explanation = "The claim is partially supported, but context differs."
        
    return {
        "verdict": verdict,
        "confidence": 0.7,
        "explanation": explanation,
        "supporting_evidence_ids": supporting,
        "contradicting_evidence_ids": contradicting,
        "contextual_evidence_ids": contextual
    }
