import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

export default function AnalysisProgress({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "🔍 Claim detected", desc: "Parsing document structure and isolating factual assertions." },
    { title: "🧩 Claim decomposed", desc: "Breaking claims into subject, predicate, scope, and amount." },
    { title: "📚 Evidence found", desc: "Querying local vector embeddings index and web verification databases." },
    { title: "⚖️ Evidence compared", desc: "Comparing relevance scores and assigning source credibility ranks." },
    { title: "🚨 Misinformation pattern detected", desc: "Scanning for text exaggeration, opinion-as-fact, and false attribution." },
    { title: "🔄 Meaning drift analyzed", desc: "Cross-referencing viral text statements with original context statements." },
    { title: "🧠 Explanation generated", desc: "Synthesizing evidence-backed reasoning without internal chain-of-thought." },
    { title: "🛡️ Final assessment", desc: "Tabulating NewsGuard Reliability Indicator weights and compiling final report." }
  ];

  useEffect(() => {
    let timer;
    if (currentStep < steps.length) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 900);
    } else {
      onComplete();
    }
    return () => clearTimeout(timer);
  }, [currentStep, onComplete, steps.length]);

  return (
    <div className="max-w-xl mx-auto px-6 py-12 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md w-full">
      {/* Decorative scanner line */}
      <div className="absolute left-0 right-0 h-[2px] bg-cyan-400/40 scanner-line shadow-sm shadow-cyan-400"></div>
      
      <div className="text-center mb-8">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-extrabold tracking-wider uppercase text-white">
          NewsGuard Deep Investigation
        </h3>
        <p className="text-sm text-slate-400 mt-1">Cross-referencing claims against local and global registries</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent 
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10' 
                  : isCompleted 
                    ? 'border-slate-800/80 bg-slate-950/60' 
                    : 'border-transparent opacity-30'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              )}
              
              <div>
                <h4 className={`text-sm font-bold ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                  {step.title}
                </h4>
                {isCurrent && (
                  <p className="text-xs text-slate-300 mt-1 animate-pulse leading-relaxed">
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="mt-8">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
          <span>Analyzing Engine Status</span>
          <span className="text-cyan-400">{Math.min(100, Math.round((currentStep / steps.length) * 100))}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full transition-all duration-300 shadow-sm shadow-cyan-400/50"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
