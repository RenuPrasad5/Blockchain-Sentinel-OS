import React, { useState, useEffect, useMemo } from 'react';
import {
    Activity,
    Shield,
    Zap,
    Database,
    Flame,
    Cpu,
    Search,
    ArrowRight,
    Copy,
    ExternalLink,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Clock,
    Eye,
    Globe,
    ZapOff,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    ShieldCheck,
    Lock,
    X,
    Fingerprint,
    Workflow,
    Layers,
    ArrowUpCircle,
    ArrowDownCircle,
    ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useModeStore from '../store/modeStore';
import { provider } from '../services/BlockchainProvider';
import { calculateRiskScore, createAuditLog, RISK_LEVELS } from '../services/ForensicEngine';
import { formatIntelligence, resolveAddress, simulateGas } from '../utils/EthersUtils';
import { ethers } from 'ethers';
import './MempoolHub.css';

const MempoolHub = () => {
    const liveData = useModeStore((state) => state.liveData);
    const [stats, setStats] = useState({
        pendingCount: 0,
        avgGas: 0,
        highPriority: 0,
        baseFee: 0,
        mempoolSize: '0 GB',
        blockFill: 0
    });

    const [visibleTx, setVisibleTx] = useState([
        { id: '0x3a4b...e91d', from: '0x71C...345', to: 'Uniswap V3', valueEth: '1.4500', status: 'PENDING' },
        { id: '0x2f9c...a2b8', from: '0x0d1...992', to: 'OpenSea', valueEth: '0.0820', status: 'PENDING' },
        { id: '0x9e1a...f4d2', from: '0x45a...110', to: '0x88d...431', valueEth: '12.0000', status: 'PENDING' }
    ]);
    const [buffer, setBuffer] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [filter, setFilter] = useState('');
    const [selectedTx, setSelectedTx] = useState(null);
    const [riskInfo, setRiskInfo] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [gasSimulation, setGasSimulation] = useState(null);
    const [resolvedFrom, setResolvedFrom] = useState(null);

    // Initial stats fetch
    useEffect(() => {
        const updateStats = async () => {
            try {
                const feeData = await provider.getFeeData();
                const block = await provider.getBlock('latest');
                const baseFee = block.baseFeePerGas;

                setStats(prev => ({
                    ...prev,
                    avgGas: (Number(feeData.gasPrice) / 1e9).toFixed(1),
                    baseFee: baseFee ? (Number(baseFee) / 1e9).toFixed(1) : 0,
                    highPriority: (Number(feeData.maxPriorityFeePerGas) / 1e9).toFixed(1),
                    pendingCount: 2400 + Math.floor(Math.random() * 800),
                    mempoolSize: (0.8 + Math.random() * 0.4).toFixed(2) + ' GB',
                    blockFill: 80 + Math.floor(Math.random() * 15)
                }));
            } catch (err) {
                console.error("Mempool Stats Error:", err);
            }
        };

        const interval = setInterval(updateStats, 5000);
        updateStats();
        return () => clearInterval(interval);
    }, []);

    // INTELLIGENCE BUFFER LOGIC
    // Use a ref to track seen transactions across renders to avoid duplicates and missing data
    const processedIds = React.useRef(new Set());

    useEffect(() => {
        if (liveData.length > 0) {
            // Get all transactions from liveData that haven't been processed yet
            const newTxs = liveData.filter(tx => !processedIds.current.has(tx.id));
            
            if (newTxs.length > 0) {
                newTxs.forEach(tx => processedIds.current.add(tx.id));
                
                // Keep the processedIds set size in check
                if (processedIds.current.size > 500) {
                    const idsToKeep = [...processedIds.current].slice(-200);
                    processedIds.current = new Set(idsToKeep);
                }

                setBuffer(prev => {
                    // Final safety check for duplicates in the current buffer
                    const filtered = newTxs.filter(tx => !prev.some(p => p.id === tx.id));
                    return [...prev, ...filtered];
                });
            }
        }
    }, [liveData]);

    // 2. Adaptive Release Logic: Catch up if buffer gets too large
    useEffect(() => {
        const getReleaseRate = (bufferLength) => {
            if (bufferLength > 20) return 100; // Turbo mode
            if (bufferLength > 10) return 300; // Fast mode
            return 800; // Normal smooth mode
        };

        const tick = () => {
            setBuffer(currentBuffer => {
                if (currentBuffer.length > 0) {
                    const [nextTx, ...remaining] = currentBuffer;

                    setVisibleTx(prevVisible => {
                        // Check for duplicates in visible list
                        if (prevVisible.some(v => v.id === nextTx.id)) return prevVisible;
                        return [nextTx, ...prevVisible].slice(0, 100); // Expanded limit
                    });

                    setIsStreaming(true);
                    setTimeout(() => setIsStreaming(false), 500);

                    return remaining;
                }
                return currentBuffer;
            });
        };

        let timer;
        const run = () => {
            tick();
            timer = setTimeout(run, getReleaseRate(buffer.length));
        };

        run();
        return () => clearTimeout(timer);
    }, [buffer.length]);

    // Filtered data based on visible transactions
    const filteredTx = useMemo(() => {
        return visibleTx.filter(tx =>
            !filter ||
            tx.id.toLowerCase().includes(filter.toLowerCase()) ||
            tx.from.toLowerCase().includes(filter.toLowerCase()) ||
            tx.to.toLowerCase().includes(filter.toLowerCase())
        );
    }, [visibleTx, filter]);

    // Forensic Scan
    const handleHashClick = async (tx) => {
        setIsLoadingDetails(true);
        setSelectedTx(tx);
        setGasSimulation(null);
        setResolvedFrom(null);

        try {
            // 1. Forensic Assessment via Compliance Engine
            // Mocking historical activity for calculation
            const mockActivity = [
                { value: Number(tx.valueEth), toLabel: tx.to },
                { value: 0.05, toLabel: 'Unknown' },
                { value: 0.02, toLabel: 'Mixer' },
                { value: 12.5, toLabel: 'Binance' }
            ];
            
            const assessment = calculateRiskScore(tx.from, mockActivity);
            
            const [gasEst, resolvedAddr] = await Promise.all([
                simulateGas({
                    to: tx.to === 'Contract Creation' ? ethers.ZeroAddress : tx.to,
                    from: tx.from,
                    value: tx.valueEth ? ethers.parseEther(tx.valueEth.toString()) : 0,
                    data: tx.input || '0x'
                }),
                resolveAddress(tx.from)
            ]);

            setRiskInfo(assessment);
            setGasSimulation(gasEst);
            setResolvedFrom(resolvedAddr);
        } catch (err) {
            console.error("Forensic Enrichment node failed:", err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleFullTrace = () => {
        if (!selectedTx) return;
        // Create Audit Log
        const log = createAuditLog('FORENSIC_TRACE_INIT', selectedTx.id, `Agent initiated full forensic trace on address: ${selectedTx.from}`);
        console.log("Audit Log Generated:", log);
        alert(`Forensic Audit Logged: ${log.id}\nFull Network Trace Initialized.`);
    };

    const getIntentLabel = (tx) => {
        const value = Number(tx.valueEth);
        if (value >= 50) return { label: 'Whale', color: 'text-rose-400', bg: 'bg-rose-400/10' };
        if (tx.to === 'Contract Creation') return { label: 'Deploy', color: 'text-amber-400', bg: 'bg-amber-400/10' };

        const knownContracts = {
            '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Swap',
            '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Swap',
            '0x00000000006c3852cbef3e08e8df289169ede581': 'Mint',
            '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': 'Swap',
            '0x1111111254fb6c44bac0bed2854e76f90643097d': 'Swap'
        };

        const type = knownContracts[tx.to?.toLowerCase()];
        if (type) return { label: type, color: 'text-indigo-400', bg: 'bg-indigo-400/10' };

        return { label: 'Transfer', color: 'text-slate-400', bg: 'bg-slate-400/10' };
    };

    return (
        <div className="mempool-hub-dashboard">
            {/* STICKY HEADER */}
            <div className="fixed-ticker-header">
                <div className="ticker-content px-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 border-r border-white/10 pr-6 group">
                            <Flame size={16} className="text-orange-500 group-hover:animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Resource Load:</span>
                            <span className="mono text-xs font-black text-white">{stats.avgGas} SAT/B</span>
                        </div>
                        <div className="flex items-center gap-2 border-r border-white/10 pr-6">
                            <Layers size={16} className="text-indigo-500" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Monitoring Depth:</span>
                            <span className="mono text-xs font-black text-white">{stats.mempoolSize}</span>
                        </div>
                        <div className="search-layer flex-1 max-w-md ml-auto">
                            <div className="search-bar-neon">
                                <Search size={14} className="text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH BY HASH OR .ETH..."
                                    value={filter}
                                    onChange={async (e) => {
                                        const val = e.target.value;
                                        setFilter(val);
                                        if (val.endsWith('.eth')) {
                                            const resolved = await resolveAddress(val);
                                            if (resolved && resolved !== val) setFilter(resolved);
                                        }
                                    }}
                                />
                                <div className="kbd-shortcut">/</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-pushed pt-8 px-6 overflow-y-auto custom-scrollbar h-full">
                <div className="max-w-[1600px] mx-auto">
                    {/* LIVE BLOCK PROJECTION */}
                    <section className="block-projection-section mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="live-badge bg-emerald-500 animate-pulse">QUICKNODE_LIVE</div>
                                <h2 className="section-title">Nodal Block Projections <span className="text-[10px] opacity-30 italic ml-2">SIMULATING TRANSACTION LAYERS...</span></h2>
                            </div>
                            <div className="text-[10px] font-medium opacity-40 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={10} className="text-emerald-400" /> Surveillance Active
                            </div>
                        </div>

                        <div className="projection-grid h-40">
                            {[1, 2, 3].map((idx) => (
                                <div key={idx} className="pending-block-container group">
                                    <div className="block-metadata-top text-[9px] uppercase font-black opacity-30 group-hover:opacity-100 transition-opacity">
                                        EST_FILL: {80 + (idx * 5)}% | CAP: 30M
                                    </div>
                                    <div className="block-vessel">
                                        <div className="particle-layer">
                                            {[...Array(12)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="block-particle"
                                                    animate={{
                                                        x: [Math.random() * 400, Math.random() * 400],
                                                        y: [Math.random() * 100, Math.random() * 100],
                                                        opacity: [0.1, 0.4, 0.1]
                                                    }}
                                                    transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
                                                />
                                            ))}
                                        </div>
                                        <motion.div
                                            className="block-fill-level"
                                            animate={{ height: `${stats.blockFill - (idx * 10)}%` }}
                                            transition={{ type: 'spring', stiffness: 20, damping: 10 }}
                                        />
                                    </div>
                                    <div className="block-metadata-bottom">
                                        <span className="mono text-[10px] font-black tracking-widest text-[#818cf8]">PENDING BLOCK (+{idx * 12}s)</span>
                                        <div className="status-dot-green pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="main-layout-split flex gap-6 min-h-[500px] mb-10">

                        {/* SMART LIST PANEL */}
                        <div className="table-area-panel flex-1 bg-slate-900/20 border border-white/5 rounded-xl overflow-hidden flex flex-col relative">
                            <div className="panel-header-dense px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/5 z-10">
                                <div className="flex items-center gap-2">
                                    <Fingerprint size={16} className="text-indigo-400" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">Forensic Monitoring Layer</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold">
                                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> VERIFIED EXCHANGE</span>
                                    <span className="flex items-center gap-1.5 text-slate-500">|</span>
                                    <span className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-rose-400" /> RISK DETECTED</span>
                                </div>
                            </div>

                            <div className="table-wrapper-mempool flex-1 relative intel-feed-container">
                                {/* NEW ACTIVITY INDICATOR */}
                                <AnimatePresence>
                                    {isStreaming && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="new-activity-badge"
                                        >
                                            <div className="pulse-glow-indigo">NEW ACTIVITY DETECTED</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {visibleTx.length === 0 ? (
                                    <div className="skeleton-container p-6 space-y-4">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="skeleton-row h-12 bg-white/5 rounded animate-pulse w-full"></div>
                                        ))}
                                    </div>
                                ) : (
                                    <table className="high-end-table">
                                        <thead>
                                            <tr>
                                                <th className="w-10">STAT</th>
                                                <th>IDENTIFIER</th>
                                                <th>INTENT</th>
                                                <th>VALUE</th>
                                                <th>FEE (GWEI)</th>
                                                <th>ETA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence initial={false} mode="popLayout">
                                                {filteredTx.map((tx) => {
                                                    const intent = getIntentLabel(tx);
                                                    return (
                                                        <motion.tr
                                                            key={tx.id}
                                                            layout
                                                            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            transition={{ duration: 0.4 }}
                                                            onClick={() => handleHashClick(tx)}
                                                            className={`tx-row-intel ${selectedTx?.id === tx.id ? 'active' : ''} ${intent.label === 'Whale' ? 'whale-glow' : ''}`}
                                                        >
                                                            <td>
                                                                <div className={`status-icon-glow ${intent.label === 'Whale' ? 'rose' : 'indigo'}`}>
                                                                    {intent.label === 'Whale' ? <ScanLine size={12} /> : <Zap size={12} />}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center gap-2 group">
                                                                    <span className="mono text-[10px] text-white/60">{tx.id.slice(0, 14)}...</span>
                                                                    <ExternalLink size={10} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`intent-tag ${intent.color} ${intent.bg}`}>
                                                                    {intent.label}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="font-bold text-white text-[11px] mono">{Number(tx.valueEth).toFixed(4)} ETH</span>
                                                            </td>
                                                            <td>
                                                                <span className="mono text-[10px] font-black text-slate-400">{stats.avgGas}</span>
                                                            </td>
                                                            <td>
                                                                <span className="text-[10px] font-medium opacity-50 uppercase">Next Block</span>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* FORENSIC SIDE PANEL */}
                        <AnimatePresence>
                            {selectedTx && (
                                <motion.aside
                                    initial={{ opacity: 0, x: 400 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 400 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="forensic-panel border-l border-white/5"
                                >
                                    <div className="forensic-header">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <Fingerprint size={16} className="text-indigo-400" />
                                                <h3 className="text-xs font-black uppercase text-white tracking-widest">Forensic Node Analysis</h3>
                                            </div>
                                            <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="tx-identity-card p-4 bg-black/40 border border-white/5 rounded-xl mb-8">
                                            <div className="text-[9px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                                <Globe size={10} /> Origin Address
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                    <Activity size={14} className="text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="mono text-[11px] text-white break-all leading-relaxed">{resolvedFrom || selectedTx.from}</div>
                                                    {resolvedFrom && resolvedFrom !== selectedTx.from && (
                                                        <div className="text-[8px] text-indigo-400/60 font-black mt-1 uppercase tracking-widest">ENS_LABEL_RESOLVED</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="forensic-scroll-body custom-scrollbar">
                                        {/* RISK ASSESSMENT */}
                                        <div className="forensic-section mb-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compliance Risk Level</span>
                                                <div 
                                                    className="risk-badge-official" 
                                                    style={{ 
                                                        color: isLoadingDetails ? '#94a3b8' : riskInfo?.level?.color,
                                                        borderColor: isLoadingDetails ? '#334155' : `${riskInfo?.level?.color}44`,
                                                        background: isLoadingDetails ? '#1e293b' : `${riskInfo?.level?.color}11`
                                                    }}
                                                >
                                                    {isLoadingDetails ? 'FORENSIC SCAN...' : riskInfo?.level?.label}
                                                </div>
                                            </div>
                                            <div className="risk-meter-container h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                                                <motion.div
                                                    className="h-full"
                                                    style={{ backgroundColor: riskInfo?.level?.color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: isLoadingDetails ? "30%" : `${riskInfo?.score || 0}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>

                                            <div className="aml-patterns-detected">
                                                <div className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest">AML Indicators Detected:</div>
                                                <div className="space-y-2">
                                                    {isLoadingDetails ? (
                                                        <div className="animate-pulse text-[10px] text-slate-600">Cross-referencing global sanctions lists...</div>
                                                    ) : (
                                                        <>
                                                            {riskInfo?.flags?.length > 0 ? riskInfo.flags.map((flag, f) => (
                                                                <div key={f} className="aml-tag-alert">
                                                                    <AlertTriangle size={10} className="text-rose-500" />
                                                                    <span>{flag}</span>
                                                                </div>
                                                            )) : (
                                                                <div className="aml-tag-safe">
                                                                    <CheckCircle2 size={10} className="text-emerald-500" />
                                                                    <span>No Immediate AML Patterns Identified</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SIMULATION (PRE-EXECUTION) */}
                                        <div className="forensic-section mb-8">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 underline decoration-white/10 underline-offset-8">Pre-Execution Simulation</div>
                                            <div className="simulation-preview p-5 bg-white/5 border border-white/5 rounded-xl">
                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="text-center">
                                                        <div className="text-[9px] opacity-30 mb-1 uppercase font-bold">Vault State</div>
                                                        <div className="mono text-sm text-white font-black">{selectedTx.valueEth} ETH</div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <motion.div
                                                            animate={{ x: [0, 5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            <ArrowRight size={16} className="text-indigo-400" />
                                                        </motion.div>
                                                        <span className="text-[8px] opacity-20 font-black">-CONFIRMING-</span>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-[9px] opacity-30 mb-1 uppercase font-bold">Delta Forecast</div>
                                                        <div className="mono text-sm text-emerald-400 font-black">
                                                            USD ${gasSimulation?.usdValue || '0.00'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="simulation-details space-y-3">
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="opacity-40 font-bold uppercase">Network Fee</span>
                                                        <span className="font-black text-indigo-300">{gasSimulation?.ethValue || '0.0000'} ETH</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="opacity-40 font-bold uppercase">Gas Limit</span>
                                                        <span className="font-black text-slate-300">{gasSimulation?.gasUsed || '21,000'} UNITS</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="opacity-40 font-bold uppercase">Price Priority</span>
                                                        <span className="font-black text-amber-500">{gasSimulation?.gasPriceGwei || '0'} GWEI</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RAW PAYLOAD */}
                                        <div className="forensic-section mb-6">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 underline decoration-white/10 underline-offset-8 font-black">Raw Bytecode Payload</div>
                                            <div
                                                className="raw-vessel p-5 bg-black/80 rounded-xl font-mono text-[10px] leading-relaxed break-all border border-white/5 text-indigo-400/80 max-h-40 overflow-y-auto custom-scrollbar cursor-help"
                                                title={formatIntelligence(selectedTx.input)}
                                            >
                                                <div className="mb-2 text-indigo-400 font-black flex items-center gap-2 border-b border-white/5 pb-2">
                                                    <ScanLine size={12} /> DECODED: {formatIntelligence(selectedTx.input)}
                                                </div>
                                                <span className="text-emerald-500 font-bold">0x</span>{selectedTx.input || 'None'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="forensic-footer mt-auto pt-8 border-t border-white/5">
                                        <button 
                                            onClick={handleFullTrace}
                                            className="full-trace-btn w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                        >
                                            Initiate Full Forensic Trace
                                        </button>
                                    </div>
                                </motion.aside>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>

            {/* SYSTEM FOOTER */}
            <footer className="h-8 bg-black/40 border-t border-white/5 flex items-center px-6 justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div> SYNC_STATUS: CRYPTO_UPLINK_ACTIVE</span>
                    <span>ENCRYPTION: AES-256-GCM</span>
                </div>
                <div className="flex gap-4">
                    <span>OS_VERSION: 2.0.4-CRYPTO</span>
                    <span>AUTH: SESSION_TERMINAL_ROOT</span>
                </div>
            </footer>
        </div >
    );
};

export default MempoolHub;
