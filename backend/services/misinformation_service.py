import logging
from typing import List, Dict, Any, Optional
from backend.services import llm_service

logger = logging.getLogger("newsguard.misinformation_service")

def detect_misinformation_patterns(claims: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes claims that are not fully SUPPORTED to identify any misinformation patterns or techniques.
    """
    for claim in claims:
        verdict = claim.get("verdict")
        
        # We only check for patterns if the claim is contradicted, partially supported or insufficient evidence
        if verdict in ["CONTRADICTED", "PARTIALLY_SUPPORTED", "INSUFFICIENT_EVIDENCE"]:
            if llm_service.is_api_configured():
                pattern = llm_service.analyze_misinformation(
                    claim["claim_text"], 
                    verdict, 
                    claim.get("explanation", "")
                )
                claim["misinformation_pattern"] = pattern
            else:
                # Local heuristic fallback for non-API custom inputs
                claim["misinformation_pattern"] = get_fallback_misinformation_pattern(claim)
        else:
            claim["misinformation_pattern"] = None
            
    return claims

def get_fallback_misinformation_pattern(claim: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Local fallback pattern heuristic based on keywords and verdict."""
    verdict = claim.get("verdict")
    text = claim["claim_text"].lower()
    
    if verdict == "CONTRADICTED":
        if any(w in text for w in ["completely", "prevent", "cure", "guarantees", "always", "never", "everyone"]):
            return {
                "type": "Exaggeration",
                "severity": "HIGH",
                "explanation": "The claim uses absolute or exaggerated terms not backed by moderate scientific findings.",
                "affected_claim": claim["claim_text"]
            }
        elif any(w in text for w in ["bribe", "steal", "illegal", "corrupt", "conspiracy"]):
            return {
                "type": "False Attribution",
                "severity": "HIGH",
                "explanation": "Criminal allegations are stated without primary legal or auditing sources.",
                "affected_claim": claim["claim_text"]
            }
        else:
            return {
                "type": "Unsupported Causal Claim",
                "severity": "HIGH",
                "explanation": "The claim asserts a factual link that contradicts standard public databases.",
                "affected_claim": claim["claim_text"]
            }
            
    elif verdict == "PARTIALLY_SUPPORTED":
        return {
            "type": "Missing Context",
            "severity": "MEDIUM",
            "explanation": "The claim represents a partial truth but excludes key contextual qualifiers (e.g. animal trials vs human trials).",
            "affected_claim": claim["claim_text"]
        }
        
    return None
