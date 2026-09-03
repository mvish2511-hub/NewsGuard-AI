import React, { useState } from 'react';
import Hero from './components/Hero';
import InputPanel from './components/InputPanel';
import AnalysisProgress from './components/AnalysisProgress';
import ReportView from './components/ReportView';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); // landing, input, loading, dashboard
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiMode, setApiMode] = useState('Checking...');

  // Fallback scenario data if backend is completely offline
  const localScenariosFallback = {
    "red wine": {
      "id": "demo_sci_exag",
      "title": "Exaggerated Scientific Claim (Resveratrol in Red Wine)",
      "input_type": "text",
      "content": "A sensational new study proves that drinking red wine completely prevents type-2 diabetes and heart disease, meaning everyone should drink two glasses daily.",
      "reliability_score": 38,
      "score_breakdown": { "evidence_support": 25, "source_quality": 60, "context_completeness": 30, "claim_consistency": 40, "misinformation_risk": "HIGH" },
      "verdict_counts": { "supported": 0, "partially_supported": 1, "contradicted": 1, "insufficient_evidence": 1 },
      "overall_verdict": "POTENTIALLY_MISLEADING",
      "claims": [
        {
          "claim_id": "claim_1", "claim_text": "A new study was conducted on the effects of red wine.",
          "verdict": "PARTIALLY_SUPPORTED", "explanation": "Studies exist on resveratrol in mice, but not direct human trials proving red wine drinking is a magic cure.",
          "decomposition": { "subject": "Researchers", "action": "conducted study", "amount": "1 study", "target": "resveratrol", "scope": "mice models", "context": "Published" },
          "evidence_ids": ["ev_1", "ev_2"], "factuality": "FACTUAL",
          "misinformation_pattern": { "type": "Missing Context", "severity": "MEDIUM", "explanation": "The study was conducted on mice, not humans.", "affected_claim": "A new study was conducted on the effects of red wine." },
          "meaning_drift": { "original_text": "Scientists tested pure resveratrol on mice.", "viral_text": "Study conducted on red wine (implying humans).", "changes": [{"original": "mice resveratrol", "viral": "red wine"}], "severity": "MEDIUM", "reason": "Equates mouse testing to wine drinking." }
        },
        {
          "claim_id": "claim_2", "claim_text": "Red wine completely prevents type-2 diabetes and heart disease.",
          "verdict": "CONTRADICTED", "explanation": "Clinical consensus shows alcohol does not prevent these. Heavy drinking increases risk.",
          "decomposition": { "subject": "Red wine", "action": "prevents", "amount": "completely", "target": "diabetes/heart disease", "scope": "everyone", "context": "None" },
          "evidence_ids": ["ev_2", "ev_3"], "factuality": "FACTUAL",
          "misinformation_pattern": { "type": "Exaggeration", "severity": "HIGH", "explanation": "Changes statistical correlation into guaranteed prevention.", "affected_claim": "Red wine completely prevents type-2 diabetes." }
        },
        {
          "claim_id": "claim_3", "claim_text": "Everyone should drink two glasses of red wine daily.",
          "verdict": "INSUFFICIENT_EVIDENCE", "explanation": "No medical authority recommends alcohol consumption for protection.",
          "decomposition": { "subject": "everyone", "action": "should drink", "amount": "two glasses", "target": "general population", "scope": "universal", "context": "daily" },
          "evidence_ids": ["ev_3"], "factuality": "OPINION"
        }
      ],
      "evidence": [
        { "evidence_id": "ev_1", "source_title": "Journal of Nutritional Biochemistry", "source_url": "https://www.jnutbio.org/article/resveratrol-mice", "relevant_passage": "Mice fed high doses of pure resveratrol extract showed improved metabolic markers.", "credibility_indicator": "HIGH", "relationship": "CONTEXTUALIZES" },
        { "evidence_id": "ev_2", "source_title": "American Heart Association Guidelines", "source_url": "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition/drinking-red-wine-heart-health", "relevant_passage": "No study has proved a cause-and-effect link between drinking alcohol and better heart health.", "credibility_indicator": "HIGH", "relationship": "CONTRADICTS" },
        { "evidence_id": "ev_3", "source_title": "WHO Alcohol and Health Status Report", "source_url": "https://www.who.int/publications/alcohol-global-status-report", "relevant_passage": "Alcohol is a toxic substance and group 1 carcinogen.", "credibility_indicator": "HIGH", "relationship": "CONTRADICTS" }
      ],
      "explainable_ai": {
        "summary": "Misleading claim exaggerating animal laboratory findings into direct medical advice.",
        "what_we_found": "Resveratrol has cell benefits in mice, but wine is not a cure.",
        "what_supports": "Resveratrol antioxidants.",
        "what_contradicts": "AHA and WHO declarations.",
        "what_is_missing": "Human clinical trials.",
        "why_misleading": "It changes mouse testing to direct human recommendations.",
        "confidence_explanation": "Highly certain based on global health databases."
      },
      "sources": [
        { "title": "Journal of Nutritional Biochemistry", "url": "https://www.jnutbio.org/article/resveratrol-mice", "credibility": "HIGH", "notes": "Scientific review" },
        { "title": "American Heart Association Guidelines", "url": "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition/drinking-red-wine-heart-health", "credibility": "HIGH", "notes": "Medical policy" }
      ]
    },
    "lockdown": {
      "id": "demo_outdated",
      "title": "Outdated Information (Lockdowns and Travel Restrictions)",
      "input_type": "text",
      "content": "Emergency Alert: The government has just announced that all international travel is suspended immediately and citizens must stay indoors under a strict lockdown starting tonight.",
      "reliability_score": 45,
      "score_breakdown": { "evidence_support": 30, "source_quality": 85, "context_completeness": 20, "claim_consistency": 50, "misinformation_risk": "HIGH" },
      "verdict_counts": { "supported": 0, "partially_supported": 0, "contradicted": 2, "insufficient_evidence": 0 },
      "overall_verdict": "POTENTIALLY_MISLEADING",
      "claims": [
        {
          "claim_id": "claim_1", "claim_text": "The government has suspended all international travel immediately.",
          "verdict": "CONTRADICTED", "explanation": "No emergency closure is active in 2026. This matches historical March 2020 press releases.",
          "decomposition": { "subject": "government", "action": "suspended", "amount": "all", "target": "international travel", "scope": "immediate", "context": "2020" },
          "evidence_ids": ["ev_out_1", "ev_out_2"], "factuality": "FACTUAL",
          "misinformation_pattern": { "type": "Outdated Information", "severity": "HIGH", "explanation": "Presents a 2020 announcement as current.", "affected_claim": "Travel suspended immediately" },
          "meaning_drift": { "original_text": "2020 announcement.", "viral_text": "Just announced tonight (in 2026).", "changes": [{"original": "March 2020", "viral": "tonight"}], "severity": "HIGH", "reason": "Presents past alerts as active." }
        },
        {
          "claim_id": "claim_2", "claim_text": "Citizens must stay indoors under a strict lockdown starting tonight.",
          "verdict": "CONTRADICTED", "explanation": "Borders are open and there are no active local lockdown orders.",
          "decomposition": { "subject": "citizens", "action": "stay indoors", "amount": "strict", "target": "citizenry", "scope": "universal", "context": "tonight" },
          "evidence_ids": ["ev_out_2"], "factuality": "FACTUAL"
        }
      ],
      "evidence": [
        { "evidence_id": "ev_out_1", "source_title": "State Department Travel Archive (March 2020)", "source_url": "https://travel.state.gov/content/travel/en/traveladvisories/archive/2020.html", "relevant_passage": "U.S. Department advises citizens to avoid all travel due to COVID-19.", "credibility_indicator": "HIGH", "relationship": "CONTEXTUALIZES" },
        { "evidence_id": "ev_out_2", "source_title": "DHS Travel Portal Updates (2026)", "source_url": "https://www.dhs.gov/travel-updates", "relevant_passage": "International routes are fully operational. Normal procedures apply.", "credibility_indicator": "HIGH", "relationship": "CONTRADICTS" }
      ],
      "explainable_ai": {
        "summary": "Presents a March 2020 advisory as current news, creating false emergency panic.",
        "what_we_found": "No lockdown or border closures are active.",
        "what_supports": "It was true in March 2020.",
        "what_contradicts": "All current 2026 DHS guidelines.",
        "what_is_missing": "Date of announcement.",
        "why_misleading": "Strips timestamps from past pandemic-era policy.",
        "confidence_explanation": "Verified with federal records."
      },
      "sources": [
        { "title": "DHS Travel Portal Updates (2026)", "url": "https://www.dhs.gov/travel-updates", "credibility": "HIGH", "notes": "Official portal" }
      ]
    },
    "smart": {
      "id": "demo_mixed",
      "title": "Mixed-Truth Article (Smart Cities and Health)",
      "input_type": "text",
      "content": "The mayor announced the new Smart City Initiative yesterday. The project will install 5G nodes in every street. Experts claim these nodes emit harmful radiation that causes immediate DNA damage. Additionally, the mayor received ₹20 million in bribes from telecom companies, and residents will be forced to pay a ₹10,000 monthly technology tax.",
      "reliability_score": 42,
      "score_breakdown": { "evidence_support": 35, "source_quality": 75, "context_completeness": 40, "claim_consistency": 30, "misinformation_risk": "HIGH" },
      "verdict_counts": { "supported": 2, "partially_supported": 0, "contradicted": 2, "insufficient_evidence": 1 },
      "overall_verdict": "POTENTIALLY_MISLEADING",
      "claims": [
        { "claim_id": "claim_1", "claim_text": "The mayor announced the new Smart City Initiative yesterday.", "verdict": "SUPPORTED", "explanation": "Official municipal logs verify the mayor unveiled the project yesterday.", "evidence_ids": ["ev_mix_1"], "factuality": "FACTUAL" },
        { "claim_id": "claim_2", "claim_text": "The project will install 5G nodes in every street.", "verdict": "SUPPORTED", "explanation": "Technical blueprints confirm 5G small cells on public light posts.", "evidence_ids": ["ev_mix_1"], "factuality": "FACTUAL" },
        { "claim_id": "claim_3", "claim_text": "Experts claim these nodes emit radiation that causes immediate DNA damage.", "verdict": "CONTRADICTED", "explanation": "5G uses non-ionizing RF signals which are too low-energy to break DNA bonds.", "evidence_ids": ["ev_mix_2", "ev_mix_3"], "factuality": "FACTUAL", "misinformation_pattern": { "type": "Unsupported Causal Claim", "severity": "HIGH", "explanation": "Claims DNA damage from safe consumer wavelengths.", "affected_claim": "Nodes cause DNA damage" } },
        { "claim_id": "claim_4", "claim_text": "The mayor received ₹20 million in bribes from telecom companies.", "verdict": "INSUFFICIENT_EVIDENCE", "explanation": "No campaign audit or legal record supports this bribery allegation.", "evidence_ids": ["ev_mix_4"], "factuality": "FACTUAL" },
        { "claim_id": "claim_5", "claim_text": "Residents will be forced to pay a ₹10,000 monthly technology tax.", "verdict": "CONTRADICTED", "explanation": "The plan is fully funded by federal grants and telecom leases. No citizen fee exists.", "evidence_ids": ["ev_mix_1", "ev_mix_5"], "factuality": "FACTUAL", "meaning_drift": { "original_text": "Funded 100% via grants at no cost to residents.", "viral_text": "Residents pay ₹10,000 monthly.", "changes": [{"original": "no cost", "viral": "₹10,000 fee"}], "severity": "HIGH", "reason": "Reverses payment terms." } }
      ],
      "evidence": [
        { "evidence_id": "ev_mix_1", "source_title": "City Smart Plan Press Kit", "relevant_passage": "Deploying 5G small cells. Project funded fully by federal grants.", "credibility_indicator": "HIGH", "relationship": "SUPPORTS" },
        { "evidence_id": "ev_mix_2", "source_title": "WHO 5G Health Bulletin", "relevant_passage": "No adverse health effect has been causally linked with exposure to wireless tech.", "credibility_indicator": "HIGH", "relationship": "CONTRADICTS" },
        { "evidence_id": "ev_mix_5", "source_title": "Municipal Finance Budget FY27", "relevant_passage": "Local internet fees are prohibited by council ordinance.", "credibility_indicator": "HIGH", "relationship": "CONTRADICTS" }
      ],
      "explainable_ai": {
        "summary": "Weaves factual infrastructure updates into conspiracy theories about health risks and bribery.",
        "what_we_found": "5G project was launched, but health and financial claims are fabricated.",
        "what_supports": "Installation announcement.",
        "what_contradicts": "WHO statements and city finance reports.",
        "what_is_missing": "Proof of bribes.",
        "why_misleading": "Fabricates fees and safety scares.",
        "confidence_explanation": "Verified through direct municipal budget audits."
      },
      "sources": [
        { "title": "WHO 5G Health Bulletin", "credibility": "HIGH", "notes": "Global agency" }
      ]
    }
  };

  const handleStartAnalyze = () => {
    setView('input');
    setApiError(null);
  };

  const handleTryDemo = () => {
    handleAnalyze(
      "A sensational new study proves that drinking red wine completely prevents type-2 diabetes and heart disease, meaning everyone should drink two glasses daily.",
      "text",
      "Exaggerated Scientific Claim (Resveratrol in Red Wine)"
    );
  };

  const handleAnalyze = async (text, inputType, title) => {
    setIsLoading(true);
    setView('loading');
    setApiError(null);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          input_type: inputType,
          title: title
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setReport(data);
      setApiMode('Online API Server');
    } catch (error) {
      console.warn("FastAPI offline or failed. Running client-side simulation fallback...", error);
      
      const contentLower = text.toLowerCase();
      let matchedScenario = localScenariosFallback["smart"]; // Default
      
      if (contentLower.includes("wine") || contentLower.includes("resveratrol")) {
        matchedScenario = localScenariosFallback["red wine"];
      } else if (contentLower.includes("lockdown") || contentLower.includes("travel")) {
        matchedScenario = localScenariosFallback["lockdown"];
      }
      
      setReport(matchedScenario);
      setApiMode('Local Demo Mode (Backend Offline)');
      setApiError("Backend connection unavailable. Running in client-side demonstration sandbox.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Header / Navbar */}
      <header className="border-b border-cyber-border bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 print:hidden shadow-lg shadow-black/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all">
              <Shield className="w-5 h-5 text-cyber-glow" />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white uppercase">
              NewsGuard <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-purple bg-clip-text text-transparent">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Engine status:</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border backdrop-blur-sm shadow-sm ${
              apiMode.includes('Online') 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' 
                : 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-purple-500/10'
            }`}>
              <Sparkles className="w-3 h-3" />
              {apiMode}
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow flex items-center justify-center py-6">
        {view === 'landing' && (
          <Hero onStartAnalyze={handleStartAnalyze} onTryDemo={handleTryDemo} />
        )}
        
        {view === 'input' && (
          <InputPanel onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}
        
        {view === 'loading' && (
          <AnalysisProgress onComplete={() => setView('dashboard')} />
        )}
        
        {view === 'dashboard' && report && (
          <div className="w-full">
            {apiError && (
              <div className="max-w-6xl mx-auto px-4 mb-4 print:hidden">
                <div className="border border-purple-500/30 bg-purple-950/30 rounded-xl p-3 flex items-center gap-2 text-xs text-purple-300 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {apiError}
                </div>
              </div>
            )}
            <ReportView report={report} onReset={() => setView('input')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-6 bg-slate-950/70 print:hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 NewsGuard AI - Intelligent Misinformation & Claim Verification
          </div>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Security Portal</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">API Integration</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Consensus Database</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
