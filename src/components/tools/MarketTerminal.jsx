import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, BarChart2, Activity, Globe, Layers, Search, ArrowUpDown, Bell, Info, Eye } from 'lucide-react';
import { useWebSocket } from '../../context/WebSocketContext';
import { alchemyManager } from '../../utils/AlchemyManager';
import useModeStore from '../../store/modeStore';
import { Utils } from "alchemy-sdk";

const MarketSkeleton = () => (
    <div className="animate-in fade-in duration-500">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="px-6 py-10 border-b border-slate-900/30">
                <div className="h-6 w-1/4 skeleton-pulse mb-4"></div>
                <div className="h-4 w-1/2 skeleton-pulse"></div>
            </div>
        ))}
    </div>
);

const MarketTerminal = ({ onInvestigate }) => {
    const { status, lastMessage, subscribe, unsubscribe } = useWebSocket();
    const { mode } = useModeStore();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'mkt', direction: 'desc' });
    const [assets, setAssets] = useState([]);
    const [liveHashes, setLiveHashes] = useState([]);
    const [flashKpis, setFlashKpis] = useState({
        'Market Cap': { val: 3.14, trend: 'up', flash: false },
        'BTC Dominance': { val: 56.4, trend: 'neutral', flash: false },
        'Stable Float': { val: 162, trend: 'up', flash: false },
        'Volume (24h)': { val: 84.2, trend: 'up', flash: false },
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // KPI Price-Flash Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const keys = Object.keys(flashKpis);
            const key = keys[Math.floor(Math.random() * keys.length)];
            const change = (Math.random() * 0.1 - 0.05);

            setFlashKpis(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    val: prev[key].val + change,
                    trend: change >= 0 ? 'up' : 'down',
                    flash: true
                }
            }));

            setTimeout(() => {
                setFlashKpis(prev => ({
                    ...prev,
                    [key]: { ...prev[key], flash: false }
                }));
            }, 1000);
        }, 5000);
        return () => clearInterval(interval);
    }, [flashKpis]);

    // Alchemy Live Stream Listener
    useEffect(() => {
        const cleanup = alchemyManager.onPendingTransaction(async (tx) => {
            if (mode === 'Analyst') {
                setLiveHashes(prev => [{ hash: tx.hash, timestamp: Date.now() }, ...prev].slice(0, 15));
            } else if (mode === 'Investor') {
                const details = await alchemyManager.getTransactionDetails(tx.hash);
                if (details && details.value) {
                    const valueEth = parseFloat(Utils.formatEther(details.value));
                    if (valueEth > 10) {
                        setLiveHashes(prev => [{ hash: tx.hash, value: valueEth, timestamp: Date.now() }, ...prev].slice(0, 15));
                    }
                }
            }
        });
        return () => cleanup();
    }, [mode]);

    // Subscribe to price updates
    useEffect(() => {
        subscribe('market_prices', { type: 'SUBSCRIBE', channel: 'ticker', symbols: ['BTC', 'ETH', 'SOL', 'SUI', 'ARB'] });
        return () => unsubscribe('market_prices');
    }, [subscribe, unsubscribe]);

    // Handle incoming messages
    useEffect(() => {
        if (lastMessage && lastMessage.type === 'ticker') {
            setAssets(prev => prev.map(asset =>
                asset.symbol === lastMessage.symbol
                    ? { ...asset, price: lastMessage.price, chg: lastMessage.chg }
                    : asset
            ));
        }
    }, [lastMessage]);

    const initialAssets = useMemo(() => [
        { name: 'Bitcoin', symbol: 'BTC', price: 94231, chg: 2.4, vol: '32B', mkt: 1800000000000, momentum: 72 },
        { name: 'Ethereum', symbol: 'ETH', price: 2745, chg: -1.1, vol: '18B', mkt: 321000000000, momentum: 48 },
        { name: 'Solana', symbol: 'SOL', price: 184.20, chg: 5.6, vol: '4.2B', mkt: 82000000000, momentum: 85 },
        { name: 'Sui', symbol: 'SUI', price: 3.42, chg: 12.1, vol: '840M', mkt: 9000000000, momentum: 94 },
        { name: 'Arbitrum', symbol: 'ARB', price: 0.94, chg: 0.5, vol: '240M', mkt: 4000000000, momentum: 55 },
    ], []);

    useEffect(() => {
        setAssets(initialAssets);
    }, [initialAssets]);

    const formatCurrency = (val) => {
        if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
        if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
        return `$${val.toLocaleString()}`;
    };

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedAssets = useMemo(() => {
        return assets
            .filter(asset =>
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (sortConfig.direction === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
    }, [assets, searchQuery, sortConfig]);

    if (loading) return <MarketSkeleton />;

    const kpiElements = [
        { label: 'Market Cap', val: `$${flashKpis['Market Cap'].val.toFixed(2)}T`, icon: <Globe size={16} /> },
        { label: 'BTC Dominance', val: `${flashKpis['BTC Dominance'].val.toFixed(1)}%`, icon: <Activity size={16} /> },
        { label: 'Stable Float', val: `$${flashKpis['Stable Float'].val.toFixed(0)}B`, icon: <Layers size={16} /> },
        { label: 'Volume (24h)', val: `$${flashKpis['Volume (24h)'].val.toFixed(1)}B`, icon: <BarChart2 size={16} /> },
    ];

    return (
        <div className="animate-in fade-in duration-700 w-full space-y-0 bg-[#020617]">
            {/* Alchemy Live Stream HUD */}
            <div className="bg-slate-900/40 border-b border-white/[0.05] p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Alchemy Real-Time Memory Pool ({mode} Mode)</h3>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 max-h-24 overflow-y-auto custom-scrollbar">
                    {liveHashes.map((ltx, i) => (
                        <div key={i} className="px-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                            <span className="text-[10px] font-mono text-indigo-400">{ltx.hash.slice(0, 10)}...</span>
                            {ltx.value && <span className="text-[9px] font-black text-emerald-500">{ltx.value.toFixed(2)} ETH</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Market Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-white/[0.05] w-full">
                {kpiElements.map((kpi, i) => (
                    <div key={i} className="py-8 px-6 border-r border-b sm:border-b-0 last:border-r-0 border-white/[0.05] group hover:bg-white/[0.02] transition-colors overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">{kpi.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</span>
                        </div>
                        <div className={`text-3xl font-black text-white mb-2 transition-all duration-500 tabular-nums ${flashKpis[kpi.label].flash ? (flashKpis[kpi.label].trend === 'up' ? 'text-emerald-400 scale-105' : 'text-rose-400 scale-105') : ''}`}>
                            {kpi.val}
                        </div>
                    </div>
                ))}
            </div>

            {/* Asset Intelligence Matrix Section */}
            <section className="py-12 border-b border-white/[0.05] w-full">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-1">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Asset Intelligence Matrix</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Real-time flux & institutional positioning across 25 core identifiers</p>
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="FILTER ASSETS (NAME/SYMBOL)..."
                            className="w-full bg-white/[0.03] border border-white/[0.05] py-2.5 pl-10 pr-4 rounded-lg text-[10px] font-black tracking-widest text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full border border-white/[0.05] rounded-xl">
                    <table className="terminal-table-edge w-full">
                        <thead>
                            <tr>
                                <th className="hover:text-white cursor-pointer group px-6" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Asset Identifier <ArrowUpDown size={10} className="text-slate-700 group-hover:text-indigo-400" />
                                    </div>
                                </th>
                                <th className="hover:text-white cursor-pointer group" onClick={() => handleSort('price')}>
                                    <div className="flex items-center gap-2">
                                        Trading Price <ArrowUpDown size={10} className="text-slate-700 group-hover:text-indigo-400" />
                                    </div>
                                </th>
                                <th className="hover:text-white cursor-pointer group" onClick={() => handleSort('chg')}>
                                    <div className="flex items-center gap-2">
                                        Session Flux <ArrowUpDown size={10} className="text-slate-700 group-hover:text-indigo-400" />
                                    </div>
                                </th>
                                <th className="hover:text-white cursor-pointer group" onClick={() => handleSort('vol')}>
                                    <div className="flex items-center gap-2">
                                        Net Volume <ArrowUpDown size={10} className="text-slate-700 group-hover:text-indigo-400" />
                                    </div>
                                </th>
                                <th className="hover:text-white cursor-pointer group" onClick={() => handleSort('mkt')}>
                                    <div className="flex items-center gap-2">
                                        Market Cap <ArrowUpDown size={10} className="text-slate-700 group-hover:text-indigo-400" />
                                    </div>
                                </th>
                                <th className="text-right px-6 hover:text-white cursor-pointer group" onClick={() => handleSort('momentum')}>
                                    <div className="flex items-center justify-end gap-2">
                                        Momentum Vector <ArrowUpDown size={10} className="text-slate-700 group-hover:text-indigo-400" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedAssets.map((asset, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0">
                                    <td className="px-6">
                                        <div className="flex items-center gap-3 group/link">
                                            <div className="w-8 h-8 rounded bg-slate-900 border border-white/[0.05] flex items-center justify-center font-black text-indigo-400 text-[10px]">
                                                {asset.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-black text-white uppercase tracking-tighter">{asset.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset.symbol}</div>
                                            </div>
                                            <button
                                                onClick={() => onInvestigate('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')}
                                                className="opacity-0 group-hover/link:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                                                title="Bridge to Visualizer"
                                            >
                                                <Eye size={12} className="text-slate-400 hover:text-indigo-400" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="metric-mono text-white font-bold">
                                        {asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.price < 1 ? 4 : 2 })}
                                    </td>
                                    <td className={`font-black ${asset.chg >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {asset.chg >= 0 ? '+' : ''}{asset.chg}%
                                    </td>
                                    <td className="text-slate-500 metric-mono text-xs">{asset.vol}</td>
                                    <td className="text-slate-500 metric-mono text-xs">{formatCurrency(asset.mkt)}</td>
                                    <td className="w-64 px-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="h-1 w-24 bg-slate-950 rounded-full overflow-hidden border border-white/[0.05]">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${asset.momentum > 70 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                                                        asset.momentum < 40 ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                            'bg-slate-600'
                                                        }`}
                                                    style={{ width: `${asset.momentum}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500 min-w-[24px] text-right">{asset.momentum}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Prediction Oracle Section - Full Width Integrated */}
            <section className="pt-20 border-b border-white/[0.05] w-full bg-slate-950/30">
                <div className="px-10 mb-10">
                    <div className="flex items-center gap-3 text-amber-500 mb-4">
                        <TrendingUp size={22} strokeWidth={2.5} />
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Prediction Intelligence Oracle</h2>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium max-w-2xl leading-relaxed uppercase tracking-tight">
                        Aggregating multi-source sentiment signatures and decentralized betting markets to synthesize high-probability outcome vectors.
                        This cluster monitors probability flux across major market events in real-time.
                    </p>
                </div>

                {/* Probability Card HUD */}
                <div className="px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { title: 'BTC > $100k (MAR)', prob: 68, trend: 'up', confidence: 'High' },
                        { title: 'ETH L2 Dominance', prob: 42, trend: 'down', confidence: 'Med' },
                        { title: 'SOL Break ATH (Q1)', prob: 54, trend: 'up', confidence: 'Med' },
                        { title: 'Stablecoin Flow +15%', prob: 82, trend: 'up', confidence: 'High' },
                    ].map((pred, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.05] p-6 group hover:border-amber-500/30 transition-all rounded-sm backdrop-blur-md">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{pred.confidence} CONFIDENCE</span>
                                <div className={`text-[10px] font-bold ${pred.trend === 'up' ? 'text-emerald-500 font-black' : 'text-rose-500 font-black'}`}>
                                    {pred.trend === 'up' ? '↑' : '↓'} TREND
                                </div>
                            </div>
                            <h3 className="text-[12px] font-black text-white uppercase tracking-tighter mb-8 leading-tight">{pred.title}</h3>
                            <div className="flex items-end justify-between">
                                <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{pred.prob}%</span>
                                <span className="text-[9px] text-slate-600 font-black uppercase mb-1 tracking-[0.2em]">Probability</span>
                            </div>
                            <div className="mt-6 h-1 w-full bg-slate-900 overflow-hidden">
                                <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${pred.prob}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Integrated Polymarket Stream */}
                <div className="w-full border-t border-white/[0.05] bg-black">
                    <div className="px-10 py-4 border-b border-white/[0.02] flex items-center justify-between bg-zinc-950/40">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stream Interface: Polymarket Oracle</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">Latency: 12ms // Cluster: Beta-S4</span>
                    </div>
                    <div className="w-full h-[900px] bg-black">
                        <iframe
                            src="https://ticker.polymarket.com/?c=crypto&theme=dark"
                            title="Polymarket Ticker"
                            width="100%"
                            height="100%"
                            style={{ border: 'none', background: 'transparent' }}
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Redesigned Active Pair Feed (Chart + Alerts Split) */}
            <section className="py-20 px-10 w-full">
                <div className="grid grid-cols-12 gap-8">
                    {/* Main Chart Column (8 Units) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="glass border border-white/[0.08] rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl shadow-2xl">
                            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Live Data Stream</span>
                                    </div>
                                    <div className="h-4 w-px bg-white/[0.1]"></div>
                                    <h2 className="text-xs font-black text-white uppercase tracking-widest">Active Pair Feed: WETH/USDC (Uniswap v3)</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors">Settings</button>
                                    <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 tracking-tighter">
                                        0x88e6...5640
                                    </div>
                                </div>
                            </div>
                            <div className="h-[650px] w-full bg-black/50">
                                <iframe
                                    src="https://www.dextools.io/widgets/en/ether/pe-light/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640?theme=dark&chartType=1&chartResolution=30&drawingToolbar=false"
                                    title="DEXTools Chart" width="100%" height="100%" style={{ border: 'none' }}
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column (4 Units) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass border border-white/[0.08] rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl h-full flex flex-col shadow-2xl">
                            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center gap-3">
                                <Bell size={16} className="text-indigo-400" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Recent Liquidity Alerts</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                {[
                                    { type: 'Liquidity Add', amt: '$420,000', pair: 'WETH/USDT', time: '2m ago', icon: <Globe size={16} />, status: 'positive' },
                                    { type: 'Large Swap', amt: '84.2 ETH', pair: 'WETH/USDC', time: '5m ago', icon: <Activity size={16} />, status: 'neutral' },
                                    { type: 'Liquidity Rem', amt: '$1.2M', pair: 'WBTC/ETH', time: '12m ago', icon: <Info size={16} />, status: 'negative' },
                                    { type: 'Price Break', amt: '+5.2%', pair: 'SOL/USDC', time: '15m ago', icon: <TrendingUp size={16} />, status: 'positive' },
                                    { type: 'Whale Buy', amt: '12,500 ARB', pair: 'ARB/USDC', time: '22m ago', icon: <Layers size={16} />, status: 'positive' },
                                    { type: 'Big Move', amt: '-4.8%', pair: 'SUI/USDC', time: '30m ago', icon: <Activity size={16} />, status: 'negative' },
                                ].map((alert, i) => (
                                    <div key={i} className="p-5 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer group rounded-2xl mx-2 my-1 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{alert.time}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onInvestigate('0x1234567890123456789012345678901234567890'); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Eye size={12} className="text-indigo-400" />
                                                </button>
                                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${alert.status === 'positive' ? 'text-emerald-500 bg-emerald-500/10' :
                                                    alert.status === 'negative' ? 'text-rose-500 bg-rose-500/10' :
                                                        'text-indigo-400 bg-indigo-400/10'
                                                    }`}>
                                                    {alert.type}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">{alert.amt}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">{alert.pair}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-white/[0.05] bg-white/[0.01]">
                                <button className="w-full py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                                    Expand Monitor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarketTerminal;
