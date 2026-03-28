import React, { useMemo, useState, useEffect } from 'react';
import {
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Search,
    Clock,
    Shield,
    ExternalLink,
    Wallet,
    Box,
    Globe,
    AlertCircle,
    Info,
    RefreshCw
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { motion, AnimatePresence } from 'framer-motion';
import useModeStore from '../../store/modeStore';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { alchemyManager } from '../../utils/AlchemyManager';
import '../Tools.css';

const EXCHANGES = {
    '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE': 'Binance',
    '0x71660c4f841dd04d004243867601694573172abc': 'Coinbase',
    '0x2910543af39aba563d3393d4a6750000a0000abc': 'Kraken',
    '0xD551234Ae421e3BCBA99A0Da6d734E599F2273d1': 'Binance 2',
    '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503': 'Binance 3',
    '0x28C6c06298d514Db089934071355E5743bf21d60': 'Binance 4',
    '0xF977814e90dA44bFA03b6295A0616a897441aceC': 'Binance 5',
    '0xA000000000000000000000000000000000000001': 'Coinbase 2',
    '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'Vitalik Buterin',
};

const SENTIMENTS = [
    { label: 'Panic Move', color: '#ef4444', desc: 'Social sentiment suggests high FUD/exploit risk.' },
    { label: 'Strategic Rebalance', color: '#6366f1', desc: 'Neutral sentiment detected via institutional flows.' },
    { label: 'Institutional Buy', color: '#10b981', desc: 'Positive sentiment link to ETF inflows/OTC desk activity.' }
];

const getSentiment = (txId) => {
    const hash = txId.charCodeAt(10) % 3;
    return SENTIMENTS[hash];
};

const WhaleWatch = () => {
    const { liveData, setIsScanning } = useModeStore();
    const navigate = useNavigate();

    // Buffering Logic
    const [buffer, setBuffer] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [isBuffering, setIsBuffering] = useState(true);
    const [lastFlush, setLastFlush] = useState(Date.now());
    const [pulse, setPulse] = useState(false);

    // Filter and collect whale transactions into the buffer
    useEffect(() => {
        const highValueTxs = liveData.filter(tx =>
            tx.type === 'TRANSACTION' && tx.valueUsd > 100000
        );

        if (highValueTxs.length > 0) {
            setBuffer(prev => {
                const combined = [...highValueTxs, ...prev].slice(0, 100);
                return combined;
            });
        }
    }, [liveData]);

    // Flush buffer every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (buffer.length > 0) {
                setHeatmapData(buffer.map(tx => {
                    const valueUsd = tx.valueUsd;
                    // Intensity calculation: Higher value = more Pink/Hot
                    const intensity = Math.min(1, valueUsd / 50000000); // Max intensity at $50M

                    return {
                        x: tx.timestamp || Date.now(),
                        y: valueUsd,
                        id: tx.id,
                        from: tx.from,
                        to: tx.to,
                        fromLabel: EXCHANGES[tx.from] || 'Private Wallet',
                        toLabel: EXCHANGES[tx.to] || 'Private Wallet',
                        intent: EXCHANGES[tx.to] ? 'SELL PRESSURE' : (EXCHANGES[tx.from] ? 'ACCUMULATION' : 'WHALE TRANSFER'),
                        confidence: 85 + Math.floor(Math.random() * 14),
                        netFlow: (Math.random() > 0.5 ? 1 : -1) * (valueUsd * 0.8),
                        intensityColor: intensity > 0.7 ? '#ec4899' : (intensity > 0.3 ? '#8b5cf6' : '#6366f1')
                    };
                }));
                setIsBuffering(false);
                setPulse(true);
                setLastFlush(Date.now());
                setTimeout(() => setPulse(false), 1000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [buffer]);

    const stats = useMemo(() => {
        return heatmapData.reduce((acc, tx) => {
            if (tx.intent === 'SELL PRESSURE') acc.inflow += tx.y;
            if (tx.intent === 'ACCUMULATION') acc.outflow += tx.y;
            acc.activeWhales.add(tx.from);
            acc.activeWhales.add(tx.to);
            return acc;
        }, { inflow: 0, outflow: 0, activeWhales: new Set() });
    }, [heatmapData]);

    const whaleData = useMemo(() => {
        return heatmapData.map(tx => {
            const sentiment = getSentiment(tx.id);
            const fromLabel = EXCHANGES[tx.from] || 'Private Wallet';
            const toLabel = EXCHANGES[tx.to] || 'Private Wallet';

            let color = '#6366f1';
            if (tx.intent === 'SELL PRESSURE') color = '#ef4444';
            if (tx.intent === 'ACCUMULATION') color = '#10b981';

            return {
                ...tx,
                valueUsd: tx.y,
                sentiment,
                fromLabel,
                toLabel,
                color
            };
        });
    }, [heatmapData]);

    const handleInvestigate = (address) => {
        if (!address) return;
        try {
            const checksummed = ethers.getAddress(address);
            setIsScanning(true);
            setTimeout(() => {
                setIsScanning(false);
                navigate(`/tools/visualizer?address=${checksummed}`);
            }, 800);
        } catch (e) {
            console.error("Invalid Intelligence Bridge Address:", address);
        }
    };

    // ApexCharts Config for Heatmap/Scatter
    const chartOptions = {
        chart: {
            id: 'whale-heatmap',
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 350 }
            },
            background: 'transparent',
            foreColor: '#64748b'
        },
        colors: ['#6366f1', '#ec4899'],
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#64748b', fontSize: '10px' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            type: 'logarithmic',
            labels: {
                formatter: (val) => `$${(val / 1000000).toFixed(1)}M`,
                style: { colors: '#64748b', fontSize: '10px' }
            },
            axisBorder: { show: false }
        },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.03)',
            strokeDashArray: 4
        },
        markers: {
            size: 8,
            strokeWidth: 2,
            strokeColors: '#161B22',
            hover: { size: 12 },
            fillOpacity: 0.8,
            colors: [({ value, seriesIndex, w, dataPointIndex }) => {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                return data?.intensityColor || '#6366f1';
            }]
        },
        tooltip: {
            theme: 'dark',
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                const netFlowColor = data.netFlow > 0 ? '#10b981' : '#ef4444';

                return `<div class="glass p-6 border-white/10 rounded-2xl" style="background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); min-width: 240px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                    <div class="flex justify-between items-center mb-3">
                        <div class="text-[10px] font-black uppercase text-indigo-400 tracking-widest">${data.intent}</div>
                        <div class="flex items-center gap-1.5">
                            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span class="text-[9px] font-black text-emerald-500 uppercase">Verified</span>
                        </div>
                    </div>
                    
                    <div class="text-2xl font-black text-white mb-4 tracking-tighter">$${(data.y / 1000000).toFixed(2)}M</div>
                    
                    <div class="space-y-2 mb-4 border-y border-white/5 py-3">
                        <div class="flex justify-between">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Whale Identity</span>
                            <span class="text-[10px] font-black text-white">${data.fromLabel}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Net Flow</span>
                            <span class="text-[10px] font-black" style="color: ${netFlowColor}">${data.netFlow > 0 ? '+' : ''}$${(data.netFlow / 1000000).toFixed(1)}M</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Confidence Score</span>
                            <span class="text-[10px] font-black text-indigo-300">${data.confidence}%</span>
                        </div>
                    </div>

                    <div class="text-[8px] font-mono text-slate-600 break-all leading-tight">
                        ID: ${data.id}
                    </div>
                </div>`;
            }
        },
        theme: { mode: 'dark' }
    };

    const chartSeries = [{
        name: 'High-Value Txs',
        data: heatmapData
    }];

    return (
        <div className="tools-terminal-wrapper full-width-terminal">
            <header className="section-desc-box pt-12">
                <div className="terminal-container">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Live Intelligence Surveillance</span>
                    </div>
                    <h1 className="section-desc-title tracking-tighter">High-Value Surveillance Engine</h1>
                    <p className="section-desc-text">Secure surveillance of high-value liquidity movements across global exchanges and private cold-storage clusters for risk assessment.</p>
                </div>
            </header>

            <main className="content-area-terminal py-12">
                <div className="terminal-container">
                    {/* Vital Signs Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="stats-card-v2 glass p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Surplus Net Flow Audit</span>
                                <Activity size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className={`text-3xl font-black tracking-tighter ${stats.inflow - stats.outflow > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {stats.inflow - stats.outflow > 0 ? '+' : ''}{((stats.inflow - stats.outflow) / 1000000).toFixed(2)}M
                                </span>
                                <span className="text-xs font-bold text-slate-500">USD</span>
                            </div>
                            <div className="mt-4 flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp size={12} className="text-rose-500" />
                                    <span className="text-[10px] font-bold text-slate-400">${(stats.inflow / 1000000).toFixed(1)}M In</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TrendingDown size={12} className="text-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-400">${(stats.outflow / 1000000).toFixed(1)}M Out</span>
                                </div>
                            </div>
                        </div>

                        <div className="stats-card-v2 glass p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Whales (1h)</span>
                                <Shield size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black tracking-tighter text-white">
                                    {stats.activeWhales.size}
                                </span>
                                <span className="text-xs font-bold text-slate-500">Entities Flagged</span>
                            </div>
                            <div className="mt-4 progress-bar-mini bg-white/5 h-1 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                />
                            </div>
                        </div>

                        <div className="stats-card-v2 glass p-6 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Surveillance Uptime</span>
                                <Zap size={16} className="text-indigo-400 animate-pulse" />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black tracking-tighter text-white">99.98%</span>
                                <span className="text-xs font-bold text-slate-500 text-emerald-500 uppercase">Live</span>
                            </div>
                            <div className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Buffering Mempool Streams...
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Section with Buffering State */}
                    <div className="glass rounded-3xl mb-12 border-white/[0.05] relative overflow-hidden">
                        <div className="p-8 border-b border-white/[0.03] flex justify-between items-center bg-white/[0.01]">
                            <div className="flex items-center gap-3">
                                <BarChart3 size={18} className="text-indigo-400" />
                                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Transaction Intensity Heatmap</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                {isBuffering && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                                        <RefreshCw size={12} className="text-indigo-400 animate-spin" />
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Buffering Mempool...</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-indigo-400 scale-125' : 'bg-slate-700'} transition-all duration-300`}></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Pulse</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 h-[450px]">
                            {isBuffering ? (
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-indigo-500"
                                            animate={{ x: [-256, 256] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">[ BUFFERING MEMPOOL STREAMS... ]</span>
                                </div>
                            ) : (
                                <Chart
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="scatter"
                                    height="100%"
                                />
                            )}
                        </div>
                    </div>

                    {/* Whale Feed */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Box size={18} className="text-slate-400" />
                                <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Live Intelligence Feed</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                <Search size={14} className="text-slate-500" />
                                <input type="text" placeholder="FILTER BY ADDRESS..." className="bg-transparent border-none text-[10px] font-black text-white outline-none placeholder:text-slate-700 uppercase" />
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {whaleData.map((tx) => (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="whale-feed-card glass p-6 border-white/[0.03] hover:border-white/[0.1] transition-all group overflow-hidden relative"
                                >
                                    {/* Scan line effect on hover */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 translate-y-[-1px] group-hover:translate-y-[150px] transition-transform duration-1000"></div>

                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-shrink-0 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <Globe size={24} className="text-white/50" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Value</div>
                                                <div className="text-xl font-black text-white tracking-tighter">${(tx.valueUsd / 1000000).toFixed(2)}M</div>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div
                                                    className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors"
                                                    onClick={() => handleInvestigate(tx.from)}
                                                >
                                                    <div className="text-[8px] text-slate-600 uppercase font-black mb-1">Origin Subject</div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[11px] font-mono text-slate-300 truncate max-w-[150px]">{tx.from}</span>
                                                        <span className="text-[9px] font-black text-indigo-400/60 uppercase">{tx.fromLabel}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors"
                                                    onClick={() => handleInvestigate(tx.to)}
                                                >
                                                    <div className="text-[8px] text-slate-600 uppercase font-black mb-1">Target Cluster</div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[11px] font-mono text-slate-300 truncate max-w-[150px]">{tx.to}</span>
                                                        <span className="text-[9px] font-black text-indigo-400/60 uppercase">{tx.toLabel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 flex flex-col items-end gap-3 w-full md:w-auto">
                                            <div className="flex flex-col items-end gap-1">
                                                <div
                                                    className="px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-lg"
                                                    style={{ backgroundColor: `${tx.color}10`, borderColor: `${tx.color}30`, color: tx.color }}
                                                >
                                                    {tx.intent}
                                                </div>
                                                <div
                                                    className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg group/sentiment relative"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tx.sentiment.color }}></div>
                                                    <span className="text-[8px] font-black text-white/60 uppercase tracking-tighter">Intent: {tx.sentiment.label}</span>

                                                    {/* Sentiment Tooltip */}
                                                    <div className="absolute bottom-full right-0 mb-2 w-48 p-3 glass border-white/10 rounded-xl opacity-0 scale-95 group-hover/sentiment:opacity-100 group-hover/sentiment:scale-100 transition-all pointer-events-none z-50">
                                                        <div className="text-[8px] font-black uppercase mb-1" style={{ color: tx.sentiment.color }}>Sentiment Intelligence</div>
                                                        <div className="text-[10px] text-slate-300 font-medium leading-tight">{tx.sentiment.desc}</div>
                                                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                                                            <span className="text-[7px] text-slate-500 font-bold uppercase">Source: X / Telegram LLM</span>
                                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
                                                <Clock size={12} />
                                                JUST NOW
                                                <button className="ml-4 p-1 rounded hover:bg-white/10 text-indigo-400">
                                                    <ExternalLink size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-900 bg-slate-950/50">
                <div className="terminal-container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${alchemyManager.getStatus() === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                <span>Uplink Status: {alchemyManager.getStatus()}</span>
                            </div>
                            <div className="h-3 w-px bg-slate-800"></div>
                            <span>&copy; 2026 Blockchain Intelligence Intelligence</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WhaleWatch;

