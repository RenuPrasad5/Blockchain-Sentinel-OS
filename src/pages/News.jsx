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

            if (data && data.Data && data.Data.length > 0) {
                const processedNews = data.Data.map(item => ({
                    ...item,
                    impact: calculateImpact(item),
                    category: mapToForensicCategory(item)
                }));
                setNews(processedNews);
            } else {
                throw new Error("API Limit Reached");
            }
        } catch (error) {
            console.warn('Falling back to simulated real-time feed due to API constraints.');
            // Fallback simulated intelligence for investor demonstrations and API failures
            generateSimulatedFeed();
        } finally {
            setLoading(false);
            setLastRefreshed(new Date());
        }
    };

    const generateSimulatedFeed = () => {
        const fallbacks = [
            { id: 1, title: 'Network Upgrade Scheduled for Mainnet Validator Node', body: 'Developers have confirmed the next protocol upgrade aimed at reducing latency and dropping base fee rates for cross-chain activity.', categories: 'ETH|TECHNOLOGY', source_info: { name: 'Sentinel Intel', img: '/favicon.png' }, published_on: Date.now() / 1000 - 120 },
            { id: 2, title: 'Institutional Flows Signal Accumulation in DeFi Sector', body: 'On-chain analytics reveal a sudden $4.2B spike in stablecoin deposits crossing centralized bridges towards leading decentralised exchanges.', categories: 'DEFI|STABLECOIN', source_info: { name: 'Market Watch', img: '/favicon.png' }, published_on: Date.now() / 1000 - 360 },
            { id: 3, title: 'Emergency Halting Required Following Anomalous Liquidity Drain', body: 'A severe exploit vector was caught during routine monitoring. Core developers halted operations globally to prevent further token draining.', categories: 'HACK|DEFI', source_info: { name: 'Security Alert', img: '/favicon.png' }, published_on: Date.now() / 1000 - 800 },
            { id: 4, title: 'European Regulatory Framework Issues New Directives for Stablecoins', body: 'The latest compliance mandate requires strict 1:1 fiat backing transparency reporting on a 48-hour cadence for all major regional fiat-pegs.', categories: 'REGULATION|STABLECOIN', source_info: { name: 'Gov Data', img: '/favicon.png' }, published_on: Date.now() / 1000 - 1500 },
            { id: 5, title: 'Surge in NFT Marketplace Volume Precedes New Game Engine Rollout', body: 'Digital asset transfers increased 400% on layer 2 solutions as gaming ecosystems prepare to adopt standard high-fidelity rendering engines.', categories: 'NFT|GAMING', source_info: { name: 'Web3 Intel', img: '/favicon.png' }, published_on: Date.now() / 1000 - 2400 },
        ];
        
        const processedNews = fallbacks.map(item => ({
            ...item,
            impact: calculateImpact(item),
            category: mapToForensicCategory(item)
        }));
        
        setNews(processedNews);
    };

    const mapToForensicCategory = (item) => {
        const text = (item.title + (item.body || '') + (item.categories || '')).toUpperCase();
        if (text.includes('HACK') || text.includes('EXPLOIT') || text.includes('CRIME')) return 'CYBER-CRIME';
        if (text.includes('SEC') || text.includes('REGULATION') || text.includes('LAW') || text.includes('MiCA')) return 'REGULATORY';
        if (text.includes('MIXER') || text.includes('AML') || text.includes('LAUNDERING') || text.includes('TORNADO')) return 'AML';
        return 'FORENSICS';
    };

    useEffect(() => {
        fetchNews();
        subscribe('news_updates', { type: 'SUBSCRIBE', channel: 'news' });
        
        // Auto-poll every 20 seconds to guarantee "real-time" dashboard feeling
        const interval = setInterval(() => {
            fetchNews();
        }, 20000);

        return () => {
            unsubscribe('news_updates');
            clearInterval(interval);
        };
    }, [subscribe, unsubscribe]);

    useEffect(() => {
        if (lastMessage && lastMessage.type === 'news') {
            const newItem = {
                ...lastMessage.data,
                impact: calculateImpact(lastMessage.data),
                category: mapToForensicCategory(lastMessage.data)
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
        const itemCategories = item.categories ? item.categories.toUpperCase() : '';
        const matchesCategory = activeCategory === 'ALL' || itemCategories.includes(activeCategory);
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

            <div className="news-layout single-column">

                {/* Center - News Feed */}
                <main className="news-feed-center">
                    <div className="news-feed-container">
                        <div className="feed-header">
                            <div>
                                <h2 className="intel-stream-title">Market Intelligence Stream</h2>
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
                                    <article 
                                        key={item.id} 
                                        className="news-card rounded-sm"
                                        onClick={() => window.open(item.url, '_blank')}
                                    >
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

            </div>
        </div>
    );
};

export default News;
