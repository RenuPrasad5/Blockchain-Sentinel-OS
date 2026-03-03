import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Shield,
    PieChart,
    BarChart3,
    Activity,
    Zap,
    Bell,
    ArrowUpRight,
    Search,
    Globe,
    Lock,
    Cpu,
    Waves,
    AlertTriangle,
    Eye,
    BarChart,
    Layers,
    Navigation,
    MousePointer2
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import useModeStore from '../store/modeStore';

const IntelCard = ({ title, icon: Icon, children, badge, type = "default" }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`intel-card-saas glass ${type}`}
    >
        <div className="card-header-dense">
            <div className="card-title-group">
                <Icon size={16} className="text-primary-bright" />
                <h3>{title}</h3>
            </div>
            {badge && <span className="card-badge-mini">{badge}</span>}
        </div>
        <div className="card-body-dense">
            {children}
        </div>
    </motion.div>
);

const MarketStat = ({ label, value, colorClass = "" }) => (
    <div className="market-stat-module">
        <span className="stat-label-mini">{label}</span>
        <span className={`stat-value-mini ${colorClass}`}>{value}</span>
    </div>
);

const Dashboard = () => {
    const { mode } = useModeStore();

    return (
        <div className={`saas-terminal fade-in mode-${mode.toLowerCase()}`}>
            {/* Global Market Status Bar */}
            <div className="global-status-bar glass">
                <MarketStat label="Global Cap" value="$3.42T" colorClass="text-emerald" />
                <div className="stat-sep"></div>
                <MarketStat label="BTC Dominance" value="54.2%" />
                <div className="stat-sep"></div>
                <MarketStat label="Sentiment" value="Extreme Greed (78)" colorClass="text-emerald" />
                <div className="stat-sep"></div>
                <MarketStat label="Risk Index" value="Low (12)" colorClass="text-emerald" />
                <div className="stat-sep"></div>
                <MarketStat label="Active Signals" value="14 Alerts" colorClass="text-primary-bright" />
                <div className="stat-sep"></div>
                <div className="user-tier-badge">
                    <Shield size={12} />
                    <span>{mode} PRO</span>
                </div>
            </div>

            {/* Main Terminal Grid: 2 Columns */}
            <div className="terminal-layout-grid">

                {/* COLUMN 1: STRATEGIC INTELLIGENCE (Left) */}
                <div className="terminal-column">
                    <div className="column-label">
                        <Navigation size={14} /> Strategic Intelligence
                    </div>

                    <IntelCard title="AI Strategic Analysis" icon={Cpu} type="highlight">
                        <div className="ai-report">
                            <div className="report-meta">Today 09:30 UTC • Institutional Grade</div>
                            <h4>Volatility Compression Early Warning</h4>
                            <p>
                                BTC volatility indices (BVIV) have dropped to 18-month lows. Historical clusters
                                suggest a massive directional move ({">"}8%) within the next 4-6 days. Capitalize
                                on low theta decay by positioning in long straddles.
                            </p>
                            <div className="confidence-track">
                                <div className="track-info"><span>Confidence Interval</span> <span>96.4%</span></div>
                                <div className="track-bar"><div className="track-fill" style={{ width: '96.4%' }}></div></div>
                            </div>
                        </div>
                    </IntelCard>

                    <IntelCard title="Risk Radar" icon={AlertTriangle}>
                        <div className="risk-grid-dense">
                            <div className="risk-metric-box">
                                <span className="lbl">Audit Score</span>
                                <span className="val text-emerald">9.8/10</span>
                            </div>
                            <div className="risk-metric-box">
                                <span className="lbl">Liquidity Ratio</span>
                                <span className="val">1.42</span>
                            </div>
                            <div className="risk-metric-box">
                                <span className="lbl">Slippage Tolerance</span>
                                <span className="val text-rose">High Expectation</span>
                            </div>
                        </div>
                        <div className="risk-alert-ticker">
                            <div className="ticker-item warning"><AlertTriangle size={12} /> LDO Liquidity Pool Imbalance detected</div>
                            <div className="ticker-item success"><Shield size={12} /> Curve Finance Registry update verified</div>
                        </div>
                    </IntelCard>

                    <IntelCard title="Institutional Alpha" icon={Layers}>
                        <div className="alpha-feed-dense">
                            <div className="alpha-post">
                                <div className="post-head">
                                    <span className="source">Grayscale Research</span>
                                    <span className="time">5m ago</span>
                                </div>
                                <p>Large-scale rebalancing of Digital Large Cap Fund (GDLC) complete. SOL weight increased to 12.5%.</p>
                            </div>
                            <div className="alpha-post">
                                <div className="post-head">
                                    <span className="source">JPMorgan Digital</span>
                                    <span className="time">22m ago</span>
                                </div>
                                <p>Tokenized T-Bill adoption accelerating on Avalanche network. Expected TVL growth: +$450M.</p>
                            </div>
                        </div>
                    </IntelCard>
                </div>

                {/* COLUMN 2: LIVE MARKET PULSE (Right) */}
                <div className="terminal-column">
                    <div className="column-label">
                        <Activity size={14} /> Live Market Pulse
                    </div>

                    <IntelCard title="On-Chain Activity" icon={Activity} badge="LIVE">
                        <div className="activity-stats-dense">
                            <div className="act-row">
                                <span className="act-lbl">EVM Transactions</span>
                                <span className="act-val">12,450 /sec</span>
                            </div>
                            <div className="act-row">
                                <span className="act-lbl">Burn Rate (ETH)</span>
                                <span className="act-val text-rose">1.4 ETH/min</span>
                            </div>
                            <div className="act-row">
                                <span className="act-lbl">Active Stablecoins</span>
                                <span className="act-val">$162.4B</span>
                            </div>
                        </div>
                    </IntelCard>

                    <IntelCard title="Whale Tracker" icon={Eye}>
                        <div className="whale-log">
                            <div className="log-entry">
                                <div className="log-icon out"><MousePointer2 size={12} /></div>
                                <div className="log-details">
                                    <span className="main">42,000 ETH Outflow</span>
                                    <span className="sub">Coinbase → Unknown Wallet (Cluster alpha-7)</span>
                                </div>
                                <span className="time">1m</span>
                            </div>
                            <div className="log-entry">
                                <div className="log-icon in"><MousePointer2 size={12} /></div>
                                <div className="log-details">
                                    <span className="main">1,200 BTC Inflow</span>
                                    <span className="sub">Unknown → Binance (Liquidation risk)</span>
                                </div>
                                <span className="time">8m</span>
                            </div>
                        </div>
                    </IntelCard>

                    <IntelCard title="Asset Performance" icon={BarChart3}>
                        <div className="performance-list-dense">
                            <div className="perf-item">
                                <span className="sym">BTC</span>
                                <span className="prc">$98,420</span>
                                <span className="chg up">+1.4%</span>
                            </div>
                            <div className="perf-item">
                                <span className="sym">ETH</span>
                                <span className="prc">$3,240</span>
                                <span className="chg down">-0.2%</span>
                            </div>
                            <div className="perf-item">
                                <span className="sym">SOL</span>
                                <span className="prc">$188.5</span>
                                <span className="chg up">+3.8%</span>
                            </div>
                        </div>
                    </IntelCard>

                    <IntelCard title="Liquidity Depth" icon={Waves}>
                        <div className="liquidity-viz-dense">
                            <div className="viz-stats">
                                <div className="v-stat">
                                    <span className="v-lbl">Bids (2%)</span>
                                    <span className="v-val">$185M</span>
                                </div>
                                <div className="v-stat">
                                    <span className="v-lbl">Asks (2%)</span>
                                    <span className="v-val">$212M</span>
                                </div>
                            </div>
                            <div className="depth-bar-container">
                                <div className="depth-green" style={{ width: '45%' }}></div>
                                <div className="depth-red" style={{ width: '55%' }}></div>
                            </div>
                        </div>
                    </IntelCard>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
