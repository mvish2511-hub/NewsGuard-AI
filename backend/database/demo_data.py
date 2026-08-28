# Demo datasets for NewsGuard AI

DEMO_SCENARIOS = {
    "scientific_exaggeration": {
        "id": "demo_sci_exag",
        "title": "Exaggerated Scientific Claim (Resveratrol in Red Wine)",
        "input_type": "text",
        "content": "A sensational new study proves that drinking red wine completely prevents type-2 diabetes and heart disease, meaning everyone should drink two glasses daily.",
        "reliability_score": 38,
        "score_breakdown": {
            "evidence_support": 25,
            "source_quality": 60,
            "context_completeness": 30,
            "claim_consistency": 40,
            "misinformation_risk": "HIGH"
        },
        "verdict_counts": {
            "supported": 0,
            "partially_supported": 1,
            "contradicted": 1,
            "insufficient_evidence": 1
        },
        "overall_verdict": "POTENTIALLY_MISLEADING",
        "claims": [
            {
                "claim_id": "claim_1",
                "claim_text": "A new study was conducted on the effects of red wine.",
                "subject": "study",
                "action": "was conducted",
                "object": "effects of red wine",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["study", "red wine"],
                "decomposition": {
                    "subject": "Researchers / Scientists",
                    "action": "conducted a study",
                    "amount": "1 study",
                    "target": "resveratrol / red wine health effects",
                    "scope": "clinical or observational scope",
                    "context": "Published in medical journal"
                },
                "verdict": "PARTIALLY_SUPPORTED",
                "confidence": 0.85,
                "explanation": "While studies on resveratrol (found in red wine) exist, the claim implies the new study directly shows simple red wine consumption in humans is safe and effective, whereas the actual study was in vitro and on mice.",
                "evidence_ids": ["ev_1", "ev_2"],
                "misinformation_pattern": {
                    "type": "Missing Context",
                    "severity": "MEDIUM",
                    "explanation": "The study was conducted on mice using highly concentrated doses of resveratrol, not on humans drinking normal quantities of red wine.",
                    "affected_claim": "A new study was conducted on the effects of red wine."
                },
                "meaning_drift": {
                    "original_text": "Scientists tested pure resveratrol on mice models.",
                    "viral_text": "A new study was conducted on the effects of red wine (implying human consumption).",
                    "changes": [
                        {"original": "resveratrol on mice", "viral": "red wine"}
                    ],
                    "severity": "MEDIUM",
                    "reason": "Equates highly concentrated compound tested in mice directly to standard red wine."
                },
                "timeline": [
                    {
                        "year": "2025",
                        "title": "Laboratory Study",
                        "description": "Researchers publish findings on resveratrol in mice, showing improved insulin sensitivity.",
                        "verdict_drift": "Original finding: Lab conditions, mice, no wine involved."
                    },
                    {
                        "year": "2026",
                        "title": "Viral Social Media Post",
                        "description": "Claim emerges that drinking red wine prevents diabetes.",
                        "verdict_drift": "Viral distortion: Human drinking recommended."
                    }
                ]
            },
            {
                "claim_id": "claim_2",
                "claim_text": "Red wine completely prevents type-2 diabetes and heart disease.",
                "subject": "red wine",
                "action": "completely prevents",
                "object": "type-2 diabetes and heart disease",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["red wine", "type-2 diabetes", "heart disease"],
                "decomposition": {
                    "subject": "Red wine",
                    "action": "completely prevents",
                    "amount": "100% prevention (completely)",
                    "target": "type-2 diabetes and heart disease",
                    "scope": "everyone / general public",
                    "context": "Clinical claim"
                },
                "verdict": "CONTRADICTED",
                "confidence": 0.95,
                "explanation": "Epidemiological studies show moderate association with health benefits, but clinical consensus is clear: red wine does NOT completely prevent these diseases. High consumption actually increases heart disease risks.",
                "evidence_ids": ["ev_2", "ev_3"],
                "misinformation_pattern": {
                    "type": "Exaggeration",
                    "severity": "HIGH",
                    "explanation": "Alters 'associated with minor reduction in risk' to 'completely prevents'.",
                    "affected_claim": "Red wine completely prevents type-2 diabetes and heart disease."
                },
                "meaning_drift": {
                    "original_text": "Red wine is associated with a potential modest reduction in risk.",
                    "viral_text": "Red wine completely prevents diabetes.",
                    "changes": [
                        {"original": "associated with modest risk reduction", "viral": "completely prevents"}
                    ],
                    "severity": "HIGH",
                    "reason": "Exaggerates statistical association into guaranteed prevention."
                }
            },
            {
                "claim_id": "claim_3",
                "claim_text": "Everyone should drink two glasses of red wine daily.",
                "subject": "everyone",
                "action": "should drink",
                "object": "two glasses of red wine daily",
                "factuality": "OPINION",
                "checkability": "NOT_CHECKABLE",
                "entities": ["everyone", "two glasses", "daily"],
                "decomposition": {
                    "subject": "everyone",
                    "action": "should drink daily",
                    "amount": "two glasses",
                    "target": "general population",
                    "scope": "universal recommendation",
                    "context": "Health advice"
                },
                "verdict": "INSUFFICIENT_EVIDENCE",
                "confidence": 0.90,
                "explanation": "Medical organizations (like the AHA) do not recommend drinking alcohol for health benefits. Presenting this recommendation as a medical consensus is misleading.",
                "evidence_ids": ["ev_3"],
                "misinformation_pattern": {
                    "type": "Opinion Presented as Fact",
                    "severity": "MEDIUM",
                    "explanation": "Suggests a subjective lifestyle recommendation as a scientifically backed medical imperative.",
                    "affected_claim": "Everyone should drink two glasses of red wine daily."
                }
            }
        ],
        "evidence": [
            {
                "evidence_id": "ev_1",
                "source_title": "Journal of Nutritional Biochemistry",
                "source_url": "https://www.jnutbio.org/article/resveratrol-mice",
                "source_type": "scientific_journal",
                "publication_date": "2025-04-12",
                "relevant_passage": "Mice fed high doses of pure resveratrol extract showed improved metabolic markers, though alcohol content in wine may offset these benefits in human diets.",
                "relevance_score": 0.92,
                "credibility_indicator": "HIGH",
                "relationship": "CONTEXTUALIZES"
            },
            {
                "evidence_id": "ev_2",
                "source_title": "American Heart Association Guidelines",
                "source_url": "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition/drinking-red-wine-heart-health",
                "source_type": "official_organization",
                "publication_date": "2024-09-15",
                "relevant_passage": "No study has proved a cause-and-effect link between drinking alcohol and better heart health. Resveratrol is found in grapes, blueberries, and peanuts, not just red wine.",
                "relevance_score": 0.89,
                "credibility_indicator": "HIGH",
                "relationship": "CONTRADICTS"
            },
            {
                "evidence_id": "ev_3",
                "source_title": "WHO Alcohol and Health Global Status Report",
                "source_url": "https://www.who.int/publications/alcohol-global-status-report",
                "source_type": "official_organization",
                "publication_date": "2023-11-20",
                "relevant_passage": "Alcohol is a toxic substance and group 1 carcinogen. There is no safe level of alcohol consumption that does not increase health risks.",
                "relevance_score": 0.85,
                "credibility_indicator": "HIGH",
                "relationship": "CONTRADICTS"
            }
        ],
        "explainable_ai": {
            "summary": "This claim is misleading because it exaggerates animal laboratory findings into universal health advice for humans.",
            "what_we_found": "A laboratory study on mice found benefits in resveratrol, but medical organizations warn against drinking red wine as a health supplement.",
            "what_supports": "Resveratrol (found in red wine) does have antioxidant properties linked to cell health in animal studies.",
            "what_contradicts": "WHO and AHA guidelines warn that alcohol carries substantial risks and does not prevent diabetes or cardiovascular disease.",
            "what_is_missing": "Human clinical trials testing red wine drinking are non-existent, and the study didn't test actual red wine.",
            "why_misleading": "It changes 'resveratrol in mice' to 'red wine for everyone' and 'potential risk reduction' to 'complete prevention'.",
            "confidence_explanation": "Based on high-credibility medical consensus databases, the confidence that the viral advice is contradicted is 95%."
        },
        "sources": [
            {
                "url": "https://www.jnutbio.org/article/resveratrol-mice",
                "title": "Journal of Nutritional Biochemistry",
                "credibility": "HIGH",
                "notes": "Peer-reviewed scientific publication."
            },
            {
                "url": "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition/drinking-red-wine-heart-health",
                "title": "American Heart Association Guidelines",
                "credibility": "HIGH",
                "notes": "Reputable national medical authority."
            },
            {
                "url": "https://www.who.int/publications/alcohol-global-status-report",
                "title": "WHO Alcohol and Health Global Status Report",
                "credibility": "HIGH",
                "notes": "International global health agency."
            }
        ]
    },
    "outdated_information": {
        "id": "demo_outdated",
        "title": "Outdated Information (Lockdowns and Travel Restrictions)",
        "input_type": "text",
        "content": "Emergency Alert: The government has just announced that all international travel is suspended immediately and citizens must stay indoors under a strict lockdown starting tonight.",
        "reliability_score": 45,
        "score_breakdown": {
            "evidence_support": 30,
            "source_quality": 85,
            "context_completeness": 20,
            "claim_consistency": 50,
            "misinformation_risk": "HIGH"
        },
        "verdict_counts": {
            "supported": 0,
            "partially_supported": 0,
            "contradicted": 2,
            "insufficient_evidence": 0
        },
        "overall_verdict": "POTENTIALLY_MISLEADING",
        "claims": [
            {
                "claim_id": "claim_1",
                "claim_text": "The government has suspended all international travel immediately.",
                "subject": "government",
                "action": "suspended",
                "object": "all international travel immediately",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["government", "international travel"],
                "decomposition": {
                    "subject": "Federal Government",
                    "action": "suspend travel",
                    "amount": "all international travel",
                    "target": "international border crossings",
                    "scope": "immediate effect",
                    "context": "Pandemic-era policy"
                },
                "verdict": "CONTRADICTED",
                "confidence": 0.98,
                "explanation": "No such emergency alert has been issued in 2026. The text matches statements released in March 2020 during the early stages of the COVID-19 pandemic.",
                "evidence_ids": ["ev_out_1", "ev_out_2"],
                "misinformation_pattern": {
                    "type": "Outdated Information",
                    "severity": "HIGH",
                    "explanation": "Presents a 2020 news release as a current event happening 'tonight' (in 2026), removing the crucial historical context.",
                    "affected_claim": "The government has suspended all international travel immediately."
                },
                "meaning_drift": {
                    "original_text": "Government announcement from March 2020: 'We are temporarily suspending international flights.'",
                    "viral_text": "The government has JUST announced that all international travel is suspended immediately (circulating in 2026).",
                    "changes": [
                        {"original": "March 2020 announcement", "viral": "just announced (current)"}
                    ],
                    "severity": "HIGH",
                    "reason": "Presents historical text as current breaking news, creating false panic."
                },
                "timeline": [
                    {
                        "year": "2020",
                        "title": "COVID-19 Borders Closed",
                        "description": "The department of state issues a Level 4 Do Not Travel advisory and limits entry.",
                        "verdict_drift": "Valid emergency protocol for that specific date."
                    },
                    {
                        "year": "2026",
                        "title": "Viral Post Re-circulation",
                        "description": "The exact same statement is pasted on social media without a date.",
                        "verdict_drift": "Outdated context collapse: completely false today."
                    }
                ]
            },
            {
                "claim_id": "claim_2",
                "claim_text": "Citizens must stay indoors under a strict lockdown starting tonight.",
                "subject": "citizens",
                "action": "must stay indoors under strict lockdown",
                "object": "starting tonight",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["citizens", "lockdown"],
                "decomposition": {
                    "subject": "citizens",
                    "action": "stay indoors",
                    "amount": "strict",
                    "target": "entire citizenry",
                    "scope": "starting tonight",
                    "context": "Emergency restriction"
                },
                "verdict": "CONTRADICTED",
                "confidence": 0.99,
                "explanation": "There are no active stay-at-home orders or lockdowns. Current government directives are fully open with standard travel advisories.",
                "evidence_ids": ["ev_out_2"],
                "misinformation_pattern": {
                    "type": "Context Collapse",
                    "severity": "HIGH",
                    "explanation": "Stripping away timestamps causes historical emergency orders to look like current authoritarian mandates.",
                    "affected_claim": "Citizens must stay indoors under a strict lockdown starting tonight."
                }
            }
        ],
        "evidence": [
            {
                "evidence_id": "ev_out_1",
                "source_title": "Official State Department Travel Archive (March 2020)",
                "source_url": "https://travel.state.gov/content/travel/en/traveladvisories/archive/2020.html",
                "source_type": "official_government",
                "publication_date": "2020-03-19",
                "relevant_passage": "The Department of State advises U.S. citizens to avoid all international travel due to the global impact of COVID-19.",
                "relevance_score": 0.95,
                "credibility_indicator": "HIGH",
                "relationship": "CONTEXTUALIZES"
            },
            {
                "evidence_id": "ev_out_2",
                "source_title": "Current Department of Homeland Security Travel Portal",
                "source_url": "https://www.dhs.gov/travel-updates",
                "source_type": "official_government",
                "publication_date": "2026-08-01",
                "relevant_passage": "International travel routes are fully operational. Normal security and visa procedures apply. No general lock-down orders are in place.",
                "relevance_score": 0.97,
                "credibility_indicator": "HIGH",
                "relationship": "CONTRADICTS"
            }
        ],
        "explainable_ai": {
            "summary": "This content is highly misleading because it circulates a historical alert from the 2020 pandemic as if it were a new announcement in 2026.",
            "what_we_found": "The text matches official alerts released in March 2020. There are absolutely no current lockdowns or travel suspensions in place.",
            "what_supports": "It was a real announcement in the past.",
            "what_contradicts": "All active government portals confirm that borders are open, flights are operating normally, and no stay-at-home restrictions exist today.",
            "what_is_missing": "A timestamp or year in the viral warning.",
            "why_misleading": "Removing '2020' makes readers believe a new emergency has begun, causing needless panic.",
            "confidence_explanation": "Confirmed by comparing the text with the 2020 federal archives and verifying current 2026 DHS travel portals."
        },
        "sources": [
            {
                "url": "https://travel.state.gov/content/travel/en/traveladvisories/archive/2020.html",
                "title": "Official State Department Travel Archive (March 2020)",
                "credibility": "HIGH",
                "notes": "Historical archive of governmental advisories."
            },
            {
                "url": "https://www.dhs.gov/travel-updates",
                "title": "Current Department of Homeland Security Travel Portal",
                "credibility": "HIGH",
                "notes": "Current official federal travel regulations portal."
            }
        ]
    },
    "mixed_truth": {
        "id": "demo_mixed",
        "title": "Mixed-Truth Article (Smart Cities and Health)",
        "input_type": "text",
        "content": "The mayor announced the new Smart City Initiative yesterday. The project will install 5G nodes in every street. Experts claim these nodes emit harmful radiation that causes immediate DNA damage. Additionally, the mayor received ₹20 million in bribes from telecom companies, and residents will be forced to pay a ₹10,000 monthly technology tax.",
        "reliability_score": 42,
        "score_breakdown": {
            "evidence_support": 35,
            "source_quality": 75,
            "context_completeness": 40,
            "claim_consistency": 30,
            "misinformation_risk": "HIGH"
        },
        "verdict_counts": {
            "supported": 2,
            "partially_supported": 0,
            "contradicted": 2,
            "insufficient_evidence": 1
        },
        "overall_verdict": "POTENTIALLY_MISLEADING",
        "claims": [
            {
                "claim_id": "claim_1",
                "claim_text": "The mayor announced the new Smart City Initiative yesterday.",
                "subject": "mayor",
                "action": "announced",
                "object": "Smart City Initiative yesterday",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["mayor", "Smart City Initiative"],
                "decomposition": {
                    "subject": "Mayor",
                    "action": "announced",
                    "amount": "Smart City Initiative",
                    "target": "city infrastructure",
                    "scope": "municipal",
                    "context": "Official City Press Release"
                },
                "verdict": "SUPPORTED",
                "confidence": 0.99,
                "explanation": "City council records show that the Mayor formally unveiled the Smart City infrastructure project yesterday.",
                "evidence_ids": ["ev_mix_1"],
                "misinformation_pattern": None,
                "meaning_drift": None
            },
            {
                "claim_id": "claim_2",
                "claim_text": "The project will install 5G nodes in every street.",
                "subject": "project",
                "action": "will install",
                "object": "5G nodes in every street",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["5G nodes", "every street"],
                "decomposition": {
                    "subject": "Initiative project",
                    "action": "install",
                    "amount": "nodes in every street",
                    "target": "5G network hardware",
                    "scope": "city-wide deployment",
                    "context": "Technical specifications"
                },
                "verdict": "SUPPORTED",
                "confidence": 0.95,
                "explanation": "The official plan documents indicate that municipal utility poles on public streets will host small cell 5G transmitters.",
                "evidence_ids": ["ev_mix_1"],
                "misinformation_pattern": None,
                "meaning_drift": None
            },
            {
                "claim_id": "claim_3",
                "claim_text": "Experts claim these nodes emit radiation that causes immediate DNA damage.",
                "subject": "experts",
                "action": "claim nodes emit radiation causing",
                "object": "immediate DNA damage",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["experts", "radiation", "DNA damage"],
                "decomposition": {
                    "subject": "Health Experts",
                    "action": "claim DNA damage",
                    "amount": "immediate",
                    "target": "5G electromagnetic fields",
                    "scope": "exposed citizens",
                    "context": "Scientific claim"
                },
                "verdict": "CONTRADICTED",
                "confidence": 0.98,
                "explanation": "Broad consensus from the WHO, FDA, and major cancer research institutes is that low-power non-ionizing 5G signals do not possess enough energy to break chemical bonds or cause DNA damage.",
                "evidence_ids": ["ev_mix_2", "ev_mix_3"],
                "misinformation_pattern": {
                    "type": "Unsupported Causal Claim",
                    "severity": "HIGH",
                    "explanation": "Claims 5G radiation causes DNA damage, which is scientifically contradicted by peer-reviewed research and public health bodies.",
                    "affected_claim": "Experts claim these nodes emit radiation that causes immediate DNA damage."
                },
                "meaning_drift": {
                    "original_text": "World Health Organization: 'No adverse health effects have been causally linked to exposure to wireless technologies.'",
                    "viral_text": "5G nodes emit harmful radiation that causes immediate DNA damage.",
                    "changes": [
                        {"original": "No adverse health effects linked", "viral": "causes immediate DNA damage"}
                    ],
                    "severity": "HIGH",
                    "reason": "Directly contradicts scientific findings by stating harmful causation."
                }
            },
            {
                "claim_id": "claim_4",
                "claim_text": "The mayor received ₹20 million in bribes from telecom companies.",
                "subject": "mayor",
                "action": "received bribes",
                "object": "₹20 million from telecom companies",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["mayor", "bribes", "telecom companies"],
                "decomposition": {
                    "subject": "Mayor",
                    "action": "received bribes",
                    "amount": "₹20 million",
                    "target": "personal account / campaign",
                    "scope": "corporate corruption",
                    "context": "Criminal allegation"
                },
                "verdict": "INSUFFICIENT_EVIDENCE",
                "confidence": 0.90,
                "explanation": "No audits, police reports, or credible news reports substantiate this bribery accusation. It appears to be an unverified social media rumor.",
                "evidence_ids": ["ev_mix_4"],
                "misinformation_pattern": {
                    "type": "False Attribution",
                    "severity": "HIGH",
                    "explanation": "Accuses an official of corruption without any primary source or investigation documents.",
                    "affected_claim": "The mayor received ₹20 million in bribes from telecom companies."
                }
            },
            {
                "claim_id": "claim_5",
                "claim_text": "Residents will be forced to pay a ₹10,000 monthly technology tax.",
                "subject": "residents",
                "action": "will be forced to pay",
                "object": "₹10,000 monthly technology tax",
                "factuality": "FACTUAL",
                "checkability": "VERIFIABLE",
                "entities": ["residents", "technology tax"],
                "decomposition": {
                    "subject": "residents",
                    "action": "pay technology tax",
                    "amount": "₹10,000 monthly",
                    "target": "all city citizens",
                    "scope": "forced / mandatory",
                    "context": "Financial policy"
                },
                "verdict": "CONTRADICTED",
                "confidence": 0.95,
                "explanation": "The municipal budget documents show the Smart City initiative is fully funded by federal grants and telecom licensing leases. There is no resident technology fee or tax proposed.",
                "evidence_ids": ["ev_mix_1", "ev_mix_5"],
                "misinformation_pattern": {
                    "type": "Numerical Manipulation",
                    "severity": "HIGH",
                    "explanation": "Invents a ₹10,000 monthly citizen fee out of thin air, whereas city documents show zero cost to residents.",
                    "affected_claim": "Residents will be forced to pay a ₹10,000 monthly technology tax."
                },
                "meaning_drift": {
                    "original_text": "Municipal budget: 'Project funded 100% via state grants and telecom lease fees, at no direct charge to residents.'",
                    "viral_text": "residents will be forced to pay a ₹10,000 monthly technology tax.",
                    "changes": [
                        {"original": "no direct charge to residents", "viral": "forced to pay a ₹10,000 monthly tax"}
                    ],
                    "severity": "HIGH",
                    "reason": "Reverses the financial terms of the project from zero cost to a heavy monthly fine."
                }
            }
        ],
        "evidence": [
            {
                "evidence_id": "ev_mix_1",
                "source_title": "City Council Smart Infrastructure Plan Press Kit",
                "source_url": "https://www.citygov.in/smart-city-press",
                "source_type": "official_government",
                "publication_date": "2026-08-27",
                "relevant_passage": "Mayor announced the launch of the municipal Smart City framework, deploying micro-cellular 5G nodes on city utility poles. Funded fully by national infrastructure grant and corporate space lease.",
                "relevance_score": 0.98,
                "credibility_indicator": "HIGH",
                "relationship": "SUPPORTS"
            },
            {
                "evidence_id": "ev_mix_2",
                "source_title": "World Health Organization (WHO) 5G Health Bulletin",
                "source_url": "https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks",
                "source_type": "official_organization",
                "publication_date": "2024-02-18",
                "relevant_passage": "To date, and after much research, no adverse health effect has been causally linked with exposure to wireless technologies. 5G signals are non-ionizing RF waves.",
                "relevance_score": 0.94,
                "credibility_indicator": "HIGH",
                "relationship": "CONTRADICTS"
            },
            {
                "evidence_id": "ev_mix_3",
                "source_title": "International Commission on Non-Ionizing Radiation Protection (ICNIRP) Guidelines",
                "source_url": "https://www.icnirp.org/en/frequencies/radiofrequency/index.html",
                "source_type": "peer_reviewed_research",
                "publication_date": "2020-03-11",
                "relevant_passage": "RF frequencies used in 5G do not carry sufficient photon energy to damage DNA directly or break atomic bonds.",
                "relevance_score": 0.91,
                "credibility_indicator": "HIGH",
                "relationship": "CONTRADICTS"
            },
            {
                "evidence_id": "ev_mix_4",
                "source_title": "City Integrity Commission Ethics Audit Report",
                "source_url": "https://www.citygov.in/ethics/integrity-reports",
                "source_type": "official_government",
                "publication_date": "2026-06-30",
                "relevant_passage": "All municipal vendor bids are public. No campaigns, shell companies, or municipal officers have received undocumented grants or transfers from telecom bidding parties.",
                "relevance_score": 0.78,
                "credibility_indicator": "HIGH",
                "relationship": "CONTEXTUALIZES"
            },
            {
                "evidence_id": "ev_mix_5",
                "source_title": "Municipal Finance Board Budget Plan FY 2026-27",
                "source_url": "https://www.citygov.in/finance/budget-fy27",
                "source_type": "official_government",
                "publication_date": "2026-04-01",
                "relevant_passage": "There are no local technological user fees, and tax increases for internet connectivity are strictly prohibited by council ordinance.",
                "relevance_score": 0.93,
                "credibility_indicator": "HIGH",
                "relationship": "CONTRADICTS"
            }
        ],
        "explainable_ai": {
            "summary": "This article is potentially misleading because it mixes verified facts (the mayor's announcement of 5G nodes) with false health claims (DNA damage) and fabricated financial details (₹20 million bribes and ₹10,000 monthly tax).",
            "what_we_found": "The Mayor did launch the Smart City plan with 5G nodes, but rumors about health damage, bribery, and citizen taxes are false and contradicted.",
            "what_supports": "The announcement itself and the installation of 5G nodes on public streets are real.",
            "what_contradicts": "Official WHO statements confirm 5G is safe. City finance records confirm there is no technology tax, and the project is fully grant-funded.",
            "what_is_missing": "Any documentation of corruption, or any health study showing 5G damages DNA.",
            "why_misleading": "It weaves real municipal projects into classic conspiracy theories and fake financial charges, creating anger and concern among residents.",
            "confidence_explanation": "Supported by the combination of official municipal documents, public finance registers, and public health consensus statements."
        },
        "sources": [
            {
                "url": "https://www.citygov.in/smart-city-press",
                "title": "City Council Smart Infrastructure Plan Press Kit",
                "credibility": "HIGH",
                "notes": "Official governmental release."
            },
            {
                "url": "https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks",
                "title": "World Health Organization (WHO) 5G Health Bulletin",
                "credibility": "HIGH",
                "notes": "Global intergovernmental health organization."
            },
            {
                "url": "https://www.citygov.in/finance/budget-fy27",
                "title": "Municipal Finance Board Budget Plan FY 2026-27",
                "credibility": "HIGH",
                "notes": "Official city audit and budget."
            }
        ]
    }
}
