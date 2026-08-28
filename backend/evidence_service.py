import logging
import math
import re
from typing import List, Dict, Any, Optional

logger = logging.getLogger("newsguard.evidence_service")

# A small in-memory corpus representing reference documents, fact-checks, and scientific statements
# to simulate our local semantic database (used for vector search simulation)
REFERENCE_CORPUS = [
    {
        "title": "WHO Alcohol and Health Global Status Report",
        "url": "https://www.who.int/publications/alcohol-global-status-report",
        "type": "official_organization",
        "date": "2023-11-20",
        "text": "Alcohol is a toxic substance and group 1 carcinogen. There is no safe level of alcohol consumption that does not increase health risks. Heavy drinking increases risk of stroke, liver disease, and cancer.",
        "credibility": "HIGH"
    },
    {
        "title": "American Heart Association Guidelines on Drinking",
        "url": "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition/drinking-red-wine-heart-health",
        "type": "official_organization",
        "date": "2024-09-15",
        "text": "No study has proved a cause-and-effect link between drinking alcohol and better heart health. Resveratrol is found in grapes, blueberries, and peanuts, not just red wine. The AHA does not recommend drinking red wine for cardiovascular protection.",
        "credibility": "HIGH"
    },
    {
        "title": "Journal of Nutritional Biochemistry - Resveratrol Mice Study",
        "url": "https://www.jnutbio.org/article/resveratrol-mice",
        "type": "scientific_journal",
        "date": "2025-04-12",
        "text": "Mice fed high doses of pure resveratrol extract showed improved metabolic markers, weight stability, and insulin sensitivity. However, the alcohol content in red wine may offset these benefits in human diets, requiring excessive quantities to match dosage.",
        "credibility": "HIGH"
    },
    {
        "title": "WHO 5G Wireless Technology and Health Guidelines",
        "url": "https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks",
        "type": "official_organization",
        "date": "2024-02-18",
        "text": "To date, and after much research, no adverse health effect has been causally linked with exposure to wireless technologies. 5G signals operate in the non-ionizing radiofrequency bands and do not damage living tissue.",
        "credibility": "HIGH"
    },
    {
        "title": "ICNIRP RF Electromagnetic Fields Safety Levels",
        "url": "https://www.icnirp.org/en/frequencies/radiofrequency/index.html",
        "type": "peer_reviewed_research",
        "date": "2020-03-11",
        "text": "Radiofrequency frequencies used in 5G do not carry sufficient photon energy to damage DNA directly or break molecular bonds. Guidelines restrict power output to safe levels.",
        "credibility": "HIGH"
    },
    {
        "title": "Municipal Finance Board Budget Plan FY 2026-27",
        "url": "https://www.citygov.in/finance/budget-fy27",
        "type": "official_government",
        "date": "2026-04-01",
        "text": "There are no local technological user fees, and tax increases for internet connectivity are strictly prohibited by council ordinance. Smart City components are fully subsidized.",
        "credibility": "HIGH"
    },
    {
        "title": "City Council Smart Infrastructure Plan Press Kit",
        "url": "https://www.citygov.in/smart-city-press",
        "type": "official_government",
        "date": "2026-08-27",
        "text": "Mayor announced the launch of the municipal Smart City framework, deploying micro-cellular 5G nodes on city utility poles. Funded fully by national infrastructure grant and corporate space lease, requiring zero tax contribution.",
        "credibility": "HIGH"
    },
    {
        "title": "U.S. Department of State Travel advisories (2020 Archive)",
        "url": "https://travel.state.gov/content/travel/en/traveladvisories/archive/2020.html",
        "type": "official_government",
        "date": "2020-03-19",
        "text": "The Department of State advises U.S. citizens to avoid all international travel due to the global impact of COVID-19. Strict local stay-at-home orders were issued by mayors.",
        "credibility": "HIGH"
    },
    {
        "title": "DHS Travel Portal Updates (2026)",
        "url": "https://www.dhs.gov/travel-updates",
        "type": "official_government",
        "date": "2026-08-01",
        "text": "International travel routes are fully operational. Normal security and visa procedures apply. No general lock-down orders are in place, and borders are fully open.",
        "credibility": "HIGH"
    }
]

def generate_search_query(claim_text: str) -> str:
    """Uses simple heuristics or LLM to create a search query from the claim text."""
    # Clean noise words
    stop_words = {"the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to", "for", "with", "on", "in", "at", "by"}
    words = re.findall(r'\b\w+\b', claim_text.lower())
    query_words = [w for w in words if w not in stop_words]
    
    # Return top 5 terms or original text if too short
    if len(query_words) > 5:
        return " ".join(query_words[:6])
    return claim_text

