import React from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart,
    ShieldCheck,
    Database,
    ArrowRight
} from 'lucide-react';
import RoadmapSection from '../components/RoadmapSection';
import SupportSection from '../components/SupportSection';
import './Home.css';

const BlockchainNetwork = () => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = window.innerWidth;
            canvas.height = parent.offsetHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 2 + 1
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw edges
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.fillStyle = `rgba(129, 140, 248, 0.4)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
};

const Home = () => {
    return (
        <div className="home-container bg-[#020617]">
            {/* Institutional Research Hero */}
            <section className="relative w-full min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden bg-[#020617]">
                <BlockchainNetwork />

                {/* Visual Glow */}
                <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

                <div className="container max-w-[1440px] px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Column (60%) */}
                        <div className="lg:col-span-7 flex flex-col items-start translate-y-[-10px]">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8 transition-all duration-300">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
                                <span className="text-xs font-semibold text-indigo-400/90 tracking-widest uppercase">
                                    Real-Time Intelligence OS v1.0
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="mb-6">
                                <h1 className="text-white text-[48px] lg:text-[52px] font-[950] leading-[1.15] tracking-tight m-0 uppercase">
                                    The Neural Engine<br />
                                    <svg width="850" height="75" className="inline-block overflow-visible align-top mt-1">
                                        <defs>
                                            <linearGradient id="cryptoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <text x="0" y="60" fill="url(#cryptoGrad)" style={{ fontWeight: 950, fontSize: '52px', fontFamily: 'inherit' }}>For On-Chain Intelligence</text>
                                    </svg>
                                </h1>
                            </div>

                            {/* Description */}
                            <p className="text-slate-400/90 text-[18px] leading-[1.6] max-w-[580px] mb-8 font-medium">
                                A high-fidelity surveillance ecosystem for professionals. Access structured forensic mapping, autonomous whale tracking, and institutional-grade analysis tools.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex items-center gap-6 mb-16">
                                <Link to="/dashboard" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#6366f1] text-white font-bold text-lg hover:bg-[#4f46e5] transition-all duration-300 shadow-[0_8px_25px_rgba(99,102,241,0.4)] btn-glow-indigo">
                                    Launch Command Center <ArrowRight size={22} strokeWidth={2.5} />
                                </Link>
                                <Link to="/tools" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
                                    Intelligence Sectors
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-16 border-t border-white/5 pt-10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-[28px] font-black leading-none">$4.2B</span>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">24h Volume Tracked</span>
                                </div>
                                <div className="w-[1px] h-10 bg-white/10"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-[28px] font-black leading-none">1,840</span>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Active Sentinels</span>
                                </div>
                                <div className="w-[1px] h-10 bg-white/10"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-[28px] font-black leading-none">&lt;12ms</span>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Data Latency</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (40%) - Floating Cards */}
                        <div className="lg:col-span-5 relative h-[500px] w-full flex items-center justify-center">

                            {/* Intelligence Card - Top Right */}
                            <div className="absolute top-[0%] right-[0%] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 shadow-2xl z-20 w-[280px] animate-float">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                    <LineChart size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Intelligence</p>
                                    <p className="text-white text-lg font-extrabold">Sector Gamma</p>
                                </div>
                            </div>

                            {/* Verification Card - Middle Left */}
                            <div className="absolute top-[35%] left-[0%] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 shadow-2xl z-20 w-[280px] animate-float" style={{ animationDelay: '-2.5s' }}>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                    <ShieldCheck size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Verification</p>
                                    <p className="text-white text-lg font-extrabold">Editor Approved</p>
                                </div>
                            </div>

                            {/* Archival Card - Bottom Right */}
                            <div className="absolute bottom-[0%] right-[5%] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 shadow-2xl z-20 w-[280px] animate-float" style={{ animationDelay: '-5s' }}>
                                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                    <Database size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Archival State</p>
                                    <p className="text-white text-lg font-extrabold">Immutable</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* The Pillars of Intelligence Section */}
            <section className="learning-matrix-section relative bg-[#020617] py-32 px-8 overflow-hidden">
                <BlockchainNetwork />
                <div className="container max-w-[1440px] mx-auto">
                    <div className="flex flex-col mb-20 border-b border-white/5 pb-12">
                        <div className="mb-6">
                            <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">System Architecture</span>
                            <h2 className="text-white text-[56px] font-black leading-tight tracking-tight whitespace-nowrap">
                                The <svg width="450" height="70" className="inline-block overflow-visible align-top">
                                    <defs>
                                        <linearGradient id="pillarsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
                                        </linearGradient>
                                    </defs>
                                    <text x="0" y="55" fill="url(#pillarsGrad)" style={{ fontWeight: 900, fontSize: '56px', fontFamily: 'inherit' }}>Research Pillars</text>
                                </svg>
                            </h2>
                        </div>
                        <div className="max-w-2xl">
                            <p className="text-slate-400 text-xl leading-relaxed font-medium">
                                A multidimensional knowledge model designed for analysts, developers, and institutional researchers.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Matrix Cards (Keeping existing structure but cleaning for design) */}
                        {[
                            { title: 'Knowledge', desc: 'Deep structured encyclopedia of crypto, blockchain, and decentralized architectures.', link: '/encyclopedia' },
                            { title: 'Research', desc: 'Granular protocol breakdowns, tokenomics models, and risk architecture analysis.', link: '/research' },
                            { title: 'Community', desc: 'Peer review systems, expert validation, and collaborative article improvement.', link: '/community' },
                            { title: 'Trust Layer', desc: 'Immutable source references, editor verification, and community truth scores.', link: '/trust' }
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.link}
                                className="bg-slate-900/20 backdrop-blur-lg border border-white/5 rounded-3xl p-10 hover:bg-slate-900/40 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer group no-underline block"
                            >
                                <h3 className="text-white text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-8">{item.desc}</p>
                                <div className="flex items-center gap-3 text-indigo-400 font-bold group-hover:gap-5 transition-all">
                                    Initialize Node <ArrowRight size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <RoadmapSection />
            <SupportSection />
        </div>
    );
};

export default Home;
