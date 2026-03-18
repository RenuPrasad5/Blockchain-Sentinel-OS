import React, { useState, useEffect } from 'react';
import { Calculator, Wallet, AlertTriangle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const TDSLeakagePanel = ({ isRegulatoryMode }) => {
    const [transactions, setTransactions] = useState([
        { id: 1, wallet: '0x7e...2a4', amount: 4500000, type: 'VDA-TRANSFER', exchange: 'WazirX' },
        { id: 2, wallet: '0xbc...f91', amount: 1200000, type: 'P2P-SETTLE', exchange: 'Binance-IN' },
        { id: 3, wallet: '0x12...e88', amount: 850000, type: 'VDA-TRANSFER', exchange: 'CoinDCX' }
    ]);

    const TDS_RATE = 0.01;
    const USD_INR = 84.2;

    const totalVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const estimatedTDS = totalVolume * TDS_RATE;

    const formatINR = (amt) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amt);
    };

    return (
        <div className="tds-leakage-panel h-full flex flex-col p-4 bg-[#0D1117]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isRegulatoryMode ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <Calculator size={20} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">TDS Leakage Monitor</h3>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Section 194S Compliance Engine</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Estimated Tax Impact</div>
                    <div className={`text-xl font-black ${isRegulatoryMode ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {formatINR(estimatedTDS)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="text-[9px] font-black text-slate-600 uppercase mb-1">Total Monitored Volume</div>
                    <div className="text-lg font-black text-white">{formatINR(totalVolume)}</div>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="text-[9px] font-black text-slate-600 uppercase mb-1">Unpaid Liability (Est)</div>
                    <div className={`text-lg font-black ${isRegulatoryMode ? 'text-orange-400' : 'text-rose-400'}`}>
                        {formatINR(estimatedTDS * 0.85)}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                <div className="text-[9px] font-black text-slate-700 uppercase mb-2 tracking-widest px-1">Detected Transaction Flows</div>
                {transactions.map((tx) => (
                    <div key={tx.id} className="p-3 bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center bg-white/5 text-slate-500 group-hover:text-blue-400 transition-colors">
                                <Wallet size={14} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-white uppercase">{tx.wallet}</div>
                                <div className="text-[8px] font-bold text-slate-500 uppercase">{tx.exchange} • {tx.type}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-white">{formatINR(tx.amount)}</div>
                            <div className="text-[8px] font-black text-orange-500 uppercase">1% TDS: {formatINR(tx.amount * 0.01)}</div>
                        </div>
                    </div>
                ))}
            </div>

            {isRegulatoryMode && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center gap-3">
                    <AlertTriangle size={16} className="text-orange-500 shrink-0" />
                    <p className="text-[9px] font-bold text-orange-200 uppercase leading-relaxed">
                        FIU ALERT: Significant TDS leakage detected in P2P channels. Recommend immediate wallet freezing.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TDSLeakagePanel;
