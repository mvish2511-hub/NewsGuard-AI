import React from 'react';
import { Shield, ZoomIn, Eye, Shuffle, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onStartAnalyze, onTryDemo }) {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden w-full">
      {/* Background cyberpunk grid */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none"></div>
      
      {/* Luminous ambient gradient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        {/* Shield Logo badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-6 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg shadow-cyan-500/10">
          <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
          Securing Information Consensus
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-white">
          🛡️ <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
            NEWSGUARD AI
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="text-2xl md:text-3xl font-light text-slate-300 mb-6 italic">
          "Don't just believe it. <span className="text-cyan-400 font-bold not-italic">Investigate it.</span>"
        </p>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 mb-10 leading-relaxed font-normal">
          AI-powered claim verification that reveals evidence, misinformation patterns, and hidden context. We decompose articles claim-by-claim to surface meaning drift.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <button
            onClick={onStartAnalyze}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            Analyze Content
          </button>
          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl border border-slate-700 hover:border-slate-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
          >
            Try Demo Scenario
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 text-left transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 group hover:-translate-y-1 backdrop-blur-sm">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all shadow-sm">
              <ZoomIn className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">🔍 Claim-Level Verification</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-normal">
              We extract and evaluate individual statements. No binary TRUE/FALSE generalizations. You see evidence scores for every sentence.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 text-left transition-all duration-300 shadow-xl hover:shadow-purple-500/10 group hover:-translate-y-1 backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all shadow-sm">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">🕵️ Misinformation Investigation</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-normal">
              Identify exactly how news is spun. Detect exaggeration, context collapse, cherry-picking, or opinions masked as facts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 text-left transition-all duration-300 shadow-xl hover:shadow-emerald-500/10 group hover:-translate-y-1 backdrop-blur-sm">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all shadow-sm">
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">🔄 Meaning Drift Detection</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-normal">
              Instantly view 'What Changed' between original scientific/official research text and the sensationalized viral social media copy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
