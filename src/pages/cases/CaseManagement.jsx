import React, { useState, useEffect } from 'react';
import { 
    Briefcase, 
    Calendar, 
    Shield, 
    Users, 
    Search, 
    MoreVertical, 
    ArrowUpRight, 
    Filter,
    FolderPlus,
    FileText,
    TrendingUp,
    LayoutGrid,
    List,
    ChevronRight,
    AlertCircle,
    Download,
    Trash2,
    ExternalLink,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ForensicReportPDF from '../../components/reports/ForensicReportPDF';
import './CaseManagement.css';

const CaseManagement = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');
    const [viewMode, setViewMode] = useState('list');
    const [isMenuOpen, setIsMenuOpen] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, 'cases'),
            where('uid', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const caseList = snapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data()
            }));
            setCases(caseList);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    const handleDeleteCase = async (id) => {
        if (window.confirm("Are you sure you want to delete this forensic case? This action is permanent.")) {
            try {
                await deleteDoc(doc(db, 'cases', id));
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (c.wallet?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (c.caseId?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesRisk = riskFilter === 'All' || c.riskLevel === riskFilter;
        return matchesSearch && matchesRisk;
    });

    const stats = {
        activeCases: cases.length,
        criticalRisk: cases.filter(c => c.riskLevel === 'High').length,
        totalWallets: cases.length,
        avgRisk: cases.length > 0 ? Math.round(cases.reduce((acc, c) => acc + (c.riskScore || 0), 0) / cases.length) : 0
    };

    return (
        <div className="case-management-wrapper workstation-mode">
            <header className="case-header">
                <div className="flex items-center gap-6">
                    <div className="case-icon-box">
                        <Briefcase className="text-blue-500" size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Forensic Command Center</span>
                        </div>
                        <h1 className="case-title">Operational Workspace</h1>
                    </div>
                </div>

                <div className="case-actions">
                    <div className="search-bar-modern">
                        <Search size={18} className="text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Filter by Name, UID, or Target Address..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="create-case-btn" onClick={() => navigate('/forensic-lab')}>
                        <Zap size={16} />
                        <span>INITIALIZE SCAN</span>
                    </button>
                </div>
            </header>

            <div className="analytics-overview">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="analytic-card glass">
                    <div className="card-top">
                        <span className="card-label">Active Investigations</span>
                        <Briefcase size={16} className="text-blue-400" />
                    </div>
                    <div className="card-value">{stats.activeCases}</div>
                    <div className="card-trend positive">
                        <TrendingUp size={12} />
                        <span>READY FOR ENFORCEMENT</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="analytic-card glass">
                    <div className="card-top">
                        <span className="card-label">Critical Priority</span>
                        <AlertCircle size={16} className="text-rose-500" />
                    </div>
                    <div className="card-value">{stats.criticalRisk}</div>
                    <div className="card-trend negative">
                        <span>IMMEDIATE ACTION REQUIRED</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="analytic-card glass">
                    <div className="card-top">
                        <span className="card-label">Evidence Volume</span>
                        <Shield size={16} className="text-emerald-400" />
                    </div>
                    <div className="card-value">{stats.totalWallets}</div>
                    <div className="card-trend positive">
                        <span>WALLETS SECURED</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="analytic-card glass">
                    <div className="card-top">
                        <span className="card-label">Systemic Risk Pool</span>
                        <Users size={16} className="text-amber-500" />
                    </div>
                    <div className="card-value">{stats.avgRisk}%</div>
                    <div className="card-trend">
                        <span>AVG THREAT INDEX</span>
                    </div>
                </motion.div>
            </div>

            <main className="operation-table-container glass">
                <div className="table-controls">
                    <div className="flex items-center gap-6">
                        <h2 className="table-h2">Forensic Inventory</h2>
                        <div className="risk-filter-group">
                            {['All', 'High', 'Medium', 'Low'].map(level => (
                                <button 
                                    key={level}
                                    className={`filter-pill ${riskFilter === level ? 'active' : ''}`}
                                    onClick={() => setRiskFilter(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="view-mode-switch">
                        <button className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={14} /></button>
                        <button className={`switch-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={14} /></button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <div className="table-header-row">
                        <div className="th-cell col-case">IDENTIFIER / CASE NAME</div>
                        <div className="th-cell col-target">TARGET SUBJECT</div>
                        <div className="th-cell col-pulse">LIVE PULSE</div>
                        <div className="th-cell col-risk">RISK SCORE</div>
                        <div className="th-cell col-actions text-right">OPERATIONAL ACTIONS</div>
                    </div>

                    <div className="table-body">
                        {filteredCases.map((c, i) => (
                            <motion.div 
                                key={c.docId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="table-row-item"
                            >
                                <div className="td-cell col-case">
                                    <div className="case-id">#{c.caseId || 'UID-PENDING'}</div>
                                    <div className="case-name-v2">{c.name}</div>
                                </div>

                                <div className="td-cell col-target">
                                    <div className="wallet-strip font-mono">
                                        <div className="wallet-chip">{c.wallet.substring(0, 6)}...{c.wallet.substring(38)}</div>
                                    </div>
                                    <div className="timestamp-v2">ASSIGNED: {new Date(c.createdAt?.seconds * 1000).toLocaleDateString()}</div>
                                </div>

                                <div className="td-cell col-pulse">
                                    {/* Simulated Live Pulse: High Risk cases often flicker Red */}
                                    <div className="pulse-indicator-v2">
                                        <div className={`pulse-blob ${c.riskLevel === 'High' && i % 2 === 0 ? 'alert' : 'idle'}`}></div>
                                        <span className="pulse-status">{c.riskLevel === 'High' && i % 2 === 0 ? 'TX DETECTED' : 'IDLE'}</span>
                                    </div>
                                </div>

                                <div className="td-cell col-risk">
                                    <div className="risk-visual">
                                        <div className="risk-bar-bg">
                                            <div 
                                                className={`risk-bar-fill ${c.riskScore > 75 ? 'bg-rose-500' : c.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                style={{ width: `${c.riskScore}%` }}
                                            ></div>
                                        </div>
                                        <span className={`risk-val-text ${c.riskLevel?.toLowerCase()}`}>{c.riskScore}% {c.riskLevel}</span>
                                    </div>
                                </div>

                                <div className="td-cell col-actions text-right">
                                    <div className="quick-action-set">
                                        <button 
                                            className="action-btn-v3" 
                                            title="View in Lab"
                                            onClick={() => navigate(`/forensic-lab?address=${c.wallet}`)}
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                        
                                        <PDFDownloadLink 
                                            document={<ForensicReportPDF data={{
                                                caseUid: c.caseId,
                                                wallet: c.wallet,
                                                riskScore: c.riskScore,
                                                narrative: c.narrative || "No investigation narrative recorded."
                                            }} />} 
                                            fileName={`SENTINEL_REPORT_${c.caseId}.pdf`}
                                        >
                                            {({ loading }) => (
                                                <button className="action-btn-v3" title="Generate Report" disabled={loading}>
                                                    <Download size={14} />
                                                </button>
                                            )}
                                        </PDFDownloadLink>

                                        <button 
                                            className="action-btn-v3 text-rose-500 hover:bg-rose-500/10" 
                                            title="Archive Case"
                                            onClick={() => handleDeleteCase(c.docId)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredCases.length === 0 && (
                        <div className="no-data-display">
                            <div className="icon-wrap">
                                <Search size={40} className="text-slate-700" />
                            </div>
                            <h3>Intelligence Query: No Matches</h3>
                            <p>Try refining your search parameters or risk level filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CaseManagement;

