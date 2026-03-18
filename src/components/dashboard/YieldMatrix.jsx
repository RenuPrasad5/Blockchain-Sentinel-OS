import React from 'react';
import { TrendingUp, Shield, Droplets, ArrowUpRight } from 'lucide-react';

const YieldMatrix = ({ isRegulatoryMode }) => {
    const protocols = [
        { name: 'Aave V3', asset: 'USDC', tvl: '2.4B', yield: '4.2%', score: 98, audit: 'Tier-1 Secured' },
        { name: 'Compound', asset: 'ETH', tvl: '1.8B', yield: '3.1%', score: 95, audit: 'CertiK Audited' },
        { name: 'Lido', asset: 'stETH', tvl: '14.2B', yield: '3.8%', score: 92, audit: 'Tier-1 Secured' },
        { name: 'MakerDAO', asset: 'DAI', tvl: '8.4B', yield: '5.0%', score: 96, audit: 'CertiK Audited' },
        { name: 'Rocket Pool', asset: 'rETH', tvl: '3.2B', yield: '3.4%', score: 89, audit: 'OpenZeppelin' }
    ];

    return (
        <div className="yield-matrix-module">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</th>
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Liquidity Depth</th>
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Yield (Net)</th>
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Governance & Audit</th>
                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Security Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {protocols.map((p, i) => (
                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                            <Shield size={16} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-white uppercase">{p.name}</div>
                                            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{p.asset} Pool</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-mono font-bold text-white">${p.tvl}</span>
                                        <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase">
                                            <Droplets size={8} /> Institutional-Grade
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <span className="text-xs font-black text-emerald-500">{p.yield}</span>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                        <span className="text-[9px] font-black text-blue-400 uppercase">{p.audit}</span>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${p.score}%` }}></div>
                                        </div>
                                        <span className="text-xs font-black text-white">{p.score}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    Live Data Feed: Institutional Cluster S12
                </p>
                <button className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    Full Matrix Analysis <ArrowUpRight size={12} />
                </button>
            </div>
        </div>
    );
};

export default YieldMatrix;
