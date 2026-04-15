import React from 'react';
import { motion } from 'framer-motion';

const ProcessSection = () => {
    return (
        <section className="py-24 px-4 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto w-full relative z-10">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">The Sovereign Protocol</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">How It Works</h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Horizontal Connector Line for Desktop */}
                    <div className="hidden md:block absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-1/2"></div>
                    
                    {[
                        { step: '01', title: 'Ingest', desc: 'Continuous stream processing of mempool data, smart contract events, and cross-chain transfers.' },
                        { step: '02', title: 'Analyze', desc: 'Autonomous neural engines map behavioral typologies and calculate entity risk scores in real-time.' },
                        { step: '03', title: 'Enforce', desc: 'Instant actionable intelligence delivered to compliance and law enforcement for immediate asset freezing.' }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.2 }}
                            className="relative bg-[#0D1117] p-8 rounded-2xl border border-white/10 z-10 hover:-translate-y-2 transition-transform shadow-xl shadow-black/50"
                        >
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#1f2937] to-[#0f172a] mb-6 absolute top-6 right-6 z-0 select-none">
                                {item.step}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-[15px]">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
