import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    History, ArrowRight, User, Layers, ShieldCheck,
    Loader2, CheckCircle2, Download, FileText, Zap,
    Fingerprint, Network
} from 'lucide-react';

const Node = ({ type, title, label, isFlagged }) => (
    <div className="flex flex-col items-center gap-3">
        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
            isFlagged
                ? 'border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                : 'border-white/10 bg-white/5'
        }`}>
            {type === 'source'   && <User      className={isFlagged ? 'text-rose-500' : 'text-blue-400'}    size={22} />}
            {type === 'mid'      && <Layers    className="text-slate-400"                                    size={22} />}
            {type === 'exchange' && <ShieldCheck className={isFlagged ? 'text-rose-500' : 'text-emerald-400'} size={22} />}
        </div>
        <div className="text-center">
            <p className="text-[10px] font-black text-white uppercase tracking-widest print:text-black">{title}</p>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5 print:text-slate-600">{label}</p>
        </div>
    </div>
);

const InvestigationNarrative = ({ activeCase, onInitialize, isInitialized }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const timestamp = new Date().toLocaleString();

    const handleInitialize = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            onInitialize(activeCase);
        }, 2000);
    };

    const handleExportPDF = () => window.print();

    return (
        <>
        {/* ── Forensic Narrative Card ── */}
        <div
            id="narrative-capture-area"
            className="bg-[#0D1117] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group print:bg-white print:border-black print:rounded-none"
        >
            {/* Watermark icon */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <History size={110} className="text-slate-700" strokeWidth={0.5} />
            </div>

            {/* ── Print-only PDF Header ── */}
            <div className="hidden print:block mb-8 pb-4 border-b-2 border-black text-center">
                <h1 className="text-2xl font-black uppercase tracking-tight">
                    SENTINEL-OS | CONFIDENTIAL FORENSIC REPORT
                </h1>
                <div className="flex justify-between mt-3 text-[10px] font-bold uppercase text-slate-600">
                    <span>Case ID: {activeCase?.id}</span>
                    <span>Generated: {timestamp}</span>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 print:bg-transparent print:border-black">
                    <History className="text-blue-400 print:text-black" size={28} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter print:text-black">
                            {activeCase?.caseTitle || 'Select a Case'} — Forensic Narrative
                        </h2>
                        {isInitialized && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[8px] font-black uppercase print:border-black">
                                Verified
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] print:text-slate-600">
                        AI-Synthesized Transaction Storyboard
                    </p>
                </div>
            </div>

            {/* Metadata grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCase?.id + '-meta'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-white/5 relative z-10 print:border-black"
                >
                    {[
                        { label: 'Case Origin', value: activeCase?.originAddress, color: 'text-white' },
                        { label: 'Recipient',   value: activeCase?.recipientAddress, color: 'text-blue-400 print:text-blue-800' },
                        { label: 'Risk Score',  value: activeCase?.riskScore, color: 'text-rose-500 print:text-rose-800' },
                        { label: 'Status',      value: isInitialized ? 'VERIFIED' : 'RECOGNIZANCE', color: isInitialized ? 'text-emerald-500 print:text-emerald-800' : 'text-slate-600' }
                    ].map(item => (
                        <div key={item.label} className="space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest print:text-slate-400">{item.label}</span>
                            <p className={`text-sm font-black truncate print:text-black ${item.color}`}>{item.value}</p>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Node visualisation */}
            <div className="mb-10 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCase?.id + '-nodes'}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white/[0.02] rounded-3xl border border-white/5 print:border-black print:bg-transparent"
                    >
                        <Node type="source"   title="Origin"    label={activeCase?.originAddress}    />
                        <ArrowRight className="text-slate-700 rotate-90 md:rotate-0 print:text-slate-400" size={22} />
                        <Node type="mid"      title="Routing"   label="Multi-Hop Pattern"             />
                        <ArrowRight className="text-slate-700 rotate-90 md:rotate-0 print:text-slate-400" size={22} />
                        <Node type="exchange" title="Recipient" label={activeCase?.recipientAddress}  isFlagged={true} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* AI Strategic Insights Layer */}
            <div className="mb-12 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <Zap size={18} className="text-blue-500 animate-pulse" />
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">AI Strategic Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-[#1e293b]/40 border border-blue-500/10 rounded-3xl p-6 backdrop-blur-md">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <FileText size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Executive Summary</h4>
                                <p className="text-sm font-medium text-slate-200 leading-relaxed italic">
                                    "{activeCase?.investigationSummaryShort || 'System is identifying major fund movement patterns...'}"
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">AI Confidence</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-blue-400">{activeCase?.confidence || 85}%</span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${activeCase?.confidence || 85}%` }} />
                                    </div>
                                </div>
                            </div>
                            <div className="h-8 w-[1px] bg-white/5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">System Logic</span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Autonomous Trace</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Suggested Protocol</h4>
                        </div>
                        <p className="text-[12px] font-bold text-white leading-relaxed mb-4">
                            {activeCase?.suggestedAction || 'Continue monitoring destination addresses.'}
                        </p>
                        <button className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all">
                            Execute Response
                        </button>
                    </div>
                </div>
            </div>

            {/* Forensic behavioral indicators — NEW */}
            <div className="mb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* behavioral indicators */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Fingerprint size={16} className="text-blue-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Behavioral Indicators</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(activeCase?.behavioralIndicators || ['Mass Movement', 'Automated Triage']).map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Clustering & Hops */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Network size={16} className="text-indigo-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Cluster Context</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Hop Count</span>
                                <span className="text-xl font-black text-white">{activeCase?.hopCount || 0} Layers</span>
                            </div>
                            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Cluster Size</span>
                                <span className="text-xl font-black text-white">~{activeCase?.clustering?.addressCount || 0} Adr</span>
                            </div>
                        </div>
                        <div className="mt-4 px-1">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 opacity-60">Primary Cluster Identity</p>
                            <p className="text-xs font-black text-indigo-400 uppercase tracking-tighter truncate">
                                {activeCase?.clustering?.primaryEntity || 'Unknown Individual Cluster'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Narrative Steps (Timeline) */}
            <div className="space-y-7 relative z-10">
                <AnimatePresence mode="wait">
                    {activeCase?.narrativeSteps?.map((step, idx) => (
                        <motion.div
                            key={`${activeCase.id}-step-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * idx }}
                            className="flex items-start gap-5 border-l-2 border-slate-800/60 pl-7 relative print:border-slate-300"
                        >
                            <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 border-[#0D1117] print:border-white ${
                                step.isCritical ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-slate-700 print:bg-slate-400'
                            }`} />
                            <div className="space-y-1 flex-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${step.isCritical ? 'text-rose-400 print:text-rose-700' : 'text-slate-500'}`}>
                                    {step.phase}
                                </span>
                                <p className="text-slate-300 text-sm leading-relaxed font-medium print:text-black">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Initialize button (web only) */}
            {!isInitialized && (
                <div className="mt-8 relative z-10 no-print">
                    <button
                        onClick={handleInitialize}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-primary-bright text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(59,130,246,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                        {isAnalyzing
                            ? <><Loader2 className="animate-spin" size={16}/> Synchronizing Blockchain Data...</>
                            : <><ShieldCheck size={16}/> Initialize Full Forensic Case</>
                        }
                    </button>
                </div>
            )}
        </div>

        {/* ── Forensic Archive Export — placed directly under the narrative ── */}
        <div className="no-print mt-4 p-6 bg-[#161B22]/60 border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <FileText className="text-slate-400" size={18} />
                </div>
                <div>
                    <h4 className="text-white font-black uppercase tracking-tight text-sm">
                        Forensic Intelligence Archive
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                        {isInitialized
                            ? `Case ${activeCase?.id} verified — Export is now unlocked`
                            : 'Initialize the case above to unlock export options'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <button
                    disabled={!isInitialized}
                    className={`px-5 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        isInitialized
                            ? 'bg-white/5 text-white border-white/10 hover:bg-white/10 cursor-pointer'
                            : 'opacity-25 cursor-not-allowed border-white/5 text-slate-600'
                    }`}
                >
                    Export JSON
                </button>
                <button
                    onClick={handleExportPDF}
                    disabled={!isInitialized}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isInitialized
                            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg cursor-pointer'
                            : 'opacity-25 cursor-not-allowed bg-slate-800 text-slate-600'
                    }`}
                >
                    <Download size={13} /> Export PDF Report
                </button>
            </div>
        </div>

        {/* Global print stylesheet */}
        <style dangerouslySetInnerHTML={{ __html: `
            @media print {
                .no-print { display: none !important; }
                body, html { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; font-family: 'Georgia', serif; }
                .saas-terminal { background: white !important; padding: 24px !important; }
                #narrative-capture-area { border: 2px solid black !important; border-radius: 0 !important; box-shadow: none !important; page-break-inside: avoid; }
            }
        `}} />
        </>
    );
};

export default InvestigationNarrative;
