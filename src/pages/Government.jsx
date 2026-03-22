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
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Government.css';

const GovernmentAndEnforcement = () => {
    const [activeTab, setActiveTab] = useState('fraud');

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
                    <h1 className="gov-main-title">Enforcement & Surveillance Portal</h1>
                    <p className="gov-header-desc text-slate-400">Secure gateway for government agencies. National-level blockchain monitoring, fraud detection, and multi-entity relationship mapping.</p>
                </div>
                
                <div className="header-actions">
                    <div className="compliance-badge">
                        <Scale size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Compliance Ver: 8.4.2</span>
                    </div>
                    <button className="export-btn">
                        <Download size={14} />
                        <span>Export Evidence</span>
                    </button>
                </div>
            </header>

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
                {activeTab === 'fraud' && <FraudDetectionDashboard />}
                {activeTab === 'case' && <CaseBuilder />}
                {activeTab === 'risk' && <RiskScoringSystem />}
                {activeTab === 'alerts' && <AlertManagement />}
            </main>
        </div>
    );
};

const FraudDetectionDashboard = () => (
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

        <div className="gov-main-grid mt-6">
            <div className="gov-panel-column glass">
                <div className="panel-header">
                    <Activity size={16} />
                    <span>Real-Time Illicit Activity Stream</span>
                </div>
                <div className="panel-content">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="anomaly-item border-l-2 border-rose-500 p-4 bg-rose-500/5 mb-3">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-rose-500 uppercase">Alert: Potential Structuring</span>
                                <span className="text-[10px] text-slate-500">0.4s ago</span>
                            </div>
                            <div className="text-xs font-mono text-slate-300 mb-2 truncate">0x71C...8e92 → 0xAb5...C9b</div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-white">$1,240,000 USD</span>
                                <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Initialize Case</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="gov-panel-column glass">
                <div className="panel-header">
                    <Search size={16} />
                    <span>Cross-Network Relationship Mapping</span>
                </div>
                <div className="panel-content flex items-center justify-center p-8">
                    <div className="text-center opacity-40">
                        <Eye size={48} className="mx-auto mb-4" />
                        <p className="text-xs uppercase font-black tracking-widest leading-relaxed">Intelligence Graph View <br/> [ Loading Node Relationships... ]</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

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

const SurveillanceToggle = ({ label, active }) => (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-blue-500' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
        </div>
    </div>
);

export default GovernmentAndEnforcement;
