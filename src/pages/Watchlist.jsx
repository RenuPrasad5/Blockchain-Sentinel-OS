import React, { useState, useEffect } from 'react';
import { 
    Eye, Plus, X, Search, Activity, AlertTriangle, 
    ShieldAlert, Clock, RefreshCw, Trash2, ChevronRight
} from 'lucide-react';
import useModeStore from '../store/modeStore';
import { identifyEntity } from '../services/EntityEngine';
import { calculateRiskScore } from '../services/RiskEngine';

const Watchlist = () => {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useModeStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWallet, setNewWallet] = useState({ address: '', label: '', chain: 'Ethereum' });
    const [mockAlerts, setMockAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Generate some live mock activity alerts
    useEffect(() => {
        const interval = setInterval(() => {
            if (watchlist.length === 0) return;
            
            // 30% chance to generate an alert
            if (Math.random() > 0.7) {
                const randomWallet = watchlist[Math.floor(Math.random() * watchlist.length)];
                const types = [
                    'Large Outbound Transfer', 
                    'Exchange Interaction', 
                    'Smart Contract Interaction', 
                    'Suspicious Velocity Spike'
                ];
                const randomType = types[Math.floor(Math.random() * types.length)];
                
                const newAlert = {
                    id: Date.now(),
                    wallet: randomWallet.address,
                    label: randomWallet.label || 'Unlabeled',
                    type: randomType,
                    time: new Date().toLocaleTimeString(),
                    severity: Math.random() > 0.6 ? 'CRITICAL' : 'MEDIUM'
                };
                
                setMockAlerts(prev => [newAlert, ...prev].slice(0, 10));
            }
        }, 5000);
        
        return () => clearInterval(interval);
    }, [watchlist]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newWallet.address) return;
        
        setIsLoading(true);
        
        // Auto-classify using engine
        const entity = identifyEntity(newWallet.address);
        const risk = await calculateRiskScore(newWallet.address);
        
        addToWatchlist({
            address: newWallet.address,
            label: newWallet.label || entity.name,
            chain: newWallet.chain,
            riskScore: risk?.score || 1,
            riskLevel: risk?.level || 'Unknown',
            entityType: entity.type,
            status: 'Active',
            color: entity.color
        });
        
        setNewWallet({ address: '', label: '', chain: 'Ethereum' });
        setShowAddModal(false);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Eye className="text-indigo-500" size={28} />
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase font-heading">Watchlist Monitoring</h1>
                    </div>
                    <p className="text-slate-500 text-sm">Real-time active surveillance of selected blockchain entities.</p>
                </div>
                
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-indigo-900/30 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Target Acquisition</span>
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Grid */}
                <div className="flex-1 space-y-6">
                    
                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1">Active Nodes</div>
                            <div className="text-3xl font-black text-white">{watchlist.length}</div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1">System Health</div>
                            <div className="text-3xl font-black text-emerald-500 flex items-center gap-2">
                                100% <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1">Signals Analyzed</div>
                            <div className="text-3xl font-black text-indigo-400">{(watchlist.length * 47 + 1243).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {watchlist.length === 0 ? (
                            <div className="col-span-full py-20 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                                <Radar size={48} className="mb-4 opacity-50" />
                                <p className="font-bold uppercase tracking-widest">No active targets in grid</p>
                                <p className="text-sm mt-1">Initiate target acquisition above</p>
                            </div>
                        ) : (
                            watchlist.map((w) => (
                                <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-600 transition-colors duration-300 relative">
                                    <div 
                                        className="h-1 w-full absolute top-0" 
                                        style={{ backgroundColor: w.riskLevel === 'High Risk' ? '#ef4444' : (w.riskLevel === 'Medium Risk' ? '#f59e0b' : '#10b981') }} 
                                    />
                                    
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="inline-flex text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 mb-2 border border-slate-700">
                                                    {w.chain}
                                                </span>
                                                <h3 className="font-bold text-white truncate max-w-[180px]" title={w.label}>{w.label}</h3>
                                            </div>
                                            <button 
                                                onClick={() => removeFromWatchlist(w.id)}
                                                className="text-slate-500 hover:text-rose-500 p-1 hover:bg-rose-500/10 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="font-mono text-xs text-slate-400 mb-4 break-all bg-slate-950 p-2 rounded border border-slate-800/50">
                                            {w.address}
                                        </div>

                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <span className="text-slate-500">Risk Level</span>
                                            <span className="font-bold" style={{ color: w.riskLevel === 'High Risk' ? '#ef4444' : (w.riskLevel === 'Medium Risk' ? '#f59e0b' : '#10b981') }}>
                                                {w.riskLevel} ({w.riskScore}/10)
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Entity Type</span>
                                            <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">{w.entityType}</span>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                                            <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Monitoring
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                                <Clock size={10} /> Just now
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Alert Feed */}
                <div className="w-full lg:w-80 xl:w-96 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl h-[600px] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur">
                            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
                                <ShieldAlert size={16} className="animate-pulse" />
                                Live Alert Grid
                            </div>
                            <div className="bg-rose-950/30 text-rose-400 border border-rose-900/50 text-xs px-2 py-0.5 rounded font-mono">
                                {mockAlerts.length} RECENT
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                            {mockAlerts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-700">
                                    <Activity size={32} className="opacity-20 mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Listening for signals...</span>
                                </div>
                            ) : (
                                mockAlerts.map(alert => (
                                    <div key={alert.id} className={`p-3 rounded-lg border ${alert.severity === 'CRITICAL' ? 'bg-rose-950/20 border-rose-900/40' : 'bg-slate-800/40 border-slate-700/50'} animate-in slide-in-from-right-4 fade-in duration-300`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-black uppercase px-1.5 rounded ${alert.severity === 'CRITICAL' ? 'bg-rose-900 text-rose-200' : 'bg-amber-950 text-amber-200'}`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                                        </div>
                                        <div className="font-bold text-white text-xs leading-tight mb-1">{alert.type}</div>
                                        <div className="text-slate-400 text-[11px] truncate">{alert.label}</div>
                                        <div className="text-[10px] font-mono text-slate-600 truncate mt-1">{alert.wallet}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-950 border border-indigo-900/50 rounded-lg flex items-center justify-center">
                                <Eye className="text-indigo-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Acquire Target</h3>
                                <p className="text-xs text-slate-500">Add node to continuous tracking stream.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address / Node ID</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="0x..." 
                                        value={newWallet.address}
                                        onChange={e => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Codename (Optional)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Hacker Wallet" 
                                        value={newWallet.label}
                                        onChange={e => setNewWallet(prev => ({ ...prev, label: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Network</label>
                                    <select 
                                        value={newWallet.chain}
                                        onChange={e => setNewWallet(prev => ({ ...prev, chain: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-4 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                                    >
                                        <option>Ethereum</option>
                                        <option>Polygon</option>
                                        <option>Arbitrum</option>
                                        <option>BSC</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw size={18} className="animate-spin" />
                                            Analyzing Protocol...
                                        </>
                                    ) : (
                                        <>Begin Active Surveillance</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Temp placeholder for component from icon pack
const Radar = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className={className}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
        <path d="M12 2v20"></path>
        <path d="M2 12h20"></path>
    </svg>
);

export default Watchlist;
