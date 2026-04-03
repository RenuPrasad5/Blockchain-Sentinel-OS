import React, { useRef, useState, useEffect } from 'react';
import './RoadmapSection.css';
import logo from '../assets/BL.logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const LiveOpsMonitor = ({ isProcessing }) => {
    const [logs, setLogs] = useState([
        '[INF] INITIALIZING SENTINEL NODE SCAN...',
        '[INF] GATEWAY VERIFIED: OS-V2 PROTOCOL',
        '[DET] LIQUIDITY ANOMALY: 0x48a...4b2',
        '[INF] MAPPING WALLET RELATIONSHIPS...',
        '[DET] POTENTIAL STRUCTURING: 12.45 ETH',
        '[INF] EXPORTING FORENSIC CACHE...',
        '[DET] HIGH RISK HUB DETECTED: 0xf12...e90',
        '[ACK] NODE VERIFIED: US-EAST-1',
        '[INF] SYNCING MULTI-CHAIN DATA...'
    ]);

    return (
        <div className="w-full bg-blue-500/5 backdrop-blur-sm border-y border-blue-500/10 py-1 overflow-hidden pointer-events-none relative">
            <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ 
                    duration: isProcessing ? 5 : 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
                className="flex gap-12 whitespace-nowrap px-4"
            >
                {[...logs, ...logs].map((log, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></span>
                        <span className="font-mono text-[10px] text-blue-400/80 tracking-widest uppercase">
                            {log}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#020617] border border-blue-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                >
                    <div className="p-6 border-b border-blue-500/20 flex justify-between items-center bg-blue-500/5">
                        <h3 className="text-blue-400 font-black tracking-widest uppercase text-sm">{title}</h3>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">CLOSE [X]</button>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const RoadmapSection = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const spotlightRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const roadmapPhases = [
        { 
            phase: '01', 
            status: 'OPERATIONAL', 
            title: "Network Surveillance", 
            desc: "Continuous monitoring of 10,000+ active validator nodes. We track real-time illicit signals and liquidity anomalies across multi-chain ecosystems.",
            cta: "Explore Capability",
            id: 'surveillance'
        },
        { 
            phase: '02', 
            status: 'CORE_SUBSYSTEM', 
            title: "Forensic Mapping", 
            desc: "Advanced automated relationship clustering. Our Neural Engine performs real-time risk scoring using GoPlus and proprietary AML blacklists.",
            cta: "View Live Case Study",
            id: 'forensics'
        },
        { 
            phase: '03', 
            status: 'COMPLIANCE', 
            title: "Regulatory Reporting", 
            desc: "Streamlined intelligence export. Generate court-ready evidence folders and automated TDS compliance reports for institutional oversight.",
            cta: "View Documentation",
            id: 'compliance'
        }
    ];

    return (
        <section className="roadmap-v8-terminal">
            {/* Global Header: Now structured as a full-width header above the split layout */}
            <div className="roadmap-v8-global-header text-center">
                <span className="roadmap-v8-pill">OS_PIPELINE_ENGINE_v4.0</span>
                <h2 className="roadmap-v8-title">
                    Intelligence Operations <svg width="500" height="70" className="inline-block overflow-visible align-top -mt-2">
                        <defs>
                            <linearGradient id="roadmapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <text x="0" y="55" fill="url(#roadmapGrad)" style={{ fontWeight: 900, fontSize: '48px', fontFamily: 'inherit' }}>Framework</text>
                    </svg>
                </h2>
                <p className="roadmap-v8-subtitle mx-auto">
                    A panoramic operational pipeline for continuous multi-chain surveillance and automated forensics.
                </p>
                <div className="mt-12">
                    <LiveOpsMonitor isProcessing={isProcessing} />
                </div>
            </div>

            <div className="w-full px-12 py-20">
                <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
                    {roadmapPhases.map((phase, index) => (
                        <div key={index} className="flex-1 min-w-[300px]">
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="bg-white/5 backdrop-blur-xl border border-blue-500/20 p-8 rounded-2xl h-full flex flex-col items-start hover:border-blue-500/50 transition-all shadow-[0_0_30px_rgba(37,99,235,0.05)]"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[10px] font-black text-blue-500/40 tracking-[0.2em]">0{index + 1}</span>
                                    <span className="w-8 h-[1px] bg-blue-500/20"></span>
                                    <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase bg-emerald-400/10 px-2 py-0.5 rounded">ONLINE</span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">{phase.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                                    {phase.desc}
                                </p>
                                <button 
                                    className="item-cta-btn w-full py-3"
                                    onClick={() => setActiveModal(phase.id)}
                                    onMouseEnter={() => setIsProcessing(true)}
                                    onMouseLeave={() => setIsProcessing(false)}
                                >
                                    {phase.cta}
                                </button>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals for Functional Interaction */}
            <Modal 
                isOpen={activeModal === 'surveillance'} 
                onClose={() => setActiveModal(null)}
                title="Nodal Block Projection"
            >
                            <div className="flex flex-col items-center">
                                <div className="w-full h-32 flex items-center justify-around gap-4 mb-8">
                                    {[0, 1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                                            className="w-12 h-12 bg-blue-500/20 border border-blue-500 rounded flex items-center justify-center text-[10px] text-blue-400"
                                        >
                                            BLOCK_{i}
                                        </motion.div>
                                    ))}
                                </div>
                                <p className="text-slate-400 text-center text-sm leading-relaxed">
                                    Real-time transactional pipeline showing blocks passing through the Sentinel verification layer.
                                </p>
                            </div>
                        </Modal>

                        <Modal 
                            isOpen={activeModal === 'forensics'} 
                            onClose={() => setActiveModal(null)}
                            title="Forensic Graph Preview"
                        >
                            <div className="h-64 relative flex items-center justify-center">
                                <svg width="400" height="200" className="opacity-40">
                                    <line x1="50" y1="100" x2="200" y2="100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                                    <line x1="200" y1="100" x2="350" y2="100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                                    <line x1="200" y1="100" x2="200" y2="20" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                                    <line x1="200" y1="100" x2="200" y2="180" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex gap-12 items-center">
                                        <div className="w-10 h-10 bg-slate-800 border border-blue-500/50 rounded-full flex items-center justify-center text-[8px]">W_1</div>
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1], borderColor: ['#3b82f6', '#ef4444', '#3b82f6'] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-16 h-16 bg-slate-900 border-2 border-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-red-400"
                                        >
                                            RISK_HUB
                                        </motion.div>
                                        <div className="w-10 h-10 bg-slate-800 border border-blue-500/50 rounded-full flex items-center justify-center text-[8px]">W_2</div>
                                    </div>
                                </div>
                            </div>
                        </Modal>

                        <Modal 
                            isOpen={activeModal === 'compliance'} 
                            onClose={() => setActiveModal(null)}
                            title="Official Evidence Export"
                        >
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 font-mono text-[11px] text-slate-300">
                                <div className="border-b border-white/10 pb-4 mb-6 flex justify-between">
                                    <span className="font-bold">FORENSIC REPORT: #SI-9921-X</span>
                                    <span className="text-blue-400">CONFIDENTIAL</span>
                                </div>
                                <div className="space-y-4">
                                    <p>CASE ID: <span className="text-white font-bold font-sans">0xFA2...8821</span></p>
                                    <p>INVESTIGATION TARGET: <span className="text-white font-bold font-sans">Illicit Liquidity Hub Alpha</span></p>
                                    <p>TOTAL ANOMALIES: <span className="text-red-400 font-bold font-sans">42 Detected</span></p>
                                    <div className="h-20 border border-dashed border-white/20 rounded mt-4 flex items-center justify-center text-white/20 italic">
                                        [Institutional Signature Placeholder]
                                    </div>
                                </div>
                            </div>
                        </Modal>
        </section>
    );
};

export default RoadmapSection;
