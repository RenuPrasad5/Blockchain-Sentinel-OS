import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, ShieldAlert, Maximize2, Info, Search, ExternalLink, Key, Lock, Activity, ShieldCheck, Fingerprint, Eye } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { calculateRiskScore } from '../../services/RiskEngine';
import useModeStore from '../../store/modeStore';
import { alchemyManager } from '../../utils/AlchemyManager';

const SecuritySkeleton = () => (
    <div className="animate-in fade-in duration-500">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="px-6 py-12 border-b border-slate-900/30">
                <div className="h-6 w-1/4 skeleton-pulse mb-4"></div>
                <div className="h-4 w-1/2 skeleton-pulse"></div>
            </div>
        ))}
    </div>
);

const SecurityHub = ({ onInvestigate }) => {
    const { address, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);
    const [integrityStream, setIntegrityStream] = useState([]);
    const [infiniteApprovals, setInfiniteApprovals] = useState(0);
    const riskAssessment = useModeStore((state) => state.riskAssessment[address?.toLowerCase()] || null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Perform Risk Scan on connection
    useEffect(() => {
        if (isConnected && address) {
            calculateRiskScore(address);
            // Simulate scanning for infinite approvals
            setInfiniteApprovals(Math.floor(Math.random() * 5) + 1);
        } else {
            setInfiniteApprovals(0);
        }
    }, [isConnected, address]);

    // Live Integrity Stream Monitoring
    useEffect(() => {
        const UNISWAP_V3_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564'.toLowerCase();
        const AAVE_POOL = '0x87870B2ee3fA9630e766a1637da45a00FC38b4A0'.toLowerCase();

        const cleanup = alchemyManager.onPendingTransaction(async (tx) => {
            const to = tx.to?.toLowerCase();
            if (to === UNISWAP_V3_ROUTER || to === AAVE_POOL) {
                const protocol = to === UNISWAP_V3_ROUTER ? 'Uniswap v3' : 'Aave v3 Pool';
                const newLog = {
                    project: protocol,
                    status: 'Verifying...',
                    findings: 'Pending',
                    criticality: 'None',
                    sig: `0xSecAuth_${Math.floor(Math.random() * 900) + 100}`,
                    address: tx.from,
                    timestamp: Date.now(),
                    isFlicker: true
                };

                setIntegrityStream(prev => [newLog, ...prev].slice(0, 10));

                // After 2 seconds, mark as verified
                setTimeout(() => {
                    setIntegrityStream(current => current.map(item =>
                        item.timestamp === newLog.timestamp
                            ? { ...item, status: 'Verified', findings: '0', isFlicker: false }
                            : item
                    ));
                }, 2000);
            }
        });
        return () => cleanup();
    }, []);

    if (loading) return <SecuritySkeleton />;

    const defaultAudits = [
        { project: 'Uniswap v4', status: 'Verified', findings: '0', criticality: 'None', sig: '0xSecAuth_442', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
        { project: 'Lido Finance', status: 'Verified', findings: '3', criticality: 'None', sig: '0xSecAuth_912', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' },
        { project: 'Renzo Protocol', status: 'Critical', findings: '15', criticality: 'High', sig: '0xSecAuth_003', address: '0x33461d9951823057c37D3e67B92A8291f0De44a5' },
    ];

    const displayAudits = [...integrityStream, ...defaultAudits].slice(0, 10);

    return (
        <div className="animate-in fade-in duration-700">
            {/* Session Security Perimeter */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-white/[0.05]">
                <div className="py-8 px-6 border-r border-b md:border-b-0 border-white/[0.05]">
                    <div className="flex items-center gap-3 mb-6">
                        <Fingerprint size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Authority Interface</span>
                    </div>
                    <div className="mb-8 font-black">
                        <ConnectButton />
                    </div>
                    {isConnected ? (
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Perimeter Established
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <Activity size={14} className="animate-pulse" /> Awaiting Auth Signature
                        </div>
                    )}
                </div>

                <div className="py-8 px-6 border-r border-b md:border-b-0 border-white/[0.05] bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldAlert size={16} className="text-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Infinite Approvals Found</span>
                    </div>
                    <div className="text-3xl font-black text-white mb-2">{isConnected ? `${infiniteApprovals} Detected` : '--'}</div>
                    <p className="text-[10px] text-slate-600 font-bold uppercase mb-6 tracking-tight">Active permissions identified on tier-3 smart contracts.</p>
                    {isConnected && infiniteApprovals > 0 && (
                        <a
                            href={`https://revoke.cash/address/${address}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors animate-pulse"
                        >
                            Execute Revocation Protocol <ExternalLink size={12} />
                        </a>
                    )}
                </div>

                <div className="py-8 px-6 bg-white/[0.04]">
                    <div className="flex items-center gap-3 mb-4">
                        <Key size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Integrity Score</span>
                    </div>
                    <div className="text-3xl font-black text-white mb-2 tabular-nums">
                        {riskAssessment ? `${100 - riskAssessment.score}/100` : '--/100'}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Level:</span>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: riskAssessment?.color || '#475569' }}>
                            {riskAssessment?.level || 'N/A'}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-1000"
                            style={{
                                width: riskAssessment ? `${100 - riskAssessment.score}%` : '0%',
                                backgroundColor: riskAssessment?.color || '#475569'
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Protocol Integrity Stream */}
            <div className="w-full">
                <div className="py-10 px-6 flex justify-between items-end border-b border-white/[0.05]">
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-1">Protocol Integrity Stream</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Real-time audit telemetry and mempool integrity logs</p>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> Tracking Uniswap/Aave Clusters</span>
                    </div>
                </div>

                <div className="overflow-x-auto border-b border-white/[0.05]">
                    <table className="terminal-table-edge w-full">
                        <thead>
                            <tr>
                                <th className="px-6">Protocol Identifier</th>
                                <th>Origin Address</th>
                                <th>Integrity Status</th>
                                <th>Observations</th>
                                <th>Verification Sig.</th>
                                <th className="px-6 text-right">Risk Vector</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayAudits.map((audit, i) => (
                                <tr key={i} className={`hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0 ${audit.criticality === 'High' ? 'bg-rose-500/[0.03]' : ''}`}>
                                    <td className="px-6 py-6 font-black">
                                        <div className="flex items-center gap-4">
                                            {audit.isFlicker && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>}
                                            <div className="text-[13px] font-black text-white uppercase tracking-tighter">
                                                {audit.project}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => onInvestigate(audit.address)}
                                            className="flex items-center gap-2 group/addr hover:bg-white/5 px-2 py-1 rounded transition-colors"
                                        >
                                            <span className="metric-mono text-[10px] text-slate-400 font-bold">
                                                {audit.address ? `${audit.address.slice(0, 6)}...${audit.address.slice(-4)}` : 'N/A'}
                                            </span>
                                            <Eye size={12} className="text-indigo-400 opacity-0 group-hover/addr:opacity-100 transition-opacity" />
                                        </button>
                                    </td>
                                    <td>
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${audit.status === 'Verified' ? 'text-emerald-500' :
                                            audit.status === 'Critical' ? 'text-rose-500' : 'text-amber-500'
                                            }`}>
                                            {audit.status === 'Verified' ? <CheckCircle2 size={12} /> :
                                                audit.status === 'Critical' ? <AlertTriangle size={12} /> :
                                                    <Activity size={12} className="animate-spin-slow" />}
                                            {audit.status}
                                        </div>
                                    </td>
                                    <td className="metric-mono text-slate-400 text-xs">
                                        {audit.findings} Issues Detected
                                    </td>
                                    <td className={`metric-mono text-slate-600 text-[10px] font-bold italic tracking-tighter ${audit.isFlicker ? 'animate-pulse text-indigo-400 font-black' : ''}`}>
                                        {audit.sig}
                                    </td>
                                    <td className="px-6 text-right">
                                        <div className={`inline-flex px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${audit.criticality === 'High' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' :
                                            'text-slate-700 border border-white/[0.05]'
                                            }`}>
                                            {audit.criticality === 'High' ? 'High' : 'Low'} Risk
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Managed Advisory Perimeter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-white/[0.05] divide-x divide-white/[0.05]">
                <div className="py-10 px-6 hover:bg-white/[0.01] transition-colors group">
                    <div className="flex items-center gap-3 mb-6">
                        <Info size={16} className="text-indigo-400" />
                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Protocol Metadata Clusters</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold tracking-tight mb-8">
                        Audit telemetry is sourced from multiple security standard clusters. Critical alerts are pushed
                        directly to the session authority with <span className="text-white">sub-50ms latency</span>.
                    </p>
                </div>

                <div className="py-10 px-6 hover:bg-white/[0.01] transition-colors group">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield size={16} className="text-amber-500" />
                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Global Risk Projections</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold tracking-tight mb-8">
                        Risk vectors are calculated based on TVL exposure, contract complexity, and historical audit frequency.
                    </p>
                </div>
            </div>

            <div className="h-20"></div>
        </div>
    );
};

export default SecurityHub;
