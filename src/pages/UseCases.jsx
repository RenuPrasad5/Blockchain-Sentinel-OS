import React, { useState } from 'react';
import { 
    Search, 
    ArrowRight, 
    ShieldCheck, 
    Activity, 
    AlertTriangle,
    Database,
    Zap,
    Scale,
    Gavel,
    FileSearch,
    Shield,
    Users
} from 'lucide-react';
import './UseCases.css';

const UseCases = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeInvestigations = [
        { id: 'SRC-7721', title: 'Ledger Mixer Flow', risk: 'Critical', color: 'rose' },
        { id: 'AML-9904', title: 'Structuring Cluster', risk: 'High', color: 'orange' },
        { id: 'PHS-1120', title: 'Phishing Source Triage', risk: 'Critical', color: 'rose' }
    ];

    return (
        <div className="use-cases-container relative overflow-hidden">
            {/* ── Case Management Side-Toggle (Task 3) ── */}
            <div className={`fixed right-0 top-[80px] bottom-0 z-50 transition-all duration-500 ${sidebarOpen ? 'w-80' : 'w-0'}`}>
                <div className="h-full bg-[#0D1117] border-l border-white/5 backdrop-blur-xl p-6 shadow-2xl relative">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-10 h-24 bg-blue-600 text-white rounded-l-2xl flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg"
                    >
                        <div className="rotate-90 whitespace-nowrap text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Activity size={12} /> {sidebarOpen ? 'Close Case Files' : 'Open Case Management'}
                        </div>
                    </button>
                    
                    <div className="space-y-6 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="text-white font-black uppercase text-xs tracking-widest">Active Investigations</h3>
                            <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">3</span>
                        </div>
                        <div className="space-y-4">
                            {activeInvestigations.map(inv => (
                                <div key={inv.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/30 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black text-slate-500 uppercase">{inv.id}</span>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-${inv.color}-500/10 text-${inv.color}-500 border border-${inv.color}-500/20`}>
                                            {inv.risk}
                                        </span>
                                    </div>
                                    <h4 className="text-white text-xs font-bold leading-tight group-hover:text-blue-400 transition-colors">{inv.title}</h4>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 mt-6 bg-white/5 text-slate-400 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                            View Archive
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Hero Section (Task 1) ── */}
            <header className="use-cases-header pt-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-blue-500 rounded-full" />
                    <span className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em]">Government Portal</span>
                </div>
                <h1 className="text-white text-6xl md:text-7xl font-black tracking-tight m-0 mb-6 text-center leading-tight">
                    Sovereign Forensic <br /> Intelligence
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed text-center mx-auto font-medium">
                    National-grade solutions for Cyber-Investigators, AML Compliance Officers, and Legal Agencies 
                    to de-anonymize illicit activities on-chain.
                </p>
                <div className="flex items-center justify-center gap-6 mt-10">
                    <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <Shield size={12} className="text-blue-500" /> Forensic Standard
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <Scale size={12} className="text-emerald-500" /> Legal Admissibility
                    </span>
                </div>
            </header>

            {/* ── Targeted Enforcement Pillars (Task 2) ── */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <EnforcementCard 
                        title="Automated Evidence Chains" 
                        desc="Generate human-readable 'Forensic Narratives' that can be used directly in legal filings with cryptographic proof-of-state."
                        icon={<Gavel size={26} />}
                        badge="Verified by AI Core"
                        color="blue"
                    />
                    <EnforcementCard 
                        title="Institutional Exposure Mapping" 
                        desc="Identify when illicit funds touch KYC-verified exchanges or high-risk jurisdictions using deep cluster unmasking."
                        icon={<FileSearch size={26} />}
                        badge="Cluster IQ Grade"
                        color="indigo"
                    />
                    <EnforcementCard 
                        title="Regulatory Alert Engine" 
                        desc="Real-time flagging of 'Structuring' (Section 194-S) and Mixer-hop patterns before funds reach the bridge layers."
                        icon={<AlertTriangle size={26} />}
                        badge="Sovereign Standard"
                        color="rose"
                    />
                </div>

                {/* ── Additional Platform Features ── */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: 'De-Anonymizer', desc: 'Neural unmasking of wallet owner identities.', icon: <Users size={18}/> },
                        { title: 'Multi-Chain Trace', desc: 'Parallel investigation across 60+ ecosystems.', icon: <Database size={18}/> },
                        { title: 'Asset Recovery', desc: 'Strategic paths for frozen fund exfiltration.', icon: <Zap size={18}/> },
                        { title: 'Compliance Audit', desc: 'Automated SAR filing documentation ready.', icon: <ShieldCheck size={18}/> }
                    ].map(f => (
                        <div key={f.title} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 text-blue-400 transition-all">
                                {f.icon}
                            </div>
                            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-2">{f.title}</h4>
                            <p className="text-slate-500 text-[11px] font-medium leading-relaxed m-0">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/[0.01] blur-[120px] pointer-events-none -z-10" />
        </div>
    );
};

const EnforcementCard = ({ title, desc, icon, badge, color }) => (
    <div className="use-case-card glass p-10 flex flex-col gap-8 group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-${color}-500 group-hover:scale-125 transition-transform duration-700`}>
            {icon}
        </div>
        
        <div className="space-y-4 relative z-10">
            <span className={`px-3 py-1 bg-white/5 text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10 group-hover:border-${color}-500/30 group-hover:text-${color}-400 transition-colors`}>
                {badge}
            </span>
            <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 mb-6 border border-${color}-500/20`}>
                {icon}
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {desc}
            </p>
        </div>
        
        <button className={`mt-auto py-3.5 bg-white/5 hover:bg-${color}-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-${color}-500 transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]`}>
            Initialize Intelligence <ArrowRight size={13} />
        </button>
    </div>
);

export default UseCases;
