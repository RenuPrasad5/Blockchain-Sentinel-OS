import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, TrendingDown, Clock } from 'lucide-react';

const ProblemSection = () => {
    return (
        <section className="py-20 px-4 bg-transparent border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <span className="text-red-400 font-bold tracking-widest uppercase text-sm mb-4 block">The Critical Failure</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Current Forensic Tools Are Too Slow</h2>
                    <p className="text-lg text-slate-400 leading-relaxed">Investigations take weeks. Illicit funds move in seconds. The gap in response time costs billions in unrecoverable sovereign assets.</p>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <Clock className="text-red-400" size={32}/>, title: 'Latency Vulnerability', desc: 'Manual graph tracing cannot match the automated speed of modern laundering syndicates.' },
                        { icon: <AlertOctagon className="text-orange-400" size={32}/>, title: 'Fragmented Intelligence', desc: 'Data is siloed across multiple disparate tools, completely hindering rapid jurisdictional action.' },
                        { icon: <TrendingDown className="text-pink-400" size={32}/>, title: 'Poor Recovery Rates', desc: 'Sub-1% recovery of stolen assets due to reactive, post-mortem analysis rather than real-time disruption.' }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-red-500/30 transition-all group hover:-translate-y-1"
                        >
                            <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-[15px]">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
