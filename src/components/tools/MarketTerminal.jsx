import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, BarChart2, Activity, Globe, Layers, Search, ArrowUpDown, Bell, Info, Eye, Zap as ZapIcon } from 'lucide-react';
import { alchemyManager } from '../../utils/AlchemyManager';
import useModeStore from '../../store/modeStore';
import { Utils } from "alchemy-sdk";
import { createChart, CandlestickSeries } from 'lightweight-charts';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

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
    const { mode, liveData, connectionStatus } = useModeStore();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'mkt', direction: 'desc' });
    const [assets, setAssets] = useState([]);
    const [liveHashes, setLiveHashes] = useState([]);
    const [selectedBridge, setSelectedBridge] = useState(null);
    const [selectedSmartMoney, setSelectedSmartMoney] = useState(null);
    const [bridgeAlerts, setBridgeAlerts] = useState({
        Across: false,
        Stargate: false,
        Orbit: false
    });
    const [smartMoneyAlerts, setSmartMoneyAlerts] = useState([
        { wallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', entity: 'Tether Treasury', tag: 'EXCHANGE', asset: 'USDC', action: 'ACCUMULATION', flow: '4200000', time: '1m ago', color: 'text-amber-400' },
        { wallet: '0x77Ea656916637C55548E1AcceFe1A467616C82F7', entity: 'Jump Crypto', tag: 'VC', asset: 'ETH', action: 'OFFLOADING', flow: '120500', time: '4m ago', color: 'text-indigo-400' },
        { wallet: '0xBeeF...cAfE', entity: 'GSR Markets', tag: 'WHALE', asset: 'LINK', action: 'ACCUMULATION', flow: '50000', time: '12m ago', color: 'text-emerald-400' },
        { wallet: '0x1A2B...3C4D', entity: 'Wintermute', tag: 'VC', asset: 'ARB', action: 'OFFLOADING', flow: '1200000', time: '15m ago', color: 'text-indigo-400' }
    ]);
    const [flashKpis, setFlashKpis] = useState({
        'Market Cap': { val: 3.14, trend: 'up', flash: false, velocity: '+1.2%' },
        'BTC Dominance': { val: 56.4, trend: 'neutral', flash: false, velocity: '0.0%' },
        'Stable Float': { val: 162, trend: 'up', flash: false, velocity: '+4.5%' },
        'Volume (24h)': { val: 84.2, trend: 'up', flash: false, velocity: '+12.1%' },
    });

    const BRIDGE_CONFIG = {
        Across: '0x5c27d51754702611d0a843cfc00dc1699fd0da11',
        Stargate: '0x8731d54E5D025d40d003c27da2e28fd563E179Cc',
        Orbit: '0x0000000000000000000000000000000000000000' // Placeholder
    };

    // Listen to real-time mempool for bridge migrations
    useEffect(() => {
        if (!liveData.length) return;
        const latest = liveData[0];
        if (latest.type === 'TRANSACTION') {
            const to = latest.to?.toLowerCase();
            const bridgeName = Object.keys(BRIDGE_CONFIG).find(name => BRIDGE_CONFIG[name].toLowerCase() === to);

            if (bridgeName && latest.valueUsd > 100000) {
                setBridgeAlerts(prev => ({ ...prev, [bridgeName]: true }));
                setTimeout(() => {
                    setBridgeAlerts(prev => ({ ...prev, [bridgeName]: false }));
                }, 2000);
            }
        }
    }, [liveData]);

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

    // A. Asset Intelligence Matrix (WebSocket Integration)
    useEffect(() => {
        const cgWs = new WebSocket('wss://stream.coingecko.com/v2/crypto');
        let rafId;
        const pendingUpdates = new Map();

        cgWs.onopen = () => {
            console.log('CoinGecko Sentinel: Connected');
            cgWs.send(JSON.stringify({
                action: 'subscribe',
                channel: 'ticker',
                ids: 'bitcoin,ethereum,solana,sui,arbitrum'
            }));
        };

        cgWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ticker') {
                pendingUpdates.set(data.symbol.toUpperCase(), {
                    price: data.price,
                    chg: data.chg
                });

                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        setAssets(prev => prev.map(asset => {
                            const update = pendingUpdates.get(asset.symbol);
                            if (update) {
                                return { ...asset, price: update.price, chg: update.chg };
                            }
                            return asset;
                        }));
                        pendingUpdates.clear();
                        rafId = null;
                    });
                }
            }
        };

        return () => {
            cgWs.close();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

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

    useEffect(() => {
        const interval = setInterval(() => {
            const entities = [
                { name: 'Amber Group', tag: 'Smart Whale', color: 'text-indigo-400' },
                { name: 'FalconX', tag: 'Exchange', color: 'text-amber-400' },
                { name: 'Polychain', tag: 'Smart Whale', color: 'text-indigo-400' },
                { name: 'Whale #842', tag: 'Smart Whale', color: 'text-emerald-400' },
                { name: 'Maverick Arb', tag: 'DEX Arb', color: 'text-rose-400' }
            ];
            const assets = ['WETH', 'USDC', 'LINK', 'UNI', 'ARB'];
            const e = entities[Math.floor(Math.random() * entities.length)];
            const asset = assets[Math.floor(Math.random() * assets.length)];
            const action = Math.random() > 0.4 ? 'ACCUMULATION' : 'OFFLOADING';

            const newAlert = {
                id: Math.random().toString(36).substr(2, 9),
                wallet: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
                entity: e.name,
                tag: e.tag,
                asset: asset,
                flow: (Math.random() * 500000 + 100000).toFixed(0),
                action: action,
                time: 'Just now',
                color: e.color
            };
            setSmartMoneyAlerts(prev => [newAlert, ...prev].slice(0, 50));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const columns = useMemo(() => [
        {
            accessorKey: 'time',
            header: 'Time',
            cell: info => <span className="text-[10px] font-bold text-slate-500 uppercase">{info.getValue()}</span>,
        },
        {
            accessorKey: 'entity',
            header: 'Entity / Wallet',
            cell: info => {
                const row = info.row.original;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors uppercase">{row.entity}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-slate-600 truncate max-w-[120px]">{row.wallet}</span>
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm border ${row.color?.replace('text-', 'border-').replace('400', '400/20') || 'border-indigo-500/20'} ${row.color || 'text-indigo-400'} bg-white/[0.02]`}>{row.tag}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: 'asset',
            header: 'Asset',
            cell: info => <span className="text-xs font-black text-white">{info.getValue()}</span>,
        },
        {
            accessorKey: 'flow',
            header: 'Flow (USD)',
            cell: info => <span className="font-mono text-xs font-black text-white">${Number(info.getValue()).toLocaleString()}</span>,
        },
        {
            id: 'actions',
            header: 'Action',
            cell: info => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSmartMoney(info.row.original);
                    }}
                    className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase rounded hover:bg-indigo-600 transition-colors"
                >
                    Investigate
                </button>
            ),
        },
    ], []);

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data: smartMoneyAlerts,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const parentRef = useRef();
    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 70,
        overscan: 10,
    });

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
        <div className="animate-in fade-in duration-700 w-full space-y-0 bg-[#0D1117]">
            {/* Cross-Chain Migration Intelligence */}
            <div className="bg-indigo-950/20 border-b border-white/[0.05] p-6 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Globe size={120} />
                </div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <ZapIcon size={20} />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Cross-Chain Bridge Watcher</h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Monitoring Across (0x5C27...), Stargate (0x8731...), Orbit</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[8px] font-black text-emerald-500 uppercase">Across: Active</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-[8px] font-black text-indigo-500 uppercase">Stargate: Active</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {[
                        { bridge: 'Across', amt: '$1,240,000', from: 'Ethereum', to: 'Arbitrum', type: 'Migration', wallet: '0x88e6...5640', whale: true, volChange: 3.2 },
                        { bridge: 'Stargate', amt: '$84,000', from: 'Ethereum', to: 'Base', type: 'Bridge', wallet: '0x21a3...ea9f', whale: false, volChange: 1.1 },
                        { bridge: 'Orbit', amt: '$542,000', from: 'Ethereum', to: 'Optimism', type: 'Migration', wallet: '0x56ed...b17f', whale: true, volChange: 4.5 },
                    ].map((mig, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedBridge(mig)}
                            className={`p-4 bg-white/[0.03] border rounded-xl transition-all hover:bg-white/[0.05] cursor-pointer group relative overflow-hidden ${mig.whale ? 'border-amber-500/30' : 'border-white/[0.05]'} ${bridgeAlerts[mig.bridge] ? 'glow-indigo-ring' : ''}`}
                        >
                            {bridgeAlerts[mig.bridge] && (
                                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none"></div>
                            )}
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{mig.bridge} Protocol</span>
                                <div className="flex gap-2">
                                    {mig.volChange > 3 && (
                                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[7px] font-black uppercase rounded">
                                            HIGH VOLATILITY ALERT
                                        </span>
                                    )}
                                    {mig.whale && (
                                        <span className="px-2 py-0.5 bg-amber-500 text-black text-[7px] font-black uppercase rounded animate-pulse">
                                            Cross-Chain Migration
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-xl font-black text-white mb-2">{mig.amt}</div>
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tighter mb-4 text-slate-400">
                                <span>{mig.from}</span>
                                <ArrowUpDown size={10} className="rotate-90" />
                                <span className="text-indigo-400">{mig.to}</span>
                            </div>
                            <div className="flex justify-between items-center text-[8px] font-black text-slate-600">
                                <span>{mig.wallet}</span>
                                <div className="flex items-center gap-1 text-emerald-500">
                                    <TrendingUp size={8} />
                                    <span>+{((mig.volChange - 1) * 100).toFixed(0)}% VELOCITY</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price-Flash Indicators Grid */}
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
                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            MIGRATION VELOCITY: <span className={flashKpis[kpi.label].velocity.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{flashKpis[kpi.label].velocity}</span>
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
                                    {pred.trend === 'up' ? 'â†‘' : 'â†“'} TREND
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
                    {/* Primary Forensic Table Column (8 Units) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="glass border border-white/[0.08] rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl shadow-2xl flex flex-col h-[750px]">
                            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between bg-zinc-950/50">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Alpha Forensic Feed</span>
                                    </div>
                                    <div className="h-4 w-px bg-white/[0.1]"></div>
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Institutional Flow Analysis</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase px-2 py-1 bg-white/5 rounded">Managed Sync: 30s</span>
                                    <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400">
                                        NODES_ACTIVE: 1,842
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-4 border-b border-white/[0.03] bg-zinc-950/30 flex items-center gap-4">
                                <Search size={14} className="text-slate-500" />
                                <input
                                    type="text"
                                    value={globalFilter ?? ''}
                                    onChange={e => setGlobalFilter(e.target.value)}
                                    placeholder="Search Entity, Wallet, or Asset..."
                                    className="bg-transparent border-none outline-none text-[10px] text-white placeholder-slate-600 w-full uppercase tracking-widest font-bold"
                                />
                            </div>

                            <div ref={parentRef} className="flex-1 overflow-auto custom-scrollbar relative">
                                {rows.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-[#0D1117] z-10 shadow-xl">
                                            {table.getHeaderGroups().map(headerGroup => (
                                                <tr key={headerGroup.id} className="border-b border-white/[0.05]">
                                                    {headerGroup.headers.map(header => (
                                                        <th
                                                            key={header.id}
                                                            className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                                {header.column.getIsSorted() && (
                                                                    <ArrowUpDown size={10} className="text-indigo-400" />
                                                                )}
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody
                                            style={{
                                                height: `${virtualizer.getTotalSize()}px`,
                                                position: 'relative',
                                            }}
                                        >
                                            {virtualizer.getVirtualItems().map(virtualRow => {
                                                const row = rows[virtualRow.index];
                                                return (
                                                    <tr
                                                        key={row.id}
                                                        onClick={() => setSelectedSmartMoney(row.original)}
                                                        className="group cursor-pointer hover:bg-indigo-500/5 transition-all pulse-highlight absolute w-full border-b border-white/[0.02]"
                                                        style={{
                                                            height: `${virtualRow.size}px`,
                                                            transform: `translateY(${virtualRow.start}px)`,
                                                        }}
                                                    >
                                                        {row.getVisibleCells().map(cell => (
                                                            <td key={cell.id} className="px-8 py-4">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                                        <Activity size={40} className="text-slate-800 animate-pulse" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">No recent intelligence detected in forensic buffer</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Intelligence Column (4 Units) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass border border-white/[0.08] rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl h-[750px] flex flex-col shadow-2xl">
                            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between bg-zinc-950/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <Globe size={16} />
                                    </div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Global Cluster Intel</h3>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                                <div className="space-y-4">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">High-Conviction Wallets</div>
                                    {[
                                        { addr: '0xAb58...eC9B', tag: 'VC', color: 'text-indigo-400', pnl: '+$1.2M', entity: 'Tether Treasury' },
                                        { addr: '0x77Ea...82f7', tag: 'WHALE', color: 'text-emerald-400', pnl: '+$840k', entity: 'Jump Crypto' },
                                        { addr: '0xBeeF...cAfE', tag: 'EXCHANGE', color: 'text-amber-400', pnl: '+$420k', entity: 'GSR Markets' }
                                    ].map((wallet, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setSelectedSmartMoney(wallet)}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black text-white uppercase group-hover:text-indigo-400 transition-colors">{wallet.entity}</div>
                                                    <div className="text-[9px] font-mono text-slate-500">{wallet.addr}</div>
                                                </div>
                                                <span className={`text-[8px] font-black uppercase ${wallet.color}`}>{wallet.tag}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-[10px] font-black text-emerald-500">{wallet.pnl} Session</div>
                                                <button className="text-[8px] font-black text-slate-600 uppercase group-hover:text-white transition-colors">Trace</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/[0.05] bg-zinc-950/20">
                                <button className="w-full py-4 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-500/20 transition-all">
                                    Expand Intelligence Network
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Bridge Forensic Slide-Panel */}
            {
                selectedBridge && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedBridge(null)}></div>
                        <div className="relative h-full lg:w-[40%] w-full max-w-2xl bg-[#0D1117] border-l border-white/[0.1] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                            <div className="p-8 border-b border-white/[0.05] flex justify-between items-center bg-indigo-500/5">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">{selectedBridge.bridge} Forensic Intake</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol Intelligence Node v9.4</p>
                                </div>
                                <button onClick={() => setSelectedBridge(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">&times;</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Top 5 Recent Migrations</h3>
                                    <div className="space-y-3">
                                        {[
                                            { wallet: '0xDeAd...BeEf', label: 'Whale (Alpha)', amt: '$2.4M', time: '2m ago', risk: 'Safe' },
                                            { wallet: '0x3f5c...f0be', label: 'Binance Hot Wallet', amt: '$840k', time: '12m ago', risk: 'Safe' },
                                            { wallet: '0x77Ea...82f7', label: 'Flashloan Interaction', amt: '$540k', time: '18m ago', risk: 'Medium' },
                                            { wallet: '0x1234...abcd', label: 'Suspicious Mixer', amt: '$120k', time: '45m ago', risk: 'High' },
                                            { wallet: '0xBeeF...cAfE', label: 'New Smart Wallet', amt: '$95k', time: '1h ago', risk: 'Safe' }
                                        ].map((tx, idx) => (
                                            <div key={idx} className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl flex justify-between items-center group hover:bg-indigo-500/5 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-black text-white flex items-center gap-2">
                                                        {tx.wallet}
                                                        <span className={`text-[7px] px-1.5 py-0.5 rounded uppercase ${tx.risk === 'High' ? 'bg-rose-500 text-white' : tx.risk === 'Medium' ? 'bg-amber-500 text-black' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                            {tx.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] text-slate-600 font-bold uppercase">{tx.time} | RISK: {tx.risk}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-emerald-500">{tx.amt}</div>
                                                    <button onClick={() => onInvestigate(tx.wallet)} className="text-[7px] font-black text-indigo-400 hover:text-white uppercase tracking-widest mt-1">Investigate</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Bridge Analytics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="text-[8px] text-slate-500 font-black uppercase">Health Status</div>
                                            <div className="text-sm font-black text-emerald-500">OPTIMAL</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[8px] text-slate-500 font-black uppercase">Throughput</div>
                                            <div className="text-sm font-black text-white">12.4 TPS</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[8px] text-slate-500 font-black uppercase">Locked Liquidity</div>
                                            <div className="text-sm font-black text-white">$4.2B</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[8px] text-slate-500 font-black uppercase">24h Alpha Flow</div>
                                            <div className="text-sm font-black text-amber-500">+$124M</div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="p-8 border-t border-white/[0.05]">
                                <button className="w-full py-4 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                                    Download Full Forensic Report
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Smart Money Forensic Drawer */}
            {
                selectedSmartMoney && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedSmartMoney(null)}></div>
                        <div className="relative h-full lg:w-[40%] w-full max-w-2xl bg-[#0D1117] border-l border-white/[0.1] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col overflow-hidden">
                            <div className="p-10 border-b border-white/[0.05] bg-gradient-to-br from-indigo-500/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Node Assignment</div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Alpha Forensic Probe</h2>
                                    </div>
                                    <button onClick={() => setSelectedSmartMoney(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">&times;</button>
                                </div>
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="text-right">
                                            <div className="text-[9px] font-black text-slate-500 uppercase">Risk Score</div>
                                            <div className="text-xl font-black text-rose-500">8.4/10</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Identifier</span>
                                        <span className="text-xs font-mono text-indigo-300 font-bold">{selectedSmartMoney.wallet || selectedSmartMoney.addr}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[8px] font-black uppercase rounded-full`}>{selectedSmartMoney.tag}</span>
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full">DEX_ALPHA</span>
                                        <span className="px-3 py-1 bg-white/5 text-white text-[8px] font-black uppercase rounded-full">HIGH_CONVICTION</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                <section className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Activity size={12} className="text-indigo-400" />
                                        Holding Pattern Intelligence
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Cumulative PNL', val: '+$4.2M', color: 'text-emerald-500' },
                                            { label: 'Win Rate (30d)', val: '84.2%', color: 'text-white' },
                                            { label: 'Avg Conviction', val: '$840k', color: 'text-white' },
                                            { label: 'Risk Exposure', val: 'Minimal', color: 'text-emerald-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                                                <div className="text-[8px] text-slate-600 font-black uppercase mb-1">{stat.label}</div>
                                                <div className={`text-sm font-black ${stat.color}`}>{stat.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Affinity Matrix</h3>
                                    <div className="space-y-3">
                                        {[
                                            { asset: 'WETH', holding: '$1.2M', share: '42%' },
                                            { asset: 'USDC', holding: '$840k', share: '24%' },
                                            { asset: 'PENDLE', holding: '$420k', share: '12%' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.02] rounded-xl">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400">{item.asset}</div>
                                                    <div className="text-xs font-black text-white">{item.asset} Cluster</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-black text-white">{item.holding}</div>
                                                    <div className="text-[8px] font-black text-slate-500 uppercase">{item.share} Allocation</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="p-10 border-t border-white/[0.05] bg-zinc-950/40 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => console.log('Flagged as suspicious:', selectedSmartMoney.id)}
                                        className="py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/20 transition-all"
                                    >
                                        Flag as Suspicious
                                    </button>
                                    <button
                                        onClick={() => console.log('Exporting PDF for:', selectedSmartMoney.id)}
                                        className="py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                                    >
                                        Export PDF Dossier
                                    </button>
                                </div>
                                <button
                                    onClick={() => onInvestigate(selectedSmartMoney.wallet || selectedSmartMoney.addr)}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                                >
                                    Initiate Full Visualization Trace
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};


// B. Active Pair Feed (Iframe Bypass & Charting)
const RealTimeChart = () => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const seriesRef = useRef();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#64748b',
                fontSize: 10,
                fontFamily: 'Inter, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            crosshair: {
                mode: 0,
                vertLine: { color: '#6366f1', labelBackgroundColor: '#6366f1' },
                horzLine: { color: '#6366f1', labelBackgroundColor: '#6366f1' },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            handleScroll: true,
            handleScale: true,
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        // Initial Data (Historical feel)
        const now = Math.floor(Date.now() / 1000);
        const data = [];
        let basePrice = 2745;
        for (let i = 0; i < 100; i++) {
            const open = basePrice + Math.random() * 10 - 5;
            const close = open + Math.random() * 10 - 5;
            data.push({
                time: now - (100 - i) * 60,
                open: open,
                high: Math.max(open, close) + Math.random() * 2,
                low: Math.min(open, close) - Math.random() * 2,
                close: close
            });
            basePrice = close;
        }
        candlestickSeries.setData(data);

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Connect to Mempool Sentinel logic
        let currentCandle = { ...data[data.length - 1], time: Math.floor(Date.now() / 60000) * 60 };

        // C. Performance Optimization Callback
        const updateChart = (price) => {
            requestAnimationFrame(() => {
                const time = Math.floor(Date.now() / 60000) * 60;
                if (time > currentCandle.time) {
                    currentCandle = {
                        time: time,
                        open: price,
                        high: price,
                        low: price,
                        close: price
                    };
                } else {
                    currentCandle.high = Math.max(currentCandle.high, price);
                    currentCandle.low = Math.min(currentCandle.low, price);
                    currentCandle.close = price;
                }
                seriesRef.current.update(currentCandle);
            });
        };

        // Listen for Swap events on WETH/USDC via Alchemy Sentinel
        const cleanupSwap = alchemyManager.onSwap((price) => {
            updateChart(price);
        });

        // Backup simulated movements if no real events are firing (for UI demonstration)
        const demoInterval = setInterval(() => {
            const vol = Math.random() * 0.2;
            const direction = Math.random() > 0.5 ? 1 : -1;
            const newPrice = currentCandle.close + (vol * direction);
            updateChart(newPrice);
        }, 8000);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (cleanupSwap) cleanupSwap();
            clearInterval(demoInterval);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default MarketTerminal;

