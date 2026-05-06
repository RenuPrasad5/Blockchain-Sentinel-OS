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
    Check,
    Globe,
    FileSearch,
    Share2,
    DollarSign,
    RefreshCw
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
    const [appMode, setAppMode] = useState('gov'); // 'gov' | 'ca' | 'enterprise'
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
            performAnalysis(urlWallet, urlMode || 'live');
        }
    }, [location.search]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

        try {
            const endpoint = targetMode === 'history' ? 'wallet-history' : 'wallet-live';
            const response = await fetch(`${API_URL}/${endpoint}/${targetWallet}`);
            if (!response.ok) throw new Error(`Failed to fetch ${targetMode} data from Sentinel API (HTTP ${response.status})`);
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error("Forensic Scan Error Details:", err);
            setError(`Forensic uplink failed during ${targetMode} scan. Error: ${err.message}. Ensure backend is active.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!wallet) return;
        window.open(`${API_URL}/report/${wallet}?mode=${mode}`, '_blank');
    };

    const handleExportTaxReport = () => {
        if (!wallet) return;
        window.open(`${API_URL}/report/${wallet}?mode=${mode}&appMode=ca`, '_blank');
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
            const caseData = {
                wallet: String(wallet || ""),
                riskScore: Number(data.riskAnalysis?.anomalyScore ? Math.round(data.riskAnalysis.anomalyScore * 100) : 0),
                riskLevel: String(data.riskAnalysis?.riskLevel || "Low"),
                mode: String(mode || "live"),
                createdAt: serverTimestamp(),
                userId: String(user.uid),
                userEmail: String(user.email || "")
            };

            await addDoc(collection(db, 'cases'), caseData);
            setIsSaved(true);
            alert("Case saved successfully ✅");
        } catch (err) {
            console.error("SAVE ERROR:", err);
            alert("Failed to save case: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Derived CA Mode metrics
    const totalInflow = data?.transactions?.reduce((sum, tx) => {
        const isOutbound = tx.from.toLowerCase() === wallet.toLowerCase();
        return sum + (isOutbound ? 0 : parseFloat(tx.value || 0));
    }, 0) || 0;

    const totalOutflow = data?.transactions?.reduce((sum, tx) => {
        const isOutbound = tx.from.toLowerCase() === wallet.toLowerCase();
        return sum + (isOutbound ? parseFloat(tx.value || 0) : 0);
    }, 0) || 0;

    const netProfitLoss = totalInflow - totalOutflow;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight uppercase tracking-wide">Dynamic Intelligence Workspace</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {mode === 'live' 
                                    ? "Real-time blockchain surveillance (latest blocks)" 
                                    : "Comprehensive forensic history (Full Etherscan audit)"}
                            </p>
                        </div>
                        <div className="flex bg-[#111] p-1 rounded-xl border border-white/5">
                            <button 
                                onClick={() => setMode('live')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'live' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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

                    {/* Mode Selector */}
                    <div className="flex bg-[#111]/60 p-1.5 rounded-2xl border border-white/5 w-fit mb-6 gap-1 backdrop-blur-md shadow-2xl">
                        {[
                            { id: 'gov', label: 'Government Mode', icon: <Globe size={14} /> },
                            { id: 'ca', label: 'CA Mode', icon: <DollarSign size={14} /> },
                            { id: 'enterprise', label: 'Enterprise Mode', icon: <Briefcase size={14} /> }
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setAppMode(m.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${appMode === m.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg' : 'text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                {m.icon}
                                <span>{m.label}</span>
                            </button>
                        ))}
                    </div>
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
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-sm"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-2xl transition-all flex items-center gap-2 disabled:opacity-50 select-none shadow-lg shadow-indigo-500/10 font-black tracking-widest uppercase text-xs`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Run Scan"}
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

                {/* Analysis/Scan Content */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24"
                        >
                            <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                                Retrieving intelligence briefing via real-time blockchain telemetry...
                            </p>
                        </motion.div>
                    ) : data ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* GOV MODE VIEW */}
                            {appMode === 'gov' && (
                                <div className="space-y-8">
                                    <div className="flex flex-wrap items-center justify-between bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl gap-4">
                                        <div>
                                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Case Identification</span>
                                            <span className="text-sm font-mono text-indigo-400">Forensic-Case-{wallet.substring(0, 10).toUpperCase()}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={handleSaveCase}
                                                disabled={isSaved || isSaving}
                                                className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 ${
                                                    isSaved ? 'text-emerald-500' : 'text-purple-500 hover:text-purple-400'
                                                } disabled:opacity-50`}
                                            >
                                                {isSaved ? <Check size={12} /> : <Briefcase size={12} />} 
                                                {isSaved ? 'Case Saved' : (isSaving ? 'Saving...' : 'Save To Case Workspace')}
                                            </button>
                                            <button 
                                                onClick={handleDownloadReport}
                                                className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                                            >
                                                <Download size={12} /> Export Official Dossier
                                            </button>
                                        </div>
                                    </div>

                                    {/* Timeline & Flow Canvas */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                                        <Share2 size={20} />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-widest text-white">Advanced Evidence Timeline & Flow</span>
                                                </div>
                                                <div className="space-y-4">
                                                    {data.stats?.timePatterns?.map((tp, i) => (
                                                        <div key={i} className="flex items-center gap-3 text-xs text-slate-300 border-l-2 border-indigo-500/30 pl-4 py-1">
                                                            <Activity size={12} className="text-indigo-400" />
                                                            <span>{tp}</span>
                                                        </div>
                                                    ))}
                                                    <div className="flex items-center gap-3 text-xs text-slate-300 border-l-2 border-indigo-500/30 pl-4 py-1">
                                                        <Activity size={12} className="text-indigo-400" />
                                                        <span>Forensic monitoring active. {data.transactions?.length || 0} recent trace logs available.</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Final Security Verdict</span>
                                                <div className={`p-4 rounded-xl border font-bold text-xs ${
                                                    (data.analysis?.riskLevel || data.riskAnalysis?.riskLevel) === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-300' :
                                                    (data.analysis?.riskLevel || data.riskAnalysis?.riskLevel) === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                                                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                                }`}>
                                                    {data.analysis?.explanation || "Decision engine analysis completed."}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Government Evidence Section</span>
                                            </div>
                                            <div className="space-y-3">
                                                {data.behavioralFlags?.map((f, i) => (
                                                    <div key={i} className="text-[11px] text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                                                        {f}
                                                    </div>
                                                )) || <span className="text-slate-500 text-xs">No explicit evidence flags logged.</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* CA MODE VIEW */}
                             {appMode === 'ca' && (
                                 <div className="space-y-8">
                                     {/* India Compliance Insight Section */}
                                     {data.analysis?.indiaCompliance && (
                                         <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                             <div>
                                                 <div className="flex items-center gap-3 mb-4">
                                                     <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                                         <Shield size={18} />
                                                     </div>
                                                     <span className="text-xs font-black uppercase tracking-widest text-white">India Compliance Insight</span>
                                                 </div>
                                                 <p className="text-sm text-slate-300 font-medium leading-relaxed mb-3">
                                                     {data.analysis.indiaCompliance.complianceInsight}
                                                 </p>
                                                 <span className="text-[10px] text-slate-500 font-mono block">
                                                     {data.analysis.indiaCompliance.complianceNote}
                                                 </span>
                                             </div>
                                             <div className="bg-black/30 p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-full">
                                                 <div>
                                                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Taxable Inflow Volume (Estimate)</span>
                                                     <span className="text-2xl font-mono font-black text-indigo-400">
                                                         {data.analysis.indiaCompliance.taxableVolumeEstimate} ETH
                                                     </span>
                                                 </div>
                                                 <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-4">
                                                     * India Crypto Tax Rate: Flat 30% on transfer income
                                                 </span>
                                             </div>
                                         </div>
                                     )}

                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                         <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Inflow</span>
                                                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{totalInflow.toFixed(4)} ETH</span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Outflow</span>
                                                <span className="text-3xl font-black text-rose-400 font-mono tracking-tight">{totalOutflow.toFixed(4)} ETH</span>
                                            </div>
                                        </div>

                                        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Net Income / Profit / Loss Estimation</span>
                                            <span className={`text-4xl font-black font-mono tracking-tight ${netProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {netProfitLoss >= 0 ? '+' : ''}{netProfitLoss.toFixed(4)} ETH
                                            </span>
                                            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                                                Continuous balance changes of incoming vs outgoing assets within scan window. All tax valuations estimated at transfer time.
                                            </p>
                                        </div>

                                        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Export Tax Report</span>
                                                <button 
                                                    onClick={handleExportTaxReport}
                                                    className="w-full py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 text-emerald-400 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 select-none"
                                                >
                                                    <Download size={14} />
                                                    <span>Export Tax Report</span>
                                                </button>
                                            </div>
                                            <p className="text-[9px] font-mono text-slate-500 mt-2">Dossier conforms to PMLA and global compliance frameworks.</p>
                                        </div>
                                    </div>

                                    {/* Transaction classification list for CA */}
                                    <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6">
                                        <span className="text-xs font-black text-white uppercase tracking-widest block mb-4">Transaction Classification & Auditing</span>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-black/40">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ledger Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {data.transactions?.slice(0, 10).map((tx, idx) => {
                                                        const isOutbound = tx.from.toLowerCase() === wallet.toLowerCase();
                                                        return (
                                                            <tr key={idx} className="hover:bg-white/5 transition-all">
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2 py-0.5 border rounded text-[9px] font-black uppercase tracking-widest ${
                                                                        tx.type === 'CONTRACT_INTERACTION' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                                        isOutbound ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                                                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                                    }`}>
                                                                        {tx.type === 'CONTRACT_INTERACTION' ? 'CONTRACT' : (isOutbound ? 'OUTBOUND' : 'INBOUND')}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                                                    {isOutbound ? `Sent to ${tx.to?.substring(0, 16)}...` : `Received from ${tx.from?.substring(0, 16)}...`}
                                                                </td>
                                                                <td className="px-6 py-4 font-mono font-bold text-xs text-white">
                                                                    {tx.value} ETH
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ENTERPRISE MODE VIEW */}
                            {appMode === 'enterprise' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Corporate Risk Profile</span>
                                                <span className="text-5xl font-black text-white tracking-tight">
                                                    {((data.riskAnalysis?.anomalyScore || 0) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border text-center ${
                                                    (data.analysis?.riskLevel || data.riskAnalysis?.riskLevel) === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    (data.analysis?.riskLevel || data.riskAnalysis?.riskLevel) === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                    {(data.analysis?.riskLevel || data.riskAnalysis?.riskLevel)?.toUpperCase()} THREAT SEVERITY
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                                    <Activity size={16} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Counterparty Enterprise Risk</span>
                                            </div>
                                            <div className="space-y-3">
                                                <span className="text-[11px] block font-mono text-slate-500">Node Connections Traced: {data.stats?.uniqueCounterparties || 0}</span>
                                                <span className="text-[11px] block font-mono text-slate-500">Anomalous Patterns: {data.stats?.timePatterns?.length || 0} detected</span>
                                                <p className="text-[11px] text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                                    Comprehensive multi-layered entity profiling calculates direct and deep counterparty dependencies.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Decision Alerts & Actions</span>
                                            </div>
                                            <div className="space-y-2">
                                                {data.analysis?.recommendedActions?.map((act, i) => (
                                                    <span 
                                                        key={i} 
                                                        className="block px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wide border bg-rose-500/5 text-rose-400 border-rose-500/20"
                                                    >
                                                        • {act}
                                                    </span>
                                                ))}
                                                {(!data.analysis?.recommendedActions || data.analysis.recommendedActions.length === 0) && (
                                                    <span className="text-[10px] text-slate-500 italic">Periodic enterprise scans recommended.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#0f0f0f] border border-dashed border-white/10 rounded-3xl py-32 text-center"
                        >
                            <Shield size={64} className="mx-auto text-white/5 mb-6" />
                            <h3 className="text-xl font-bold text-slate-500 mb-2">Awaiting Target Scan</h3>
                            <p className="text-slate-600 text-sm">Please initialize a scan by entering a wallet address above.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WalletAnalyzer;
