import React, { useState } from 'react';
import { 
    Shield, Scale, FileText, CheckCircle2, AlertOctagon, 
    Download, IndianRupee, Briefcase, Flag, Calendar
} from 'lucide-react';
import useModeStore from '../store/modeStore';

const IndiaCompliance = () => {
    const { indiaComplianceMode, setIndiaComplianceMode } = useModeStore();
    const [activeTab, setActiveTab] = useState('fiu');

    const stats = [
        { label: 'Suspicious Transaction Reports', value: 14, change: '+2 this month', icon: <Flag className="text-rose-500" /> },
        { label: 'Audit Cases Pending', value: 3, change: 'On Track', icon: <Briefcase className="text-amber-500" /> },
        { label: 'Total Forensic Value', value: '₹24.5Cr', change: 'Aggregated', icon: <IndianRupee className="text-emerald-500" /> },
    ];

    const mockAuditCases = [
        { id: 'AUD-2026-045', title: 'Q1 Crypto Liquidation', type: 'Tax Review', risk: 'Medium', status: 'Reviewing' },
        { id: 'AUD-2026-032', title: 'Suspected OTC Layering', type: 'FIU-IND File', risk: 'Critical', status: 'Sealed' },
        { id: 'AUD-2026-011', title: 'Foreign Remittance Trace', type: 'PMLA Case', risk: 'High', status: 'Approved' }
    ];

    // Return a simple disabled screen if not enabled
    if (!indiaComplianceMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-8">
                <div className="text-center max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                    <div className="w-20 h-20 bg-orange-900/20 border border-orange-500/30 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield size={36} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3 uppercase">India Compliance Node</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        The Bharat Compliance Engine is currently in inactive state. 
                        Enable compliance protocols to unlock statutory tracking, FIU-IND workflow, and CA audit modules.
                    </p>
                    <button 
                        onClick={() => setIndiaComplianceMode(true)}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20"
                    >
                        Initialize Compliance Module
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-8">
            {/* Government Header */}
            <div className="bg-gradient-to-r from-orange-900/20 via-slate-900 to-emerald-900/20 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white p-1 rounded-lg shadow-glow-orange">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" alt="India Emblem" className="h-full w-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">BHARAT COMPLIANCE INTELLIGENCE</h1>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase mt-1 text-slate-400">
                            <span className="px-2 py-0.5 bg-orange-900/40 border border-orange-800 text-orange-300 rounded">FIU-IND Grade</span>
                            <span className="px-2 py-0.5 bg-emerald-900/40 border border-emerald-800 text-emerald-300 rounded">PMLA SEC 12A</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setIndiaComplianceMode(false)}
                    className="text-xs font-bold text-slate-500 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-lg"
                >
                    Deactivate Secure Mode
                </button>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-30">{stat.icon}</div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-500" /> {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Navigation Panel */}
                <div className="w-full lg:w-64 space-y-2">
                    {[
                        { id: 'fiu', label: 'FIU-IND Dossiers', icon: <Flag size={18} /> },
                        { id: 'tax', label: 'Income Tax Audit', icon: <Scale size={18} /> },
                        { id: 'forensic', label: 'Forensic Evidence', icon: <FileText size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Active Content Area */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl min-h-[500px] overflow-hidden flex flex-col">
                    
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                                {activeTab === 'fiu' && 'FIU-IND Suspicious Activity Reporting'}
                                {activeTab === 'tax' && 'Chartered Accountant Tax Audit Workspace'}
                                {activeTab === 'forensic' && 'Admissible Judicial Evidence Vault'}
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">Secure Environment • Access logged to UIDAI gateway</p>
                        </div>
                        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                            <Download size={16} /> Export PDF
                        </button>
                    </div>

                    <div className="p-6 flex-1">
                        {activeTab === 'fiu' && (
                            <div className="space-y-6">
                                <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl flex gap-4 items-start">
                                    <AlertOctagon className="text-rose-500 shrink-0" size={24} />
                                    <div>
                                        <h4 className="text-rose-300 font-bold text-sm">High-Risk Activity Threshold Breach</h4>
                                        <p className="text-rose-200/70 text-xs mt-1 leading-relaxed">
                                            System identified multiple instances of structural layering that fit PMLA Section 3 criteria. Automated FIU-IND drafting ready for validation.
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-400 border-separate border-spacing-y-2">
                                        <thead className="text-xs font-black uppercase tracking-wider text-slate-600">
                                            <tr>
                                                <th className="pb-3 px-4">Reference</th>
                                                <th className="pb-3">Classification</th>
                                                <th className="pb-3">Legal Risk</th>
                                                <th className="pb-3">Status</th>
                                                <th className="pb-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockAuditCases.map(item => (
                                                <tr key={item.id} className="bg-slate-950 hover:bg-slate-800/50 transition-colors rounded-lg">
                                                    <td className="py-4 px-4 font-mono text-indigo-400 font-bold rounded-l-xl border-y border-l border-slate-800">{item.id}</td>
                                                    <td className="py-4 border-y border-slate-800">
                                                        <div className="font-bold text-slate-200">{item.title}</div>
                                                        <div className="text-xs text-slate-500">{item.type}</div>
                                                    </td>
                                                    <td className="py-4 border-y border-slate-800">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.risk === 'Critical' ? 'bg-rose-900/50 text-rose-400 border border-rose-900' : (item.risk === 'High' ? 'bg-orange-900/50 text-orange-400 border border-orange-900' : 'bg-slate-800 text-slate-400')}`}>
                                                            {item.risk}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 border-y border-slate-800">
                                                        <span className="flex items-center gap-1.5 text-xs font-bold">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Sealed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 border-y border-r border-slate-800 rounded-r-xl text-right px-4">
                                                        <button className="text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase">Open Case</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tax' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-white flex items-center gap-2"><Calendar size={16} className="text-slate-500" /> Financial Year 2025-26</h4>
                                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">AUTO-SYNC</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 border-b border-slate-900">
                                            <span className="text-slate-400 text-sm">Gross Inflows tracked</span>
                                            <span className="font-mono font-bold text-white">₹5,42,30,192</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border-b border-slate-900">
                                            <span className="text-slate-400 text-sm">Estimated VDA Tax (30%)</span>
                                            <span className="font-mono font-bold text-rose-400">₹1,62,69,057</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 border-b border-slate-900">
                                            <span className="text-slate-400 text-sm">TDS Sec 194S Flag</span>
                                            <span className="font-mono font-bold text-amber-400">Requires Manual Audit</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-sm font-bold transition-colors">
                                        Generate 26AS Comparison
                                    </button>
                                </div>

                                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                                    <Scale size={48} className="text-slate-800 mb-4" />
                                    <h4 className="font-bold text-slate-300">Forensic Calculation Engine</h4>
                                    <p className="text-slate-600 text-xs mt-2 max-w-xs">Upload external wallet CSV or API history to cross-reference on-chain activity with filed TDS returns.</p>
                                    <button className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold text-white shadow-lg shadow-indigo-900/20">
                                        Upload Statement
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'forensic' && (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-600">
                                <Shield size={48} className="mb-4 opacity-30" />
                                <p className="font-bold uppercase tracking-widest">Court-Admissible Evidence Repository</p>
                                <p className="text-sm mt-2">Store and cryptographically sign forensic artifacts for legal proceedings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndiaCompliance;
