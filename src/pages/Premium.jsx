import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check,
    Shield,
    Zap,
    Crown,
    ArrowRight
} from 'lucide-react';
import './Premium.css';

const Premium = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

    const plans = [
        {
            name: 'Sentry',
            priceMonthly: 0,
            priceAnnual: 0,
            icon: <Shield size={24} />,
            features: [
                'Basic Wallet Watch (up to 3)',
                '1-hr Data Refresh Lag',
                'Standard Community Support'
            ],
            buttonText: 'Current Plan',
            buttonClass: 'btn-outlined',
            cardClass: ''
        },
        {
            name: 'Alpha Sentinel',
            priceMonthly: 49,
            priceAnnual: 39,
            icon: <Zap size={24} className="text-purple" />,
            features: [
                'Unlimited Wallet Watchers',
                'Real-time Mempool Alerts',
                'Priority Support'
            ],
            buttonText: 'Upgrade Now',
            buttonClass: 'btn-gradient',
            cardClass: 'hero',
            isHero: true
        },
        {
            name: 'Guardian',
            priceMonthly: 199,
            priceAnnual: 159,
            icon: <Crown size={24} />,
            features: [
                'FIU-IND Ready Audit Reports',
                'Bulk Forensic Triage',
                'Institutional-grade Forensics'
            ],
            buttonText: 'Contact Sales',
            buttonClass: 'btn-outlined',
            cardClass: 'guardian'
        }
    ];

    return (
        <div className="premium-page fade-in">
            {/* Header */}
            <div className="premium-header">
                <h1>Upgrade Forensic Status</h1>
                <p>Experience the most powerful real-time blockchain intelligence platform ever built.</p>
            </div>

            {/* Pricing Toggle */}
            <div className="toggle-wrapper">
                <div
                    className="toggle-pill"
                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                >
                    <div className={`toggle-slider ${billingCycle === 'annual' ? 'annual' : ''}`}></div>
                    <div className={`toggle-item ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</div>
                    <div className={`toggle-item ${billingCycle === 'annual' ? 'active' : ''}`}>Annual</div>
                </div>
                <div className="save-badge">Save 20%</div>
            </div>

            {/* Pricing Grid */}
            <div className="pricing-grid">
                {plans.map((plan, index) => (
                    <div key={index} className={`pricing-card ${plan.cardClass}`}>
                        {plan.isHero && <div className="neon-badge">MOST POPULAR</div>}

                        <div className="card-header">
                            <div className="plan-icon" style={{ color: plan.isHero ? '#8B5CF6' : '#94A3B8' }}>
                                {plan.icon}
                            </div>
                            <div className="plan-name">{plan.name}</div>
                            <div className="plan-price">
                                <span>${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual}</span>
                                <span className="price-period">/mo</span>
                            </div>
                        </div>

                        <ul className="feature-list">
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className="feature-item">
                                    <Check className="check-icon" size={18} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`plan-button ${plan.buttonClass}`}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Premium;
