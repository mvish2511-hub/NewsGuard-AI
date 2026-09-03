import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from 'recharts';
import { ShieldCheck, ShieldAlert, Info } from 'lucide-react';

export default function ReliabilityScore({ score, breakdown }) {
  const { evidence_support, source_quality, context_completeness, claim_consistency, misinformation_risk } = breakdown;

  // Chart data
  const data = [
    { name: 'Evidence Support', score: evidence_support, color: '#3b82f6' },
    { name: 'Source Quality', score: source_quality, color: '#8b5cf6' },
    { name: 'Context Completeness', score: context_completeness, color: '#10b981' },
    { name: 'Claim Consistency', score: claim_consistency, color: '#f59e0b' }
  ];

  // Helper for colors
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-emerald-500/10';
    if (val >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-rose-500/10';
  };

  const getGaugeColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 50) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Gauge Card */}
      <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Reliability Indicator
        </h4>
        
        {/* SVG Gauge */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Value circle */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke={getGaugeColor(score)}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (1 - score / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Inner Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-white">{score}</span>
            <span className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">/ 100</span>
          </div>
        </div>

        <div className="mt-4 w-full">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm ${getScoreColor(score)}`}>
            {score >= 80 ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" /> High Reliability
              </>
            ) : score >= 50 ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> Moderate Quality
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> Misleading Risk
              </>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center bg-[#030712]/70 border border-slate-800 rounded-xl p-3">
            <span className="text-xs text-slate-400 font-bold uppercase">Misinformation Risk:</span>
            <span className={`text-xs font-black uppercase tracking-widest ${
              misinformation_risk === 'HIGH' ? 'text-rose-400' : 
              misinformation_risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {misinformation_risk}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" /> Score Analysis Components
        </h4>
        
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={10} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#94a3b8" 
                fontSize={10} 
                width={130}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                contentStyle={{ background: '#0b0f19', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-500 italic mt-2 text-right">
          * Calculated dynamically based on claim support rates, publication records, and meaning drift occurrences.
        </div>
      </div>
    </div>
  );
}
