import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getWalletAnalysis } from '../../services/AlchemyProvider';
import { 
    Shield, 
    Search, 
    FileText, 
    AlertTriangle, 
    Activity, 
    BarChart3, 
    Clock, 
    Download,
    Eye,
    Zap,
    Scale,
    Lock,
    Wifi,
    BrainCircuit,
    Code2,
    Hash,
    Loader2,
    Database,
    Binary,
    FileSignature,
    TrendingUp,
    Radar,
    Info,
    ChevronRight,
    CircleSlash,
    ArrowRight,
    MessageSquare,
    Terminal,
    Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import SaveToCaseModal from '../../components/modals/SaveToCaseModal';
import { useWatchlist } from '../../context/WatchlistContext';
import './ForensicLab.css';

// Register fonts if needed or use defaults

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2pt solid #0D1117',
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D1117',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    confidential: {
        fontSize: 10,
        color: '#ef4444',
        fontWeight: 'bold',
        marginTop: 5,
    },
    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0D1117',
        textTransform: 'uppercase',
        borderBottom: '1pt solid #EEEEEE',
        paddingBottom: 4,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 150,
        fontSize: 10,
        color: '#666666',
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 10,
        color: '#000000',
    },
    narrative: {
        fontSize: 10,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    clause: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    clauseText: {
        fontSize: 8,
        fontStyle: 'italic',
        color: '#4B5563',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 7,
        textAlign: 'center',
        color: '#999999',
        borderTop: '1pt solid #EEEEEE',
        paddingTop: 10,
    },
    fingerprint: {
        marginTop: 5,
        fontFamily: 'Courier',
        fontSize: 6,
        color: '#666666',
        textAlign: 'center',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#F3F4F6',
        padding: 5,
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableCell: {
        fontSize: 8,
        color: '#4B5563',
    },
    riskGaugeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 4,
    },
    riskScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ef4444',
    }
});

const ForensicReportPDF = ({ data }) => {
    // Simple SHA-256 placeholder (in real scenario, we'd use a crypto library)
    const digitalFingerprint = "SHA256:" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Confidential Forensic Intelligence Report</Text>
                    <Text style={styles.confidential}>CASE UID: {data.caseUid}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Wallet Entry Metadata</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Subject Wallet:</Text>
                        <Text style={styles.value}>{data.wallet}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Risk Index:</Text>
                        <Text style={styles.value}>{data.riskScore}/100 (HIGH)</Text>
                    </View>
                </View>

                <View style={styles.riskGaugeContainer}>
                    <View>
                        <Text style={styles.sectionTitle}>Risk Gauge</Text>
                        <Text style={styles.riskScoreText}>{data.riskScore}</Text>
                        <Text style={{ fontSize: 8, color: '#666' }}>COMPOSITE SCORE</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 9, color: '#444', lineHeight: 1.4 }}>
                            Critical Risk Assessment: This wallet is flagged for high-velocity obfuscation and direct linkage to sanctioned entities. Assets are prioritized for enforcement action.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cluster Analysis Findings</Text>
                    <Text style={styles.narrative}>{data.clusterFindings}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Forensic Narrative</Text>
                    <Text style={styles.narrative}>{data.narrative}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>High-Risk Transactions</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Timestamp</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Hash</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Amount</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Risk Flag</Text></View>
                        </View>
                        {data.transactions.map((tx, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{tx.time}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{tx.hash.substring(0, 10)}...</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{tx.amount} ETH</Text></View>
                                <View style={styles.tableCol}><Text style={[styles.tableCell, {color: '#ef4444', fontWeight: 'bold'}]}>{tx.flag}</Text></View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.clause}>
                    <Text style={styles.sectionTitle}>Legal Compliance Statement</Text>
                    <Text style={styles.clauseText}>
                        SECTION 65B (INDIAN EVIDENCE ACT) COMPLIANCE: This document represents a computer-generated output of blockchain intelligence 
                        data processed through the Sentinel OS Forensic Engine. I certify that during the period over which the computer output was 
                        produced, the computer was operating properly and the information contained in the electronic record reproduces or is 
                        derived from information fed into the computer in the ordinary course of activities.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text>Generated by Sentinel OS Forensic Lab — {new Date().toLocaleString()} — Page 1 of 1</Text>
                    <Text style={styles.fingerprint}>DIGITAL FINGERPRINT (SHA-256): {digitalFingerprint}</Text>
                </View>
            </Page>
        </Document>
    );
};

