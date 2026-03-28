import React from 'react';
import InvestigationCanvas from '../../components/tools/InvestigationCanvas';
import { useSearchParams } from 'react-router-dom';
import { alchemyManager } from '../../utils/AlchemyManager';
import '../Tools.css';

const Visualizer = () => {
    const [searchParams] = useSearchParams();
    const address = searchParams.get('address');

    return (
        <div className="tools-terminal-wrapper full-width-terminal">
            <header className="section-desc-box pt-12">
                <div className="terminal-container">
                    <h1 className="section-desc-title">Investigation Visualizer</h1>
                    <p className="section-desc-text">Advanced wallet trace mapping and transaction relationship visualization.</p>
                </div>
            </header>
            <main className="content-area-terminal">
                <div className="terminal-container">
                    <InvestigationCanvas preloadedAddress={address} />
                </div>
            </main>
            <footer className="py-12 border-t border-slate-900 bg-slate-950/50">
                <div className="terminal-container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${alchemyManager.getStatus() === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                <span>Alchemy System: {alchemyManager.getStatus()}</span>
                            </div>
                            <div className="h-3 w-px bg-slate-800"></div>
                            <span>&copy; 2026 Blockchain Intelligence Intelligence</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Visualizer;
