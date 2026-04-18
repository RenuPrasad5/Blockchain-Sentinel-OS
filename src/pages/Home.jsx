import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, ArrowRight, Zap, Eye, ShieldCheck,
    Loader2, Globe, Activity, FileText, ShieldAlert, Users2, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapSection from '../components/RoadmapSection';
import SupportSection from '../components/SupportSection';
import ServiceMarquee from '../components/ServiceMarquee';
import NeuralDataNetwork from '../components/ui/NeuralDataNetwork';
import WaitlistForm from '../components/landing/WaitlistForm';
import useOnboardingStore from '../store/onboardingStore';

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
    const { setDemoMode } = useOnboardingStore();
    const [loading, setLoading] = useState(false);
    const [loadLabel, setLoadLabel] = useState('');

    const launchDashboard = (label, caseParam = '', path = '/dashboard') => {
        setLoadLabel(label);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(`${path}${caseParam ? `?intent=${caseParam}` : ''}`);
        }, 2200);
    };

    return (
        <div className="home-container" style={{ background: 'transparent' }}>
            <LoadingOverlay visible={loading} label={loadLabel} />
            <NeuralDataNetwork />

            {/* ════════════════════════════════════════
                WELCOME ENTRY SCREEN (HERO)
            ════════════════════════════════════════ */}
            <section className="relative flex flex-col items-center justify-center px-4 pb-20" style={{ minHeight: '90vh' }}>
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto relative z-10 flex flex-col items-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Sovereign Intelligence</span>
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold text-blue-400 mb-2 tracking-[0.3em] uppercase">
                        Welcome to Blockchain Sentinel OS
                    </h1>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight leading-tight pt-4">
                        What would you like to do Today?
                    </h2>

                    <div className="w-full max-w-2xl bg-blue-500/5 border-y border-white/5 py-3 mb-12 px-6 overflow-hidden rounded-full backdrop-blur-sm">
                        <div className="flex whitespace-nowrap gap-12 animate-marquee text-[10px] font-black text-blue-400/70 uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                [LIVE] Global Threat Level: Stable
                            </span>
                            <span>Active Nodes: 1,420</span>
                            <span>BTC/USD: $64,210.82</span>
                            <span className="opacity-40">Sentries Operational</span>
                            <span>Network Health: 99.9%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full">
                        {[
                            {
                                label: 'Analyze Wallet',
                                icon: Search,
                                desc: 'Trace fund flows',
                                color: 'blue',
                                action: () => {
                                    setDemoMode(false);
                                    launchDashboard('Ready: Wallet Trace Mode', 'wallet', '/dashboard');
                                }
                            },
                            {
                                label: 'View Alerts',
                                icon: Activity,
                                desc: 'Monitor threats',
                                color: 'emerald',
                                action: () => {
                                    setDemoMode(false);
                                    launchDashboard('Live View Active', 'pulse', '/dashboard');
                                }
                            },
                            {
                                label: 'Access Portal',
                                icon: Zap,
                                desc: 'Enter Secure Environment',
                                color: 'blue', // Changing to blue for consistent portal feel
                                action: () => {
                                    setDemoMode(true);
                                    launchDashboard('Loading Secure Intelligence Portal...', 'hack', '/dashboard');
                                }
                            }
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    boxShadow: btn.label === 'Access Portal' ? '0 0 25px rgba(59, 130, 246, 0.4)' : '0 20px 50px rgba(59, 130, 246, 0.1)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={btn.action}
                                className={`group relative bg-[#1e293b]/50 backdrop-blur-md border border-white/5 p-10 rounded-[2.5rem] transition-all flex flex-col items-center text-center gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${btn.label === 'Access Portal' ? 'hover:border-blue-500/50' : 'hover:border-blue-500/30'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${btn.color === 'blue' ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20' :
                                    btn.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20' :
                                        'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                                    }`}>
                                    <btn.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">{btn.label}</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{btn.desc}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        First time? We'll guide you through every step.
                    </p>
                </motion.div>
            </section>

            {/* ════════════════════════════════════════
                CLARITY SECTION: WHAT THIS DOES (Task 1)
            ════════════════════════════════════════ */}
            <section className="px-4 py-24 max-w-7xl mx-auto border-t border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-blue-500 rounded-full" />
                            <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.4em]">The Sentinel Solution</h2>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
                            Analyze Wallets. <br />
                            Detect Patterns. <br />
                            <span className="text-slate-500">Simplify Forensics.</span>
                        </h3>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
                            Sentinel-OS powers the <strong className="text-blue-400">Intelligence Portal</strong>, helping investigators analyze wallets and detect suspicious patterns via a unified command center. We turn raw blockchain data into clear transaction stories that anyone can understand.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-3">Core Focus</h4>
                                <ul className="space-y-2">
                                    {['Risk Scoring', 'Pattern Detection', 'Fund Flow Tracing'].map(i => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                                            <div className="w-1 h-1 rounded-full bg-blue-500" /> {i}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-3">Output Type</h4>
                                <ul className="space-y-2">
                                    {['Strategic Reports', 'Visual Traces', 'AI Summaries'].map(i => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                                            <div className="w-1 h-1 rounded-full bg-blue-500" /> {i}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* EXAMPLE OUTPUT (Task 5) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#1e293b]/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-20"><Zap size={40} className="text-blue-500" /></div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Example Insight Output</span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Wallet Risk</p>
                                    <p className="text-2xl font-black text-rose-500">HIGH (82)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs font-black text-white">Action Required</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Reasoning</p>
                                <ul className="space-y-2">
                                    {[
                                        'Connected to flagged address',
                                        'Rapid multi-hop transactions observed'
                                    ].map(r => (
                                        <li key={r} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                                            <ShieldAlert size={14} className="text-rose-500 shrink-0 mt-0.5" />
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Recommended Action</p>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                                    Monitor and investigate linked wallets.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════
                WHO / WHEN / DIFFERENT SECTIONS
            ════════════════════════════════════════ */}
            <section className="px-4 py-24 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Who This Is For (Task 2) */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Users2 size={20} className="text-blue-500" /> Who It's For
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { t: 'Blockchain Investigators', d: 'Tracing illicit fund movements' },
                                    { t: 'Security Analysts', d: 'Monitoring platform safety' },
                                    { t: 'AML Learners', d: 'Mastering compliance forensics' },
                                    { t: 'Gov & Legal Agencies', d: 'Institutional case management' }
                                ].map(i => (
                                    <div key={i.t} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <h4 className="text-sm font-black text-white mb-1 uppercase tracking-tight">{i.t}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{i.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* When To Use (Task 3) */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Activity size={20} className="text-blue-500" /> When To Use
                            </h3>
                            <div className="space-y-4">
                                {[
                                    'Investigating suspicious wallets',
                                    'Monitoring risky transactions',
                                    'Understanding fund flows',
                                    'Routine AML auditing',
                                    'Project due diligence'
                                ].map(i => (
                                    <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={14} className="text-blue-400" />
                                        </div>
                                        {i}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What Makes It Different (Task 4) */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Zap size={20} className="text-blue-500" /> What Makes Us Different
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { t: 'Simple Explanations', d: 'Human-readable labels instead of raw data.' },
                                    { t: 'AI investigation summaries', d: 'Narrative context for every movement.' },
                                    { t: 'Action Focus', d: 'Prioritizing insights that lead to decisions.' }
                                ].map(i => (
                                    <div key={i.t} className="group">
                                        <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors uppercase tracking-widest">{i.t}</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{i.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <WaitlistForm />
            <div className="w-full max-w-full overflow-hidden"><RoadmapSection /></div>
            <div className="w-full max-w-full overflow-hidden"><ServiceMarquee /></div>
            <div className="w-full max-w-full overflow-hidden"><SupportSection /></div>
        </div>
    );
};

export default Home;
