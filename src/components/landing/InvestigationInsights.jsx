import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, ChevronRight } from 'lucide-react';

const insightsData = [
    {
        id: "INS-001",
        title: "How Multi-Hop Laundering Works",
        category: "LAUNDERING PATTERNS",
        url: "https://www.chainalysis.com/blog/what-is-cryptocurrency-money-laundering/",
        preview: "A deep dive into the operational mechanics of chain-hopping, mixer integration, and programmatic dispersion used by APTs.",
        readTime: "8 MIN READ",
        color: "rose"
    },
    {
        id: "INS-002",
        title: "Understanding Cross-Chain Tracing",
        category: "TRACING CONCEPTS",
        url: "https://www.elliptic.co/blog/cross-chain-crime",
        preview: "Bridging the gap: Methods for tracking illicit assets as they move between disparate Layer 1 and Layer 2 protocols.",
        readTime: "12 MIN READ",
        color: "blue"
    },
    {
        id: "INS-003",
        title: "Why Investigators Need Fund Flow Intelligence",
        category: "FORENSIC WORKFLOWS",
        url: "https://ciphertrace.com/cryptocurrency-intelligence/",
        preview: "The critical difference between static blockchain exploration and dynamic, heuristic-driven fund flow visualization.",
        readTime: "6 MIN READ",
        color: "purple"
    },
    {
        id: "INS-004",
        title: "How Suspicious Wallet Networks Operate",
        category: "CYBERCRIME PATTERNS",
        url: "https://blog.chainalysis.com/reports/cryptocurrency-scams/",
        preview: "Identifying programmatic clustering, wash trading rings, and zero-fee proxy networks utilized in modern exploits.",
        readTime: "10 MIN READ",
        color: "emerald"
    },
    {
        id: "INS-005",
        title: "Challenges In Blockchain Compliance",
        category: "COMPLIANCE INTELLIGENCE",
        url: "https://www.fatf-gafi.org/en/topics/virtual-assets.html",
        preview: "Navigating regulatory gray zones, identifying indirect exposure, and implementing strict Travel Rule data sharing protocols.",
        readTime: "7 MIN READ",
        color: "orange"
    },
    {
        id: "INS-006",
        title: "Heuristic Anomaly Detection in DeFi",
        category: "INVESTIGATION CHALLENGES",
        url: "https://certik.com/resources/blog",
        preview: "Analyzing flash loan payloads and re-entrancy vectors to build predictive threat models in decentralized finance.",
        readTime: "15 MIN READ",
        color: "cyan"
    }
];

const InvestigationInsights = () => {
    return (
        <section className="px-4 py-24 border-t border-slate-900 relative overflow-hidden bg-[#070b14]">
            {/* Background Texture & Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/[0.03] rounded-full blur-[120px] pointer-events-none" />
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #fff 25%, #fff 26%, transparent 27%, transparent 74%, #fff 75%, #fff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #fff 25%, #fff 26%, transparent 27%, transparent 74%, #fff 75%, #fff 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-800/80 pb-8">
                    <div className="space-y-4 max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                                Knowledge Base
                            </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                            Investigation Insights
                        </h3>
                        <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                            Official intelligence briefings, trace methodologies, and operational analyses published by the Blockchain Sentinel threat research team. Designed to elevate forensic capabilities and compliance rigor.
                        </p>
                    </div>
                    
                    <button className="flex-shrink-0 flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group shadow-lg">
                        <BookOpen size={14} className="text-indigo-400" />
                        View Archive Catalog
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-slate-500" />
                    </button>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {insightsData.map((insight, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-[#0a0f1d] border border-slate-800 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:border-slate-600/80 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
                        >
                            {/* Card Glow Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${
                                insight.color === 'rose' ? 'from-rose-500/[0.03]' : 
                                insight.color === 'blue' ? 'from-blue-500/[0.03]' : 
                                insight.color === 'purple' ? 'from-purple-500/[0.03]' : 
                                insight.color === 'emerald' ? 'from-emerald-500/[0.03]' : 
                                insight.color === 'orange' ? 'from-orange-500/[0.03]' : 
                                'from-cyan-500/[0.03]'
                            } to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                            {/* Top decorative accent */}
                            <div className={`absolute top-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-500 ${
                                insight.color === 'rose' ? 'bg-rose-500' : 
                                insight.color === 'blue' ? 'bg-blue-500' : 
                                insight.color === 'purple' ? 'bg-purple-500' : 
                                insight.color === 'emerald' ? 'bg-emerald-500' : 
                                insight.color === 'orange' ? 'bg-orange-500' : 
                                'bg-cyan-500'
                            }`} />

                            <div className="p-6 relative z-10">
                                {/* Metadata Row */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            insight.color === 'rose' ? 'bg-rose-500' : 
                                            insight.color === 'blue' ? 'bg-blue-500' : 
                                            insight.color === 'purple' ? 'bg-purple-500' : 
                                            insight.color === 'emerald' ? 'bg-emerald-500' : 
                                            insight.color === 'orange' ? 'bg-orange-500' : 
                                            'bg-cyan-500'
                                        }`} />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                                            {insight.category}
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold text-slate-600 border border-slate-800/80 bg-slate-900 px-1.5 py-0.5 rounded">
                                        {insight.id}
                                    </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-xl font-black text-white leading-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                                    {insight.title}
                                </h4>

                                {/* Preview */}
                                <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3">
                                    {insight.preview}
                                </p>
                            </div>

                            {/* Bottom Footer Actions */}
                            <div className="p-6 pt-4 border-t border-slate-800/60 flex items-center justify-between relative z-10 bg-slate-950/30">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                    <Clock size={10} /> {insight.readTime}
                                </div>

                                <a 
                                    href={insight.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors group/btn"
                                >
                                    Read Insight
                                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InvestigationInsights;
