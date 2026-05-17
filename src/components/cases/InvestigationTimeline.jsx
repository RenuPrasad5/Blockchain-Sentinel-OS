import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, FileText, Crosshair, Tag, Download, Search, Clock } from 'lucide-react';
import { getCaseAuditTrail } from '../../services/AuditService';
import './InvestigationTimeline.css';

const EVENT_ICONS = {
    'WALLET_QUERIED': <Search size={12} />,
    'TRACE_STARTED': <Crosshair size={12} />,
    'REPORT_GENERATED': <FileText size={12} />,
    'RISK_FLAGGED': <ShieldAlert size={12} />,
    'INVESTIGATION_CREATED': <Activity size={12} />,
    'NOTES_ADDED': <FileText size={12} />,
    'ENTITY_LABELED': <Tag size={12} />,
    'EVIDENCE_EXPORTED': <Download size={12} />
};

const CATEGORY_MAP = {
    'WALLET_QUERIED': 'TRACE',
    'TRACE_STARTED': 'TRACE',
    'REPORT_GENERATED': 'REPORT',
    'RISK_FLAGGED': 'ALERT',
    'INVESTIGATION_CREATED': 'INVESTIGATION',
    'NOTES_ADDED': 'INVESTIGATION',
    'ENTITY_LABELED': 'ENTITY FLAG',
    'EVIDENCE_EXPORTED': 'EVIDENCE'
};

const InvestigationTimeline = ({ caseId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEventId, setExpandedEventId] = useState(null);

    useEffect(() => {
        if (!caseId) return;
        
        const fetchTimeline = async () => {
            setLoading(true);
            const logs = await getCaseAuditTrail(caseId);
            setEvents(logs);
            setLoading(false);
        };

        fetchTimeline();
    }, [caseId]);

    const toggleExpand = (id) => {
        setExpandedEventId(expandedEventId === id ? null : id);
    };

    const getRiskClass = (level) => {
        if (level === 'High') return 'risk-high';
        if (level === 'Medium') return 'risk-medium';
        return '';
    };

    if (loading) {
        return <div className="case-timeline-container text-center py-4 text-slate-500 font-mono text-xs">SYNCHRONIZING TIMELINE...</div>;
    }

    if (events.length === 0) {
        return (
            <div className="case-timeline-container">
                <div className="empty-timeline">
                    <Activity size={24} className="mx-auto mb-2 opacity-30" />
                    No forensic events recorded for this case yet.
                </div>
            </div>
        );
    }

    return (
        <div className="case-timeline-container">
            <h4 className="case-timeline-title">
                <Clock size={14} className="text-blue-400" />
                Chain of Investigation Activity
            </h4>
            
            <div className="case-timeline">
                <AnimatePresence>
                    {events.map((evt, idx) => (
                        <motion.div 
                            key={evt._id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`timeline-event-item ${getRiskClass(evt.riskLevel)}`}
                        >
                            <div className="timeline-dot"></div>
                            <div 
                                className="timeline-event-content"
                                onClick={() => toggleExpand(evt._id || idx)}
                            >
                                <div className="timeline-event-header">
                                    <div className="timeline-event-type">
                                        {EVENT_ICONS[evt.eventType] || <Activity size={12} />}
                                        {CATEGORY_MAP[evt.eventType] || 'INVESTIGATION'}
                                    </div>
                                    <div className="timeline-event-time">
                                        {new Date(evt.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div className="timeline-event-summary">
                                    {evt.actionSummary}
                                </div>
                                
                                <AnimatePresence>
                                    {expandedEventId === (evt._id || idx) && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="timeline-event-details overflow-hidden"
                                        >
                                            <div className="timeline-event-meta">
                                                {evt.investigatorId && (
                                                    <span>Agent UID: <code>{evt.investigatorId.substring(0, 8)}</code></span>
                                                )}
                                                {evt.riskLevel && (
                                                    <span>Severity: <span className={evt.riskLevel === 'High' ? 'text-rose-400' : 'text-blue-400'}>{evt.riskLevel}</span></span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InvestigationTimeline;
