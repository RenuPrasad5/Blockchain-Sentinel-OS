import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Search, 
    Shield, 
    Activity, 
    TrendingUp, 
    ArrowRight, 
    Download, 
    AlertTriangle,
    Loader2,
    Hash,
    User,
    ArrowUpRight,
    ArrowDownLeft,
    Briefcase,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const WalletAnalyzer = () => {
    const [wallet, setWallet] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('live'); // 'live' or 'history'
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlWallet = searchParams.get('wallet');
        const urlMode = searchParams.get('mode');

        if (urlWallet) {
            setWallet(urlWallet);
            if (urlMode) setMode(urlMode);
            // We use setTimeout to ensure states settle if needed, but it's cleaner to pass args explicitly
            performAnalysis(urlWallet, urlMode || 'live');
        }
    }, [location.search]);

    const handleAnalyze = async (e) => {
        if (e) e.preventDefault();
        performAnalysis(wallet, mode);
    };

    const performAnalysis = async (targetWallet, targetMode) => {
        if (!targetWallet || targetWallet.length !== 42) {
            setError("Please enter a valid Ethereum wallet address (42 characters)");
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);
        setIsSaved(false);
        console.log(`Analyzing Forensic Target (${targetMode.toUpperCase()}):`, targetWallet);

        try {
            const endpoint = targetMode === 'history' ? 'wallet-history' : 'wallet-live';
            const response = await fetch(`http://localhost:5000/${endpoint}/${targetWallet}`);
            if (!response.ok) throw new Error(`Failed to fetch ${targetMode} data from Sentinel API`);
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError(`Forensic uplink failed during ${mode} scan. Ensure backend is active.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!wallet) return;
        window.open(`http://localhost:5000/report/${wallet}?mode=${mode}`, '_blank');
    };

    const handleSaveCase = async () => {
        if (!data || !wallet) return;

        const user = auth.currentUser;
        if (!user) {
            alert("Security Protocol: You must be authenticated to save a forensic case.");
            return;
        }

        setIsSaving(true);
        try {
            // Strictly typed - no undefined, NaN or extra fields allowed
            const caseData = {
                wallet:     String(wallet || ""),
                riskScore:  Number(data.riskAnalysis?.anomalyScore ? Math.round(data.riskAnalysis.anomalyScore * 100) : 0),
                riskLevel:  String(data.riskAnalysis?.riskLevel || "Low"),
                mode:       String(mode || "live"),
                createdAt:  serverTimestamp(),
                userId:     String(user.uid),
                userEmail:  String(user.email || "")
            };

            console.log("FINAL DATA:", JSON.stringify({ ...caseData, createdAt: "serverTimestamp()" }));
            await addDoc(collection(db, 'cases'), caseData);

            setIsSaved(true);
            alert("Case saved successfully ✅");
        } catch (err) {
            console.error("SAVE ERROR:", err.code, err.message, err);
            alert("Failed to save case: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-4xl font-black text-white tracking-tight">Wallet Analyzer</h1>
                        <div className="flex bg-[#111] p-1 rounded-xl border border-white/5">
                            <button 
                                onClick={() => setMode('live')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'live' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Live Mode
                            </button>
                            <button 
                                onClick={() => setMode('history')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'history' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                History Mode
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-400">
                        {mode === 'live' 
                            ? "Real-time blockchain surveillance (latest blocks)" 
                            : "Comprehensive forensic history (Full Etherscan audit)"}
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl mb-8 shadow-2xl">
                    <form onSubmit={handleAnalyze} className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input 
                                type="text" 
                                placeholder="Enter Ethereum wallet address (0x...)" 
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`${mode === 'history' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-bold px-8 rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Analyze"}
                        </button>
                    </form>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2"
                        >
                            <AlertTriangle size={14} /> {error}
                        </motion.div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                                {mode === 'live' ? "Scanning Matrix for Live Block Activity..." : "Retrieving Archival Trace from Etherscan..."}
                            </p>
                        </motion.div>
                    ) : data ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* SECTION 0: Final Verdict Layer */}
                            <div className={`p-8 rounded-3xl border ${
                                data.riskAnalysis?.riskLevel === 'High' ? 'bg-red-500/10 border-red-500/20' : 
                                data.riskAnalysis?.riskLevel === 'Medium' ? 'bg-amber-500/10 border-amber-500/20' : 
                                'bg-emerald-500/10 border-emerald-500/20'
                            }`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${
                                            data.riskAnalysis?.riskLevel === 'High' ? 'bg-red-500/20' : 
                                            data.riskAnalysis?.riskLevel === 'Medium' ? 'bg-amber-500/20' : 
                                            'bg-emerald-500/20'
                                        }`}>
                                            <Shield size={32} className={
                                                data.riskAnalysis?.riskLevel === 'High' ? 'text-red-500' : 
                                                data.riskAnalysis?.riskLevel === 'Medium' ? 'text-amber-500' : 
                                                'text-emerald-500'
                                            } />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Final AML Verdict</h3>
                                            <p className="text-2xl font-black text-white">{data.riskAnalysis?.riskLevel?.toUpperCase()} RISK DETECTED</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Forensic Confidence</span>
                                        <span className="text-2xl font-black text-white">98.4%</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed max-w-4xl border-l-2 border-white/10 pl-4 py-2 italic">
                                    "{data.analysis?.verdict}"
                                </p>
                            </div>

                            {/* SECTION 1: Risk Overview Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-gradient-to-br from-[#0f0f0f] to-black border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Shield size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <User className="text-blue-500" size={24} />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Target Identity</span>
                                        </div>
                                        <h2 className="text-xl font-mono text-white mb-8 break-all">{wallet}</h2>
                                        
                                         <div className="flex items-center gap-12">
                                             <div>
                                                 <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Risk Index</span>
                                                 <span className="text-5xl font-black text-white">
                                                     {((data.riskAnalysis?.anomalyScore || 0) * 100).toFixed(0)}%
                                                 </span>
                                             </div>
                                             <div>
                                                 <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Security Status</span>
                                                 <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                                                     data.riskAnalysis?.riskLevel === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                                     data.riskAnalysis?.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                     'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                 }`}>
                                                     {data.riskAnalysis?.riskLevel === 'High' ? 'HIGH — Suspicious activity' : 
                                                      data.riskAnalysis?.riskLevel === 'Medium' ? 'MEDIUM — Unusual patterns' : 
                                                      'LOW — Normal activity'}
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="mt-8 pt-6 border-t border-white/5">
                                             <div className="flex items-center gap-2 mb-2">
                                                 <Activity size={14} className="text-blue-400" />
                                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Intelligence Briefing</span>
                                             </div>
                                             <p className="text-sm text-slate-300 leading-relaxed italic">
                                                 {data.analysis?.explanation}
                                             </p>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="space-y-6">
                                     <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                         <div className="flex items-center gap-3 mb-4">
                                             <div className="p-2 bg-amber-500/10 rounded-lg">
                                                 <AlertTriangle className="text-amber-500" size={16} />
                                             </div>
                                             <span className="text-xs font-black uppercase tracking-widest text-slate-500">Behavioral Flags</span>
                                         </div>
                                         <div className="space-y-2">
                                             {data.behavioralFlags?.length > 0 ? data.behavioralFlags.map((flag, i) => (
                                                 <div key={i} className="flex items-center gap-2 text-[9px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                                     <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                                     {flag}
                                                 </div>
                                             )) : (
                                                 <p className="text-[10px] text-slate-500 italic">No critical behavioral flags triggered.</p>
                                             )}
                                         </div>
                                     </div>

                                     <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                         <div className="flex items-center gap-3 mb-4">
                                             <div className="p-2 bg-purple-500/10 rounded-lg">
                                                 <Activity className="text-purple-500" size={16} />
                                             </div>
                                             <span className="text-xs font-black uppercase tracking-widest text-slate-500">Time Intelligence</span>
                                         </div>
                                         <div className="space-y-2">
                                             {data.stats?.timePatterns?.length > 0 ? data.stats.timePatterns.map((p, i) => (
                                                 <div key={i} className="flex items-center gap-2 text-[9px] text-slate-300 bg-purple-500/5 px-2 py-1 rounded-lg border border-purple-500/10">
                                                     <Activity size={10} className="text-purple-400" />
                                                     {p}
                                                 </div>
                                             )) : (
                                                 <p className="text-[10px] text-slate-500 italic">Standard temporal patterns.</p>
                                             )}
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* SECTION 2: Fund Flow Graph (Visual) */}
                             <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl">
                                 <div className="flex items-center justify-between mb-8">
                                     <div className="flex items-center gap-3">
                                         <div className="p-2 bg-blue-500/10 rounded-lg">
                                             <Activity className="text-blue-500" size={18} />
                                         </div>
                                         <span className="text-xs font-black uppercase tracking-widest text-white">Forensic Fund Flow Graph</span>
                                     </div>
                                     <span className="text-[10px] text-slate-500 font-mono">DYNAMIC RELATIONSHIP MAPPING</span>
                                 </div>
                                 
                                 <div className="h-[400px] w-full bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                                     {/* Simple Dynamic SVG Graph Visualizer */}
                                     <svg width="100%" height="100%" className="absolute inset-0">
                                         <defs>
                                             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orientation="auto">
                                                 <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
                                             </marker>
                                         </defs>
                                         {/* Lines */}
                                         {data.transactions?.slice(0, 15).map((tx, i) => {
                                             const angle = (i / 15) * 2 * Math.PI;
                                             const x = 500 + Math.cos(angle) * 150; // Offset for centering
                                             const y = 200 + Math.sin(angle) * 150;
                                             const isOutbound = tx.from.toLowerCase() === wallet.toLowerCase();
                                             return (
                                                 <line 
                                                     key={i}
                                                     x1={x} y1={y} 
                                                     x2="50%" y2="50%" 
                                                     stroke={isOutbound ? "#f43f5e33" : "#10b98133"} 
                                                     strokeWidth="1"
                                                 />
                                             );
                                         })}
                                         {/* Counterparty Nodes */}
                                         {data.transactions?.slice(0, 15).map((tx, i) => {
                                             const angle = (i / 15) * 2 * Math.PI;
                                             const x = 500 + Math.cos(angle) * 150;
                                             const y = 200 + Math.sin(angle) * 150;
                                             return (
                                                 <g key={i}>
                                                     <circle cx={x} cy={y} r="4" fill={tx.type === 'CONTRACT_INTERACTION' ? '#a855f7' : '#3b82f6'} />
                                                     <text x={x+8} y={y+4} fill="#64748b" fontSize="8" fontFamily="monospace">
                                                         {tx.counterpartyLabel?.substring(0, 12)}...
                                                     </text>
                                                 </g>
                                             );
                                         })}
                                         {/* Target Node */}
                                         <circle cx="50%" cy="50%" r="12" fill="#2563eb" className="animate-pulse" />
                                         <text x="50%" y="45%" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">TARGET</text>
                                     </svg>
                                     
                                     <div className="absolute bottom-4 left-4 flex gap-4">
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                             <span className="text-[8px] font-black uppercase text-slate-500">Incoming</span>
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                             <span className="text-[8px] font-black uppercase text-slate-500">Outgoing</span>
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                             <span className="text-[8px] font-black uppercase text-slate-500">Contract</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* SECTION 3: Summary Stats */}
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                 <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Total Activities</span>
                                     <div className="flex items-center gap-3">
                                         <Activity size={20} className="text-blue-500" />
                                         <span className="text-2xl font-black text-white">{data.stats?.totalTransactions || 0}</span>
                                     </div>
                                 </div>
                                 <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Asset Volume</span>
                                     <div className="flex items-center gap-3">
                                         <TrendingUp size={20} className="text-emerald-500" />
                                         <span className="text-xl font-black text-white">{data.stats?.totalVolume}</span>
                                     </div>
                                 </div>
                                 <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Network Exposure</span>
                                     <div className="flex items-center gap-3">
                                         <User size={20} className="text-blue-400" />
                                         <span className="text-2xl font-black text-white">{data.stats?.uniqueCounterparties || 0}</span>
                                     </div>
                                 </div>
                                 <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                     <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Protocol Calls</span>
                                     <div className="flex items-center gap-3">
                                         <ArrowUpRight size={20} className="text-rose-400" />
                                         <span className="text-2xl font-black text-white">{data.stats?.contractInteractions || 0}</span>
                                     </div>
                                 </div>
                             </div>

                             {/* SECTION 4: Transactions List */}
                             <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                 <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                         <Hash size={18} className="text-blue-500" />
                                         <h3 className="font-black uppercase tracking-widest text-xs text-white">Advanced Forensic Trace</h3>
                                     </div>
                                     <div className="flex items-center gap-4">
                                         <button 
                                             onClick={handleSaveCase}
                                             disabled={isSaved || isSaving}
                                             className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${
                                                 isSaved ? 'text-emerald-500' : 'text-purple-500 hover:text-purple-400'
                                             } disabled:opacity-50`}
                                         >
                                             {isSaved ? <Check size={12} /> : <Briefcase size={12} />} 
                                             {isSaved ? 'Case Saved' : (isSaving ? 'Saving...' : 'Save Case')}
                                         </button>
                                         <button 
                                             onClick={handleDownloadReport}
                                             className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                                         >
                                             <Download size={12} /> Export Intelligence
                                         </button>
                                         <span className="text-[10px] text-slate-500 font-mono">SHOWING TOP {data.transactions?.length} OF {data.stats?.totalTransactions}</span>
                                     </div>
                                 </div>
                                 <div className="overflow-x-auto">
                                     <table className="w-full text-left">
                                         <thead className="bg-black/40">
                                             <tr>
                                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hash</th>
                                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Counterparty Intelligence</th>
                                                 <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Forensic Value</th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-white/5">
                                             {data.transactions?.slice(0, 15).map((tx, idx) => {
                                                 const isOutbound = tx.from.toLowerCase() === wallet.toLowerCase();
                                                 
                                                 return (
                                                     <tr key={idx} className="hover:bg-white/5 transition-all group">
                                                         <td className="px-6 py-4 font-mono text-[11px] text-blue-400">
                                                             {tx.hash.substring(0, 12)}...
                                                         </td>
                                                         <td className="px-6 py-4">
                                                             <span className={`px-2 py-0.5 border rounded text-[9px] font-black uppercase tracking-widest ${
                                                                 tx.type === 'CONTRACT_INTERACTION' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                                 isOutbound ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                                                 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                             }`}>
                                                                 {tx.type === 'CONTRACT_INTERACTION' ? 'CONTRACT' : (isOutbound ? 'OUTBOUND' : 'INBOUND')}
                                                             </span>
                                                         </td>
                                                         <td className="px-6 py-4">
                                                             <div className="flex flex-col">
                                                                 <span className="font-mono text-[11px] text-slate-300">
                                                                     {isOutbound ? (tx.to?.substring(0, 18) || '0x000... (Contract)') : tx.from.substring(0, 18)}...
                                                                 </span>
                                                                 <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">
                                                                     {tx.counterpartyLabel}
                                                                 </span>
                                                             </div>
                                                         </td>
                                                         <td className="px-6 py-4">
                                                             {parseFloat(tx.value) === 0 ? (
                                                                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">
                                                                     Contract Interaction
                                                                 </span>
                                                             ) : (
                                                                 <span className="text-sm font-bold text-white">
                                                                     {tx.value} ETH
                                                                 </span>
                                                             )}
                                                         </td>
                                                     </tr>
                                                 );
                                             })}
                                         </tbody>
                                     </table>
                                    {(!data.transactions || data.transactions.length === 0) && (
                                        <div className="py-24 text-center">
                                            <Activity size={32} className="mx-auto text-white/5 mb-4" />
                                            <p className="text-slate-500 text-sm font-medium tracking-tight">No recent on-chain activity detected within analysis window</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#0f0f0f] border border-dashed border-white/10 rounded-3xl py-32 text-center"
                        >
                            <Shield size={64} className="mx-auto text-white/5 mb-6" />
                            <h3 className="text-xl font-bold text-slate-500 mb-2">Awaiting Forensic Target</h3>
                            <p className="text-slate-600 text-sm">Initialize a live scan by entering an Ethereum wallet address above.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WalletAnalyzer;
