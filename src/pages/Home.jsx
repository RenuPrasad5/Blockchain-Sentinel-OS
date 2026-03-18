import React from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart,
    ShieldCheck,
    Database,
    ArrowRight,
    TrendingUp,
    Radar,
    Share2
} from 'lucide-react';
import RoadmapSection from '../components/RoadmapSection';
import SupportSection from '../components/SupportSection';
import ServiceMarquee from '../components/ServiceMarquee';
import NeuralDataNetwork from '../components/ui/NeuralDataNetwork';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <NeuralDataNetwork />
            
            {/* Institutional Research Hero */}
            <section className="hero-section">
                <div className="hero-centered-layout">
                    <div className="hero-inner">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                            {/* Left Column */}
                            <div className="flex flex-col items-start gap-6 w-full">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 transition-all duration-300">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    <span className="text-xs font-semibold text-indigo-400/90 tracking-widest uppercase">
                                        Real-Time Intelligence OS v1.0
                                    </span>
                                </div>

                                {/* Heading */}
                                <h1 className="hero-main-heading">
                                    <span>The Neural Engine</span>
                                    <span className="flex items-center">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">For On-Chain Intelligence</span>
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="text-slate-400/90 text-[18px] leading-[1.6] max-w-[580px] font-medium m-0">
                                    A high-fidelity surveillance ecosystem for professionals. Access structured forensic mapping, autonomous whale tracking, and institutional-grade analysis tools.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <Link to="/dashboard" className="standard-btn bg-[#6366f1] text-white font-bold text-lg hover:bg-[#4f46e5] transition-all duration-300 gap-3 no-underline">
                                        Launch Command Center <ArrowRight size={22} strokeWidth={2.5} />
                                    </Link>
                                    <Link to="/tools" className="standard-btn border border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md gap-2 no-underline">
                                        Intelligence Sectors
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-8 border-t border-white/5 pt-8 mt-6 w-full">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-[28px] font-black leading-none">$4.2B</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">24h Volume Tracked</span>
                                    </div>
                                    <div className="stat-divider hidden md:block"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-[28px] font-black leading-none">1,840</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Active Sentinels</span>
                                    </div>
                                    <div className="stat-divider hidden md:block"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-[28px] font-black leading-none">&lt;12ms</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Data Latency</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Floating Cards */}
                            <div className="hero-cards-col relative w-full min-w-[300px]">

                                {/* Intelligence Card - Top Right */}
                                <div 
                                    className="standard-card flex items-center gap-5 z-20 w-[300px] sm:w-[320px] animate-float cursor-pointer hover:bg-slate-900/40" 
                                    style={{ animationDelay: '0s' }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                        <LineChart size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] m-0">Intelligence</p>
                                        <p className="text-white text-lg font-extrabold m-0">Sector Gamma</p>
                                    </div>
                                </div>

                                {/* Verification Card - Middle Right */}
                                <div 
                                    className="standard-card flex items-center gap-5 z-20 w-[300px] sm:w-[320px] animate-float cursor-pointer hover:bg-slate-900/40" 
                                    style={{ animationDelay: '2s' }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                        <ShieldCheck size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] m-0">Verification</p>
                                        <p className="text-white text-lg font-extrabold m-0">Editor Approved</p>
                                    </div>
                                </div>

                                {/* Archival Card - Bottom Right */}
                                <div 
                                    className="standard-card flex items-center gap-5 z-20 w-[300px] sm:w-[320px] animate-float cursor-pointer hover:bg-slate-900/40" 
                                    style={{ animationDelay: '4s' }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                                        <Database size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] m-0">Archival State</p>
                                        <p className="text-white text-lg font-extrabold m-0">Immutable</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Pillars of Intelligence Section */}
            <section className="learning-matrix-section">
                <div className="hero-centered-layout py-32 px-4 sm:px-6 lg:px-8">
                    <div className="hero-inner">
                        <div className="flex flex-col gap-6 mb-16 border-b border-white/5 pb-12 w-full">
                            <div className="flex flex-col gap-4">
                                <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.3em] block">System Architecture</span>
                                <h2 className="text-white text-[48px] lg:text-[56px] font-black leading-tight tracking-tight m-0">
                                    <span className="mr-4">The</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Research Pillars</span>
                                </h2>
                            </div>
                            <div className="max-w-2xl">
                                <p className="text-slate-400 text-xl leading-relaxed font-medium m-0">
                                    A multidimensional knowledge model designed for analysts, developers, and institutional researchers.
                                </p>
                            </div>
                        </div>

                        <div className="responsive-grid">
                            {[
                                { title: 'Knowledge', desc: 'Deep structured encyclopedia of crypto, blockchain, and decentralized architectures.', link: '/encyclopedia' },
                                { title: 'Research', desc: 'Granular protocol breakdowns, tokenomics models, and risk architecture analysis.', link: '/research' },
                                { title: 'Community', desc: 'Peer review systems, expert validation, and collaborative article improvement.', link: '/community' },
                                { title: 'Trust Layer', desc: 'Immutable source references, editor verification, and community truth scores.', link: '/trust' }
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    className="standard-card hover:bg-slate-900/40 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer group no-underline flex flex-col items-start gap-4 h-full"
                                >
                                    <h3 className="text-white text-2xl font-bold m-0">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed m-0 flex-1">{item.desc}</p>
                                    <div className="flex items-center gap-3 text-indigo-400 font-bold group-hover:gap-5 transition-all mt-4">
                                        Initialize Node <ArrowRight size={20} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-full max-w-full overflow-hidden">
                <RoadmapSection />
            </div>
            
            <div className="w-full max-w-full overflow-hidden">
                <ServiceMarquee />
            </div>

            <div className="w-full max-w-full overflow-hidden">
                <SupportSection />
            </div>
        </div>
    );
};

export default Home;
