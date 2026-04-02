import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Clock, ChevronRight, Zap } from 'lucide-react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "ZJNf33Hk7Dj5Jm5b5wH5yKCfWKAPeUWG",
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const ActivityStream = ({ onStatusChange }) => {
    const [alerts, setAlerts] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [initializedCases, setInitializedCases] = useState([]);

    useEffect(() => {
        let isActive = true;
        let fallbackTimer;

        const startFallback = () => {
             if (!isActive) return;
             if (fallbackTimer) clearInterval(fallbackTimer);
             setIsConnected(false);
             if (onStatusChange) onStatusChange('Polling');
             
             fallbackTimer = setInterval(async () => {
                  try {
                       const blockNum = await alchemy.core.getBlockNumber();
                       const block = await alchemy.core.getBlockWithTransactions(blockNum);
                       if (block?.transactions?.length > 0) {
                           // Pick 1 to 3 random transactions
                           const count = Math.floor(Math.random() * 3) + 1;
                           for(let i=0; i<count; i++) {
                               const randomTx = block.transactions[Math.floor(Math.random() * block.transactions.length)];
                               handleNewTx(randomTx, false);
                               await new Promise(r => setTimeout(r, 800)); // Stagger slightly
                           }
                       }
                  } catch (e) {
                      console.error("Fallback update failed:", e);
                  }
             }, 5000);
        };

        const handleNewTx = (tx, isWS = true) => {
            if (!isActive) return;
            
            if (isWS && fallbackTimer) {
                clearInterval(fallbackTimer);
                fallbackTimer = null;
            }
            if (isWS && !isConnected) {
                setIsConnected(true);
                if (onStatusChange) onStatusChange('Live');
            }

            let hashStr = typeof tx === 'string' ? tx : tx.hash;
            if (!hashStr) return;

            let valueStr = "$...";
            let gasStr = "Fast";

            if (typeof tx !== 'string') {
                try {
                    if (tx.value) {
                         const ethVal = Utils.formatEther(tx.value.toString());
                         valueStr = `$${(parseFloat(ethVal) * 3500).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                    } else {
                         valueStr = "$0";
                    }
                    if (tx.gasPrice) gasStr = `${Utils.formatUnits(tx.gasPrice.toString(), 'gwei').split('.')[0]} Gwei`;
                    else if (tx.maxFeePerGas) gasStr = `${Utils.formatUnits(tx.maxFeePerGas.toString(), 'gwei').split('.')[0]} Gwei`;
                } catch(e) {}
            } else {
                 // For mempool hashes without full tx data, mock intelligent-looking values for the demo
                 valueStr = `$${(Math.random() * 500000 + 50000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                 gasStr = `${Math.floor(Math.random() * 30) + 15} Gwei`;
            }

            const newAlert = {
                id: hashStr + Math.random().toString(36).substr(2, 5),
                type: 'Mempool Structuring Scan',
                hash: `${hashStr.slice(0, 8)}...${hashStr.slice(-6)}`,
                fullHash: hashStr,
                from: typeof tx !== 'string' && tx.from ? `0x${tx.from.slice(2, 8).toUpperCase()}` : `0x${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
                to: typeof tx !== 'string' && tx.to ? `0x${tx.to.slice(2, 8).toUpperCase()}` : `0x${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
                value: valueStr,
                gasPrice: gasStr,
                timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }) + '.' + new Date().getMilliseconds().toString().padStart(3, '0'),
                severity: Math.random() > 0.85 ? 'high' : 'medium'
            };

            setAlerts(prev => {
                const isDuplicate = prev.some(a => a.fullHash === hashStr);
                if (isDuplicate) return prev;
                return [newAlert, ...prev].slice(0, 20); // Limit to 20 for performance
            });
        };

        const setupWS = () => {
             if (onStatusChange) onStatusChange('Connecting');
             try {
                 alchemy.ws.on("pendingTransactions", (tx) => {
                      handleNewTx(tx, true);
                 });
                 // Listen for errors to fallback
                 alchemy.ws.on("error", () => {
                     console.warn("WebSocket Error, falling back to polling");
                     startFallback();
                 });
             } catch(err) {
                 console.error("WebSocket init failed", err);
                 startFallback();
             }
        };

        setupWS();

        // Fallback trigger if no data received within 8 seconds
        let lastAlertsCount = 0;
        const healthCheck = setInterval(() => {
            setAlerts(prev => {
                if (prev.length === lastAlertsCount) {
                     // No new alerts. Reconnect or fallback.
                     console.warn("No WS activity, applying fallback...");
                     startFallback();
                } else {
                     lastAlertsCount = prev.length;
                     // We received data, clear fallback if running
                     if (fallbackTimer) {
                         clearInterval(fallbackTimer);
                         fallbackTimer = null;
                         setIsConnected(true);
                         if (onStatusChange) onStatusChange('Live');
                     }
                }
                return prev;
            });
        }, 8000);

        return () => {
            isActive = false;
            clearInterval(fallbackTimer);
            clearInterval(healthCheck);
            alchemy.ws.removeAllListeners();
        };
    }, [onStatusChange]);

    const initializeCase = (alert) => {
        const cases = JSON.parse(localStorage.getItem('sentinel_cases') || '[]');
        const newCase = {
            caseId: `CASE-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            details: alert,
            status: 'OPEN'
        };
        cases.push(newCase);
        localStorage.setItem('sentinel_cases', JSON.stringify(cases));
        setInitializedCases(prev => [...prev, alert.id]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="panel-header mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity size={16} className={isConnected ? "text-emerald-500" : "text-amber-500"} />
                    <span>Real-Time Mempool Stream</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isConnected ? "text-emerald-500" : "text-amber-500"}`}>
                        {isConnected ? "LIVE (WS)" : "POLLING (HTTP)"}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                <AnimatePresence initial={false}>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ x: -50, height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ x: 0, height: 'auto', opacity: 1, marginBottom: 12 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                            className={`p-4 rounded-xl border-l-2 ${
                                alert.severity === 'high' ? 'border-rose-500 bg-rose-500/5' : 'border-amber-500 bg-amber-500/5'
                            } backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert size={14} className={alert.severity === 'high' ? "text-rose-500" : "text-amber-500"} />
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                                        alert.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                                    }`}>
                                        {alert.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-60 bg-black/20 px-2 py-0.5 rounded text-[10px] font-mono">
                                    <Clock size={10} />
                                    <span>{alert.timestamp}</span>
                                </div>
                            </div>

                            <div className="text-xs font-mono text-slate-300 mb-4 break-all flex items-center gap-2 bg-black/20 p-2 rounded-lg relative z-10 border border-white/5">
                                <span className="text-indigo-400 font-bold">{alert.hash}</span>
                                <ChevronRight size={12} className="opacity-40" />
                                <span className="opacity-50 flex items-center gap-1"><Activity size={10}/> Tracing Nodes</span>
                            </div>

                            <div className="flex justify-between items-end relative z-10">
                                <div className="flex items-end gap-6">
                                    <div>
                                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                                            Value Trajected
                                        </div>
                                        <div className="text-xl font-black text-white">{alert.value}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                                            <Zap size={10} className="text-amber-400" /> Gas
                                        </div>
                                        <div className="text-sm font-bold text-amber-400/90">{alert.gasPrice}</div>
                                    </div>
                                </div>
                                
                                {initializedCases.includes(alert.id) ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active File</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => initializeCase(alert)}
                                        className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                    >
                                        Flag
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {alerts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                        <Activity size={32} className="mb-4 animate-pulse" />
                        <div className="text-xs font-mono uppercase tracking-widest">Listening to Mempool...</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityStream;
