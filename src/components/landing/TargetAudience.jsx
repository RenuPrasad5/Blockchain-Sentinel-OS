import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Landmark, Search } from 'lucide-react';

const TargetAudience = () => {
    return (
        <section className="py-24 px-4 bg-transparent">
            <div className="max-w-7xl mx-auto w-full">
                <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/5">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Built For Action</h2>
                        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">A specialized ecosystem dedicated to securing institutional and sovereign integrity worldwide.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: <Landmark className="text-blue-400" size={32}/>, title: 'Government Agencies', desc: 'National-grade overview of illicit capital flows mapping to sovereign jurisdictions.' },
                        { icon: <ShieldAlert className="text-emerald-400" size={32}/>, title: 'AML Compliance', desc: 'Automated entity scoring and instant VASP-level exposure reporting.' },
                        { icon: <Search className="text-indigo-400" size={32}/>, title: 'Cyber Investigators', desc: 'Deep-dive forensic tools with autonomous unmasking of mixer transactions.' }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:bg-slate-800/50 hover:border-white/10 transition-all"
                        >
                            <div className="mb-6 p-3 bg-white/5 inline-block rounded-xl">{item.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-[15px]">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;
