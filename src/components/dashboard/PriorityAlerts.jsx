import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Flag, Eye, Ban } from 'lucide-react';
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
                            className={`bg-[#161B22]/50 border rounded-2xl p-5 hover:border-blue-500/30 transition-all group cursor-pointer ${
                                isActive ? 'border-blue-500/50 shadow-[0_4px_25px_rgba(59,130,246,0.12)] scale-[1.01]' : 'border-white/5'
                            }`}
                        >
                            {/* Risk badge + Score */}
                            <div className="flex justify-between items-center mb-3">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getRiskColor(item.riskScore)}`}>
                                    Risk Score: {item.riskScore}
                                </span>
                                <span className="text-[9px] text-slate-600 font-bold uppercase">{item.id}</span>
                            </div>

                            {/* Case Title */}
                            <h3 className="text-base font-black text-white mb-2 group-hover:text-primary-bright transition-colors">
                                {item.caseTitle}
                            </h3>

                            {/* Human-readable explanation — the key missing piece */}
                            <p className="text-slate-400 text-[12px] leading-relaxed mb-5 font-medium">
                                {getPlainSummary(item)}
                            </p>

                            {/* Suggested next action */}
                            <div className="mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Suggested: <span className="text-blue-400">{action.label}</span>
                            </div>

                            <button className={`w-full py-3 border rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${
                                isActive
                                    ? 'bg-primary-bright text-white border-primary-bright shadow-lg'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                            }`}>
                                <ActionIcon size={14} />
                                {action.label}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PriorityAlerts;
