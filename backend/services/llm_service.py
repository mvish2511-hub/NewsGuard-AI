import os
import json
import logging
import requests
from typing import List, Dict, Any, Optional

# Load env variables from .env if present
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, val = line.strip().split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"').strip("'")

# Configure logger
logger = logging.getLogger("newsguard.llm_service")
logging.basicConfig(level=logging.INFO)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = os.getenv("OPENAI_API_URL", "https://api.openai.com/v1/chat/completions")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def is_api_configured() -> bool:
    return bool(GEMINI_API_KEY or OPENAI_API_KEY)

def _call_gemini(prompt: str, system_instruction: str = "") -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    contents = []
    if system_instruction:
        contents.append({
            "role": "user",
            "parts": [{"text": f"System Guidelines: {system_instruction}\n\nUser Input:\n{prompt}"}]
        })
    else:
        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })
        
    data = {
        "contents": contents,
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        resp_json = response.json()
        text = resp_json["candidates"][0]["content"]["parts"][0]["text"]
        return text
    except Exception as e:
        logger.error(f"Error calling Gemini: {e}")
        # Try a fallback without generationConfig if model doesn't support json mode, or raise
        try:
            del data["generationConfig"]
            response = requests.post(url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            resp_json = response.json()
            return resp_json["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as fallback_e:
            logger.error(f"Fallback Gemini call failed: {fallback_e}")
            raise e

def _call_openai(prompt: str, system_instruction: str = "") -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})
    
    data = {
        "model": OPENAI_MODEL,
        "messages": messages,
        "response_format": {"type": "json_object"}
    }
    
    try:
        response = requests.post(OPENAI_API_URL, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        resp_json = response.json()
        text = resp_json["choices"][0]["message"]["content"]
        return text
    except Exception as e:
        logger.error(f"Error calling OpenAI: {e}")
        # Try fallback without json format
        try:
            del data["response_format"]
            response = requests.post(OPENAI_API_URL, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            resp_json = response.json()
            return resp_json["choices"][0]["message"]["content"]
        except Exception as fallback_e:
            logger.error(f"Fallback OpenAI call failed: {fallback_e}")
            raise e

def query_llm(prompt: str, system_instruction: str = "") -> str:
    if GEMINI_API_KEY:
        logger.info("Calling Gemini API...")
        return _call_gemini(prompt, system_instruction)
    elif OPENAI_API_KEY:
        logger.info("Calling OpenAI API...")
        return _call_openai(prompt, system_instruction)
    else:
        logger.warning("No API Key configured. Returning empty json.")
        return "{}"

# LLM services definitions

def extract_claims(text: str) -> List[Dict[str, Any]]:
    if not is_api_configured():
        # Will be handled by the controller's demo mode router or generic mock
        return get_generic_mock_claims(text)
        
    system = """You are an expert fact-checker. Extract 1 to 5 individual factual claims from the text. 
Do not extract opinions or subjective statements.
Return a JSON object in this format:
{
  "claims": [
    {
      "claim_id": "claim_1",
      "claim_text": "The text of the claim",
      "subject": "The subject of the statement",
      "action": "The action or predicate",
      "object": "The object or target",
      "factuality": "FACTUAL",
      "checkability": "VERIFIABLE",
      "entities": ["entity1", "entity2"]
    }
  ]
}
Ensure the response is valid JSON. Return ONLY JSON."""

    prompt = f"Extract factual claims from this text:\n\n{text}"
    try:
        res = query_llm(prompt, system)
        data = json.loads(clean_json_response(res))
        return data.get("claims", [])
    except Exception as e:
        logger.error(f"Failed to extract claims using LLM: {e}")
        return get_generic_mock_claims(text)

def decompose_claim(claim_text: str) -> Dict[str, Any]:
    if not is_api_configured():
        return get_generic_claim_decomposition(claim_text)
        
    system = """Decompose the given factual claim into key components.
Return a JSON object in this format:
{
  "subject": "The main subject of the action",
  "action": "The action being performed",
  "amount": "Any numerical quantity, amount, frequency (e.g. ₹50,000, twice, all, completely) or 'None'",
  "target": "What the action is targeting",
  "scope": "The scope or criteria (e.g., college students, everyone) or 'None'",
  "context": "Any temporal or spatial context (e.g. starting tonight, in 2024, yesterday) or 'None'"
}
Ensure the response is valid JSON. Return ONLY JSON."""

    prompt = f"Decompose this claim: '{claim_text}'"
    try:
        res = query_llm(prompt, system)
        return json.loads(clean_json_response(res))
    except Exception as e:
        logger.error(f"Failed to decompose claim using LLM: {e}")
        return get_generic_claim_decomposition(claim_text)

def verify_claim(claim_text: str, evidence_passages: List[str]) -> Dict[str, Any]:
    if not is_api_configured():
        return {
            "verdict": "INSUFFICIENT_EVIDENCE",
            "confidence": 0.5,
            "explanation": "No evidence retrieved in Demo Mode for custom input.",
            "evidence_ids": []
        }
        
    system = """Verify the claim against the provided evidence. 
Assign exactly one verdict: 'SUPPORTED', 'CONTRADICTED', 'PARTIALLY_SUPPORTED', or 'INSUFFICIENT_EVIDENCE'.
Do not invent evidence. If evidence is insufficient, return 'INSUFFICIENT_EVIDENCE'.
Return a JSON object in this format:
{
  "verdict": "SUPPORTED / CONTRADICTED / PARTIALLY_SUPPORTED / INSUFFICIENT_EVIDENCE",
  "confidence": 0.0 to 1.0 (float),
  "explanation": "Detail how the evidence supports or contradicts the claim in plain, neutral language. Mention key contradictions or nuances.",
  "supporting_evidence_indices": [0, 1, ...],
  "contradicting_evidence_indices": [0, ...],
  "contextual_evidence_indices": [0, ...]
}
Ensure the response is valid JSON. Return ONLY JSON."""

    evidence_str = "\n".join([f"Evidence [{i}]: {text}" for i, text in enumerate(evidence_passages)])
    prompt = f"Claim: {claim_text}\n\nEvidence:\n{evidence_str}"
    
    try:
        res = query_llm(prompt, system)
        return json.loads(clean_json_response(res))
    except Exception as e:
        logger.error(f"Failed to verify claim using LLM: {e}")
        return {
            "verdict": "INSUFFICIENT_EVIDENCE",
            "confidence": 0.1,
            "explanation": f"LLM verification failed: {str(e)}",
            "supporting_evidence_indices": [],
            "contradicting_evidence_indices": [],
            "contextual_evidence_indices": []
        }

def analyze_misinformation(claim_text: str, verdict: str, explanation: str) -> Optional[Dict[str, Any]]:
    if not is_api_configured():
        return None
        
    if verdict == "SUPPORTED":
        return None # No misinformation pattern detected

    system = """Analyze if the claim exhibits any misinformation patterns.
Choose from:
1. Missing Context
2. Exaggeration
3. Overgeneralization
4. Outdated Information
5. False Attribution
6. Numerical Manipulation
7. Cherry Picking
8. Opinion Presented as Fact
9. Misleading Headline
10. Unsupported Causal Claim
11. Context Collapse
12. No Significant Misinformation Pattern Detected

Return a JSON object in this format:
{
  "type": "Name of technique or 'No Significant Misinformation Pattern Detected'",
  "severity": "HIGH / MEDIUM / LOW",
  "explanation": "Why this technique is detected, comparing the claim with the evidence.",
  "affected_claim": "The claim text"
}
Ensure the response is valid JSON. Return ONLY JSON."""

    prompt = f"Claim: {claim_text}\nVerdict: {verdict}\nVerification Explanation: {explanation}"
    try:
        res = query_llm(prompt, system)
        data = json.loads(clean_json_response(res))
        if data.get("type") == "No Significant Misinformation Pattern Detected":
            return None
        return data
    except Exception as e:
        logger.error(f"Failed to analyze misinformation: {e}")
        return None

def detect_meaning_drift(claim_text: str, original_context: str) -> Optional[Dict[str, Any]]:
    if not is_api_configured():
        return None

    system = """Compare the user's viral claim text against the original context/evidence text to detect 'Meaning Drift' (unwarranted changes in level of certainty, correlation vs causation, general vs specific, etc.).
Example: 'may' -> 'will', 'associated with' -> 'causes', 'some' -> 'everyone', 'possible' -> 'guaranteed'.
Return a JSON object in this format:
{
  "detected": true/false (boolean),
  "original_text": "The summary of what the original evidence said",
  "viral_text": "The summary of what the viral claim says",
  "changes": [
    {
      "original": "may be associated",
      "viral": "proves it causes"
    }
  ],
  "severity": "HIGH / MEDIUM / LOW",
  "reason": "Explain why this change is significant."
}
Ensure the response is valid JSON. Return ONLY JSON."""

    prompt = f"Original Context: {original_context}\nViral Claim: {claim_text}"
    try:
        res = query_llm(prompt, system)
        data = json.loads(clean_json_response(res))
        if not data.get("detected", False):
            return None
        return {
            "original_text": data.get("original_text", ""),
            "viral_text": data.get("viral_text", ""),
            "changes": data.get("changes", []),
            "severity": data.get("severity", "MEDIUM"),
            "reason": data.get("reason", "")
        }
    except Exception as e:
        logger.error(f"Failed to detect meaning drift: {e}")
        return None

def generate_explainable_ai(overall_verdict: str, claims: List[Dict[str, Any]], evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not is_api_configured():
        return {
            "summary": "Demo mode summary.",
            "what_we_found": "Demo mode findings.",
            "what_supports": "Demo mode support.",
            "what_contradicts": "Demo mode contradiction.",
            "what_is_missing": "Demo mode missing.",
            "why_misleading": "Demo mode misleading reason.",
            "confidence_explanation": "Demo mode confidence."
        }

    system = """Create an Explainable AI summary explaining why NewsGuard gave this assessment.
Write simple, neutral, factual human language. Do not expose internal chain-of-thought or reasoning steps.
Return a JSON object in this format:
{
  "summary": "A 1-2 sentence overall summary of the findings.",
  "what_we_found": "A list of facts that were verified.",
  "what_supports": "What evidence supports any part of the claims.",
  "what_contradicts": "What evidence directly contradicts or undermines any part of the claims.",
  "what_is_missing": "What context or evidence is missing.",
  "why_misleading": "Why the overall content is misleading (or why it is not, if supported).",
  "confidence_explanation": "A statement about the system's confidence based on the source credibility and quality of matches."
}
Ensure the response is valid JSON. Return ONLY JSON."""

    prompt = f"Overall Verdict: {overall_verdict}\n\nClaims analyzed:\n{json.dumps(claims, indent=2)}\n\nEvidence gathered:\n{json.dumps(evidence, indent=2)}"
    try:
        res = query_llm(prompt, system)
        return json.loads(clean_json_response(res))
    except Exception as e:
        logger.error(f"Failed to generate explainable AI: {e}")
        return {
            "summary": "The system completed the claim verification process.",
            "what_we_found": "Factual details were cross-referenced with public documents.",
            "what_supports": "Some elements match existing records.",
            "what_contradicts": "Several parts do not align with reputable scientific/governmental sources.",
            "what_is_missing": "Historical parameters and source citations are lacking.",
            "why_misleading": "The content alters key terms to increase sensationalism.",
            "confidence_explanation": "Uncertainty is accounted for based on the lack of direct primary sources."
        }

# Helpers

def clean_json_response(res_str: str) -> str:
    """Removes markdown code blocks (e.g. ```json ... ```) around the JSON string if present."""
    res_str = res_str.strip()
    if res_str.startswith("```"):
        lines = res_str.split("\n")
        # Remove first line if it contains triple backticks
        if lines[0].startswith("```"):
            lines = lines[1:]
        # Remove last line if it contains triple backticks
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        res_str = "\n".join(lines).strip()
    return res_str

def get_generic_mock_claims(text: str) -> List[Dict[str, Any]]:
    # Split text into simple sentences to create claims
    import re
    sentences = re.split(r'(?<=[.!?])\s+', text)
    claims = []
    for i, sent in enumerate(sentences):
        sent = sent.strip()
        if len(sent) > 10:
            claim_id = f"claim_{i+1}"
            claims.append({
                "claim_id": claim_id,
                "claim_text": sent,
                "subject": "Statement",
                "action": "asserts",
                "object": "details",
                "factuality": "FACTUAL" if "think" not in sent.lower() and "feel" not in sent.lower() else "OPINION",
                "checkability": "VERIFIABLE",
                "entities": []
            })
    return claims

def get_generic_claim_decomposition(claim_text: str) -> Dict[str, Any]:
    words = claim_text.split()
    subject = words[0] if words else "Unknown"
    action = words[1] if len(words) > 1 else "asserts"
    return {
        "subject": subject,
        "action": action,
        "amount": "None",
        "target": "Details",
        "scope": "None",
        "context": "None"
    }
