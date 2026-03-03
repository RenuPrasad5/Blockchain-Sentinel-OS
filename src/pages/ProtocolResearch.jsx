import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useModeStore from '../store/modeStore';
import { researchDomains } from '../data/researchDomains';
import {
    Zap,
    Hexagon,
    Network,
    Shield,
    Activity,
    Search,
    BookOpen,
    ArrowLeft,
    Bookmark,
    Clock,
    FileText,
    Layers as LayersIcon,
    Database,
    Binary,
    MessageSquare,
    ChevronRight,
    SearchCode,
    Plus,
    X,
    Clipboard,
    History,
    Star,
    ExternalLink,
    Lock,
    Cpu,
    Scale,
    Link,
    TrendingUp,
    Server,
    Globe,
    AlertTriangle,
    CheckCircle2,
    Info,
    Workflow,
    Compass,
    Rocket
} from 'lucide-react';
import './ProtocolResearch.css';

const ProtocolResearch = () => {
    const { mode } = useModeStore();
    const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState(researchDomains[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [history, setHistory] = useState(['Blockchain Fundamentals', 'DeFi Architecture']);
    const [bookmarks, setBookmarks] = useState(['Cryptography']);
    const [notes, setNotes] = useState([
        { id: 1, text: "Ethereum Pectra upgrade impacts validator entry cues.", date: "2h ago" }
    ]);

    const activeDomain = researchDomains.find(d => d.id === selectedCategoryId) || researchDomains[0];

    const handleCategoryClick = (id) => {
        setSelectedCategoryId(id);
        const name = researchDomains.find(d => d.id === id)?.name;
        if (name && !history.includes(name)) {
            setHistory(prev => [name, ...prev].slice(0, 10));
        }
    };

    const toggleBookmark = (name) => {
        setBookmarks(prev => prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]);
    };

    const domainIconMap = {
        "blockchain-fundamentals": <Database size={16} />,
        "cryptography": <Lock size={16} />,
        "consensus": <Cpu size={16} />,
        "layer-1": <LayersIcon size={16} />,
        "layer-2": <TrendingUp size={16} />,
        "defi": <Activity size={16} />,
        "tokenomics": <Binary size={16} />,
        "governance": <Scale size={16} />,
        "security": <Shield size={16} />,
        "smart-contracts": <SearchCode size={16} />,
        "cross-chain": <Link size={16} />,
        "mev": <Zap size={16} />,
        "storage": <Server size={16} />,
        "oracles": <Globe size={16} />,
        "regulation": <Scale size={16} />,
    };

    const filteredDomains = researchDomains.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.overview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`protocol-workspace fade-in mode-${mode.toLowerCase()} full-width-terminal`}>
            <div className="page-header research-terminal-header-slim">
                <div className="workspace-tools-left">
                    <h1>Research Terminal <span>v5.0</span></h1>
                </div>
                <div className="workspace-tools">
                    <div className="search-pill glass">
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Query research domains..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="workspace-grid terminal-layout">
                {/* 1. RESEARCH DOMAINS (LEFT) */}
                <aside className="control-panel terminal-sidebar glass">
                    <div className="sidebar-section">
                        <h4 className="sidebar-label">Intelligence Domains</h4>
                        <div className="cp-list domains-list-vertical">
                            {filteredDomains.map(domain => (
                                <button
                                    key={domain.id}
                                    className={`cp-item-sidebar ${selectedCategoryId === domain.id ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(domain.id)}
                                >
                                    <span className="icon-wrap">
                                        {domainIconMap[domain.id] || <BookOpen size={16} />}
                                    </span>
                                    <span className="domain-name">{domain.name}</span>
                                    {selectedCategoryId === domain.id && <ChevronRight size={14} className="active-arrow" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* 2. RESEARCH CONTENT (CENTER) */}
                <main className="research-content-area reading-optimized">
                    <div className="content-card glass">
                        <div className="content-header-integrated">
                            <div className="header-nav">
                                <button className="back-link" onClick={() => navigate('/')}>
                                    <ArrowLeft size={16} />
                                    <span>Back to Terminal</span>
                                </button>
                                <div className="header-status">
                                    <span className={`mode-pill ${mode.toLowerCase()}`}>
                                        <Binary size={12} /> {mode} Mode
                                    </span>
                                </div>
                            </div>

                            <div className="title-row-integrated">
                                <div className="title-main">
                                    <div className="domain-breadcrumb">Industy Research / {activeDomain.name}</div>
                                    <h2 className="reading-title">{activeDomain.name}</h2>
                                </div>
                                <div className="content-actions">
                                    <button
                                        className={`action-btn-circle ${bookmarks.includes(activeDomain.name) ? 'active' : ''}`}
                                        onClick={() => toggleBookmark(activeDomain.name)}
                                    >
                                        <Bookmark size={18} />
                                    </button>
                                    <button className="action-btn-circle">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="content-body scrollbar-hide">
                            <section className="reading-section overview-section">
                                <h3 className="reading-subtitle"><Info size={18} /> Research Overview</h3>
                                <div className="long-form-text">
                                    {activeDomain.overview}
                                </div>
                                <div className="strategic-callout">
                                    <strong>Strategic Importance:</strong> {activeDomain.importance}
                                </div>
                            </section>

                            <div className="reading-grid">
                                <section className="reading-section">
                                    <h3 className="reading-subtitle"><Hexagon size={18} /> Core Concepts</h3>
                                    <ul className="clean-list">
                                        {activeDomain.coreConcepts.map((concept, i) => (
                                            <li key={i}><CheckCircle2 size={14} className="text-primary" /> {concept}</li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="reading-section">
                                    <h3 className="reading-subtitle"><Workflow size={18} /> Architecture</h3>
                                    <p className="reading-text-small">{activeDomain.architecture || "Architectural details currently under review for this domain."}</p>
                                </section>
                            </div>

                            <section className="reading-section dark-accent">
                                <h3 className="reading-subtitle"><Compass size={18} /> How It Works</h3>
                                <p className="reading-text">{activeDomain.howItWorks || "Operational mechanics and state transition logic for this domain."}</p>
                            </section>

                            <div className="reading-grid">
                                <section className="reading-section">
                                    <h3 className="reading-subtitle"><Network size={18} /> Real-World Examples</h3>
                                    <div className="protocol-badges-list">
                                        {activeDomain.protocolExamples.map((p, i) => (
                                            <span key={i} className="ref-pill">{p}</span>
                                        ))}
                                    </div>
                                </section>

                                <section className="reading-section">
                                    <h3 className="reading-subtitle"><AlertTriangle size={18} /> Risk Assessment</h3>
                                    <ul className="risk-list">
                                        {activeDomain.failures.map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <div className="reading-grid">
                                <section className="reading-section">
                                    <h3 className="reading-subtitle"><TrendingUp size={18} /> Research Trends</h3>
                                    <div className="pulse-list">
                                        {activeDomain.trends.map((t, i) => (
                                            <div key={i} className="pulse-item">
                                                <div className="pulse-dot"></div>
                                                <span>{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="reading-section">
                                    <h3 className="reading-subtitle"><Rocket size={18} /> Future Outlook</h3>
                                    <p className="reading-text-small">{activeDomain.futureOutlook || "Anticipated evolution and long-term research trajectories."}</p>
                                </section>
                            </div>

                            <section className="reading-section">
                                <h3 className="reading-subtitle"><Activity size={18} /> Open Problems</h3>
                                <div className="open-problem-pills">
                                    {activeDomain.openProblems.map((p, i) => (
                                        <div key={i} className="problem-pill">
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="reading-section references-footer">
                                <h3 className="reading-subtitle"><MessageSquare size={18} /> Academic References</h3>
                                <div className="source-list">
                                    {activeDomain.references.map((ref, i) => (
                                        <div key={i} className="source-item">
                                            <span className="source-index">[{i + 1}]</span>
                                            <span className="source-name">{ref}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>

                {/* 3. PERSONAL WORKSPACE (RIGHT) */}
                <aside className="personal-tools compact-tools">
                    <div className="tool-section glass mini">
                        <div className="tool-header">
                            <h3><Clipboard size={14} /> Notes</h3>
                            <Plus size={14} className="add-note" />
                        </div>
                        <div className="tool-content">
                            {notes.map(note => (
                                <div key={note.id} className="note-card-mini">
                                    <p>{note.text}</p>
                                    <span>{note.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tool-section glass mini">
                        <div className="tool-header">
                            <h3><Star size={14} /> Saved</h3>
                        </div>
                        <div className="tool-content list">
                            {bookmarks.map(b => (
                                <div key={b} className="list-item-mini" onClick={() => {
                                    const d = researchDomains.find(dom => dom.name === b);
                                    if (d) setSelectedCategoryId(d.id);
                                }}>
                                    <span>{b}</span>
                                    <ChevronRight size={12} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tool-section glass mini">
                        <div className="tool-header">
                            <h3><History size={14} /> History</h3>
                        </div>
                        <div className="tool-content list">
                            {history.map(h => (
                                <div key={h} className="list-item-mini" onClick={() => {
                                    const d = researchDomains.find(dom => dom.name === h);
                                    if (d) setSelectedCategoryId(d.id);
                                }}>
                                    <span>{h}</span>
                                    <Clock size={10} className="text-muted" />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProtocolResearch;

