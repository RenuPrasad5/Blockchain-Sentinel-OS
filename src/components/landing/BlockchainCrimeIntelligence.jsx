import React from 'react';
import { motion } from 'framer-motion';
import {
    Globe, Calendar, Network, DollarSign, BookOpen, Fingerprint, ShieldAlert, AlertCircle
} from 'lucide-react';

const realWorldCases = [
    {
        title: "WazirX Exchange Breach",
        category: "Exchange Hack",
        description: "A major security incident involving a compromise of a multi-signature wallet. Forensics indicated a sophisticated exploit of the wallet's signing service, leading to unauthorized withdrawals of varied digital assets.",
        network: "Ethereum / Multi-Chain",
        impact: "$230M+",
        label: "Case Reviewed",
        color: "rose"
    },
    {
        title: "Ronin Bridge Exploit",
        category: "Cross-Chain Exploit",
        description: "Compromised validator nodes allowed attackers to forge withdrawal signatures. This case highlighted the critical risks associated with centralized validator sets in cross-chain bridge architectures.",
        network: "Ronin / Ethereum",
        impact: "$625M+",
        label: "Forensic Pattern",
        color: "rose"
    },
    {
        title: "Lazarus Group Laundering",
        category: "Money Laundering",
        description: "Systematic obfuscation of stolen funds through decentralized mixers and chain-hopping. Analysts tracked the flow from initial exploits to programmatic dispersion across multiple Layer 2 networks.",
        network: "Multi-Chain / Mixers",
        impact: "Billions (Est.)",
        label: "Threat Awareness",
        color: "orange"
    },
    {
        title: "Poly Network Cryptographic Attack",
        category: "Smart Contract Exploit",
        description: "Attackers exploited a flaw in the protocol's cross-chain contract logic to override the 'keeper' role. This allowed for unauthorized instruction calls across disparate blockchain networks.",
        network: "Poly / Multi-Chain",
        impact: "$611M+",
        label: "Case Reviewed",
        color: "rose"
    },
    {
        title: "Telegram Investment Scams",
        category: "Phishing Scam",
        description: "Widespread social engineering campaigns utilizing fake liquidity pools and automated bots to drain retail wallets. Analysis shows a pattern of high-frequency, low-value thefts targeting unverified tokens.",
        network: "Solana / Base / BSC",
        impact: "Ongoing Retail Loss",
        label: "Threat Awareness",
        color: "blue"
    },
    {
        title: "NFT Wallet Drainer Networks",
        category: "Wallet Theft",
        description: "Malicious scripts disguised as 'minting' buttons that execute 'setApprovalForAll' transactions. This forensic pattern reveals the misuse of standard ERC-721 approval functions to hijack assets.",
        network: "Ethereum / Polygon / Solana",
        impact: "Multimillion (Retail)",
        label: "Forensic Pattern",
        color: "orange"
    }
];

const BlockchainCrimeIntelligence = () => {
    return (
        <section className="px-4 py-24 border-t border-slate-900 relative bg-[#070b14]">
            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-20 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                        <AlertCircle size={12} className="text-rose-400" />
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">
                            Recent Blockchain Crime Cases
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
                        Documented Forensic Analysis
                    </h3>
                    <p className="text-slate-400 text-sm max-w-2xl font-medium">
                        A realistic showcase of actual blockchain exploits, scams, and financial crimes analyzed to identify forensic patterns and improve threat awareness.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {realWorldCases.map((item, idx) => (
                        <motion
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col bg-[#0d1425]/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group relative overflow-hidden"
                        >
                            {/* Accent Line */}
                            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${item.color === 'rose' ? 'via-rose-500/40' : item.color === 'orange' ? 'via-orange-500/40' : 'via-blue-500/40'} to-transparent`} />

                            <div className="flex justify-between items-center mb-6">
                                <span className="px-2 py-0.5 rounded border border-slate-800 text-[8px] font-black font-mono tracking-widest text-slate-500 uppercase">
                                    {item.category}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.color === 'rose' ? 'bg-rose-500' : item.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        {item.label}
                                    </span>
                                </div>
                            </div>

                            <h4 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h4>

                            <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 mb-6 flex-grow">
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    {item.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                                        <Network size={10} /> Affected Network
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase truncate">{item.network}</span>
                                </div>
                                <div className="flex flex-col gap-1 pl-2 border-l border-slate-800/60">
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                                        <DollarSign size={10} /> Forensic Impact
                                    </span>
                                    <span className={`text-[10px] font-black uppercase ${item.color === 'rose' ? 'text-rose-400' : 'text-orange-400'}`}>
                                        {item.impact}
                                    </span>
                                </div>
                            </div>

                            {/* Status Icon */}
                            <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                {item.label.includes('Reviewed') && <BookOpen size={32} />}
                                {item.label.includes('Pattern') && <Fingerprint size={32} />}
                                {item.label.includes('Awareness') && <ShieldAlert size={32} />}
                            </div>
                        </motion>
                    ))}
                </div>

                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                            <BookOpen size={16} />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest max-w-[200px]">
                            Forensic data compiled from verified public incidents.
                        </p>
                    </div>
                    <div className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] text-center md:text-right">
                        Data Integrity Protocol: Verified <br />
                        Archive Version: 2024.1.2
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlockchainCrimeIntelligence;
