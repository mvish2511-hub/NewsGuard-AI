import React, { useState, useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { ExternalLink, Info } from 'lucide-react';

export default function EvidenceGraph({ claims, evidence }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Compute React Flow Nodes and Edges dynamically
  const { nodes, edges } = useMemo(() => {
    const computedNodes = [];
    const computedEdges = [];
    
    const claimX = 50;
    const evidenceX = 620;
    const claimYGap = 200;
    const evidenceYGap = 160;

    // 1. Build Claim Nodes
    claims.forEach((claim, idx) => {
      const node_id = `node_${claim.claim_id}`;
      
      let border_color = 'border-slate-700';
      if (claim.verdict === 'SUPPORTED') border_color = 'border-emerald-500/70 shadow-emerald-500/10';
      else if (claim.verdict === 'CONTRADICTED') border_color = 'border-rose-500/70 shadow-rose-500/10';
      else if (claim.verdict === 'PARTIALLY_SUPPORTED') border_color = 'border-amber-500/70 shadow-amber-500/10';

      computedNodes.push({
        id: node_id,
        type: 'default',
        position: { x: claimX, y: idx * claimYGap + 50 },
        data: {
          label: (
            <div className="text-left font-sans max-w-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {claim.claim_id.toUpperCase()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  claim.verdict === 'SUPPORTED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                  claim.verdict === 'CONTRADICTED' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                  claim.verdict === 'PARTIALLY_SUPPORTED' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {claim.verdict.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-100 line-clamp-3 leading-snug">{claim.claim_text}</p>
            </div>
          )
        },
        className: `!rounded-xl !bg-[#0b0f19] !border-2 ${border_color} !w-72 shadow-xl`
      });

      // 2. Connect to Evidence (Build Edges & target nodes)
      claim.evidence_ids.forEach((ev_id) => {
        const ev = evidence.find((e) => e.evidence_id === ev_id);
        if (!ev) return;

        const ev_node_id = `node_${ev.evidence_id}`;

        let edge_color = '#334155';
        if (ev.relationship === 'SUPPORTS') edge_color = '#10b981';
        else if (ev.relationship === 'CONTRADICTS') edge_color = '#f43f5e';
        else if (ev.relationship === 'CONTEXTUALIZES') edge_color = '#3b82f6';

        computedEdges.push({
          id: `edge_${claim.claim_id}_${ev.evidence_id}`,
          source: node_id,
          target: ev_node_id,
          animated: ev.relationship === 'SUPPORTS' || ev.relationship === 'CONTRADICTS',
          style: { stroke: edge_color, strokeWidth: 2 }
        });
      });
    });

    // 3. Build Evidence Nodes
    evidence.forEach((ev, idx) => {
      const node_id = `node_${ev.evidence_id}`;
      
      let border_color = 'border-slate-800';
      if (ev.relationship === 'SUPPORTS') border_color = 'border-emerald-500/40';
      else if (ev.relationship === 'CONTRADICTS') border_color = 'border-rose-500/40';
      else if (ev.relationship === 'CONTEXTUALIZES') border_color = 'border-blue-500/40';

      computedNodes.push({
        id: node_id,
        type: 'default',
        position: { x: evidenceX, y: idx * evidenceYGap + 50 },
        data: {
          label: (
            <div className="text-left font-sans max-w-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {ev.evidence_id.toUpperCase()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  ev.credibility_indicator === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {ev.credibility_indicator} TRUST
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-200 truncate">{ev.source_title}</h5>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic">"{ev.relevant_passage}"</p>
            </div>
          )
        },
        className: `!rounded-xl !bg-[#030712] !border-2 ${border_color} !w-80 shadow-lg`
      });
    });

    return { nodes: computedNodes, edges: computedEdges };
  }, [claims, evidence]);

  // Handle node selection to display details
  const onNodeClick = (event, node) => {
    const cleanId = node.id.replace('node_', '');
    const matchedEv = evidence.find((e) => e.evidence_id === cleanId);
    if (matchedEv) {
      setSelectedNode({ type: 'evidence', data: matchedEv });
      return;
    }

    const matchedClaim = claims.find((c) => c.claim_id === cleanId);
    if (matchedClaim) {
      setSelectedNode({ type: 'claim', data: matchedClaim });
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h4 className="text-base font-extrabold text-white">Interactive Evidence Graph</h4>
          <p className="text-xs text-slate-400 mt-0.5">Click any node to inspect claims and full citation details.</p>
        </div>
        <div className="flex gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> Supports</div>
          <div className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span> Contradicts</div>
          <div className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span> Context</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flow Canvas */}
        <div className="lg:col-span-8 border border-slate-800 rounded-xl h-[420px] bg-[#030712] overflow-hidden relative shadow-inner">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#1e293b" gap={16} size={1} />
            <Controls />
          </ReactFlow>
        </div>

        {/* Node Inspector Panel */}
        <div className="lg:col-span-4 bg-[#030712]/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[420px] overflow-y-auto">
          {selectedNode ? (
            <div>
              {selectedNode.type === 'evidence' ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase">
                      Evidence Source
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{selectedNode.data.publication_date || "Undated"}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 leading-snug">
                    {selectedNode.data.source_title}
                  </h4>
                  {selectedNode.data.source_url && (
                    <a
                      href={selectedNode.data.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 mb-4 font-bold"
                    >
                      Visit Source URL <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mt-2 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1.5">Relevant Passage</div>
                    <p className="text-xs text-slate-300 leading-relaxed italic font-normal">
                      "{selectedNode.data.relevant_passage}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow-sm">
                      <div className="text-[9px] text-slate-400 uppercase font-black">Relation</div>
                      <div className={`text-xs font-black uppercase mt-1 ${
                        selectedNode.data.relationship === 'SUPPORTS' ? 'text-emerald-400' :
                        selectedNode.data.relationship === 'CONTRADICTS' ? 'text-rose-400' : 'text-blue-400'
                      }`}>
                        {selectedNode.data.relationship}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center shadow-sm">
                      <div className="text-[9px] text-slate-400 uppercase font-black">Source Quality</div>
                      <div className={`text-xs font-black uppercase mt-1 ${
                        selectedNode.data.credibility_indicator === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {selectedNode.data.credibility_indicator}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase">
                      Claim Factual Node
                    </span>
                  </div>
                  <h4 className="text-xs text-slate-400 font-bold uppercase mb-1">Extracted Statement:</h4>
                  <p className="text-sm font-bold text-white leading-relaxed mb-4">
                    "{selectedNode.data.claim_text}"
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase font-black mb-1">AI Verdict Analysis</div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {selectedNode.data.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="my-auto text-center py-12">
              <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Node Inspector</div>
              <p className="text-[11px] text-slate-500 mt-2 px-6">
                Click on any node in the evidence flow chart to audit its full contents.
              </p>
            </div>
          )}

          {selectedNode && (
            <button
              onClick={() => setSelectedNode(null)}
              className="mt-6 w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              Clear Inspector selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
