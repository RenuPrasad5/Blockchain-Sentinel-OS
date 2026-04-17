import React, { useState } from 'react';
import { 
    ShieldAlert, 
    Search, 
    FileText, 
    AlertTriangle, 
    Activity, 
    BarChart3, 
    Clock, 
    Download,
    Eye,
    Zap,
    Scale,
    Lock,
    Wifi,
    BrainCircuit,
    Code2,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityStream from '../components/ActivityStream';
import './Government.css';

/* ── Intelligence vs Explorer forensic data ───────────────────── */
const FORENSIC_CASES = [
    {
        id: 'PHS-1120',
        label: 'Ledger Phishing Forensic',
        risk: 88,
        status: 'CRITICAL',
        /* Intelligence View — plain English */
        intel: {
            summary: 'A malicious npm package was injected into the Ledger Connect Kit supply chain. When users connected their hardware wallets, an automated drain script silently swept ETH to an offshore stealth wallet via a non-KYC swap route.',
            phases: [
                { label: 'Supply Chain Breach', text: 'Attacker gained write access to the @ledger/connect-kit npm package and injected a wallet-drainer payload into version 1.1.7.' },
                { label: 'Silent Execution', text: 'When any dApp using the compromised library prompted a wallet signature, the payload fired automatically — no user action beyond connecting was required.' },
                { label: 'Obfuscated Exit', text: 'Stolen ETH (≈ $600K) was immediately routed through a non-KYC swap protocol and converted to Monero, breaking the on-chain trail.' },
            ],
            verdict: 'This is a confirmed supply-chain exploit targeting developer trust in widely-used open-source tooling. Immediate advisory: pin npm dependencies to verified hashes.',
        },
        /* Explorer View — raw hashes */
        explorer: {
            origin:    'Ledger.Exploit.v4 → 0x7f3a...c91d',
            recipient: '0x00ff...dead (Offshore Stealth)',
            txHash:    '0xabcd1234...ef56 (ERC-20 Drain TX)',
            block:     '18,842,001',
            gas:       '42,000 gwei',
            amount:    '412.88 ETH',
            contract:  '0xledger...c01e (Compromised SDK)',
        }
    },
    {
        id: 'SRC-7721',
        label: 'Tornado Cash Mixer Forensic',
        risk: 92,
        status: 'CRITICAL',
        intel: {
            summary: 'A wallet linked to a sanctioned jurisdiction performed sequential 100-ETH hops through multiple relay addresses before consolidating funds in a known Tornado Cash relayer cluster.',
            phases: [
                { label: 'Origin Detection', text: 'Inbound volume from a high-risk jurisdiction exchange was detected by our neural monitor at 14:22 UTC. Source entity is classified under OFAC SDN list.' },
                { label: 'Obfuscation Pattern', text: '1,420 ETH was automatically split into prime-number denominations (97, 113, 127 ETH) — a known technique to evade statistical detection algorithms.' },
                { label: 'Privacy Pool Entry', text: 'Funds bulk-deposited into a Tornado Cash privacy pool for cross-chain obfuscation. Post-mix destination: Arbitrum bridge.' },
            ],
            verdict: 'High confidence (92%) money laundering using privacy protocols. Recommend freeze + MLAT request to relevant jurisdiction.',
        },
        explorer: {
            origin:    '0x742d...492d (Sanctioned Exchange)',
            recipient: 'Tornado.Cash Router → 0x00...mix',
            txHash:    '0x9f8e7d...aabbcc',
            block:     '19,012,444',
            gas:       '120,000 gwei',
            amount:    '1,420 ETH (split: 97+113+127...)',
            contract:  '0xTornadoCash...v3 (Privacy Pool)',
        }
    }
];

/* ── Mode Switcher Component ──────────────────────────────────── */
const ModeSwitcher = ({ viewMode, setViewMode }) => (
    <div className="mode-switcher-bar">
        <div className="mode-switcher-label">
            <BrainCircuit size={14} className="text-blue-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Analysis Mode</span>
        </div>
        <div className="mode-switcher-tabs">
            <button
                className={`mode-tab ${viewMode === 'intelligence' ? 'active' : ''}`}
                onClick={() => setViewMode('intelligence')}
            >
                <BrainCircuit size={14} />
                <span>Intelligence View</span>
                {viewMode === 'intelligence' && (
                    <span className="mode-default-badge">DEFAULT</span>
                )}
            </button>
            <button
                className={`mode-tab ${viewMode === 'explorer' ? 'active-explorer' : ''}`}
                onClick={() => setViewMode('explorer')}
            >
                <Hash size={14} />
                <span>Explorer View</span>
            </button>
        </div>
        <div className="mode-desc">
            {viewMode === 'intelligence'
                ? '✦ Forensic narrative & plain-English summaries — not a standard blockchain explorer'
                : '⬡ Raw hashes, block data & technical chain state'}
        </div>
    </div>
);

/* ── Forensic Case Panel ──────────────────────────────────────── */
const ForensicCasePanel = ({ caseData, viewMode }) => (
    <motion.div
        key={`${caseData.id}-${viewMode}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="forensic-case-panel glass"
    >
        <div className="case-panel-header">
            <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${caseData.risk >= 80 ? 'bg-rose-500' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Case ID: {caseData.id}</span>
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${caseData.risk >= 80 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
                    {caseData.status}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Risk Index</span>
                <span className={`text-xl font-black ${caseData.risk >= 80 ? 'text-rose-500' : 'text-amber-400'}`}>{caseData.risk}/100</span>
            </div>
        </div>

        <h3 className="case-panel-title">{caseData.label}</h3>

        <AnimatePresence mode="wait">
            {viewMode === 'intelligence' ? (
                <motion.div
                    key="intel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="intel-view"
                >
                    <p className="intel-summary">{caseData.intel.summary}</p>
                    <div className="intel-phases">
                        {caseData.intel.phases.map((phase, i) => (
                            <div key={i} className="intel-phase-item">
                                <div className="phase-num">{String(i + 1).padStart(2, '0')}</div>
                                <div>
                                    <p className="phase-label">{phase.label}</p>
                                    <p className="phase-text">{phase.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="intel-verdict">
                        <Zap size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <p><strong className="text-white">Sentinel Verdict:</strong> {caseData.intel.verdict}</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="explorer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="explorer-view"
                >
                    {Object.entries(caseData.explorer).map(([key, val]) => (
                        <div key={key} className="explorer-row">
                            <span className="explorer-key">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                            <span className="explorer-val font-mono">{val}</span>
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

/* ── Main Component ───────────────────────────────────────────── */
const GovernmentAndEnforcement = () => {
    const [activeTab, setActiveTab] = useState('fraud');
    const [networkStatus, setNetworkStatus] = useState('Connecting');
    const [viewMode, setViewMode] = useState('intelligence'); // Default: Intelligence View
    const [activeFCase, setActiveFCase] = useState(FORENSIC_CASES[0]);

    const tabs = [
        { id: 'fraud', title: 'Fraud Detection', icon: <ShieldAlert size={18} /> },
        { id: 'case', title: 'Case Builder', icon: <FileText size={18} /> },
        { id: 'risk', title: 'Risk Scoring', icon: <BarChart3 size={18} /> },
        { id: 'alerts', title: 'Alert System', icon: <AlertTriangle size={18} /> }
    ];

    return (
        <div className="gov-terminal-wrapper">
            <header className="gov-header-section">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Forensic Intelligence Layer</span>
                    </div>
                    <h1 className="gov-main-title">Enforcement &amp; Surveillance Portal</h1>
                    <p className="gov-header-desc text-slate-400">Secure gateway for government agencies. National-level blockchain monitoring, fraud detection, and multi-entity relationship mapping.</p>
                </div>
                
                <div className="header-actions">
                    <div className="flex items-center gap-3">
                        <div className={`network-status-badge ${networkStatus.toLowerCase()}`}>
                            <Wifi size={14} className={networkStatus === 'Live' ? "text-emerald-400" : "text-amber-400"} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Status: {networkStatus}</span>
                        </div>
                        <div className="compliance-badge">
                            <Scale size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Compliance Ver: 8.4.2</span>
                        </div>
                    </div>
                    <button className="export-btn">
                        <Download size={14} />
                        <span>Export Evidence</span>
                    </button>
                </div>
            </header>

            {/* ═══ MODE SWITCHER (Task 3) ═══ */}
            <ModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />

            <div className="gov-nav-tabs">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={`gov-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.title}</span>
                    </button>
                ))}
            </div>

            <main className="gov-content-area">
                {activeTab === 'fraud' && (
                    <FraudDetectionDashboard
                        onStatusChange={setNetworkStatus}
                        viewMode={viewMode}
                        activeFCase={activeFCase}
                        setActiveFCase={setActiveFCase}
                    />
                )}
                {activeTab === 'case' && <CaseBuilder />}
                {activeTab === 'risk' && <RiskScoringSystem />}
                {activeTab === 'alerts' && <AlertManagement />}
            </main>
        </div>
    );
};

