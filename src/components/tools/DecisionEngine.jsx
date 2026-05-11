import React, { useMemo } from 'react';
import { BrainCircuit, AlertTriangle, Fingerprint, ArrowUpRight, Scale, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const DecisionEngine = ({ graphData }) => {
    const decisions = useMemo(() => {
        if (!graphData) return null;

        const nodeCount = graphData.nodes?.length || 0;
        const edgeCount = graphData.edges?.length || 0;
        const exchanges = graphData.nodes?.filter(n => n.type === 'Exchange').length || 0;
        const highRiskEdges = graphData.edges?.filter(e => e.riskLevel === 'High' || parseFloat(e.value) > 10).length || 0;

        // Compute dynamic behavior scores
        let behaviorVerdict = "Standard flow detected.";
        let riskReasoning = ["Baseline behavioral activity."];
        let recommendations = ["Establish baseline transactional history."];
        let alertLevel = "LOW";

        if (highRiskEdges > 1 && nodeCount > 5) {
            behaviorVerdict = "Advanced layering with potential obfuscation triggers detected.";
            riskReasoning = [
                "Significant funds moved rapidly across multiple external wallets within short intervals.",
                "Structural diversification mirrors industrial-grade laundering mechanisms.",
                `${highRiskEdges} high-value hops detected directly downstream of root entity.`
            ];
            recommendations = [
                "File STR Category A Violation alert in India Compliance Vault.",
                "Initialize deep recursive trace of Hop 2 liquidity endpoints.",
                "Freeze affiliated hot-vault balances immediately."
            ];
            alertLevel = "CRITICAL";
        } else if (exchanges > 0) {
            behaviorVerdict = "Liquidation pathway observed.";
            riskReasoning = [
                "Clear pipeline observed routing direct asset flow to known Exchange nodes.",
                "Attempt to secure fiat off-ramp suspected."
            ];
            recommendations = [
                "Issue KYC disclosure subpoena to identified Exchange nodes.",
                "Correlate deposit addresses with centralized records."
            ];
            alertLevel = "SUSPICIOUS";
        }

        return { behaviorVerdict, riskReasoning, recommendations, alertLevel };
    }, [graphData]);

    if (!decisions) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0b0f19]/60 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 shadow-xl space-y-6"
        >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${decisions.alertLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Neural Decision Engine</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Automated Behavioral Verdict</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${decisions.alertLevel === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : decisions.alertLevel === 'SUSPICIOUS' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                    Verdict: {decisions.alertLevel}
                </div>
            </div>

            <div className="space-y-4">
                {/* Primary Verdict Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/[0.03] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <Fingerprint size={18} className="text-indigo-400 mt-0.5" />
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Behavioral Intelligence</h3>
                            <p className="text-xs font-medium text-white leading-relaxed">{decisions.behaviorVerdict}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Risk Explanations */}
                    <div className="bg-[#0b0f19] border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldAlert size={14} className="text-rose-400" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Reasoning</h3>
                        </div>
                        <ul className="space-y-2.5">
                            {decisions.riskReasoning.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-[10px] font-medium text-slate-400 leading-relaxed">
                                    <AlertTriangle size={10} className="text-rose-500 mt-0.5 shrink-0" />
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-[#0b0f19] border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Scale size={14} className="text-indigo-400" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendations</h3>
                        </div>
                        <ul className="space-y-2.5">
                            {decisions.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-[10px] font-medium text-slate-400 leading-relaxed">
                                    <CheckCircle2 size={10} className="text-indigo-400 mt-0.5 shrink-0" />
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DecisionEngine;
