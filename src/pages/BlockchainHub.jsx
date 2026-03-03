import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Layers,
    Shield,
    Flame,
    Activity,
    Copy,
    Tag,
    ExternalLink,
    Search,
    Cpu,
    Zap,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { useBlockNumber } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import alchemy from '../utils/AlchemyManager';
import { formatIntelligence, resolveAddress } from '../utils/EthersUtils';
import './BlockchainHub.css';

const BlockchainHub = () => {
    const navigate = useNavigate();
    const { data: wagmiBlockNumber } = useBlockNumber({ watch: true });

    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [blockDetails, setBlockDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [latency, setLatency] = useState(14);
    const [manualSelection, setManualSelection] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetchedBlock, setLastFetchedBlock] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Simulated latency oscillation
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => Math.max(10, Math.min(45, prev + (Math.random() > 0.5 ? 1 : -1))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async (blockNum) => {
        if (!blockNum || blockNum === lastFetchedBlock) return;
        setLastFetchedBlock(blockNum);

        const startTime = performance.now();
        try {
            setError(null);
            const blockPromises = [];
            for (let i = 0; i < 20; i++) {
                blockPromises.push(alchemy.core.getBlock(Number(blockNum) - i));
            }

            const resolvedBlocks = await Promise.all(blockPromises);
            const endTime = performance.now();
            setLatency(Math.round(endTime - startTime));

            const processedBlocks = resolvedBlocks
                .filter(b => b)
                .map(b => ({
                    height: b.number,
                    hash: b.hash,
                    timestamp: b.timestamp,
                    txCount: b.transactions.length,
                    gasUsed: b.gasUsed.toString(),
                    gasLimit: b.gasLimit.toString(),
                    parentHash: b.parentHash,
                    baseFeePerGas: b.baseFeePerGas ? b.baseFeePerGas.toString() : '0',
                    gasPercentage: ((Number(b.gasUsed) / Number(b.gasLimit)) * 100).toFixed(1)
                }));

            if (processedBlocks.length === 0) throw new Error("No data");

            setBlocks(processedBlocks);
            setIsLoading(false);

            if (!manualSelection || !selectedBlock) {
                setSelectedBlock(processedBlocks[0]);
            }
        } catch (err) {
            setError("RPC Sync Failure");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initFetch = async () => {
            try {
                const currentNum = await alchemy.core.getBlockNumber();
                fetchData(currentNum);
            } catch (err) {
                setError("Network Offline");
            }
        };
        initFetch();
        const pollInterval = setInterval(initFetch, 12000);
        return () => clearInterval(pollInterval);
    }, []);

    useEffect(() => {
        if (wagmiBlockNumber) fetchData(Number(wagmiBlockNumber));
    }, [wagmiBlockNumber]);

    useEffect(() => {
        const fetchDeepDetails = async () => {
            if (!selectedBlock) return;
            setIsDetailLoading(true);
            try {
                const fullBlock = await alchemy.core.getBlockWithTransactions(selectedBlock.height);

                const mockEntities = {
                    '0x40130089600f6828453412035306637e6da7ed7a': 'Lido: Execution Layer',
                    '0x388c818ca8b9251b393131c08a736a67ccb19297': 'Rocket Pool: Node',
                    '0x2b5614392419c8f0003b4146a47a7500366eb66a': 'Coinbase: Validator',
                    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2: Router',
                    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V3: Router',
                    '0x00000000006c3852cbef3e08e8df289169ede581': 'OpenSea: Seaport'
                };

                const sortedTxs = fullBlock.transactions
                    .map(tx => ({ ...tx, valueEth: Number(tx.value) / 1e18 }))
                    .sort((a, b) => b.valueEth - a.valueEth)
                    .slice(0, 5);

                const contractTraffic = {};
                fullBlock.transactions.forEach(tx => {
                    if (tx.to) {
                        const to = tx.to.toLowerCase();
                        contractTraffic[to] = (contractTraffic[to] || 0) + 1;
                    }
                });

                const topContracts = Object.entries(contractTraffic)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([addr, count]) => ({
                        address: addr,
                        name: mockEntities[addr] || 'Unknown Contract',
                        calls: count
                    }));

                setBlockDetails({
                    ...selectedBlock,
                    validatorName: mockEntities[fullBlock.miner.toLowerCase()] || 'Independent Node',
                    totalValueTransferred: fullBlock.transactions.reduce((acc, tx) => acc + (Number(tx.value) / 1e18), 0).toFixed(2),
                    burnedFees: (Number(BigInt(selectedBlock.baseFeePerGas) * BigInt(selectedBlock.gasUsed)) / 1e18).toFixed(4),
                    significantTxs: sortedTxs.map(tx => ({
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: tx.valueEth.toFixed(2),
                        tag: mockEntities[tx.to?.toLowerCase()] || mockEntities[tx.from?.toLowerCase()] || null,
                        input: tx.data || tx.input || '0x'
                    })),
                    topContracts
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsDetailLoading(false);
            }
        };
        fetchDeepDetails();
    }, [selectedBlock]);

    const handleSelectBlock = (block) => {
        setManualSelection(true);
        setSelectedBlock(block);
    };

    const copyToClipboard = (text) => navigator.clipboard.writeText(text);

    const formatTimeAgo = (timestamp) => {
        const diff = Math.floor(Date.now() / 1000) - timestamp;
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    const GasGauge = ({ percentage }) => {
        const rotation = (percentage / 100) * 180 - 90;
        const color = percentage > 90 ? '#ef4444' : percentage > 50 ? 'var(--command-amber)' : 'var(--command-emerald)';
        return (
            <div className="gas-gauge">
                <div className="gauge-bg"></div>
                <div className="gauge-fill" style={{ transform: `rotate(${rotation}deg)`, borderColor: color }}></div>
                <div style={{ position: 'absolute', bottom: 5, left: 0, right: 0, textAlign: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{percentage}%</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020617] text-[#94a3b8] font-inter overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 py-8 h-screen flex flex-col">
                <div className="flex-shrink-0 space-y-4 mb-8">
                    <div className="text-[0.7rem] font-bold tracking-widest text-[#94a3b8]">
                        STATUS: {error ? <span className="text-red-500">{error}</span> : <span className="text-[#10b981]">OPERATIONAL</span>}
                    </div>

                    <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search address, .eth, or block..."
                            value={searchTerm}
                            onChange={async (e) => {
                                const val = e.target.value;
                                setSearchTerm(val);
                                if (val.endsWith('.eth')) {
                                    const resolved = await resolveAddress(val);
                                    if (resolved && resolved !== val) setSearchTerm(resolved);
                                }
                            }}
                            className="w-full bg-[#0f172a] border border-[#1e293b] rounded-lg pl-12 pr-12 py-3 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#6366f1] transition-colors"
                        />
                        <code className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.6rem] opacity-50 bg-white/5 px-2 py-1 rounded">⌘K</code>
                    </div>

                    <div className="bg-[#0f172a]/40 border-t border-[#1e293b] py-1.5 overflow-hidden whitespace-nowrap rounded-lg">
                        <div className="ticker-content inline-block pl-full animate-ticker-scroll font-mono text-[0.65rem] text-[#6366f1]">
                            <div className="inline-flex items-center gap-2 mr-12">ETH: <span className="text-white">$2,845.21</span></div>
                            <div className="inline-flex items-center gap-2 mr-12">GAS: <span className="text-[#10b981]">18 Gwei</span></div>
                            {blocks.slice(0, 5).map(b => (
                                <div key={b.hash} className="inline-flex items-center gap-2 mr-12">LATEST_PKT: <span className="opacity-50">{b.hash.slice(0, 16)}...</span></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex gap-6 min-h-0 mb-6">
                    {/* Left Panel: 35% Width */}
                    <aside className="w-[35%] flex flex-col bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-3 border-bottom border-[#1e293b] flex justify-between items-center flex-shrink-0">
                            <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#94a3b8]">NETWORK PULSE</span>
                            <div className={`w-2 h-2 rounded-full ${!error ? 'bg-[#10b981] animate-pulse' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="p-4 border-b border-white/5 animate-pulse">
                                        <div className="w-2/3 h-3 bg-white/5 rounded mb-2"></div>
                                        <div className="w-1/2 h-2 bg-white/5 rounded"></div>
                                    </div>
                                ))
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {blocks.map((block) => (
                                        <motion.div
                                            key={block.height}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/[0.02] ${selectedBlock?.height === block.height ? 'bg-[#6366f1]/10 border-l-4 border-l-[#6366f1]' : ''}`}
                                            onClick={() => handleSelectBlock(block)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-[#627EEA]">
                                                    <Layers size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-black text-white">#{block.height}</span>
                                                        {Number(block.gasPercentage) < 50 ? (
                                                            <span className="text-[0.6rem] px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] font-bold">Safe</span>
                                                        ) : Number(block.gasPercentage) > 90 ? (
                                                            <span className="text-[0.6rem] px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold">Heavy</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="flex justify-between text-[0.65rem] text-[#94a3b8]">
                                                        <span>{formatTimeAgo(block.timestamp)}</span>
                                                        <span className="text-[#10b981] font-bold">{block.txCount} TXS</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </aside>

                    {/* Right Panel: 65% Width */}
                    <main className="w-[65%] min-w-0 flex flex-col pl-6">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {isDetailLoading && !blockDetails ? (
                                <div className="h-full flex flex-col items-center justify-center text-[#6366f1] opacity-50 space-y-4">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 h-full w-1/3 bg-[#6366f1] animate-scanner"></div>
                                    </div>
                                    <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">RECOVERING STATE...</span>
                                </div>
                            ) : blockDetails && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-5xl font-black text-white tracking-tighter mb-2">BLOCK {blockDetails.height}</h2>
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-[#10b981]" />
                                                <span className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-md text-[0.65rem] font-black uppercase tracking-widest">
                                                    Validator: {blockDetails.validatorName}
                                                </span>
                                            </div>
                                        </div>
                                        <GasGauge percentage={blockDetails.gasPercentage} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">🔥 Burnt ETH</div>
                                            <div className="text-xl font-black text-red-500">{blockDetails.burnedFees} ETH</div>
                                        </div>
                                        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">⛽ Base Fee</div>
                                            <div className="text-xl font-black text-white">{Number(blockDetails.baseFeePerGas) / 1e9} Gwei</div>
                                        </div>
                                        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">💎 Value Flow</div>
                                            <div className="text-xl font-black text-[#10b981]">{blockDetails.totalValueTransferred} ETH</div>
                                        </div>
                                        <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">📦 Transactions</div>
                                            <div className="text-xl font-black text-white">{blockDetails.txCount}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <section className="space-y-4">
                                            <h3 className="text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em]">PROTOCOL INTERACTION</h3>
                                            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
                                                <table className="w-full text-left">
                                                    <tbody>
                                                        {blockDetails.topContracts.map(c => (
                                                            <tr key={c.address} className="border-b border-white/5 last:border-0">
                                                                <td className="p-4 text-xs">
                                                                    <div className="flex items-center gap-3">
                                                                        <Tag size={12} className="text-[#6366f1]" />
                                                                        <span className="text-white font-medium">{c.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <span className="text-xs font-black text-white">{c.calls}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h3 className="text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em]">WHALE TRIAGE</h3>
                                            <div className="space-y-3">
                                                {blockDetails.significantTxs.map(tx => (
                                                    <div key={tx.hash} className="bg-[#0f172a] border border-[#1e293b] p-4 rounded-xl flex justify-between items-center group hover:border-[#6366f1]/50 transition-colors">
                                                        <div className="space-y-1">
                                                            <div className="text-xs font-black text-[#10b981]">{tx.value} ETH</div>
                                                            <div className="flex items-center gap-2 text-[0.65rem] text-[#94a3b8]">
                                                                <span>{tx.tag || `${tx.from.slice(0, 10)}...`}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(tx.hash)}
                                                                    className="p-1 hover:bg-white/5 rounded transition-colors"
                                                                >
                                                                    <Copy size={10} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <div className="text-[0.65rem] font-black text-indigo-400 group-hover:block transition-all cursor-help" title={formatIntelligence(tx.input)}>
                                                                {formatIntelligence(tx.input).split(':')[0]}
                                                            </div>
                                                            <ExternalLink size={14} className="text-[#94a3b8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <footer className="fixed bottom-0 left-0 w-full bg-[#0f172a]/80 backdrop-blur-md border-t border-[#1e293b] px-6 py-2 flex justify-between items-center z-50">
                <div className="flex gap-8">
                    <div className="flex items-center gap-2 text-[0.65rem] text-[#94a3b8]">
                        <span>LATENCY:</span>
                        <span className="text-white font-mono">{latency}ms</span>
                    </div>
                    <div className="flex items-center gap-2 text-[0.65rem] text-[#94a3b8]">
                        <span>CONNECTION:</span>
                        <span className={error ? 'text-red-500' : 'text-[#10b981] font-bold'}>{error ? 'FAILURE' : 'STABLE'}</span>
                    </div>
                </div>
                <div className="text-[0.6rem] font-mono opacity-40 uppercase tracking-widest text-white">SECURE_CHANNEL_V4</div>
            </footer>
        </div>
    );
};

export default BlockchainHub;
