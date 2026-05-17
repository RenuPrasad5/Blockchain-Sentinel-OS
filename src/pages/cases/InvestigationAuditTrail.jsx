import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    ShieldAlert, 
    Clock, 
    Search, 
    FileText,
    Crosshair,
    Tag,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../../firebase/config';
import { getInvestigationAuditTrail, logInvestigationActivity } from '../../services/AuditService';
import './InvestigationAuditTrail.css';

const EVENT_ICONS = {
    'WALLET_QUERIED': <Search size={14} />,
    'TRACE_STARTED': <Crosshair size={14} />,
    'REPORT_GENERATED': <FileText size={14} />,
    'RISK_FLAGGED': <ShieldAlert size={14} />,
    'INVESTIGATION_CREATED': <Activity size={14} />,
    'NOTES_ADDED': <FileText size={14} />,
    'ENTITY_LABELED': <Tag size={14} />,
    'EVIDENCE_EXPORTED': <Download size={14} />
};

const InvestigationAuditTrail = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchLogs = async () => {
        setLoading(true);
        if (auth.currentUser) {
            const data = await getInvestigationAuditTrail(auth.currentUser.uid);
            setLogs(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, [auth.currentUser]);

    useEffect(() => {
        if (!loading && logs.length === 0 && auth.currentUser) {
            logInvestigationActivity({
                eventType: 'INVESTIGATION_CREATED',
                actionSummary: 'Audit trail initialized for current operational session.',
                riskLevel: 'Low'
            }).then(() => fetchLogs());
        }
    }, [loading, logs.length, auth.currentUser]);

    const filteredLogs = logs.filter(log => filter === 'ALL' || log.eventType === filter || (filter === 'HIGH_RISK' && log.riskLevel === 'High'));

    const getRiskClass = (level) => {
        if (level === 'High') return 'high-risk';
        if (level === 'Medium') return 'medium-risk';
        return '';
    };

    return (
        <div className="audit-trail-wrapper workstation-mode">
            <header className="inv-page-header">
                <div>
                    <div className="inv-page-subtitle">
                        <Activity size={14} className="text-blue-500" />
                        System Logging
                    </div>
                    <h1 className="inv-page-title">Investigation Audit Trail</h1>
                </div>
                <div className="audit-filters">
                    <button className={`audit-filter-btn ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>ALL ACTIVITY</button>
                    <button className={`audit-filter-btn ${filter === 'HIGH_RISK' ? 'active' : ''}`} onClick={() => setFilter('HIGH_RISK')}>CRITICAL</button>
                    <button className={`audit-filter-btn ${filter === 'TRACE_STARTED' ? 'active' : ''}`} onClick={() => setFilter('TRACE_STARTED')}>TRACES</button>
                    <button className={`audit-filter-btn ${filter === 'REPORT_GENERATED' ? 'active' : ''}`} onClick={() => setFilter('REPORT_GENERATED')}>REPORTS</button>
                </div>
            </header>

            {loading ? (
                <div className="text-center py-10 text-slate-500 font-mono text-sm">DECRYPTING AUDIT LOGS...</div>
            ) : filteredLogs.length === 0 ? (
                <div className="no-logs-msg">No operational activity recorded in this view.</div>
            ) : (
                <div className="timeline-container">
                    {filteredLogs.map((log, index) => (
                        <motion.div 
                            key={log._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`audit-event-card ${getRiskClass(log.riskLevel)}`}
                        >
                            <div className="audit-event-header">
                                <div className={`audit-event-type ${getRiskClass(log.riskLevel)} flex items-center gap-2`}>
                                    {EVENT_ICONS[log.eventType] || <Activity size={14} />}
                                    {log.eventType.replace('_', ' ')}
                                </div>
                                <div className="audit-timestamp">
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="audit-summary">
                                {log.actionSummary}
                            </div>
                            
                            {(log.walletAddress || log.caseId || log.investigatorId) && (
                                <div className="audit-meta">
                                    {log.walletAddress && (
                                        <div className="audit-meta-item">
                                            <span>Target:</span>
                                            <code>{log.walletAddress.substring(0, 6)}...{log.walletAddress.substring(38)}</code>
                                        </div>
                                    )}
                                    {log.caseId && (
                                        <div className="audit-meta-item">
                                            <span>Case:</span>
                                            <code>{log.caseId}</code>
                                        </div>
                                    )}
                                    <div className="audit-meta-item" style={{ marginLeft: 'auto' }}>
                                        <Clock size={12} className="mr-1" /> UID: {log.investigatorId.substring(0, 8)}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InvestigationAuditTrail;
