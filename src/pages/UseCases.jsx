import React, { useState } from 'react';
import { 
    Search, 
    Truck, 
    BarChart, 
    ArrowRight, 
    CheckCircle, 
    ShieldCheck, 
    Activity, 
    AlertTriangle,
    Database,
    Lock,
    Globe,
    Zap
} from 'lucide-react';
import './UseCases.css';

const UseCases = () => {
    const [activeCase, setActiveCase] = useState('forensics');

    const cases = [
        { id: 'forensics', title: 'Digital Forensics', icon: <Search size={22} /> },
        { id: 'supply', title: 'Supply Chain Fraud', icon: <Truck size={22} /> },
        { id: 'finance', title: 'Financial Monitoring', icon: <BarChart size={22} /> }
    ];

    return (
        <div className="use-cases-container">
            <header className="use-cases-header">
                <span className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Strategic Applications</span>
                <h1 className="text-white text-5xl font-black tracking-tighter m-0 mb-4">Operational Use Cases</h1>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    National-grade intelligence solutions designed to address the most complex blockchain-based security and compliance challenges facing modern regulators.
                </p>
            </header>

            <nav className="use-cases-nav">
                {cases.map(c => (
                    <button 
                        key={c.id}
                        className={`use-case-tab-btn ${activeCase === c.id ? 'active' : ''}`}
                        onClick={() => setActiveCase(c.id)}
                    >
                        {c.icon}
                        <span>{c.title}</span>
                    </button>
                ))}
            </nav>

            <main className="use-case-content">
                {activeCase === 'forensics' && <DigitalForensicsContent />}
                {activeCase === 'supply' && <SupplyChainContent />}
                {activeCase === 'finance' && <FinancialMonitoringContent />}
            </main>
        </div>
    );
};

const DigitalForensicsContent = () => (
    <div className="use-case-detail-grid">
        <div className="use-case-card glass p-8">
            <div className="flex flex-col gap-8">
                <div>
                    <h3 className="text-rose-500 font-black uppercase text-[10px] tracking-widest mb-4 border-b border-rose-500/20 pb-2">The Critical Problem</h3>
                    <p className="text-white text-xl font-medium leading-relaxed m-0">
                        The explosion of decentralized finance (DeFi) has created a lack of traceability, enabling complex money laundering and ransomware payouts that bypass traditional surveillance.
                    </p>
                </div>
                <div>
                    <h3 className="text-blue-500 font-black uppercase text-[10px] tracking-widest mb-4 border-b border-blue-500/20 pb-2">The Forensic Solution</h3>
                    <p className="text-slate-300 text-lg leading-relaxed m-0">
                        AI-powered real-time tracking that maps entity cluster relationships, identifies obfuscation techniques (mixers/bridges), and enables deep-dive wallet visualization.
                    </p>
                </div>
                <div className="gov-action-flow p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 text-center">Operational Timeline</div>
                    <div className="flex justify-between items-center relative">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2"></div>
                        <Step label="TRACK" active={true} icon={<Globe size={14} />} />
                        <Step label="DETECT" active={true} icon={<Zap size={14} />} />
                        <Step label="INVESTIGATE" active={true} icon={<Search size={14} />} />
                        <Step label="ACT" active={false} icon={<AlertTriangle size={14} />} />
                    </div>
                </div>
            </div>
        </div>
        <div className="use-case-visuals">
            <div className="grid grid-cols-2 gap-6">
                <FeatureCard title="Forensic Mapping" desc="Trace funds through complex smart contracts and bridge layers automatically." icon={<Search size={18} />} />
                <FeatureCard title="Cluster Analysis" desc="Identify high-risk clusters using AI-based node classification." icon={<Database size={18} />} />
                <FeatureCard title="Evidence Export" desc="Generate legally admissible reports with cryptographic verification." icon={<CheckCircle size={18} />} />
                <FeatureCard title="Real-Time Alerts" desc="Instant notification for flagged entity movements across 60+ chains." icon={<Activity size={18} />} />
            </div>
        </div>
    </div>
);

