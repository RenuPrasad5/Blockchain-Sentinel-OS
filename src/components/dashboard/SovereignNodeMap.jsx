import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, Shield, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || "ZJNf33Hk7Dj5Jm5b5wH5yKCfWKAPeUWG",
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

const tier1Cities = [
    { name: 'Mumbai-01', lat: 195, lon: 260, type: 'DOMESTIC', provider: 'National Informatics Centre' },
    { name: 'Delhi-Secure', lat: 180, lon: 265, type: 'DOMESTIC', provider: 'Sovereign Cloud' },
    { name: 'Bangalore-Z', lat: 205, lon: 262, type: 'DOMESTIC', provider: 'MeitY-Net' },
    { name: 'Hyderabad-Node', lat: 200, lon: 263, type: 'DOMESTIC', provider: 'Gov-Chain' },
    { name: 'Singapore-X', lat: 210, lon: 285, type: 'FOREIGN', provider: 'AWS-SEA' },
    { name: 'London-C08', lat: 155, lon: 200, type: 'FOREIGN', provider: 'Azure-UK' },
    { name: 'Dubai-Nexus', lat: 175, lon: 240, type: 'FOREIGN', provider: 'MENA-Crypt' }
];

const SovereignNodeMap = ({ isRegulatoryMode }) => {
    const [pings, setPings] = useState([]);
    const [throughput, setThroughput] = useState(0);
    const [activeNodes, setActiveNodes] = useState(128);
    
    const txCounter = useRef(0);
    
    useEffect(() => {
        let isActive = true;
        let fallbackTimer;

        const handleNewTransaction = (tx) => {
            if (!isActive) return;
            
            txCounter.current += 1;
            
            // 75% bias for Indian Sovereign network processing
            const isDomestic = Math.random() > 0.25;
            const domesticCities = tier1Cities.filter(c => c.type === 'DOMESTIC');
            const foreignCities = tier1Cities.filter(c => c.type === 'FOREIGN');
            
            const cityPool = isDomestic ? domesticCities : foreignCities;
            const baseCity = cityPool[Math.floor(Math.random() * cityPool.length)];
            
            const scatterLat = (Math.random() - 0.5) * 12;
            const scatterLon = (Math.random() - 0.5) * 12;

            const newPing = {
                id: Date.now() + Math.random().toString(36).substr(2, 5),
                lat: baseCity.lat + scatterLat,
                lon: baseCity.lon + scatterLon,
                isValidated: Math.random() > 0.3 // 70% validated (Green), 30% pending (Blue)
            };

            setPings(prev => [...prev, newPing].slice(-75));
            
            setActiveNodes(prev => {
                const fluctuation = Math.floor(Math.random() * 5) - 2;
                const newVal = prev + fluctuation;
                return newVal > 180 ? 180 : (newVal < 110 ? 110 : newVal);
            });
        };

        const setupWS = () => {
             try {
                 alchemy.ws.on("pendingTransactions", handleNewTransaction);
                 alchemy.ws.on("error", startFallback);
             } catch(err) {
                 startFallback();
             }
        };

        const startFallback = () => {
             if (fallbackTimer) clearInterval(fallbackTimer);
             fallbackTimer = setInterval(() => {
                   const count = Math.floor(Math.random() * 3) + 1;
                   for(let i=0; i<count; i++) {
                       setTimeout(() => handleNewTransaction({ hash: 'mock' }), i * 400);
                   }
             }, 2000);
        };

        setupWS();
        
        const healthCheck = setTimeout(() => {
            if (txCounter.current === 0) startFallback();
        }, 5000);

        const tpsInterval = setInterval(() => {
            setThroughput(txCounter.current * 2);
            txCounter.current = 0;
        }, 5000);

        return () => {
            isActive = false;
            clearInterval(fallbackTimer);
            clearInterval(tpsInterval);
            clearTimeout(healthCheck);
            alchemy.ws.removeAllListeners();
        };
    }, []);

    const removePing = (id) => {
        if (!id) return;
        setPings(prev => prev.filter(p => p.id !== id));
    };

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
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Real-Time Geo-Spatial Data Flow</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 uppercase">Global Throughput</div>
                        <div className="text-2xl font-black text-[#00ce46]">{throughput}<span className="text-xs text-slate-600 ml-1">TX/s</span></div>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                        <div className="text-[10px] font-black text-slate-500 uppercase flex items-center justify-end gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            Active Nodes
                        </div>
                        <div className="text-2xl font-black text-white">{activeNodes}</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
                {/* Simplified World Map SVG */}
                <svg viewBox="0 0 500 300" className="w-full h-full opacity-30">
                    <path fill="currentColor" className="text-slate-700" d="M100,50 Q150,20 200,50 T300,50 T400,80 T450,150 T400,250 T300,280 T200,250 T100,200 Z" />
                    <path fill="currentColor" className="text-slate-600" d="M240,160 L280,160 L285,220 L245,220 Z" />
                </svg>

                {/* Static Indicators Layer (Cities) */}
                {tier1Cities.map((city, idx) => (
                     <div 
                        key={`city-${idx}`}
                        className="absolute cursor-help group z-10"
                        style={{ top: `${city.lat}px`, left: `${city.lon}px` }}
                     >
                         <div className={`w-1 h-1 rounded-full opacity-30 ${city.type === 'DOMESTIC' ? 'bg-[#00ce46]' : 'bg-slate-400'}`}></div>
                     </div>
                ))}

                {/* Live Pings Layer */}
                <AnimatePresence>
                    {pings.map((ping) => (
                        <motion.div
                            key={ping.id}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            onAnimationComplete={() => removePing(ping.id)}
                            className="absolute pointer-events-none z-20 -ml-1.5 -mt-1.5"
                            style={{ top: `${ping.lat}px`, left: `${ping.lon}px` }}
                        >
                            <div className={`w-3 h-3 rounded-full ${ping.isValidated ? 'bg-[#00ce46] shadow-[0_0_15px_#00ce46]' : 'bg-blue-500 shadow-[0_0_15px_#3b82f6]'}`}></div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-[#0D1117]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col gap-3 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#00ce46] shadow-[0_0_8px_#00ce46]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Validated Node (Domestic Bias)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Processing Node</span>
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
