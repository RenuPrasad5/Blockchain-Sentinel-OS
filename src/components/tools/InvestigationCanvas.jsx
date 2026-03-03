import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    Handle,
    Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, Activity, Wallet, History, ArrowUpRight, X, Info, Share2, Radar, Box, Zap, FileText } from 'lucide-react';
import useModeStore from '../../store/modeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { alchemyManager } from '../../utils/AlchemyManager';
import './InvestigationCanvas.css';

import { ethers } from 'ethers';

// Bridge Contracts Mapping
const BRIDGE_CONTRACTS = {
    '0x8731d54e5d023573f4d232be36b420c29f899011': { name: 'Stargate Bridge', targetChain: 'BASE' },
    '0x5c7bc6730521fd9c9f1d053df28fc62c8894451b': { name: 'Across Bridge', targetChain: 'OPTIMISM' },
    '0x3ee18b2214aff97000d974cf647e7c347e8fa585': { name: 'Wormhole', targetChain: 'SUI' },
};

// Custom Wallet Node Component
const WalletNode = ({ data, selected }) => {
    return (
        <div className={`wallet-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Top} />
            <div className="flex items-center gap-2 mb-1">
                {data.entityType === 'contract' ? (
                    <Box size={10} className="text-amber-400" />
                ) : (
                    <Wallet size={10} className="text-indigo-400" />
                )}
                <div className="node-label">{data.ens || 'Entity Node'}</div>
            </div>
            <div className="node-address font-mono">
                {data.ens ? data.ens : `${data.label.slice(0, 6)}...${data.label.slice(-4)}`}
            </div>
            {data.isTarget && (
                <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-rose-600 rounded-full absolute top-0 left-0"></div>
                </div>
            )}
            {data.isTarget && (
                <div className="absolute -inset-1 rounded-lg border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-[golden-pulse_2s_ease-in-out_infinite] pointer-events-none"></div>
            )}
            {data.isTarget && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 rounded text-[7px] font-black text-black uppercase tracking-widest whitespace-nowrap">
                    Target Acquired
                </div>
            )}
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

// Custom Bridge Node Component
const BridgeNode = ({ data, selected }) => {
    return (
        <div className={`wallet-node bridge-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Top} />
            <div className="flex items-center gap-2 mb-1">
                <Zap size={10} className="text-cyan-400" />
                <div className="node-label font-black text-cyan-400">{data.label}</div>
            </div>
            <div className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Cross-Chain Gateway</div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">
                <Globe size={8} className="text-cyan-400" />
                <span className="text-[7px] font-black text-cyan-400 uppercase">Target: {data.targetChain}</span>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

const nodeTypes = {
    wallet: WalletNode,
    bridge: BridgeNode,
};

const InvestigationCanvas = ({ preloadedAddress }) => {
    const liveData = useModeStore((state) => state.liveData);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [trackedAddress, setTrackedAddress] = useState(preloadedAddress || null);
    const [status, setStatus] = useState(alchemyManager.getStatus());
    const [showBriefing, setShowBriefing] = useState(true);
    const setIsScanning = useModeStore((state) => state.setIsScanning);

    const provider = useRef(new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/' + import.meta.env.VITE_ALCHEMY_API_KEY));

    // Monitor WebSocket Status
    useEffect(() => {
        const interval = setInterval(() => {
            const currentStatus = alchemyManager.getStatus();
            if (currentStatus !== status) {
                setStatus(currentStatus);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [status]);

    // Genesis Node Initialization
    useEffect(() => {
        if (!preloadedAddress && nodes.length === 0) {
            setNodes([{
                id: 'genesis-node',
                type: 'wallet',
                data: { label: 'Network Entry', isGenesis: true },
                position: { x: 400, y: 300 },
                draggable: false
            }]);
        }
    }, [preloadedAddress, nodes.length, setNodes]);

    useEffect(() => {
        if (preloadedAddress) {
            setTrackedAddress(preloadedAddress);
            // Initialize with the preloaded node
            const id = `node-${preloadedAddress}`;
            setNodes([{
                id,
                type: 'wallet',
                data: { label: preloadedAddress, isTarget: true, isNew: true },
                position: { x: 400, y: 300 }
            }]);
            resolveEns(preloadedAddress, id);
        }
    }, [preloadedAddress]);

    const resolveEns = async (address, nodeId) => {
        try {
            const [ens, code] = await Promise.all([
                provider.current.lookupAddress(address),
                provider.current.getCode(address)
            ]);

            const entityType = code !== '0x' ? 'contract' : 'eoa';

            setNodes(nds => nds.map(n => n.id === nodeId ? {
                ...n,
                data: { ...n.data, ens, entityType }
            } : n));
        } catch (e) {
            // Silently fail if not found
        }
    };

    // Handle incoming live data for tracking
    useEffect(() => {
        if (liveData.length === 0) return;

        const latestTx = liveData[0];
        if (latestTx.type !== 'TRANSACTION') return;

        const from = latestTx.from?.toLowerCase();
        const to = latestTx.to?.toLowerCase();
        const valueEth = parseFloat(latestTx.valueEth || 0);

        // Automatic Inflow Logic: If no tracked address, look for > 10 ETH
        if (!trackedAddress && valueEth > 10) {
            console.log("Automatic Inflow Triggered:", latestTx.from);
            setIsScanning(true);
            setTimeout(() => {
                setTrackedAddress(latestTx.from);
                const id = `node-${latestTx.from}`;
                setNodes([{
                    id,
                    type: 'wallet',
                    data: { label: latestTx.from, isTarget: true, isNew: true },
                    position: { x: 400, y: 300 }
                }]);
                resolveEns(latestTx.from, id);
                setIsScanning(false);
            }, 800);
            return;
        }

        if (!trackedAddress) return;

        const lowTracked = trackedAddress.toLowerCase();

        // Bridge Detection Logic
        const bridge = BRIDGE_CONTRACTS[to];
        if (bridge && (from === lowTracked)) {
            setNodes((nds) => {
                const fromId = `node-${latestTx.from}`;
                const bridgeId = `node-${latestTx.to}`;
                const targetWalletId = `node-crosschain-${Math.random().toString(36).substr(2, 5)}`;
                const edgeToBridgeId = `edge-bridge-${latestTx.id}`;
                const edgeCrossChainId = `edge-cross-${latestTx.id}`;

                let newNodes = [...nds.filter(n => n.id !== 'genesis-node')];

                // Add Bridge Node
                if (!newNodes.find(n => n.id === bridgeId)) {
                    newNodes.push({
                        id: bridgeId,
                        type: 'bridge',
                        data: { label: bridge.name, targetChain: bridge.targetChain },
                        position: { x: 600, y: 500 },
                    });
                }

                // Add "Re-emerging" Target Node
                newNodes.push({
                    id: targetWalletId,
                    type: 'wallet',
                    data: { label: 'Cross-Chain Instance', isNew: true, chain: bridge.targetChain },
                    position: { x: 800, y: 700 },
                });

                setEdges((eds) => {
                    const toBridgeEdge = {
                        id: edgeToBridgeId,
                        source: fromId,
                        target: bridgeId,
                        label: `${valueEth.toFixed(3)} ETH`,
                        animated: true,
                        style: { stroke: '#22d3ee', strokeWidth: 2 },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
                    };
                    const crossChainEdge = {
                        id: edgeCrossChainId,
                        source: bridgeId,
                        target: targetWalletId,
                        label: 'HOP DETECTED',
                        animated: true,
                        style: { stroke: '#22d3ee', strokeWidth: 2, strokeDasharray: '5,5', opacity: 0.6 },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
                    };
                    return [...eds, toBridgeEdge, crossChainEdge].slice(-40);
                });

                return newNodes.slice(-50);
            });
            return;
        }

        // If transaction involves tracked address, add nodes/edges
        if (from === lowTracked || to === lowTracked) {
            // Remove genesis node if active
            setNodes((nds) => {
                let filtered = nds.filter(n => n.id !== 'genesis-node');
                const fromId = `node-${latestTx.from}`;
                const toId = `node-${latestTx.to}`;
                const edgeId = `edge-${latestTx.id}`;

                let newNodes = [...filtered];
                let fromNode = newNodes.find((n) => n.id === fromId);
                let toNode = newNodes.find((n) => n.id === toId);

                const angle = (newNodes.length * 45) * (Math.PI / 180);
                const radius = 220;

                if (!fromNode) {
                    fromNode = {
                        id: fromId,
                        type: 'wallet',
                        data: { label: latestTx.from, isNew: true },
                        position: { x: 400 + Math.cos(angle) * radius, y: 300 + Math.sin(angle) * radius },
                    };
                    newNodes.push(fromNode);
                    resolveEns(latestTx.from, fromId);
                }

                if (!toNode) {
                    const toAngle = (newNodes.length * 45 + 20) * (Math.PI / 180);
                    toNode = {
                        id: toId,
                        type: 'wallet',
                        data: { label: latestTx.to, isNew: true },
                        position: { x: 400 + Math.cos(toAngle) * radius, y: 300 + Math.sin(toAngle) * radius },
                    };
                    newNodes.push(toNode);
                    resolveEns(latestTx.to, toId);
                }

                // Add edge
                setEdges((eds) => {
                    if (eds.find(e => e.id === edgeId)) return eds;
                    const newEdge = {
                        id: edgeId,
                        source: fromId,
                        target: toId,
                        label: `${valueEth.toFixed(3)} ETH`,
                        animated: true,
                        style: { stroke: '#818cf8', strokeWidth: 2, filter: 'drop-shadow(0 0 8px #6366f1)' },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
                    };
                    return [...eds, newEdge].slice(-40);
                });

                return newNodes.slice(-50);
            });
        }

    }, [liveData, trackedAddress, setIsScanning]);

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
        setSelectedEdge(null);
    }, []);

    const onEdgeClick = useCallback((event, edge) => {
        setSelectedEdge(edge);
        setSelectedNode(null);
    }, []);

    // Simple visual identity generator
    const getAvatarGradient = (address) => {
        const hex = address.replace('0x', '').slice(0, 6);
        return `linear-gradient(135deg, #${hex} 0%, #6366f1 100%)`;
    };

    // Derived Node Details for Sidebar
    const nodeDetails = useMemo(() => {
        if (!selectedNode) return null;

        // Find transactions in liveData involving this node
        const address = selectedNode.data.label.toLowerCase();
        const history = liveData
            .filter(tx => tx.type === 'TRANSACTION' && (tx.from?.toLowerCase() === address || tx.to?.toLowerCase() === address))
            .slice(0, 10)
            .map(tx => ({
                hash: tx.id.slice(0, 12),
                type: tx.from?.toLowerCase() === address ? 'OUT' : 'IN',
                value: `${parseFloat(tx.valueEth).toFixed(3)} ETH`,
                fullHash: tx.id
            }));

        return {
            address: selectedNode.data.label,
            ens: selectedNode.data.ens,
            entityType: selectedNode.data.entityType || 'Checking...',
            balance: 'Streaming...',
            history
        };
    }, [selectedNode, liveData]);

    const edgeDetails = useMemo(() => {
        if (!selectedEdge) return null;
        const tx = liveData.find(t => t.id === selectedEdge.id.replace('edge-', ''));
        return tx || { valueEth: selectedEdge.label?.split(' ')[0] };
    }, [selectedEdge, liveData]);

    return (
        <div className="w-full h-[700px] bg-[#020617] border border-white/[0.05] rounded-3xl overflow-hidden relative">
            {/* Header Overlay */}
            <div className="absolute top-6 left-6 z-10">
                <div className="px-5 py-3 bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <div>
                        <h2 className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1">Live Transaction Visualizer</h2>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Holographic Wallet Relationship Map {trackedAddress && `| Tracking: ${trackedAddress.slice(0, 8)}...`}</p>
                    </div>
                </div>
            </div>

            {/* Signal Indicator */}
            <div className="absolute top-6 right-6 z-10">
                <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-500 ${status === 'CONNECTED' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20 animate-pulse'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${status === 'CONNECTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {status === 'CONNECTED' ? 'Live Signal: Active' : 'Searching for Signal...'}
                    </span>
                </div>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                nodeTypes={nodeTypes}
                colorMode="dark"
                fitView
                maxZoom={1.5}
                minZoom={0.2}
            >
                <Background color="#1e293b" gap={25} size={1} />
                <Controls className="bg-slate-900 border-white/5 fill-white" />
            </ReactFlow>

            {/* Briefing Overlay */}
            <AnimatePresence>
                {showBriefing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-lg p-10 bg-slate-900/50 border border-white/[0.08] rounded-3xl text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-8">
                                <Shield size={32} className="text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Forensic Command Center</h2>
                            <p className="text-slate-400 font-medium mb-10 leading-relaxed">System activated. Deep-network surveillance and relationship mapping protocols initiated.</p>

                            <div className="grid grid-cols-1 gap-6 mb-10 text-left">
                                <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Box size={20} /></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase">Nodes</h4>
                                        <p className="text-[11px] text-slate-500">Wallet entities and smart contracts active on the network.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Share2 size={20} /></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase">Edges</h4>
                                        <p className="text-[11px] text-slate-500">Real-time capital flow and transactional relationship paths.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Radar size={20} /></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase">Live Track</h4>
                                        <p className="text-[11px] text-slate-500">Continuous surveillance of high-value on-chain movements.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowBriefing(false)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                            >
                                Initialize Radar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Node Sidebar */}
            <AnimatePresence>
                {selectedNode && nodeDetails && (
                    <motion.div
                        initial={{ x: 350 }}
                        animate={{ x: 0 }}
                        exit={{ x: 350 }}
                        className="canvas-sidebar"
                    >
                        <button
                            onClick={() => setSelectedNode(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="sidebar-header">
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-12 h-12 rounded-2xl border-2 border-indigo-500/20 shadow-inner"
                                    style={{ background: getAvatarGradient(nodeDetails.address) }}
                                ></div>
                                <div className="flex-1">
                                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Entity Profile</h3>
                                    <p className="text-[14px] font-mono text-white truncate max-w-[180px]">{nodeDetails.ens || nodeDetails.address}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                                    <div className="text-[8px] text-slate-500 uppercase font-black mb-1">Type</div>
                                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">{nodeDetails.entityType}</div>
                                </div>
                                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                                    <div className="text-[8px] text-slate-500 uppercase font-black mb-1">Status</div>
                                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Monitored</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <History size={14} className="text-indigo-400" />
                                <span className="sidebar-title text-[10px]">Relationship Flow</span>
                            </div>
                            <div className="tx-list">
                                {nodeDetails.history.length > 0 ? (
                                    nodeDetails.history.map((tx, i) => (
                                        <div key={i} className="tx-item flex justify-between items-center group hover:bg-white/[0.05] transition-colors cursor-pointer">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className={`p-1 rounded ${tx.type === 'OUT' ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                                                    <ArrowUpRight size={10} className={tx.type === 'OUT' ? 'text-rose-500' : 'text-emerald-500'} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-[9px] text-slate-400 uppercase truncate w-24">{tx.hash}</span>
                                                    <span className="text-[7px] font-black text-slate-600 uppercase mt-0.5">{tx.type === 'OUT' ? 'Capital Exit' : 'Strategic Inflow'}</span>
                                                </div>
                                            </div>
                                            <span className={`font-black text-[10px] ${tx.type === 'OUT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {tx.type === 'OUT' ? '-' : '+'}{tx.value}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[9px] text-slate-600 italic">Capturing network activity...</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edge Intelligence Report */}
            <AnimatePresence>
                {selectedEdge && edgeDetails && (
                    <motion.div
                        initial={{ x: 350 }}
                        animate={{ x: 0 }}
                        exit={{ x: 350 }}
                        className="canvas-sidebar"
                    >
                        <button
                            onClick={() => setSelectedEdge(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="sidebar-header">
                            <div className="flex items-center gap-2 mb-6">
                                <FileText size={16} className="text-indigo-400" />
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">Intelligence Report</h3>
                            </div>

                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6">
                                <div className="text-[8px] text-indigo-300 uppercase font-black mb-1">Transfer Value</div>
                                <div className="text-2xl font-black text-white tracking-tighter">{edgeDetails.valueEth || '0.00'} ETH</div>
                                <div className="text-[10px] text-indigo-400/60 font-bold">≈ ${(parseFloat(edgeDetails.valueEth || 0) * 2740).toLocaleString()} USD</div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-black uppercase">Gas Consumption</span>
                                    <span className="text-[10px] font-mono text-slate-300">{edgeDetails.gasSpent || '0.0024'} ETH</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-black uppercase">Execution Method</span>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{edgeDetails.method || 'STRATEGIC_TRANSFER'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                                    <span className="text-[9px] text-slate-500 font-black uppercase">Status</span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">SUCCESS</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-[8px] text-slate-600 uppercase font-black mb-4">Network Fingerprint</h4>
                            <div className="text-[9px] font-mono text-slate-500 break-all leading-relaxed">
                                UUID: {selectedEdge.id}<br />
                                Origin: {selectedEdge.source}<br />
                                Destination: {selectedEdge.target}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State / Inflow Monitor */}
            <AnimatePresence>
                {(!trackedAddress || nodes.length <= 1) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
                    >
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mx-auto mb-6 relative">
                                <Activity size={32} className="text-indigo-400 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping"></div>
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2">Monitor Active</h3>
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Awaiting high-value inflow ({'>'}10 ETH) for auto-mapping</p>
                            {status !== 'CONNECTED' && (
                                <p className="text-[8px] text-rose-500 uppercase mt-4 animate-pulse">Re-synchronizing uplink...</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvestigationCanvas;
