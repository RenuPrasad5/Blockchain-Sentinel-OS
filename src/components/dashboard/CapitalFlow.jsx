import React, { useEffect, useState } from 'react';
import { Activity, ArrowRightLeft, Database, Globe, Zap, Server, Shield, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CapitalFlow = ({ isRegulatoryMode }) => {
    const [flows, setFlows] = useState([
        { from: 'Binance', to: 'Cluster-08', asset: 'USDC', amt: '4.2M', type: 'EXIT', timestamp: '2s ago', status: 'COMPLETED' },
        { from: 'Cold Storage', to: 'Coinbase', asset: 'ETH', amt: '1.2k', type: 'INFLOW', timestamp: '12s ago', status: 'VERIFIED' },
        { from: 'OKX', to: 'Unknown-Node', asset: 'USDT', amt: '12.5M', type: 'EXIT', timestamp: '18s ago', status: 'MONITORED' },
        { from: 'Kraken', to: 'Institutional', asset: 'BTC', amt: '450', type: 'INFLOW', timestamp: '25s ago', status: 'COMPLETED' }
    ]);

    const nodes = {
        exchanges: ['Binance', 'Coinbase', 'OKX', 'Kraken', 'Huobi'],
        clusters: ['Private-01', 'Dark-Node', 'Institutional', 'Cluster-X', 'Mixing-Service']
    };

    // Simulate real-time flow updates
    useEffect(() => {
        const interval = setInterval(() => {
            const assets = ['USDC', 'ETH', 'USDT', 'BTC', 'SOL'];
            const types = ['EXIT', 'INFLOW'];
            const statuses = ['COMPLETED', 'MONITORED', 'VERIFIED'];
            
            const newFlow = {
                from: nodes.exchanges[Math.floor(Math.random() * nodes.exchanges.length)],
                to: nodes.clusters[Math.floor(Math.random() * nodes.clusters.length)],
                asset: assets[Math.floor(Math.random() * assets.length)],
                amt: (Math.random() * 10 + 1).toFixed(1) + (Math.random() > 0.5 ? 'M' : 'k'),
                type: types[Math.floor(Math.random() * types.length)],
                timestamp: 'Just now',
                status: statuses[Math.floor(Math.random() * statuses.length)]
            };

            setFlows(prev => [newFlow, ...prev].slice(0, 15));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const triggerAccel = (e) => {
        window.dispatchEvent(new CustomEvent('blockchain-node-hover', {
            detail: { x: e.clientX, y: e.clientY }
        }));
    };

    return (
        <div className="capital-flow-matrix h-full flex flex-col p-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full bg-white/5 border border-white/5 overflow-hidden">
                
                {/* Visual Flow Representation - High Fidelity SVG Grid */}
                <div className="lg:col-span-9 bg-[#0D1117] relative overflow-hidden flex flex-col p-6">
                    <div className="absolute top-6 left-6 z-10">
                        <div className="flex items-center gap-2">
                            <Activity size={14} className={isRegulatoryMode ? 'text-orange-500' : 'text-blue-500'} />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Capital Flow Architecture v4.2</h3>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-between items-center relative gap-12 mt-8">
                        {/* Left: Sources (Exchanges) */}
                        <div className="flex flex-col gap-4 z-10 w-32">
                            <div className="text-[8px] font-black text-slate-600 uppercase mb-2 tracking-widest text-center">Inception Points</div>
                            {nodes.exchanges.map((ex, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-10 border border-white/10 bg-white/[0.02] flex items-center justify-between px-3 group hover:border-${isRegulatoryMode ? 'orange' : 'blue'}-500/30 transition-all cursor-default`}
                                    onMouseMove={triggerAccel}
                                >
                                    <Database size={12} className={`text-slate-500 group-hover:text-${isRegulatoryMode ? 'orange' : 'blue'}-400`} />
                                    <span className="text-[9px] font-black text-slate-400 group-hover:text-white uppercase">{ex}</span>
                                </div>
                            ))}
                        </div>

                        {/* Center: Dynamic Vectors (SVG Layer) */}
                        <div className="flex-1 absolute inset-0 py-10 px-40">
                            <svg className="w-full h-full opacity-20" viewBox="0 0 400 300">
                                <defs>
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                                
                                {/* Static Connection Lines */}
                                {[20, 50, 80, 110, 140, 170, 200, 230, 260].map((y, i) => (
                                    <path 
                                        key={i}
                                        d={`M 0 ${y} Q 200 ${y + (i % 2 === 0 ? 20 : -20)} 400 ${y}`} 
                                        fill="none" 
                                        stroke="rgba(255,255,255,0.1)" 
                                        strokeWidth="0.5" 
                                    />
                                ))}

                                {/* Animated Data Packets based on flows */}
                                <AnimatePresence>
                                    {flows.slice(0, 5).map((f, i) => (
                                        <motion.circle
                                            key={`${f.from}-${i}`}
                                            r="2"
                                            fill={f.type === 'EXIT' ? '#f43f5e' : '#10b981'}
                                            initial={{ offsetDistance: "0%" }}
                                            animate={{ offsetDistance: "100%" }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
                                            style={{
                                                offsetPath: `path('M 0 ${60 + (i * 40)} Q 200 ${40 + (i * 20)} 400 ${80 + (i * 30)}')`,
                                                offsetRotate: "auto"
                                            }}
                                        />
                                    ))}
                                </AnimatePresence>
                            </svg>

                            {/* Floating Labels */}
                            <div className="absolute inset-0 pointer-events-none">
                                {flows.slice(0, 3).map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                                        className="absolute bg-[#0D1117]/80 backdrop-blur-sm border border-white/5 px-2 py-1 flex items-center gap-2"
                                        style={{ top: `${20 + i * 25}%`, left: `${30 + i * 15}%` }}
                                    >
                                        <span className="text-[7px] font-black text-white">{f.amt} {f.asset}</span>
                                        <ArrowRightLeft size={8} className={f.type === 'EXIT' ? 'text-rose-500' : 'text-emerald-500'} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Destinations (Clusters) */}
                        <div className="flex flex-col gap-4 z-10 w-32">
                            <div className="text-[8px] font-black text-slate-600 uppercase mb-2 tracking-widest text-center">Target Clusters</div>
                            {nodes.clusters.map((cl, idx) => (
                                <div 
                                    key={idx} 
                                    className="h-10 border border-white/10 bg-white/[0.02] flex items-center justify-between px-3 group hover:border-emerald-500/30 transition-all cursor-default"
                                    onMouseMove={triggerAccel}
                                >
                                    <span className="text-[9px] font-black text-slate-400 group-hover:text-white uppercase">{cl}</span>
                                    <Box size={12} className="text-slate-500 group-hover:text-emerald-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metadata Overlays */}
                    <div className="mt-auto pt-6 flex justify-between items-end border-t border-white/5">
                        <div className="flex gap-12">
                            <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-black text-slate-600 uppercase">Detection Engine</span>
                                <span className="text-[10px] font-black text-white uppercase">NEURAL-SURVEILLANCE-01</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-black text-slate-600 uppercase">Latency Threshold</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase">{"<"} 0.05ms</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-black text-slate-600 uppercase">Verification Level</span>
                                <span className="text-[10px] font-black text-blue-500 uppercase">SIGSET-LVL8</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={12} className="text-emerald-500" />
                            <span className="text-[8px] font-black uppercase text-slate-500">Live Traffic Verified</span>
                        </div>
                    </div>
                </div>

                {/* Right: Forensic Ledger */}
                <div className="lg:col-span-3 bg-[#0D1117] p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Ledger</h4>
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {flows.map((f, i) => (
                                <motion.div 
                                    key={`${f.from}-${f.timestamp}-${i}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 bg-white/[0.01] border border-white/[0.03] flex flex-col gap-2 group hover:bg-white/[0.03] transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[10px] font-black ${f.type === 'EXIT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {f.amt} {f.asset}
                                        </span>
                                        <span className="text-[7px] text-slate-700 font-bold uppercase">{f.timestamp}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[7px] font-black text-slate-500 uppercase">Path</span>
                                            <span className="text-[8px] font-bold text-white uppercase truncate max-w-[100px]">{f.from} → {f.to}</span>
                                        </div>
                                        <div className="text-right flex flex-col gap-0.5">
                                            <span className="text-[7px] font-black text-slate-500 uppercase">Status</span>
                                            <span className={`text-[7px] font-black uppercase ${f.status === 'MONITORED' ? 'text-amber-500' : 'text-blue-500'}`}>{f.status}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CapitalFlow;

