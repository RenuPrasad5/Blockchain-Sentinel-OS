import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShieldAlert, Briefcase, FileSearch, Share2, Scale, 
    ArrowRight, Activity, Search, ShieldCheck, Database, 
    Clock, Cpu, ChevronRight, FileText, Download, Plus, AlertCircle
} from 'lucide-react';

const mockCases = [
    { id: '1', title: 'Operation Shadow Run', target: '0xd8dA6...045', risk: 'High', date: '2026-05-06' },
    { id: '2', title: 'Uniswap Dusting Audit', target: '0x92AA8...55C', risk: 'Medium', date: '2026-05-05' },
    { id: '3', title: 'CA Tax Compliance Log', target: '0x11111...582', risk: 'Low', date: '2026-05-04' }
];

const mockAlerts = [
    { msg: 'Dusting exposure flagged on Uniswap V2 Router', time: '1 min ago', type: 'warning' },
    { msg: 'Multi-hop layered flow detected (Depth 3)', time: '5 mins ago', type: 'danger' },
    { msg: 'High value transfer (> 50 ETH) verified', time: '12 mins ago', type: 'info' }
];

const mockNodes = [
    { id: 'Root', label: '0xd8da6...045 (Suspect)', type: 'Root', val: 'Start' },
    { id: 'Hop1', label: '0x243ce...745', type: 'Wallet', val: '12.4 ETH' },
    { id: 'Hop2', label: 'Uniswap Router', type: 'Contract', val: 'Contract Call' },
    { id: 'Hop3', label: 'Binance Deposit', type: 'Exchange', val: '8.2 ETH' }
];

const CommandCenter = () => {
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState('');
    const [selectedNode, setSelectedNode] = useState(mockNodes[0]);
    const [note, setNote] = useState('Suspect wallet exhibited rapid burst activity post-mixer interaction. Heavy contract execution observed on decentralized routing nodes.');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchVal.trim().length === 42) {
            navigate(`/tools/analyzer?wallet=${searchVal}`);
        } else {
            alert('Please enter a valid 42-character Ethereum address');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-white bg-[#0a0f1d]">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* TOP BAR: Quick Operations & Threat Ticker */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                    <form onSubmit={handleSearch} className="relative xl:col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Execute Forensic Trace (Enter 42-char wallet address)..." 
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="w-full bg-[#0d1527] border border-slate-800 pl-12 pr-28 py-3 rounded-xl focus:border-blue-500/50 focus:outline-none text-slate-200 placeholder-slate-600 text-sm font-mono"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors">
                            Trace Flow
                        </button>
                    </form>
                    <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/30 px-4 py-3 rounded-xl text-red-400 text-xs font-mono">
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                        <span className="animate-pulse font-black uppercase">[THREAT ALERT]</span>
                        <marquee className="w-full">Suspicious rapid layered movement observed across 3 sovereign bridges. System monitoring active.</marquee>
                    </div>
                </div>

                {/* THREE PANEL WORKSPACE */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* LEFT PANEL: Cases & Real-time Feeds */}
                    <div className="space-y-6">
                        {/* Active Cases */}
                        <div className="glass p-5 rounded-2xl border border-slate-800 bg-slate-950/40">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <Briefcase size={14} className="text-blue-500" /> Active Case Files
                            </h3>
                            <div className="space-y-3">
                                {mockCases.map(c => (
                                    <div key={c.id} onClick={() => navigate('/cases')} className="p-3 rounded-xl bg-[#0d1527] border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition-colors">{c.title}</span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                                c.risk === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>{c.risk}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono">{c.target}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Intelligence Alerts */}
                        <div className="glass p-5 rounded-2xl border border-slate-800 bg-slate-950/40">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" /> Live Forensic Intel Feed
                            </h3>
                            <div className="space-y-3">
                                {mockAlerts.map((a, i) => (
                                    <div key={i} className="text-[11px] border-b border-slate-800/40 pb-2 last:border-0 last:pb-0 font-mono">
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                            <span>{a.time}</span>
                                            <span className="uppercase text-slate-600">[VERIFIED]</span>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed">{a.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CENTER PANEL: Multi-Hop Trace Graph Workspace */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-6 rounded-2xl border border-slate-800 bg-[#0d1425]/40 flex flex-col justify-between min-h-[550px]">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">
                                            Interactive Multi-Hop Fund Flow Visualizer
                                        </h2>
                                        <p className="text-xs text-slate-500">Forensic-grade topological intelligence map simulation.</p>
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase">
                                        Active Trace Session
                                    </span>
                                </div>

                                {/* Mock Topology Graph Representation */}
                                <div className="relative border border-slate-800/80 rounded-2xl bg-[#070b14] h-[360px] overflow-hidden flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full relative z-10">
                                        {mockNodes.map((node, i) => (
                                            <div 
                                                key={node.id} 
                                                onClick={() => setSelectedNode(node)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between min-h-[140px] ${
                                                    selectedNode.id === node.id 
                                                        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10 scale-105' 
                                                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                                        node.type === 'Root' ? 'bg-purple-500/20 text-purple-400' :
                                                        node.type === 'Contract' ? 'bg-indigo-500/20 text-indigo-400' :
                                                        node.type === 'Exchange' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {node.type}
                                                    </span>
                                                    {i < 3 && <ChevronRight size={14} className="text-slate-600" />}
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-[11px] font-mono text-slate-200 truncate">{node.label}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1">{node.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-slate-800/80 gap-4 mt-4">
                                <div className="text-xs">
                                    <span className="text-slate-500">Selected Entity: </span>
                                    <span className="font-mono font-bold text-slate-300">{selectedNode.label}</span>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button onClick={() => navigate('/tools/visualizer')} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5">
                                        Launch Trace Engine <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Notes, Evidence, PDF Dossier */}
                    <div className="space-y-6">
                        {/* Investigation Notes & Timeline */}
                        <div className="glass p-5 rounded-2xl border border-slate-800 bg-slate-950/40">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <Database size={14} className="text-purple-500" /> Evidence Dossier & Notes
                            </h3>
                            <textarea 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-[#0d1527] border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-purple-500/50 min-h-[140px] resize-none font-mono leading-relaxed"
                            />
                            
                            <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dossier Activity Logs</p>
                                <div className="space-y-2 text-[10px] font-mono text-slate-400">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">&gt; Risk Score Calculated</span>
                                        <span>Verdict: High</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">&gt; Graph Node 3 Added</span>
                                        <span>2026-05-06</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Evidence Export & Compliance Actions */}
                        <div className="glass p-5 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Scale size={14} className="text-blue-400" /> Compliance Export Module
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Compile and seal this investigation workspace into a signed court-admissible forensic intelligence dossier.
                            </p>
                            <div className="space-y-2">
                                <button onClick={() => navigate('/forensic-lab')} className="w-full bg-[#0d1527] border border-slate-800 hover:border-slate-700 p-3 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center justify-between group">
                                    <span className="flex items-center gap-2">
                                        <FileText size={16} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                                        Evidence PDF Report
                                    </span>
                                    <Download size={14} className="text-slate-500" />
                                </button>
                                <button onClick={() => navigate('/cases')} className="w-full bg-[#0d1527] border border-slate-800 hover:border-slate-700 p-3 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center justify-between group">
                                    <span className="flex items-center gap-2">
                                        <Database size={16} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                                        Archive Session Logs
                                    </span>
                                    <Plus size={14} className="text-slate-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CommandCenter;
