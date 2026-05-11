import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Briefcase, 
    Trash2, 
    ExternalLink, 
    Search,
    Filter,
    Shield,
    Loader2,
    Calendar,
    Tag,
    Clock,
    ArrowLeft,
    Plus,
    FileText,
    PlusCircle,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Paperclip,
    StickyNote,
    Activity,
    ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ForensicReportPDF from '../components/reports/ForensicReportPDF';
import AnnotationModal from '../components/modals/AnnotationModal';
import { Download } from 'lucide-react';

const Cases = () => {
    const [view, setView] = useState('list'); // 'list' | 'create' | 'detail'
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('All');
    const navigate = useNavigate();

    // Create Page State
    const [titleInput, setTitleInput] = useState('');
    const [descInput, setDescInput] = useState('');
    const [walletInput, setWalletInput] = useState('');
    const [walletsList, setWalletsList] = useState([]);

    // Detail View State
    const [selectedCase, setSelectedCase] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [newWalletDetail, setNewWalletDetail] = useState('');

    // Evidence Form State
    const [evWallet, setEvWallet] = useState('');
    const [evRiskScore, setEvRiskScore] = useState(50);
    const [evSnapshot, setEvSnapshot] = useState('');

    // Annotation Modal State
    const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
    const [annotationTarget, setAnnotationTarget] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (!user) {
                setError("Security Protocol: You must be authenticated to view forensic cases.");
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, 'cases'),
                where('userId', '==', user.uid)
            );

            const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                const caseList = snapshot.docs.map(doc => ({
                    _id: doc.id,
                    ...doc.data()
                }));
                // Sort by createdAt desc locally (to handle string or serverTimestamp safely)
                caseList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setCases(caseList);
                setLoading(false);
                setError(null);

                // Keep detail view in sync if it's currently selected
                if (selectedCase) {
                    const currentCase = caseList.find(c => c._id === selectedCase._id);
                    if (currentCase) {
                        setSelectedCase(currentCase);
                    }
                }
            }, (err) => {
                setError(err.message);
                setLoading(false);
            });

            return () => unsubscribeSnapshot();
        });

        return () => unsubscribeAuth();
    }, [selectedCase]);

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this case?")) return;
        
        try {
            await deleteDoc(doc(db, 'cases', id));
            if (selectedCase && selectedCase._id === id) {
                setView('list');
                setSelectedCase(null);
            }
        } catch (err) {
            alert("Error deleting case: " + err.message);
        }
    };

    // Create Case Form handlers
    const addWalletToCreateForm = () => {
        if (!walletInput.trim()) return;
        if (!walletsList.includes(walletInput.trim())) {
            setWalletsList([...walletsList, walletInput.trim()]);
        }
        setWalletInput('');
    };

    const removeWalletFromCreateForm = (w) => {
        setWalletsList(walletsList.filter(item => item !== w));
    };

    const handleCreateCase = async (e) => {
        e.preventDefault();
        if (!titleInput.trim() || !descInput.trim()) {
            alert("Please provide both case title and description.");
            return;
        }

        try {
            const initialTimeline = walletsList.map(w => ({
                id: Math.random().toString(36).substring(2),
                event: "Wallet Added",
                detail: `Wallet address ${w} added during initialization`,
                timestamp: new Date().toISOString()
            }));

            const newCaseData = {
                caseId: `CASE-${Date.now().toString().slice(-6)}`,
                title: titleInput.trim(),
                description: descInput.trim(),
                createdAt: new Date().toISOString(),
                userId: auth.currentUser.uid,
                status: "open",
                wallets: walletsList,
                notes: [],
                evidence: [],
                timeline: [
                    {
                        id: Math.random().toString(36).substring(2),
                        event: "Analysis Run",
                        detail: "Case workspace initialized and forensic logging started.",
                        timestamp: new Date().toISOString()
                    },
                    ...initialTimeline
                ]
            };

            await addDoc(collection(db, 'cases'), newCaseData);

            // Reset create state
            setTitleInput('');
            setDescInput('');
            setWalletsList([]);
            setWalletInput('');
            setView('list');
        } catch (err) {
            alert("Error creating case: " + err.message);
        }
    };

    // Detail Workspace handlers
    const updateCaseStatus = async (newStatus) => {
        if (!selectedCase) return;
        try {
            const ref = doc(db, 'cases', selectedCase._id);
            const timelineEv = {
                id: Math.random().toString(36).substring(2),
                event: "Analysis Run",
                detail: `Investigation status changed to: ${newStatus.toUpperCase()}`,
                timestamp: new Date().toISOString()
            };

            await updateDoc(ref, {
                status: newStatus,
                timeline: [timelineEv, ...(selectedCase.timeline || [])]
            });
        } catch (err) {
            alert("Error updating status: " + err.message);
        }
    };

    const addWalletToWorkspace = async (e) => {
        e.preventDefault();
        if (!newWalletDetail.trim() || !selectedCase) return;
        const w = newWalletDetail.trim();

        if (selectedCase.wallets && selectedCase.wallets.includes(w)) {
            alert("This wallet is already added to the case.");
            return;
        }

        try {
            const ref = doc(db, 'cases', selectedCase._id);
            const timelineEv = {
                id: Math.random().toString(36).substring(2),
                event: "Wallet Added",
                detail: `Investigation workspace updated with target address: ${w}`,
                timestamp: new Date().toISOString()
            };

            await updateDoc(ref, {
                wallets: [...(selectedCase.wallets || []), w],
                timeline: [timelineEv, ...(selectedCase.timeline || [])]
            });

            setNewWalletDetail('');
        } catch (err) {
            alert("Error adding wallet: " + err.message);
        }
    };

    const addNoteToWorkspace = async (e) => {
        e.preventDefault();
        if (!newNote.trim() || !selectedCase) return;

        try {
            const ref = doc(db, 'cases', selectedCase._id);
            const noteObj = {
                id: Math.random().toString(36).substring(2),
                content: newNote.trim(),
                timestamp: new Date().toISOString()
            };

            const timelineEv = {
                id: Math.random().toString(36).substring(2),
                event: "Report Generated",
                detail: `Forensic note logged to investigation dossier.`,
                timestamp: new Date().toISOString()
            };

            await updateDoc(ref, {
                notes: [noteObj, ...(selectedCase.notes || [])],
                timeline: [timelineEv, ...(selectedCase.timeline || [])]
            });

            setNewNote('');
        } catch (err) {
            alert("Error saving note: " + err.message);
        }
    };

    const addEvidenceToWorkspace = async (e) => {
        e.preventDefault();
        if (!evWallet || !selectedCase) {
            alert("Please select a target wallet address.");
            return;
        }

        try {
            const ref = doc(db, 'cases', selectedCase._id);
            const evObj = {
                id: Math.random().toString(36).substring(2),
                wallet: evWallet,
                riskScore: parseInt(evRiskScore, 10),
                transactionsSnapshot: evSnapshot || 'No recorded snapshots available.',
                timestamp: new Date().toISOString()
            };

            const timelineEv = {
                id: Math.random().toString(36).substring(2),
                event: "Report Generated",
                detail: `Forensic evidence and risk analysis recorded for ${evWallet}`,
                timestamp: new Date().toISOString()
            };

            await updateDoc(ref, {
                evidence: [evObj, ...(selectedCase.evidence || [])],
                timeline: [timelineEv, ...(selectedCase.timeline || [])]
            });

            // Reset form
            setEvWallet('');
            setEvRiskScore(50);
            setEvSnapshot('');
        } catch (err) {
            alert("Error logging evidence: " + err.message);
        }
    };

    const saveAnnotationToCase = async (annotationData) => {
        if (!selectedCase || !annotationTarget) return;

        try {
            const ref = doc(db, 'cases', selectedCase._id);
            const timelineEv = {
                id: Math.random().toString(36).substring(2),
                event: "Report Generated",
                detail: `Annotation Applied: ${annotationData.label} (${annotationData.confidence}% confidence) tagged to node ${annotationTarget.substring(0, 8)}...`,
                timestamp: new Date().toISOString()
            };

            // Attach annotation to specific evidence entry if available, or general notes
            const noteObj = {
                id: Math.random().toString(36).substring(2),
                content: `[ANNOTATION: ${annotationData.label}] Node: ${annotationTarget}. Confidence: ${annotationData.confidence}%. Notes: ${annotationData.notes}`,
                timestamp: new Date().toISOString()
            };

            await updateDoc(ref, {
                notes: [noteObj, ...(selectedCase.notes || [])],
                timeline: [timelineEv, ...(selectedCase.timeline || [])]
            });
        } catch (err) {
            alert("Error logging annotation: " + err.message);
        }
    };

    const handleRunAnalysis = (wallet) => {
        const timelineEv = {
            id: Math.random().toString(36).substring(2),
            event: "Analysis Run",
            detail: `Active threat scan and node trace initiated for ${wallet}`,
            timestamp: new Date().toISOString()
        };

        if (selectedCase) {
            const ref = doc(db, 'cases', selectedCase._id);
            updateDoc(ref, {
                timeline: [timelineEv, ...(selectedCase.timeline || [])]
            });
        }

        navigate(`/tools/analyzer?wallet=${wallet}`);
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.caseId || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'All' || c.status === filterRisk.toLowerCase();
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* ════════════════════════════════════════
                        CASE LIST VIEW
                    ════════════════════════════════════════ */}
                    {view === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                                            <Briefcase size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">Intelligence Workspace</span>
                                            </div>
                                            <h1 className="text-4xl font-black text-white tracking-tight">Investigation Workspace</h1>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm">Create and manage multi-wallet investigations, record evidence, and track trace timelines.</p>
                                </div>

                                <button
                                    onClick={() => setView('create')}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs tracking-widest px-6 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5"
                                >
                                    <PlusCircle size={18} />
                                    <span>Create Case</span>
                                </button>
                            </div>

                            {/* Search and Risk/Status Filtering */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search cases by Title or Case ID..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-[#0b0f19]/80 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm text-white"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {['All', 'Open', 'Review', 'Closed'].map(statusOption => (
                                        <button
                                            key={statusOption}
                                            onClick={() => setFilterRisk(statusOption)}
                                            className={`px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                                                filterRisk === statusOption 
                                                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                                                    : 'bg-[#0b0f19] text-slate-400 border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            {statusOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content List */}
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="animate-spin text-blue-500" size={48} />
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center text-sm font-semibold">
                                    {error}
                                </div>
                            ) : filteredCases.length === 0 ? (
                                <div className="text-center py-20 border border-white/5 rounded-[2.5rem] bg-[#0b0f19]/40 backdrop-blur-md">
                                    <Briefcase className="mx-auto text-slate-700 mb-4 animate-pulse" size={56} />
                                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">No Cases Found</h3>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">No active investigations match the applied filter.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCases.map(c => (
                                        <motion.div 
                                            key={c._id} 
                                            whileHover={{ y: -4 }}
                                            onClick={() => {
                                                setSelectedCase(c);
                                                setView('detail');
                                            }}
                                            className="bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 hover:bg-[#0b0f19]/70 transition-all cursor-pointer flex flex-col justify-between h-[280px] shadow-lg hover:shadow-2xl hover:shadow-blue-500/5 select-none"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
                                                        {c.caseId || 'CASE-ID'}
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border ${
                                                        c.status === 'open' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                                                        c.status === 'review' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                                        'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                                    }`}>
                                                        {c.status || 'open'}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-black text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-wide">
                                                    {c.title}
                                                </h3>
                                                <p className="text-slate-500 text-xs font-medium mb-4 line-clamp-2 h-[34px]">
                                                    {c.description}
                                                </p>
                                            </div>
                                            
                                            <div className="border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-center text-xs text-slate-500">
                                                    <div className="flex gap-4">
                                                        <span className="flex items-center gap-1 font-semibold">
                                                            <Shield size={13} className="text-blue-400" />
                                                            {c.wallets?.length || 0} Target Wallets
                                                        </span>
                                                        <span className="flex items-center gap-1 font-semibold">
                                                            <StickyNote size={13} className="text-purple-400" />
                                                            {c.notes?.length || 0} Notes
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => handleDelete(c._id, e)}
                                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
                                                        title="Delete Case"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ════════════════════════════════════════
                        CREATE CASE VIEW
                    ════════════════════════════════════════ */}
                    {view === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="max-w-3xl mx-auto space-y-8"
                        >
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <button
                                    onClick={() => setView('list')}
                                    className="p-3.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-slate-300 transition-all hover:bg-white/10"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">Operations Initialization</span>
                                    </div>
                                    <h1 className="text-3xl font-black text-white tracking-tight">Create Forensic Case</h1>
                                </div>
                            </div>

                            <form onSubmit={handleCreateCase} className="space-y-6 bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Case Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Asset Recovery Trace (Ops Shadow)" 
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        className="w-full bg-[#0b0f19] border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-semibold text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Case Description</label>
                                    <textarea 
                                        placeholder="Outline background intelligence and investigation scope..." 
                                        value={descInput}
                                        onChange={(e) => setDescInput(e.target.value)}
                                        rows={4}
                                        className="w-full bg-[#0b0f19] border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium text-white"
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Add Target Wallets</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter wallet address (0x...)" 
                                            value={walletInput}
                                            onChange={(e) => setWalletInput(e.target.value)}
                                            className="flex-1 bg-[#0b0f19] border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-mono text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={addWalletToCreateForm}
                                            className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg"
                                        >
                                            Add Wallet
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
                                        {walletsList.map((w) => (
                                            <span 
                                                key={w} 
                                                className="font-mono text-xs text-white bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2"
                                            >
                                                {w.substring(0, 8)}...{w.substring(w.length - 8)}
                                                <button
                                                    type="button"
                                                    onClick={() => removeWalletFromCreateForm(w)}
                                                    className="text-red-400 hover:text-red-300 font-bold ml-1 text-base leading-none select-none"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                        {walletsList.length === 0 && (
                                            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider italic">No target wallets added yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5"
                                    >
                                        Initialize Case Workspace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView('list')}
                                        className="px-6 bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* ════════════════════════════════════════
                        CASE DETAIL / WORKSPACE VIEW
                    ════════════════════════════════════════ */}
                    {view === 'detail' && selectedCase && (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-8"
                        >
                            {/* Breadcrumbs and Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setView('list')}
                                        className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl text-slate-300 transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
                                                {selectedCase.caseId || 'UID-PENDING'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">Investigation Workspace</span>
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-black text-white tracking-tight uppercase tracking-wide">
                                            {selectedCase.title}
                                        </h1>
                                        <p className="text-slate-400 font-medium text-sm mt-1">{selectedCase.description}</p>
                                    </div>
                                </div>

                                    <div className="flex items-center gap-3">
                                    {/* PDF Export Logic */}
                                    <PDFDownloadLink 
                                        document={
                                            <ForensicReportPDF 
                                                data={{
                                                    caseUid: selectedCase.caseId || 'SYSTEM-DF',
                                                    caseTitle: selectedCase.title,
                                                    wallet: selectedCase.wallets?.[0] || 'Aggregate Analysis',
                                                    riskScore: 85,
                                                    narrative: selectedCase.description + "\n\nTotal case notes: " + (selectedCase.notes?.length || 0),
                                                    transactions: selectedCase.evidence?.map(e => ({ time: new Date(e.timestamp).toLocaleDateString(), hash: e.wallet, amount: 'N/A', flag: e.riskScore > 70 ? 'CRITICAL' : 'WARNING' }))
                                                }} 
                                            />
                                        } 
                                        fileName={`FORENSIC_CASE_${selectedCase.caseId || 'NEW'}.pdf`}
                                    >
                                        {({ loading }) => (
                                            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">
                                                <Download size={14} />
                                                {loading ? 'Generating...' : 'Export PDF'}
                                            </button>
                                        )}
                                    </PDFDownloadLink>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-center">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                                    <div className="flex bg-[#0b0f19] border border-white/5 rounded-2xl p-1 gap-1">
                                        {['open', 'review', 'closed'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => updateCaseStatus(s)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    selectedCase.status === s
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Operational Grid Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Column 1: Wallets & Add */}
                                <div className="space-y-6">
                                    <div className="bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6 min-h-[440px]">
                                        <div className="flex items-center gap-2">
                                            <Shield size={18} className="text-blue-400" />
                                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Investigated Wallets</h2>
                                        </div>

                                        <form onSubmit={addWalletToWorkspace} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="0x... or ENS"
                                                value={newWalletDetail}
                                                onChange={(e) => setNewWalletDetail(e.target.value)}
                                                className="flex-1 bg-[#0b0f19] border border-white/5 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500/50 transition-all font-mono text-white"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Add
                                            </button>
                                        </form>

                                        <div className="space-y-3 h-[280px] overflow-y-auto pr-1">
                                            {selectedCase.wallets && selectedCase.wallets.map((w, index) => (
                                                <div 
                                                    key={index}
                                                    className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex items-center justify-between hover:bg-white/10 hover:border-white/10 transition-all"
                                                >
                                                    <span className="font-mono text-xs text-white">
                                                        {w.substring(0, 8)}...{w.substring(w.length - 8)}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => {
                                                                setAnnotationTarget(w);
                                                                setIsAnnotationModalOpen(true);
                                                            }}
                                                            className="flex items-center gap-1 bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border border-white/5"
                                                            title="Add Annotation"
                                                        >
                                                            <Tag size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRunAnalysis(w)}
                                                            className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                                                        >
                                                            <Activity size={12} /> Scan
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!selectedCase.wallets || selectedCase.wallets.length === 0) && (
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider italic text-center py-10">No target wallets mapped to case.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline Workspace */}
                                    <div className="bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6">
                                        <div className="flex items-center gap-2">
                                            <Activity size={18} className="text-emerald-400" />
                                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Investigation Timeline</h2>
                                        </div>

                                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                                            {selectedCase.timeline && selectedCase.timeline.map((ev, index) => (
                                                <div key={ev.id || index} className="relative pl-6 border-l border-white/10 pb-4 last:pb-0 last:border-0">
                                                    <div className="absolute top-1 -left-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900" />
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        <span className={
                                                            ev.event === 'Analysis Run' ? 'text-amber-400' :
                                                            ev.event === 'Wallet Added' ? 'text-emerald-400' : 'text-blue-400'
                                                        }>{ev.event}</span>
                                                        <span className="text-slate-600 font-medium">
                                                            {new Date(ev.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-300 text-xs font-medium leading-relaxed">
                                                        {ev.detail}
                                                    </p>
                                                </div>
                                            ))}
                                            {(!selectedCase.timeline || selectedCase.timeline.length === 0) && (
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider italic text-center py-4">No events logged yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Evidence Dossier */}
                                <div className="space-y-6">
                                    <div className="bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6 min-h-[440px]">
                                        <div className="flex items-center gap-2">
                                            <Paperclip size={18} className="text-emerald-400" />
                                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Evidence Dossier</h2>
                                        </div>

                                        {/* Evidence input form */}
                                        <form onSubmit={addEvidenceToWorkspace} className="space-y-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Wallet</label>
                                                <select
                                                    value={evWallet}
                                                    onChange={(e) => setEvWallet(e.target.value)}
                                                    className="w-full bg-[#0b0f19] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
                                                >
                                                    <option value="">Select Address</option>
                                                    {selectedCase.wallets && selectedCase.wallets.map(w => (
                                                        <option key={w} value={w}>{w}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>Risk Threat Score</span>
                                                    <span className="text-blue-400 text-xs font-black">{evRiskScore}%</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="100" 
                                                    value={evRiskScore}
                                                    onChange={(e) => setEvRiskScore(e.target.value)}
                                                    className="w-full accent-blue-600 h-1 rounded-lg"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Snapshot & Description</label>
                                                <textarea 
                                                    placeholder="Log transaction data, patterns, and anomalies..." 
                                                    value={evSnapshot}
                                                    onChange={(e) => setEvSnapshot(e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-[#0b0f19] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500/50"
                                                />
                                            </div>

                                            <button 
                                                type="submit"
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Log Evidence Item
                                            </button>
                                        </form>

                                        {/* Display logged evidence */}
                                        <div className="space-y-3 h-[220px] overflow-y-auto pr-1">
                                            {selectedCase.evidence && selectedCase.evidence.map((ev) => (
                                                <div key={ev.id} className="bg-[#0b0f19]/70 border border-white/5 p-3.5 rounded-xl space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-mono text-[11px] text-blue-400 font-bold bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded">
                                                            {ev.wallet.substring(0, 6)}...{ev.wallet.substring(ev.wallet.length - 4)}
                                                        </span>
                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                                            ev.riskScore >= 70 ? 'text-red-400 bg-red-500/10' :
                                                            ev.riskScore >= 40 ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'
                                                        }`}>
                                                            {ev.riskScore}% Threat
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-300 text-xs font-medium leading-relaxed">
                                                        {ev.transactionsSnapshot}
                                                    </p>
                                                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                                                        {new Date(ev.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!selectedCase.evidence || selectedCase.evidence.length === 0) && (
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider italic text-center py-10">No logged evidence items found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Forensic Notes */}
                                <div className="space-y-6">
                                    <div className="bg-[#0b0f19]/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6 min-h-[440px]">
                                        <div className="flex items-center gap-2">
                                            <StickyNote size={18} className="text-purple-400" />
                                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Forensic Dossier Notes</h2>
                                        </div>

                                        <form onSubmit={addNoteToWorkspace} className="space-y-3">
                                            <textarea
                                                placeholder="Record an investigation update or case detail..."
                                                rows={4}
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                className="w-full bg-[#0b0f19] border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            />
                                            <button
                                                type="submit"
                                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-2xl shadow-xl transition-all"
                                            >
                                                Log Internal Note
                                            </button>
                                        </form>

                                        <div className="space-y-3 h-[250px] overflow-y-auto pr-1">
                                            {selectedCase.notes && selectedCase.notes.map((note) => (
                                                <div key={note.id} className="bg-[#0b0f19] border border-white/5 p-4 rounded-2xl space-y-2">
                                                    <p className="text-slate-300 text-xs font-medium leading-relaxed">
                                                        {note.content}
                                                    </p>
                                                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                                                        {new Date(note.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!selectedCase.notes || selectedCase.notes.length === 0) && (
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider italic text-center py-10">No notes recorded yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Annotation Modal Instance */}
            <AnnotationModal 
                isOpen={isAnnotationModalOpen}
                onClose={() => setIsAnnotationModalOpen(false)}
                onSave={saveAnnotationToCase}
                entity={annotationTarget}
            />
        </div>
    );
};

export default Cases;
