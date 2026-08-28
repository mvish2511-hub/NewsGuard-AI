import logging
from typing import List, Dict, Any
from backend.services import rag_service

logger = logging.getLogger("newsguard.verification_service")

def verify_extracted_claims(claims: List[Dict[str, Any]], evidence_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Verifies all claims against the retrieved evidence list.
    """
    verified_claims = []
    
    for claim in claims:
        logger.info(f"Verifying claim: {claim['claim_text']}")
        
        # Verify the claim using RAG
        verdict_data = rag_service.execute_rag_verification(claim, evidence_list)
        
        # Update claim with verdict information
        claim.update({
            "verdict": verdict_data["verdict"],
            "confidence": verdict_data["confidence"],
            "explanation": verdict_data["explanation"],
            "supporting_evidence_ids": verdict_data.get("supporting_evidence_ids", []),
            "contradicting_evidence_ids": verdict_data.get("contradicting_evidence_ids", []),
            "contextual_evidence_ids": verdict_data.get("contextual_evidence_ids", [])
        })
        
        verified_claims.append(claim)
        
    return verified_claims