const SupplyChainContent = () => (
    <div className="use-case-detail-grid">
        <div className="use-case-card glass p-8">
            <div className="flex flex-col gap-8">
                <div>
                    <h3 className="text-rose-500 font-black uppercase text-[10px] tracking-widest mb-4 border-b border-rose-500/20 pb-2">The Vulnerability</h3>
                    <p className="text-white text-xl font-medium leading-relaxed m-0">
                        Global supply chains suffer from a lack of transparency, leading to counterfeit goods, tax evasion through under-invoicing, and illicit cargo diversion in international waters.
                    </p>
                </div>
                <div>
                    <h3 className="text-blue-500 font-black uppercase text-[10px] tracking-widest mb-4 border-b border-blue-500/20 pb-2">The Surveillance Strategy</h3>
                    <p className="text-slate-300 text-lg leading-relaxed m-0">
                        Immutable asset tracking on-chain combined with AI anomaly detection triggers alerts when movement or financial signals deviate from verified institutional protocols.
                    </p>
                </div>
                <button className="py-4 bg-blue-500 text-white font-black uppercase text-sm tracking-[0.2em] rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                    Initialize Supply Surveillance <ShieldCheck size={18} />
                </button>
            </div>
        </div>
        <div className="use-case-visuals">
             <div className="grid grid-cols-2 gap-6">
                <FeatureCard title="Asset Lineage" desc="Trace Every component from raw material to final point of sale." icon={<Truck size={18} />} />
                <FeatureCard title="Anomaly Detection" desc="Instant alerts for geographic or volume deviations." icon={<AlertTriangle size={18} />} />
                <FeatureCard title="Tax Compliance" desc="Automated audit logs for international shipping and customs." icon={<CheckCircle size={18} />} />
                <FeatureCard title="Private Ledger Sync" desc="Secure integration with existing legacy ERP databases." icon={<Lock size={18} />} />
            </div>
        </div>
    </div>
);

const FinancialMonitoringContent = () => (
    <div className="use-case-detail-grid">
        <div className="use-case-card glass p-8">
            <div className="flex flex-col gap-8">
                <div>
                    <h3 className="text-rose-500 font-black uppercase text-[10px] tracking-widest mb-4 border-b border-rose-500/20 pb-2">The Oversight Gap</h3>
                    <p className="text-white text-xl font-medium leading-relaxed m-0">
                        Regulators lack real-time oversight of fund movements between centralized exchanges and private wallets, creating blind spots for illicit international transfers.
                    </p>
                </div>
                <div>
                    <h3 className="text-blue-500 font-black uppercase text-[10px] tracking-widest mb-4 border-b border-blue-500/20 pb-2">The Regulatory Solution</h3>
                    <p className="text-slate-300 text-lg leading-relaxed m-0">
                        Real-time dashboard integration mapping all cross-border flows, combined with predictive risk analysis to flag suspicious entities before the final transaction layers.
                    </p>
                </div>
                <div className="stats-row flex gap-6">
                    <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Flow Monitored</div>
                        <div className="text-2xl font-black text-white">$2.8B / HR</div>
                    </div>
                    <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Detection Rate</div>
                        <div className="text-2xl font-black text-blue-500">99.8%</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="use-case-visuals">
            <div className="grid grid-cols-2 gap-6">
                <FeatureCard title="AML Surveillance" desc="Global monitoring of high-risk wallets and mixing clusters." icon={<ShieldCheck size={18} />} />
                <FeatureCard title="Risk Analysis" desc="Predictive modeling of entity behavior for risk scoring." icon={<BarChart size={18} />} />
                <FeatureCard title="Regulatory Audits" desc="Generate compliance certificates for institutional actors." icon={<CheckCircle size={18} />} />
                <FeatureCard title="Sanctions Sync" desc="Live daily updates from global sanctions lists (OFAC/UN)." icon={<Activity size={18} />} />
            </div>
        </div>
    </div>
);

const Step = ({ label, active, icon }) => (
    <div className={`flex flex-col items-center gap-2 z-10 p-3 rounded-xl transition-all ${active ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-white/5 border border-white/5'}`}>
        <div className={`p-2 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
            {icon}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-blue-500' : 'text-slate-500'}`}>{label}</span>
    </div>
);

const FeatureCard = ({ title, desc, icon }) => (
    <div className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-white/10 transition-all group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
            {icon}
        </div>
        <h4 className="text-white text-sm font-black uppercase tracking-widest mb-3">{title}</h4>
        <p className="text-slate-400 text-xs leading-relaxed m-0">{desc}</p>
    </div>
);

export default UseCases;
