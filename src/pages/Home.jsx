import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, ArrowRight, Zap, Eye, ShieldCheck,
    Loader2, Globe, Activity, FileText, ShieldAlert, Users2, CheckCircle2, Microscope,
    Database, Scale, Network, Share2, Briefcase, FileSearch, ArrowDown, Download, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapSection from '../components/RoadmapSection';
import SupportSection from '../components/SupportSection';
import ServiceMarquee from '../components/ServiceMarquee';
import NeuralDataNetwork from '../components/ui/NeuralDataNetwork';
import BlockchainCrimeIntelligence from '../components/landing/BlockchainCrimeIntelligence';
import ThreatIntelligenceStats from '../components/landing/ThreatIntelligenceStats';
import InvestigationInsights from '../components/landing/InvestigationInsights';

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
        <div className="home-container" style={{ background: 'transparent' }}>
            <LoadingOverlay visible={loading} label={loadLabel} />
            <NeuralDataNetwork />

            {/* Global Page-Level Background Grid & Glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden z-0">
                <svg width="100%" height="100%" className="w-full h-full">
                    <pattern id="nodes" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="#3b82f6" />
                        <path d="M 2 2 L 100 100" stroke="#3b82f6" strokeWidth="0.2" opacity="0.1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#nodes)" />
                </svg>
            </div>
            
            {/* Atmospheric Ambient Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none z-0" />

            {/* HERO SECTION */}
            <section className="relative flex flex-col px-4 pb-20 pt-12 z-10" style={{ minHeight: '85vh' }}>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left w-full max-w-7xl mx-auto relative z-10 flex flex-col items-start"
                >
                    <div className="inline-flex items-center gap-2 mb-6 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
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
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-start">
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

                    {/* ADVANCED INVESTIGATION WORKFLOW VISUALIZATION */}
                    <div className="w-full mt-4 pt-8 border-t border-slate-800/50">
                        <div className="relative w-full">
                            {/* Desktop Animated Connector Line */}
                            <div className="hidden lg:block absolute top-[36px] left-[8%] right-[8%] h-[2px] z-0">
                                <svg className="w-full h-full overflow-visible">
                                    <line x1="0%" y1="0" x2="100%" y2="0" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4" />
                                    <motion.line 
                                        x1="0%" y1="0" x2="100%" y2="0" 
                                        stroke="url(#workflowGradient)" strokeWidth="2"
                                        animate={{ strokeDashoffset: [0, -24] }}
                                        transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
                                        strokeDasharray="12 12"
                                    />
                                    <defs>
                                        <linearGradient id="workflowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="50%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#ec4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-16 lg:gap-8 relative z-10">
                                {[
                                    {
                                        step: '01',
                                        title: 'Input Wallet Address',
                                        desc: 'Target suspected entry points by routing address payloads into validation systems.',
                                        term: 'TARGET PROFILING',
                                        icon: FileSearch,
                                        glow: 'from-blue-500 to-cyan-500'
                                    },
                                    {
                                        step: '02',
                                        title: 'Trace Multi-Hop Fund Flow',
                                        desc: 'Deploy crawler cycles to reconstruct outbound branching layers across on-chain paths.',
                                        term: 'RECURSIVE MAPPING',
                                        icon: Share2,
                                        glow: 'from-blue-600 to-purple-600'
                                    },
                                    {
                                        step: '03',
                                        title: 'Analyze Risk & Patterns',
                                        desc: 'Trigger custom heuristic filters against cluster anomalies and asset dispersion bursts.',
                                        term: 'RISK WEIGHT AUDIT',
                                        icon: ShieldAlert,
                                        glow: 'from-purple-600 to-indigo-600'
                                    },
                                    {
                                        step: '04',
                                        title: 'Create Investigation Case',
                                        desc: 'Encapsulate profiling trails into isolated containers mapped via sovereign database storage.',
                                        term: 'CASE SYNCHRONIZATION',
                                        icon: Briefcase,
                                        glow: 'from-indigo-600 to-pink-600'
                                    },
                                    {
                                        step: '05',
                                        title: 'Export Evidence Report',
                                        desc: 'Synthesize tamper-proof timelines, charts, and proofs into signed forensic dossiers.',
                                        term: 'DOSSIER COMPILATION',
                                        icon: FileText,
                                        glow: 'from-pink-600 to-rose-600'
                                    }
                                ].map((wf, idx) => (
                                    <div key={idx} className="flex flex-col items-center group relative">
                                        {idx < 4 && (
                                            <div className="lg:hidden absolute bottom-[-48px] left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-slate-800 to-transparent z-0 pointer-events-none" />
                                        )}
                                        <div className="relative mb-6 flex items-center justify-center z-10">
                                            <div className="absolute w-20 h-20 bg-slate-950/80 border border-slate-800/60 rounded-full group-hover:border-slate-600 transition-colors z-0 flex items-center justify-center">
                                                <div className="absolute inset-0 w-full h-full rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 scale-90 group-hover:scale-110 transition-all duration-500 pointer-events-none" />
                                            </div>
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 2 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                                className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${wf.glow} p-[1.5px] z-10 shadow-[0_0_30px_-5px_rgba(0,0,0,0.7)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]`}
                                            >
                                                <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center group-hover:bg-[#0a0f1c] transition-colors text-slate-400 group-hover:text-white">
                                                    <wf.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                                                </div>
                                            </motion.div>
                                            <div className="absolute -bottom-2 bg-[#0a0f1c] border border-slate-800 px-2 py-0.5 rounded font-mono text-[8px] font-black tracking-widest text-slate-500 group-hover:text-blue-400 group-hover:border-blue-900/60 z-20 transition-colors shadow-xl shadow-slate-950">
                                                PHASE-{wf.step}
                                            </div>
                                        </div>
                                        <div className="text-center flex flex-col items-center px-4 relative z-10">
                                            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">
                                                {wf.term}
                                            </span>
                                            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3 leading-tight max-w-[160px] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300">
                                                {wf.title}
                                            </h4>
                                            <div className="w-6 h-[1px] bg-slate-800 mb-4 group-hover:w-12 group-hover:bg-blue-500/60 transition-all duration-500" />
                                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                                                {wf.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </section>

            {/* WHO IT IS BUILT FOR */}
            <section className="px-4 py-24 max-w-7xl mx-auto relative border-t border-slate-900">
                {/* Background Glowing Accents */}
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="text-center space-y-4 mb-16 relative z-10">
                    <div className="inline-flex items-center gap-2 mb-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">
                            Target Operator Profiles
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
                        Who Blockchain Sentinel OS Is Built For
                    </h3>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto font-medium">
                        Enterprise-grade forensic infrastructure engineered for high-consequence blockchain auditing and analytical roles.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
                    {[
                        {
                            title: 'Investigators',
                            desc: 'Trace suspicious wallet activity and analyze fund movement.',
                            icon: Microscope,
                            accent: 'blue',
                            bullets: ['Wallet Activity Tracing', 'Fund Flow Mapping', 'Forensic Evidence Trails']
                        },
                        {
                            title: 'CA Firms',
                            desc: 'Review wallet transactions and compliance workflows.',
                            icon: Scale,
                            accent: 'purple',
                            bullets: ['VDA Yield Auditing', '1% TDS Calculations', 'Tax Compliance Reports']
                        },
                        {
                            title: 'Compliance Teams',
                            desc: 'Monitor risk exposure and suspicious behaviors.',
                            icon: ShieldCheck,
                            accent: 'blue',
                            bullets: ['Risk Exposure Limits', 'AML Pattern Detection', 'Rule-based Triggers']
                        },
                        {
                            title: 'Cybercrime Analysts',
                            desc: 'Investigate multi-hop fund flow intelligence.',
                            icon: Network,
                            accent: 'purple',
                            bullets: ['Multi-Hop Intelligence', 'Decentralized Scanning', 'Clustering Analysis']
                        },
                        {
                            title: 'Web3 Startups & Exchanges',
                            desc: 'Analyze wallet exposure and operational risk.',
                            icon: Zap,
                            accent: 'blue',
                            bullets: ['Operational Risk Matrix', 'Real-time API Audits', 'KYT Verification Controls']
                        }
                    ].map((profile, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="relative group flex flex-col bg-[#0d1425]/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md transition-all overflow-hidden hover:border-slate-700/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                        >
                            {/* Dynamic glow overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${profile.accent === 'blue' ? 'from-blue-500/[0.02]' : 'from-purple-500/[0.02]'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                            
                            {/* Top neon line */}
                            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${profile.accent === 'blue' ? 'from-blue-500/40 to-cyan-500/0' : 'from-purple-500/40 to-indigo-500/0'} opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-slate-400 group-hover:text-white transition-colors ${profile.accent === 'blue' ? 'bg-blue-950/30 border-blue-500/20 group-hover:border-blue-500/50' : 'bg-purple-950/30 border-purple-500/20 group-hover:border-purple-500/50'}`}>
                                            <profile.icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <span className="text-[8px] font-mono font-black uppercase tracking-widest text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60">
                                            ROLE-{(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    
                                    <h4 className="text-white font-black text-sm uppercase tracking-wider mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300">
                                        {profile.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed mb-6 font-medium">
                                        {profile.desc}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-800/60">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`w-1.5 h-[1px] ${profile.accent === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Core Use Cases</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {profile.bullets.map((bullet, bIdx) => (
                                            <li key={bIdx} className="flex items-start gap-2 text-[10px] text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                                                <span className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${profile.accent === 'blue' ? 'bg-blue-500/60' : 'bg-purple-500/60'}`} />
                                                <span className="leading-tight">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* LIVE INTELLIGENCE FEED */}
            <BlockchainCrimeIntelligence />

            {/* THREAT INTELLIGENCE STATS */}
            <ThreatIntelligenceStats />

            {/* WHY BLOCKCHAIN SENTINEL OS (COMPARISON SECTION) */}
            <section className="px-4 py-24 max-w-7xl mx-auto border-t border-slate-900 relative overflow-hidden">
                {/* Dynamic ambient background dots */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                </div>

                <div className="text-center space-y-4 mb-20 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                            INVESTIGATION-FIRST PLATFORM
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
                        Why Blockchain Sentinel
                    </h3>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
                        We engineered an intelligence command system from the ground up. Sentinel OS doesn't just track ledgers; it enables full-spectrum operational auditing and cryptographic prosecution support.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto relative z-10">
                    
                    {/* TRADITIONAL EXPLORERS (RED CONTRAST) */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        className="bg-[#0a0f1b]/40 border border-rose-950/20 rounded-3xl p-8 relative group transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-900/20 to-transparent opacity-50" />

                        <div className="flex items-center justify-between mb-8 border-b border-slate-900 pb-6">
                            <div>
                                <span className="text-[8px] font-mono font-bold text-rose-500/80 uppercase tracking-widest block mb-1">TRADITIONAL TOOLS</span>
                                <h4 className="text-lg font-black text-slate-400 tracking-wide uppercase">Blockchain Explorers</h4>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-950/10 border border-rose-900/20 flex items-center justify-center text-rose-500/50">
                                <Eye size={18} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'Raw Transaction Viewing', desc: 'Displays flat list of hashes requiring manual, linear interpretation.', icon: Eye },
                                { title: 'Simple Wallet Lookup', desc: 'Provides single point balance queries without flow vectors.', icon: Search },
                                { title: 'Generic Dashboards', desc: 'Displays basic network metrics devoid of threat intelligence vectors.', icon: Database },
                                { title: 'Basic CSV Exports', desc: 'Raw data dumps without chronological verification or custody chains.', icon: Download },
                                { title: 'Transaction Browsing', desc: 'Limited to chronological ledger inspection for casual observers.', icon: Globe }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 group/row">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-5 h-5 rounded-full border border-rose-950/30 bg-rose-950/10 flex items-center justify-center text-rose-600/80 text-[10px] font-black font-mono">
                                            ×
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 group-hover/row:text-slate-300 transition-colors">{item.title}</h5>
                                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* SENTINEL OS (BLUE/CYAN PREMIUM CONTRAST) */}
                    <motion.div 
                        whileHover={{ y: -6, scale: 1.005 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="bg-[#0d1425]/80 border border-blue-500/20 rounded-3xl p-8 relative group shadow-[0_20px_50px_-15px_rgba(59,130,246,0.05)] transition-all hover:border-blue-500/40 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.1)]"
                    >
                        {/* Background Neon Pulse Accent */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] via-indigo-500/[0.01] to-transparent opacity-100 transition-opacity pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Glowing Orb overlay */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

                        <div className="flex items-center justify-between mb-8 border-b border-slate-800/80 pb-6 relative z-10">
                            <div>
                                <div className="text-[8px] font-mono font-black text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30 inline-block tracking-widest uppercase mb-2">
                                    OPERATIONAL FORENSICS
                                </div>
                                <h4 className="text-lg font-black text-white tracking-wider uppercase">Blockchain Sentinel OS</h4>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform">
                                <ShieldCheck size={22} />
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {[
                                { title: 'Investigation Workflows', desc: 'Dynamic, graph-based interfaces tracking entity relationship models in real-time.', icon: Network },
                                { title: 'Multi-Hop Tracing Intelligence', desc: 'Automatic, multi-layer recursive crawlers parsing Layer 1/2 asset jumps.', icon: Share2 },
                                { title: 'Case-Centric Investigations', desc: 'Isolated sandbox containers holding targeted entities, tags, metadata and notes.', icon: Briefcase },
                                { title: 'Evidence-Grade Reporting', desc: 'Cryptographically sealed PDF dossiers featuring full audit parameters prepared for legal submittal.', icon: FileText },
                                { title: 'Compliance & Forensic Loops', desc: 'Comprehensive KYT telemetry, 1% TDS VDA compliant metrics, and heuristic weights.', icon: Scale }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 group/row">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-5 h-5 rounded-full border border-blue-500/30 bg-blue-950/50 flex items-center justify-center text-blue-400 text-[9px] font-black shadow-[0_0_10px_rgba(59,130,246,0.2)] group-hover/row:bg-blue-500 group-hover/row:text-slate-950 transition-all font-mono">
                                            ✓
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-white text-xs font-black uppercase tracking-wider mb-1 group-hover/row:text-blue-400 transition-colors">{item.title}</h5>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* REAL-WORLD USE CASES SECTION */}
            <section className="px-4 py-24 max-w-7xl mx-auto border-t border-slate-900 relative overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="text-center space-y-4 mb-20 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                            Operational Playbooks
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
                        Real-World Investigation Use Cases
                    </h3>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
                        Designed for investigators, compliance teams, CA firms, and cybercrime analysts. Convert raw telemetry into actionable case resolutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {[
                        {
                            title: 'Suspicious Wallet Investigation',
                            summary: 'Trace multi-hop wallet activity connected to high-frequency structuring behaviors or dust anomalies.',
                            outcome: 'Isolated 4 interconnected proxy nodes and mapped recursive transfers within minutes.',
                            severity: 'CRITICAL',
                            severityClass: 'text-rose-400 bg-rose-950/30 border-rose-500/30',
                            glowClass: 'from-rose-500/[0.02]',
                            icon: FileSearch
                        },
                        {
                            title: 'Exchange Exposure Analysis',
                            summary: 'Monitor direct asset transfers and proximity exposure profiles relative to sanctioned pools.',
                            outcome: 'Synthesized a comprehensive KYT risk coefficient rating for immediate entity clearing.',
                            severity: 'HIGH RISK',
                            severityClass: 'text-orange-400 bg-orange-950/30 border-orange-500/30',
                            glowClass: 'from-orange-500/[0.02]',
                            icon: Globe
                        },
                        {
                            title: 'Crypto Tax Review & Audit',
                            summary: 'Perform granular historical tracking of DeFi yields, computing precise local compliance liabilities.',
                            outcome: 'Generated full-scope cost basis accounting with 100% audit-ready documentation.',
                            severity: 'COMPLIANT',
                            severityClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30',
                            glowClass: 'from-emerald-500/[0.02]',
                            icon: Scale
                        },
                        {
                            title: 'Cybercrime Fund Flow Tracing',
                            summary: 'Map multi-layer egress dissipation paths to identify hacker payload exits and bridge jumpers.',
                            outcome: 'Traced 450+ ETH equivalents through 12 deep layers down to sovereign vault hashes.',
                            severity: 'IMMEDIATE',
                            severityClass: 'text-blue-400 bg-blue-950/30 border-blue-500/30',
                            glowClass: 'from-blue-500/[0.02]',
                            icon: Network
                        }
                    ].map((scenario, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -6 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="bg-[#0d1425]/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between transition-all relative group hover:border-slate-700 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                        >
                            {/* Animated inner dynamic glow backdrop */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${scenario.glowClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none`} />
                            
                            {/* Top accent bar line on card hover */}
                            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 rounded-xl border bg-[#080d19] border-slate-800 text-slate-400 flex items-center justify-center group-hover:text-white group-hover:border-slate-600 transition-colors">
                                        <scenario.icon size={18} />
                                    </div>
                                    <span className={`text-[8px] font-black font-mono tracking-[0.15em] px-2 py-0.5 rounded border uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-colors duration-300 ${scenario.severityClass}`}>
                                        {scenario.severity}
                                    </span>
                                </div>

                                <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3 leading-snug group-hover:text-white transition-colors">
                                    {scenario.title}
                                </h4>
                                
                                <p className="text-[11px] text-slate-400 leading-relaxed mb-6 font-medium">
                                    {scenario.summary}
                                </p>
                            </div>

                            <div className="border-t border-slate-800/60 pt-4 space-y-2 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                                    <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">Operational Result</span>
                                </div>
                                <p className="text-[10px] text-slate-300 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">
                                    {scenario.outcome}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FORENSIC REPORT PREVIEW */}
            <section className="px-4 py-24 max-w-7xl mx-auto border-t border-slate-900 relative overflow-hidden">
                {/* Background glowing nodes */}
                <div className="absolute -top-24 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Info Payload & Features */}
                    <div className="lg:col-span-5 space-y-8 relative z-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                                    Intelligence Output
                                </span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
                                Forensic Intelligence <br /> Report Preview
                            </h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Present comprehensive cryptographic findings with institutional precision. Our platform generates cryptographic chain-of-custody records and detailed PDF profiles recognized by regulatory protocols.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {[
                                { title: 'Multi-Hop Tracing Summary', desc: 'Outbound fund dispersal mapping spanning infinite layers.', icon: Share2 },
                                { title: 'Risk Intelligence Scoring', desc: 'Heuristically derived risk scores with dynamic categorization.', icon: ShieldAlert },
                                { title: 'Evidence Timeline Logs', desc: 'Chronological audit trail complete with millisecond timestamps.', icon: Activity },
                                { title: 'Chain-of-Custody Verification', desc: 'Immutable hash registries locking down investigation states.', icon: FileCheck },
                                { title: 'Export-ready PDF Reports', desc: 'Signed, legal-ready artifacts tailored for forensic authorities.', icon: Download }
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-all duration-300">
                                        <item.icon size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-0.5 group-hover:text-emerald-300 transition-colors">{item.title}</h4>
                                        <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <button 
                                onClick={() => document.getElementById('workflow-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            >
                                <Microscope size={14} />
                                View Investigation Workflow
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Interactive CSS PDF Mockup Document */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative w-full max-w-xl mx-auto group" style={{ perspective: '1000px' }}>
                            {/* Stacked Background Cards for realistic document layer depth */}
                            <div className="absolute inset-0 bg-slate-950/50 border border-slate-900 rounded-2xl translate-x-4 translate-y-4 scale-95 z-0 shadow-2xl" />
                            <div className="absolute inset-0 bg-slate-900/40 border border-slate-800/50 rounded-2xl translate-x-2 translate-y-2 scale-[0.98] z-10 shadow-xl" />

                            {/* Main Preview Document Canvas */}
                            <motion.div 
                                whileHover={{ y: -8, rotateX: 2, rotateY: -1 }}
                                className="relative bg-[#0a0f1d]/95 border border-slate-800/90 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 overflow-hidden backdrop-blur-xl group-hover:border-emerald-500/20 transition-colors"
                            >
                                {/* Corner forensic lines */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-800 rounded-tl-2xl group-hover:border-emerald-500/20 transition-colors" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-800 rounded-tr-2xl group-hover:border-emerald-500/20 transition-colors" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-800 rounded-bl-2xl group-hover:border-emerald-500/20 transition-colors" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-800 rounded-br-2xl group-hover:border-emerald-500/20 transition-colors" />

                                {/* Inner Header Block */}
                                <div className="flex justify-between items-start border-b border-slate-800/80 pb-6 mb-6 relative">
                                    <div>
                                        <div className="text-[8px] font-mono font-black text-emerald-500 bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/20 tracking-[0.25em] inline-block mb-2 rounded">
                                            CLASSIFIED / FORENSIC
                                        </div>
                                        <h4 className="text-white font-black uppercase text-sm tracking-widest">INTELLIGENCE DOSSIER</h4>
                                        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono mt-1">
                                            <span>CASE_ID: #BS-9830-ZX</span>
                                            <span>•</span>
                                            <span>GEN_TS: 2026.05.15</span>
                                        </div>
                                    </div>
                                    
                                    {/* Institutional seal mockup */}
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center group-hover:border-emerald-500/30 transition-all rotate-[15deg]">
                                        <ShieldCheck className="text-slate-700 group-hover:text-emerald-500/30 transition-colors" size={24} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Risk Assessment Preview Widget */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Heuristic Risk Exposure</span>
                                                <span className="text-[9px] font-black text-rose-400 bg-rose-950/30 px-1.5 py-0.5 rounded">CRITICAL</span>
                                            </div>
                                            <div className="flex items-end gap-3">
                                                <span className="text-3xl font-black text-white leading-none font-mono">87.4</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">/ 100 SCORE</span>
                                            </div>
                                            {/* Mini Sparkline Graph mockup */}
                                            <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden flex">
                                                <div className="bg-blue-500 h-full w-[30%]" />
                                                <div className="bg-purple-500 h-full w-[20%]" />
                                                <div className="bg-rose-500 h-full w-[37.4%]" />
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-tight">Tracing Depth</span>
                                            <div className="space-y-0.5 mt-2">
                                                <div className="text-xl font-black text-white font-mono">12 L</div>
                                                <div className="text-[8px] text-slate-500 uppercase font-bold">Multi-Hop Nodes</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chain of Custody Artifacts */}
                                    <div className="space-y-3">
                                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            Forensic Chain-Of-Custody Logs
                                        </h5>
                                        
                                        <div className="space-y-2">
                                            {[
                                                { task: 'Initial Entity Targeting', value: '0x4b7a...8e3d', status: 'COMPLETED', color: 'text-blue-400' },
                                                { task: 'Multi-layer Fund Dissipation Map', value: 'SHA256: 98a2...bc01', status: 'SEALED', color: 'text-purple-400' },
                                                { task: 'Behavioral Pattern Payload Sink', value: 'CID: QmPx...Hq7v', status: 'ARCHIVED', color: 'text-emerald-400' }
                                            ].map((log, idx) => (
                                                <div key={idx} className="bg-slate-950/50 border border-slate-900 rounded-lg p-2.5 flex justify-between items-center font-mono text-[9px]">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-400 font-bold tracking-tight">{log.task}</span>
                                                        <span className="text-slate-600 mt-0.5">{log.value}</span>
                                                    </div>
                                                    <span className={`font-black px-1.5 py-0.5 rounded text-[8px] bg-slate-900 border border-slate-800 ${log.color}`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interactive Timeline Preview mockup */}
                                    <div className="border border-slate-800/60 rounded-xl bg-slate-950/40 p-4 relative overflow-hidden">
                                        {/* Glass glare line */}
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-slate-800 to-transparent" />
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Evidence Timeline Flow</span>
                                            <span className="text-[9px] font-bold font-mono text-emerald-500/80">LIVE SYNC</span>
                                        </div>
                                        
                                        {/* Small stacked nodes showing timeline */}
                                        <div className="flex items-center justify-between px-2 relative py-2">
                                            <div className="absolute h-[1px] left-4 right-4 bg-slate-800 z-0" />
                                            {[1, 2, 3, 4].map((node) => (
                                                <div key={node} className={`w-2.5 h-2.5 rounded-full border z-10 relative ${node === 4 ? 'bg-rose-500 border-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-950 border-slate-700'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </section>

            {/* INVESTIGATION INSIGHTS (KNOWLEDGE BASE) */}
            <InvestigationInsights />



            <div className="w-full max-w-full overflow-hidden"><RoadmapSection /></div>
            <div className="w-full max-w-full overflow-hidden"><ServiceMarquee /></div>
            <div className="w-full max-w-full overflow-hidden"><SupportSection /></div>
        </div>
    );
};

export default Home;
