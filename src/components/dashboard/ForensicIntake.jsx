import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, Shield, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForensicIntake = ({ isRegulatoryMode }) => {
    const [address, setAddress] = useState('');
    const [riskResult, setRiskResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleAudit = (e) => {
        e.preventDefault();
        if (!address) return;

        setIsScanning(true);
        // Simulate AML lookup
        setTimeout(() => {
            const risks = ['Low', 'Medium', 'High'];
            const randomRisk = risks[Math.floor(Math.random() * risks.length)];
            setRiskResult({
                level: randomRisk,
                score: randomRisk === 'Low' ? 12 : randomRisk === 'Medium' ? 45 : 88,
                timestamp: new Date().toISOString(),
                checks: [
                    { name: 'Sanction List', status: 'PASS' },
                    { name: 'Mixer Interaction', status: randomRisk === 'High' ? 'FAIL' : 'PASS' },
                    { name: 'Exchange Known Wallet', status: 'DETECTED' }
                ]
            });
            setIsScanning(false);
        }, 1500);
    };

    return (
        <div className="forensic-intake-module h-full flex flex-col">
            <div className="search-cluster mb-6">
                <form onSubmit={handleAudit} className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="ENTER WALLET ADDRESS FOR AML AUDIT..."
                        className="w-full bg-[#0D1117] border border-white/10 py-4 pl-12 pr-4 rounded-lg text-xs font-mono text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all"
                    >
                        Audit
                    </button>
                </form>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div 
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4 py-10"
                        >
                            <div className="relative">
                                <Activity size={48} className="text-blue-500" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Running Multi-Vector AML Scan...</span>
                        </motion.div>
                    ) : riskResult ? (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="risk-gauge-system"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${riskResult.level === 'Low' ? 'bg-emerald-500/10 text-emerald-500' : riskResult.level === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {riskResult.level === 'Low' ? <ShieldCheck size={24} /> : riskResult.level === 'Medium' ? <Shield size={24} /> : <ShieldAlert size={24} />}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AML RISK LEVEL</div>
                                        <div className={`text-xl font-black uppercase ${riskResult.level === 'Low' ? 'text-emerald-500' : riskResult.level === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>
                                            {riskResult.level} SEVERITY
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-500 uppercase">Risk Score</div>
                                    <div className="text-2xl font-black text-white">{riskResult.score}<span className="text-xs text-slate-600">/100</span></div>
                                </div>
                            </div>

                            <div className="risk-bar-container h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${riskResult.score}%` }}
                                    className={`h-full ${riskResult.level === 'Low' ? 'bg-emerald-500' : riskResult.level === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}`}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {riskResult.checks.map((check, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{check.name}</span>
                                        <span className={`text-[10px] font-black uppercase ${check.status === 'FAIL' ? 'text-rose-500' : 'text-emerald-500'}`}>{check.status}</span>
                                    </div>
                                ))}
                                {isRegulatoryMode && (
                                    <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert size={12} className="text-orange-500" />
                                            <span className="text-[10px] font-black text-orange-200 uppercase">PMLA Compliance</span>
                                        </div>
                                        <span className="text-[9px] font-black text-white px-2 py-0.5 bg-orange-600 rounded">FLAGGED {">"}10K</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30">
                            <Shield size={48} className="text-slate-700 mb-4" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting Forensic Input...</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ForensicIntake;
