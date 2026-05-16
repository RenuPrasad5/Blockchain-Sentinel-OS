import React from 'react';
import { Activity, ChevronRight, Hexagon, Terminal, Network, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportSection = () => {
    return (
        <footer className="w-full bg-[#070A13] border-t border-[#1E293B] relative overflow-hidden pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            {/* Subtle grid pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Column 1: Brand & Status */}
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-[1px]">
                                <div className="w-full h-full bg-[#0B0F19] rounded-lg flex items-center justify-center">
                                    <Hexagon size={16} className="text-cyan-400" />
                                </div>
                            </div>
                            <span className="text-white font-black tracking-widest text-sm uppercase">Blockchain Sentinel</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Institutional-grade blockchain forensics and digital intelligence.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#0B0F19] border border-[#1E293B] px-3 py-1.5 rounded-md w-fit">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                                System Status: Active Intelligence Monitoring
                            </span>
                        </div>
                    </div>

                    {/* Column 2: Platform Solutions */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Terminal size={14} className="text-blue-500" /> Platform Solutions
                        </h4>
                        <ul className="space-y-3">
                            {['Command Center', 'Investigations', 'Live Intelligence Feed', 'Transaction Heatmaps'].map((item, idx) => (
                                <li key={idx}>
                                    <Link to="#" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-1 group">
                                        <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Support & Help */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Network size={14} className="text-blue-500" /> Support & Help
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/help-center" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-1 group">
                                    <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                                    Help Center (Docs)
                                </Link>
                            </li>
                            <li>
                                <button className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-1 group">
                                    <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                                    Report an Issue / Bug Tracker
                                </button>
                            </li>
                            <li>
                                <a href="mailto:support@blockchain-sentinel-os.vercel.app" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-1 group">
                                    <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                                    support@blockchain-sentinel-os.vercel.app
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Security & Legal */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ShieldAlert size={14} className="text-blue-500" /> Security & Legal
                        </h4>
                        <ul className="space-y-3">
                            {['Terms of Service', 'Privacy Policy', 'Compliance Standards'].map((item, idx) => (
                                <li key={idx}>
                                    <Link to="#" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-1 group">
                                        <ChevronRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-[#1E293B]">
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">
                                Institutional Line: <br/> Secure Digital Channel Only
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        © 2026 Blockchain Sentinel. All Rights Reserved.
                    </p>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-blue-500" />
                        Built for Secure Web3 Ecosystems
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default SupportSection;
