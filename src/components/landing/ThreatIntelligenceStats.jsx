import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
    Share2, ShieldAlert, FileText, 
    Network, Activity, FileSearch
} from 'lucide-react';

const statsData = [
    { 
        title: 'Wallets Investigated', 
        value: 124500, 
        suffix: '+', 
        icon: FileSearch, 
        color: 'blue', 
        desc: 'Deep-dive analytical profiles executed on suspected threat actors and entry points.' 
    },
    { 
        title: 'Multi-Hop Traces Analyzed', 
        value: 4850000, 
        suffix: '+', 
        icon: Share2, 
        color: 'purple', 
        desc: 'Recursive fund flow vectors mapped across decentralized protocol layers.' 
    },
    { 
        title: 'High-Risk Activities Flagged', 
        value: 84200, 
        suffix: '', 
        icon: ShieldAlert, 
        color: 'rose', 
        desc: 'Immediate anomalies detected and quarantined by heuristic scoring engines.' 
    },
    { 
        title: 'Intelligence Reports Generated', 
        value: 15600, 
        suffix: '+', 
        icon: FileText, 
        color: 'emerald', 
        desc: 'Cryptographically sealed evidentiary dossiers exported for legal authorities.' 
    },
    { 
        title: 'Blockchain Networks Monitored', 
        value: 52, 
        suffix: '', 
        icon: Network, 
        color: 'cyan', 
        desc: 'Continuous Layer 1 & Layer 2 protocol state synchronization and indexing.' 
    },
    { 
        title: 'Suspicious Patterns Detected', 
        value: 395000, 
        suffix: '+', 
        icon: Activity, 
        color: 'orange', 
        desc: 'Known threat cluster behaviors matched against live mempool and historical data.' 
    }
];

const AnimatedCounter = ({ value, suffix }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        
        let startTimestamp = null;
        const duration = 2500; // 2.5 seconds for animation

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutExpo easing function for slick deceleration
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setDisplayValue(Math.floor(easeOut * value));
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }, [isInView, value]);

    return (
        <span ref={ref} className="font-mono tabular-nums">
            {displayValue.toLocaleString()}{suffix}
        </span>
    );
};

const ThreatIntelligenceStats = () => {
    return (
        <section className="px-4 py-24 border-t border-slate-900 relative overflow-hidden bg-[#030712]">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Section Header */}
                <div className="text-center space-y-4 mb-20">
                    <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                            Platform Telemetry
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                        Digital Financial Threat Intelligence
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
                        Live operational metrics from the Blockchain Sentinel network. Our intelligence engine continuously processes on-chain states to identify, trace, and isolate illicit cryptographic activity.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsData.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-[#0a0f1d]/60 border border-slate-800/80 rounded-2xl p-6 relative group overflow-hidden hover:border-slate-700/80 hover:bg-[#0c1222] transition-colors"
                        >
                            {/* Card Hover Gradient Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${
                                stat.color === 'blue' ? 'from-blue-500/[0.02]' : 
                                stat.color === 'purple' ? 'from-purple-500/[0.02]' : 
                                stat.color === 'rose' ? 'from-rose-500/[0.02]' : 
                                stat.color === 'emerald' ? 'from-emerald-500/[0.02]' : 
                                stat.color === 'cyan' ? 'from-cyan-500/[0.02]' : 
                                'from-orange-500/[0.02]'
                            } to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110 ${
                                    stat.color === 'blue' ? 'bg-blue-950/40 border-blue-500/30 text-blue-400 shadow-blue-500/10' : 
                                    stat.color === 'purple' ? 'bg-purple-950/40 border-purple-500/30 text-purple-400 shadow-purple-500/10' : 
                                    stat.color === 'rose' ? 'bg-rose-950/40 border-rose-500/30 text-rose-400 shadow-rose-500/10' : 
                                    stat.color === 'emerald' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' : 
                                    stat.color === 'cyan' ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 shadow-cyan-500/10' : 
                                    'bg-orange-950/40 border-orange-500/30 text-orange-400 shadow-orange-500/10'
                                }`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[8px] font-mono text-slate-500 border border-slate-800 bg-slate-900/60 px-2 py-0.5 rounded tracking-[0.2em] uppercase">
                                    Metric_0{idx + 1}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-baseline gap-1">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                                    {stat.title}
                                </h4>
                                
                                <div className="w-8 h-[2px] bg-slate-800 mb-4 group-hover:w-16 transition-all duration-500" />
                                
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    {stat.desc}
                                </p>
                            </div>
                            
                            {/* Live Sync Status indicator */}
                            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black text-emerald-500 font-mono tracking-widest uppercase">Live Sync</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThreatIntelligenceStats;
