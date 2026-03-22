import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
                        <div className="flex flex-col items-start w-full">

                            {/* Left Column */}
                            <div className="flex flex-col items-start gap-6 w-full">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 transition-all duration-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    <span className="text-xs font-semibold text-blue-400/90 tracking-widest uppercase">
                                        CryptoWorld OS v2.0
                                    </span>
                                </div>

                                {/* Heading */}
                                <h1 className="hero-main-heading">
                                    <span>National-Grade Blockchain</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 ml-4">
                                        Forensic Intelligence
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="text-slate-400/90 text-[18px] leading-[1.6] max-w-[620px] font-medium m-0">
                                    A high-fidelity surveillance ecosystem for government agencies and enforcement units. Access structured forensic mapping, autonomous illicit activity detection, and institutional-grade risk assessment.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <Link to="/government" className="standard-btn bg-[#2563eb] text-white font-bold text-lg hover:bg-[#1d4ed8] transition-all duration-300 gap-3 no-underline">
                                        Enforcement Portal <ArrowRight size={22} strokeWidth={2.5} />
                                    </Link>
                                    <Link to="/blockchain-hub" className="standard-btn border border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md gap-2 no-underline">
                                        Blockchain Hub
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-8 border-t border-white/5 pt-8 mt-6 w-full">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-[28px] font-black leading-none">12.4M</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Entities Monitored</span>
                                    </div>
                                    <div className="stat-divider hidden md:block"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-[28px] font-black leading-none">842</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Investigation Cases</span>
                                    </div>
                                    <div className="stat-divider hidden md:block"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-[28px] font-black leading-none">AML100</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Compliance Score</span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* The Pillars of Intelligence Section */}
            <section className="learning-matrix-section">
                <div className="hero-centered-layout py-16 px-4 sm:px-6 lg:px-8">
                    <div className="hero-inner flex-col">
                        <div className="flex flex-col items-start text-left gap-6 mb-16 border-b border-white/5 pb-12 w-full max-w-4xl">
                            <div className="flex flex-col items-start gap-4">
                                <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.3em] block">Intelligence Pipeline</span>
                                <h2 className="text-white text-[48px] lg:text-[56px] font-black leading-tight tracking-tight m-0">
                                    <span className="mr-0">Operational</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 ml-4">Intelligence Flow</span>
                                </h2>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xl leading-relaxed font-medium m-0">
                                    The global standard for blockchain surveillance: Track → Detect → Investigate → Act.
                                </p>
                            </div>
                        </div>

                        <div className="responsive-grid">
                            {[
                                { title: '1. Track', desc: 'Real-time monitoring of global blockchain activity and institutional-grade node surveillance.', link: '/mempool' },
                                { title: '2. Detect', desc: 'AI-based anomaly and fraud detection systems flagging suspicious financial patterns.', link: '/tools/signals' },
                                { title: '3. Investigate', desc: 'Deep forensic analysis and visualization tools for case management and entity linking.', link: '/tools/visualizer' },
                                { title: '4. Legalize', desc: 'Generate court-ready evidence, immutable audit trails, and global regulatory compliance reports.', link: '/compliance' }
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    className="standard-card hover:bg-slate-900/40 hover:border-blue-500/30 transition-all duration-500 cursor-pointer group no-underline flex flex-col items-start gap-4 h-full"
                                >
                                    <h3 className="text-white text-2xl font-bold m-0">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed m-0 flex-1">{item.desc}</p>
                                    <div className="flex items-center gap-3 text-blue-400 font-bold group-hover:gap-5 transition-all mt-4">
                                        Initialize Protocol <ArrowRight size={20} />
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
