import React, { useState } from 'react';
import { Mail, Phone, Clock, ShieldAlert, HelpCircle, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './SupportSection.css';

const SupportSection = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        issueType: 'Bug Report',
        message: ''
    });

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'support_issues'), {
                ...formData,
                type: 'report_issue',
                createdAt: serverTimestamp()
            });
            alert('Issue reported successfully!');
            setIsModalOpen(false);
            setFormData({ email: '', issueType: 'Bug Report', message: '' });
        } catch (error) {
            console.error("Error reporting issue: ", error);
            alert('Error reporting issue. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="support-section" className="support-section container">
            <div className="support-wrapper">
                <div className="support-grid">
                    {/* Left Side: Support Info */}
                    <div className="support-info">
                        <div className="support-header">
                            <span className="support-badge">Global Support</span>
                            <h2 className="support-title">Blockchain Intelligence Support & Help Desk</h2>
                            <p className="support-desc">
                                Institutional intelligence requires professional assistance. Our dedicated team is available for high-priority inquiries.
                            </p>
                        </div>

                        <div className="info-list">
                            <div className="info-item">
                                <div className="info-icon">
                                    <Mail size={20} />
                                </div>
                                <div className="info-content">
                                    <label>Email Intelligence</label>
                                    <p>support@Blockchain Intelligence.int</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <Phone size={20} />
                                </div>
                                <div className="info-content">
                                    <label>Institutional Line</label>
                                    <p>+1 (888) CRYPTO-RE</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">
                                    <Clock size={20} />
                                </div>
                                <div className="info-content">
                                    <label>Availability</label>
                                    <p>24/7 Priority Support Desk</p>
                                </div>
                            </div>
                        </div>

                        <div className="security-notice">
                            <ShieldAlert size={18} className="security-icon" />
                            <p>
                                <strong>Security Protocol:</strong> Blockchain Intelligence analysts will <strong>never</strong> request your private keys, seed phrases, or password via any support channel.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Two Cards */}
                    <div className="support-categories">
                        <div className="category-grid">
                            <div className="category-card">
                                <HelpCircle className="category-icon" />
                                <h3>Help Center</h3>
                                <p>Access deep documentation and specialized assistance pools.</p>
                                <button
                                    className="category-btn"
                                    onClick={() => navigate('/help-center')}
                                >
                                    Open Center
                                </button>
                            </div>
                            <div className="category-card">
                                <FileText className="category-icon" />
                                <h3>Report Issue</h3>
                                <p>Direct transmission for bug reports or technical anomalies.</p>
                                <button
                                    className="category-btn"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Report Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Issue Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2 className="modal-title">Report Issue</h2>
                        <p className="modal-desc">Provide details regarding the technical encounter.</p>

                        <form onSubmit={handleReportSubmit}>
                            <div className="form-group">
                                <label>Institutional Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    required
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Issue Categorization</label>
                                <select
                                    className="form-select"
                                    value={formData.issueType}
                                    onChange={e => setFormData({ ...formData, issueType: e.target.value })}
                                >
                                    <option>Bug Report</option>
                                    <option>Technical Error</option>
                                    <option>Data Anomaly</option>
                                    <option>Access Issue</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Detailed Intelligence</label>
                                <textarea
                                    className="form-textarea"
                                    required
                                    placeholder="Describe the issue in detail..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Transmitting...' : 'Submit Report'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SupportSection;