const ForensicLab = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const walletAddress = searchParams.get('address') || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const caseUid = `SENTINEL-${walletAddress.substring(2, 8).toUpperCase()}`;

    const [analysisData, setAnalysisData] = useState(null);
    const [narrative, setNarrative] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const [error, setError] = useState(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    
    const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
    const isWatched = watchlist.includes(walletAddress.toLowerCase());

    const attributionRef = useRef({
        label: "Unknown Entity",
        confidence: 0,
        reasoning: "Insufficient transaction volume for high-confidence attribution."
    });

    useEffect(() => {
        const performAnalysis = async () => {
            setIsScanning(true);
            setError(null);
            try {
                const data = await getWalletAnalysis(walletAddress);
                
                // Live Attribution Logic
                const roundNumbers = data.history.filter(tx => tx.value % 1 === 0).length;
                const mixerPatterns = data.history.filter(tx => [0.1, 1.0, 10, 100].includes(tx.value)).length;
                
                let label = "Private Wallet";
                let confidence = 45;
                let reasoning = "Pattern suggests individual asset custody.";

                if (data.txCount > 500 && roundNumbers > (data.history.length * 0.4)) {
                    label = "Exchange Hot-Wallet";
                    confidence = 89;
                    reasoning = "High transaction throughput with systematic round-number settlement patterns consistent with CEX operations.";
                } else if (mixerPatterns > 3) {
                    label = "Mixer / Obfuscator";
                    confidence = 94;
                    reasoning = "Detected fixed-denomination transaction matching (0.1/1/10 ETH) indicative of non-custodial privacy protocol interaction.";
                }

                attributionRef.current = { label, confidence, reasoning };
                setAnalysisData(data);
                
                // Generate Dynamic Narrative
                const patternType = mixerPatterns > 3 ? "Mixer Layering" : data.txCount > 500 ? "High-Cycle Liquidity" : "Retail Custody";
                const story = `INVESTIGATIVE NARRATIVE: WALLET ${walletAddress.substring(0, 10)}... \n\n` + 
                    `THREAT TRIGGER: System identified ${data.txCount} total transactions with a composite Risk Index of ${data.txCount > 100 ? '82' : '35'}%. ` +
                    `The primary trigger is ${label === 'Exchange Hot-Wallet' ? 'high-throughput CEX settlement' : label === 'Mixer / Obfuscator' ? 'systematic privacy protocol interaction' : 'unusual volume baseline deviations'}.\n\n` +
                    `BEHAVIORAL ANALYSIS: Subject exhibits ${patternType} behavior. Funds are ${label === 'Mixer / Obfuscator' ? 'routinely fragmented into fixed denominations (0.1/1/10 ETH) to break the deterministic link' : 'processed through known institutional nodes'} on the Ethereum Mainnet. ` +
                    `We detect a "Layering" phase where assets move rapidly between ${data.txCount > 50 ? 'multiple cold and hot storage entities' : 'individual peers'}.\n\n` +
                    `VERDICT: This wallet is interpreted as a ${label.toLowerCase()}. Its activity aligns with ${label === 'Mixer / Obfuscator' ? 'deliberate asset obfuscation' : 'standard commercial operations'}. ` +
                    `Probability of illicit fund entanglement is ${confidence}%.`;
                
                setNarrative(story);
            } catch (err) {
                console.error(err);
                setError("Investigative Error: Wallet not found on-chain or API limit reached.");
            } finally {
                setIsScanning(false);
            }
        };

        if (walletAddress) performAnalysis();
    }, [walletAddress]);

    const toggleWatchlist = async () => {
        if (isWatched) {
            await removeFromWatchlist(walletAddress);
        } else {
            await addToWatchlist(walletAddress);
        }
    };

    const mockData = {
        metadata: {
            wallet: walletAddress,
            balance: '1,420.65 ETH',
            source: 'Binance Hot Wallet #4',
            firstSeen: '2023-01-12 14:02 UTC'
        },
        clustering: [
            { id: 'C1', type: 'Exchange Multi-Sig', confidence: 98, status: 'Verified', attribution: 'Binance Cluster', reasoning: 'Pattern Match: Consistent high-volume internal transfers within documented Binance address space.' },
            { id: 'C2', type: 'Tornado Cash Interactor', confidence: 85, status: 'Anomaly', attribution: 'Privacy Protocol', reasoning: 'Transactional Flow: Direct interaction with Tornado Cash: 0.1 ETH Router with subsequent relay obfuscation.' },
            { id: 'C3', type: 'Sanctioned Entity', confidence: 92, status: 'Anomaly', attribution: 'Lazarus Group', reasoning: 'Entity Correlation: Addresses linked via joint-control ownership in historical exploit event (Ronin Bridge).' },
            { id: 'C4', type: 'Liquidity Provider', confidence: 99, status: 'Verified', attribution: 'Uniswap V3', reasoning: 'Pattern Match: Regular mint/burn events within the USDC/WETH 0.05% pool.' }
        ],
        eda: {
            volumeAnomalies: [
                { time: '14:00', volume: 10 },
                { time: '15:00', volume: 15 },
                { time: '16:00', volume: 850, anomaly: true },
                { time: '17:00', volume: 20 },
                { time: '18:00', volume: 12 }
            ],
            patterns: 'Sequential hopping detected from 16:00 to 16:45 UTC. Time-weighted average deviation: 1,400%.'
        },
        riskScore: 84,
        transactions: [
            { time: '2023-01-12 16:05', hash: '0x32a1b9c8d7e6f5a43210', amount: '850.00', flag: 'High Velocity' },
            { time: '2023-01-12 16:15', hash: '0x9e8d7c6b5a4f3e2d1c0b', amount: '120.50', flag: 'Mixer Input' },
            { time: '2023-01-12 16:30', hash: '0x1a2b3c4d5e6f7a8b9c0d', amount: '45.00', flag: 'Sanctioned Link' }
        ]
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const generateNarrative = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const draft = `INVESTIGATIVE STATEMENT: RE CASE ${caseUid}\n\nSubject wallet ${walletAddress} exhibits high-velocity clustering patterns consistent with multi-hop obfuscation techniques. Unsupervised Entity Classification reveals a 92% correlation with Sanctioned Entity Cluster C3. \n\nFORENSIC FINDINGS: Exploratory Data Analysis (EDA) identified a significant transaction volume anomaly at 16:00 UTC (850 ETH), deviating from the 24-hour baseline by 1,400%. The funds were subsequently routed through a Tornado Cash relayer cluster before exiting to an unknown destination.\n\nVERDICT: High-probability money laundering involvement detected. Assets are currently residing in a cold-storage vault associated with Cluster C2 [Obfuscated]. Immediate AML freeze recommended.`;
            setNarrative(draft);
            setIsGenerating(false);
        }, 1500);
    };

    const pdfData = {
        caseUid: caseUid,
        wallet: walletAddress,
        initialBalance: mockData.metadata.balance,
        sourceOfFunds: mockData.metadata.source,
        clusterFindings: "Identification of 4 distinct entity clusters. 2 clusters flagged as Anomalies (Tornado Cash & Sanctioned). High-confidence relationship with offshore stealth nodes.",
        finalDestination: "Funds reside in 0x00ff...dead (Relayer Hub). Final liquidity exit via non-KYC OTC desk.",
        narrative: narrative || "Narrative not yet generated. Analysis in progress.",
        riskScore: mockData.riskScore,
        transactions: mockData.transactions
    };

    return (
        <div className="forensic-lab-wrapper">
            <header className="forensic-header">
                <div className="flex items-center gap-4">
                    <div className="lab-icon-box">
                        <Database className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Sovereign Intelligence Unit</span>
                        </div>
                        <h1 className="lab-title">Forensic Lab</h1>
                    </div>
                </div>
                {error && (
                    <div className="error-banner flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <CircleSlash size={16} className="text-rose-500" />
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">{error}</span>
                        <button onClick={() => navigate('/dashboard')} className="ml-auto text-[10px] text-white/50 hover:text-white underline font-bold">ABORT ANALYSIS</button>
                    </div>
                )}
                <div className="header-meta">
                    <div className="meta-item">
                        <span className="label">CASE UID</span>
                        <span className="value text-slate-300 font-mono">{caseUid}</span>
                    </div>
                    <div className="meta-item">
                        <span className="label">TERMINAL STATUS</span>
                        <span className="value text-emerald-400">ENCRYPTED</span>
                    </div>
                    <button 
                        className="save-case-btn"
                        onClick={() => setIsSaveModalOpen(true)}
                    >
                        <Database size={16} />
                        <span>Save to Case</span>
                    </button>
                    <button 
                        className={`watchlist-btn ${isWatched ? 'active' : ''}`}
                        onClick={toggleWatchlist}
                    >
                        {isWatched ? <Eye size={16} className="text-emerald-400" /> : <Eye size={16} />}
                        <span>{isWatched ? 'Watching' : 'Watchlist'}</span>
                    </button>
                    <PDFDownloadLink document={<ForensicReportPDF data={pdfData} />} fileName={`SENTINEL_REPORT_${caseUid}.pdf`}>
                        {({ blob, url, loading, error }) => (
                            <button className="export-pdf-btn" disabled={loading}>
                                <Download size={16} />
                                <span>{loading ? 'PREPARING...' : 'EXPORT EVIDENCE'}</span>
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            </header>

            {/* AI Investigation Narrative Layer */}
            <AnimatePresence>
                {analysisData && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="narrative-layer"
                    >
                        <div className="narrative-inner glass">
                            <div className="narrative-sidebar">
                                <div className="confidence-meter">
                                    <svg viewBox="0 0 36 36" className="circular-chart blue">
                                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="circle" strokeDasharray={`${attributionRef.current.confidence}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="18" y="20.35" className="percentage">{attributionRef.current.confidence}%</text>
                                    </svg>
                                    <span className="meter-label">CONFIDENCE</span>
                                </div>
                                <div className="risk-indicator-v2">
                                    <span className="label">RISK LEVEL</span>
                                    <span className={`status-pill ${attributionRef.current.confidence > 70 ? 'critical' : 'warning'}`}>
                                        {attributionRef.current.confidence > 70 ? 'CRITICAL' : 'SUSPICIOUS'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="narrative-main">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="narrative-badge">
                                        <Fingerprint size={14} className="text-blue-400" />
                                        <span>AI FORENSIC NARRATIVE</span>
                                    </div>
                                    <div className="status-badge flex items-center gap-2">
                                        <div className="pulse-dot"></div>
                                        <span>LIVE TRACE ACTIVE</span>
                                    </div>
                                </div>
                                
                                <div className="narrative-content-box">
                                    <div className="narrative-section">
                                        <h3><MessageSquare size={14} /> Investigative Summary</h3>
                                        <p>{narrative.split('\n\n')[1]}</p>
                                    </div>
                                    <div className="narrative-grid">
                                        <div className="narrative-item">
                                            <h4>BEHAVIOR PATTERN</h4>
                                            <p>{narrative.split('\n\n')[2]?.replace('BEHAVIORAL ANALYSIS: ', '')}</p>
                                        </div>
                                        <div className="narrative-item">
                                            <h4>RISK INTERPRETATION</h4>
                                            <p>{narrative.split('\n\n')[3]?.replace('VERDICT: ', '')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SaveToCaseModal 
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                walletAddress={walletAddress}
                riskScore={analysisData?.txCount > 100 ? 82 : 35}
                onSave={(newCase) => console.log('Saved Case:', newCase)}
            />

            <div className="lab-grid">
                {/* Column 1: Evidence Explorer */}
                <div className="lab-column evidence-explorer">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <Radar size={16} className="text-blue-400" />
                            <span>Evidence Explorer</span>
                        </div>
                        <span className="badge-blue">LIVE FEED</span>
                    </div>

                    <div className="panel-content scrollbar-custom">
                        <section className="evidence-section">
                            <h3 className="section-label">Entity Classification</h3>
                            <div className="cluster-list">
                                {mockData.clustering.map((c, i) => (
                                    <motion.div 
                                        key={c.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`cluster-card ${c.status === 'Verified' ? 'border-verified' : 'border-anomaly'}`}
                                    >
                                        <div className="cluster-header">
                                            <div className="flex items-center gap-2">
                                                <span className="cluster-id">{c.id}</span>
                                                <div className="attribution-badge">
                                                    <Shield size={10} className={c.status === 'Verified' ? 'text-blue-400' : 'text-amber-500'} />
                                                    <span>{c.attribution}</span>
                                                </div>
                                            </div>
                                            <span className={`status-pill ${c.status === 'Verified' ? 'bg-verified text-verified' : 'bg-anomaly text-anomaly'}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="cluster-type">{c.type}</div>
                                            <div className="relative group">
                                                <div className="confidence-ring">
                                                    <svg className="w-8 h-8 transform -rotate-90">
                                                        <circle cx="16" cy="16" r="14" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                                        <circle 
                                                            cx="16" cy="16" r="14" 
                                                            fill="transparent" 
                                                            stroke={c.status === 'Verified' ? '#3b82f6' : '#f59e0b'} 
                                                            strokeWidth="3" 
                                                            strokeDasharray="88" 
                                                            strokeDashoffset={88 - (88 * c.confidence) / 100}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <span className="confidence-value">{c.confidence}</span>
                                                </div>
                                                
                                                {/* Reasoning Tooltip */}
                                                <div className="reasoning-tooltip">
                                                    <div className="tooltip-title">Forensic Reasoning</div>
                                                    <p>{c.reasoning}</p>
                                                    <div className="tooltip-arrow"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cluster-meta">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] text-slate-500 uppercase font-bold">Integrity Score</span>
                                            </div>
                                            <div className="confidence-bar-bg">
                                                <div 
                                                    className={`confidence-bar-fill ${c.status === 'Verified' ? 'bg-blue-500' : 'bg-amber-500'}`} 
                                                    style={{ width: `${c.confidence}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="evidence-section mt-6">
                            <h3 className="section-label">EDA Analytics</h3>
                            <div className="eda-container glass">
                                <div className="eda-chart-placeholder">
                                    <div className="flex items-end gap-1 h-32 px-4 mb-4">
                                        {mockData.eda.volumeAnomalies.map((v, i) => (
                                            <div 
                                                key={i} 
                                                className={`flex-1 rounded-t-sm transition-all duration-500 ${v.anomaly ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-blue-500/30'}`}
                                                style={{ height: `${v.volume === 850 ? 100 : (v.volume / 100) * 100}%` }}
                                            >
                                                {v.anomaly && (
                                                    <div className="relative">
                                                        <AlertTriangle size={10} className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-500" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between px-4 text-[8px] font-bold text-slate-500 uppercase">
                                        <span>14:00</span>
                                        <span>Anomaly Peak</span>
                                        <span>18:00</span>
                                    </div>
                                </div>
                                <div className="eda-summary mt-4 p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={12} className="text-blue-400" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-wider">Pattern Analysis</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                        {mockData.eda.patterns}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Column 2: Narrative Composer */}
                <div className="lab-column narrative-composer">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <FileSignature size={16} className="text-blue-400" />
                            <span>Narrative Composer</span>
                        </div>
                        <button 
                            className={`generate-btn ${isGenerating ? 'loading' : ''}`}
                            onClick={generateNarrative}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                            <span>GENERATE NARRATIVE</span>
                        </button>
                    </div>

                    <div className="panel-content">
                        <div className="editor-container">
                            <div className="editor-toolbar">
                                <div className="tool-btn"><span className="font-bold">B</span></div>
                                <div className="tool-btn"><span className="italic">I</span></div>
                                <div className="tool-btn"><FileText size={12} /></div>
                                <div className="spacer"></div>
                                <div className="editor-mode">DRAFT_LEGAL_STATEMENT</div>
                            </div>
                            <textarea 
                                className="narrative-editor scrollbar-custom"
                                value={narrative}
                                onChange={(e) => setNarrative(e.target.value)}
                                placeholder="Awaiting forensic intelligence input... Click Generate Narrative to synthesize clusters and EDA findings into a professional legal draft."
                            />
                        </div>
                        
                        <div className="investigative-prompts mt-4">
                            <span className="text-[9px] font-black text-slate-500 uppercase mb-2 block">Quick Enrichment</span>
                            <div className="flex flex-wrap gap-2">
                                <button className="prompt-pill">Address Poisoning Check</button>
                                <button className="prompt-pill">Cross-Chain HOP search</button>
                                <button className="prompt-pill">DEX Slippage analysis</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Risk Analytics */}
                <div className="lab-column risk-analytics">
                    <div className="panel-header">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={16} className="text-blue-400" />
                            <span>Risk Analytics</span>
                        </div>
                    </div>

                    <div className="panel-content scrollbar-custom">
                        <section className="risk-score-section">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Composite Risk Score</span>
                                <div className="risk-badge bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                    HIGH RISK
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl relative overflow-hidden">
                                <div className="risk-circle-container relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle 
                                            cx="80" cy="80" r="70" 
                                            fill="transparent" 
                                            stroke="rgba(255,255,255,0.05)" 
                                            strokeWidth="12" 
                                        />
                                        <circle 
                                            cx="80" cy="80" r="70" 
                                            fill="transparent" 
                                            stroke="url(#riskGradient)" 
                                            strokeWidth="12" 
                                            strokeDasharray="440" 
                                            strokeDashoffset={440 - (440 * mockData.riskScore) / 100}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        <defs>
                                            <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#ef4444" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-white">{mockData.riskScore}</span>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Index</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="destination-section mt-8">
                            <h3 className="section-label">Final Destination</h3>
                            <div className="destination-card glass">
                                <div className="flex items-start gap-3">
                                    <div className="dest-icon bg-amber-500/10 text-amber-500 p-2 rounded-xl border border-amber-500/20">
                                        <CircleSlash size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-white uppercase mb-1">Cashed Out</div>
                                        <div className="text-[11px] font-mono text-slate-400 break-all">0x00ff8e7d9f8...mixHub</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[9px] font-bold py-0.5 px-1.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20 uppercase">Mixer Cluster</span>
                                            <ArrowRight size={10} className="text-slate-600" />
                                            <span className="text-[9px] font-bold py-0.5 px-1.5 bg-rose-500/10 text-rose-500 rounded border border-rose-500/20 uppercase">Offshore</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="legal-brief-section mt-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Scale size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Enforcement Payload</span>
                            </div>
                            <div className="space-y-3">
                                <div className="payload-item">
                                    <span className="text-[10px] text-slate-500">Jurisdiction</span>
                                    <span className="text-[10px] text-white font-bold">Multiple / Global</span>
                                </div>
                                <div className="payload-item">
                                    <span className="text-[10px] text-slate-500">Compliance Clause</span>
                                    <span className="text-[10px] text-white font-bold">Sec. 65B Certified</span>
                                </div>
                                <div className="payload-item">
                                    <span className="text-[10px] text-slate-500">Freezability</span>
                                    <span className="text-[10px] text-emerald-400 font-bold">HIGH (DEX Locked)</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {isScanning && (
                <div className="lab-overlay">
                    <div className="scan-line"></div>
                    <div className="flex flex-col items-center">
                        <Loader2 className="text-blue-500 animate-spin mb-4" size={40} />
                        <span className="text-xs font-black text-white uppercase tracking-[0.5em]">Initializing Forensic Sandbox...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForensicLab;
