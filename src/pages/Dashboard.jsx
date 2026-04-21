import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Zap, Layers, Plus, Search as SearchIcon, Microscope, ArrowRight, Shield, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import useModeStore from '../store/modeStore';
import useOnboardingStore from '../store/onboardingStore';

import GuidedWalkthrough from '../components/dashboard/GuidedWalkthrough';
import PriorityAlerts from '../components/dashboard/PriorityAlerts';
import InvestigationNarrative from '../components/dashboard/InvestigationNarrative';
import IntelligenceFeed from '../components/dashboard/IntelligenceFeed';
import { useWatchlist } from '../context/WatchlistContext';
import { calculateRiskScore } from '../services/ForensicEngine';

import { INTELLIGENCE_DATABASE } from '../data/intelligenceDatabase';

/* ── Shared IntelCard ─────────────────────────────────────────────── */
const IntelCard = ({ title, icon: Icon, children, badge, id }) => (
    <motion.div
        id={id}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="intel-card-saas glass rounded-[2.5rem] overflow-hidden no-print border border-white/5 hover:border-white/10 transition-all shadow-2xl bg-[#0f172a]/50 backdrop-blur-xl"
    >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
                    {badge && <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest opacity-60">{badge}</span>}
                </div>
            </div>
        </div>
        <div className="p-2">{children}</div>
    </motion.div>
);

/* ── Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
    const { mode } = useModeStore();
    const navigate = useNavigate();
    const {
        isDemoMode,
        setDemoMode,
        hasCompletedOnboarding,
        setShowWalkthrough
    } = useOnboardingStore();
    const { watchlist, alerts } = useWatchlist();
    const location = useLocation();

    /* Local State */
    const [activeCase, setActiveCase] = useState(INTELLIGENCE_DATABASE[0]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [toast, setToast] = useState(null);
    const [isAuthenticatingPortal, setIsAuthenticatingPortal] = useState(true);

    /* Search & Triage State */
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [triageData, setTriageData] = useState(null);
    const [isTriageLoading, setIsTriageLoading] = useState(false);

    const narrativeRef = useRef(null);
    const searchRef = useRef(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        const authTimer = setTimeout(() => setIsAuthenticatingPortal(false), 800);

        if (!hasCompletedOnboarding) {
            setTimeout(() => setShowWalkthrough(true), 1000);
        }

        const params = new URLSearchParams(location.search);
        const intent = params.get('intent');
        const autoPrint = params.get('autoPrint');

        if (intent === 'hack') {
            const phsCase = INTELLIGENCE_DATABASE.find(c => c.id === (autoPrint === 'true' ? 'SRC-7721' : 'PHS-1120'));
            if (phsCase) setActiveCase(phsCase);
            setDemoMode(true);
            showToast(autoPrint === 'true' ? 'Forensic Evidence Chain Verified' : 'Demo Mode: Ronin Bridge Simulation Loaded');

            if (autoPrint === 'true') {
                setIsInitialized(true);
                setTimeout(() => window.print(), 3500);
            }
        } else if (intent === 'wallet') {
            const walletCase = INTELLIGENCE_DATABASE.find(c => c.id === 'SRC-7721');
            if (walletCase) setActiveCase(walletCase);
            setTimeout(() => searchRef.current?.focus(), 800);
            showToast('Wallet Trace Mode Active');
        } else if (intent === 'pulse') {
            showToast('Live Threat Monitor Active');
        }

        return () => clearTimeout(authTimer);
    }, [hasCompletedOnboarding]);

    const handleSelectCase = (item) => {
        setActiveCase(item);
        setIsInitialized(false);
        setTriageData(null); // Reset triage when manual case selected
        showToast(`Synchronizing Case #${item.id}...`);
        setTimeout(() => narrativeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleInitializeComplete = (item) => {
        setIsInitialized(true);
        showToast(`Analysis Complete: ${item.id}`);
    };

    const performTriage = async (query) => {
        if (!query || query.length < 40) return;
        setIsTriageLoading(true);
        
        // Simulation of deep scan
        setTimeout(() => {
            const mockActivity = Array.from({ length: Math.floor(Math.random() * 50) + 5 }, () => ({
                value: (Math.random() * 5).toFixed(2),
                toLabel: Math.random() > 0.8 ? 'Mixer' : 'Unknown'
            }));
            
            const assessment = calculateRiskScore(query, mockActivity);
            const patterns = [
                "Layering detected via non-KYC relay nodes.",
                "Subject exhibits high-velocity capital movement.",
                "Transactional periodicity aligns with automated wash-trading.",
                "Liquidity pathing terminates at sanctioned obfuscation cluster."
            ];
            
            setTriageData({
                ...assessment,
                address: query,
                summary: assessment.score > 70 ? patterns[3] : assessment.score > 40 ? patterns[1] : "Standard retail custody patterns detected."
            });
            setIsTriageLoading(false);
            showToast("Quick Triage Complete");
        }, 1200);
    };

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
        if (!/^0x[a-fA-F0-9]{40}$/.test(searchQuery)) {
            showToast("Invalid Address Format");
            return;
        }
        performTriage(searchQuery);
    };

    const navigateToForensicLab = () => {
        if (!searchQuery) return;
        navigate(`/forensic-lab?address=${searchQuery}`);
    };

    const suggestedAddresses = [
        { label: 'Mixer Interaction', addr: '0x1234567890123456789012345678901234567890' },
        { label: 'Exchange Cluster', addr: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        { label: 'DeFi Whale', addr: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }
    ];

    return (
        <div className={`saas-terminal fade-in mode-${mode.toLowerCase()} min-h-screen bg-[#0D1117] p-6 lg:p-10 print:bg-white print:p-0 relative`}>
            
            <AnimatePresence>
                {isAuthenticatingPortal && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#0D1117] flex flex-col items-center justify-center no-print"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-16 h-16 rounded-full border-2 border-blue-500/30 flex items-center justify-center"
                            >
                                <Zap className="text-blue-500" size={24} />
                            </motion.div>
                            <div className="text-center">
                                <h2 className="text-white font-black uppercase tracking-[0.3em] text-[11px] mb-1">Authenticating Secure Session...</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] animate-pulse">Establishing Sovereign Link</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <GuidedWalkthrough />

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0,   opacity: 1 }}
                        exit={{   y: -50, opacity: 0 }}
                        className="fixed top-10 left-1/2 -translate-x-1/2 z-[5000] no-print bg-blue-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] border border-white/20"
                    >
                        <Zap size={16} className="text-white animate-pulse" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 no-print max-w-7xl mx-auto">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Sovereign Intelligence Portal</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">Dashboard</h1>
                </div>

                <div className="flex-1 max-w-2xl relative">
                    <form onSubmit={handleSearchSubmit} className="relative z-20 group">
                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Input target wallet for Quick Triage..."
                            value={searchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs font-bold rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-2xl"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                            Triage
                        </button>
                    </form>

                    {/* Suggested Addresses Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && !searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#161b22] border border-white/10 rounded-3xl p-6 z-50 shadow-2xl"
                            >
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Suggested Nodes for Testing</span>
                                <div className="space-y-2">
                                    {suggestedAddresses.map((item, id) => (
                                        <button
                                            key={id}
                                            onClick={() => setSearchQuery(item.addr)}
                                            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 rounded-2xl transition-all group"
                                        >
                                            <div className="flex flex-col items-start px-2">
                                                <span className="text-[10px] font-black text-white uppercase group-hover:text-blue-400">{item.label}</span>
                                                <span className="text-[9px] font-mono text-slate-500">{item.addr.slice(0, 24)}...</span>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setDemoMode(!isDemoMode)}
                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            isDemoMode
                                ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20'
                                : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                        }`}
                    >
                        {isDemoMode ? 'Reset System' : 'Demo Mode'}
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={navigateToForensicLab}
                            disabled={!searchQuery}
                            className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                                triageData 
                                ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] animate-pulse border border-blue-400/50 scale-105' 
                                : 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
                            }`}
                        >
                            <Microscope size={16} /> Send to Forensic Lab
                        </button>
                        {triageData && (
                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 text-[8px] font-bold text-blue-500 uppercase text-center leading-tight">
                                Proceed here for full chain-of-custody reports & automated AI narratives.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {triageData ? (
                        /* ── QUICK TRIAGE CARD ── */
                        <motion.section 
                            key="triage"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-blue-600/5 border-2 border-blue-500/20 rounded-[3rem] p-10 mb-12 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={12} /> Target Triage Active
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
                                <div className="lg:col-span-1 flex flex-col items-center justify-center">
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <motion.circle 
                                                cx="80" cy="80" r="70" 
                                                fill="transparent" 
                                                stroke={triageData.level.color} 
                                                strokeWidth="10" 
                                                strokeDasharray="440" 
                                                initial={{ strokeDashoffset: 440 }}
                                                animate={{ strokeDashoffset: 440 - (440 * triageData.score) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-white leading-none">{triageData.score}</span>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Risk Index</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-3">
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <span className="text-[10px] font-black bg-white/10 text-white px-4 py-1.5 rounded-full uppercase border border-white/10">Subject: {triageData.address.slice(0, 18)}...</span>
                                        <span 
                                            className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase border"
                                            style={{ color: triageData.level.color, borderColor: `${triageData.level.color}44`, backgroundColor: `${triageData.level.color}11` }}
                                        >
                                            {triageData.level.label}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4 leading-tight uppercase underline decoration-blue-500 decoration-4 underline-offset-8">
                                        Exploratory Data Summary
                                    </h2>
                                    <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-3xl mb-8">
                                        {triageData.summary}
                                    </p>
                                    <div className="flex gap-10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Detected Indicators</span>
                                            <div className="flex gap-4">
                                                {triageData.flags.length > 0 ? triageData.flags.slice(0, 2).map((f, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase">
                                                        <AlertTriangle size={12} /> {f.replace(/_/g, ' ')}
                                                    </div>
                                                )) : (
                                                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                                                        <CheckCircle2 size={12} /> Baseline Integrity Matched
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ) : (
                        /* ── Section 1: Critical Alerts ── */
                        <motion.section 
                            key="alerts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            id="walkthrough-alerts" 
                            className="no-print mb-12"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-rose-500 rounded-full" />
                                <h2 className="text-lg font-black text-white uppercase tracking-widest">Global Critical Alerts</h2>
                            </div>
                            <PriorityAlerts
                                activeId={activeCase.id}
                                onSelectAlert={handleSelectCase}
                            />
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* ── Section 2 & 3: Recent Activity & Investigation Summary ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Recent Activity (IntelligenceFeed) */}
                    <aside className="lg:col-span-1 space-y-6 no-print">
                        <div className="flex items-center gap-3 mb-2 px-2">
                            <Activity size={18} className="text-blue-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Recent Activity</h2>
                        </div>
                        <div id="walkthrough-activity">
                            <IntelligenceFeed
                                isDemo={isDemoMode}
                                activeCaseId={activeCase.id}
                                onDeepDive={handleSelectCase}
                            />
                        </div>
                    </aside>

                    {/* Investigation Summary (InvestigationNarrative) */}
                    <div id="walkthrough-summary" ref={narrativeRef} className="lg:col-span-2 print:col-span-3">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <Layers size={18} className="text-blue-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Investigation Summary</h2>
                        </div>
                        <InvestigationNarrative
                            activeCase={activeCase}
                            isInitialized={isInitialized}
                            onInitialize={handleInitializeComplete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

