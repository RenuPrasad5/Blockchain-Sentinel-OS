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
import alchemy, { provider } from '../utils/AlchemyManager';
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
    const [walletIntel, setWalletIntel] = useState(null);
    const [viewMode, setViewMode] = useState('network'); // 'network' or 'wallet'

    const BINANCE_WALLETS = [
        '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
        '0x21a31ee1afc81d97f2dcb58069879744c73bea9f',
        '0x56eddb7aa87536c09ccc2793473599fd21a8b17f'
    ];

    const labelTransaction = (tx) => {
        const to = tx.to?.toLowerCase();
        if (BINANCE_WALLETS.includes(to)) return 'Exchange Deposit (Binance)';
        if (to === '0x7a250d5630b4cf539739df2c5dacb4c659f2488d') return 'Uniswap Interaction';
        if (to === '0x00000000006c3852cbef3e08e8df289169ede581') return 'OpenSea Trade';
        return 'Standard Transfer';
    };

    const fetchWalletIntelligence = async (address) => {
        setIsDetailLoading(true);
        setViewMode('wallet');
        try {
            const [transfers, risk] = await Promise.all([
                alchemy.core.getAssetTransfers({
                    fromAddress: address,
                    category: ['external', 'erc20', 'erc721'],
                    maxCount: 50,
                    order: 'desc'
                }),
                import('../services/RiskEngine').then(m => m.calculateRiskScore(address))
            ]);

            setWalletIntel({
                address,
                risk,
                history: transfers.transfers.map(tx => ({
                    ...tx,
                    label: labelTransaction(tx)
                }))
            });
        } catch (err) {
            console.error('Wallet Intel Retrieval Failed:', err);
            setError("Forensic Node Timeout");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleSearch = async (val) => {
        if (!val) return;
        if (val.startsWith('0x') && val.length === 42) {
            await fetchWalletIntelligence(val);
        } else if (val.endsWith('.eth')) {
            const resolved = await resolveAddress(val);
            if (resolved && resolved.startsWith('0x')) {
                setSearchTerm(resolved);
                await fetchWalletIntelligence(resolved);
            }
        } else if (!isNaN(val)) {
            setViewMode('network');
            const block = await alchemy.core.getBlock(Number(val));
            if (block) handleSelectBlock({
                height: block.number,
                hash: block.hash,
                timestamp: block.timestamp,
                txCount: block.transactions.length,
                gasUsed: block.gasUsed.toString(),
                gasLimit: block.gasLimit.toString()
            });
        }
    };

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
            for (let i = 0; i < 12; i++) {
                blockPromises.push(alchemy.core.getBlock(Number(blockNum) - i).catch(async (err) => {
                    console.warn(`Alchemy Primary Fetch Failed for ${Number(blockNum) - i}:`, err);
                    // Critical Fallback to Ethers Direct Provider (Public Nodes)
                    try {
                        const b = await provider.getBlock(Number(blockNum) - i);
                        if (!b) return null;
                        return {
                            number: b.number,
                            hash: b.hash,
                            timestamp: b.timestamp,
                            transactions: b.transactions,
                            gasUsed: b.gasUsed,
                            gasLimit: b.gasLimit,
                            parentHash: b.parentHash,
                            baseFeePerGas: b.baseFeePerGas
                        };
                    } catch (e) {
                        return null;
                    }
                }));
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
            if (!selectedBlock || viewMode === 'wallet') return;
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
                for (const tx of fullBlock.transactions) {
                    if (tx.to) {
                        const to = tx.to.toLowerCase();
                        contractTraffic[to] = (contractTraffic[to] || 0) + 1;
                    }
                }

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
    }, [selectedBlock, viewMode]);

    const handleSelectBlock = (block) => {
        setManualSelection(true);
        setSelectedBlock(block);
    };

    const copyToClipboard = (text) => navigator.clipboard.writeText(text);

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '...';
        const diff = Math.floor(Date.now() / 1000) - timestamp;
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    const GasGauge = ({ percentage }) => {
        const rotation = (percentage / 100) * 180 - 90;
        const color = percentage > 90 ? '#ef4444' : percentage > 50 ? '#f59e0b' : '#10b981';
        return (
            <div className="gas-gauge">
                <div className="gauge-bg"></div>
                <div className="gauge-fill" style={{ transform: `rotate(${rotation}deg)`, borderColor: color }}></div>
                <div style={{ position: 'absolute', bottom: 5, left: 0, right: 0, textAlign: 'center', fontSize: '0.8rem', fontWeight: 900 }}>{percentage}%</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0D1117] text-[#94a3b8] font-inter overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 py-8 h-screen flex flex-col">
                <div className="flex-shrink-0 space-y-4 mb-8">
                    <div className="text-[0.7rem] font-bold tracking-widest text-[#94a3b8] flex justify-between items-center">
                        <div>STATUS: {error ? <span className="text-red-500">{error}</span> : <span className="text-[#10b981]">OPERATIONAL</span>}</div>
                        {viewMode === 'wallet' && (
                            <button
                                onClick={() => setViewMode('network')}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest text-[0.6rem] font-black"
                            >
                                Back to Network Map
                            </button>
                        )}
                    </div>

                    <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search address, .eth, or block..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                            className="w-full bg-[#161B22] border border-[rgba(255,255,255,0.1)] rounded-lg pl-12 pr-24 py-3 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#6366f1] transition-colors"
                        />
                        <button
                            onClick={() => handleSearch(searchTerm)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#6366f1] text-white px-4 py-1.5 rounded text-[0.6rem] font-black uppercase tracking-widest hover:bg-[#4f46e5] transition-colors"
                        >
                            Analyze
                        </button>
                    </div>


                    <div className="bg-[#161B22]/40 border-t border-[rgba(255,255,255,0.1)] py-1.5 overflow-hidden whitespace-nowrap rounded-lg">
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
                    <aside className="w-[35%] flex flex-col bg-[#161B22] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-3 border-bottom border-[rgba(255,255,255,0.1)] flex justify-between items-center flex-shrink-0">
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
                            {isDetailLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-[#6366f1] opacity-50 space-y-4">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 h-full w-1/3 bg-[#6366f1] animate-scanner"></div>
                                    </div>
                                    <span className="text-[0.7rem] font-black tracking-[0.2em] uppercase">PERFORMING FORENSIC SCAN...</span>
                                </div>
                            ) : viewMode === 'wallet' && walletIntel ? (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-12">
                                    <div className="flex justify-between items-end bg-[#161B22] p-8 border border-[rgba(255,255,255,0.1)] rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent"></div>
                                        <div>
                                            <div className="text-[0.6rem] font-black text-[#6366f1] uppercase tracking-[0.3em] mb-4">TARGET IDENTIFIED</div>
                                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2 font-mono">{walletIntel.address.slice(0, 12)}...{walletIntel.address.slice(-8)}</h2>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/10">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                                    <span className="text-[0.6rem] font-bold text-white uppercase tracking-widest">Active Search active</span>
                                                </div>
                                                <button onClick={() => copyToClipboard(walletIntel.address)} className="text-[#94a3b8] hover:text-white transition-colors">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[0.6rem] font-bold text-[#94a3b8] mb-1">RISK RATING</div>
                                            <div className="text-6xl font-black tabular-nums transition-colors" style={{ color: walletIntel.risk?.color || '#fff' }}>
                                                {walletIntel.risk?.score}/10
                                            </div>
                                            <div className="text-[0.7rem] font-black uppercase tracking-widest px-2 py-0.5 rounded mt-2 inline-block shadow-lg" style={{ backgroundColor: `${walletIntel.risk?.color}22`, color: walletIntel.risk?.color }}>
                                                {walletIntel.risk?.level}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <section className="space-y-4">
                                            <h3 className="text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Activity size={14} className="text-[#6366f1]" />
                                                Behavioral Intelligence
                                            </h3>
                                            <div className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 space-y-4">
                                                {walletIntel.risk?.details.map((detail, idx) => (
                                                    <div key={idx} className="flex items-start gap-4 p-3 bg-white/5 rounded-lg border-l-2 border-[#6366f1]">
                                                        <Shield size={16} className="text-[#6366f1] mt-0.5" />
                                                        <div>
                                                            <div className="text-xs font-black text-white uppercase">{detail}</div>
                                                            <div className="text-[0.6rem] text-[#94a3b8]">Verified via Forensic Engine v4.2</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {walletIntel.risk?.details.length === 0 && (
                                                    <div className="text-[0.65rem] text-[#94a3b8] italic">No immediate red flags detected in primary patterns.</div>
                                                )}
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h3 className="text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <RefreshCw size={14} className="text-indigo-400" />
                                                Transaction Feed (50 Recent)
                                            </h3>
                                            <div className="space-y-3">
                                                {walletIntel.history.map((tx, idx) => (
                                                    <div key={idx} className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] p-4 rounded-xl flex justify-between items-center group hover:bg-white/[0.02] transition-colors border-l-2 border-l-transparent hover:border-l-[#6366f1]">
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/50">
                                                                <ExternalLink size={16} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{tx.label}</div>
                                                                <div className="text-[0.65rem] text-[#94a3b8] font-mono break-all max-w-[200px]">{tx.hash.slice(0, 16)}...</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs font-black text-[#10b981]">{tx.value?.toFixed(4) || '0.00'} {tx.asset}</div>
                                                            <div className="text-[0.6rem] text-[#94a3b8] uppercase">{tx.blockNum || 'Mempool'}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </motion.div>
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
                                        <div className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">ðŸ”¥ Burnt ETH</div>
                                            <div className="text-xl font-black text-red-500">{blockDetails.burnedFees} ETH</div>
                                        </div>
                                        <div className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">â›½ Base Fee</div>
                                            <div className="text-xl font-black text-white">{Number(blockDetails.baseFeePerGas) / 1e9} Gwei</div>
                                        </div>
                                        <div className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">ðŸ’Ž Value Flow</div>
                                            <div className="text-xl font-black text-[#10b981]">{blockDetails.totalValueTransferred} ETH</div>
                                        </div>
                                        <div className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] p-5 rounded-xl w-full">
                                            <div className="text-[0.6rem] font-black text-[#94a3b8] uppercase tracking-widest mb-2">ðŸ“¦ Transactions</div>
                                            <div className="text-xl font-black text-white">{blockDetails.txCount}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <section className="space-y-4">
                                            <h3 className="text-[0.7rem] font-black text-[#94a3b8] uppercase tracking-[0.2em]">PROTOCOL INTERACTION</h3>
                                            <div className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden">
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
                                                    <div key={tx.hash} className="bg-[#161B22] border border-[rgba(255,255,255,0.1)] p-4 rounded-xl flex justify-between items-center group hover:border-[#6366f1]/50 transition-colors">
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

            <footer className="fixed bottom-0 left-0 w-full bg-[#161B22]/80 backdrop-blur-md border-t border-[rgba(255,255,255,0.1)] px-6 py-2 flex justify-between items-center z-50">
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

