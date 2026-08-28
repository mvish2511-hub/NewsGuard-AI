import logging
from typing import List, Dict, Any, Optional
from backend.services import llm_service

logger = logging.getLogger("newsguard.meaning_drift_service")

def analyze_meaning_drift(claims: List[Dict[str, Any]], evidence_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Compares the original / evidence-based information against the user's claim to detect shifts in meaning.
    Adds a 'meaning_drift' dictionary to each claim where applicable.
    """
    for claim in claims:
        # Meaning drift is analyzed for CONTRADICTED or PARTIALLY_SUPPORTED claims
        if claim.get("verdict") in ["CONTRADICTED", "PARTIALLY_SUPPORTED"]:
            # Combine the relevant evidence passages as the original reference
            claim_ev_ids = claim.get("evidence_ids", [])
            claim_evidence = [ev for ev in evidence_list if ev.get("evidence_id") in claim_ev_ids]
            
            if not claim_evidence:
                claim["meaning_drift"] = None
                continue
                
            original_context = "\n".join([ev["relevant_passage"] for ev in claim_evidence])
            
            if llm_service.is_api_configured():
                drift = llm_service.detect_meaning_drift(claim["claim_text"], original_context)
                claim["meaning_drift"] = drift
            else:
                claim["meaning_drift"] = get_fallback_meaning_drift(claim, claim_evidence)
        else:
            claim["meaning_drift"] = None
            
    return claims

def get_fallback_meaning_drift(claim: Dict[str, Any], claim_evidence: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Local heuristic fallback for meaning drift detection."""
    claim_text = claim["claim_text"].lower()
    evidence_text = "\n".join([ev["relevant_passage"].lower() for ev in claim_evidence])
    
    changes = []
    
    # 1. Look for shift from may -> will or association -> causation
    if "causes" in claim_text or "completely" in claim_text or "prevents" in claim_text:
        if "may" in evidence_text or "associate" in evidence_text or "potential" in evidence_text:
            changes.append({
                "original": "may be associated with / potential benefits",
                "viral": "proves / completely prevents / causes"
            })
            
    # 2. Look for shift from specific to universal (some -> everyone)
    if "everyone" in claim_text or "all" in claim_text:
        if "mice" in evidence_text or "limited" in evidence_text or "some" in evidence_text:
            changes.append({
                "original": "tested in mice / subset / specific context",
                "viral": "everyone / universal application"
            })
            
    if changes:
        return {
            "original_text": "Evidence shows localized, qualified, or conditional findings.",
            "viral_text": claim["claim_text"],
            "changes": changes,
            "severity": "HIGH" if len(changes) > 1 or "causes" in claim_text else "MEDIUM",
            "reason": "The claim removes scientific modifiers, turning cautious associations into factual certainties."
        }
        
    return None
