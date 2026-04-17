import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Eye, 
    Code, 
    X, 
    ArrowRight,
    Terminal,
    Sparkles
} from 'lucide-react';

const OnboardingOverlay = ({ isOpen, onClose, onAction }) => {
    const objectives = [
        {
            id: 'trace',
            title: 'Trace a Wallet',
            desc: 'Track fund flows and identify entity ownership.',
            icon: <Search className="text-blue-400" size={28} />,
            color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
            glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
        },
        {
            id: 'monitor',
            title: 'Monitor an Asset',
            desc: 'Get real-time alerts on suspicious liquidity movements.',
            icon: <Eye className="text-emerald-400" size={28} />,
            color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
            glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'
        },
        {
            id: 'analyze',
            title: 'Analyze Contract',
            desc: 'Detect flash-loans, exploits, and bridge anomalies.',
            icon: <Code className="text-purple-400" size={28} />,
            color: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
            glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#050505]/98 backdrop-blur-2xl p-6 overflow-hidden"
                >
                    {/* Background Intelligence Grid Decoration */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="absolute top-10 right-10 text-slate-600 hover:text-white hover:rotate-90 transition-all duration-300"
                    >
                        <X size={40} strokeWidth={1.5} />
                    </button>

                    <div className="max-w-6xl w-full relative">
                        <motion.div 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="text-center mb-16"
                        >
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">System Initialization</span>
                                <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-tight">
                                Welcome to <span className="bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent italic">Sentinel-OS</span> Intelligence
                            </h1>
                            
                            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                                The blockchain is noisy. <span className="text-white font-bold">We make it clear.</span><br />
                                What is your objective today?
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {objectives.map((obj, idx) => (
                                <motion.div
                                    key={obj.id}
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 + (idx * 0.15), ease: "circOut" }}
                                    whileHover={{ y: -10 }}
                                    onClick={() => onAction(obj.id)}
                                    className={`relative cursor-pointer group rounded-[2.5rem] border ${obj.color} p-10 bg-gradient-to-br transition-all duration-500 overflow-hidden ${obj.glow}`}
                                >
                                    {/* Glass Highlight */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="mb-10 w-20 h-20 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-black/60 transition-all duration-500">
                                            {obj.icon}
                                        </div>
                                        
                                        <h3 className="text-2xl font-black mb-4 text-white group-hover:translate-x-1 transition-transform">
                                            {obj.title}
                                        </h3>
                                        
                                        <p className="text-slate-400 text-base leading-relaxed mb-10 group-hover:text-slate-300 transition-colors">
                                            {obj.desc}
                                        </p>
                                        
                                        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                            Initialize Module <ArrowRight size={16} />
                                        </div>
                                    </div>

                                    {/* Corner Decoration */}
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors"></div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="mt-20 flex flex-col items-center gap-6"
                        >
                            <button 
                                onClick={onClose}
                                className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-14 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-blue-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                <span className="relative z-10 group-hover:text-white transition-colors">Access Direct Terminal</span>
                                <Terminal size={16} className="relative z-10 group-hover:text-white transition-colors" />
                            </button>
                            
                            <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={10} className="text-amber-500" /> Advanced Neural Engine Powered
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingOverlay;
