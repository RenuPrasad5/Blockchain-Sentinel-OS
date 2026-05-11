import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Shield, Globe, RefreshCw, Layers, ExternalLink, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import DecisionEngine from '../../components/tools/DecisionEngine';
import { Sliders, Bookmark, Filter, BarChart2, CheckSquare } from 'lucide-react';

const Visualizer = () => {
    const [searchParams] = useSearchParams();
    const [address, setAddress] = useState(searchParams.get('address') || '');
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Notes System
    const [selectedNode, setSelectedNode] = useState(null);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [newTag, setNewTag] = useState('Suspicious');

    // Advanced Trace Settings
    const [hopDepth, setHopDepth] = useState(3);
    const [threshold, setThreshold] = useState(0.1);
    const [showFilters, setShowFilters] = useState(false);
    const [investigationTabs, setInvestigationTabs] = useState(['Main Visualizer']);
    const [activeTab, setActiveTab] = useState('Main Visualizer');

    const fetchTrace = async (targetAddr, isExpand = false) => {
        if (!targetAddr.trim()) return;
        if (!isExpand) {
            setLoading(true);
            setError(null);
            setSelectedNode(null);
        }
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
                } catch (e) {}
            }

            if (!response) {
                throw new Error("Unable to establish connection with Sentinel-OS Trace Engine.");
            }
            
            if (isExpand && graphData) {
                const newNodes = [...graphData.nodes];
                response.nodes.forEach(n => {
                    if (!newNodes.find(ex => ex.id === n.id)) newNodes.push(n);
                });
                
                const newEdges = [...graphData.edges];
                response.edges.forEach(e => {
                    if (!newEdges.find(ex => ex.id === e.id)) newEdges.push(e);
                });
                
                setGraphData({
                    ...graphData,
                    nodes: newNodes,
                    edges: newEdges
                });
            } else {
                setGraphData(response);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            if (!isExpand) setLoading(false);
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

    // Layout
    const layoutNodes = (nodes, edges) => {
        // Simplified DAG layout
        const positions = {};
        const width = 1100;
        const height = 550;
        
        // Find depth using edges BFS
        const depths = { [graphData.rootWallet.toLowerCase()]: 1 };
        let queue = [graphData.rootWallet.toLowerCase()];
        
        while (queue.length > 0) {
            const curr = queue.shift();
            const currDepth = depths[curr];
            const outgoing = edges.filter(e => e.source === curr);
            outgoing.forEach(edge => {
                if (!depths[edge.target]) {
                    depths[edge.target] = currDepth + 1;
                    queue.push(edge.target);
                }
            });
        }
        
        const groups = {};
        nodes.forEach(n => {
            const d = depths[n.id.toLowerCase()] || 4;
            if (!groups[d]) groups[d] = [];
            groups[d].push(n);
        });

        Object.keys(groups).forEach(d => {
            const depth = parseInt(d);
            const groupNodes = groups[d];
            const count = groupNodes.length;

            let x = width * 0.15;
            if (depth === 2) x = width * 0.5;
            else if (depth >= 3) x = width * 0.85;

            groupNodes.forEach((node, i) => {
                const y = (height / (count + 1)) * (i + 1);
                positions[node.id] = { x, y };
            });
        });

        return positions;
    };

    const positions = graphData ? layoutNodes(graphData.nodes, graphData.edges) : {};

    // Notes System
    const fetchNotes = async (nodeId) => {
        try {
            const q = query(collection(db, 'investigation_notes'), where('nodeId', '==', nodeId));
            const snap = await getDocs(q);
            const fetchedNotes = [];
            snap.forEach(doc => fetchedNotes.push({ id: doc.id, ...doc.data() }));
            setNotes(fetchedNotes.sort((a, b) => b.createdAt - a.createdAt));
        } catch (e) {
            console.error("Error fetching notes", e);
        }
    };

    useEffect(() => {
        if (selectedNode) fetchNotes(selectedNode.id);
    }, [selectedNode]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim() || !selectedNode) return;
        
        try {
            const noteData = {
                caseId: searchParams.get('caseId') || 'UNASSIGNED',
                wallet: address,
                nodeId: selectedNode.id,
                note: newNote,
                tag: newTag,
                createdAt: Date.now(),
                createdBy: auth.currentUser ? auth.currentUser.uid : 'Anonymous Analyst'
            };
            
            await addDoc(collection(db, 'investigation_notes'), noteData);
            setNewNote('');
            fetchNotes(selectedNode.id);
        } catch (e) {
            console.error("Error saving note", e);
        }
    };

    const getNodeColor = (type) => {
        switch(type) {
            case 'Root': return '#4f46e5';
            case 'Exchange': return '#10b981';
            case 'Contract': return '#f59e0b';
            default: return '#f43f5e';
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 p-6 pt-24 relative overflow-hidden">
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
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] shadow-xl relative z-10">
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
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-3.5 border ${showFilters ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-400'} rounded-2xl transition-all`}
                    >
                        <Sliders size={18} />
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                        <span>Trace Flow</span>
                    </button>
                </form>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0b0f19] border border-white/5 p-5 rounded-3xl shadow-inner z-0 relative -mt-4 pt-8"
                        >
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Max Hop Depth: {hopDepth}</label>
                                <input type="range" min="1" max="5" value={hopDepth} onChange={e => setHopDepth(e.target.value)} className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Min Transaction Value (ETH)</label>
                                <input type="number" step="0.1" min="0" value={threshold} onChange={e => setThreshold(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500/50" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Path Selection Strategy</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500/50">
                                    <option>Recursive Deep Trace</option>
                                    <option>High Risk Only</option>
                                    <option>Volume Aggregate</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sticky Investigator Toolbar / Breadcrumbs */}
                <div className="sticky top-20 z-40 flex items-center justify-between bg-[#0f172a]/80 backdrop-blur-md border border-white/5 px-4 py-3 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                        {investigationTabs.map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                        <button 
                            className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"
                            onClick={() => setInvestigationTabs([...investigationTabs, `Tab ${investigationTabs.length + 1}`])}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-300 px-3 py-1.5 rounded-lg uppercase border border-white/5 transition-all">
                            <Bookmark size={12} /> Bookmark
                        </button>
                        <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-300 px-3 py-1.5 rounded-lg uppercase border border-white/5 transition-all">
                            <Filter size={12} /> Quick Evidence
                        </button>
                    </div>
                </div>

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
                        
                        {/* Dynamic Decision Engine Mounted Above Graph */}
                        <DecisionEngine graphData={graphData} />

                        <div className="space-y-6 flex gap-6 flex-col lg:flex-row">
                        <div className="flex-1 space-y-6">
                            {/* Legend */}
                            <div className="flex flex-wrap items-center gap-6 bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wide">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                                    <span className="text-indigo-400">Root</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                                    <span className="text-rose-400">Wallet</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="text-amber-400">Contract</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-emerald-400">Exchange</span>
                                </span>
                                <span className="text-slate-600 font-mono text-[10px] ml-auto">
                                    Depth Limit: 3 | Node Limit: 50
                                </span>
                            </div>

                            {/* Interactive Graph Area */}
                            <div className="relative bg-[#0b0f19]/30 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center select-none">
                                <svg className="w-full h-[550px]" viewBox="0 0 1100 550">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="16" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" opacity="0.6" />
                                        </marker>
                                        <marker id="arrowhead-high" markerWidth="10" markerHeight="7" refX="16" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" opacity="0.8" />
                                        </marker>
                                    </defs>

                                    {/* Draw Edges */}
                                    {graphData.edges.map((e, i) => {
                                        const source = positions[e.source];
                                        const target = positions[e.target];
                                        if (!source || !target) return null;

                                        const isHighRisk = e.riskLevel === 'High';

                                        return (
                                            <g key={e.id || i} onClick={() => setSelectedNode({ id: e.id, isEdge: true, ...e })} className="cursor-pointer group">
                                                <path
                                                    d={`M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`}
                                                    stroke={isHighRisk ? '#ef4444' : '#4338ca'}
                                                    strokeWidth={isHighRisk ? "3.5" : "2.5"}
                                                    strokeDasharray={isHighRisk ? "none" : "4 2"}
                                                    fill="none"
                                                    opacity={isHighRisk ? "0.8" : "0.45"}
                                                    markerEnd={`url(#${isHighRisk ? 'arrowhead-high' : 'arrowhead'})`}
                                                    className="transition-all hover:stroke-indigo-400 hover:opacity-100"
                                                />
                                                <text
                                                    x={(source.x + target.x) / 2}
                                                    y={(source.y + target.y) / 2 - 8}
                                                    fill={isHighRisk ? '#fca5a5' : '#818cf8'}
                                                    fontSize="9"
                                                    fontWeight="bold"
                                                    textAnchor="middle"
                                                    className="font-mono bg-black px-1"
                                                >
                                                    {e.value.substring(0, 8)} ETH
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Draw Nodes */}
                                    {graphData.nodes.map((n) => {
                                        const pos = positions[n.id];
                                        if (!pos) return null;
                                        
                                        const color = getNodeColor(n.type);

                                        return (
                                            <g 
                                                key={n.id} 
                                                transform={`translate(${pos.x}, ${pos.y})`}
                                                className="cursor-pointer group select-none"
                                                onClick={() => setSelectedNode(n)}
                                            >
                                                <circle
                                                    r={n.type === 'Root' ? 24 : 16}
                                                    fill={color}
                                                    className="transition-all group-hover:scale-110"
                                                    stroke="#1e293b"
                                                    strokeWidth="3"
                                                />
                                                <text
                                                    y={n.type === 'Root' ? 36 : 28}
                                                    fill="#f8fafc"
                                                    fontSize="10"
                                                    fontWeight="bold"
                                                    textAnchor="middle"
                                                    className="font-mono"
                                                >
                                                    {n.id.substring(0, 6)}...{n.id.substring(38)}
                                                </text>
                                                <title>{n.id} ({n.type})</title>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>

                        {/* Investigation Notes Panel */}
                        <AnimatePresence>
                            {selectedNode && (
                                <motion.div 
                                    initial={{ x: 300, opacity: 0, width: 0 }}
                                    animate={{ x: 0, opacity: 1, width: 320 }}
                                    exit={{ x: 300, opacity: 0, width: 0 }}
                                    className="bg-[#0f1423] border border-white/10 rounded-3xl p-5 flex flex-col max-h-[800px] shadow-2xl relative z-20 shrink-0"
                                >
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            <Shield size={14} className="text-indigo-400" /> Intelligence Note
                                        </h3>
                                        <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Target Entity / Hop</p>
                                        <div className="text-xs font-mono text-indigo-300 break-all bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                                            {selectedNode.id}
                                        </div>
                                        {selectedNode.type && (
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] uppercase font-bold">
                                                Entity Type: {selectedNode.type}
                                            </span>
                                        )}
                                        {selectedNode.classification && (
                                            <span className="inline-block mt-2 ml-2 px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[10px] uppercase font-bold border border-rose-500/30">
                                                {selectedNode.classification}
                                            </span>
                                        )}
                                        
                                        {!selectedNode.isEdge && (
                                            <button 
                                                onClick={() => fetchTrace(selectedNode.id, true)}
                                                className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold uppercase tracking-wider py-2 rounded border border-white/5 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Layers size={14} /> Expand Hop
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-custom mb-4">
                                        {notes.length === 0 ? (
                                            <p className="text-xs text-slate-500 text-center py-6">No investigation notes on this entity yet.</p>
                                        ) : (
                                            notes.map(note => (
                                                <div key={note.id} className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                                                            {note.tag}
                                                        </span>
                                                        <span className="text-[9px] text-slate-500">
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-300 leading-relaxed">{note.note}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <form onSubmit={handleAddNote} className="mt-auto space-y-3 pt-4 border-t border-white/10">
                                        <select 
                                            value={newTag} 
                                            onChange={(e) => setNewTag(e.target.value)}
                                            className="w-full bg-[#1e293b] text-xs text-white border border-white/10 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="Suspicious">Mark as Suspicious</option>
                                            <option value="Exchange Interaction">Exchange Interaction</option>
                                            <option value="Laundering Pattern">Possible Laundering Pattern</option>
                                            <option value="Safe/Verified">Safe / Verified</option>
                                        </select>
                                        <textarea
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Add forensic evidence..."
                                            className="w-full bg-[#1e293b] text-xs text-white border border-white/10 rounded-lg p-3 h-20 focus:outline-none focus:border-indigo-500 resize-none"
                                        />
                                        <button 
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors"
                                        >
                                            <Plus size={14} /> Submit Intel
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
