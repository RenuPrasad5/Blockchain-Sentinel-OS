import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Shield, Globe, RefreshCw, Layers, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Visualizer = () => {
    const [searchParams] = useSearchParams();
    const [address, setAddress] = useState(searchParams.get('address') || '');
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrace = async (targetAddr) => {
        if (!targetAddr.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Support local fallback if needed
            const urls = [
                `${API_URL}/trace/${targetAddr}`,
                `/trace/${targetAddr}`
            ];
            
            let response = null;
            for (const url of urls) {
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        response = await res.json();
                        break;
                    }
                } catch (e) {
                    // Try next fallback
                }
            }

            if (!response) {
                throw new Error("Unable to establish connection with Sentinel-OS Trace Engine.");
            }

            setGraphData(response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const paramAddr = searchParams.get('address') || searchParams.get('wallet');
        if (paramAddr) {
            setAddress(paramAddr);
            fetchTrace(paramAddr);
        }
    }, [searchParams]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchTrace(address);
    };

    // Layout positions algorithm for DAG/Flow graph
    const layoutNodes = (nodes) => {
        const groups = {};
        nodes.forEach(n => {
            const d = n.depth || 1;
            if (!groups[d]) groups[d] = [];
            groups[d].push(n);
        });

        const positions = {};
        const width = 1100;
        const height = 550;

        Object.keys(groups).forEach(d => {
            const depth = parseInt(d);
            const groupNodes = groups[d];
            const count = groupNodes.length;

            let x = width * 0.5;
            if (depth === 1) x = width * 0.15;
            else if (depth === 2) x = width * 0.5;
            else if (depth === 3) x = width * 0.85;

            groupNodes.forEach((node, i) => {
                const y = (height / (count + 1)) * (i + 1);
                positions[node.id] = { x, y };
            });
        });

        return positions;
    };

    const positions = graphData ? layoutNodes(graphData.nodes) : {};

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 p-6 pt-24">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                                <Layers size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Forensic Command Center</span>
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tight uppercase tracking-wide">Multi-Hop Fund Flow Visualizer</h1>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">Recursively trace the full on-chain flow of funds to uncover money trails.</p>
                    </div>
                </header>

                {/* Input form */}
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] shadow-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Enter target wallet address (0x...)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-[#0b0f19] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-sm text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                        <span>Trace Flow</span>
                    </button>
                </form>

                {/* Main Graph Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 border border-white/5 bg-[#0b0f19]/20 rounded-[2.5rem]">
                        <RefreshCw className="animate-spin text-indigo-400" size={48} />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Compiling Deep Multi-Hop Trace...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm font-bold">
                        {error}
                    </div>
                ) : graphData ? (
                    <div className="space-y-6">
                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-6 bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wide">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-indigo-400">Source Wallet</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-amber-400">Intermediate Wallets</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-rose-400">Endpoints</span>
                            </span>
                            <span className="text-slate-600 font-mono text-[10px] ml-auto">
                                Depth Limit: 3 | Node Limit: 50
                            </span>
                        </div>

                        {/* Interactive Graph Area */}
                        <div className="relative bg-[#0b0f19]/30 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center select-none">
                            <svg className="w-full h-[550px]" viewBox="0 0 1100 550">
                                <defs>
                                    <marker
                                        id="arrowhead"
                                        markerWidth="10"
                                        markerHeight="7"
                                        refX="16"
                                        refY="3.5"
                                        orient="auto"
                                    >
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" opacity="0.6" />
                                    </marker>
                                </defs>

                                {/* Draw Edges */}
                                {graphData.edges.map((e, i) => {
                                    const source = positions[e.from];
                                    const target = positions[e.to];
                                    if (!source || !target) return null;

                                    return (
                                        <g key={e.id || i}>
                                            <path
                                                d={`M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`}
                                                stroke="#4338ca"
                                                strokeWidth="2.5"
                                                strokeDasharray="4 2"
                                                fill="none"
                                                opacity="0.45"
                                                markerEnd="url(#arrowhead)"
                                                className="transition-all hover:stroke-indigo-400 hover:opacity-100"
                                            />
                                            {/* Edge Label */}
                                            <text
                                                x={(source.x + target.x) / 2}
                                                y={(source.y + target.y) / 2 - 8}
                                                fill="#818cf8"
                                                fontSize="9"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                className="font-mono bg-black"
                                            >
                                                {e.value} ETH
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Draw Nodes */}
                                {graphData.nodes.map((n) => {
                                    const pos = positions[n.id];
                                    if (!pos) return null;

                                    return (
                                        <g 
                                            key={n.id} 
                                            transform={`translate(${pos.x}, ${pos.y})`}
                                            className="cursor-pointer group select-none"
                                        >
                                            <circle
                                                r={n.type === 'source' ? 24 : n.type === 'intermediate' ? 18 : 16}
                                                fill={
                                                    n.type === 'source' ? '#4f46e5' :
                                                    n.type === 'intermediate' ? '#f59e0b' : '#f43f5e'
                                                }
                                                className="transition-all group-hover:scale-110"
                                                stroke="#1e293b"
                                                strokeWidth="3"
                                            />
                                            <text
                                                y={n.type === 'source' ? 36 : n.type === 'intermediate' ? 30 : 28}
                                                fill="#f8fafc"
                                                fontSize="10"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                className="font-mono"
                                            >
                                                {n.label}
                                            </text>
                                            {/* Full hover tooltip on background */}
                                            <title>{n.id}</title>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 border border-white/5 bg-[#0b0f19]/20 rounded-[2.5rem]">
                        <Shield className="mx-auto text-slate-700 mb-4 animate-pulse" size={56} />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Ready to Trace</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Provide a target address to generate the full money trail.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Visualizer;
