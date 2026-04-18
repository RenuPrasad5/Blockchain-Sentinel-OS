import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Flag, Eye, Ban, CheckCircle2 } from 'lucide-react';
import { INTELLIGENCE_DATABASE } from '../../data/intelligenceDatabase';

const PriorityAlerts = ({ onSelectAlert, activeId }) => {
    const getRiskColor = (score) => {
        if (score >= 90) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        if (score >= 70) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    const getActionConfig = (caseTitle) => {
        if (caseTitle.includes('Mixer'))       return { label: 'Flag for Investigation', icon: Flag,  color: 'rose' };
        if (caseTitle.includes('Structuring')) return { label: 'Review Fund Flow',       icon: Eye,   color: 'orange' };
        return                                        { label: 'Block Address',           icon: Ban,   color: 'blue' };
    };

    const getPlainSummary = (item) => {
        if (item.caseTitle.includes('Mixer'))
            return `A wallet just sent funds through a known crypto-mixer (Tornado Cash). This hides who received the money — a common move after a theft.`;
        if (item.caseTitle.includes('Structuring'))
            return `Repeated transactions just under the $10,000 reporting limit. Banks and analysts flag this as deliberate tax or AML evasion.`;
        return `Assets trace back to a phishing exploit. Stolen funds are actively moving toward unregulated offshore accounts.`;
    };

    // Only show top 3 Priority cases
    const priorityCases = INTELLIGENCE_DATABASE.slice(0, 3);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <ShieldAlert className="text-rose-500" size={20} />
                        Priority Intelligence Alerts
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Threats requiring immediate action — written in plain English
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priorityCases.map((item, idx) => {
                    const action = getActionConfig(item.caseTitle);
                    const ActionIcon = action.icon;
                    const isActive = activeId === item.id;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => onSelectAlert(item)}
                            className={`bg-[#161B22]/50 border rounded-2xl p-6 hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col ${
                                isActive ? 'border-blue-500/50 shadow-[0_4px_25px_rgba(59,130,246,0.12)] scale-[1.01]' : 'border-white/5'
                            }`}
                        >
                            {/* AI Risk Layer */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex flex-col gap-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                        item.riskLevel === 'CRITICAL' || item.riskScore > 80 ? 'text-rose-500' : 'text-orange-500'
                                    }`}>
                                        AI Risk Level: {item.riskLevel || 'HIGH'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.riskScore}%` }}
                                                className={`h-full ${item.riskScore > 80 ? 'bg-rose-500' : 'bg-orange-500'}`}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-white">{item.riskScore}</span>
                                    </div>
                                </div>
                                <span className="text-[9px] text-slate-600 font-bold uppercase">{item.id}</span>
                            </div>

                            {/* Case Title */}
                            <h3 className="text-base font-black text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {item.caseTitle}
                            </h3>

                            {/* Plain English "Why this is risky" */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-5 flex-1">
                                <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                                    <span className="text-blue-400/80 font-bold uppercase tracking-widest text-[9px] block mb-1">Expert Insight</span>
                                    {item.whyRisky || getPlainSummary(item)}
                                </p>
                            </div>

                            {/* Suggested next action */}
                            <div className="mb-5 px-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 opacity-60">Suggested Protocol</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                    <CheckCircle2 size={12} />
                                    {item.suggestedAction || action.label}
                                </div>
                            </div>

                            <button className={`w-full py-3.5 border rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                            }`}>
                                <ActionIcon size={14} />
                                Initialize Triage
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PriorityAlerts;
