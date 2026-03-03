import React, { useState, useEffect } from 'react';
import { encyclopediaData } from '../data/encyclopediaData';
import useModeStore from '../store/modeStore';
import {
    Database,
    Search,
    ChevronRight,
    FileText,
    Shield,
    Activity,
    CheckCircle,
    Fingerprint,
    Zap,
    BookOpen,
    AlertCircle,
    Target,
    RotateCcw,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Quote,
    Clock,
    ArrowLeft,
    Binary,
    Layers as LayersIcon,
    Rocket,
    Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Encyclopedia.css';

const KnowledgeCheck = ({ questions, mode }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleVerify = () => {
        if (selectedOption === null) return;
        setIsAnswered(true);
        if (selectedOption === questions[currentStep].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        return (
            <section className="quiz-section results-view glass fade-in">
                <div className="results-content">
                    <div className="trophy-icon"><CheckCircle2 size={64} color="var(--primary)" /></div>
                    <h2>Check Complete!</h2>
                    <p className="final-score">You scored <strong>{score}</strong> out of <strong>{questions.length}</strong></p>
                    <div className="score-meter">
                        <div className="meter-fill" style={{ width: `${(score / questions.length) * 100}%` }}></div>
                    </div>
                    <p className="result-feedback">
                        {score === questions.length ? "Exceptional work! You have mastered this intelligence node." :
                            score >= questions.length / 2 ? "Well done. You have a solid grasp of these core principles." :
                                "Knowledge layer identified. Re-reading the documentation is recommended to minimize risk."}
                    </p>
                    <button className="btn-primary" onClick={resetQuiz}><RotateCcw size={18} /> Restart Knowledge Check</button>
                </div>
            </section>
        );
    }

    const currentQ = questions[currentStep];

    return (
        <section className="quiz-section glass">
            <div className="quiz-header-top">
                <div className="quiz-title-group">
                    <HelpCircle size={20} className="text-secondary" />
                    <h3>Test Your Understanding</h3>
                </div>
                <div className="step-count">Question {currentStep + 1} of {questions.length}</div>
            </div>

            <div className="quiz-body-wizard">
                <div className="question-text-large">{currentQ.question}</div>

                <div className="options-list">
                    {currentQ.options.map((opt) => (
                        <button
                            key={opt}
                            className={`option-btn ${selectedOption === opt ? 'selected' : ''} ${isAnswered && opt === currentQ.answer ? 'correct' : ''} ${isAnswered && selectedOption === opt && opt !== currentQ.answer ? 'wrong' : ''}`}
                            onClick={() => handleOptionSelect(opt)}
                            disabled={isAnswered}
                        >
                            <span className="bullet">{String.fromCharCode(65 + currentQ.options.indexOf(opt))}</span>
                            {opt}
                        </button>
                    ))}
                </div>

                {isAnswered && (
                    <div className="explanation-bubble fade-in">
                        <div className={`status-tag ${selectedOption === currentQ.answer ? 'success' : 'error'}`}>
                            {selectedOption === currentQ.answer ? "✓ Correct" : "✕ Incorrect"}
                        </div>
                        <p>{currentQ.explanation}</p>
                    </div>
                )}
            </div>

            <div className="quiz-footer-nav">
                {!isAnswered ? (
                    <button className="btn-primary" onClick={handleVerify} disabled={selectedOption === null}>
                        Verify Answer
                    </button>
                ) : (
                    <button className="btn-primary" onClick={handleNext}>
                        {currentStep === questions.length - 1 ? "Finish Check" : "Next Question"} <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </section>
    );
};

const Encyclopedia = () => {
    const { mode } = useModeStore();
    const navigate = useNavigate();
    const [activeCat, setActiveCat] = useState('BlockchainFoundations');

    // Safety fallback for categories that might not have the current mode's data yet
    const topic = encyclopediaData[activeCat][mode] || encyclopediaData[activeCat]['Beginner'];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [activeCat]);

    const getIcon = (cat) => {
        switch (cat) {
            case 'BlockchainFoundations': return <Database size={16} />;
            case 'CryptographyAndSecurity': return <Shield size={16} />;
            case 'DeFiEcosystems': return <Activity size={16} />;
            case 'NetworkArchitecture': return <LayersIcon size={16} />;
            case 'EconomicsAndTokenomics': return <Zap size={16} />;
            case 'AdvancedConsensus': return <Fingerprint size={16} />;
            case 'Layer2Scaling': return <Rocket size={16} />;
            case 'IdentityAndOracles': return <Compass size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const formatCategoryName = (name) => {
        return name.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <div className={`library encyclopedia fade-in mode-${mode.toLowerCase()}`}>
            <div className="page-header encyclopedia-header-slim">
                <div className="workspace-tools-left">
                    <h1>World Encyclopedia <span>Knowledge Node v3.0</span></h1>
                </div>
                <div className="library-actions">
                    <div className="search-pill glass">
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder={`Search ${mode} repository...`} />
                    </div>
                </div>
            </div>

            <div className="library-layout">
                <aside className="library-sidebar">
                    <div className="category-list glass">
                        <h3>Knowledge Nodes</h3>
                        <div className="sidebar-scroll-area">
                            {Object.keys(encyclopediaData).map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-item-clean ${activeCat === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCat(cat)}
                                >
                                    <span className="icon-box">
                                        {getIcon(cat)}
                                    </span>
                                    <span className="cat-name">{formatCategoryName(cat)}</span>
                                    <ChevronRight size={14} className="arrow" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="verification-status glass">
                        <h4>Integrity Pulse</h4>
                        <div className="pulse-item">
                            <CheckCircle size={16} color="#10b981" />
                            <span>Verified: {mode} Layer</span>
                        </div>
                        <div className="academic-seal">
                            <Binary size={40} className="seal-bg" />
                            <div className="seal-text">Peer Reviewed</div>
                        </div>
                    </div>
                </aside>

                <main className="library-main long-reading">
                    <article className="topic-content glass">
                        <div className="content-header-integrated">
                            <div className="header-nav" style={{ justifyContent: 'flex-end' }}>
                                <div className="header-status">
                                    <div className={`mode-pill ${mode.toLowerCase()}`}>
                                        <Target size={12} /> {mode} intelligence
                                    </div>
                                </div>
                            </div>

                            <div className="topic-hero-integrated">
                                <span className="topic-category">{formatCategoryName(activeCat)}</span>
                                <h1 className="reading-title">{formatCategoryName(activeCat)}</h1>
                                <div className="reading-meta">
                                    <span><Clock size={14} /> 12 min read</span>
                                    <span><BookOpen size={14} /> Comprehensive Guide</span>
                                </div>
                            </div>
                        </div>

                        <div className="article-body">
                            <section className="article-section intro-section">
                                <p className="wiki-intro">{topic.overview}</p>
                            </section>

                            <section className="article-section">
                                <h2>1. Historical Context</h2>
                                <p>{topic.history}</p>
                            </section>

                            <section className="article-section">
                                <h2>2. Core Principles</h2>
                                <p>{topic.principles}</p>
                            </section>

                            <div className="infobox-callout glass">
                                <h3><Database size={18} /> Technical Mechanism</h3>
                                <p>{topic.mechanism}</p>
                            </div>

                            <section className="article-section">
                                <h2>3. Real-World Applications</h2>
                                <p>{topic.usage}</p>
                            </section>

                            <section className="article-section risk-advisory">
                                <h2>4. Critical Risks & Boundaries</h2>
                                <div className="risk-content">
                                    <AlertCircle size={20} className="text-error" />
                                    <p>{topic.risks}</p>
                                </div>
                            </section>

                            <section className="article-section">
                                <h2>5. Modern Developments</h2>
                                <p>{topic.developments}</p>
                            </section>

                            <section className="article-references">
                                <h2>Notes & References</h2>
                                <div className="references-grid">
                                    {topic.references.map((ref, idx) => (
                                        <div key={idx} className="ref-item">
                                            <span className="ref-num">[{idx + 1}]</span>
                                            <span className="ref-text">{ref}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </article>

                    <KnowledgeCheck questions={topic.quiz} mode={mode} />
                </main>
            </div>
        </div>
    );
};

export default Encyclopedia;

