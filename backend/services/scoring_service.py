import logging
from typing import List, Dict, Any

logger = logging.getLogger("newsguard.scoring_service")

def calculate_reliability_score(claims: List[Dict[str, Any]], evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates the NewsGuard Reliability Indicator (0-100) and its breakdown components.
    """
    if not claims:
        return {
            "reliability_score": 50,
            "score_breakdown": {
                "evidence_support": 50,
                "source_quality": 50,
                "context_completeness": 50,
                "claim_consistency": 50,
                "misinformation_risk": "MEDIUM"
            }
        }

    # 1. Evidence Support
    # SUPPORTED = 100, PARTIALLY_SUPPORTED = 60, INSUFFICIENT_EVIDENCE = 30, CONTRADICTED = 0
    support_sum = 0
    verifiable_claims_count = 0
    
    for claim in claims:
        if claim.get("factuality") == "FACTUAL":
            verifiable_claims_count += 1
            verdict = claim.get("verdict", "INSUFFICIENT_EVIDENCE")
            if verdict == "SUPPORTED":
                support_sum += 100
            elif verdict == "PARTIALLY_SUPPORTED":
                support_sum += 60
            elif verdict == "INSUFFICIENT_EVIDENCE":
                support_sum += 30
            elif verdict == "CONTRADICTED":
                support_sum += 0

    evidence_support = int(support_sum / verifiable_claims_count) if verifiable_claims_count > 0 else 100

    # 2. Source Quality
    # HIGH = 100, MEDIUM = 60, LOW = 20
    quality_sum = 0
    if evidence:
        for ev in evidence:
            cred = ev.get("credibility_indicator", "MEDIUM")
            if cred == "HIGH":
                quality_sum += 100
            elif cred == "MEDIUM":
                quality_sum += 60
            elif cred == "LOW":
                quality_sum += 20
        source_quality = int(quality_sum / len(evidence))
    else:
        source_quality = 50 # Default if no evidence

    # 3. Context Completeness
    # Starts at 100, deduct for missing context / meaning drift / outdated info
    context_completeness = 100
    for claim in claims:
        pattern = claim.get("misinformation_pattern")
        drift = claim.get("meaning_drift")
        
        if pattern:
            p_type = pattern.get("type", "")
            if p_type in ["Missing Context", "Context Collapse", "Outdated Information"]:
                context_completeness -= 25
        if drift:
            context_completeness -= 25
            
    context_completeness = max(10, min(100, context_completeness))

    # 4. Claim Consistency
    # Starts at 100, deduct for contradictions, exaggerations, opinions as facts
    claim_consistency = 100
    for claim in claims:
        verdict = claim.get("verdict")
        pattern = claim.get("misinformation_pattern")
        
        if verdict == "CONTRADICTED":
            claim_consistency -= 20
        if pattern:
            p_type = pattern.get("type", "")
            if p_type in ["Exaggeration", "Opinion Presented as Fact", "Numerical Manipulation", "Unsupported Causal Claim"]:
                claim_consistency -= 15
                
    claim_consistency = max(10, min(100, claim_consistency))

    # 5. Misinformation Risk
    # High risk if severe pattern or multiple contradictions
    contradicted_count = sum(1 for c in claims if c.get("verdict") == "CONTRADICTED")
    has_high_severity_pattern = any(
        (c.get("misinformation_pattern") or {}).get("severity") == "HIGH" for c in claims
    )
    
    if contradicted_count >= 2 or has_high_severity_pattern:
        misinformation_risk = "HIGH"
    elif contradicted_count == 1 or any(c.get("misinformation_pattern") is not None for c in claims):
        misinformation_risk = "MEDIUM"
    else:
        misinformation_risk = "LOW"

    # Overall Reliability Score (Weighted Average)
    # 40% Evidence Support, 25% Source Quality, 20% Context Completeness, 15% Claim Consistency
    raw_score = (
        (evidence_support * 0.40) +
        (source_quality * 0.25) +
        (context_completeness * 0.20) +
        (claim_consistency * 0.15)
    )
    
    # Adjust score downward slightly if risk is HIGH to reflect danger
    if misinformation_risk == "HIGH" and raw_score > 45:
        raw_score = raw_score * 0.85

    reliability_score = max(0, min(100, int(raw_score)))

    return {
        "reliability_score": reliability_score,
        "score_breakdown": {
            "evidence_support": evidence_support,
            "source_quality": source_quality,
            "context_completeness": context_completeness,
            "claim_consistency": claim_consistency,
            "misinformation_risk": misinformation_risk
        }
    }
