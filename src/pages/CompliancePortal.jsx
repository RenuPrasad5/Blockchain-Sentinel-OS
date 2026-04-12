import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, 
    FileText, 
    History, 
    Download, 
    Search, 
    Filter, 
    AlertCircle, 
    Database, 
    ChevronRight,
    Lock,
    Scale,
    Activity,
    UserCheck,
    CheckCircle2,
    Clock,
    Printer,
    Share2,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createAuditLog, prepareEvidenceReport, RISK_LEVELS } from '../services/ForensicEngine';
import './CompliancePortal.css';

const CompliancePortal = () => {
    const [activeTab, setActiveTab] = useState('audit');
    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState([
        createAuditLog('CASE_INIT', '0x12a...B456', 'Case initialized: Multi-hop Layering detected on Ethereum Mainnet.'),
        createAuditLog('RISK_UPDATE', '0x7b9...C789', 'Risk score adjusted: 15 -> 84 (High-obfuscation mixer interaction detected).'),
        createAuditLog('EVIDENCE_EXPORT', '0x4e2...D012', 'Full forensic report generated forCase #2026-A-412.'),
        createAuditLog('WALLET_TAG', '0x9a3...E456', 'Tagged as "Suspicious: Structuring Pattern" by AI Sentinel.'),
        createAuditLog('LOGIN_SESSION', 'Node: IN-MUM-01', 'Secure terminal access by authenticated agent: [Karthik].')
    ]);

    const tabs = [
        { id: 'audit', title: 'Immutable Audit Trail', icon: <History size={18} /> },
        { id: 'legal', title: 'Legal Evidence Export', icon: <FileText size={18} /> },
        { id: 'compliance', title: 'Global Compliance Sync', icon: <ShieldCheck size={18} /> }
    ];

    const filteredLogs = logs.filter(log => 
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.entity.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="compliance-wrapper">
            <header className="compliance-header">
                <div className="compliance-brand">
                    <Scale size={24} className="text-blue-500" />
                    <div>
                        <h1 className="compliance-title">Compliance & Legal Intelligence</h1>
                        <p className="compliance-subtitle">Forensic-grade auditing, immutable logging, and legal evidence generation.</p>
                    </div>
                </div>
                
                <div className="header-badges">
                    <div className="badge-item glass">
                        <Lock size={12} className="text-blue-400" />
                        <span>AES-256 Audit Encryption</span>
                    </div>
                    <div className="badge-item glass">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>GDPR-Ready Logging</span>
                    </div>
                </div>
            </header>

            <div className="compliance-tabs">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={`compliance-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.title}</span>
                    </button>
                ))}
            </div>

            <main className="compliance-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'audit' && (
                        <motion.div 
                            key="audit"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="audit-panel"
                        >
                            <div className="panel-controls">
                                <div className="search-box-full glass">
                                    <Search size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search by ID, Address, or Action..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="filter-group">
                                    <button className="filter-btn glass"><Filter size={14} /> Filter</button>
                                    <button 
                                        className="export-btn-blue"
                                        onClick={() => {
                                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
                                            const downloadAnchorNode = document.createElement('a');
                                            downloadAnchorNode.setAttribute("href",     dataStr);
                                            downloadAnchorNode.setAttribute("download", "audit_trail_export.json");
                                            document.body.appendChild(downloadAnchorNode);
                                            downloadAnchorNode.click();
                                            downloadAnchorNode.remove();
                                        }}
                                    >
                                        <Download size={14} /> Export JSON
                                    </button>
                                </div>
                            </div>

                            <div className="audit-table-wrapper glass">
                                <table className="audit-table">
                                    <thead>
                                        <tr>
                                            <th>TIMESTAMP (UTC)</th>
                                            <th>LOG ID</th>
                                            <th>ACTION</th>
                                            <th>ENTITY</th>
                                            <th>IMMUTABLE CHECKSUM</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.map(log => (
                                            <tr key={log.id}>
                                                <td className="font-mono text-[10px] text-slate-500">{log.timestamp}</td>
                                                <td className="font-bold text-blue-400">{log.id}</td>
                                                <td className="text-xs uppercase font-black">{log.action.replace('_', ' ')}</td>
                                                <td className="font-mono text-xs text-slate-300">{log.entity}</td>
                                                <td className="font-mono text-[9px] text-slate-600 truncate max-w-[120px]">{log.checksum}</td>
                                                <td><span className="verify-badge"><Check size={10} /> VERIFIED</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'legal' && (
                        <motion.div 
                            key="legal"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="legal-panel"
                        >
                            <div className="legal-grid">
                                <div className="legal-config-card glass">
                                    <h3 className="card-title"><FileText size={18} className="text-blue-500" /> Evidence Report Builder</h3>
                                    <p className="card-desc">Generate legally admissible reports for law enforcement agencies and regulatory bodies.</p>
                                    
                                    <div className="form-group">
                                        <label>Investigation Case Target</label>
                                        <input type="text" placeholder="Wallet Address (0x...)" className="input-field" />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Evidence Depth</label>
                                        <select className="select-field">
                                            <option>Full Forensic Audit (Recommended)</option>
                                            <option>Transaction Linear Flow</option>
                                            <option>AML Pattern Summary Only</option>
                                        </select>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label><input type="checkbox" defaultChecked /> Include Graph Visualization Data</label>
                                        <label><input type="checkbox" defaultChecked /> Include Audit Trace Logs</label>
                                        <label><input type="checkbox" defaultChecked /> Include Risk Correlation Factors</label>
                                    </div>

                                    <div className="action-buttons mt-8">
                                        <button className="generate-btn">
                                            <Printer size={16} /> Print Official PDF
                                        </button>
                                        <button className="share-btn glass">
                                            <Share2 size={16} /> Encrypted Share
                                        </button>
                                    </div>
                                </div>

                                <div className="legal-preview-column">
                                    <div className="preview-card-legal glass">
                                        <div className="report-header-preview">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                                        <Scale size={20} className="text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-black text-sm uppercase">Official Evidence Report</h4>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">BLOCKCHAIN SENTINEL FORENSICS v2.0</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] text-slate-500 uppercase font-black">Report Serial No.</div>
                                                    <div className="text-xs text-white font-mono">SENTINEL-FX-2026-X84-001</div>
                                                </div>
                                            </div>

                                            <div className="report-subject-info bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Subject Wallet</span>
                                                        <span className="text-xs text-blue-400 font-mono">0x7a2...f2488d</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Risk Classification</span>
                                                        <span className="text-xs text-rose-500 font-black">CRITICAL RISK (94/100)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="forensic-findings space-y-4">
                                                <div className="finding-item">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <AlertCircle size={14} className="text-rose-500" />
                                                        <span className="text-[10px] text-rose-500 font-black uppercase">PATTERN_STRUCTURING_DETECTION</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-relaxed italic">Subject demonstrated breaking 42.5 ETH into 0.1 ETH increments across 425 transactions between T+10h and T+12h.</p>
                                                </div>
                                                <div className="finding-item border-l border-white/10 pl-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <History size={14} className="text-indigo-400" />
                                                        <span className="text-[10px] text-indigo-400 font-black uppercase">CLUSTER_CORRELATION_AUDIT</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-relaxed italic">Direct correlation (84.2%) found with known Lazarus Group withdrawal clusters.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'compliance' && (
                        <motion.div 
                            key="compliance"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="compliance-panel glass p-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xl font-black text-white mb-6">Global Regulatory Sync</h3>
                                    <div className="space-y-4">
                                        <SyncItem label="FATF Travel Rule Compliance" status="ACTIVE" active={true} />
                                        <SyncItem label="OFAC Sanctions List (Live)" status="SYNCED" active={true} />
                                        <SyncItem label="EU MiCA Monitoring Standards" status="ACTIVE" active={true} />
                                        <SyncItem label="FinCEN AML Directives" status="ACTIVE" active={false} />
                                    </div>
                                </div>
                                <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                                    <Activity size={32} className="text-blue-500 mb-6" />
                                    <h4 className="text-lg font-black text-white mb-2">Institutional Node Protocol</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Your forensic node is currently synced with **84 Global Intelligence Repositories**. This ensures your evidence reports are backed by real-time regulatory status changes.
                                    </p>
                                    <button className="w-full py-4 bg-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-blue-600 transition-all">
                                        Force Global Sync
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const SyncItem = ({ label, status, active }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
        <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
        </div>
        <span className={`text-[10px] font-black tracking-widest ${active ? 'text-emerald-500' : 'text-slate-500'}`}>{status}</span>
    </div>
);

export default CompliancePortal;
