import React from 'react';
import { Shield, Zap, Globe, Lock, Database, Search } from 'lucide-react';
import './ServiceMarquee.css';

const ServiceMarquee = () => {
    const services = [
        { icon: <Shield size={20} />, label: "Smart Contract Audits" },
        { icon: <Zap size={20} />, label: "Real-time Mempool" },
        { icon: <Globe size={20} />, label: "Cross-chain Intelligence" },
        { icon: <Lock size={20} />, label: "Private Key Custody" },
        { icon: <Database size={20} />, label: "Historical On-chain Data" },
        { icon: <Search size={20} />, label: "Forensic Triage" }
    ];

    // Standard loop duplication
    const displayServices = [...services, ...services, ...services, ...services];

    return (
        <section className="service-marquee-section">
            <div className="marquee-container">
                <div className="marquee-track">
                    {displayServices.map((service, index) => (
                        <div key={index} className="service-item">
                            <span className="service-icon">{service.icon}</span>
                            <span className="service-label">{service.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceMarquee;
