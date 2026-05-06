import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, ArrowRight, Zap, Eye, ShieldCheck,
    Loader2, Globe, Activity, FileText, ShieldAlert, Users2, CheckCircle2, Microscope,
    Database, Scale, Network, Share2, Briefcase, FileSearch, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapSection from '../components/RoadmapSection';
import SupportSection from '../components/SupportSection';
import ServiceMarquee from '../components/ServiceMarquee';
import NeuralDataNetwork from '../components/ui/NeuralDataNetwork';

const LoadingOverlay = ({ visible, label }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9000] bg-[#0f172a]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
            >
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-blue-500/20 flex items-center justify-center">
                        <Loader2 className="text-blue-500 animate-spin" size={36} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-white font-black uppercase tracking-[0.3em] text-sm">Loading Sovereign Intelligence...</p>
                    <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest opacity-70">{label}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadLabel, setLoadLabel] = useState('');

    const launchWorkspace = (label, path) => {
        setLoadLabel(label);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(path);
        }, 1500);
    };

    return (
        <div className="home-container bg-[#080d1a]" style={{ background: 'transparent' }}>
            <LoadingOverlay visible={loading} label={loadLabel} />
            <NeuralDataNetwork />

            {/* HERO SECTION */}
            <section className="relative flex flex-col items-center justify-center px-4 pb-20 pt-12" style={{ minHeight: '85vh' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <svg width="100%" height="100%" className="w-full h-full">
                        <pattern id="nodes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="#3b82f6" />
                            <path d="M 2 2 L 100 100" stroke="#3b82f6" strokeWidth="0.2" opacity="0.1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#nodes)" />
                    </svg>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-6xl mx-auto relative z-10 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-6 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                            Sovereign Digital Financial Intelligence OS
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-[1.05] max-w-5xl">
                        Digital Financial Investigation <br className="hidden lg:block" /> & Intelligence Platform
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl leading-relaxed">
                        Monitor blockchain activity through forensic-grade intelligence workflows. Designed for investigators, compliance officers, CA firms, and security teams.
                    </p>

                    {/* CALLS TO ACTION */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full max-w-md justify-center">
                        <button
                            onClick={() => launchWorkspace('Initializing Central Workspace...', '/command-center')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            Open Intelligence Workspace <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => launchWorkspace('Accessing Forensic Lab...', '/forensic-lab')}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            Launch Forensic Lab
                        </button>
                    </div>

                    {/* LIVE INVESTIGATION WORKFLOW VISUALIZATION */}
                    <div className="w-full bg-[#0d1425]/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><Activity size={80} className="text-blue-500" /></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8 text-center flex items-center justify-center gap-2">
                            <Network size={14} /> LIVE FORENSIC INVESTIGATION WORKFLOW
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                            {/* Connector Line on Desktop */}
                            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] border-t border-dashed border-slate-800 z-0" />

                            {[
                                { step: '01', title: 'Target Wallet', desc: 'Suspect entry point classification & profiling', icon: Search, color: 'blue' },
                                { step: '02', title: 'Multi-Hop Trace', desc: 'Recursive fund flow outbound mapping', icon: Share2, color: 'purple' },
                                { step: '03', title: 'Risk Analysis', desc: 'Heuristic anomaly detection & score sync', icon: ShieldAlert, color: 'rose' },
                                { step: '04', title: 'Evidence Report', desc: 'Admissible PDF dossier compilation', icon: FileText, color: 'indigo' },
                                { step: '05', title: 'Case Archive', desc: 'Encrypted storage in multi-tenant logs', icon: Database, color: 'emerald' }
                            ].map((node, i) => (
                                <div key={i} className="flex flex-col items-center relative z-10 group">
                                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 transition-all ${node.color === 'blue' ? 'bg-blue-950/40 border-blue-500/30 text-blue-400' :
                                        node.color === 'purple' ? 'bg-purple-950/40 border-purple-500/30 text-purple-400' :
                                            node.color === 'rose' ? 'bg-rose-950/40 border-rose-500/30 text-rose-400' :
                                                node.color === 'indigo' ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-400' :
                                                    'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                                        }`}>
                                        <node.icon size={22} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-500 mb-1">{node.step}</span>
                                    <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-wider">{node.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[150px]">{node.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            </section>

            {/* PRODUCT CORE CORE CAPABILITIES */}
            <section className="px-4 py-24 max-w-7xl mx-auto border-t border-slate-900">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                        Institutional Architecture & Core Capabilities
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-black text-white">
                        Designed for High-Consequence Digital Auditing
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Multi-Hop Fund Flow Visualizer',
                            desc: 'Perform recursive, outbound-branching tracing on target addresses to map multi-layer fund dissipation strategies with ease.',
                            icon: Share2,
                            badge: 'Investigation Module'
                        },
                        {
                            title: 'Case Management Workspace',
                            desc: 'Securely isolate, annotate, tag, and aggregate target wallets into multi-tenant cases synced directly with Firestore.',
                            icon: Briefcase,
                            badge: 'Intelligence Workspace'
                        },
                        {
                            title: 'Behavioral Risk Intelligence',
                            desc: 'Utilize automated rule weights combined with synthetic ML anomaly detectors to flag complex dusting and burst pattern risks.',
                            icon: ShieldAlert,
                            badge: 'Verification Engine'
                        },
                        {
                            title: 'Evidence-Grade Dossier Reporting',
                            desc: 'Generate signed, court-admissible PDF intelligence packages with transaction hashes, timelines, and audit parameters.',
                            icon: FileText,
                            badge: 'Evidence Export'
                        },
                        {
                            title: 'CA Financial Compliance Layer',
                            desc: 'Audit Virtual Digital Asset (VDA) yields, calculate 1% TDS exposures, and ensure local AML compliance standards.',
                            icon: Scale,
                            badge: 'Compliance System'
                        },
                        {
                            title: 'Sovereign Network Sentinels',
                            desc: 'Continuous real-time mempool scanning and state verification systems acting as decentralized blockchain monitors.',
                            icon: Globe,
                            badge: 'Forensic System'
                        }
                    ].map((feat, idx) => (
                        <div key={idx} className="glass p-8 rounded-2xl border border-slate-800/80 bg-slate-900/10 hover:border-slate-700/60 transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                        <feat.icon size={18} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded">
                                        {feat.badge}
                                    </span>
                                </div>
                                <h4 className="text-white font-black text-sm uppercase tracking-wider mb-3">{feat.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="w-full max-w-full overflow-hidden"><RoadmapSection /></div>
            <div className="w-full max-w-full overflow-hidden"><ServiceMarquee /></div>
            <div className="w-full max-w-full overflow-hidden"><SupportSection /></div>
        </div>
    );
};

export default Home;
