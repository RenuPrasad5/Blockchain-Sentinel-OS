import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Zap, Layers, Plus, Search as SearchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';
import useModeStore from '../store/modeStore';
import useOnboardingStore from '../store/onboardingStore';

import GuidedWalkthrough    from '../components/dashboard/GuidedWalkthrough';
import PriorityAlerts       from '../components/dashboard/PriorityAlerts';
import InvestigationNarrative from '../components/dashboard/InvestigationNarrative';
import IntelligenceFeed     from '../components/dashboard/IntelligenceFeed';

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
    const { 
        isDemoMode, 
        setDemoMode, 
        hasCompletedOnboarding, 
        setShowWalkthrough 
    } = useOnboardingStore();
    const location = useLocation();

    /* Local State */
    const [activeCase, setActiveCase]       = useState(INTELLIGENCE_DATABASE[0]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [toast, setToast]                 = useState(null);

    /* Refs */
    const narrativeRef = useRef(null);
    const searchRef    = useRef(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        // Start walkthrough if first time
        if (!hasCompletedOnboarding) {
            setTimeout(() => setShowWalkthrough(true), 1000);
        }

        /* ── Handle intent from Home page navigation ── */
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
    }, [hasCompletedOnboarding]);

    const handleSelectCase = (item) => {
        setActiveCase(item);
        setIsInitialized(false);
        showToast(`Synchronizing Case #${item.id}...`);
        setTimeout(() => narrativeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleInitializeComplete = (item) => {
        setIsInitialized(true);
        showToast(`Analysis Complete: ${item.id}`);
    };

    return (
        <div className={`saas-terminal fade-in mode-${mode.toLowerCase()} min-h-screen bg-[#0D1117] p-6 lg:p-10 print:bg-white print:p-0`}>
            
            <GuidedWalkthrough />

            {/* ── Toast Notification ── */}
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
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Sentinel Intelligence Center</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">Dashboard</h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex items-center group">
                        <SearchIcon className="absolute left-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Enter wallet / hash / contract..."
                            className="w-72 bg-white/5 border border-white/10 text-white placeholder-slate-600 text-[11px] font-bold rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner"
                        />
                    </div>
                    
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
                    
                    <button className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
                        <Plus size={16} /> Start Analysis
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-12">
                {/* ── Section 1: Critical Alerts ── */}
                <section id="walkthrough-alerts" className="no-print">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 bg-rose-500 rounded-full" />
                        <h2 className="text-lg font-black text-white uppercase tracking-widest">Critical Alerts</h2>
                    </div>
                    <PriorityAlerts
                        activeId={activeCase.id}
                        onSelectAlert={handleSelectCase}
                    />
                </section>

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

