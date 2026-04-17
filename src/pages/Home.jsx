import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, ArrowRight, Zap, Eye, ShieldCheck,
    Loader2, Globe, Activity, FileText
} from 'lucide-react';
import { INTELLIGENCE_DATABASE } from '../data/intelligenceDatabase';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapSection from '../components/RoadmapSection';
import SupportSection from '../components/SupportSection';
import ServiceMarquee from '../components/ServiceMarquee';
import NeuralDataNetwork from '../components/ui/NeuralDataNetwork';
import ProblemSection from '../components/landing/ProblemSection';
import ProcessSection from '../components/landing/ProcessSection';
import TargetAudience from '../components/landing/TargetAudience';
import WaitlistForm from '../components/landing/WaitlistForm';
import './Home.css';

/* ── Loading overlay ────────────────────────────────────────────── */
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
                    <p className="text-white font-black uppercase tracking-[0.3em] text-sm">Loading Blockchain Data...</p>
                    <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest opacity-70">{label}</p>
                </div>
                <div className="flex gap-1.5 mt-2">
                    {[0, 1, 2, 3, 4].map(i => (
                        <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        />
                    ))}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

/* ── Main Home component ────────────────────────────────────────── */
const Home = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadLabel, setLoadLabel] = useState('');
    const pulseRef = useRef(null);

    /* Shared transition — can navigate to /dashboard OR /gov-ent */
    const launchDashboard = (label, caseParam = '', path = '/dashboard') => {
        setLoadLabel(label);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(`${path}${caseParam ? `?intent=${caseParam}` : ''}`);
        }, 2200);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        launchDashboard(`Tracing: ${query.slice(0, 24)}...`, 'search', '/gov-ent');
    };

    const chips = [
        { label: '🔍 Analyze Ledger Hack', intent: 'hack', desc: 'Ledger Phishing Forensic' },
        { label: '🌀 Trace Tornado Cash Flow', intent: 'wallet', desc: 'Wallet Investigation' },
        { label: '📡 Monitor Threat Pulse', intent: 'pulse', desc: 'Threat Pulse Monitor' },
    ];

    const handleChip = (chip) => {
        launchDashboard(`Initializing ${chip.desc}...`, chip.intent, '/gov-ent');
    };

    const useCases = [
        {
            icon: Search,
            title: 'Identify a Wallet',
            desc: 'Unmask owners and exchange associations instantly. Our AI links addresses to real-world identities, KYC clusters, and risk entities.',
            cta: 'Trace a Wallet',
            intent: 'wallet',
            label: 'Wallet Trace Investigation',
            color: 'blue'
        },
        {
            icon: ShieldCheck,
            title: 'Analyze a Hack',
            desc: 'Transform complex transaction chains into human-readable forensic stories. Understand what happened, when, and where funds went.',
            cta: 'Investigate Now',
            intent: 'hack',
            label: 'Ledger Phishing Forensic',
            color: 'rose'
        },
        {
            icon: Activity,
            title: 'Monitor Threat Pulse',
            desc: 'Real-time global monitoring for AML and compliance teams. Get live alerts the moment a high-risk event is detected on-chain.',
            cta: 'View Live Feed',
            intent: 'pulse',
            label: 'Sovereign Infrastructure Monitor',
            color: 'emerald'
        }
    ];

    const colorMap = {
        blue: { bar: 'bg-blue-500', icon: 'bg-blue-500/10 text-blue-400', btn: 'bg-blue-600 hover:bg-blue-500' },
        rose: { bar: 'bg-rose-500', icon: 'bg-rose-500/10 text-rose-400', btn: 'bg-rose-600 hover:bg-rose-500' },
        emerald: { bar: 'bg-emerald-500', icon: 'bg-emerald-500/10 text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500' },
    };

    return (
        <div className="home-container" style={{ background: '#0f172a' }}>
            <LoadingOverlay visible={loading} label={loadLabel} />
            <NeuralDataNetwork />

            {/* ════════════════════════════════════════
                HERO — Search-First Architecture
            ════════════════════════════════════════ */}
            <section className="relative flex flex-col items-center justify-center px-4 pb-12 overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)' }}>
                {/* Subtle radial glow behind search */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

                {/* Status pill */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em]">
                        Blockchain Intelligence OS — Live
                    </span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center text-4xl sm:text-5xl lg:text-[72px] font-black text-white leading-[1.05] tracking-tighter max-w-4xl mx-auto mb-5"
                >
                    Blockchain Intelligence,
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300">
                        Translated.
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="text-center text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium"
                >
                    Identify threats, trace exploits, and generate forensic narratives in plain English.
                </motion.p>

                {/* Search bar */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 }}
                    onSubmit={handleSearch}
                    className="w-full max-w-2xl mx-auto mb-5"
                >
                    <div className="relative flex items-center">
                        <Search className="absolute left-5 text-slate-500 shrink-0" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Enter Wallet, TX Hash, or Contract..."
                            className="w-full bg-[#1e293b] border border-white/10 text-white placeholder-slate-500 text-sm font-medium rounded-2xl pl-14 pr-36 py-5 outline-none focus:border-blue-500/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2.5 flex items-center gap-2 px-5 py-3 bg-[#3b82f6] hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                        >
                            Trace <ArrowRight size={14} />
                        </button>
                    </div>
                </motion.form>

                {/* Quick Start Chips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap justify-center gap-3 mb-6"
                >
                    {chips.map((chip, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleChip(chip)}
                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                            {chip.label}
                        </button>
                    ))}
                </motion.div>

                {/* Hint text */}
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">
                    No account required to try · Demo data loads instantly
                </p>

                {/* Scroll cue */}
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30"
                >
                    <div className="w-px h-8 bg-white" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </motion.div>
            </section>

            {/* ════════════════════════════════════════
                USE CASE VALUE PROPS
            ════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">
                        Entry Points
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        Choose your investigation path
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((uc, idx) => {
                        const c = colorMap[uc.color];
                        const Icon = uc.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative bg-[#1e293b] border border-white/5 rounded-3xl p-7 hover:border-white/10 transition-all group flex flex-col gap-5 overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`absolute top-0 left-0 w-full h-0.5 ${c.bar}`} />

                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.icon}`}>
                                    <Icon size={22} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-300 transition-colors">
                                        {uc.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                        {uc.desc}
                                    </p>
                                </div>

                                <button
                                    onClick={() => launchDashboard(`Initializing ${uc.label}...`, uc.intent, '/gov-ent')}
                                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 ${c.btn}`}
                                >
                                    {uc.cta} <ArrowRight size={13} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ════════════════════════════════════════
                EXISTING SECTIONS PRESERVED BELOW
            ════════════════════════════════════════ */}
            <WaitlistForm />
            <ProblemSection />
            <ProcessSection />

            {/* Tactical Pulse anchor (scroll-target for chip) */}
            <div ref={pulseRef} id="threat-pulse" />
            <TargetAudience />

            {/* Intelligence Pipeline grid (preserved from original) */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Intelligence Pipeline</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        Operational{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Intelligence Flow
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg mt-4 font-medium">
                        The global standard for blockchain surveillance: Track → Detect → Investigate → Act.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { num: '01', title: 'Track', desc: 'Real-time monitoring of global blockchain activity and institutional-grade node surveillance.' },
                        { num: '02', title: 'Detect', desc: 'AI-based anomaly and fraud detection flagging suspicious financial patterns instantly.' },
                        { num: '03', title: 'Investigate', desc: 'Deep forensic analysis and visualization tools for case management and entity linking.' },
                        { num: '04', title: 'Legalize', desc: 'Generate court-ready evidence, immutable audit trails, and global regulatory compliance reports.' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#1e293b] border border-white/5 rounded-3xl p-7 hover:border-blue-500/30 transition-all group"
                        >
                            <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">{item.num}</p>
                            <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors">{item.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
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
