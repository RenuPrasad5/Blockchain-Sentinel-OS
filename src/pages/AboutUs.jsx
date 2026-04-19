import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const TerminalIntro = ({ onComplete }) => {
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState(0);
    const terminalLines = [
        "> INITIALIZING_SYSTEM_BOOT...",
        "> LOADING_CRYPTOGRAPHIC_FRAMEWORKS...",
        "> ESTABLISHING_NEURAL_RESEACH_NODE...",
        "> ACCESS_GRANTED: WELCOME_TO_Blockchain Intelligence",
        "> DECODING_VISION..."
    ];

    useEffect(() => {
        if (currentLine < terminalLines.length) {
            const timer = setTimeout(() => {
                setLines(prev => [...prev, terminalLines[currentLine]]);
                setCurrentLine(prev => prev + 1);
            }, 400);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(onComplete, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentLine, onComplete]);

    return (
        <motion.div
            className="terminal-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <div className="terminal-content">
                {lines.map((line, i) => (
                    <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {line}
                    </motion.p>
                ))}
                <motion.div
                    className="cursor"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                />
            </div>
        </motion.div>
    );
};

const SectionReveal = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`section-dense ${className}`}
        >
            {children}
        </motion.div>
    );
};

const LiveStat = ({ value, suffix = "+", label }) => {
    const [count, setCount] = useState(parseInt(value.replace(/\D/g, '')));

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 2));
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    const displayValue = value.includes('K') ? `${count}K${suffix}` : `${count}${suffix}`;

    return (
        <div className="stat-unit">
            <span className="stat-value flicker-text">{displayValue}</span>
            <span className="stat-desc">{label}</span>
        </div>
    );
};

