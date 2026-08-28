import logging
from typing import List, Dict, Any
from backend.services import llm_service

logger = logging.getLogger("newsguard.claim_service")

# Try to load spacy, but handle fallback if not installed or model not loaded
nlp = None
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
        logger.info("spaCy en_core_web_sm loaded successfully.")
    except IOError:
        logger.warning("spaCy model 'en_core_web_sm' not found. spaCy fallback will be used.")
except ImportError:
    logger.warning("spaCy package not found. Regex and LLM based parsing will be used.")


def extract_and_classify_claims(text: str) -> List[Dict[str, Any]]:
    """
    Extracts individual factual claims from a block of text, classifies them as FACT vs OPINION,
    and returns a structured list of claims.
    """
    if not text.strip():
        return []

    # First, use LLM if configured as it provides advanced claims extraction
    if llm_service.is_api_configured():
        claims = llm_service.extract_claims(text)
        # Verify factuality classification and enrich
        for claim in claims:
            # classify fact/opinion
            claim["factuality"] = classify_fact_vs_opinion(claim["claim_text"])
            # Decompose the claim
            claim["decomposition"] = llm_service.decompose_claim(claim["claim_text"])
        return claims

    # Fallback to local regex/sentence parsing (Demo Mode uses pre-built scenario results, so this is for custom user text in demo mode)
    logger.info("Using local NLP claim extraction...")
    raw_claims = llm_service.get_generic_mock_claims(text)
    
    for claim in raw_claims:
        # Extract entities using spaCy if available
        if nlp:
            doc = nlp(claim["claim_text"])
            claim["entities"] = [ent.text for ent in doc.ents]
        else:
            claim["entities"] = []
            
        claim["factuality"] = classify_fact_vs_opinion(claim["claim_text"])
        claim["decomposition"] = llm_service.get_generic_claim_decomposition(claim["claim_text"])
        
    return raw_claims


def classify_fact_vs_opinion(claim_text: str) -> str:
    """
    Classify statements as:
    - FACTUAL
    - OPINION
    """
    opinion_indicators = [
        "i think", "i believe", "in my opinion", "excellent", "worst", "best",
        "should", "ought to", "amazing", "terrible", "feel like", "i suggest"
    ]
    text_lower = claim_text.lower()
    
    # Simple rule based check first
    for indicator in opinion_indicators:
        if indicator in text_lower:
            return "OPINION"
            
    # Check verbs using spaCy if available
    if nlp:
        doc = nlp(claim_text)
        for token in doc:
            # modal verbs like should, must, might can indicate opinions or recommendations
            if token.tag_ == "MD" and token.text.lower() in ["should", "must", "ought", "would"]:
                return "OPINION"
                
    return "FACTUAL"
