import React, { useState } from 'react';
import { Shield, Radar, Zap, Bell, Webhook, Trash2, Crosshair, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AISentinel.css';

const AISentinel = () => {
    const [sentinels, setSentinels] = useState([
        { id: '1', address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', amount: 50, target: 'Binance', action: 'Telegram' },
        { id: '2', address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', amount: 10, target: 'All Exchanges', action: 'Webhook' }
    ]);

    const [newSentinel, setNewSentinel] = useState({
        address: '',
        amount: '',
        target: 'Any Exchange',
        action: 'Telegram Alert'
    });

    const handleDeploy = (e) => {
        e.preventDefault();
        if (!newSentinel.address || !newSentinel.amount) return;

        const id = Math.random().toString(36).substr(2, 9);
        setSentinels([{ ...newSentinel, id }, ...sentinels]);
        setNewSentinel({ address: '', amount: '', target: 'Any Exchange', action: 'Telegram Alert' });
    };

    const removeSentinel = (id) => {
        setSentinels(sentinels.filter(s => s.id !== id));
    };

    return (
        <div className="sentinel-container pt-12">
            <div className="cyber-grid"></div>

            <header className="sentinel-header terminal-container">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Autonomous Surveillance Unit</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-white mb-4">AI SENTINEL <span className="text-emerald-500">v1.0</span></h1>
                <p className="text-slate-400 max-w-2xl font-medium">Deploy autonomous watchers on any on-chain entity. Set custom triggers for cross-exchange movements and liquidity shifts with military-grade precision.</p>
            </header>

            <main className="terminal-container">
                <div className="sentinel-grid">
                    {/* Deployment Form */}
                    <div className="deployment-panel">
                        <div className="flex items-center gap-3 mb-8">
                            <Crosshair size={20} className="text-indigo-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Deploy New Watcher</h2>
                        </div>

                        <form onSubmit={handleDeploy}>
                            <label className="label-military">Target Wallet Address</label>
                            <input
                                className="input-military"
                                placeholder="0x..."
                                value={newSentinel.address}
                                onChange={(e) => setNewSentinel({ ...newSentinel, address: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-military">Threshold (Amount)</label>
                                    <input
                                        className="input-military"
                                        type="number"
                                        placeholder="Min ETH/USD"
                                        value={newSentinel.amount}
                                        onChange={(e) => setNewSentinel({ ...newSentinel, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label-military">Destination</label>
                                    <select
                                        className="input-military"
                                        value={newSentinel.target}
                                        onChange={(e) => setNewSentinel({ ...newSentinel, target: e.target.value })}
                                    >
                                        <option>Any Exchange</option>
                                        <option>Binance</option>
                                        <option>Coinbase</option>
                                        <option>Kraken</option>
                                        <option>Cold Storage</option>
                                    </select>
                                </div>
                            </div>

                            <label className="label-military">Response Action</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${newSentinel.action === 'Telegram Alert' ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                    onClick={() => setNewSentinel({ ...newSentinel, action: 'Telegram Alert' })}
                                >
                                    <Bell size={18} />
                                    <span className="text-[10px] font-black uppercase">Telegram</span>
                                </button>
                                <button
                                    type="button"
                                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${newSentinel.action === 'Webhook Trigger' ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                    onClick={() => setNewSentinel({ ...newSentinel, action: 'Webhook Trigger' })}
                                >
                                    <Webhook size={18} />
                                    <span className="text-[10px] font-black uppercase">Webhook</span>
                                </button>
                            </div>

                            <button className="btn-deploy flex items-center justify-center gap-2">
                                <Zap size={18} />
                                <span>Deploy Sentinel</span>
                            </button>
                        </form>
                    </div>

                    {/* Active Sentinels */}
                    <div className="active-sentinels-panel">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <Radar size={20} className="text-emerald-500" />
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Surveillance ({sentinels.length})</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="scanning-animation"></div>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Scanning Network</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {sentinels.map((s) => (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="sentinel-card"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">ID: {s.id}</span>
                                                <span className="text-[9px] font-black text-slate-600 uppercase">Target:</span>
                                                <span className="text-[11px] font-mono text-white truncate max-w-[150px]">{s.address}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Zap size={12} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-slate-400">If Move &gt; {s.amount} to {s.target}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {s.action.includes('Telegram') ? <Bell size={12} className="text-indigo-400" /> : <Webhook size={12} className="text-indigo-400" />}
                                                    <span className="text-[10px] font-bold text-slate-400">Then {s.action}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="p-3 text-slate-600 hover:text-rose-500 transition-colors"
                                            onClick={() => removeSentinel(s.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {sentinels.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                                <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">No Sentinels Deployed</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AISentinel;
