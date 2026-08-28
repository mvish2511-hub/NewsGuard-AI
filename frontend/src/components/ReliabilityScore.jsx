import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from 'recharts';
import { ShieldCheck, ShieldAlert, Info } from 'lucide-react';

export default function ReliabilityScore({ score, breakdown }) {
  const { evidence_support, source_quality, context_completeness, claim_consistency, misinformation_risk } = breakdown;

  // Chart data
  const data = [
    { name: 'Evidence Support', score: evidence_support, color: '#2563eb' },
    { name: 'Source Quality', score: source_quality, color: '#7c3aed' },
    { name: 'Context Completeness', score: context_completeness, color: '#10b981' },
    { name: 'Claim Consistency', score: claim_consistency, color: '#f59e0b' }
  ];

  // Helper for colors
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-cyber-emerald border-cyber-emerald/30 bg-cyber-emerald/5';
    if (val >= 50) return 'text-cyber-amber border-cyber-amber/30 bg-cyber-amber/5';
    return 'text-cyber-rose border-cyber-rose/30 bg-cyber-rose/5';
  };

  const getGaugeColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Gauge Card */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
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
              stroke="#e2e8f0"
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
            <span className="text-4xl font-extrabold text-slate-800">{score}</span>
            <span className="text-xs text-slate-450 mt-1 uppercase font-bold tracking-wider">/ 100</span>
          </div>
        </div>

        <div className="mt-4 w-full">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getScoreColor(score)}`}>
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
          
          <div className="mt-4 flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-xs text-slate-650 font-bold uppercase">Misinformation Risk:</span>
            <span className={`text-xs font-black uppercase tracking-widest ${
              misinformation_risk === 'HIGH' ? 'text-cyber-rose' : 
              misinformation_risk === 'MEDIUM' ? 'text-cyber-amber' : 'text-cyber-emerald'
            }`}>
              {misinformation_risk}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> Score Analysis Components
        </h4>
        
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748b" 
                fontSize={10} 
                width={120}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-550 italic mt-2 text-right">
          * Calculated dynamically based on claim support rates, publication records, and meaning drift occurrences.
        </div>
      </div>
    </div>
  );
}
