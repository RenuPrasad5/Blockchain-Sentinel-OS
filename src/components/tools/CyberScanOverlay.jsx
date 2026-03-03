import React from 'react';
import { Zap } from 'lucide-react';

const CyberScanOverlay = () => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Pulsing Scan Circles */}
            <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border border-indigo-400/20 rounded-full animate-ping [animation-delay:200ms]"></div>

            {/* Scanning Line */}
            <div className="absolute inset-0 overflow-hidden rounded-full border border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400/50 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
            </div>

            <div className="text-center z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap size={20} className="text-indigo-400 animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Intelligence Bridge</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mapping Relationship Clusters...</div>
            </div>
        </div>
    </div>
);

export default CyberScanOverlay;
