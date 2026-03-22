import React from 'react';
import { Shield, Zap, Globe, Lock, Database, Search } from 'lucide-react';
import './ServiceMarquee.css';

const ServiceMarquee = () => {
    const services = [
        { icon: <Shield size={24} />, label: "Smart Contract Audits" },
        { icon: <Zap size={24} />, label: "Real-time Mempool" },
        { icon: <Globe size={24} />, label: "Cross-chain Intelligence" },
        { icon: <Lock size={24} />, label: "Private Key Custody" },
        { icon: <Database size={24} />, label: "Historical On-chain Data" },
        { icon: <Search size={24} />, label: "Forensic Triage" }
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
