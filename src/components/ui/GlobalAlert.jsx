import React from 'react';
import { AlertTriangle, X, ShieldAlert, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useModeStore from '../../store/modeStore';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalAlert = () => {
    const { alerts, removeAlert, setIsScanning } = useModeStore();
    const navigate = useNavigate();

    const handleInvestigate = (address, id) => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            navigate(`/tools/visualizer?address=${address}`);
            removeAlert(id);
        }, 800);
    };

    return (
        <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9 }}
                        className={`pointer-events-auto overflow-hidden bg-slate-950/90 backdrop-blur-xl border rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] ${alert.severity === 'SIREN'
                            ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.3)]'
                            : 'border-rose-500/30'
                            }`}
                    >
                        <div className="relative p-5">
                            {/* Scanning line animation */}
                            <div className={`absolute top-0 left-0 w-full h-[1px] animate-scan ${alert.severity === 'SIREN' ? 'bg-indigo-500/50' : 'bg-rose-500/50'
                                }`}></div>

                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 p-2 rounded-lg border ${alert.severity === 'SIREN'
                                    ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                    }`}>
                                    {alert.severity === 'SIREN' ? <Zap size={20} /> : <ShieldAlert size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${alert.severity === 'SIREN' ? 'text-indigo-400' : 'text-rose-500'
                                            }`}>
                                            {alert.severity === 'SIREN' ? 'Whale Alert' : 'System Threat'}
                                        </span>
                                        <div className={`w-1 h-1 rounded-full animate-pulse ${alert.severity === 'SIREN' ? 'bg-indigo-500' : 'bg-rose-500'
                                            }`}></div>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                                        {alert.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        {alert.message}
                                    </p>

                                    {alert.severity === 'SIREN' && (
                                        <button
                                            onClick={() => handleInvestigate(alert.address, alert.id)}
                                            className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all"
                                        >
                                            INVESTIGATE
                                        </button>
                                    )}

                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-[9px] font-mono text-slate-600 uppercase">
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </span>
                                        <div className="h-px flex-1 bg-white/5"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeAlert(alert.id)}
                                    className="p-1 hover:bg-white/5 rounded transition-colors text-slate-600 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                        {/* Progress bar for auto-dismiss */}
                        <div className="h-0.5 bg-white/5 w-full">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 8, ease: "linear" }}
                                className={`h-full shadow-[0_0_10px_rgba(239,68,68,0.5)] ${alert.severity === 'SIREN' ? 'bg-indigo-500' : 'bg-rose-500'
                                    }`}
                            />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GlobalAlert;
