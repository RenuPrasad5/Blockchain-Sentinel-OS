import React, { useState } from 'react';
import { Globe, MapPin, Shield, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const SovereignNodeMap = ({ isRegulatoryMode }) => {
    const nodes = [
        { id: 1, name: 'Mumbai-01', lat: 195, lon: 260, type: 'DOMESTIC', status: 'ACTIVE', provider: 'National Informatics Centre' },
        { id: 2, name: 'Delhi-Secure', lat: 180, lon: 265, type: 'DOMESTIC', status: 'ACTIVE', provider: 'Sovereign Cloud' },
        { id: 3, name: 'Singapore-X', lat: 210, lon: 285, type: 'FOREIGN', status: 'LATENT', provider: 'AWS-SEA' },
        { id: 4, name: 'London-C08', lat: 155, lon: 200, type: 'FOREIGN', status: 'ACTIVE', provider: 'Azure-UK' },
        { id: 5, name: 'Bangalore-Z', lat: 205, lon: 262, type: 'DOMESTIC', status: 'ACTIVE', provider: 'MeitY-Net' }
    ];

    const domesticCount = nodes.filter(n => n.type === 'DOMESTIC').length;
    const sovereigntyScore = Math.floor((domesticCount / nodes.length) * 100);

    return (
        <div className="sovereign-node-map h-full flex flex-col p-6 bg-[#0D1117] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isRegulatoryMode ? 'bg-orange-500/10 text-orange-500' : 'bg-[#00ce46]/10 text-[#00ce46]'}`}>
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Sovereign Infrastructure Monitor</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Geographic Validator Distribution</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 uppercase">Sovereignty Score</div>
                        <div className="text-2xl font-black text-[#00ce46]">{sovereigntyScore}<span className="text-xs text-slate-600">%</span></div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 uppercase">Domestic Nodes</div>
                        <div className="text-2xl font-black text-white">{domesticCount}</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
                {/* Simplified World Map SVG */}
                <svg viewBox="0 0 500 300" className="w-full h-full opacity-30">
                    <path fill="currentColor" className="text-slate-700" d="M100,50 Q150,20 200,50 T300,50 T400,80 T450,150 T400,250 T300,280 T200,250 T100,200 Z" />
                    <path fill="currentColor" className="text-slate-600" d="M240,160 L280,160 L285,220 L245,220 Z" /> {/* Simplified India Shape */}
                </svg>

                {/* Node Markers */}
                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute cursor-help group"
                        style={{ top: `${node.lat}px`, left: `${node.lon}px` }}
                    >
                        <div className={`relative flex items-center justify-center`}>
                            <div className={`absolute w-12 h-12 rounded-full animate-ping opacity-20 ${node.type === 'DOMESTIC' ? 'bg-[#00ce46]' : 'bg-blue-500'}`}></div>
                            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${node.type === 'DOMESTIC' ? 'bg-[#00ce46]' : 'bg-blue-500'}`}></div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-[#161B22] border border-white/10 p-3 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                            <div className="text-[10px] font-black text-white uppercase mb-1">{node.name}</div>
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase mb-2">
                                <span className="text-slate-500">Provider</span>
                                <span className="text-white">{node.provider}</span>
                            </div>
                            <div className={`text-[8px] font-black uppercase text-center py-1 rounded ${node.type === 'DOMESTIC' ? 'bg-[#00ce46]/20 text-[#00ce46]' : 'bg-blue-500/20 text-blue-500'}`}>
                                {node.type} ASSET
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-[#0D1117]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#00ce46]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Domestic Indian Nodes</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Foreign Assets</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Shield size={12} className="text-[#00ce46]" />
                    Sovereign Protocol Verified (Ver. 91.2)
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={12} />
                    Latency Threshold: {"<"} 12ms (Target: 8ms)
                </div>
            </div>
        </div>
    );
};

export default SovereignNodeMap;
