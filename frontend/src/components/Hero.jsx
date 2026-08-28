import React from 'react';
import { Shield, ZoomIn, Eye, Shuffle } from 'lucide-react';

export default function Hero({ onStartAnalyze, onTryDemo }) {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
      
      {/* Soft gradient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-glow/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        {/* Shield Logo badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-glow/20 bg-cyber-glow/5 text-cyber-glow mb-6 animate-pulse text-sm font-semibold tracking-wider uppercase">
          <Shield className="w-4 h-4" />
          Securing Information Consensus
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
          🛡️ <span className="bg-gradient-to-r from-cyber-glow to-cyber-purple bg-clip-text text-transparent">NEWSGUARD AI</span>
        </h1>
        
        <p className="text-2xl md:text-3xl font-light text-slate-700 mb-6 italic">
          "Don't just believe it. <span className="text-cyber-glow font-bold">Investigate it.</span>"
        </p>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 mb-10 leading-relaxed font-medium">
          AI-powered claim verification that reveals evidence, misinformation patterns, and hidden context. We decompose articles claim-by-claim to surface meaning drift.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <button
            onClick={onStartAnalyze}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-cyber-glow hover:text-blue-750 font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
          >
            Analyze Content
          </button>
          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-8 py-4 bg-cyber-purple hover:bg-violet-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Try Demo Scenario
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-cyber-glow/50 transition-all duration-300 shadow-sm hover:shadow-md group hover:translate-y-[-4px]">
            <div className="w-12 h-12 bg-cyber-glow/10 text-cyber-glow rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyber-glow/20 transition-all">
              <ZoomIn className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">🔍 Claim-Level Verification</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              We extract and evaluate individual statements. No binary TRUE/FALSE generalizations. You see evidence scores for every sentence.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-cyber-purple/50 transition-all duration-300 shadow-sm hover:shadow-md group hover:translate-y-[-4px]">
            <div className="w-12 h-12 bg-cyber-purple/10 text-cyber-purple rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyber-purple/20 transition-all">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">🕵️ Misinformation Investigation</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              Identify exactly how news is spun. Detect exaggeration, context collapse, cherry-picking, or opinions masked as facts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-cyber-emerald/50 transition-all duration-300 shadow-sm hover:shadow-md group hover:translate-y-[-4px]">
            <div className="w-12 h-12 bg-cyber-emerald/10 text-cyber-emerald rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyber-emerald/20 transition-all">
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">🔄 Meaning Drift Detection</h3>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              Instantly view 'What Changed' between original scientific/official research text and the sensationalized viral social media copy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
