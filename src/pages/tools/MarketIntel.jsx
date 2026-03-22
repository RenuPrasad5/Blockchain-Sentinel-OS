import React from 'react';
import MarketTerminal from '../../components/tools/MarketTerminal';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { alchemyManager } from '../../utils/AlchemyManager';
import useModeStore from '../../store/modeStore';
import '../Tools.css';

const MarketIntel = () => {
    const navigate = useNavigate();
    const setIsScanning = useModeStore(state => state.setIsScanning);

    const handleInvestigate = (address) => {
        if (!address) return;
        try {
            const checksummed = ethers.getAddress(address);
            setIsScanning(true);
            setTimeout(() => {
                setIsScanning(false);
                navigate(`/tools/visualizer?address=${checksummed}`);
            }, 800);
        } catch (e) {
            console.error("Invalid Intelligence Bridge Address:", address);
        }
    };

    return (
        <div className="tools-terminal-wrapper full-width-terminal">
            <header className="section-desc-box pt-12">
                <div className="terminal-container">
                    <h1 className="section-desc-title tracking-tighter">Financial Risk Intelligence</h1>
                    <p className="section-desc-text">Advanced surveillance of global financial volatility, institutional flows, and predictive risk indicators.</p>
                </div>
            </header>
            <main className="content-area-terminal">
                <div className="terminal-container">
                    <MarketTerminal onInvestigate={handleInvestigate} />
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
                            <span>&copy; 2026 CryptoWorld Intelligence</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MarketIntel;
