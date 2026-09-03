import React from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, 
  Calendar, ArrowRight, Printer, RefreshCw, Check, X, Info
} from 'lucide-react';
import ReliabilityScore from './ReliabilityScore';
import EvidenceGraph from './EvidenceGraph';

export default function ReportView({ report, onReset }) {
  const {
    title, content, reliability_score, score_breakdown, 
    verdict_counts, claims, evidence, explainable_ai, sources
  } = report;

  const handlePrint = () => {
    window.print();
  };

  const renderVerdictBadge = (verdict) => {
    const commonStyles = "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm";
    switch (verdict) {
      case 'SUPPORTED':
        return <span className={`${commonStyles} bg-emerald-500/15 text-emerald-400 border border-emerald-500/30`}><ShieldCheck className="w-3.5 h-3.5" /> Supported</span>;
      case 'CONTRADICTED':
        return <span className={`${commonStyles} bg-rose-500/15 text-rose-400 border border-rose-500/30`}><ShieldAlert className="w-3.5 h-3.5" /> Contradicted</span>;
      case 'PARTIALLY_SUPPORTED':
        return <span className={`${commonStyles} bg-amber-500/15 text-amber-400 border border-amber-500/30`}><AlertTriangle className="w-3.5 h-3.5" /> Partially Supported</span>;
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return <span className={`${commonStyles} bg-slate-800 text-slate-400 border border-slate-700`}><HelpCircle className="w-3.5 h-3.5" /> Insufficient Evidence</span>;
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-950/30 text-rose-300 border border-rose-500/30 shadow-rose-500/5';
      case 'MEDIUM':
        return 'bg-amber-950/30 text-amber-300 border border-amber-500/30 shadow-amber-500/5';
      case 'LOW':
      default:
        return 'bg-blue-950/30 text-blue-300 border border-blue-500/30 shadow-blue-500/5';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans print:bg-white print:text-black">
      
      {/* Top Action Header Bar */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 uppercase tracking-wider transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Analyze Another Statement
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          Print / Download Report
        </button>
      </div>

      {/* Main Report Header */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/80 p-6 mb-8 relative overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-black uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Investigation Dossier
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">{title}</h2>
        
        {/* Source Text Snippet */}
        <div className="bg-[#030712]/80 border border-slate-800/90 rounded-xl p-4">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1.5">Submitted Content</div>
          <p className="text-xs text-slate-200 leading-relaxed italic font-normal">
            "{content}"
          </p>
        </div>
      </div>

      {/* Overall Assessment Score Block */}
      <ReliabilityScore score={reliability_score} breakdown={score_breakdown} />

      {/* Verdict Summary Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/80 border border-slate-800 border-t-2 border-t-emerald-500 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Supported Claims</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{verdict_counts.supported}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 border-t-2 border-t-amber-500 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Partially Supported</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{verdict_counts.partially_supported}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 border-t-2 border-t-rose-500 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contradicted Claims</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">{verdict_counts.contradicted}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 border-t-2 border-t-slate-600 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Insufficient Evidence</div>
          <div className="text-2xl font-extrabold text-slate-400 mt-1">{verdict_counts.insufficient_evidence}</div>
        </div>
      </div>

      {/* Interactive Evidence Graph */}
      <EvidenceGraph claims={claims} evidence={evidence} />

      {/* Section Divider Header */}
      <h3 className="text-lg font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
        <span>🧩</span> Factual Claim Analysis
      </h3>

      {/* Claim Cards List */}
      <div className="space-y-6 mb-12">
        {claims.map((claim, idx) => (
          <div 
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Claim #{String(idx + 1).padStart(2, '0')}
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5 leading-snug">
                  "{claim.claim_text}"
                </h4>
              </div>
              <div className="flex-shrink-0">
                {renderVerdictBadge(claim.verdict)}
              </div>
            </div>

            {/* Claim Decomposition Grid */}
            {claim.decomposition && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6 bg-[#030712]/80 border border-slate-800 rounded-xl p-3.5">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Subject</div>
                  <div className="text-xs text-slate-200 font-semibold truncate mt-0.5">{claim.decomposition.subject || 'None'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Action</div>
                  <div className="text-xs text-slate-200 font-semibold truncate mt-0.5">{claim.decomposition.action || 'None'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Amount</div>
                  <div className="text-xs text-slate-200 font-semibold truncate mt-0.5">{claim.decomposition.amount || 'None'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Target</div>
                  <div className="text-xs text-slate-200 font-semibold truncate mt-0.5">{claim.decomposition.target || 'None'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Scope</div>
                  <div className="text-xs text-slate-200 font-semibold truncate mt-0.5">{claim.decomposition.scope || 'None'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Context</div>
                  <div className="text-xs text-slate-200 font-semibold truncate mt-0.5">{claim.decomposition.context || 'None'}</div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="mb-6">
              <h5 className="text-xs text-slate-400 font-black uppercase mb-1.5">Verification Verdict Explanation:</h5>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {claim.explanation}
              </p>
            </div>

            {/* Related Evidence Sources checkbox list */}
            {claim.evidence_ids && claim.evidence_ids.length > 0 && (
              <div className="mb-6">
                <h5 className="text-[10px] text-slate-400 font-black uppercase mb-2.5">Sources consulted for this claim:</h5>
                <div className="flex flex-wrap gap-3">
                  {claim.evidence_ids.map((ev_id) => {
                    const ev = evidence.find((e) => e.evidence_id === ev_id);
                    if (!ev) return null;
                    const isSupported = ev.relationship === 'SUPPORTS';
                    const isContradicted = ev.relationship === 'CONTRADICTS';
                    
                    return (
                      <div 
                        key={ev_id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                          isSupported ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                          isContradicted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        {isSupported ? (
                          <Check className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                        ) : isContradicted ? (
                          <X className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                        ) : (
                          <Info className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
                        )}
                        <span className="truncate max-w-[200px] font-semibold">{ev.source_title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Misinformation alerts */}
            {claim.misinformation_pattern && (
              <div className={`border rounded-xl p-4 mb-6 shadow-sm ${getSeverityStyles(claim.misinformation_pattern.severity)}`}>
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Detected Pattern: {claim.misinformation_pattern.type}
                </div>
                <p className="text-xs leading-relaxed font-normal">
                  {claim.misinformation_pattern.explanation}
                </p>
              </div>
            )}

            {/* Meaning Drift comparison ("What Changed?") */}
            {claim.meaning_drift && (
              <div className="bg-[#030712]/80 border border-purple-500/30 rounded-xl p-4 shadow-lg shadow-purple-500/5">
                <div className="text-[10px] text-purple-400 font-black uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                  <span>🔄</span> MEANING DRIFT DETECTED
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                    <span className="text-[9px] text-slate-400 uppercase font-black">Original Source Evidence:</span>
                    <p className="text-xs text-slate-300 italic mt-1 font-normal">"{claim.meaning_drift.original_text}"</p>
                  </div>
                  <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-3">
                    <span className="text-[9px] text-purple-300 font-black uppercase">Viral Statement:</span>
                    <p className="text-xs text-white italic mt-1 font-bold">"{claim.meaning_drift.viral_text}"</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-[9px] text-slate-400 uppercase font-black">What Changed:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {claim.meaning_drift.changes.map((change, cIdx) => (
                      <div key={cIdx} className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-1 rounded-md font-bold">
                        <span className="line-through opacity-60 font-medium">{change.original}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>{change.viral}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="text-purple-400 font-black">Explanation:</span> {claim.meaning_drift.reason}
                </div>
              </div>
            )}

            {/* Timeline element */}
            {claim.timeline && claim.timeline.length > 0 && (
              <div className="mt-6 border-t border-slate-800 pt-6">
                <h5 className="text-[10px] text-slate-400 font-black uppercase mb-4 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> Claim Evolution Timeline
                </h5>
                <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6">
                  {claim.timeline.map((t, tIdx) => (
                    <div key={tIdx} className="relative">
                      <span className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-slate-900"></span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-purple-400">{t.year}</span>
                        <span className="text-xs font-bold text-white">— {t.title}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">{t.description}</p>
                      {t.verdict_drift && (
                        <div className="text-[10px] text-amber-400 font-semibold mt-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md inline-block">
                          {t.verdict_drift}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Explainable AI summary section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-base font-extrabold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>🧠</span> Why did NewsGuard give this result?
        </h3>
        
        <div className="space-y-4">
          <div>
            <span className="text-xs font-black text-cyan-400 uppercase">Investigation Summary</span>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed font-semibold">{explainable_ai.summary}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
            <div>
              <span className="text-xs font-black text-emerald-400 uppercase">Supporting Elements</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">{explainable_ai.what_supports}</p>
            </div>
            <div>
              <span className="text-xs font-black text-rose-400 uppercase">Contradicting Elements</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">{explainable_ai.what_contradicts}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase">Contextual Omissions</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">{explainable_ai.what_is_missing}</p>
            </div>
            <div>
              <span className="text-xs font-black text-purple-400 uppercase">Verification Confidence Explanation</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">{explainable_ai.confidence_explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uncertainty Notice Component */}
      <div className="border border-slate-800 bg-[#030712]/70 rounded-xl p-4 mb-8 text-xs text-slate-400 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300">Uncertainty Mitigation Statement:</span> When available primary evidence is insufficient to verify or refute an assertion, the system assigns an <span className="text-white font-bold">INSUFFICIENT EVIDENCE</span> classification. Do not treat uncertainty as proof that the claim is false.
        </div>
      </div>

      {/* Reference Sources Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 overflow-hidden shadow-xl">
        <h3 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">
          References & Sources Consulted
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-3 px-4 uppercase tracking-wider">Source Label</th>
                <th className="py-3 px-4 uppercase tracking-wider">Source URL</th>
                <th className="py-3 px-4 uppercase tracking-wider text-center">Quality Rating</th>
                <th className="py-3 px-4 uppercase tracking-wider">Assessed Role</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((src, sIdx) => (
                <tr key={sIdx} className="border-b border-slate-800/60 hover:bg-slate-800/30 text-slate-300 font-normal">
                  <td className="py-3.5 px-4 font-bold text-white">{src.title}</td>
                  <td className="py-3.5 px-4">
                    {src.url ? (
                      <a 
                        href={src.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 hover:underline truncate block max-w-xs font-semibold"
                      >
                        {src.url}
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">Offline database document</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded font-black tracking-wide text-[10px] ${
                      src.credibility === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {src.credibility}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-normal">{src.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[10px] text-slate-500 border-t border-slate-800 pt-6 mt-12 mb-8 leading-relaxed max-w-3xl mx-auto print:text-black">
        🛡️ <span className="font-bold text-slate-400 uppercase tracking-wider">Responsible AI Disclaimer:</span> NewsGuard AI provides an evidence-based assessment of claims using structured natural language retrieval models and public verification parameters. It represents an automated verification support tool, not an absolute judicial declaration of truth. Users should verify critical medical, financial, or civic statements with primary authority databases.
      </div>
    </div>
  );
}
