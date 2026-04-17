import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { INTELLIGENCE_DATABASE } from '../../data/intelligenceDatabase';

const getBadgeStyles = (status) => {
    switch (status) {
        case 'CRITICAL':      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        case 'HIGH RISK':     return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'INFORMATIONAL': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default:              return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
};

const getBarColor = (status) => {
    switch (status) {
        case 'CRITICAL':  return 'bg-rose-500';
        case 'HIGH RISK': return 'bg-orange-500';
        default:          return 'bg-blue-500';
    }
};

const getSideAccent = (status) => {
    switch (status) {
        case 'CRITICAL':  return 'bg-rose-500';
        case 'HIGH RISK': return 'bg-orange-500';
        default:          return 'bg-blue-500';
    }
};

const IntelligenceCard = ({ item, index, isActive, onDeepDive }) => (
    <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07, ease: 'easeOut' }}
        className={`relative border rounded-2xl p-4 transition-all duration-300 group overflow-hidden cursor-pointer ${
            isActive
                ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.12)]'
                : 'bg-[#0D1117] border-white/5 hover:border-white/10'
        }`}
    >
        {/* Severity side-bar accent */}
        <div className={`absolute top-0 left-0 w-0.5 h-full ${getSideAccent(item.status)} opacity-40 group-hover:opacity-100 transition-opacity`} />

        {/* Badge + timestamp */}
        <div className="flex justify-between items-center mb-2 pl-2">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getBadgeStyles(item.status)}`}>
                {item.status}
            </span>
            <span className="text-[9px] text-slate-600 font-bold uppercase">{item.time}</span>
        </div>

        {/* Case title */}
        <h4 className="text-sm font-extrabold text-white mb-1 leading-snug pl-2 group-hover:text-blue-300 transition-colors">
            {item.caseTitle}
        </h4>

        {/* Confidence meter */}
        <div className="pl-2 mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                <span className="text-[9px] font-black text-white">{item.riskScore}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.riskScore}%` }}
                    transition={{ duration: 1.1, delay: 0.3 + index * 0.07 }}
                    className={`h-full ${getBarColor(item.status)}`}
                />
            </div>
        </div>

        {/* Plain English "Why" */}
        <p className="pl-2 text-[11px] text-slate-400 font-medium leading-relaxed italic mb-3 border-l border-white/10">
            {item.why}
        </p>

        {/* Deep Dive — functional button */}
        <button
            onClick={() => onDeepDive(item)}
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                    ? 'bg-blue-500 text-white border border-blue-400 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white'
            }`}
        >
            <ExternalLink size={11} />
            {isActive ? 'Analyzing...' : 'Deep Dive'}
        </button>
    </motion.div>
);

const IntelligenceFeed = ({ isDemo, activeCaseId, onDeepDive }) => (
    <div className="space-y-3">
        {isDemo && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <AlertCircle className="text-amber-400 shrink-0" size={13} />
                <p className="text-[9px] font-black text-amber-300 uppercase tracking-widest">
                    Ronin Bridge Simulation Active
                </p>
            </div>
        )}
        {INTELLIGENCE_DATABASE.map((item, idx) => (
            <IntelligenceCard
                key={item.id}
                item={item}
                index={idx}
                isActive={activeCaseId === item.id}
                onDeepDive={onDeepDive}
            />
        ))}
    </div>
);

export default IntelligenceFeed;