/* ── Fraud Detection Dashboard ───────────────────────────────── */
const FraudDetectionDashboard = ({ onStatusChange, viewMode, activeFCase, setActiveFCase }) => (
    <div className="gov-dashboard-grid">
        <div className="gov-stats-row">
            <div className="gov-stat-card glass">
                <div className="stat-label">Total Entities Flagged</div>
                <div className="stat-value text-rose-500">1,248</div>
                <div className="stat-meta">+12% from last cycle</div>
            </div>
            <div className="gov-stat-card glass">
                <div className="stat-label">Active Fraud Attempts</div>
                <div className="stat-value text-blue-500">42</div>
                <div className="stat-meta">Surveillance active</div>
            </div>
            <div className="gov-stat-card glass">
                <div className="stat-label">Cluster Complexity</div>
                <div className="stat-value text-indigo-400">High</div>
                <div className="stat-meta">Level 4 Security Alert</div>
            </div>
        </div>

        {/* Case Selector Pills */}
        <div className="flex gap-3 mt-6 mb-4">
            {FORENSIC_CASES.map(fc => (
                <button
                    key={fc.id}
                    onClick={() => setActiveFCase(fc)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        activeFCase.id === fc.id
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                    }`}
                >
                    {fc.id}: {fc.label.split(' ').slice(0, 2).join(' ')}
                </button>
            ))}
        </div>

        <div className="gov-main-grid mt-2">
            {/* Left: Activity Stream */}
            <div className="gov-panel-column glass overflow-hidden flex flex-col h-[600px]">
                <ActivityStream onStatusChange={onStatusChange} />
            </div>
            
            {/* Right: Forensic Case Panel with Mode Switcher content */}
            <div className="gov-panel-column glass flex flex-col gap-4">
                <div className="panel-header">
                    {viewMode === 'intelligence'
                        ? <><BrainCircuit size={16} /><span>Forensic Narrative — Intelligence View</span></>
                        : <><Hash size={16} /><span>Raw Chain Data — Explorer View</span></>
                    }
                </div>
                <AnimatePresence mode="wait">
                    <ForensicCasePanel
                        key={`${activeFCase.id}-${viewMode}`}
                        caseData={activeFCase}
                        viewMode={viewMode}
                    />
                </AnimatePresence>
            </div>
        </div>
    </div>
);

/* ── Case Builder ─────────────────────────────────────────────── */
const CaseBuilder = () => (
    <div className="gov-panel glass p-8">
        <div className="panel-header mb-8">
            <FileText size={18} />
            <span>Investigation Case Management System</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="case-creation-form col-span-2">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Case ID [ AUTO-GEN ]</label>
                        <input type="text" value="CASE-2026-X84-001" disabled className="bg-white/5 border border-white/10 p-3 text-white font-mono text-sm rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operation Narrative</label>
                        <textarea rows="4" placeholder="Enter investigation details..." className="bg-white/5 border border-white/10 p-3 text-white text-sm rounded-lg outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="flex gap-4">
                        <button className="flex-1 py-3 bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-lg hover:bg-indigo-600 transition-colors">Create Case File</button>
                        <button className="px-6 py-3 border border-white/10 text-slate-400 font-black uppercase text-xs tracking-widest rounded-lg hover:bg-white/5 transition-colors">Save Draft</button>
                    </div>
                </div>
            </div>
            <div className="active-cases-list">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Under Surveillance</h3>
                <div className="space-y-3">
                    {['Case #842 - Mixing Cluster Alpha', 'Case #841 - Institutional Leak', 'Case #839 - Node Exploitation'].map((title, i) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300">{title}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ── Risk Scoring System ──────────────────────────────────────── */
const RiskScoringSystem = () => (
    <div className="gov-panel glass p-8">
        <div className="panel-header mb-8">
            <BarChart3 size={18} />
            <span>AI-Based Intelligence Risk Scoring</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="risk-score-input md:col-span-1 border-r border-white/5 pr-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Validate Subject</h3>
                <input type="text" placeholder="WALLET OR ENS..." className="w-full bg-white/5 border border-white/10 p-3 text-white font-mono text-xs rounded-lg mb-4" />
                <button className="w-full py-3 bg-rose-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-lg">Run Forensic Audit</button>
            </div>
            <div className="risk-score-display md:col-span-3">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Index Status</div>
                        <div className="text-4xl font-black text-white tracking-widest">CRITICAL [ 94/100 ]</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center text-rose-500 font-black">94</div>
                </div>
                <div className="space-y-4 opacity-70">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                        <span className="text-xs font-bold uppercase tracking-widest">Laundering Probability</span>
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                        <span className="text-xs font-bold uppercase tracking-widest">Sanctions Correlation</span>
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: '12%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ── Alert Management ─────────────────────────────────────────── */
const AlertManagement = () => (
    <div className="gov-panel glass p-8">
        <div className="panel-header mb-8">
            <AlertTriangle size={18} />
            <span>Operational Trigger Configuration</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Active Surveillance Triggers</h3>
                <div className="space-y-4">
                    <SurveillanceToggle label="Large Value Movement (> $1M)" active={true} />
                    <SurveillanceToggle label="New Sanctioned Node Activity" active={true} />
                    <SurveillanceToggle label="Rapid Liquidity Withdrawal" active={false} />
                    <SurveillanceToggle label="Tornado Cash Interaction" active={true} />
                </div>
            </div>
            <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <Lock size={16} className="text-rose-500" />
                    <span className="text-xs font-black text-rose-500 uppercase">Emergency Protocol: LOCKDOWN</span>
                </div>
                <p className="text-xs text-rose-400/80 mb-6 font-medium leading-relaxed">Operational lockdown will halt all tracking and encrypt local session intelligence. Only use in case of physical terminal compromise.</p>
                <button className="w-full py-4 bg-rose-500 text-white font-black uppercase text-sm tracking-[0.5em] hover:bg-rose-600 transition-colors">TERMINATE UPLINK</button>
            </div>
        </div>
    </div>
);

/* ── Surveillance Toggle ──────────────────────────────────────── */
const SurveillanceToggle = ({ label, active }) => (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-blue-500' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
        </div>
    </div>
);

export default GovernmentAndEnforcement;
