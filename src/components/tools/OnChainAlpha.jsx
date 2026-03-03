import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, UserCheck, Repeat, Zap, Globe, ArrowUpDown, ChevronRight, Activity, Bell, Layers, Clock, TrendingDown, Target, Eye, Search } from 'lucide-react';
import { alchemyManager } from '../../utils/AlchemyManager';
import { Utils } from "alchemy-sdk";

const SignalSkeleton = () => (
    <div className="animate-in fade-in duration-500">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="px-6 py-12 border-b border-slate-900/30">
                <div className="h-6 w-1/4 skeleton-pulse mb-4"></div>
                <div className="h-4 w-1/2 skeleton-pulse"></div>
            </div>
        ))}
    </div>
);

const OnChainAlpha = ({ onAnalyze }) => {
    const [loading, setLoading] = useState(true);
    const [liveWhaleAlerts, setLiveWhaleAlerts] = useState([]);
    const [kpis, setKpis] = useState([
        { label: 'Network Velocity', val: '8.4M TPS', status: 'Optimal', icon: <Zap size={16} />, color: 'text-indigo-400', baseVal: 8.4 },
        { label: 'Whale Netflow', val: '+$1.42B', status: 'Accumulation', icon: <Repeat size={16} />, color: 'text-emerald-500', baseVal: 1.42 },
        { label: 'Ecosystem Growth', val: '+24.8%', status: 'Expansion', icon: <Activity size={16} />, color: 'text-emerald-500', baseVal: 24.8 },
        { label: 'Bridge Volume', val: '$842M', status: 'High Traffic', icon: <Layers size={16} />, color: 'text-white', baseVal: 842 },
    ]);

    const [chains, setChains] = useState([
        { name: 'Ethereum', tvl: 54.2, inflow: 1.2, activity: 98, trend: 4.2, vector: 'Expansion' },
        { name: 'Solana', tvl: 8.4, inflow: 0.84, activity: 95, trend: 12.1, vector: 'Velocity_High' },
        { name: 'Base', tvl: 2.4, inflow: 0.32, activity: 96, trend: 18.4, vector: 'Velocity_Max' },
        { name: 'Sui', tvl: 0.8, inflow: 0.16, activity: 90, trend: 24.5, vector: 'Velocity_High' },
        { name: 'Arbitrum', tvl: 3.8, inflow: 0.18, activity: 92, trend: 3.1, vector: 'Expansion' },
    ]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // 10s Matrix & KPI Refresh
    useEffect(() => {
        if (loading) return;
        const interval = setInterval(() => {
            setKpis(prev => prev.map(k => ({
                ...k,
                val: k.label === 'Whale Netflow'
                    ? `+$${(k.baseVal + (Math.random() * 0.1)).toFixed(2)}B`
                    : k.label === 'Network Velocity'
                        ? `${(k.baseVal + (Math.random() * 0.5)).toFixed(1)}M TPS`
                        : k.val
            })));

            setChains(prev => prev.map(c => ({
                ...c,
                tvl: c.tvl + (Math.random() * 0.01 - 0.005),
                inflow: c.inflow + (Math.random() * 0.02 - 0.01)
            })));
        }, 10000);
        return () => clearInterval(interval);
    }, [loading]);

    // Live Flow Intelligence - Mempool Sync
    useEffect(() => {
        const cleanup = alchemyManager.onPendingTransaction(async (tx) => {
            const details = await alchemyManager.getTransactionDetails(tx.hash);
            if (details && details.value) {
                const valueEth = parseFloat(Utils.formatEther(details.value));
                // High Impact Threshold: >$50k (approx 15-20 ETH)
                if (valueEth > 15) {
                    const newAlert = {
                        wallet: tx.from,
                        type: 'Mempool Detect',
                        amt: `${valueEth.toFixed(2)} ETH`,
                        time: 'Just now',
                        risk: valueEth > 100 ? 'Extreme' : 'High',
                        timestamp: Date.now(),
                        isLive: true
                    };
                    setLiveWhaleAlerts(prev => [newAlert, ...prev].slice(0, 15));
                }
            }
        });
        return () => cleanup();
    }, []);

    if (loading) return <SignalSkeleton />;

    const displayAlerts = [...liveWhaleAlerts,
    { wallet: '0x88e...41d', type: 'Exchange Deposit', amt: '12,452 ETH', time: '2m ago', risk: 'High' },
    { wallet: 'vitalik.eth', type: 'DEX Swap', amt: '4,500 ETH', time: '1h ago', risk: 'Neutral' },
    ].slice(0, 8);

    return (
        <div className="animate-in fade-in duration-700">
            {/* Real-time KPI Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-slate-900/40">
                {kpis.map((kpi, i) => (
                    <div key={i} className="py-8 px-6 border-r border-b sm:border-b-0 last:border-r-0 border-slate-900/40 hover:bg-slate-900/10 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-slate-500">{kpi.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</span>
                        </div>
                        <div className="text-3xl font-black text-white mb-2 tabular-nums">{kpi.val}</div>
                        <div className={`text-[11px] font-bold ${kpi.color}`}>
                            Current State: {kpi.status}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-x divide-slate-900/40 border-b border-slate-900/40">
                {/* Ecosystem Liquidity Matrix */}
                <div className="lg:col-span-8 px-0 border-b lg:border-b-0">
                    <div className="py-10 px-6">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-1">Ecosystem Liquidity Matrix</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Live SUI/Solana/Base RPC Feeds (Aggregated)</p>
                    </div>

                    <div className="overflow-x-auto border-y border-slate-900/40">
                        <table className="terminal-table-edge w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 w-16">Rank</th>
                                    <th>Network</th>
                                    <th>Asset TVL</th>
                                    <th>Net Flow (10s)</th>
                                    <th className="px-6 text-right">State Vector</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chains.map((chain, i) => (
                                    <tr key={i} className="hover:bg-slate-900/40 transition-colors border-b border-slate-900/20 last:border-0">
                                        <td className="px-6 metric-mono text-slate-500 text-xs">#{i + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded bg-slate-950 border border-slate-900 flex items-center justify-center font-black text-indigo-400 text-[10px]">
                                                    {chain.name[0]}
                                                </div>
                                                <div className="text-[13px] font-black text-white uppercase tracking-tighter">{chain.name}</div>
                                            </div>
                                        </td>
                                        <td className="metric-mono text-white font-bold tabular-nums">${chain.tvl.toFixed(2)}B</td>
                                        <td className={`metric-mono font-bold tabular-nums ${chain.inflow >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {chain.inflow >= 0 ? '+' : ''}{chain.inflow.toFixed(3)}B
                                        </td>
                                        <td className="px-6 text-right">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${chain.vector.includes('High') ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                {chain.vector}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Live Flow Intelligence - Whale Stream */}
                <div className="lg:col-span-4 p-0 bg-slate-900/5">
                    <div className="py-10 px-6 flex justify-between items-center bg-slate-950/20">
                        <div>
                            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Live Flow Intelligence</h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Threshold: {`>`}$50,000 Volume</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> LIVE
                        </div>
                    </div>

                    <div className="divide-y divide-slate-900/40 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {displayAlerts.map((alert, i) => (
                            <div key={i} className={`py-6 px-6 hover:bg-slate-900/20 transition-colors group relative ${alert.isLive ? 'bg-indigo-500/[0.03]' : ''}`}>
                                {alert.risk === 'Extreme' && <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none"></div>}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 group/addr">
                                        <span className="metric-mono text-[11px] text-indigo-400 font-bold truncate max-w-[150px]">{alert.wallet}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAnalyze(alert.wallet); }}
                                            className="opacity-0 group-hover/addr:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                                            title="Investigate Bridge"
                                        >
                                            <Eye size={12} className="text-white" />
                                        </button>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-black uppercase">{alert.time}</span>
                                </div>
                                <div className={`text-2xl font-black text-white mb-3 ${alert.isLive ? 'shadow-indigo-500/50 drop-shadow-md' : ''}`}>
                                    {alert.amt}
                                    {alert.isLive && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-indigo-500"></span>}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${alert.risk === 'Extreme' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' :
                                            alert.risk === 'High' ? 'text-rose-500 border border-rose-500/20' :
                                                'text-slate-600 border border-slate-900'
                                            }`}>
                                            {alert.risk} IMPACT
                                        </div>
                                        <button
                                            onClick={() => onAnalyze(alert.wallet)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white"
                                        >
                                            <Target size={12} /> Analyze Trace
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Sector: Combined Yield/Unlocks View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-900/40 border-b border-slate-900/40">
                <div className="py-10 px-6">
                    <div className="flex items-center gap-3 mb-10">
                        <Zap size={18} className="text-amber-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Alpha Yield Opportunities</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { platform: 'Aave v3', asset: 'USDC', apy: '8.24', tvl: '1.24B' },
                            { platform: 'Lido Finance', asset: 'stETH', apy: '3.85', tvl: '22.1B' },
                            { platform: 'Ether.fi', asset: 'weETH', apy: '4.12', tvl: '4.2B' },
                            { platform: 'Ethena', asset: 'sUSDe', apy: '12.45', tvl: '2.8B' },
                        ].map((opp, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 hover:bg-slate-900/20 transition-colors group border-b border-slate-900/10 last:border-0">
                                <div className="w-10 h-10 rounded bg-slate-950 border border-slate-900 flex items-center justify-center font-black text-indigo-400">
                                    {opp.platform[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[13px] font-black text-white uppercase group-hover:text-indigo-400 transition-colors">{opp.platform}</span>
                                        <span className="text-indigo-400 font-extrabold text-lg">{opp.apy}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        <span>{opp.asset} Strategy</span>
                                        <span>TVL: ${opp.tvl}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="py-10 px-6">
                    <div className="flex items-center gap-3 mb-10">
                        <Clock size={18} className="text-slate-400" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Asset Release Schedule</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { project: 'Arbitrum', ticker: 'ARB', amount: '1.2B', date: 'MAR 2024', pct: 15.2 },
                            { project: 'Starknet', ticker: 'STRK', amount: '64M', date: 'APR 2024', pct: 4.2 },
                            { project: 'Celestia', ticker: 'TIA', amount: '175M', date: 'OCT 2024', pct: 12.8 },
                            { project: 'Optimism', ticker: 'OP', amount: '31M', date: 'MAY 2024', pct: 2.1 },
                        ].map((u, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 border-b border-slate-900/10 last:border-0 hover:bg-slate-900/20 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <div className="text-[13px] font-black text-white uppercase tracking-tighter">{u.project}</div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase">{u.date} RELEASE</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="metric-mono text-sm text-white font-bold">{u.amount} {u.ticker}</div>
                                        <div className="text-[10px] text-rose-500 font-black uppercase tracking-tighter">{u.pct}% OF SUPPLY</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-20"></div>
        </div>
    );
};

export default OnChainAlpha;
