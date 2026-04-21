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
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { db, auth } from '../../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import './CaseManagement.css';

const CaseManagement = () => {
    const [cases, setCases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

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

    const filteredCases = cases.filter(c => 
        (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (c.wallet?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const stats = {
        activeCases: cases.length,
        criticalRisk: cases.filter(c => c.riskLevel === 'High').length,
        totalWallets: cases.length, // In a real app this would be distinct wallets across all cases
        avgRisk: cases.length > 0 ? Math.round(cases.reduce((acc, c) => acc + (c.riskLevel === 'High' ? 85 : c.riskLevel === 'Medium' ? 45 : 20), 0) / cases.length) : 0
    };

    return (
        <div className="case-management-wrapper">
            <header className="case-header">
                <div className="flex items-center gap-4">
                    <div className="case-icon-box">
                        <Briefcase className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Forensic Command</span>
                        </div>
                        <h1 className="case-title">Case Management</h1>
                    </div>
                </div>

                <div className="case-actions">
                    <div className="search-bar">
                        <Search size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by case name or wallet..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="new-case-btn">
                        <FolderPlus size={16} />
                        <span>New Workflow</span>
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Active Investigations</span>
                        <Briefcase className="text-blue-400" size={16} />
                    </div>
                    <div className="stat-value">{stats.activeCases}</div>
                    <div className="stat-footer text-blue-400">
                        <TrendingUp size={12} />
                        <span>+2 since last session</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Critical Risk Nodes</span>
                        <AlertCircle className="text-rose-500" size={16} />
                    </div>
                    <div className="stat-value">{stats.criticalRisk}</div>
                    <div className="stat-footer text-rose-500">
                        <span>High Priority Enforcement</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Total Analyzed Wallets</span>
                        <Shield className="text-emerald-400" size={16} />
                    </div>
                    <div className="stat-value">{stats.totalWallets}</div>
                    <div className="stat-footer text-emerald-400">
                        <span>Verified on-chain</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Aggregate Risk Index</span>
                        <Users className="text-amber-500" size={16} />
                    </div>
                    <div className="stat-value">{stats.avgRisk}%</div>
                    <div className="stat-footer text-amber-500">
                        <span>Systemic Vulnerability</span>
                    </div>
                </div>
            </div>

            <div className="cases-main">
                <div className="main-header">
                    <div className="flex items-center gap-6">
                        <h2 className="section-title">Open Case Files</h2>
                        <div className="flex gap-2">
                            <button 
                                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={14} />
                            </button>
                            <button 
                                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid size={14} />
                            </button>
                        </div>
                    </div>
                    <button className="filter-btn">
                        <Filter size={14} />
                        <span>Filter Status</span>
                    </button>
                </div>

                {filteredCases.length === 0 ? (
                    <div className="empty-state">
                        <Briefcase size={48} className="text-slate-700 mb-4" />
                        <h3>No Forensic Cases Found</h3>
                        <p>Analyze a wallet in the Forensic Lab and assign it to a case to start your investigation.</p>
                    </div>
                ) : (
                    <div className={`cases-container ${viewMode}`}>
                        {filteredCases.map((c, i) => (
                            <motion.div 
                                key={c.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="case-row"
                            >
                                <div className="case-info">
                                    <div className="flex items-center gap-4">
                                        <div className="case-id-badge">{c.id}</div>
                                        <div>
                                            <div className="case-name">{c.name}</div>
                                            <div className="case-wallet font-mono">{c.wallet}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="case-meta-list">
                                    <div className="meta-col">
                                        <Calendar size={12} />
                                        <span>{new Date(c.dateCreated).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-col">
                                        <Users size={12} />
                                        <span>1 Wallet</span>
                                    </div>
                                    <div className="meta-col">
                                        <span className={`risk-pill ${c.riskLevel?.toLowerCase() || 'medium'}`}>
                                            {c.riskLevel} Risk
                                        </span>
                                    </div>
                                </div>

                                <div className="case-actions-cell">
                                    <button className="action-btn-circle" title="View Details">
                                        <FileText size={16} />
                                    </button>
                                    <button className="action-btn-circle" title="Launch Workstation">
                                        <ArrowUpRight size={16} />
                                    </button>
                                    <button className="action-btn-circle">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseManagement;
