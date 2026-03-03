import React, { useState, useEffect } from 'react';
import {
    Search,
    TrendingUp,
    Filter,
    Clock,
    Shield,
    Zap,
    Globe,
    Layers as LayersIcon,
    BarChart2,
    AlertTriangle,
    ExternalLink,
    RefreshCw,
    Eye,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import './News.css';

const News = () => {
    const { lastMessage, subscribe, unsubscribe } = useWebSocket();
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [lastRefreshed, setLastRefreshed] = useState(new Date());

    const categories = [
        { id: 'ALL', label: 'All Intel', icon: <Globe size={16} /> },
        { id: 'BTC', label: 'Bitcoin', icon: <LayersIcon size={16} /> },
        { id: 'ETH', label: 'Ethereum', icon: <LayersIcon size={16} /> },
        { id: 'DEFI', label: 'DeFi', icon: <BarChart2 size={16} /> },
        { id: 'NFT', label: 'NFTs & Gaming', icon: <Zap size={16} /> },
        { id: 'REGULATION', label: 'Regulations', icon: <Shield size={16} /> },
        { id: 'STABLECOIN', label: 'Stablecoins', icon: <Shield size={16} /> },
    ];

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
            const data = await response.json();

            if (data.Data) {
                const processedNews = data.Data.map(item => ({
                    ...item,
                    impact: calculateImpact(item),
                    category: item.categories.split('|')[0] || 'GENERAL'
                }));
                setNews(processedNews);
            }
            setLastRefreshed(new Date());
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        subscribe('news_updates', { type: 'SUBSCRIBE', channel: 'news' });
        return () => unsubscribe('news_updates');
    }, [subscribe, unsubscribe]);

    useEffect(() => {
        if (lastMessage && lastMessage.type === 'news') {
            const newItem = {
                ...lastMessage.data,
                impact: calculateImpact(lastMessage.data),
                category: lastMessage.data.categories?.split('|')[0] || 'GENERAL'
            };
            setNews(prev => [newItem, ...prev].slice(0, 100));
            setLastRefreshed(new Date());
        }
    }, [lastMessage]);

    const calculateImpact = (item) => {
        // Artificial logic to simulate "Terminal Intelligence" 
        // based on sentiment symbols if available or just random professional categorization
        const text = (item.title + item.body).toLowerCase();
        if (text.includes('crash') || text.includes('hack') || text.includes('sec') || text.includes('lawsuit')) return 'HIGH';
        if (text.includes('partnership') || text.includes('launch') || text.includes('upgrade')) return 'MEDIUM';
        return 'LOW';
    };

    const filteredNews = news.filter(item => {
        const matchesCategory = activeCategory === 'ALL' || item.categories.includes(activeCategory);
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.body.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="news-terminal">
            {/* Top status bar matches terminal aesthetic */}
            <div className="terminal-sub-header">
                <div className="terminal-status-indicator">
                    <span className="pulse-dot-small"></span>
                    LIVE INTEL FEED ACTIVE
                </div>
            </div>

            {/* Breaking News Ticker */}
            <div className="news-ticker-container">
                <div className="ticker-label">
                    <Zap size={12} fill="currentColor" style={{ marginRight: '6px' }} />
                    Breaking Intel
                </div>
                <div className="ticker-content">
                    {news.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="ticker-item">
                            <span className="dot"></span>
                            {item.title}
                        </div>
                    ))}
                    {/* Duplicate for infinite effect if needed, but simple animation for now */}
                </div>
            </div>

            <div className="news-layout">
                {/* Left Sidebar - Categories */}
                <aside className="news-sidebar-left">
                    <div className="sidebar-section">
                        <div className="search-box-terminal">
                            <Search size={14} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search Intel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Intelligence Channels</h3>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="sidebar-section">
                        <h3>Terminal Tools</h3>
                        <button className="filter-btn" onClick={fetchNews}>
                            <RefreshCw size={14} />
                            Manual Sync
                        </button>
                        <button className="filter-btn">
                            <Eye size={14} />
                            Watchlist
                        </button>
                    </div>
                </aside>

                {/* Center - News Feed */}
                <main className="news-feed-center">
                    <div className="news-feed-container">
                        <div className="feed-header">
                            <div>
                                <h2>Market Intelligence Stream</h2>
                                <div className="feed-stats">
                                    Showing {filteredNews.length} active nodes • Latency: 24ms • Last Sync: {lastRefreshed.toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="impact-legend">
                                <span className="legend-item"><span className="dot high"></span> Critical</span>
                                <span className="legend-item"><span className="dot medium"></span> Moderate</span>
                                <span className="legend-item"><span className="dot low"></span> Low</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <RefreshCw className="animate-spin" />
                                <span>Synchronizing Intelligence Feeds...</span>
                            </div>
                        ) : (
                            <div className="news-cards-container">
                                {filteredNews.map(item => (
                                    <article key={item.id} className="news-card" onClick={() => window.open(item.url, '_blank')}>
                                        <div className="card-top">
                                            <span className="category-tag">{item.category}</span>
                                            <div className={`impact-tag ${item.impact.toLowerCase()}`}>
                                                <Shield size={10} />
                                                {item.impact} IMPACT
                                            </div>
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p className="news-summary">{item.body.substring(0, 180)}...</p>
                                        <div className="card-footer">
                                            <div className="source-info">
                                                <img src={item.source_info.img} alt={item.source_info.name} className="source-icon" />
                                                <span>{item.source_info.name}</span>
                                                <span className="divider">•</span>
                                                <Clock size={12} />
                                                <span>{new Date(item.published_on * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <ExternalLink size={14} className="external-link" />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Intelligence Panels */}
                <aside className="news-sidebar-right">
                    <div className="intelligence-panel">
                        <div className="panel-header">
                            <TrendingUp size={14} />
                            Global Sentiment
                        </div>
                        <div className="sentiment-bar">
                            <div className="bar-fill" style={{ width: '68%', background: 'var(--terminal-accent)' }}></div>
                        </div>
                        <div className="sentiment-labels">
                            <span>BULLISH</span>
                            <span>68%</span>
                        </div>
                    </div>

                    <div className="intelligence-panel">
                        <div className="panel-header">
                            <Shield size={14} />
                            Regulatory Pulse
                        </div>
                        <div className="pulse-item">
                            <span className="status-dot green"></span>
                            <span className="label">EU MiCA Compliance</span>
                            <span className="value">94%</span>
                        </div>
                        <div className="pulse-item">
                            <span className="status-dot amber"></span>
                            <span className="label">SEC Litigation</span>
                            <span className="value">HIGH</span>
                        </div>
                    </div>

                    <div className="intelligence-panel">
                        <div className="panel-header">
                            <AlertTriangle size={14} />
                            Network Alerts
                        </div>
                        <div className="alert-item">
                            <div className="alert-meta">ETH • GAS SPIKE</div>
                            <div className="alert-val">84 Gwei</div>
                        </div>
                        <div className="alert-item">
                            <div className="alert-meta">SOL • TPS</div>
                            <div className="alert-val">2.4k</div>
                        </div>
                    </div>

                    <div className="terminal-footer">
                        <div className="system-status">
                            <div className="blink"></div>
                            SYSTEM LOGGED: OPERATOR_KARTHIK
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default News;
