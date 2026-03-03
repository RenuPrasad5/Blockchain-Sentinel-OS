import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    TrendingUp,
    Shield,
    Database,
    Zap,
    Activity,
    Clock,
    Globe
} from 'lucide-react';
import MarketTerminal from '../components/tools/MarketTerminal';
import OnChainAlpha from '../components/tools/OnChainAlpha';
import SecurityHub from '../components/tools/SecurityHub';
import InvestigationCanvas from '../components/tools/InvestigationCanvas';
import { alchemyManager } from '../utils/AlchemyManager';
import { ethers } from 'ethers';
import './Tools.css';
import './ResearchPillars.css';

const CyberScanOverlay = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Pulsing Scan Circles */}
            <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border border-indigo-400/20 rounded-full animate-ping [animation-delay:200ms]"></div>

            {/* Scanning Line */}
            <div className="absolute inset-0 overflow-hidden rounded-full border border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400/50 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
            </div>

            <div className="text-center z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap size={20} className="text-indigo-400 animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Intelligence Bridge</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mapping Relationship Clusters...</div>
            </div>
        </div>
    </div>
);

const TickerTape = () => {
    const data = [
        { sym: 'BTC', price: '94,231', chg: '+2.4%' },
        { sym: 'ETH', price: '2,745', chg: '-1.1%' },
        { sym: 'SOL', price: '184', chg: '+5.6%' },
        { sym: 'ARB', price: '0.94', chg: '+0.5%' },
        { sym: 'TIA', price: '6.2', chg: '-4.3%' },
        { sym: 'SUI', price: '3.4', chg: '+12.1%' },
    ];

    const doubledData = [...data, ...data, ...data];

    return (
        <div className="w-full bg-slate-950 border-b border-slate-800 py-3 overflow-hidden z-[60] relative">
            <div className="terminal-container">
                <div className="animate-ticker-v2">
                    {doubledData.map((item, idx) => (
                        <div key={idx} className="ticker-item-v2">
                            <span className="text-[11px] font-black text-white uppercase tracking-tighter">{item.sym}/USD</span>
                            <span className="text-[11px] font-mono font-bold text-slate-400">{item.price}</span>
                            <span className={`text-[10px] font-mono font-bold ${item.chg.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {item.chg}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Tools = () => {
    const navigate = useNavigate();

    const tabs = [
        {
            id: 'market',
            label: 'Market Intelligence',
            description: 'Aggregate market data, volatility metrics, and global prediction markets.',
            path: '/tools/market',
            icon: <TrendingUp size={24} className="text-indigo-400" />
        },
        {
            id: 'signals',
            label: 'On-Chain Signals',
            description: 'Real-time whale flows, ecosystem TVL tracking, and upcoming token unlock schedules.',
            path: '/tools/signals',
            icon: <Activity size={24} className="text-emerald-500" />
        },
        {
            id: 'security',
            label: 'Security & Risk',
            description: 'Wallet permission monitoring, protocol audit integrity, and central risk advisories.',
            path: '/tools/security',
            icon: <Shield size={24} className="text-rose-500" />
        },
        {
            id: 'visualizer',
            label: 'Investigation Visualizer',
            description: 'Advanced wallet trace mapping and transaction relationship visualization.',
            path: '/tools/visualizer',
            icon: <Globe size={24} className="text-indigo-400" />
        }
    ];

    return (
        <div className="tools-terminal-wrapper full-width-terminal">
            <TickerTape />

            <header className="section-desc-box pt-12">
                <div className="terminal-container text-center">
                    <h1 className="section-desc-title">Intelligence Sectors</h1>
                    <p className="section-desc-text mx-auto">Select a specialized intelligence module to begin deep-network analysis.</p>
                </div>
            </header>

            <main className="content-area-terminal py-20">
                <div className="terminal-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className="intel-card group cursor-pointer hover:scale-[1.02] transition-all duration-300"
                                onClick={() => navigate(tab.path)}
                            >
                                <div className="intel-card-body p-10">
                                    <div className="mb-6">{tab.icon}</div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-indigo-400 transition-colors">
                                        {tab.label}
                                    </h2>
                                    <p className="text-slate-500 font-bold leading-relaxed mb-8">
                                        {tab.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                                        Initialize Module <Zap size={12} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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

export default Tools;
