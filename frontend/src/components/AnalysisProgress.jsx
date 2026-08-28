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
    <div className="max-w-xl mx-auto px-6 py-12 bg-white border border-slate-200 rounded-3xl shadow-lg relative overflow-hidden">
      {/* Decorative scanner line */}
      <div className="absolute left-0 right-0 h-[2px] bg-cyber-glow/20 scanner-line"></div>
      
      <div className="text-center mb-8">
        <Loader2 className="w-12 h-12 text-cyber-glow animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-extrabold tracking-wider uppercase text-slate-800">
          NewsGuard Deep Investigation
        </h3>
        <p className="text-sm text-slate-600 mt-1">Cross-referencing claims against local and global registries</p>
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
                  ? 'border-cyber-glow bg-cyber-glow/5 shadow-sm' 
                  : isCompleted 
                    ? 'border-slate-100 bg-slate-50' 
                    : 'border-transparent opacity-40'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-cyber-emerald flex-shrink-0 mt-0.5" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-cyber-glow animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              
              <div>
                <h4 className={`text-sm font-bold ${isCurrent ? 'text-cyber-glow' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.title}
                </h4>
                {isCurrent && (
                  <p className="text-xs text-slate-600 mt-1 animate-pulse leading-relaxed">
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
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase">
          <span>Analyzing Engine Status</span>
          <span>{Math.min(100, Math.round((currentStep / steps.length) * 100))}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyber-glow to-cyber-purple h-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