const AboutUs = () => {
    const navigate = useNavigate();
    const [showIntro, setShowIntro] = useState(true);
    const { scrollYProgress } = useScroll();

    // Scale timeline line as user scrolls
    const lineHeight = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-us-page">
            {/* Header with Back Button */}


            <AnimatePresence>
                {showIntro && <TerminalIntro onComplete={() => setShowIntro(false)} />}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="about-hero">
                <motion.div
                    className="hero-glow"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.08, 0.12, 0.08]
                    }}
                    transition={{ repeat: Infinity, duration: 10 }}
                />
                <motion.h1
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                >
                    Architecture of<br />Digital Truth.
                </motion.h1>
                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    Blockchain Intelligence is not a platform. It is a commitment to the clarity, intelligence, and long-term
                    understanding required to navigate the frontier of decentralized finance.
                </motion.p>

                <motion.div
                    className="scroll-indicator"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="mouse-wheel" />
                </motion.div>
            </section>

            {/* Redesigned Manifesto Section */}
            <SectionReveal className="manifesto-section">
                <div className="manifesto-intro">
                    <div className="section-label">THE SIGNAL</div>
                    <h2 className="section-title">Moving Beyond the Noise.</h2>
                    <p>In a world of constant digital turbulence, we seek the signal within the chaos.</p>
                </div>

                <div className="manifesto-blocks-container">
                    <div className="manifesto-block">
                        <motion.div
                            className="block-hover-effect"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                        />
                        <h3>Comprehension is the final barrier to adoption.</h3>
                        <p>
                            The crypto industry moves at a speed that often outpaces our ability to understand it.
                            In the rush for yield and the frenzy of price action, the fundamental architectural shifts
                            are often ignored.
                        </p>
                    </div>

                    <div className="manifesto-block">
                        <motion.div
                            className="block-hover-effect"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                        />
                        <h3>Our Institutional Purpose</h3>
                        <p>
                            To create a permanent research node in the cryptographic ecosystem. A place where
                            builders and investors can find un-biased, deep-dive intelligence that treats protocols
                            as technical systems.
                        </p>
                    </div>
                </div>
            </SectionReveal>

            {/* Company Journey */}
            <section className="about-sections-wrapper">
                <div className="about-journey-section">
                    <SectionReveal>
                        <div className="section-label">THE CHRONICLES</div>
                        <h2 className="section-title">The Company Journey</h2>
                    </SectionReveal>

                    <div className="journey-timeline">
                        <motion.div
                            className="timeline-progress-line"
                            style={{ height: lineHeight }}
                        />
                        <div className="journey-item group">
                            <SectionReveal className="journey-item-reveal">
                                <div className="journey-year">2024</div>
                                <div className="journey-content">
                                    <h3>Genesis Proto-Node</h3>
                                    <p>Launched as a specialized research hub for internal protocol auditing and data normalization.</p>
                                </div>
                                <div className="timeline-tooltip glass">Initial Alpha Node Deployed</div>
                            </SectionReveal>
                        </div>
                        <div className="journey-item group">
                            <SectionReveal className="journey-item-reveal">
                                <div className="journey-year">2025</div>
                                <div className="journey-content">
                                    <h3>Ecosystem Expansion</h3>
                                    <p>Opened our neural knowledge graph to the public, providing institutional-grade tools to retail analysts.</p>
                                </div>
                                <div className="timeline-tooltip glass">Successfully indexed 5M+ transactions across 4 chains</div>
                            </SectionReveal>
                        </div>
                        <div className="journey-item group">
                            <SectionReveal className="journey-item-reveal">
                                <div className="journey-year">PRESENT</div>
                                <div className="journey-content">
                                    <h3>The Master Terminal</h3>
                                    <p>Evolved into a complete crypto education ecosystem, mapping the architectural future of finance.</p>
                                </div>
                                <div className="timeline-tooltip glass">Real-Time Core v1.0 Live</div>
                            </SectionReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Purpose & Goal */}
            <SectionReveal className="about-purpose-section">
                <div className="purpose-grid">
                    <motion.div
                        className="purpose-card"
                        whileHover={{ y: -10, borderColor: "rgba(99, 102, 241, 0.4)" }}
                    >
                        <div className="purpose-icon">🎯</div>
                        <h3>Our Goal</h3>
                        <p>To eliminate information asymmetry and empower a new generation of informed crypto participants.</p>
                    </motion.div>
                    <motion.div
                        className="purpose-card highlight"
                        whileHover={{ y: -10 }}
                    >
                        <div className="purpose-icon">⚡</div>
                        <h3>Our Purpose</h3>
                        <p>A world where decentralized finance is understood with the same rigour as traditional physics.</p>
                    </motion.div>
                </div>
            </SectionReveal>

            {/* Founders Section */}
            <section className="about-founders-section">
                <div className="section-header-centered">
                    <div className="section-label">OS_DEVELOPMENT_TEAM</div>
                    <h2 className="section-title">Behind the Code</h2>
                </div>

                <div className="founders-grid">
                    {/* Card 1: Founder */}
                    <motion.div
                        className="founder-card"
                        whileHover={{ y: -8 }}
                    >
                        <div className="card-top-label">FOUNDER</div>
                        <div className="founder-visual">
                            <div className="founder-image-box flex items-center justify-center bg-white/5">
                                <User size={48} className="text-indigo-400 opacity-50" />
                                <div className="founder-overlay-glow"></div>
                            </div>
                            <span className="founder-role-tag">LEAD_ENGINEER</span>
                        </div>
                        <div className="founder-info">
                            <h3>System Architect</h3>
                            <p>"Focused on the Neuro Knowledge Graph and Multi-Chain Forensic mapping. I build the infrastructure that translates blockchain noise into human-readable digital truth."</p>
                        </div>
                    </motion.div>

                    {/* Card 2: Co-Founder */}
                    <motion.div
                        className="founder-card"
                        whileHover={{ y: -8 }}
                    >
                        <div className="card-top-label">CO-FOUNDER</div>
                        <div className="founder-visual">
                            <div className="founder-image-box flex items-center justify-center bg-white/5">
                                <User size={48} className="text-indigo-400 opacity-50" />
                                <div className="founder-overlay-glow"></div>
                            </div>
                            <span className="founder-role-tag">INTEL_OPS</span>
                        </div>
                        <div className="founder-info">
                            <h3>Intelligence & Operations Lead</h3>
                            <p>"Building our 'Whale Watch Intent' Engine and forging partnerships with institutional users. I ensure our intelligence solves real-world compliance and risk pain points."</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Offerings */}
            <section className="about-offerings-section">
                <SectionReveal>
                    <div className="section-label">CORE CAPABILITIES</div>
                    <h2 className="section-title">Our Offerings</h2>
                </SectionReveal>
                <div className="offerings-grid">
                    {[
                        { id: '01', title: "Deep-Dive Research", text: "100+ page protocol audits that dissect tokenomics, code, and narrative risks." },
                        { id: '02', title: "Institutional Tools", text: "Proprietary analytics engines for on-chain movement and market intelligence." },
                        { id: '03', title: "Curated Education", text: "Structured learning paths designed by industry experts to take you from zero to master master." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="offering-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="offering-num">{item.id}</div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Achievements & Achievements */}
            <SectionReveal className="about-achievements-section">
                <div className="achievements-stat-grid">
                    <LiveStat value="50K+" label="Analyzed Protocols" />
                    <LiveStat value="1,200+" label="Active Sentinels" />
                    <LiveStat value="1M+" label="Query Requests" />
                </div>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p>"Blockchain Intelligence turned the noise of CT into a clear, actionable signal. Their research is unmatched."</p>
                        <div className="testimonial-author">— Institutional Analyst, NY</div>
                    </div>
                    <div className="testimonial-card">
                        <p>"The only platform that explains the 'why' behind the protocol, not just the 'what'."</p>
                        <div className="testimonial-author">— DeFi Developer, Berlin</div>
                    </div>
                </div>
            </SectionReveal>

            {/* Future Vision */}
            <SectionReveal className="about-future-section">
                <div className="future-content">
                    <div className="section-label">THE HORIZON</div>
                    <h2>Our Future Vision</h2>
                    <p>
                        Integrating AI-driven predictive modeling with on-chain reality to create
                        the world's first preventative risk node for decentralized finance.
                        The frontier is just beginning.
                    </p>
                </div>
            </SectionReveal>

            {/* Call to Action */}
            <SectionReveal className="about-cta-section">
                <motion.div
                    className="cta-box glass"
                    whileHover={{ scale: 1.02 }}
                >
                    <h2>Ready to explore the architecture?</h2>
                    <p>Join the thousands of analysts who are building the future with Blockchain Intelligence.</p>
                    <motion.button
                        className="cta-btn-premium glow-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                    >Launch Command Center →</motion.button>
                </motion.div>
            </SectionReveal>

            <footer className="manifesto-footer">
                EST. 2024 // Blockchain Intelligence ECOSYSTEM PROTOCOL // DOCUMENT_v1.0
            </footer>
        </div>
    );
};

export default AboutUs;
