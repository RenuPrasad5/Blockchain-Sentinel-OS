import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Link2, 
    Filter, 
    Activity,
    Settings,
    CheckCircle2
} from 'lucide-react';

const DetectionToggle = ({ label, icon: Icon, active, status, onChange }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${active ? 'bg-primary-bright/20' : 'bg-slate-800'} transition-colors`}>
                <Icon size={18} className={active ? 'text-primary-bright' : 'text-slate-500'} />
            </div>
            <div>
                <p className="text-sm font-black text-white">{label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-blue-400' : 'text-slate-600'}`}>
                        {active ? 'Monitoring Active' : 'System Paused'}
                    </span>
                    {status === 'Beta' && (
                        <span className="text-[7px] px-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-black">BETA</span>
                    )}
                </div>
            </div>
        </div>
        <button 
            onClick={onChange}
            className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-slate-700'}`}
        >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`}></div>
        </button>
    </div>
);

const DetectionEngine = () => {
    const [config, setConfig] = useState({
        peeling: true,
        crossChain: true,
        flashLoan: false
    });

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-blue-400 animate-pulse" />
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Detection Logic</h4>
                </div>
                <Settings size={14} className="text-slate-700 cursor-pointer hover:text-white transition-colors" />
            </div>

            <DetectionToggle 
                label="Peeling Chain Detection" 
                icon={Activity} 
                active={config.peeling}
                onChange={() => setConfig({...config, peeling: !config.peeling})}
            />
            
            <DetectionToggle 
                label="Cross-Chain Bridge Tracking" 
                icon={Link2} 
                active={config.crossChain}
                onChange={() => setConfig({...config, crossChain: !config.crossChain})}
            />
            
            <DetectionToggle 
                label="Flash-Loan Anomaly Filter" 
                icon={Filter} 
                status="Beta"
                active={config.flashLoan}
                onChange={() => setConfig({...config, flashLoan: !config.flashLoan})}
            />

            <div className="mt-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                <CheckCircle2 className="text-blue-500" size={16} />
                <p className="text-[10px] text-blue-200/70 font-bold uppercase tracking-tight">
                    All Detection Modules Synced with L1 Consensus
                </p>
            </div>
        </div>
    );
};

export default DetectionEngine;
