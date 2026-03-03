import React from 'react';
import { useNavigate } from 'react-router-dom';
import useModeStore from '../store/modeStore';
import { topCoins } from '../data/mockData';
import {
    TrendingUp,
    Activity,
    BarChart2,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Layers as LayersIcon,
    ShieldCheck,
    Globe,
    Zap,
    ArrowLeft
} from 'lucide-react';
import './ResearchPillars.css';

const Market = () => {
    const { mode } = useModeStore();

    const modeInsights = {
        Beginner: {
            sub: "Simple summaries of what's happening in the market.",
            statLabel: "Daily Vibe",
            statValue: "Highly Bullish",
            trend: "People are buying more Bitcoin today."
        },
        Analyst: {
            sub: "Institutional-grade analysis and real-time project fundamentals.",
            statLabel: "Volatility Index",
            statValue: "24.5 (Low)",
            trend: "L2 expansion seeing 25% MoM user growth."
        },
        Developer: {
            sub: "On-chain state transitions and smart contract protocol health.",
            statLabel: "Gas Velocity",
            statValue: "42 Gwei (Avg)",
            trend: "Arbitrum sequencer uptime at 99.9% this week."
        },
        Investor: {
            sub: "Macro-economic trends and long-term portfolio strategies.",
            statLabel: "Yield Benchmark",
            statValue: "5.2% APY",
            trend: "Long-term holder supply reaching multi-year highs."
        }
    };

    const activeInsight = modeInsights[mode];

    const navigate = useNavigate();

    return (
        <div className={`market fade-in mode-${mode.toLowerCase()} full-width-terminal`}>
            <div className="content-header-integrated glass no-border-radius">
                <div className="terminal-container">
                    <div className="status-badges" style={{ marginBottom: '1rem' }}>
                        <div className="badge grad-primary">Live Markets</div>
                        <div className={`badge mode-indicator ${mode.toLowerCase()}`}>
                            <Zap size={12} /> {mode} Intelligence
                        </div>
                    </div>
                    <div className="topic-hero-integrated header-content-wrap">
                        <div className="title-area">
                            <h1 className="text-4xl font-black mb-2">Market Intelligence</h1>
                            <p className="text-slate-400 font-medium">{activeInsight.sub}</p>
                        </div>
                        <div className="header-stats-slim">
                            <div className="stat-pill">
                                <span className="label">Total Market Cap</span>
                                <div className="value">$2.45T <span className="up">+1.2%</span></div>
                            </div>
                            <div className="stat-pill">
                                <span className="label">{activeInsight.statLabel}</span>
                                <div className="value">{activeInsight.statValue}</div>
                            </div>
                            <div className="stat-pill">
                                <span className="label">Fear & Greed</span>
                                <div className="value status-gold">68 (Greed)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="terminal-container">
                <div className="market-terminal-layout">
                    <div className="market-main-content">
                        <div className="table-controls">
                            <div className="search-pill glass search-width-terminal">
                                <Search size={18} color="var(--text-muted)" />
                                <input type="text" placeholder={`Filter ${mode} assets...`} />
                            </div>
                            <div className="control-buttons">
                                <button className="glass btn-terminal-action"><Filter size={16} /> Filters</button>
                                <button className="glass btn-terminal-action">Customize</button>
                            </div>
                        </div>

                        <div className="market-table-container glass no-border-radius">
                            <table className="terminal-table-full">
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th>Price</th>
                                        <th>24h Change</th>
                                        <th>Market Cap</th>
                                        <th>{mode} Analysis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCoins.map(coin => (
                                        <tr key={coin.symbol} className="table-row-hover">
                                            <td>
                                                <div className="asset-cell">
                                                    <div className="asset-icon-box">
                                                        {coin.symbol[0]}
                                                    </div>
                                                    <div>
                                                        <div className="asset-name">{coin.name}</div>
                                                        <div className="asset-symbol">{coin.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="metric-bold">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td>
                                                <div className={`change-pill ${coin.change >= 0 ? 'up' : 'down'}`}>
                                                    {coin.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                    {Math.abs(coin.change)}%
                                                </div>
                                            </td>
                                            <td className="metric-muted">$ {coin.volume}</td>
                                            <td>
                                                <button className="text-btn action-text-small">{mode === 'Beginner' ? 'Quick View' : 'Research'}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <aside className="market-sidebar-terminal">
                        <div className="glass sidebar-panel">
                            <div className="panel-title">
                                <ShieldCheck size={24} color="var(--accent-green)" />
                                <h3>{mode} Scorer</h3>
                            </div>
                            <div className="score-list">
                                {[
                                    { name: 'Ethereum', score: 92, status: 'Strong Buy' },
                                    { name: 'Solana', score: 88, status: 'Strong Buy' },
                                    { name: 'Avalanche', score: 76, status: 'Hold' }
                                ].map(item => (
                                    <div key={item.name} className="score-item">
                                        <div className="score-info-row">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-score">{item.score}/100</span>
                                        </div>
                                        <div className="score-bar-bg">
                                            <div className="score-bar-fill" style={{ width: `${item.score}%` }}></div>
                                        </div>
                                        <span className="item-sentiment">{mode} Sentiment: {item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass sidebar-panel">
                            <div className="panel-title">
                                <Globe size={24} color="var(--primary)" />
                                <h3>Ecosystem Trends</h3>
                            </div>
                            <div className="trend-list">
                                <div className="trend-card-minimal">
                                    <div className="trend-card-header">
                                        <LayersIcon size={18} color="var(--secondary)" />
                                        <span>{mode === 'Developer' ? 'EVM Internals' : 'L2 Expansion'}</span>
                                    </div>
                                    <p className="trend-card-text">{activeInsight.trend}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Market;