def compute_cosine_similarity(text1: str, text2: str) -> float:
    """Calculates basic token-overlap cosine similarity to simulate embeddings search."""
    def get_term_freq(text: str) -> Dict[str, int]:
        words = re.findall(r'\b\w+\b', text.lower())
        tf = {}
        for w in words:
            tf[w] = tf.get(w, 0) + 1
        return tf

    tf1 = get_term_freq(text1)
    tf2 = get_term_freq(text2)
    
    intersection = set(tf1.keys()) & set(tf2.keys())
    numerator = sum([tf1[x] * tf2[x] for x in intersection])
    
    sum1 = sum([tf1[x]**2 for x in tf1.keys()])
    sum2 = sum([tf2[x]**2 for x in tf2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    
    if not denominator:
        return 0.0
    return float(numerator) / denominator

def retrieve_local_evidence(query: str, threshold: float = 0.1) -> List[Dict[str, Any]]:
    """
    Searches the local corpus for semantically relevant passages
    using token-overlap cosine similarity.
    """
    results = []
    for doc in REFERENCE_CORPUS:
        score = compute_cosine_similarity(query, doc["text"])
        # Boost score slightly if words from title match the query
        title_score = compute_cosine_similarity(query, doc["title"])
        final_score = (score * 0.7) + (title_score * 0.3)
        
        if final_score > threshold:
            results.append({
                "source_title": doc["title"],
                "source_url": doc["url"],
                "source_type": doc["type"],
                "publication_date": doc["date"],
                "relevant_passage": doc["text"],
                "relevance_score": round(final_score, 2),
                "credibility_indicator": doc["credibility"]
            })
            
    # Sort by relevance score
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return results

def retrieve_web_evidence(query: str) -> List[Dict[str, Any]]:
    """
    Simulates searching the live web using an external search API interface.
    Returns highly structured results.
    """
    # For a real system, you would call a Serper / Tavily / DuckDuckGo search here.
    # We will write a clean mock retrieval that gets triggered in Demo Mode, 
    # but still utilizes the query to keep it dynamic and generic!
    
    # Simple keyword routing to return dynamic web results based on query keywords
    query_lower = query.lower()
    
    results = []
    
    if "resveratrol" in query_lower or "wine" in query_lower:
        results.append({
            "source_title": "NIH PubMed Central - Resveratrol review",
            "source_url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6164842/",
            "source_type": "peer_reviewed_research",
            "publication_date": "2018-09-11",
            "relevant_passage": "Resveratrol clinical studies show high clearance in the liver. Drinking red wine provides minor concentrations of resveratrol, which are insufficient to exert pharmacological actions.",
            "relevance_score": 0.85,
            "credibility_indicator": "HIGH"
        })
    elif "lockdown" in query_lower or "travel" in query_lower:
        results.append({
            "source_title": "USA Today - Covid restrictions timeline",
            "source_url": "https://www.usatoday.com/covid-travel-archive",
            "source_type": "established_news",
            "publication_date": "2021-12-05",
            "relevant_passage": "The US travel restrictions on international entries started in March 2020 and were gradually lifted by early 2022. No lockdown exists in 2026.",
            "relevance_score": 0.88,
            "credibility_indicator": "MEDIUM"
        })
    elif "5g" in query_lower or "radiation" in query_lower or "dna" in query_lower:
        results.append({
            "source_title": "Cancer Research UK - 5G and health myths",
            "source_url": "https://www.cancerresearchuk.org/about-cancer/causes-of-cancer/cancer-myths/5g-and-health",
            "source_type": "official_organization",
            "publication_date": "2025-01-10",
            "relevant_passage": "RF signals used for 5G are far below the safety limit. There is no biological mechanism for 5G radiation to cause mutations or DNA damage.",
            "relevance_score": 0.89,
            "credibility_indicator": "HIGH"
        })
    else:
        # Generic web search result based on query terms
        terms = query.split()[:3]
        term_str = " ".join(terms) if terms else "Current events"
        results.append({
            "source_title": f"Web Search - News regarding {term_str}",
            "source_url": "https://news.google.com/search?q=" + "+".join(terms),
            "source_type": "established_news",
            "publication_date": "2026-08-28",
            "relevant_passage": f"Articles online referencing '{query}' suggest varying viewpoints, but no official national declaration confirms the viral claim.",
            "relevance_score": 0.50,
            "credibility_indicator": "MEDIUM"
        })
        
    return results

def get_evidence_for_claims(claims: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Gathers both local semantic and web evidence for each claim."""
    all_evidence = []
    evidence_id_counter = 1
    
    # To prevent duplicate evidence nodes, keep track of URLs
    seen_urls = set()
    
    for claim in claims:
        query = generate_search_query(claim["claim_text"])
        
        # 1. Local Search
        local_results = retrieve_local_evidence(query)
        # 2. Web Search
        web_results = retrieve_web_evidence(query)
        
        claim_evidence = local_results + web_results
        
        # Link evidence to claim and assign unique ID
        claim_evidence_ids = []
        for ev in claim_evidence:
            url = ev.get("source_url")
            
            # De-duplicate identical source passages
            if url and url in seen_urls:
                # Find the existing evidence ID
                existing = next((x for x in all_evidence if x["source_url"] == url), None)
                if existing:
                    claim_evidence_ids.append(existing["evidence_id"])
                    continue
            
            ev_id = f"ev_{evidence_id_counter}"
            evidence_id_counter += 1
            ev["evidence_id"] = ev_id
            ev["claim_id"] = claim["claim_id"]
            
            if url:
                seen_urls.add(url)
                
            all_evidence.append(ev)
            claim_evidence_ids.append(ev_id)
            
        claim["evidence_ids"] = claim_evidence_ids
        
    return all_evidence
