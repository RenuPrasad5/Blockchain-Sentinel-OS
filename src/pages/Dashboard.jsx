import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Zap, Layers, Map as MapIcon, BrainCircuit, Plus, Waves, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';
import useModeStore from '../store/modeStore';

import OnboardingOverlay    from '../components/dashboard/OnboardingOverlay';
import PriorityAlerts       from '../components/dashboard/PriorityAlerts';
import InvestigationNarrative from '../components/dashboard/InvestigationNarrative';
import IntelligenceFeed     from '../components/dashboard/IntelligenceFeed';
import DetectionEngine      from '../components/dashboard/DetectionEngine';
import CapitalFlow          from '../components/dashboard/CapitalFlow';
import SovereignNodeMap     from '../components/dashboard/SovereignNodeMap';

import { INTELLIGENCE_DATABASE } from '../data/intelligenceDatabase';

/* ── Shared IntelCard ─────────────────────────────────────────────── */
const IntelCard = ({ title, icon: Icon, children, badge }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="intel-card-saas glass rounded-3xl overflow-hidden no-print"
    >
        <div className="card-header-dense">
            <div className="card-title-group">
                <Icon size={16} className="text-primary-bright" />
                <h3>{title}</h3>
            </div>
            {badge && <span className="card-badge-mini">{badge}</span>}
        </div>
        <div className="card-body-dense">{children}</div>
    </motion.div>
);

/* ── Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
    const { mode } = useModeStore();
    const location = useLocation();

    /* State */
    const [isDemo, setIsDemo]               = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [activeCase, setActiveCase]       = useState(INTELLIGENCE_DATABASE[0]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [toast, setToast]                 = useState(null);
    const [stats, setStats]                 = useState({ tps: 12450, risk: 14.2 });

    /* Refs */
    const narrativeRef = useRef(null);
    const mapRef       = useRef(null);
    const searchRef    = useRef(null);

    /* showToast must be defined BEFORE useEffect to avoid temporal dead zone */
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        const seen = localStorage.getItem('sentinel_onboarding_complete');
        if (seen) setShowOnboarding(false);

        /* ── Handle intent from Home page navigation ── */
        const params = new URLSearchParams(location.search);
        const intent = params.get('intent');
        if (intent === 'hack') {
            /* Auto-load Ledger Phishing Forensic case */
            const phsCase = INTELLIGENCE_DATABASE.find(c => c.id === 'PHS-1120');
            if (phsCase) {
                setActiveCase(phsCase);
                setTimeout(() => narrativeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
            }
            showToast('Loaded: Ledger Phishing Forensic Investigation');
        } else if (intent === 'wallet') {
            /* Auto-focus search and load wallet case */
            const walletCase = INTELLIGENCE_DATABASE.find(c => c.id === 'SRC-7721');
            if (walletCase) setActiveCase(walletCase);
            setTimeout(() => searchRef.current?.focus(), 500);
            showToast('Ready: Wallet Trace Mode — Enter address to begin');
        } else if (intent === 'pulse') {
            /* Scroll to the Sovereign Infrastructure Monitor (map) */
            setTimeout(() => mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
            showToast('Sovereign Infrastructure Monitor — Live View Active');
        } else if (intent === 'search') {
            setTimeout(() => searchRef.current?.focus(), 500);
        }

        /* Live pulse jitter every 3 s */
        const pulse = setInterval(() => {
            setStats(prev => ({
                tps:  Math.floor(prev.tps  * (0.95 + Math.random() * 0.10)),
                risk: +(prev.risk * (0.98 + Math.random() * 0.04)).toFixed(1)
            }));
        }, 3000);
        return () => clearInterval(pulse);
    }, []);

    /* Shared handler — used by both PriorityAlerts and IntelligenceFeed Deep Dive */
    const handleSelectCase = (item) => {
        setActiveCase(item);
        setIsInitialized(false);
        showToast(`Synchronizing Blockchain Data for Case #${item.id}...`);

        /* Smooth-scroll to narrative on mobile */
        setTimeout(() => narrativeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const handleInitializeComplete = (item) => {
        setIsInitialized(true);
        showToast(`Address ${item.originAddress.slice(0, 10)}... added to Global Watchlist.`);
    };

    /* showToast is defined above useEffect — removed duplicate */

    return (
        <div className={`saas-terminal fade-in mode-${mode.toLowerCase()} print:bg-white print:p-0`}>

            <OnboardingOverlay
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onAction={() => setShowOnboarding(false)}
            />

            {/* ── Toast Notification ── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ x: 120, opacity: 0 }}
                        animate={{ x: 0,   opacity: 1 }}
                        exit={{   x: 120, opacity: 0 }}
                        className="fixed top-6 right-6 z-[5000] no-print bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-white/20 max-w-xs"
                    >
                        <Zap size={15} className="text-white animate-pulse shrink-0" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 no-print">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Sentinel Command Center</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                            AI Core Active
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Case Context: {activeCase.id}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Inline search input for wallet trace intent */}
                    <div className="relative flex items-center">
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Enter wallet / TX hash..."
                            className="w-56 bg-white/5 border border-white/10 text-white placeholder-slate-600 text-[11px] font-bold rounded-xl pl-3 pr-10 py-2.5 outline-none focus:border-blue-500/60 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsDemo(d => !d)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                            isDemo
                                ? 'bg-amber-500 text-black border-amber-500'
                                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                        {isDemo ? 'Reset System' : 'Demo Mode'}
                    </button>
                    <button className="px-4 py-2 bg-primary-bright text-white rounded-xl text-[10px] font-black uppercase shadow-lg flex items-center gap-2">
                        <Plus size={14} /> Analyze Wallet
                    </button>
                </div>
            </div>

            {/* ── Priority Alerts ── */}
            <section className="mb-12 no-print">
                <PriorityAlerts
                    activeId={activeCase.id}
                    onSelectAlert={handleSelectCase}
                />
            </section>

            {/* ── Main Grid: Narrative + Sidebar ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                {/* Forensic Narrative (span-2) */}
                <div ref={narrativeRef} className="lg:col-span-2 print:col-span-3">
                    <InvestigationNarrative
                        activeCase={activeCase}
                        isInitialized={isInitialized}
                        onInitialize={handleInitializeComplete}
                    />
                    {/* Export panel is rendered INSIDE InvestigationNarrative, directly below */}
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-5 no-print">

                    {/* Intelligence Stream — every Deep Dive updates the Narrative */}
                    <IntelCard title="Intelligence Stream" icon={Layers} badge="LIVE">
                        <div className="max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                            <IntelligenceFeed
                                isDemo={isDemo}
                                activeCaseId={activeCase.id}
                                onDeepDive={handleSelectCase}
                            />
                        </div>
                    </IntelCard>

                    {/* Detection Engine */}
                    <IntelCard title="Neural Detection" icon={Zap} badge="ENCRYPTED">
                        <div className="p-1">
                            <DetectionEngine />
                        </div>
                    </IntelCard>

                    {/* Live Pulse */}
                    <IntelCard title="Tactical Pulse" icon={Activity} badge="LIVE">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase">EVM Throughput</span>
                                <motion.span key={stats.tps} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-sm font-black text-white">
                                    {stats.tps.toLocaleString()} TPS
                                </motion.span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Risk Inflow</span>
                                <motion.span key={stats.risk} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-sm font-black text-rose-500">
                                    ${stats.risk}M /h
                                </motion.span>
                            </div>
                        </div>
                    </IntelCard>
                </aside>
            </div>

            {/* ── Section: Global Node Infrastructure (full-width) ── */}
            <section ref={mapRef} className="no-print mt-4 space-y-2">
                <div className="flex items-center gap-3 px-1 mb-2">
                    <MapIcon size={18} className="text-blue-400" />
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Global Node Infrastructure</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Sovereign geo-spatial blockchain node distribution — real-time validated
                        </p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 text-[9px] font-black uppercase border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 rounded">GEO-DATA LIVE</span>
                </div>
                <div className="bg-[#0D1117] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="h-[520px]">
                        <SovereignNodeMap isDemo={isDemo} />
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    {[
                        { label: 'Active Domestic Nodes',   value: '128',      color: 'text-emerald-500' },
                        { label: 'Foreign Relay Points',    value: '3',        color: 'text-blue-400' },
                        { label: 'Avg. Latency',            value: '< 12ms',    color: 'text-white' },
                        { label: 'Sovereign Verification',  value: 'Ver. 91.2', color: 'text-amber-400' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{s.label}</span>
                            <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Section: Capital Flow Architecture (full-width) ── */}
            <section className="no-print mt-10 space-y-2">
                <div className="flex items-center gap-3 px-1 mb-2">
                    <Waves size={18} className="text-blue-400" />
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Capital Flow Architecture</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Real-time exchange-to-cluster fund movement — live forensic ledger
                        </p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 text-[9px] font-black uppercase border border-blue-500/30 text-blue-400 bg-blue-500/10 rounded">V4.2 ENCRYPTED</span>
                </div>
                <div className="bg-[#0D1117] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="h-[540px]">
                        <CapitalFlow isDemo={isDemo} />
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    {[
                        { label: 'Detection Engine',  value: 'NEURAL-01',    color: 'text-white' },
                        { label: 'Latency Threshold', value: '< 0.05ms',      color: 'text-emerald-500' },
                        { label: 'Verification',      value: 'SIGSET-LVL8',  color: 'text-blue-400' },
                        { label: 'Traffic Status',    value: 'Verified Live', color: 'text-amber-400' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{s.label}</span>
                            <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
